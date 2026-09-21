"use client";

import React, {
    useEffect,
    useState,
} from "react";

type ValidatePinProps = {
    onVerified?: () => void;
};

type LockState = {
    lockedUntil: string;
    lockoutLevel: number;
};

export default function ValidatePin({
    onVerified,
}: ValidatePinProps) {

    const [pin, setPin] =
        useState("");

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [attemptsRemaining, setAttemptsRemaining] =
        useState<number | null>(null);

    const [lockState, setLockState] =
        useState<LockState | null>(null);

    const [escalationRequired, setEscalationRequired] =
        useState(false);

    const [remainingSeconds, setRemainingSeconds] =
        useState<number | null>(null);


    const handlePinChange = (
        value: string
    ) => {

        const digitsOnly =
            value
                .replace(/\D/g, "")
                .slice(0, 6);

        setPin(digitsOnly);
        setError("");
    };


    useEffect(() => {

        if (!lockState) {

            setRemainingSeconds(null);

            return;
        }


        const updateRemainingTime = () => {

            const lockedUntil =
                new Date(
                    lockState.lockedUntil
                ).getTime();

            const remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            lockedUntil -
                            Date.now()
                        ) / 1000
                    )
                );

            setRemainingSeconds(
                remaining
            );


            if (remaining === 0) {

                setLockState(null);

                setError("");

                setAttemptsRemaining(null);

                setPin("");
            }
        };


        updateRemainingTime();


        const timer =
            window.setInterval(
                updateRemainingTime,
                1000
            );


        return () =>
            window.clearInterval(
                timer
            );

    }, [lockState]);


    const formatRemainingTime = (
        seconds: number
    ) => {

        const minutes =
            Math.floor(
                seconds / 60
            );

        const remaining =
            seconds % 60;

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(remaining).padStart(
            2,
            "0"
        )}`;
    };


    const handleVerify = async () => {

        setError("");


        if (pin.length !== 6) {

            setError(
                "Please enter your 6-digit CareVR PIN."
            );

            return;
        }


        if (
            saving ||
            lockState ||
            escalationRequired
        ) {
            return;
        }


        setSaving(true);


        try {

            const response =
                await fetch(
                    "/api/security/validate-pin",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            pin,
                        }),
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                if (
                    result?.escalationRequired ===
                    true
                ) {

                    setEscalationRequired(
                        true
                    );

                    setPin("");

                    setAttemptsRemaining(
                        null
                    );

                    return;
                }


                if (
                    result?.locked === true &&
                    result?.lockedUntil
                ) {

                    setLockState({
                        lockedUntil:
                            result.lockedUntil,

                        lockoutLevel:
                            Number(
                                result.lockoutLevel ??
                                0
                            ),
                    });

                    setPin("");

                    setAttemptsRemaining(
                        null
                    );

                    setError("");

                    return;
                }


                if (
                    typeof result?.attemptsRemaining ===
                    "number"
                ) {

                    setAttemptsRemaining(
                        result.attemptsRemaining
                    );
                }


                throw new Error(
                    result?.error ||
                    "Incorrect CareVR PIN."
                );
            }


            setAttemptsRemaining(null);
            setPin("");


            if (onVerified) {
                onVerified();
            }


        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to verify your CareVR PIN."
            );

        } finally {

            setSaving(false);
        }
    };


    /*
     * =========================================================
     * RECOVERY
     * =========================================================
     */

    if (escalationRequired) {

        return (
            <main className="carevr-security-page">

                <div className="background-orb orb-one" />
                <div className="background-orb orb-two" />

                <div className="security-shell">

                    <SecurityHeader />


                    <section className="security-card">

                        <SecurityIcon
                            variant="recovery"
                        />


                        <div className="security-eyebrow">
                            ACCOUNT PROTECTION
                        </div>


                        <h1>
                            PIN Access Requires Recovery
                        </h1>


                        <p className="security-intro">
                            Your CareVR PIN access has been
                            locked after multiple unsuccessful
                            attempts.
                        </p>


                        <div
                            className="recovery-box"
                            role="alert"
                        >

                            <div className="recovery-symbol">
                                !
                            </div>

                            <div>

                                <strong>
                                    Your account remains protected.
                                </strong>

                                <p>
                                    Please contact support to
                                    regain access to your
                                    CareVR account.
                                </p>

                            </div>

                        </div>

                    </section>


                    <SecurityFooter />

                </div>


                <SecurityStyles />

            </main>
        );
    }


    /*
     * =========================================================
     * TEMPORARY LOCK
     * =========================================================
     */

    if (lockState) {

        const lockNumber =
            Math.min(
                3,
                Math.max(
                    1,
                    lockState.lockoutLevel
                )
            );


        const locksRemaining =
            Math.max(
                0,
                3 - lockNumber
            );


        const lockDescription =
            lockNumber === 3
                ? "This is your final temporary lock."
                : `${locksRemaining} more temporary lock${
                    locksRemaining === 1
                        ? ""
                        : "s"
                } available before recovery is required.`;


        return (
            <main className="carevr-security-page">

                <div className="background-orb orb-one" />
                <div className="background-orb orb-two" />

                <div className="security-shell">

                    <SecurityHeader />


                    <section className="security-card">

                        <SecurityIcon
                            variant="locked"
                        />


                        <div className="security-eyebrow">
                            TEMPORARY SECURITY LOCK
                        </div>


                        <h1>
                            PIN Temporarily Locked
                        </h1>


                        <p className="security-intro">
                            Too many incorrect PIN attempts.
                            Your account is temporarily protected.
                        </p>


                        <div className="timer-box">

                            <span>
                                TRY AGAIN IN
                            </span>

                            <strong>
                                {formatRemainingTime(
                                    remainingSeconds ??
                                    0
                                )}
                            </strong>

                        </div>


                        <div className="lock-status">

                            <div className="lock-status-header">

                                <span>
                                    Security lock
                                </span>

                                <strong>
                                    {lockNumber} of 3
                                </strong>

                            </div>


                            <div className="lock-track">

                                {[1, 2, 3].map(
                                    (level) => (

                                        <div
                                            key={level}
                                            className={
                                                level <=
                                                lockNumber
                                                    ? "lock-step active"
                                                    : "lock-step"
                                            }
                                        />

                                    )
                                )}

                            </div>

                        </div>


                        <p className="lock-description">
                            {lockDescription}
                        </p>


                        <div className="security-note">

                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>

                            <span>
                                Your CareVR account remains
                                protected while the temporary
                                lock is active.
                            </span>

                        </div>

                    </section>


                    <SecurityFooter />

                </div>


                <SecurityStyles />

            </main>
        );
    }


    /*
     * =========================================================
     * NORMAL EXISTING-PIN VERIFICATION
     * =========================================================
     */

    return (
        <main className="carevr-security-page">

            <div className="background-orb orb-one" />
            <div className="background-orb orb-two" />

            <div className="security-shell">

                <SecurityHeader />


                <section
                    className="security-card"
                    aria-labelledby="verify-pin-title"
                >

                    <SecurityIcon
                        variant="normal"
                    />


                    <div className="security-eyebrow">
                        SECURE ACCESS
                    </div>


                    <h1 id="verify-pin-title">
                        Enter Your CareVR PIN
                    </h1>


                    <p className="security-intro">
                        Enter your 6-digit PIN to continue
                        securely to CareVR.
                    </p>


                    <div className="verify-field">

                        <label htmlFor="carevr-pin">
                            CareVR PIN
                        </label>

                        <input
                            id="carevr-pin"
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={pin}
                            onChange={(event) =>
                                handlePinChange(
                                    event.target.value
                                )
                            }
                            disabled={saving}
                            aria-label="Enter your 6-digit CareVR PIN"
                            autoFocus
                        />

                        <span className="field-hint">
                            Enter all 6 digits
                        </span>

                    </div>


                    {error && (

                        <div
                            className="message message-error"
                            role="alert"
                            aria-live="polite"
                        >

                            <span className="message-symbol">
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {attemptsRemaining !== null &&
                        !error && (

                            <div
                                className="attempt-message"
                                role="status"
                                aria-live="polite"
                            >
                                {attemptsRemaining === 1
                                    ? "1 attempt remaining."
                                    : `${attemptsRemaining} attempts remaining.`}
                            </div>

                        )}


                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleVerify}
                        disabled={
                            saving ||
                            pin.length !== 6
                        }
                    >

                        <span>
                            {saving
                                ? "Verifying PIN..."
                                : "Verify PIN"}
                        </span>

                        {!saving && (

                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h13" />
                                <path d="m13 6 6 6-6 6" />
                            </svg>

                        )}

                    </button>


                    <div className="security-note">

                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>

                        <span>
                            Your CareVR PIN protects your
                            account and health information
                            across your devices.
                        </span>

                    </div>

                </section>


                <SecurityFooter />

            </div>


            <SecurityStyles />

        </main>
    );
}


/*
 * =========================================================
 * SHARED CAREVR HEADER
 * =========================================================
 */

function SecurityHeader() {

    return (
        <header className="security-header">

            <img
                src="/images/CareVR v1.0.png"
                alt="CareVR"
                className="carevr-logo"
            />

            <div className="security-tagline">
                <span>SIMPLE</span>
                <span>SECURE</span>
                <span>TOGETHER</span>
            </div>

        </header>
    );
}


/*
 * =========================================================
 * SHARED FOOTER
 * =========================================================
 */

function SecurityFooter() {

    return (
        <p className="security-footer">
            Care Today. A Healthier Tomorrow.
        </p>
    );
}


/*
 * =========================================================
 * SHARED SECURITY ICON
 * =========================================================
 */

function SecurityIcon({
    variant,
}: {
    variant:
        | "normal"
        | "locked"
        | "recovery";
}) {

    return (
        <div
            className={
                variant === "recovery"
                    ? "security-icon recovery-icon"
                    : "security-icon"
            }
            aria-hidden="true"
        >

            <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >

                <rect
                    x="3"
                    y="11"
                    width="18"
                    height="10"
                    rx="2"
                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                <path d="M12 15v2" />

            </svg>

        </div>
    );
}


/*
 * =========================================================
 * SHARED STYLES
 * =========================================================
 */

function SecurityStyles() {

    return (
        <style jsx>{`

            .carevr-security-page {
                min-height: 100vh;
                min-height: 100dvh;

                position: relative;
                overflow: hidden;

                background:
                    linear-gradient(
                        135deg,
                        #f7f4ff 0%,
                        #eeeaff 48%,
                        #e8e5ff 100%
                    );

                color: #182344;
            }


            .background-orb {
                position: fixed;
                border-radius: 50%;
                pointer-events: none;

                background:
                    rgba(
                        99,
                        55,
                        210,
                        0.08
                    );
            }


            .orb-one {
                width: 380px;
                height: 380px;

                top: -200px;
                right: -100px;
            }


            .orb-two {
                width: 440px;
                height: 440px;

                bottom: -270px;
                left: -200px;

                background:
                    rgba(
                        81,
                        107,
                        218,
                        0.07
                    );
            }


            .security-shell {
                position: relative;
                z-index: 1;

                min-height: 100vh;
                min-height: 100dvh;

                display: flex;
                flex-direction: column;

                padding:
                    22px 34px 20px;
            }


            .security-header {
                width: 100%;

                display: flex;
                align-items: flex-start;
                justify-content: space-between;

                min-height: 76px;
            }


            .carevr-logo {
                width: 190px;
                height: 70px;

                object-fit: contain;
                object-position: left center;
            }


            .security-tagline {
                display: flex;
                flex-direction: column;

                padding-top: 6px;

                color: #6c7390;

                font-size: 11px;
                line-height: 1.55;

                font-weight: 750;

                letter-spacing: 2px;
            }


            .security-tagline::after {
                content: "";

                width: 40px;
                height: 3px;

                margin-top: 8px;

                border-radius: 4px;

                background: #6337d2;
            }


            .security-card {
                width: min(
                    590px,
                    calc(100% - 20px)
                );

                margin: auto;

                padding:
                    44px 48px 38px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.97
                    );

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.95
                    );

                border-radius: 28px;

                box-shadow:
                    0 28px 80px
                    rgba(
                        42,
                        28,
                        102,
                        0.17
                    );

                text-align: center;
            }


            .security-icon {
                width: 82px;
                height: 82px;

                margin:
                    0 auto 20px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                color: #6337d2;

                background:
                    linear-gradient(
                        145deg,
                        #f3efff,
                        #e9e3ff
                    );
            }


            .recovery-icon {
                color: #6337d2;
            }


            .security-eyebrow {
                margin-bottom: 8px;

                color: #7658ca;

                font-size: 11px;
                font-weight: 800;

                letter-spacing: 2px;
            }


            h1 {
                margin: 0;

                color: #1d2a52;

                font-size: 31px;
                line-height: 1.2;

                font-weight: 760;
            }


            .security-intro {
                max-width: 470px;

                margin:
                    13px auto 27px;

                color: #69718b;

                font-size: 16px;
                line-height: 1.55;
            }


            .verify-field {
                text-align: left;
            }


            label {
                display: block;

                margin-bottom: 8px;

                color: #2b365b;

                font-size: 14px;
                font-weight: 720;
            }


            input {
                width: 100%;
                height: 61px;

                box-sizing: border-box;

                padding:
                    0 18px;

                border:
                    1.5px solid
                    #d9d3ed;

                border-radius: 14px;

                background: #faf9ff;

                color: #22175a;

                font-size: 27px;
                font-weight: 700;

                letter-spacing: 11px;

                text-align: center;

                outline: none;

                transition:
                    border-color 0.18s ease,
                    box-shadow 0.18s ease,
                    background 0.18s ease;
            }


            input:focus {
                border-color:
                    #6337d2;

                background:
                    #ffffff;

                box-shadow:
                    0 0 0 4px
                    rgba(
                        99,
                        55,
                        210,
                        0.10
                    );
            }


            input:disabled {
                opacity: 0.6;
                cursor: wait;
            }


            .field-hint {
                display: block;

                margin-top: 6px;

                color: #8a91a8;

                font-size: 11px;
            }


            .message {
                display: flex;
                align-items: center;

                gap: 10px;

                margin-top: 17px;

                padding:
                    12px 14px;

                border-radius: 12px;

                font-size: 13px;

                text-align: left;
            }


            .message-symbol {
                width: 24px;
                height: 24px;

                flex: 0 0 24px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                font-weight: 800;
            }


            .message-error {
                background: #fff4f4;

                color: #9d3030;

                border:
                    1px solid
                    #f0d4d4;
            }


            .message-error .message-symbol {
                background: #c94b4b;
                color: #ffffff;
            }


            .attempt-message {
                margin-top: 11px;

                color: #7658ca;

                font-size: 13px;
                font-weight: 650;
            }


            .primary-button {
                width: 100%;

                min-height: 58px;

                margin-top: 21px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 12px;

                border: 0;
                border-radius: 15px;

                background:
                    linear-gradient(
                        135deg,
                        #6337d2,
                        #7549df
                    );

                color: #ffffff;

                font-size: 17px;
                font-weight: 750;

                cursor: pointer;

                box-shadow:
                    0 12px 27px
                    rgba(
                        99,
                        55,
                        210,
                        0.24
                    );

                transition:
                    transform 0.16s ease,
                    box-shadow 0.16s ease,
                    opacity 0.16s ease;
            }


            .primary-button:hover:not(:disabled) {
                transform:
                    translateY(-1px);

                box-shadow:
                    0 15px 31px
                    rgba(
                        99,
                        55,
                        210,
                        0.29
                    );
            }


            .primary-button:disabled {
                opacity: 0.52;
                cursor: not-allowed;
                box-shadow: none;
            }


            .security-note {
                display: flex;
                align-items: center;

                gap: 11px;

                margin-top: 21px;

                padding:
                    14px 15px;

                border-radius: 14px;

                background:
                    #f6f3ff;

                color: #69718b;

                font-size: 12px;
                line-height: 1.5;

                text-align: left;
            }


            .security-note svg {
                flex: 0 0 auto;
                color: #6337d2;
            }


            .security-footer {
                margin:
                    0 auto;

                color: #8a90aa;

                font-size: 12px;
            }


            /*
             * TEMPORARY LOCK
             */

            .timer-box {
                margin:
                    20px auto 23px;

                padding:
                    20px;

                border-radius: 18px;

                background:
                    linear-gradient(
                        145deg,
                        #f5f1ff,
                        #ede8ff
                    );

                border:
                    1px solid
                    #e4dcfa;
            }


            .timer-box span {
                display: block;

                margin-bottom: 5px;

                color: #777e9a;

                font-size: 10px;
                font-weight: 800;

                letter-spacing: 2px;
            }


            .timer-box strong {
                display: block;

                color: #6337d2;

                font-size: 42px;
                line-height: 1.1;

                letter-spacing: 2px;
            }


            .lock-status {
                margin-bottom: 18px;
            }


            .lock-status-header {
                display: flex;
                align-items: center;
                justify-content: space-between;

                margin-bottom: 8px;

                color: #69718c;

                font-size: 12px;
            }


            .lock-status-header strong {
                color: #4e5673;
            }


            .lock-track {
                display: grid;

                grid-template-columns:
                    repeat(3, 1fr);

                gap: 6px;
            }


            .lock-step {
                height: 6px;

                border-radius: 8px;

                background:
                    #e6e1f1;
            }


            .lock-step.active {
                background:
                    linear-gradient(
                        90deg,
                        #6337d2,
                        #8060e2
                    );
            }


            .lock-description {
                margin:
                    0 0 20px;

                color: #68718d;

                font-size: 14px;
                line-height: 1.5;
            }


            /*
             * RECOVERY
             */

            .recovery-box {
                display: flex;
                align-items: flex-start;

                gap: 14px;

                padding:
                    17px 18px;

                border-radius: 16px;

                background:
                    #f7f4ff;

                border:
                    1px solid
                    #e6defc;

                text-align: left;
            }


            .recovery-symbol {
                width: 30px;
                height: 30px;

                flex: 0 0 30px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                background:
                    #6337d2;

                color: #ffffff;

                font-weight: 800;
            }


            .recovery-box strong {
                display: block;

                margin-bottom: 4px;

                color: #27325a;

                font-size: 14px;
            }


            .recovery-box p {
                margin: 0;

                color: #68718d;

                font-size: 14px;
                line-height: 1.5;
            }


            @media (max-width: 650px) {

                .security-shell {
                    padding:
                        12px 16px 18px;
                }


                .security-header {
                    min-height: 62px;
                }


                .carevr-logo {
                    width: 145px;
                    height: 56px;
                }


                .security-tagline {
                    font-size: 9px;
                    letter-spacing: 1.5px;
                }


                .security-card {
                    width: 100%;

                    padding:
                        32px 20px 28px;

                    border-radius: 22px;
                }


                .security-icon {
                    width: 70px;
                    height: 70px;
                }


                h1 {
                    font-size: 27px;
                }


                .security-intro {
                    font-size: 15px;
                }


                input {
                    height: 57px;

                    font-size: 24px;

                    letter-spacing: 8px;
                }


                .timer-box strong {
                    font-size: 36px;
                }


                .security-footer {
                    margin-top: 17px;
                }
            }

        `}</style>
    );
}
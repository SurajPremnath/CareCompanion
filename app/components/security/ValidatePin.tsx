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

    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

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
            window.clearInterval(timer);

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

        return `${String(
            minutes
        ).padStart(2, "0")}:${String(
            remaining
        ).padStart(2, "0")}`;
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
            <main className="carevr-pin-page">

                <div className="background-shape background-shape-one" />
                <div className="background-shape background-shape-two" />

                <div className="page-shell">

                    <header className="brand-header">

                        <img
                            src="/images/CareVR v1.0.png"
                            alt="CareVR"
                            className="carevr-logo"
                        />

                        <div className="brand-message">
                            <span>People</span>
                            <span>Health</span>
                            <span>Together</span>
                        </div>

                    </header>

                    <section className="pin-card">

                        <div className="eyebrow">
                            ACCOUNT PROTECTION
                        </div>

                        <div className="state-icon state-icon-warning">
                            !
                        </div>

                        <h1>
                            PIN Access Requires Recovery
                        </h1>

                        <p className="intro">
                            Your CareVR PIN access has been
                            locked after multiple unsuccessful
                            attempts.
                        </p>

                        <div className="recovery-note">

                            <div className="recovery-icon">
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

                    <Footer />

                </div>

                <PageStyles />
            </main>
        );
    }

    /*
     * =========================================================
     * TEMPORARY LOCK
     * =========================================================
     */

    if (lockState) {

        const level =
            Math.min(
                Math.max(
                    lockState.lockoutLevel,
                    1
                ),
                3
            );

        return (
            <main className="carevr-pin-page">

                <div className="background-shape background-shape-one" />
                <div className="background-shape background-shape-two" />

                <div className="page-shell">

                    <header className="brand-header">

                        <img
                            src="/images/CareVR v1.0.png"
                            alt="CareVR"
                            className="carevr-logo"
                        />

                        <div className="brand-message">
                            <span>People</span>
                            <span>Health</span>
                            <span>Together</span>
                        </div>

                    </header>

                    <section className="pin-card">

                        <div className="eyebrow">
                            ACCOUNT PROTECTION
                        </div>

                        <div className="state-icon">
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="11"
                                    rx="2"
                                />

                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                        </div>

                        <h1>
                            PIN Temporarily Locked
                        </h1>

                        <p className="intro">
                            Too many incorrect attempts.
                            Your account remains protected.
                        </p>

                        <div className="timer-box">

                            <span>
                                TRY AGAIN IN
                            </span>

                            <strong>
                                {remainingSeconds !== null
                                    ? formatRemainingTime(
                                        remainingSeconds
                                    )
                                    : "--:--"}
                            </strong>

                        </div>

                        <div className="lock-progress">

                            <div className="progress-label">
                                <span>
                                    Security lock
                                </span>

                                <strong>
                                    {level} of 3
                                </strong>
                            </div>

                            <div className="progress-track">

                                {[1, 2, 3].map(
                                    (step) => (
                                        <span
                                            key={step}
                                            className={
                                                step <= level
                                                    ? "progress-step active"
                                                    : "progress-step"
                                            }
                                        />
                                    )
                                )}

                            </div>

                        </div>

                        <p className="lock-description">
                            After the timer ends, you can
                            return to PIN verification.
                        </p>

                        <div className="security-note">

                            <div className="security-icon">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 3l8 4v5c0 4.8-3.1 7.7-8 9-4.9-1.3-8-4.2-8-9V7l8-4z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>

                            <div>
                                <strong>
                                    Your CareVR account is protected.
                                </strong>

                                <p>
                                    You do not need to take
                                    any action while the
                                    temporary lock is active.
                                </p>
                            </div>

                        </div>

                    </section>

                    <Footer />

                </div>

                <PageStyles />
            </main>
        );
    }

    /*
     * =========================================================
     * NORMAL VERIFY SCREEN
     * =========================================================
     */

    return (
        <main className="carevr-pin-page">

            <div className="background-shape background-shape-one" />
            <div className="background-shape background-shape-two" />

            <div className="page-shell">

                <header className="brand-header">

                    <img
                        src="/images/CareVR v1.0.png"
                        alt="CareVR"
                        className="carevr-logo"
                    />

                    <div className="brand-message">
                        <span>People</span>
                        <span>Health</span>
                        <span>Together</span>
                    </div>

                </header>

                <section
                    className="pin-card"
                    aria-labelledby="verify-pin-title"
                >

                    <div className="eyebrow">
                        SECURE ACCESS
                    </div>

                    <h1 id="verify-pin-title">
                        Enter Your CareVR PIN
                    </h1>

                    <p className="intro">
                        Enter your 6-digit PIN to continue
                        securely to CareVR.
                    </p>

                    <div className="field-group">

                        <label htmlFor="carevr-login-pin">
                            CareVR PIN
                        </label>

                        <input
                            id="carevr-login-pin"
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
                            aria-label="Enter 6-digit CareVR PIN"
                            className="pin-input"
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    void handleVerify();
                                }
                            }}
                            autoFocus
                        />

                    </div>

                    {attemptsRemaining !== null && (
                        <div className="attempt-message">
                            {attemptsRemaining === 1
                                ? "1 attempt remaining before temporary lock."
                                : `${attemptsRemaining} attempts remaining before temporary lock.`}
                        </div>
                    )}

                    {error && (
                        <div
                            className="message message-error"
                            role="alert"
                        >
                            <span className="message-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>
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
                                ? "Verifying..."
                                : "Verify PIN"}
                        </span>

                        {!saving && (
                            <span className="button-arrow">
                                →
                            </span>
                        )}
                    </button>

                    <div className="security-note">

                        <div className="security-icon">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M12 3l8 4v5c0 4.8-3.1 7.7-8 9-4.9-1.3-8-4.2-8-9V7l8-4z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>

                        <div>
                            <strong>
                                Your information remains protected.
                            </strong>

                            <p>
                                Your PIN works across your
                                trusted CareVR devices.
                            </p>
                        </div>

                    </div>

                </section>

                <Footer />

            </div>

            <PageStyles />
        </main>
    );
}

function Footer() {
    return (
        <footer className="page-footer">

            <div className="footer-tagline">
                Care Today.
                <br />
                A Healthier Tomorrow.
            </div>

            <div className="footer-center">
                SIMPLE
                <span>|</span>
                SECURE
                <span>|</span>
                TOGETHER

                <div className="footer-line" />
            </div>

        </footer>
    );
}

function PageStyles() {
    return (
        <style jsx>{`

            .carevr-pin-page {
                position: relative;
                min-height: 100vh;
                min-height: 100dvh;
                overflow: hidden;

                background:
                    linear-gradient(
                        135deg,
                        #f8faff 0%,
                        #f3f4ff 48%,
                        #eeeaff 100%
                    );

                color: #10204a;
            }

            .background-shape {
                position: absolute;
                pointer-events: none;
                border-radius: 50%;
            }

            .background-shape-one {
                width: 520px;
                height: 520px;
                top: -300px;
                right: -180px;

                background:
                    rgba(102, 74, 220, 0.08);
            }

            .background-shape-two {
                width: 620px;
                height: 360px;
                bottom: -260px;
                left: -220px;

                background:
                    rgba(77, 111, 235, 0.08);

                transform: rotate(-18deg);
            }

            .page-shell {
                position: relative;
                z-index: 1;

                width: 100%;
                min-height: 100vh;
                min-height: 100dvh;

                display: flex;
                flex-direction: column;

                padding:
                    22px
                    34px
                    18px;

                box-sizing: border-box;
            }

            .brand-header {
                width: 100%;

                display: flex;
                align-items: flex-start;
                justify-content: space-between;

                min-height: 110px;
            }

            .carevr-logo {
                width: 210px;
                height: 105px;

                object-fit: contain;
                object-position: left center;

                display: block;
            }

            .brand-message {
                display: flex;
                flex-direction: column;

                padding-top: 10px;

                color: #50628f;

                font-size: 14px;
                line-height: 1.25;
                font-weight: 600;
            }

            .pin-card {
                width: 100%;
                max-width: 570px;

                margin:
                    18px auto 0;

                padding:
                    42px
                    44px
                    38px;

                box-sizing: border-box;

                background:
                    rgba(255, 255, 255, 0.94);

                border-radius: 28px;

                box-shadow:
                    0 24px 70px
                    rgba(48, 44, 110, 0.14);

                text-align: center;

                backdrop-filter:
                    blur(12px);
            }

            .eyebrow {
                margin-bottom: 14px;

                color: #6337d2;

                font-size: 14px;
                line-height: 1.2;
                font-weight: 800;

                letter-spacing: 1.6px;
            }

            h1 {
                margin: 0;

                color: #10204a;

                font-size: 34px;
                line-height: 1.16;
                font-weight: 760;

                letter-spacing: -0.7px;
            }

            .intro {
                max-width: 455px;

                margin:
                    18px auto 32px;

                color: #52638d;

                font-size: 17px;
                line-height: 1.55;
            }

            .field-group {
                text-align: left;
            }

            label {
                display: block;

                margin-bottom: 8px;

                color: #17254d;

                font-size: 16px;
                font-weight: 700;
            }

            .pin-input {
                width: 100%;
                height: 64px;

                box-sizing: border-box;

                padding:
                    0
                    22px;

                border:
                    1px solid
                    #d5dcef;

                border-radius: 15px;

                background:
                    #f9faff;

                color: #152657;

                font-size: 28px;
                font-weight: 700;

                letter-spacing: 10px;

                text-align: center;

                outline: none;

                transition:
                    border-color 0.15s ease,
                    box-shadow 0.15s ease;
            }

            .pin-input:focus {
                border-color: #6337d2;

                box-shadow:
                    0 0 0 4px
                    rgba(99, 55, 210, 0.11);
            }

            .pin-input:disabled {
                opacity: 0.65;
                cursor: not-allowed;
            }

            .attempt-message {
                margin-top: 12px;

                color: #7254c7;

                font-size: 13px;
                font-weight: 650;

                text-align: left;
            }

            .message {
                display: flex;
                align-items: center;

                gap: 10px;

                margin-top: 18px;
                padding: 12px 14px;

                border-radius: 12px;

                font-size: 14px;
                line-height: 1.4;

                text-align: left;
            }

            .message-error {
                background: #fff5f5;
                border: 1px solid #f0d0d0;
                color: #9c3030;
            }

            .message-icon {
                width: 23px;
                height: 23px;

                flex: 0 0 23px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                background: #b33b3b;

                color: #ffffff;

                font-size: 13px;
                font-weight: 800;
            }

            .primary-button {
                width: 100%;
                min-height: 60px;

                margin-top: 24px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 12px;

                border: 0;
                border-radius: 16px;

                background:
                    linear-gradient(
                        135deg,
                        #5834e6,
                        #7b3fe4
                    );

                color: #ffffff;

                font-size: 17px;
                font-weight: 750;

                cursor: pointer;

                box-shadow:
                    0 13px 28px
                    rgba(91, 58, 218, 0.22);

                transition:
                    transform 0.15s ease,
                    box-shadow 0.15s ease,
                    opacity 0.15s ease;
            }

            .primary-button:hover:not(:disabled) {
                transform: translateY(-1px);

                box-shadow:
                    0 16px 32px
                    rgba(91, 58, 218, 0.28);
            }

            .primary-button:active:not(:disabled) {
                transform: translateY(0);
            }

            .primary-button:disabled {
                opacity: 0.48;
                cursor: not-allowed;
                box-shadow: none;
            }

            .button-arrow {
                font-size: 25px;
                line-height: 1;
            }

            .security-note {
                display: flex;
                align-items: center;

                gap: 13px;

                margin-top: 20px;

                padding:
                    15px
                    16px;

                border-radius: 15px;

                background:
                    #f4f7ff;

                color: #50618a;

                text-align: left;
            }

            .security-icon {
                width: 42px;
                height: 42px;

                flex: 0 0 42px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 12px;

                background:
                    #e6efff;

                color: #4275d8;
            }

            .security-note strong {
                display: block;

                margin-bottom: 2px;

                color: #263a6b;

                font-size: 13px;
            }

            .security-note p {
                margin: 0;

                font-size: 12px;
                line-height: 1.45;
            }

            .state-icon {
                width: 62px;
                height: 62px;

                margin:
                    6px
                    auto
                    18px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                background:
                    #edf1ff;

                color: #4b6fd4;
            }

            .state-icon-warning {
                background: #fff1f1;
                color: #b43b3b;

                font-size: 25px;
                font-weight: 800;
            }

            .timer-box {
                margin:
                    22px 0 22px;

                padding:
                    18px;

                border-radius: 18px;

                background:
                    linear-gradient(
                        145deg,
                        #f5f2ff,
                        #eeebff
                    );

                border:
                    1px solid
                    #e4def7;

                text-align: center;
            }

            .timer-box span {
                display: block;

                margin-bottom: 5px;

                color: #7c84a0;

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

            .lock-progress {
                text-align: left;
            }

            .progress-label {
                display: flex;
                justify-content: space-between;

                margin-bottom: 8px;

                color: #707991;

                font-size: 12px;
            }

            .progress-label strong {
                color: #505a76;
            }

            .progress-track {
                display: grid;

                grid-template-columns:
                    repeat(3, 1fr);

                gap: 6px;
            }

            .progress-step {
                height: 6px;

                border-radius: 8px;

                background:
                    #e3e5ee;
            }

            .progress-step.active {
                background:
                    linear-gradient(
                        90deg,
                        #5c38dd,
                        #8243e2
                    );
            }

            .lock-description {
                margin:
                    17px 0 0;

                color: #69738e;

                font-size: 14px;
                line-height: 1.5;
            }

            .recovery-note {
                display: flex;
                align-items: flex-start;

                gap: 13px;

                padding:
                    17px;

                border:
                    1px solid
                    #e8defb;

                border-radius: 16px;

                background:
                    #f7f4ff;

                text-align: left;
            }

            .recovery-icon {
                width: 30px;
                height: 30px;

                flex: 0 0 30px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                background: #b33b3b;

                color: #ffffff;

                font-weight: 800;
            }

            .recovery-note strong {
                display: block;

                margin-bottom: 4px;

                color: #27345b;

                font-size: 14px;
            }

            .recovery-note p {
                margin: 0;

                color: #68718d;

                font-size: 14px;
                line-height: 1.5;
            }

            .page-footer {
                width: 100%;

                margin-top: auto;
                padding-top: 25px;

                display: flex;
                align-items: flex-end;
                justify-content: space-between;
            }

            .footer-tagline {
                color: #7180a5;

                font-size: 14px;
                line-height: 1.35;
                font-style: italic;
            }

            .footer-center {
                color: #7080a9;

                font-size: 12px;
                font-weight: 700;

                letter-spacing: 1.7px;

                text-align: center;
            }

            .footer-center span {
                margin: 0 9px;
                color: #a1a9c0;
            }

            .footer-line {
                width: 38px;
                height: 3px;

                margin:
                    10px auto 0;

                border-radius: 5px;

                background:
                    linear-gradient(
                        90deg,
                        #5936df,
                        #833fe3
                    );
            }

            @media (max-width: 700px) {

                .page-shell {
                    padding:
                        14px
                        16px
                        16px;
                }

                .brand-header {
                    min-height: 82px;
                }

                .carevr-logo {
                    width: 160px;
                    height: 78px;
                }

                .brand-message {
                    padding-top: 6px;
                    font-size: 10px;
                }

                .pin-card {
                    margin-top: 8px;

                    padding:
                        32px
                        20px
                        28px;

                    border-radius: 23px;
                }

                h1 {
                    font-size: 28px;
                }

                .intro {
                    font-size: 15px;
                    margin-bottom: 26px;
                }

                .pin-input {
                    height: 60px;
                    font-size: 25px;
                    letter-spacing: 8px;
                }

                .timer-box strong {
                    font-size: 36px;
                }

                .page-footer {
                    padding-top: 18px;
                }

                .footer-tagline {
                    font-size: 11px;
                }

                .footer-center {
                    font-size: 9px;
                    letter-spacing: 1px;
                }

                .footer-center span {
                    margin: 0 4px;
                }
            }

        `}</style>
    );
}
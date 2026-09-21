"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    authService,
} from "@/lib/auth/authService";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";


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

    const router = useRouter();


    const [pin, setPin] =
        useState("");

const [showPin, setShowPin] =
    useState(false);

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


    const [accountMenuOpen, setAccountMenuOpen] =
        useState(false);


    const [careMode, setCareMode] =
        useState<MobileCareMode>("SELF");

const [userName, setUserName] =
    useState("CareVR");

    /*
     * =========================================================
     * PIN INPUT
     * =========================================================
     */

    const handlePinChange = (
        value: string
    ) => {

        const digitsOnly =
            value
                .replace(/\D/g, "")
                .slice(0, 6);

        setPin(digitsOnly);
        setError("");
        setAttemptsRemaining(null);
    };


useEffect(() => {
    const loadUserName = async () => {
        try {
            const user =
                await authService.getCurrentUser();

            const fullName =
                typeof user?.user_metadata?.full_name ===
                "string"
                    ? user.user_metadata.full_name.trim()
                    : "";

            if (fullName) {
                setUserName(fullName);
            }
        } catch (error) {
            console.error(
                "Unable to load authenticated user name.",
                error
            );
        }
    };

    void loadUserName();
}, []);



    /*
     * =========================================================
     * LOCK COUNTDOWN
     * =========================================================
     */

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

                setAttemptsRemaining(
                    null
                );

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


    /*
     * =========================================================
     * TIMER FORMAT
     * =========================================================
     */

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


    /*
     * =========================================================
     * VERIFY PIN
     * =========================================================
     */

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

                /*
                 * FINAL ESCALATION
                 */

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


                /*
                 * TEMPORARY LOCK
                 */

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


                /*
                 * FAILED ATTEMPT
                 */

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


            /*
             * SUCCESS
             */

            setAttemptsRemaining(
                null
            );

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
     * HEADER
     * =========================================================
     */

    const renderHeader = () => (

<MobileHeader
    careMode={careMode}
    onCareModeChange={setCareMode}
    userName={userName}
    showCareModeToggle={false}
    showSelfToggle={false}
    showFamilyToggle={false}
    showHomeButton={false}
    accountMenuOpen={accountMenuOpen}
    onAccountMenuToggle={() =>
        setAccountMenuOpen(
            (current) => !current
        )
    }
    consentGranted={false}
    canAddPatient={false}
    onAddPatient={() => {}}
    onCareVRJourney={() => {
        router.push("/carevr-journey");
    }}
    onHelp={() => {
        router.push("/help");
    }}
    onLogout={async () => {
        await authService.logout();
        router.replace("/login");
    }}
/>
    );


    /*
     * =========================================================
     * FINAL RECOVERY
     * =========================================================
     */

    if (escalationRequired) {

        return (

            <main className="pin-page">

                {renderHeader()}


                <section className="pin-content">

                    <div className="pin-card">

                        <div
                            className="security-icon recovery-icon"
                            aria-hidden="true"
                        >
                            <svg
                                width="30"
                                height="30"
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


                        <div className="eyebrow">
                            ACCOUNT PROTECTION
                        </div>


                        <h1>
                            PIN Access Requires Recovery
                        </h1>


                        <p className="intro">
                            Your CareVR PIN access has
                            been locked after multiple
                            unsuccessful attempts.
                        </p>


                        <div
                            className="recovery-panel"
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
                                    Please contact support
                                    to regain access to your
                                    CareVR account.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                <CareVRFooter />

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

            <main className="pin-page">

                {renderHeader()}


                <section className="pin-content">

                    <div className="pin-card">

                        <div
                            className="security-icon"
                            aria-hidden="true"
                        >
                            <svg
                                width="30"
                                height="30"
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


                        <div className="eyebrow">
                            TEMPORARY SECURITY LOCK
                        </div>


                        <h1>
                            PIN Temporarily Locked
                        </h1>


                        <p className="intro">
                            Too many incorrect PIN
                            attempts. Your account is
                            temporarily protected.
                        </p>


                        <div className="timer-panel">

                            <span>
                                TRY AGAIN IN
                            </span>

                            <strong>
                                {formatRemainingTime(
                                    remainingSeconds ?? 0
                                )}
                            </strong>

                        </div>


                        <div className="lock-progress">

                            <div className="lock-progress-heading">

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
                                                level <= lockNumber
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
                                width="21"
                                height="21"
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

                    </div>

                </section>


                <CareVRFooter />

            </main>
        );
    }


    /*
     * =========================================================
     * NORMAL VERIFY PIN SCREEN
     * =========================================================
     */

    return (

        <main className="pin-page">

            {renderHeader()}


            <section className="pin-content">

                <div
                    className="pin-card"
                    aria-labelledby="carevr-pin-title"
                >

                    <div
                        className="security-icon"
                        aria-hidden="true"
                    >
                        <svg
                            width="30"
                            height="30"
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


                    <div className="eyebrow">
                        SECURE ACCESS
                    </div>


                    <h1 id="carevr-pin-title">
                        Enter Your CareVR PIN
                    </h1>


                    <p className="intro">
                        Enter your 6-digit PIN to
                        continue securely to CareVR.
                    </p>


<div className="pin-field">

    <label
        htmlFor="carevr-pin"
    >
        CareVR PIN
    </label>


    <div className="pin-input-wrapper">

        <input
            id="carevr-pin"
            type={
                showPin
                    ? "text"
                    : "password"
            }
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
            autoFocus
            aria-label="Enter your 6-digit CareVR PIN"
        />


        <button
            type="button"
            className="pin-visibility-button"
            onClick={() =>
                setShowPin(
                    current => !current
                )
            }
            disabled={saving}
            aria-label={
                showPin
                    ? "Hide PIN"
                    : "Show PIN"
            }
            title={
                showPin
                    ? "Hide PIN"
                    : "Show PIN"
            }
        >
            {showPin ? (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            ) : (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.1 4.1M6.2 6.2C3.4 8.1 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.9 9.9a3 3 0 1 0 4.2 4.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>

    </div>

</div>





                    {error && (

                        <div
                            className="error-message"
                            role="alert"
                            aria-live="polite"
                        >

                            <span className="error-icon">
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
                        className="verify-button"
                        onClick={
                            handleVerify
                        }
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
                            <span className="arrow">
                                →
                            </span>
                        )}

                    </button>


                    <div className="security-note">

                        <svg
                            width="21"
                            height="21"
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

                </div>

            </section>


            <CareVRFooter />


            <style jsx>{`

                .pin-page {
                    min-height: 100dvh;
                    display: flex;
                    flex-direction: column;

                    background:
                        radial-gradient(
                            circle at 8% 12%,
                            rgba(
                                99,
                                55,
                                210,
                                0.07
                            ),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 92% 82%,
                            rgba(
                                81,
                                107,
                                218,
                                0.07
                            ),
                            transparent 28%
                        ),
                        #f8f9fc;

                    color: #15203d;
                }


                .pin-content {
                    flex: 1;
                    width: 100%;

                    box-sizing: border-box;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding:
                        24px
                        20px
                        30px;
                }


                .pin-card {
                    width: min(
                        100%,
                        480px
                    );

                    box-sizing: border-box;

                    padding:
                        38px
                        40px
                        34px;

                    border:
                        1px solid
                        rgba(
                            31,
                            41,
                            71,
                            0.07
                        );

                    border-radius: 24px;

                    background: #ffffff;

                    box-shadow:
                        0 20px 60px
                        rgba(
                            24,
                            20,
                            64,
                            0.10
                        );

                    text-align: center;
                }


                .security-icon {
                    width: 62px;
                    height: 62px;

                    margin:
                        0 auto 17px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    color: #6337d2;

                    background:
                        linear-gradient(
                            135deg,
                            #f1edff,
                            #e7e1ff
                        );
                }


                .recovery-icon {
                    color: #6337d2;
                }


                .eyebrow {
                    margin-bottom: 8px;

                    color: #7043d8;

                    font-size: 10px;
                    line-height: 1.2;

                    letter-spacing: 1.5px;
                    font-weight: 800;
                }


                h1 {
                    margin: 0;

                    color: #15203d;

                    font-size: 30px;
                    line-height: 1.18;

                    letter-spacing: -0.4px;

                    font-weight: 760;
                }


                .intro {
                    max-width: 390px;

                    margin:
                        13px auto 26px;

                    color: #68728a;

                    font-size: 14px;
                    line-height: 1.55;
                }


                .pin-field {
                    text-align: left;
                }


                .pin-field label {
                    display: block;

                    margin-bottom: 8px;

                    color: #293552;

                    font-size: 13px;
                    font-weight: 700;
                }


                .pin-field input {
                    width: 100%;
                    height: 58px;

                    box-sizing: border-box;

                    border:
                        1px solid
                        #d8dcea;

                    border-radius: 13px;

                    background: #fbfcff;

                    color: #17224a;

                    padding:
                        0 18px;

                    font-size: 24px;
                    font-weight: 700;

                    letter-spacing: 9px;

                    text-align: center;

                    outline: none;

                    transition:
                        border-color .16s ease,
                        box-shadow .16s ease;
                }


                .pin-field input:focus {
                    border-color:
                        #7043d8;

                    background: #ffffff;

                    box-shadow:
                        0 0 0 4px
                        rgba(
                            112,
                            67,
                            216,
                            0.10
                        );
                }


                .pin-field input:disabled {
                    opacity: .65;
                }



                .error-message {
                    margin-top: 14px;

                    padding:
                        10px
                        12px;

                    display: flex;
                    align-items: center;

                    gap: 9px;

                    border:
                        1px solid
                        #f1cece;

                    border-radius: 10px;

                    background: #fff6f6;

                    color: #9d3030;

                    font-size: 13px;
                    line-height: 1.4;

                    text-align: left;
                }


                .error-icon {
                    width: 20px;
                    height: 20px;

                    flex: 0 0 20px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    background: #c94444;

                    color: #ffffff;

                    font-size: 12px;
                    font-weight: 800;
                }


                .attempt-message {
                    margin-top: 12px;

                    color: #7043d8;

                    font-size: 12px;
                    font-weight: 700;
                }


                .verify-button {
                    width: 100%;

                    min-height: 54px;

                    margin-top: 21px;

                    padding:
                        0 20px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 10px;

                    border: 0;
                    border-radius: 13px;

                    background:
                        linear-gradient(
                            135deg,
                            #6337d2,
                            #7545df
                        );

                    color: #ffffff;

                    font-size: 16px;
                    font-weight: 750;

                    cursor: pointer;

                    box-shadow:
                        0 10px 24px
                        rgba(
                            99,
                            55,
                            210,
                            0.20
                        );

                    transition:
                        transform .15s ease,
                        box-shadow .15s ease,
                        opacity .15s ease;
                }


                .verify-button:hover:not(:disabled) {
                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 13px 28px
                        rgba(
                            99,
                            55,
                            210,
                            0.25
                        );
                }


                .verify-button:disabled {
                    opacity: .48;

                    cursor: not-allowed;

                    box-shadow: none;
                }


                .arrow {
                    font-size: 20px;
                    line-height: 1;
                }


                .security-note {
                    margin-top: 19px;

                    padding:
                        13px
                        14px;

                    display: flex;
                    align-items: flex-start;

                    gap: 10px;

                    border-radius: 12px;

                    background: #f5f8fd;

                    color: #68738b;

                    font-size: 11.5px;
                    line-height: 1.45;

                    text-align: left;
                }


                .security-note svg {
                    flex:
                        0 0 auto;

                    color: #416ed8;
                }


                .timer-panel {
                    margin:
                        20px 0 22px;

                    padding:
                        18px;

                    border:
                        1px solid
                        #e2daf8;

                    border-radius: 17px;

                    background:
                        linear-gradient(
                            135deg,
                            #f5f1ff,
                            #ede8ff
                        );
                }


                .timer-panel span {
                    display: block;

                    margin-bottom: 4px;

                    color: #777f98;

                    font-size: 9px;
                    font-weight: 800;

                    letter-spacing: 1.7px;
                }


                .timer-panel strong {
                    color: #6337d2;

                    font-size: 38px;
                    line-height: 1.1;

                    letter-spacing: 2px;
                }


                .lock-progress {
                    margin-bottom: 18px;
                }


                .lock-progress-heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    margin-bottom: 8px;

                    color: #737b91;

                    font-size: 11px;
                }


                .lock-progress-heading strong {
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

                    background: #e6e2ef;
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
                        0 0 18px;

                    color: #69728a;

                    font-size: 13px;
                    line-height: 1.5;
                }


                .recovery-panel {
                    display: flex;
                    align-items: flex-start;

                    gap: 12px;

                    padding:
                        15px;

                    border:
                        1px solid
                        #e2daf8;

                    border-radius: 14px;

                    background: #f7f4ff;

                    text-align: left;
                }


                .recovery-symbol {
                    width: 28px;
                    height: 28px;

                    flex:
                        0 0 28px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    background: #6337d2;

                    color: #ffffff;

                    font-size: 14px;
                    font-weight: 800;
                }


                .recovery-panel strong {
                    display: block;

                    margin-bottom: 3px;

                    color: #29345b;

                    font-size: 13px;
                }


                .recovery-panel p {
                    margin: 0;

                    color: #68718d;

                    font-size: 12px;
                    line-height: 1.45;
                }


                @media (max-width: 600px) {

                    .pin-content {
                        align-items: flex-start;

                        padding:
                            20px
                            14px
                            24px;
                    }


                    .pin-card {
                        width: 100%;

                        padding:
                            30px
                            20px
                            26px;

                        border-radius: 20px;
                    }


                    h1 {
                        font-size: 27px;
                    }


                    .intro {
                        font-size: 13.5px;
                    }


                    .pin-field input {
                        height: 54px;

                        font-size: 22px;

                        letter-spacing: 8px;
                    }


                    .verify-button {
                        min-height: 52px;
                    }
                }

            `}</style>

        </main>
    );
}
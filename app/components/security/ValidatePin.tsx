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


    /*
     * The server-provided lockedUntil
     * remains authoritative.
     *
     * The browser only calculates how
     * much time remains until that
     * server-defined timestamp.
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

        return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;

    };


    const handleVerify = async () => {

        setError("");

        if (pin.length !== 6) {

            setError(
                "Please enter your 6-digit PIN."
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
                        body:
                            JSON.stringify({
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
                    typeof
                        result?.attemptsRemaining ===
                    "number"
                ) {

                    setAttemptsRemaining(
                        result.attemptsRemaining
                    );
                }


                throw new Error(
                    result?.error ||
                    "Incorrect PIN."
                );
            }


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
                    : "Unable to verify your PIN."
            );

        } finally {

            setSaving(false);

        }

    };


    /*
     * Final escalation state.
     *
     * No PIN entry and no timer.
     */
    if (escalationRequired) {

        return (
            <div className="secure-access-page">

                <div className="secure-access-card">

                    <div
                        className="secure-access-icon"
                        aria-hidden="true"
                    >
                        🔒
                    </div>

                    <h1>
                        PIN Access Requires Recovery
                    </h1>

                    <p>
                        Your CareVR PIN access
                        has been locked after
                        multiple unsuccessful
                        attempts.
                    </p>

                    <div
                        className="form-error"
                        role="alert"
                    >
                        Please contact support
                        to regain access to
                        your CareVR account.
                    </div>

                </div>

            </div>
        );
    }


    /*
     * Temporary lock state.
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

        const lockDescription =
            lockNumber === 3
                ? "This is your final temporary lock."
                : `You have ${
                    3 - lockNumber
                } more temporary lock${
                    3 - lockNumber === 1
                        ? ""
                        : "s"
                } available.`;

        return (
            <div className="secure-access-page">

                <div className="secure-access-card">

                    <div
                        className="secure-access-icon"
                        aria-hidden="true"
                    >
                        🔒
                    </div>

                    <h1>
                        PIN Temporarily Locked
                    </h1>

                    <p>
                        Too many incorrect
                        PIN attempts.
                    </p>

                    <div
                        className="form-hint"
                        role="timer"
                        aria-live="polite"
                    >
                        You can try again in
                        <strong>
                            {" "}
                            {formatRemainingTime(
                                remainingSeconds ??
                                0
                            )}
                        </strong>
                    </div>

                    <p>
                        Lock {lockNumber} of 3
                    </p>

                    <p>
                        {lockDescription}
                    </p>

                    <p className="secure-access-support">
                        Your PIN remains protected
                        while the temporary lock
                        is active.
                    </p>

                </div>

            </div>
        );
    }


    /*
     * Normal PIN entry state.
     */
    return (
        <div className="secure-access-page">

            <div className="secure-access-card">

                <div
                    className="secure-access-icon"
                    aria-hidden="true"
                >
                    🔐
                </div>

                <h1>
                    Verify Your CareVR Account
                </h1>

                <p>
                    Enter your 6-digit CareVR PIN
                    to continue.
                </p>

                <div className="form-group">

                    <label htmlFor="carevr-pin">
                        CareVR PIN
                    </label>

                    <input
                        id="carevr-pin"
                        type="password"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={pin}
                        onChange={(event) =>
                            handlePinChange(
                                event.target.value
                            )
                        }
                        disabled={saving}
                        aria-label="CareVR PIN"
                    />

                </div>

                {error && (
                    <div
                        className="form-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {attemptsRemaining !== null && (
                    <div
                        className="form-hint"
                        role="status"
                    >
                        {attemptsRemaining === 1
                            ? "You have 1 attempt remaining."
                            : `You have ${attemptsRemaining} attempts remaining.`}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={
                        saving ||
                        pin.length !== 6
                    }
                    className="secure-access-button"
                >
                    {saving
                        ? "Verifying..."
                        : "Verify PIN"}
                </button>

                <p className="secure-access-support">
                    Your CareVR PIN protects access
                    to your account across your devices.
                </p>

            </div>

        </div>
    );
}
"use client";

import React, {
    useEffect,
    useState,
} from "react";

type PinLockoutScreenProps = {
    lockedUntil: string;
    lockoutLevel: number;
    onLockExpired: () => void;
};

export default function PinLockoutScreen({
    lockedUntil,
    lockoutLevel,
    onLockExpired,
}: PinLockoutScreenProps) {

    const [remainingSeconds, setRemainingSeconds] =
        useState<number>(0);

    useEffect(() => {

        let expired = false;

        const updateRemainingTime = () => {

            const lockedUntilTime =
                new Date(lockedUntil).getTime();

            const remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (lockedUntilTime - Date.now()) / 1000
                    )
                );

            setRemainingSeconds(remaining);

            if (
                remaining === 0 &&
                !expired
            ) {
                expired = true;
                onLockExpired();
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

    }, [lockedUntil, onLockExpired]);


    const formatRemainingTime = (
        seconds: number
    ) => {

        const minutes =
            Math.floor(seconds / 60);

        const remaining =
            seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remaining
        ).padStart(2, "0")}`;
    };


    const lockNumber =
        Math.min(
            3,
            Math.max(
                1,
                lockoutLevel
            )
        );


    const lockDuration =
        lockNumber === 1
            ? "1 minute"
            : lockNumber === 2
                ? "2 minutes"
                : "3 minutes";


    const lockDescription =
        lockNumber === 1
            ? "Your PIN has been temporarily locked after consecutive incorrect attempts."
            : lockNumber === 2
                ? "Your PIN has been temporarily locked again after another sequence of incorrect attempts."
                : "Your PIN has reached the final temporary security lock.";


    const locksRemaining =
        Math.max(
            0,
            3 - lockNumber
        );


    const nextStepMessage =
        lockNumber === 3
            ? "After this lock, further incorrect attempts will require account recovery."
            : `${locksRemaining} more temporary lock${
                locksRemaining === 1
                    ? ""
                    : "s"
            } available before recovery is required.`;


    return (
        <main className="pin-page">

            <section className="pin-content">

                <div className="pin-card pin-lockout-card">

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
                        {lockDescription}
                    </p>


                    <div
                        className="pin-lockout-timer"
                        role="timer"
                        aria-live="polite"
                    >
                        <span className="pin-lockout-timer-label">
                            TRY AGAIN IN
                        </span>

                        <strong>
                            {formatRemainingTime(
                                remainingSeconds
                            )}
                        </strong>
                    </div>


                    <div className="pin-lockout-details">

                        <div className="pin-lockout-detail">

                            <span>
                                Security lock
                            </span>

                            <strong>
                                {lockNumber} of 3
                            </strong>

                        </div>


                        <div className="pin-lockout-detail">

                            <span>
                                Current lock
                            </span>

                            <strong>
                                {lockDuration}
                            </strong>

                        </div>

                    </div>


                    <div
                        className="pin-lockout-notice"
                        role="status"
                    >
                        <div className="pin-lockout-notice-icon">
                            !
                        </div>

                        <p>
                            {nextStepMessage}
                        </p>

                    </div>


                    <p className="pin-lockout-footer">
                        Your CareVR account remains protected
                        while the temporary lock is active.
                    </p>

                </div>

            </section>

        </main>
    );
}
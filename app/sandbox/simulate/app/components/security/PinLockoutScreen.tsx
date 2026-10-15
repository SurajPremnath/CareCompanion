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


const PIN_LOCKOUT_STYLES = String.raw`

            .pin-lockout-content {
                flex: 1;

                width: 100%;

                box-sizing: border-box;

                display: flex;

                align-items: center;

                justify-content: center;

                padding:
                    28px
                    20px
                    36px;
            }


            .pin-lockout-card {
                width: min(
                    100%,
                    560px
                );

                box-sizing: border-box;

                padding:
                    38px
                    40px
                    34px;

                border:
                    1px solid
                    rgba(
                        112,
                        67,
                        216,
                        0.12
                    );

                border-radius: 28px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.88
                    );

                box-shadow:
                    0 24px 70px
                    rgba(
                        93,
                        55,
                        170,
                        0.14
                    );

                backdrop-filter:
                    blur(12px);

                text-align: center;
            }


            .pin-lockout-icon {
                width: 88px;
                height: 88px;

                margin:
                    0 auto 22px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 50%;

                color: #6337d2;

                background:
                    linear-gradient(
                        145deg,
                        #f0e8ff,
                        #e4d7ff
                    );

                border:
                    6px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.72
                    );

                box-shadow:
                    0 12px 30px
                    rgba(
                        112,
                        67,
                        216,
                        0.16
                    );
            }


            .pin-lockout-eyebrow {
                margin-bottom: 9px;

                color: #6337d2;

                font-size: 11px;

                line-height: 1.2;

                letter-spacing: 2px;

                font-weight: 800;
            }


            .pin-lockout-card h1 {
                margin: 0;

                color: #17245a;

                font-size: 34px;

                line-height: 1.18;

                letter-spacing: -0.7px;

                font-weight: 760;
            }


            .pin-lockout-description {
                max-width: 440px;

                margin:
                    14px auto 25px;

                color: #687394;

                font-size: 15px;

                line-height: 1.55;
            }


            .pin-lockout-timer {
                margin:
                    0 0 18px;

                padding:
                    18px
                    20px;

                border:
                    1px solid
                    rgba(
                        112,
                        67,
                        216,
                        0.10
                    );

                border-radius: 18px;

                background:
                    linear-gradient(
                        135deg,
                        #f4edff,
                        #eee5ff
                    );

                text-align: center;
            }


            .pin-lockout-timer span {
                display: block;

                margin-bottom: 5px;

                color: #6337d2;

                font-size: 10px;

                font-weight: 800;

                letter-spacing: 2px;
            }


            .pin-lockout-timer strong {
                display: block;

                color: #5624b7;

                font-size: 42px;

                line-height: 1.05;

                letter-spacing: 2px;

                font-weight: 780;
            }


            .pin-lockout-details {
                display: grid;

                grid-template-columns:
                    1fr
                    auto
                    1fr;

                align-items: center;

                min-height: 92px;

                padding:
                    12px
                    18px;

                border:
                    1px solid
                    #ece8f6;

                border-radius: 17px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.94
                    );

                box-shadow:
                    0 8px 25px
                    rgba(
                        40,
                        31,
                        80,
                        0.06
                    );

                text-align: left;
            }


            .pin-lockout-detail {
                display: flex;

                align-items: center;

                gap: 12px;

                min-width: 0;
            }


            .pin-lockout-detail-icon {
                width: 42px;
                height: 42px;

                flex:
                    0 0 42px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 13px;

                color: #6337d2;

                background: #f2ecff;
            }


            .pin-lockout-detail span {
                display: block;

                margin-bottom: 4px;

                color: #707993;

                font-size: 11px;

                line-height: 1.2;
            }


            .pin-lockout-detail strong {
                display: block;

                color: #202b5c;

                font-size: 19px;

                line-height: 1.2;

                font-weight: 750;
            }


            .pin-lockout-divider {
                width: 1px;

                height: 52px;

                margin:
                    0 18px;

                background: #e6e0f1;
            }


            .pin-lockout-notice {
                display: flex;

                align-items: center;

                gap: 13px;

                margin-top: 18px;

                padding:
                    15px
                    16px;

                border:
                    1px solid
                    rgba(
                        112,
                        67,
                        216,
                        0.10
                    );

                border-radius: 16px;

                background:
                    linear-gradient(
                        135deg,
                        #f2e9ff,
                        #eee4ff
                    );

                text-align: left;
            }


            .pin-lockout-notice-icon {
                width: 38px;
                height: 38px;

                flex:
                    0 0 38px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 50%;

                background: #7134c8;

                color: #ffffff;

                font-size: 18px;

                font-weight: 800;

                box-shadow:
                    0 7px 16px
                    rgba(
                        113,
                        52,
                        200,
                        0.20
                    );
            }


            .pin-lockout-notice p {
                margin: 0;

                color: #61349d;

                font-size: 13px;

                line-height: 1.45;

                font-weight: 600;
            }


            .pin-lockout-security-note {
                display: flex;

                align-items: center;

                justify-content: center;

                gap: 9px;

                margin-top: 21px;

                color: #66718d;

                font-size: 11.5px;

                line-height: 1.45;
            }


            .pin-lockout-security-icon {
                display: flex;

                align-items: center;

                justify-content: center;

                color: #6337d2;
            }


            @media (max-width: 600px) {

                .pin-lockout-content {
                    align-items: flex-start;

                    padding:
                        20px
                        14px
                        26px;
                }


                .pin-lockout-card {
                    padding:
                        30px
                        18px
                        24px;

                    border-radius: 23px;
                }


                .pin-lockout-icon {
                    width: 76px;
                    height: 76px;

                    margin-bottom: 18px;
                }


                .pin-lockout-card h1 {
                    font-size: 28px;
                }


                .pin-lockout-description {
                    font-size: 13.5px;

                    margin-bottom: 21px;
                }


                .pin-lockout-timer {
                    padding:
                        16px
                        12px;
                }


                .pin-lockout-timer strong {
                    font-size: 36px;
                }


                .pin-lockout-details {
                    padding:
                        10px
                        11px;

                    grid-template-columns:
                        1fr
                        1fr;

                    gap: 10px;
                }


                .pin-lockout-divider {
                    display: none;
                }


                .pin-lockout-detail {
                    gap: 9px;
                }


                .pin-lockout-detail-icon {
                    width: 38px;
                    height: 38px;

                    flex-basis: 38px;
                }


                .pin-lockout-detail strong {
                    font-size: 17px;
                }


                .pin-lockout-notice {
                    align-items: flex-start;
                }


            .pin-lockout-security-note {
                padding:
                    0 8px;

                font-size: 10.5px;
            }

            .pin-lockout-page .carevr-mobile-account-menu-section,
            .pin-lockout-page .carevr-mobile-account-menu-primary {
                display: none;
            }

            }

        }
`;

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
    <section className="pin-lockout-content">

        <div className="pin-lockout-card">

            <div
                className="pin-lockout-icon"
                aria-hidden="true"
            >
                <svg
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect
                        x="4"
                        y="10"
                        width="16"
                        height="11"
                        rx="2.5"
                    />

                    <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" />

                    <circle
                        cx="12"
                        cy="15.5"
                        r="1"
                    />

                    <path d="M12 16.5v2" />
                </svg>
            </div>


            <div className="pin-lockout-eyebrow">
                TEMPORARY SECURITY LOCK
            </div>


            <h1>
                PIN Temporarily Locked
            </h1>


            <p className="pin-lockout-description">
                {lockDescription}
            </p>


            <div
                className="pin-lockout-timer"
                role="timer"
                aria-live="polite"
            >

                <span>
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

                    <div className="pin-lockout-detail-icon">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="4"
                                y="10"
                                width="16"
                                height="10"
                                rx="2"
                            />

                            <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                    </div>

                    <div>
                        <span>
                            Security lock
                        </span>

                        <strong>
                            {lockNumber} of 3
                        </strong>
                    </div>

                </div>


                <div className="pin-lockout-divider" />


                <div className="pin-lockout-detail">

                    <div className="pin-lockout-detail-icon">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="M12 7v5l3 2" />
                        </svg>
                    </div>

                    <div>
                        <span>
                            Current lock
                        </span>

                        <strong>
                            {lockDuration}
                        </strong>
                    </div>

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


            <div className="pin-lockout-security-note">

                <div className="pin-lockout-security-icon">
                    <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />

                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </div>

                <span>
                    Your CareVR account remains protected
                    while the temporary lock is active.
                </span>

            </div>

        </div>


        <style
            dangerouslySetInnerHTML={{
                __html: PIN_LOCKOUT_STYLES,
            }}
        />

    </section>
    );
}
"use client";

import { useEffect, useState } from "react";

type AnimationStage =
    | "preparing"
    | "verifying"
    | "verified"
    | "dashboard"
    | "welcome";

const stages: {
    key: AnimationStage;
    title: string;
    description: string;
}[] = [
    {
        key: "preparing",
        title: "Preparing secure access",
        description: "Getting everything ready for you.",
    },
    {
        key: "verifying",
        title: "Verifying your PIN",
        description: "Checking your secure access.",
    },
    {
        key: "verified",
        title: "PIN verified",
        description: "Your secure access has been confirmed.",
    },
    {
        key: "dashboard",
        title: "Opening CareVR",
        description: "Taking you to your dashboard.",
    },
    {
        key: "welcome",
        title: "Welcome to CareVR",
        description: "Your care journey continues here.",
    },
];

function PreparingIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="handoffPrepSky"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#dceaff" />
                    <stop offset="55%" stopColor="#e9dcff" />
                    <stop offset="100%" stopColor="#f8d9f2" />
                </linearGradient>

                <linearGradient
                    id="handoffPrepMountain"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#91b8ed" />
                    <stop offset="100%" stopColor="#a979d5" />
                </linearGradient>

                <linearGradient
                    id="handoffPrepHeart"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#ef6cb7" />
                    <stop offset="100%" stopColor="#aa55dc" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="76"
                fill="url(#handoffPrepSky)"
                opacity="0.72"
            />

            <path
                d="M18 119 Q44 92 67 111 Q91 76 111 103 Q135 79 162 116 V145 H18Z"
                fill="url(#handoffPrepMountain)"
                opacity="0.72"
            />

            <path
                d="M20 130 Q48 110 73 128 Q99 104 120 122 Q143 103 160 126 V151 H20Z"
                fill="#8ba9d9"
                opacity="0.42"
            />

            <path
                d="M91 108
                   C77 119 70 129 76 139
                   C82 148 102 150 116 144
                   C127 139 130 132 123 127
                   C117 123 105 125 96 129"
                fill="none"
                stroke="rgba(255,255,255,0.92)"
                strokeWidth="7"
                strokeLinecap="round"
            />

            <path
                d="M90 96
                   C82 88 69 91 69 102
                   C69 114 83 122 90 127
                   C97 122 111 114 111 102
                   C111 91 98 88 90 96Z"
                fill="url(#handoffPrepHeart)"
            />
        </svg>
    );
}

function VerifyingIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="handoffShieldGlow">
                    <stop
                        offset="0%"
                        stopColor="#b98cff"
                        stopOpacity="0.9"
                    />
                    <stop
                        offset="65%"
                        stopColor="#7b6bea"
                        stopOpacity="0.38"
                    />
                    <stop
                        offset="100%"
                        stopColor="#6759dd"
                        stopOpacity="0"
                    />
                </radialGradient>

                <linearGradient
                    id="handoffShieldGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#6c8df2" />
                    <stop offset="52%" stopColor="#7558df" />
                    <stop offset="100%" stopColor="#a83fd2" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="72"
                fill="url(#handoffShieldGlow)"
            />

            <circle
                cx="90"
                cy="90"
                r="54"
                fill="#d8d1ff"
                opacity="0.48"
            />

            <path
                d="M90 36 L130 51 V79
                   C130 106 114 127 90 139
                   C66 127 50 106 50 79 V51Z"
                fill="url(#handoffShieldGradient)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="3"
            />

            <rect
                x="69"
                y="78"
                width="42"
                height="35"
                rx="7"
                fill="rgba(255,255,255,0.22)"
            />

            <path
                d="M78 78 V68
                   C78 51 102 51 102 68 V78"
                fill="none"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
            />

            <circle
                cx="90"
                cy="94"
                r="5"
                fill="white"
            />

            <circle cx="31" cy="70" r="4" fill="#9e76ef" />
            <circle cx="146" cy="59" r="3" fill="#b85ce0" />
            <circle cx="143" cy="119" r="4" fill="#6f8df1" />
            <circle cx="40" cy="123" r="3" fill="#8a72e8" />
        </svg>
    );
}

function VerifiedIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="handoffVerifiedGlow">
                    <stop
                        offset="0%"
                        stopColor="#64f1d8"
                        stopOpacity="0.95"
                    />
                    <stop
                        offset="60%"
                        stopColor="#48d9d2"
                        stopOpacity="0.42"
                    />
                    <stop
                        offset="100%"
                        stopColor="#48d9d2"
                        stopOpacity="0"
                    />
                </radialGradient>

                <linearGradient
                    id="handoffVerifiedCircle"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#58e7ca" />
                    <stop offset="100%" stopColor="#20c9c9" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="75"
                fill="url(#handoffVerifiedGlow)"
            />

            <circle
                cx="90"
                cy="90"
                r="49"
                fill="url(#handoffVerifiedCircle)"
            />

            <circle
                cx="90"
                cy="90"
                r="42"
                fill="rgba(255,255,255,0.14)"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2"
            />

            <path
                d="M66 91 L82 107 L116 72"
                fill="none"
                stroke="white"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle cx="34" cy="72" r="4" fill="#54d6d2" />
            <circle cx="45" cy="47" r="3" fill="#6d9af1" />
            <circle cx="140" cy="51" r="4" fill="#58d8ce" />
            <circle cx="151" cy="79" r="3" fill="#77e6cf" />
            <circle cx="145" cy="125" r="4" fill="#5f9ae9" />
            <circle cx="48" cy="130" r="3" fill="#66d8d0" />
        </svg>
    );
}

function DashboardIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="handoffRocketGlow">
                    <stop
                        offset="0%"
                        stopColor="#b08cff"
                        stopOpacity="0.75"
                    />
                    <stop
                        offset="100%"
                        stopColor="#b08cff"
                        stopOpacity="0"
                    />
                </radialGradient>

                <linearGradient
                    id="handoffRocketBody"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#8d8df5" />
                    <stop offset="55%" stopColor="#7658df" />
                    <stop offset="100%" stopColor="#b052d5" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="76"
                fill="url(#handoffRocketGlow)"
            />

            <g transform="rotate(35 90 90)">
                <path
                    d="M90 42
                       C111 49 123 69 119 93
                       L111 122
                       L82 111
                       L71 82
                       C70 63 78 48 90 42Z"
                    fill="url(#handoffRocketBody)"
                    stroke="rgba(255,255,255,0.82)"
                    strokeWidth="3"
                />

                <circle
                    cx="96"
                    cy="70"
                    r="9"
                    fill="rgba(255,255,255,0.86)"
                />

                <path
                    d="M78 107 L62 121 L77 119 L70 135 L92 113Z"
                    fill="#5c72dc"
                />

                <path
                    d="M105 116
                       C111 130 105 139 94 146
                       C95 136 91 130 84 126"
                    fill="none"
                    stroke="#cf72ea"
                    strokeWidth="9"
                    strokeLinecap="round"
                />
            </g>

            <circle cx="38" cy="58" r="4" fill="#8d83ef" />
            <circle cx="143" cy="50" r="3" fill="#b06de5" />
            <circle cx="143" cy="125" r="4" fill="#6f8de8" />
            <circle cx="46" cy="130" r="3" fill="#b275e4" />
        </svg>
    );
}

function WelcomeIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="handoffWelcomeGlow">
                    <stop
                        offset="0%"
                        stopColor="#d88cff"
                        stopOpacity="0.85"
                    />
                    <stop
                        offset="65%"
                        stopColor="#b875ed"
                        stopOpacity="0.3"
                    />
                    <stop
                        offset="100%"
                        stopColor="#b875ed"
                        stopOpacity="0"
                    />
                </radialGradient>

                <linearGradient
                    id="handoffWelcomeHeart"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#f15ca9" />
                    <stop offset="50%" stopColor="#cc4fd3" />
                    <stop offset="100%" stopColor="#9259df" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="75"
                fill="url(#handoffWelcomeGlow)"
            />

            <path
                d="M90 119
                   C82 112 52 94 52 70
                   C52 54 63 46 75 46
                   C83 46 88 50 90 56
                   C92 50 97 46 105 46
                   C117 46 128 54 128 70
                   C128 94 98 112 90 119Z"
                fill="url(#handoffWelcomeHeart)"
            />

            <path
                d="M90 62
                   C87 54 80 51 74 52"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="4"
                strokeLinecap="round"
            />

            <circle cx="42" cy="77" r="3" fill="#a979eb" />
            <circle cx="137" cy="67" r="4" fill="#cf67dc" />
            <circle cx="133" cy="116" r="3" fill="#8d8be9" />
            <circle cx="50" cy="121" r="4" fill="#b978e8" />
        </svg>
    );
}

function StageIcon({ type }: { type: AnimationStage }) {
    switch (type) {
        case "preparing":
            return <PreparingIcon />;

        case "verifying":
            return <VerifyingIcon />;

        case "verified":
            return <VerifiedIcon />;

        case "dashboard":
            return <DashboardIcon />;

        case "welcome":
            return <WelcomeIcon />;

        default:
            return null;
    }
}

type CareVRDashboardHandoffAnimationProps = {
    onComplete: () => void;
};

export default function CareVRDashboardHandoffAnimation({
    onComplete,
}: CareVRDashboardHandoffAnimationProps) {
    const [activeStage, setActiveStage] =
        useState<AnimationStage>("preparing");    useEffect(() => {
        let cancelled = false;

        const runAnimation = async () => {
            for (const stage of stages) {
                if (cancelled) {
                    return;
                }

                setActiveStage(stage.key);

                await new Promise<void>((resolve) => {
                    window.setTimeout(resolve, 850);
                });
            }

            if (!cancelled) {
                onComplete();
            }
        };

        void runAnimation();

        return () => {
            cancelled = true;
        };
   }, [onComplete]);

    const stage =
        stages.find((item) => item.key === activeStage) ?? stages[0];

    return (
        <section className="carevr-handoff">
            <div className="carevr-handoff-orb">
                <div className="carevr-handoff-icon">
                    <StageIcon type={activeStage} />
                </div>
            </div>

            <div className="carevr-handoff-tag">
                SECURE ACCESS
            </div>

            <div className="carevr-handoff-copy" key={stage.key}>
                <div className="carevr-handoff-title">
                    {stage.title}
                </div>

                <div className="carevr-handoff-description">
                    {stage.description}
                </div>
            </div>

            <div className="carevr-handoff-progress">
                {stages.map((item, index) => {
                    const activeIndex = stages.findIndex(
                        (current) => current.key === activeStage
                    );

                    return (
                        <div
                            key={item.key}
                            className={
                                index <= activeIndex
                                    ? "handoff-progress-step is-active"
                                    : "handoff-progress-step"
                            }
                        />
                    );
                })}
            </div>

            <style jsx>{`
                .carevr-handoff {
                    position: relative;
                    width: 100%;
                    min-height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 40px 24px;
                    text-align: center;
                }

                .carevr-handoff-orb {
                    position: relative;
                    width: 220px;
                    height: 220px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .carevr-handoff-orb::before {
                    content: "";
                    position: absolute;
                    inset: 12px;
                    border-radius: 50%;
                    background:
                        radial-gradient(
                            circle at 35% 30%,
                            rgba(255, 255, 255, 0.8),
                            rgba(215, 205, 255, 0.45) 38%,
                            rgba(176, 143, 240, 0.2) 68%,
                            transparent 72%
                        );
                    filter: blur(1px);
                    animation: handoffOrbPulse 2.8s ease-in-out infinite;
                }

                .carevr-handoff-icon {
                    position: relative;
                    z-index: 1;
                    width: 180px;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: handoffIconIn 520ms ease-out;
                }

                .care-icon {
                    width: 180px;
                    height: 180px;
                    display: block;
                }

                .carevr-handoff-tag {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    color: rgba(103, 91, 180, 0.72);
                    margin-bottom: 10px;
                }

                .carevr-handoff-copy {
                    animation: handoffCopyIn 420ms ease-out;
                }

                .carevr-handoff-title {
                    font-size: clamp(22px, 4vw, 30px);
                    line-height: 1.2;
                    font-weight: 700;
                    color: #40366e;
                    letter-spacing: -0.02em;
                }

                .carevr-handoff-description {
                    margin-top: 9px;
                    max-width: 420px;
                    font-size: 14px;
                    line-height: 1.55;
                    color: rgba(67, 59, 98, 0.68);
                }

                .carevr-handoff-progress {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    margin-top: 28px;
                }

                .handoff-progress-step {
                    width: 7px;
                    height: 7px;
                    border-radius: 999px;
                    background: rgba(123, 106, 210, 0.18);
                    transition:
                        width 300ms ease,
                        background 300ms ease,
                        transform 300ms ease;
                }

                .handoff-progress-step.is-active {
                    width: 20px;
                    background: linear-gradient(
                        90deg,
                        #7b6bea,
                        #c257d7
                    );
                }

                @keyframes handoffOrbPulse {
                    0%,
                    100% {
                        transform: scale(0.96);
                        opacity: 0.72;
                    }

                    50% {
                        transform: scale(1.04);
                        opacity: 1;
                    }
                }

                @keyframes handoffIconIn {
                    from {
                        opacity: 0;
                        transform: scale(0.86) translateY(8px);
                    }

                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes handoffCopyIn {
                    from {
                        opacity: 0;
                        transform: translateY(7px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .carevr-handoff-orb::before,
                    .carevr-handoff-icon,
                    .carevr-handoff-copy {
                        animation: none;
                    }

                    .handoff-progress-step {
                        transition: none;
                    }
                }

                @media (max-width: 480px) {
                    .carevr-handoff {
                        padding: 28px 18px;
                    }

                    .carevr-handoff-orb {
                        width: 190px;
                        height: 190px;
                    }

                    .carevr-handoff-icon,
                    .care-icon {
                        width: 160px;
                        height: 160px;
                    }

                    .carevr-handoff-title {
                        font-size: 22px;
                    }
                }
            `}</style>
        </section>
    );
}
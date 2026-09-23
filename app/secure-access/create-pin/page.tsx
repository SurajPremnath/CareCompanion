"use client";

import React, {
    Suspense,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import { authService } from "@/lib/auth/authService";

import {
    validateInvitedUserLogin,
} from "@/lib/invitations/invitedUserLoginValidation";

import {
    resolveCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";

import {
    carevrContextResolver,
} from "@/lib/auth/carevrContextResolver";

import {
    carevrAuthorizationHandoff,
} from "@/lib/authorization/carevrAuthorizationHandoff";

function CreatePinContent() {
    const router = useRouter();

    const searchParams =
        useSearchParams();

    const consentAccepted =
        searchParams.get(
            "consentAccepted"
        ) === "true";

    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [userName, setUserName] = useState("");

const [secureAccessStage, setSecureAccessStage] =
    useState<
        | "VERIFYING_ACCESS"
        | "ACCESS_VERIFIED"
        | "PREPARING_CONTEXT"
        | "OPENING_DASHBOARD"
        | "WELCOME"
    >("VERIFYING_ACCESS");


    useEffect(() => {
        let cancelled = false;

        const loadProfileName = async () => {
            try {
                const profile =
                    await profileRepository
                        .getCurrentProfile();

                if (cancelled) {
                    return;
                }

                setUserName(
                    profile?.fullName?.trim() || ""
                );
            } catch (error) {
                console.error(
                    "Unable to load profile name for Create PIN header.",
                    error
                );
            }
        };

        void loadProfileName();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!consentAccepted) {
            return;
        }

        let cancelled = false;

        const continueAfterConsent = async () => {
            setError("");
            setSaving(true);

            try {
                const user =
                    await authService.getCurrentUser();

                if (!user?.id || !user.email) {
                    throw new Error(
                        "Authenticated user context is unavailable."
                    );
                }

const validation =
    await validateInvitedUserLogin({
        email: user.email,
        userId: user.id,
        mode: "NORMAL",
    });

if (cancelled) {
    return;
}

setSecureAccessStage(
    "ACCESS_VERIFIED"
);

if (
    validation.status ===
        "ACCEPTED" ||
    validation.status ===
        "PRIMARY"
) {

const {
    activeAccessRecords,
    contexts,
} =
    await carevrContextResolver
        .getAvailableContexts(
            user.id
        );

if (cancelled) {
    return;
}

setSecureAccessStage(
    "PREPARING_CONTEXT"
);

                    const dashboardRole =
                        validation.status ===
                            "PRIMARY"
                            ? "SELF"
                            : validation.invitationRole ===
                                "SECONDARY_FAMILY_MEMBER"
                                ? "FAMILY"
                                : validation.invitationRole ===
                                    "CARETAKER"
                                    ? "CARETAKER"
                                    : validation.invitationRole ===
                                        "DOCTOR"
                                        ? "DOCTOR"
                                        : "SELF";

                    const selectedContext =
                        contexts.find(
                            (context) =>
                                context.loginRole ===
                                dashboardRole
                        );

                    if (!selectedContext) {
                        throw new Error(
                            "Selected CareVR context is no longer available."
                        );
                    }

                    const access =
                        activeAccessRecords.find(
                            (record) =>
                                record.id ===
                                selectedContext.accessId
                        );

                    if (!access) {
                        throw new Error(
                            "Selected CareVR access is no longer active."
                        );
                    }

await resolveCareVRDashboardHandoff(
    user.id,
    dashboardRole,
    access
);

if (cancelled) {
    return;
}

setSecureAccessStage(
    "OPENING_DASHBOARD"
);

router.replace(
    "/dashboard"
);

                    return;
                }

                throw new Error(
                    validation.message ||
                        "Unable to determine the next CareVR step."
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to continue to CareVR Dashboard."
                );
            } finally {
                if (!cancelled) {
                    setSaving(false);
                }
            }
        };

        void continueAfterConsent();

        return () => {
            cancelled = true;
        };
    }, [consentAccepted, router]);

    const handlePinChange = (
        value: string,
        setter: (value: string) => void
    ) => {
        const digitsOnly =
            value.replace(/\D/g, "").slice(0, 6);

        setter(digitsOnly);
        setError("");
    };

    const handleSave = async () => {
        setError("");

        if (pin.length !== 6) {
            setError(
                "Please enter a 6-digit PIN."
            );
            return;
        }

        if (confirmPin.length !== 6) {
            setError(
                "Please confirm your 6-digit PIN."
            );
            return;
        }

        if (pin !== confirmPin) {
            setError(
                "The PINs do not match."
            );
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                "/api/security/create-pin",
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
                throw new Error(
                    result?.error ||
                    "Unable to save your PIN."
                );
            }

            const user =
                await authService.getCurrentUser();

            if (!user?.id || !user.email) {
                throw new Error(
                    "Authenticated user context is unavailable."
                );
            }

            const validation =
                await validateInvitedUserLogin({
                    email: user.email,
                    userId: user.id,
                    mode: "NORMAL",
                });

            if (
                validation.status ===
                "CONSENT_REQUIRED"
            ) {
                if (
                    !validation.invitationRole ||
                    !validation.familyId
                ) {
                    throw new Error(
                        "CareVR authorization context is incomplete."
                    );
                }

                carevrAuthorizationHandoff.set({
                    userId: user.id,
                    carevrRole:
                        validation.invitationRole,
                    familyId:
                        validation.familyId,
                    patientId:
                        null,
                    consentStage:
                        "POST_LOGIN",
                    governanceId:
                        null,
                    governanceVersion:
                        null,
                });

                router.replace("/consent");
                return;
            }

            if (
                validation.status ===
                    "ROLE_MISMATCH" ||
                validation.status ===
                    "INVALID_INVITATION" ||
                validation.status ===
                    "NOT_INVITED"
            ) {
                throw new Error(
                    validation.message
                );
            }

            if (
                validation.status ===
                    "ACCEPTED" ||
                validation.status ===
                    "PRIMARY"
            ) {

                const {
                    activeAccessRecords,
                    contexts,
                } =
                    await carevrContextResolver
                        .getAvailableContexts(
                            user.id
                        );

                const dashboardRole =
                    validation.status ===
                        "PRIMARY"
                        ? "SELF"
                        : validation.invitationRole ===
                            "SECONDARY_FAMILY_MEMBER"
                            ? "FAMILY"
                            : validation.invitationRole ===
                                "CARETAKER"
                                ? "CARETAKER"
                                : validation.invitationRole ===
                                    "DOCTOR"
                                    ? "DOCTOR"
                                    : "SELF";

                const selectedContext =
                    contexts.find(
                        (context) =>
                            context.loginRole ===
                            dashboardRole
                    );

                if (!selectedContext) {
                    throw new Error(
                        "Selected CareVR context is no longer available."
                    );
                }

                const access =
                    activeAccessRecords.find(
                        (record) =>
                            record.id ===
                            selectedContext.accessId
                    );

                if (!access) {
                    throw new Error(
                        "Selected CareVR access is no longer active."
                    );
                }

                await resolveCareVRDashboardHandoff(
                    user.id,
                    dashboardRole,
                    access
                );

                router.replace(
                    "/dashboard"
                );

                return;
            }

            throw new Error(
                validation.message ||
                    "Unable to determine the next CareVR step."
            );

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save your PIN."
            );
        } finally {
            setSaving(false);
        }
    };

if (consentAccepted) {

const secureStages = [
    {
        key: "VERIFYING_ACCESS",
        title: "Verifying Your Access",
        description:
            "Checking your CareVR access and permissions...",
    },
    {
        key: "ACCESS_VERIFIED",
        title: "Access Verified",
        description:
            "Your CareVR access has been confirmed.",
    },
    {
        key: "PREPARING_CONTEXT",
        title: "Preparing Your CareVR Experience",
        description:
            "Setting up your authorized CareVR experience...",
    },
    {
        key: "OPENING_DASHBOARD",
        title: "Opening Your CareVR Dashboard",
        description:
            "Finalizing your secure access...",
    },
    {
        key: "WELCOME",
        title: "Welcome to CareVR",
        description:
            "You're all set!",
    },
] as const;

    const activeStageIndex =
        secureStages.findIndex(
            (stage) =>
                stage.key === secureAccessStage
        );

    const currentStageIndex =
        activeStageIndex < 0
            ? 0
            : activeStageIndex;

    const currentStage =
        secureStages[currentStageIndex];

    return (
        <main
            className="secure-access-page"
            aria-live="polite"
            aria-label="CareVR secure access"
        >

            <div className="secure-access-background">
                <div className="secure-access-light secure-access-light-one" />
                <div className="secure-access-light secure-access-light-two" />
                <div className="secure-access-light secure-access-light-three" />
            </div>

            <div className="secure-access-shell">

                <section className="secure-access-content">

<div className="secure-access-brand">

    <img
        src="/images/CareVR v1.0.png"
        alt="CareVR"
        className="secure-access-logo"
    />

    <div className="secure-access-tagline">
        Record, Understand, Manage,{" "}
        <span>Share</span>
    </div>

</div>

                    <div
                        className={[
                            "secure-access-hero",
                            `secure-access-hero-${currentStage.key.toLowerCase()}`,
                        ].join(" ")}
                    >

                        <div className="secure-access-hero-art">

{currentStage.key ===
    "VERIFYING_ACCESS" && (
    <div className="secure-access-shield-art">

        <div className="secure-access-shield-halo" />

        <div className="secure-access-shield">

            <svg
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M32 7L51 14.5V27C51 39.7 43 49.2 32 54C21 49.2 13 39.7 13 27V14.5L32 7Z"
                    fill="url(#carevrSecureShieldGradient)"
                />

                <path
                    d="M32 7L51 14.5V27C51 39.7 43 49.2 32 54C21 49.2 13 39.7 13 27V14.5L32 7Z"
                    stroke="rgba(255,255,255,0.82)"
                    strokeWidth="1.5"
                />

                <rect
                    x="22"
                    y="29"
                    width="20"
                    height="16"
                    rx="3.5"
                    fill="rgba(255,255,255,0.96)"
                />

                <path
                    d="M27 29V24.5C27 21.5 29.2 19 32 19C34.8 19 37 21.5 37 24.5V29"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <circle
                    cx="32"
                    cy="36"
                    r="2"
                    fill="#7659DD"
                />

                <path
                    d="M32 38V41"
                    stroke="#7659DD"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                <defs>
                    <linearGradient
                        id="carevrSecureShieldGradient"
                        x1="15"
                        y1="51"
                        x2="49"
                        y2="10"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#5D92EA" />
                        <stop
                            offset="0.52"
                            stopColor="#7659DD"
                        />
                        <stop
                            offset="1"
                            stopColor="#C467E7"
                        />
                    </linearGradient>
                </defs>

            </svg>

        </div>

        <span className="secure-access-orbit-dot orbit-dot-one" />
        <span className="secure-access-orbit-dot orbit-dot-two" />
        <span className="secure-access-orbit-dot orbit-dot-three" />

    </div>
)}

{currentStage.key ===
    "ACCESS_VERIFIED" && (
    <div className="secure-access-verified-art">

        <div className="secure-access-verified-glow" />

        <div className="secure-access-verified-ring">

            <div className="secure-access-verified-badge">

                <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        cx="32"
                        cy="32"
                        r="25"
                        fill="url(#carevrAccessVerifiedGradient)"
                    />

                    <path
                        d="M19 32.5L27.5 41L45 23.5"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <defs>
                        <linearGradient
                            id="carevrAccessVerifiedGradient"
                            x1="13"
                            y1="51"
                            x2="51"
                            y2="13"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4FC5A5" />
                            <stop
                                offset="1"
                                stopColor="#65D9C0"
                            />
                        </linearGradient>
                    </defs>

                </svg>

            </div>

        </div>

        <span className="secure-access-verified-dot verified-dot-one" />
        <span className="secure-access-verified-dot verified-dot-two" />
        <span className="secure-access-verified-dot verified-dot-three" />
        <span className="secure-access-verified-dot verified-dot-four" />

    </div>
)}

                            {currentStage.key ===
                                "PREPARING_CONTEXT" && (
                                <div className="secure-access-context-art">

                                    <div className="context-glow" />

                                    <div className="context-layer context-layer-back">
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <div className="context-layer context-layer-middle">
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <div className="context-layer context-layer-front">
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <span className="context-orbit-dot context-orbit-dot-one" />
                                    <span className="context-orbit-dot context-orbit-dot-two" />
                                    <span className="context-orbit-dot context-orbit-dot-three" />
                                    <span className="context-orbit-dot context-orbit-dot-four" />

                                </div>
                            )}

{currentStage.key ===
    "OPENING_DASHBOARD" && (
    <div className="secure-access-launch-art">

        <div className="launch-glow" />

        <div className="launch-cloud launch-cloud-one">
            <span />
            <span />
            <span />
        </div>

        <div className="launch-cloud launch-cloud-two">
            <span />
            <span />
            <span />
        </div>

        <div className="secure-access-rocket">

            <svg
                viewBox="0 0 72 72"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M45.2 10.8C54.5 8.2 61 9 63 11C65 13 65.8 19.5 63.2 28.8C60.7 37.5 55.6 45.1 48.5 52.2L35 38.7C42.1 31.6 47.3 23.8 49.3 16.8C50.3 13.4 48.3 11.5 45.2 10.8Z"
                    fill="url(#carevrRocketGradient)"
                />

                <path
                    d="M35 38.7L24.2 49.5L22.5 43.2L28.7 36.9"
                    fill="#7258DB"
                />

                <path
                    d="M24.2 49.5L17 54.5L19.3 45.8"
                    stroke="#A962E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <circle
                    cx="50"
                    cy="22"
                    r="4"
                    fill="white"
                    fillOpacity="0.95"
                />

                <path
                    d="M14 55C17.5 54.2 20.5 55.7 21.4 59"
                    stroke="#6598E9"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                />

                <path
                    d="M9 58C11.5 57.5 13.5 58.5 14.2 61"
                    stroke="#C36BE5"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                <defs>
                    <linearGradient
                        id="carevrRocketGradient"
                        x1="19"
                        y1="51"
                        x2="57"
                        y2="12"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#5B91E9" />
                        <stop
                            offset="0.55"
                            stopColor="#7558DD"
                        />
                        <stop
                            offset="1"
                            stopColor="#C265E7"
                        />
                    </linearGradient>
                </defs>

            </svg>

                                    </div>

                                </div>
                            )}

                            {currentStage.key ===
                                "WELCOME" && (
                                <div className="secure-access-welcome-art">

                                    <div className="welcome-glow" />

                                    <div className="welcome-rays">
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <div className="welcome-heart">

                                        <svg
                                            viewBox="0 0 72 72"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M36 58C32.8 54.7 14 40.5 14 25.7C14 17.9 19.3 12 26.2 12C30.5 12 34.1 14.3 36 18C37.9 14.3 41.5 12 45.8 12C52.7 12 58 17.9 58 25.7C58 40.5 39.2 54.7 36 58Z"
                                                fill="url(#carevrWelcomeHeartGradient)"
                                            />

                                            <path
                                                d="M23 24C24.5 19.8 28.1 17.5 32 18.3"
                                                stroke="rgba(255,255,255,0.72)"
                                                strokeWidth="2.6"
                                                strokeLinecap="round"
                                            />

                                            <defs>
                                                <linearGradient
                                                    id="carevrWelcomeHeartGradient"
                                                    x1="16"
                                                    y1="55"
                                                    x2="57"
                                                    y2="14"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stopColor="#5F8FE9" />
                                                    <stop
                                                        offset="0.48"
                                                        stopColor="#8058DD"
                                                    />
                                                    <stop
                                                        offset="1"
                                                        stopColor="#D96CA8"
                                                    />
                                                </linearGradient>
                                            </defs>

                                        </svg>

                                    </div>

                                    <div className="welcome-hands">

                                        <span className="welcome-hand welcome-hand-left" />
                                        <span className="welcome-hand welcome-hand-right" />

                                    </div>

                                    <span className="welcome-particle welcome-particle-one" />
                                    <span className="welcome-particle welcome-particle-two" />
                                    <span className="welcome-particle welcome-particle-three" />
                                    <span className="welcome-particle welcome-particle-four" />

                                </div>
                            )}

                        </div>

                        <div className="secure-access-eyebrow">
                            SECURE ACCESS
                        </div>

<h1>
    {currentStage.key === "VERIFYING_ACCESS" && (
        <>
            Verifying
            <span>Your Access</span>
        </>
    )}

    {currentStage.key === "ACCESS_VERIFIED" && (
        <>
            Access
            <span>Verified</span>
        </>
    )}

    {currentStage.key === "PREPARING_CONTEXT" && (
        <>
            Preparing Your
            <span>CareVR Experience</span>
        </>
    )}

    {currentStage.key === "OPENING_DASHBOARD" && (
        <>
            Opening Your
            <span>CareVR Dashboard</span>
        </>
    )}

    {currentStage.key === "WELCOME" && (
        <>
            Welcome to
            <span>CareVR</span>
        </>
    )}
</h1>

<p className="secure-access-intro">
    {currentStage.description}
</p>

                    </div>

                    <div
                        className="secure-access-progress"
                        role="list"
                        aria-label="Secure access progress"
                    >

{secureStages.map(
    (stage, index) => {

        const isComplete =
            index <
            currentStageIndex;

        const isActive =
            index ===
            currentStageIndex;

        const progressTitle =
            stage.key ===
                "VERIFYING_ACCESS"
                ? "Verifying CareVR access"
                : stage.key ===
                    "ACCESS_VERIFIED"
                    ? "Verifying CareVR access"
                    : stage.key ===
                        "PREPARING_CONTEXT"
                        ? "Preparing secure context"
                        : stage.key ===
                            "OPENING_DASHBOARD"
                            ? "Opening CareVR Dashboard"
                            : "CareVR";

        const progressDescription =
            stage.key ===
                "VERIFYING_ACCESS"
                ? isComplete
                    ? "Access confirmed"
                    : isActive
                        ? "Checking your authorized access..."
                        : "Waiting..."
                : stage.key ===
                    "ACCESS_VERIFIED"
                    ? "Access confirmed"
                : stage.key ===
                    "PREPARING_CONTEXT"
                    ? isComplete
                        ? "Dashboard context ready"
                        : isActive
                            ? "Organizing your dashboard and health information..."
                            : "Waiting..."
                : stage.key ===
                    "OPENING_DASHBOARD"
                    ? isComplete
                        ? "Dashboard context ready"
                        : isActive
                            ? "Almost there..."
                            : "Waiting..."
                : "You're all set!";

        if (
            stage.key ===
                "ACCESS_VERIFIED"
            && currentStageIndex >
                index
        ) {
            return null;
        }

        if (
            stage.key ===
                "WELCOME"
        ) {
            return null;
        }

        return (
            <div
                key={stage.key}
                className={[
                    "secure-access-stage",
                    isComplete
                        ? "is-complete"
                        : "",
                    isActive
                        ? "is-active"
                        : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                role="listitem"
            >

                <div className="secure-access-stage-marker">

                    {isComplete ? (
                        <span className="secure-access-check">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 12.5L9.5 17L19 7.5"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    ) : isActive ? (
                        <span className="secure-access-active-marker" />
                    ) : (
                        <span className="secure-access-pending-marker" />
                    )}

                </div>

                <div className="secure-access-stage-copy">

                    <div className="secure-access-stage-title">
                        {progressTitle}
                    </div>

                    <div className="secure-access-stage-description">
                        {progressDescription}
                    </div>

                </div>

            </div>
        );
    }
)}

                    </div>

                    {currentStage.key ===
                        "WELCOME" && (
                        <div className="secure-access-welcome-content">

                            <div className="secure-access-welcome-redirect">
                                <span>
                                    Redirecting you to your dashboard...
                                </span>

                                <div
                                    className="secure-access-welcome-progress"
                                    aria-hidden="true"
                                >
                                    <span />
                                </div>
                            </div>

                            <div
                                className="secure-access-welcome-features"
                                aria-label="CareVR features"
                            >

                                <div className="secure-access-welcome-feature">

                                    <div
                                        className="secure-access-welcome-feature-icon"
                                        aria-hidden="true"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                            />

                                            <path
                                                d="M8 7h8M8 11h8M8 15h5"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>

                                    <span>
                                        Record with ease
                                    </span>

                                </div>

                                <div className="secure-access-welcome-feature">

                                    <div
                                        className="secure-access-welcome-feature-icon"
                                        aria-hidden="true"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="8.5"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                            />

                                            <path
                                                d="M12 7v5l3.5 2"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <span>
                                        Understand your health
                                    </span>

                                </div>

                                <div className="secure-access-welcome-feature">

                                    <div
                                        className="secure-access-welcome-feature-icon"
                                        aria-hidden="true"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M12 3v12"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                            />

                                            <path
                                                d="M8 11l4 4 4-4"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            <path
                                                d="M5 19h14"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>

                                    <span>
                                        Manage and share
                                    </span>

                                </div>

                            </div>

                        </div>
                    )}

                </section>

                <CareVRFooter />

            </div>

        </main>
    );
}

    return (
        <main className="create-pin-page">

            <MobileHeader
                careMode="SELF"
                onCareModeChange={() => {}}
                userName={userName}
                showCareModeToggle={false}
                showSelfToggle={false}
                showFamilyToggle={false}
                showHomeButton={false}
                onHomeClick={() => {}}
                accountMenuOpen={false}
                onAccountMenuToggle={() => {}}
                consentGranted={false}
                canAddPatient={false}
                onAddPatient={() => {}}
                onCareVRJourney={() => {}}
                onHelp={() => {}}
                onLogout={async () => {
                    await authService.logout();
                    router.replace("/login");
                }}
            />

            <div className="create-pin-shell">

                <section
                    className="create-pin-card"
                    aria-labelledby="create-pin-title"
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

                            <circle
                                cx="12"
                                cy="16"
                                r="1"
                            />
                        </svg>
                    </div>

                    <div className="eyebrow">
                        SECURE ACCESS SETUP
                    </div>

                    <h1 id="create-pin-title">
                        Create Your CareVR PIN
                    </h1>

                    <p className="intro">
                        Create a 6-digit PIN to protect
                        your CareVR account and keep your
                        health information secure across
                        your devices.
                    </p>

                    <div className="form">

                        <div className="field">

                            <label htmlFor="carevr-pin">
                                Create PIN
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
                                    autoComplete="new-password"
                                    maxLength={6}
                                    value={pin}
                                    onChange={(event) =>
                                        handlePinChange(
                                            event.target.value,
                                            setPin
                                        )
                                    }
                                    disabled={saving}
                                    aria-label="Create 6-digit CareVR PIN"
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
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                            <path d="M4 4l16 16" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                        </div>

                        <div className="field">

                            <label htmlFor="carevr-confirm-pin">
                                Confirm PIN
                            </label>

                            <div className="pin-input-wrapper">
                                <input
                                    id="carevr-confirm-pin"
                                    type={
                                        showConfirmPin
                                            ? "text"
                                            : "password"
                                    }
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="new-password"
                                    maxLength={6}
                                    value={confirmPin}
                                    onChange={(event) =>
                                        handlePinChange(
                                            event.target.value,
                                            setConfirmPin
                                        )
                                    }
                                    disabled={saving}
                                    aria-label="Confirm 6-digit CareVR PIN"
                                />

                                <button
                                    type="button"
                                    className="pin-visibility-button"
                                    onClick={() =>
                                        setShowConfirmPin(
                                            current => !current
                                        )
                                    }
                                    disabled={saving}
                                    aria-label={
                                        showConfirmPin
                                            ? "Hide PIN"
                                            : "Show PIN"
                                    }
                                    title={
                                        showConfirmPin
                                            ? "Hide PIN"
                                            : "Show PIN"
                                    }
                                >
                                    {showConfirmPin ? (
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                            <path d="M4 4l16 16" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                        </div>

                    </div>

                    {error && (
                        <div
                            className="error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        className="create-button"
                        onClick={handleSave}
                        disabled={
                            saving ||
                            pin.length !== 6 ||
                            confirmPin.length !== 6
                        }
                    >
                        <span>
                            {saving
                                ? "Creating PIN..."
                                : "Create PIN"}
                        </span>

                        {!saving && (
                            <span
                                aria-hidden="true"
                                className="button-arrow"
                            >
                                →
                            </span>
                        )}
                    </button>

                    <div className="security-note">

                        <div
                            className="note-icon"
                            aria-hidden="true"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3l8 4v5c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V7l8-4z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>

                        <div>
                            <strong>
                                Your information remains protected.
                            </strong>

                            <p>
                                Your PIN is securely protected
                                and works across your trusted
                                CareVR devices.
                            </p>
                        </div>

                    </div>

                </section>

            </div>

            <footer className="page-footer">

                <div className="footer-tagline">
                    Care Today. A Healthier Tomorrow.
                </div>

                <div className="footer-values">
                    <span>SIMPLE</span>
                    <span>|</span>
                    <span>SECURE</span>
                    <span>|</span>
                    <span>TOGETHER</span>
                </div>

            </footer>

            <style jsx>{`

                .create-pin-page {
                    min-height: 100dvh;
                    display: flex;
                    flex-direction: column;
                    background:
                        radial-gradient(
                            circle at 10% 20%,
                            rgba(111, 67, 245, 0.08),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 90% 70%,
                            rgba(230, 25, 126, 0.06),
                            transparent 28%
                        ),
                        #f8f9fc;
                    color: #15203d;
                }

                .create-pin-shell {
                    width: 100%;
                    flex: 1 1 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 34px 20px 30px;
                    box-sizing: border-box;
                }

                .create-pin-card {
                    width: min(
                        100%,
                        500px
                    );
                    box-sizing: border-box;
                    padding: 38px 40px 34px;
                    border: 1px solid
                        rgba(31, 41, 71, 0.07);
                    border-radius: 24px;
                    background: #ffffff;
                    box-shadow:
                        0 18px 55px
                        rgba(24, 20, 64, 0.10);
                    text-align: center;
                }

                .security-icon {
                    width: 62px;
                    height: 62px;
                    margin: 0 auto 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: #6638d6;
                    background:
                        linear-gradient(
                            135deg,
                            #f1edff,
                            #e8e2ff
                        );
                }

                .eyebrow {
                    margin-bottom: 9px;
                    color: #7043d8;
                    font-size: 11px;
                    line-height: 1.2;
                    letter-spacing: 1.2px;
                    font-weight: 800;
                }

                h1 {
                    margin: 0;
                    color: #15203d;
                    font-size: 31px;
                    line-height: 1.18;
                    letter-spacing: -0.5px;
                    font-weight: 760;
                }

                .intro {
                    max-width: 400px;
                    margin: 13px auto 28px;
                    color: #667087;
                    font-size: 14px;
                    line-height: 1.55;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 17px;
                    text-align: left;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }

                label {
                    color: #293552;
                    font-size: 13px;
                    line-height: 1.3;
                    font-weight: 700;
                }

                .pin-input-wrapper {
                    position: relative;
                    width: 100%;
                }

                .pin-visibility-button {
                    position: absolute;
                    top: 50%;
                    right: 12px;
                    transform: translateY(-50%);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    border: 0;
                    background: transparent;
                    color: #68738a;
                    font-size: 17px;
                    line-height: 1;
                    cursor: pointer;
                }

                .pin-visibility-button:hover {
                    color: #7043d8;
                }

                .pin-visibility-button:focus-visible {
                    outline: 2px solid #7043d8;
                    outline-offset: 2px;
                    border-radius: 6px;
                }

                .pin-visibility-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pin-input-wrapper input {
                    width: 100%;
                    height: 54px;
                    box-sizing: border-box;
                    border: 1px solid #d9ddea;
                    border-radius: 12px;
                    background: #fbfcff;
                    color: #18234a;
                    padding: 0 52px 0 18px;
                    font-size: 23px;
                    line-height: 1;
                    letter-spacing: 9px;
                    text-align: center;
                    outline: none;
                    transition:
                        border-color 0.16s ease,
                        box-shadow 0.16s ease,
                        background 0.16s ease;
                }

                input:focus {
                    border-color: #7043d8;
                    background: #ffffff;
                    box-shadow:
                        0 0 0 4px
                        rgba(112, 67, 216, 0.10);
                }

                input:disabled {
                    opacity: 0.65;
                }

                .error {
                    margin-top: 16px;
                    padding: 11px 13px;
                    border: 1px solid #f2caca;
                    border-radius: 10px;
                    background: #fff5f5;
                    color: #a62c2c;
                    font-size: 13px;
                    line-height: 1.45;
                    text-align: left;
                }

                .create-button {
                    width: 100%;
                    min-height: 54px;
                    margin-top: 24px;
                    padding: 0 20px;
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
                        rgba(99, 55, 210, 0.20);
                    transition:
                        transform 0.15s ease,
                        box-shadow 0.15s ease,
                        opacity 0.15s ease;
                }

                .create-button:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow:
                        0 13px 28px
                        rgba(99, 55, 210, 0.25);
                }

                .create-button:disabled {
                    opacity: 0.48;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .button-arrow {
                    font-size: 20px;
                    line-height: 1;
                }

                .security-note {
                    margin-top: 20px;
                    padding: 13px 14px;
                    display: flex;
                    align-items: flex-start;
                    gap: 11px;
                    border-radius: 12px;
                    background: #f5f8fd;
                    text-align: left;
                }

                .note-icon {
                    flex: 0 0 auto;
                    color: #416ed8;
                    margin-top: 1px;
                }

                .security-note strong {
                    display: block;
                    color: #27334f;
                    font-size: 12.5px;
                    line-height: 1.4;
                }

                .security-note p {
                    margin: 3px 0 0;
                    color: #69748a;
                    font-size: 11.5px;
                    line-height: 1.45;
                }

                .page-footer {
                    padding:
                        0 20px 22px;
                    text-align: center;
                }

                .footer-tagline {
                    margin-bottom: 8px;
                    color: #8a91a3;
                    font-size: 12px;
                    font-weight: 500;
                }

                .footer-values {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #6d42d4;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1.6px;
                }

            @media (max-width: 600px) {

                .create-pin-shell {
                    align-items: flex-start;
                    padding:
                        22px
                        14px
                        24px;
                }

                .create-pin-card {
                    padding:
                        30px
                        20px
                        24px;
                    border-radius: 20px;
                }

                h1 {
                    font-size: 27px;
                }

                .intro {
                    font-size: 13.5px;
                    margin-bottom: 24px;
                }

                .pin-input-wrapper input {
                    height: 52px;
                    font-size: 22px;
                    letter-spacing: 8px;
                }

                .create-button {
                    min-height: 52px;
                }

                .page-footer {
                    padding-bottom: 16px;
                }
            }


/* =========================================================
 * CAREVR SECURE ACCESS
 * APPROVED RESPONSIVE VISUAL DESIGN
 * ========================================================= */

.secure-access-page {
    position: relative;
    width: 100%;
    min-height: 100dvh;
    height: 100dvh;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    padding:
        clamp(14px, 3vh, 30px)
        clamp(14px, 4vw, 48px);

    box-sizing: border-box;

    background:
        radial-gradient(
            circle at 50% 12%,
            rgba(128, 99, 221, 0.12),
            transparent 30%
        ),
        radial-gradient(
            circle at 8% 82%,
            rgba(94, 151, 235, 0.09),
            transparent 28%
        ),
        radial-gradient(
            circle at 94% 78%,
            rgba(218, 106, 207, 0.075),
            transparent 27%
        ),
        linear-gradient(
            180deg,
            #fcfcff 0%,
            #f8f6ff 52%,
            #ffffff 100%
        );
}

.secure-access-background {
    position: fixed;
    inset: 0;
    overflow: hidden;

    pointer-events: none;

    z-index: 0;
}

.secure-access-light {
    position: absolute;

    border-radius: 50%;

    pointer-events: none;
}

.secure-access-light-one {
    width:
        clamp(180px, 20vw, 280px);

    height:
        clamp(180px, 20vw, 280px);

    top: -100px;
    left: -80px;

    background:
        rgba(125, 101, 218, 0.065);

    filter: blur(5px);
}

.secure-access-light-two {
    width:
        clamp(220px, 25vw, 340px);

    height:
        clamp(220px, 25vw, 340px);

    right: -130px;
    bottom: -130px;

    background:
        rgba(99, 157, 237, 0.07);

    filter: blur(5px);
}

.secure-access-light-three {
    width:
        clamp(130px, 15vw, 210px);

    height:
        clamp(130px, 15vw, 210px);

    top: 34%;
    right: -100px;

    background:
        rgba(215, 105, 208, 0.05);

    filter: blur(6px);
}

.secure-access-shell {
    position: relative;
    z-index: 2;

    width:
        min(100%, 540px);

    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    box-sizing: border-box;
}

.secure-access-content {
    width: 100%;
    flex: 1 1 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding:
        clamp(8px, 2vh, 18px)
        0;

    box-sizing: border-box;
}


/* =========================================================
 * BRAND
 * ========================================================= */

.secure-access-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-bottom:
        clamp(8px, 1.8vh, 18px);
}

.secure-access-logo {
    display: block;

    width:
        clamp(76px, 9vw, 108px);

    height: auto;

    object-fit: contain;
}

.secure-access-tagline {
    margin-top:
        clamp(3px, 0.6vh, 6px);

    color:
        #7c84a0;

    font-size:
        clamp(8px, 0.9vw, 10px);

    line-height: 1.3;

    font-weight: 500;

    letter-spacing:
        0.02em;

    text-align: center;
}

.secure-access-tagline span {
    color:
        #d46a9e;

    font-weight: 650;
}


/* =========================================================
 * HERO
 * ========================================================= */

.secure-access-hero {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
}

.secure-access-hero-art {
    position: relative;

    width:
        clamp(190px, 28vw, 250px);

    height:
        clamp(190px, 28vw, 250px);

    display: flex;
    align-items: center;
    justify-content: center;

    margin:
        clamp(4px, 1vh, 10px)
        auto
        clamp(8px, 1.6vh, 15px);
}

.secure-access-eyebrow {
    margin:
        0
        0
        clamp(6px, 1vh, 9px);

    color: #7653d1;

    font-size:
        clamp(8px, 0.9vw, 10px);

    line-height: 1;

    font-weight: 800;

    letter-spacing:
        clamp(1.6px, 0.18vw, 2px);
}

.secure-access-hero h1 {
    margin: 0;

    color: #202744;

    font-size:
        clamp(25px, 4vw, 39px);

    line-height: 1.08;

    font-weight: 760;

    letter-spacing:
        clamp(-1px, -0.08vw, -0.6px);
}

.secure-access-hero h1 span {
    display: block;

    color: #7555d4;
}

.secure-access-intro {
    width:
        min(100%, 390px);

    margin:
        clamp(7px, 1.2vh, 11px)
        auto
        0;

    color: #727b98;

    font-size:
        clamp(11px, 1.25vw, 14px);

    line-height: 1.45;

    font-weight: 450;
}


/* =========================================================
 * SHIELD ART
 * ========================================================= */

.secure-access-shield-art {
    position: relative;

    width:
        clamp(140px, 18vw, 170px);

    height:
        clamp(140px, 18vw, 170px);

    display: flex;
    align-items: center;
    justify-content: center;
}

.secure-access-shield-halo {
    position: absolute;

    width:
        clamp(116px, 15vw, 146px);

    height:
        clamp(116px, 15vw, 146px);

    border-radius: 50%;

    border:
        1px solid
        rgba(117, 89, 218, 0.24);

    background:
        radial-gradient(
            circle,
            rgba(121, 94, 220, 0.14) 0%,
            rgba(121, 94, 220, 0.055) 44%,
            transparent 72%
        );

    box-shadow:
        0 0 0 7px
        rgba(117, 89, 218, 0.035),
        0 0 42px
        rgba(116, 89, 211, 0.18),
        inset 0 0 22px
        rgba(255, 255, 255, 0.32);
}

.secure-access-shield {
    position: relative;
    z-index: 2;

    width:
        clamp(78px, 10vw, 98px);

    height:
        clamp(78px, 10vw, 98px);

    display: grid;
    place-items: center;

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 35% 28%,
            #ffffff 0%,
            #f2eeff 58%,
            #e6e0ff 100%
        );

    box-shadow:
        0 18px 40px
        rgba(96, 72, 181, 0.17),
        inset 0 1px 0
        rgba(255, 255, 255, 0.95);
}

.secure-access-shield svg {
    width:
        clamp(58px, 7vw, 72px);

    height:
        clamp(58px, 7vw, 72px);

    filter:
        drop-shadow(
            0 7px 12px
            rgba(104, 75, 199, 0.18)
        );
}

.secure-access-orbit-dot {
    position: absolute;

    border-radius: 50%;

    box-shadow:
        0 0 11px
        currentColor;
}

.orbit-dot-one {
    top:
        clamp(17px, 2vw, 23px);

    right:
        clamp(14px, 2vw, 21px);

    width: 7px;
    height: 7px;

    color: #8a68df;
    background: currentColor;
}

.orbit-dot-two {
    left:
        clamp(10px, 1.7vw, 16px);

    top:
        clamp(61px, 7vw, 76px);

    width: 5px;
    height: 5px;

    color: #62a8e9;
    background: currentColor;
}

.orbit-dot-three {
    right:
        clamp(23px, 3vw, 31px);

    bottom:
        clamp(15px, 2vw, 21px);

    width: 6px;
    height: 6px;

    color: #d875cf;
    background: currentColor;
}


/* =========================================================
 * ACCESS VERIFIED ART
 * ========================================================= */

.secure-access-verified-art {
    position: relative;

    width:
        clamp(140px, 18vw, 170px);

    height:
        clamp(140px, 18vw, 170px);

    display: flex;
    align-items: center;
    justify-content: center;
}

.secure-access-verified-glow {
    position: absolute;

    width:
        clamp(126px, 16vw, 150px);

    height:
        clamp(126px, 16vw, 150px);

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(78, 199, 166, 0.22) 0%,
            rgba(78, 199, 166, 0.08) 42%,
            transparent 72%
        );

    box-shadow:
        0 0 48px
        rgba(74, 195, 164, 0.16);
}

.secure-access-verified-ring {
    position: relative;
    z-index: 2;

    width:
        clamp(108px, 14vw, 132px);

    height:
        clamp(108px, 14vw, 132px);

    display: grid;
    place-items: center;

    border-radius: 50%;

    border:
        1px solid
        rgba(82, 201, 171, 0.28);

    background:
        rgba(255, 255, 255, 0.56);

    box-shadow:
        0 18px 42px
        rgba(65, 167, 142, 0.13),
        inset 0 1px 0
        rgba(255, 255, 255, 0.95);
}

.secure-access-verified-badge {
    width:
        clamp(72px, 9vw, 88px);

    height:
        clamp(72px, 9vw, 88px);

    display: grid;
    place-items: center;

    border-radius: 50%;

    box-shadow:
        0 14px 30px
        rgba(64, 181, 150, 0.2);
}

.secure-access-verified-badge svg {
    width: 100%;
    height: 100%;

    filter:
        drop-shadow(
            0 7px 14px
            rgba(61, 183, 151, 0.18)
        );
}

.secure-access-verified-dot {
    position: absolute;

    border-radius: 50%;

    box-shadow:
        0 0 12px
        currentColor;

    background:
        currentColor;
}

.verified-dot-one {
    top:
        clamp(16px, 2vw, 23px);

    right:
        clamp(13px, 2vw, 21px);

    width: 7px;
    height: 7px;

    color: #55c9a9;
}

.verified-dot-two {
    left:
        clamp(11px, 1.8vw, 18px);

    top:
        clamp(53px, 6vw, 69px);

    width: 5px;
    height: 5px;

    color: #74cfc0;
}

.verified-dot-three {
    right:
        clamp(24px, 3vw, 33px);

    bottom:
        clamp(14px, 2vw, 20px);

    width: 6px;
    height: 6px;

    color: #54bca7;
}

.verified-dot-four {
    left:
        clamp(30px, 4vw, 40px);

    bottom:
        clamp(27px, 3.5vw, 38px);

    width: 4px;
    height: 4px;

    color: #9adfd0;
}


/* =========================================================
 * CONTEXT ART
 * ========================================================= */

.secure-access-context-art {
    position: relative;

    width:
        clamp(140px, 18vw, 170px);

    height:
        clamp(140px, 18vw, 170px);

    display: flex;
    align-items: center;
    justify-content: center;
}

.context-glow {
    position: absolute;

    width:
        clamp(120px, 15vw, 142px);

    height:
        clamp(120px, 15vw, 142px);

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(114, 93, 215, 0.16),
            transparent 68%
        );

    box-shadow:
        0 0 34px
        rgba(114, 93, 215, 0.10);
}

.context-layer {
    position: absolute;

    width:
        clamp(82px, 10vw, 98px);

    height:
        clamp(50px, 6vw, 60px);

    border-radius: 16px;

    transform:
        rotate(-7deg)
        skewY(-5deg);

    box-shadow:
        0 14px 25px
        rgba(85, 69, 166, 0.13);
}

.context-layer span {
    position: absolute;

    width: 24px;
    height: 5px;

    border-radius: 4px;

    background:
        rgba(255, 255, 255, 0.76);
}

.context-layer span:nth-child(1) {
    left: 15px;
    top: 15px;
}

.context-layer span:nth-child(2) {
    left: 15px;
    top: 27px;
    width: 43px;
}

.context-layer span:nth-child(3) {
    left: 15px;
    top: 39px;
    width: 32px;
}

.context-layer-back {
    transform:
        translate(-7px, -7px)
        rotate(-7deg);

    background:
        linear-gradient(
            135deg,
            #9bbaf1,
            #a18be5
        );

    opacity: 0.72;
}

.context-layer-middle {
    transform:
        translate(0, 0)
        rotate(-7deg);

    background:
        linear-gradient(
            135deg,
            #729de8,
            #8064df 60%,
            #b879df
        );

    opacity: 0.82;
}

.context-layer-front {
    transform:
        translate(7px, 7px)
        rotate(-7deg);

    background:
        linear-gradient(
            135deg,
            #5c8fe2,
            #7457d8 58%,
            #b35fdc
        );

    opacity: 0.9;
}

.context-orbit-dot {
    position: absolute;

    border-radius: 50%;

    background:
        currentColor;

    box-shadow:
        0 0 11px
        currentColor;

    z-index: 5;
}

.context-orbit-dot-one {
    width: 7px;
    height: 7px;

    top: 28px;
    right: 30px;

    color: #7a9bea;
}

.context-orbit-dot-two {
    width: 5px;
    height: 5px;

    left: 25px;
    top: 55px;

    color: #a06cdd;
}

.context-orbit-dot-three {
    width: 6px;
    height: 6px;

    right: 35px;
    bottom: 28px;

    color: #b36add;
}

.context-orbit-dot-four {
    width: 4px;
    height: 4px;

    left: 42px;
    bottom: 33px;

    color: #83a8eb;
}


/* =========================================================
 * ROCKET / OPEN DASHBOARD ART
 * ========================================================= */

.secure-access-launch-art {
    position: relative;

    width:
        clamp(140px, 18vw, 170px);

    height:
        clamp(140px, 18vw, 170px);

    display: flex;
    align-items: center;
    justify-content: center;
}

.launch-glow {
    position: absolute;

    width:
        clamp(120px, 15vw, 142px);

    height:
        clamp(120px, 15vw, 142px);

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(122, 94, 218, 0.20) 0%,
            rgba(122, 94, 218, 0.09) 42%,
            transparent 72%
        );

    box-shadow:
        0 0 38px
        rgba(122, 94, 218, 0.14);
}

.launch-cloud {
    position: absolute;

    display: flex;
    align-items: flex-end;

    z-index: 2;
}

.launch-cloud span {
    display: block;

    border-radius: 50%;

    background:
        rgba(255, 255, 255, 0.86);

    box-shadow:
        0 7px 18px
        rgba(103, 90, 174, 0.08);
}

.launch-cloud-one {
    left:
        clamp(15px, 2vw, 23px);

    bottom:
        clamp(31px, 4vw, 40px);
}

.launch-cloud-one span:nth-child(1) {
    width: 17px;
    height: 10px;
}

.launch-cloud-one span:nth-child(2) {
    width: 25px;
    height: 16px;

    margin-left: -7px;
}

.launch-cloud-one span:nth-child(3) {
    width: 19px;
    height: 11px;

    margin-left: -7px;
}

.launch-cloud-two {
    right:
        clamp(14px, 2vw, 22px);

    top:
        clamp(31px, 4vw, 40px);

    transform: scale(0.78);
}

.launch-cloud-two span:nth-child(1) {
    width: 16px;
    height: 9px;
}

.launch-cloud-two span:nth-child(2) {
    width: 23px;
    height: 15px;

    margin-left: -7px;
}

.launch-cloud-two span:nth-child(3) {
    width: 17px;
    height: 10px;

    margin-left: -7px;
}

.secure-access-rocket {
    position: relative;
    z-index: 3;

    width:
        clamp(80px, 10vw, 98px);

    height:
        clamp(80px, 10vw, 98px);

    display: grid;
    place-items: center;

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 35% 28%,
            #ffffff,
            #f1edff 60%,
            #e5e0ff 100%
        );

    box-shadow:
        0 18px 40px
        rgba(96, 72, 181, 0.17);
}

.secure-access-rocket svg {
    width:
        clamp(65px, 8vw, 80px);

    height:
        clamp(65px, 8vw, 80px);

    filter:
        drop-shadow(
            0 7px 12px
            rgba(104, 75, 199, 0.15)
        );
}


/* =========================================================
 * WELCOME / SUCCESS ART
 * ========================================================= */

.secure-access-welcome-art {
    position: relative;

    width:
        clamp(160px, 22vw, 205px);

    height:
        clamp(160px, 22vw, 205px);

    display: flex;
    align-items: center;
    justify-content: center;
}

.welcome-glow {
    position: absolute;

    width:
        clamp(140px, 18vw, 174px);

    height:
        clamp(140px, 18vw, 174px);

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(216, 103, 168, 0.22) 0%,
            rgba(127, 89, 220, 0.13) 38%,
            rgba(95, 143, 233, 0.055) 58%,
            transparent 76%
        );

    box-shadow:
        0 0 52px
        rgba(181, 91, 194, 0.18),
        0 0 18px
        rgba(127, 89, 220, 0.10);
}

.welcome-rays {
    position: absolute;

    width:
        clamp(146px, 18vw, 176px);

    height:
        clamp(146px, 18vw, 176px);

    border-radius: 50%;
}

.welcome-rays span {
    position: absolute;

    left: 50%;
    top: 50%;

    width: 2px;
    height: 23px;

    border-radius: 2px;

    background:
        linear-gradient(
            180deg,
            rgba(216, 103, 168, 0.48),
            rgba(127, 89, 220, 0)
        );

    transform-origin:
        50% clamp(73px, 9vw, 88px);
}

.welcome-rays span:nth-child(1) {
    transform:
        translate(-50%, -50%)
        rotate(0deg);
}

.welcome-rays span:nth-child(2) {
    transform:
        translate(-50%, -50%)
        rotate(90deg);
}

.welcome-rays span:nth-child(3) {
    transform:
        translate(-50%, -50%)
        rotate(180deg);
}

.welcome-rays span:nth-child(4) {
    transform:
        translate(-50%, -50%)
        rotate(270deg);
}

.welcome-heart {
    position: relative;
    z-index: 3;

    width:
        clamp(88px, 11vw, 112px);

    height:
        clamp(88px, 11vw, 112px);

    display: grid;
    place-items: center;

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 34% 27%,
            #ffffff,
            #f5edff 55%,
            #e9ddff 100%
        );

    box-shadow:
        0 20px 44px
        rgba(115, 78, 190, 0.18),
        0 0 24px
        rgba(210, 103, 177, 0.10);
}

.welcome-heart svg {
    width:
        clamp(70px, 8.5vw, 86px);

    height:
        clamp(70px, 8.5vw, 86px);

    filter:
        drop-shadow(
            0 8px 16px
            rgba(190, 87, 171, 0.22)
        );
}

.welcome-hands {
    position: absolute;

    z-index: 4;

    bottom:
        clamp(16px, 2.2vw, 23px);

    width:
        clamp(92px, 11vw, 112px);

    height: 30px;
}

.welcome-hand {
    position: absolute;

    bottom: 0;

    width:
        clamp(42px, 5vw, 50px);

    height:
        clamp(16px, 2vw, 19px);

    border-radius:
        18px 18px 9px 9px;

    background:
        linear-gradient(
            135deg,
            rgba(105, 145, 232, 0.86),
            rgba(192, 101, 220, 0.82)
        );

    box-shadow:
        0 8px 17px
        rgba(102, 83, 177, 0.14);
}

.welcome-hand-left {
    left: 0;

    transform:
        rotate(-12deg);
}

.welcome-hand-right {
    right: 0;

    transform:
        rotate(12deg);
}

.welcome-particle {
    position: absolute;

    z-index: 5;

    border-radius: 50%;

    background:
        currentColor;

    box-shadow:
        0 0 12px
        currentColor;
}

.welcome-particle-one {
    width: 7px;
    height: 7px;

    top: 27px;
    right: 31px;

    color: #d46da7;
}

.welcome-particle-two {
    width: 5px;
    height: 5px;

    left: 25px;
    top: 52px;

    color: #7d9fe9;
}

.welcome-particle-three {
    width: 6px;
    height: 6px;

    right: 26px;
    bottom: 34px;

    color: #9a6cdd;
}

.welcome-particle-four {
    width: 5px;
    height: 5px;

    left: 43px;
    bottom: 25px;

    color: #d48bbd;
}

.secure-access-welcome-content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top:
        clamp(4px, 0.8vh, 8px);
}

.secure-access-welcome-redirect {
    width:
        min(100%, 260px);

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 8px;
}

.secure-access-welcome-redirect span {
    color:
        #7c84a0;

    font-size:
        clamp(9px, 1vw, 11px);

    line-height: 1.4;

    font-weight: 500;

    text-align: center;
}

.secure-access-welcome-progress {
    width: 100%;
    height: 4px;

    overflow: hidden;

    border-radius: 999px;

    background:
        rgba(117, 89, 218, 0.09);
}

.secure-access-welcome-progress span {
    display: block;

    width: 72%;
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #6b96e9,
            #7858dc,
            #d36ba9
        );
}

.secure-access-welcome-features {
    width:
        min(100%, 360px);

    display: grid;

    grid-template-columns:
        repeat(3, minmax(0, 1fr));

    gap:
        clamp(8px, 1.4vw, 16px);

    margin-top:
        clamp(14px, 2vh, 20px);
}

.secure-access-welcome-feature {
    min-width: 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 6px;

    color:
        #737c98;

    font-size:
        clamp(8px, 0.9vw, 10px);

    line-height: 1.35;

    font-weight: 500;

    text-align: center;
}

.secure-access-welcome-feature-icon {
    width:
        clamp(28px, 3.2vw, 34px);

    height:
        clamp(28px, 3.2vw, 34px);

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    color:
        #7659dd;

    background:
        linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.96),
            rgba(241, 237, 255, 0.88)
        );

    border:
        1px solid
        rgba(118, 89, 221, 0.10);

    box-shadow:
        0 8px 18px
        rgba(104, 82, 177, 0.10);
}

.secure-access-welcome-feature-icon svg {
    width: 16px;
    height: 16px;
}

@media (max-width: 520px) {

    .secure-access-welcome-features {
        gap: 6px;
    }

    .secure-access-welcome-feature {
        font-size: 8px;
    }

    .secure-access-welcome-feature-icon {
        width: 29px;
        height: 29px;
    }

    .secure-access-welcome-feature-icon svg {
        width: 14px;
        height: 14px;
    }
}

/* =========================================================
 * PROGRESS JOURNEY
 * ========================================================= */

.secure-access-progress {
    position: relative;

    width:
        min(100%, 410px);

    margin:
        clamp(17px, 3vh, 30px)
        auto 0;
}

.secure-access-progress::before {
    content: "";

    position: absolute;

    top: 15px;
    bottom: 15px;
    left: 15px;

    width: 1px;

    background:
        linear-gradient(
            180deg,
            rgba(117, 89, 211, 0.20),
            rgba(117, 89, 211, 0.055)
        );
}

.secure-access-stage {
    position: relative;

    display: flex;
    align-items: flex-start;

    min-height:
        clamp(48px, 6vh, 60px);
}

.secure-access-stage:last-child {
    min-height: 38px;
}

.secure-access-stage-marker {
    position: relative;
    z-index: 2;

    flex:
        0 0
        clamp(29px, 3vw, 32px);

    width:
        clamp(29px, 3vw, 32px);

    height:
        clamp(29px, 3vw, 32px);

    display: grid;
    place-items: center;

    border:
        1px solid
        rgba(137, 144, 165, 0.18);

    border-radius: 50%;

    background:
        rgba(255, 255, 255, 0.97);

    color: #aeb5c4;

    box-shadow:
        0 3px 9px
        rgba(51, 48, 84, 0.05);

    box-sizing: border-box;

    transition:
        border-color 180ms ease,
        box-shadow 180ms ease,
        transform 180ms ease;
}

.secure-access-stage-copy {
    min-width: 0;

    padding:
        2px
        0
        0
        clamp(11px, 1.5vw, 15px);
}

.secure-access-stage-title {
    color: #59627a;

    font-size:
        clamp(11px, 1.35vw, 14px);

    line-height: 1.3;

    font-weight: 680;
}

.secure-access-stage-description {
    margin-top: 2px;

    color: #a0a7b8;

    font-size:
        clamp(8.8px, 1vw, 11px);

    line-height: 1.35;
}

.secure-access-check {
    width: 17px;
    height: 17px;

    display: grid;
    place-items: center;

    border-radius: 50%;

    color: #ffffff;

    background:
        linear-gradient(
            145deg,
            #60c89e,
            #48ae89
        );
}

.secure-access-check svg {
    width: 12px;
    height: 12px;
}

.secure-access-active-marker {
    width: 14px;
    height: 14px;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            #6994eb,
            #7656d9,
            #c265e5
        );

    box-shadow:
        inset 0 0 0 3px
        rgba(255, 255, 255, 0.96),
        0 0 0 2px
        rgba(117, 86, 217, 0.20),
        0 0 14px
        rgba(117, 86, 217, 0.48);

    animation:
        secure-access-active-pulse
        1.6s ease-in-out infinite;
}

.secure-access-pending-marker {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #c2c7d2;
}

.secure-access-stage.is-complete
    .secure-access-stage-title {
    color: #4e7868;
}

.secure-access-stage.is-complete
    .secure-access-stage-description {
    color: #91a69c;
}

.secure-access-stage.is-active
    .secure-access-stage-marker {
    border-color:
        rgba(117, 83, 213, 0.30);

    box-shadow:
        0 0 0 4px
        rgba(117, 83, 213, 0.055),
        0 5px 13px
        rgba(117, 83, 213, 0.11);

    transform: scale(1.03);
}

.secure-access-stage.is-active
    .secure-access-stage-title {
    color: #353052;
}


/* =========================================================
 * FOOTER
 * ========================================================= */

.secure-access-shell > :global(.carevr-footer) {
    width: 100%;

    margin-top: 4px;
}


/* =========================================================
 * DESKTOP
 * ========================================================= */

@media (min-width: 901px) {

    .secure-access-content {
        padding-top: 10px;
    }

    .secure-access-logo {
        width: 104px;
    }

    .secure-access-hero-art {
        width: 190px;
        height: 190px;
    }

    .secure-access-shield-art,
    .secure-access-context-art,
    .secure-access-launch-art,
    .secure-access-welcome-art {
        width: 176px;
        height: 176px;
    }

    .secure-access-progress {
        margin-top: 28px;
    }
}


/* =========================================================
 * TABLET
 * ========================================================= */

@media (max-width: 900px) {

    .secure-access-content {
        padding-top: 6px;
    }
}


/* =========================================================
 * MOBILE
 * ========================================================= */

@media (max-width: 600px) {

    .secure-access-page {
        padding:
            10px
            12px
            8px;
    }

    .secure-access-shell {
        width: min(100%, 460px);
    }

    .secure-access-content {
        padding:
            3px
            0
            3px;
    }

    .secure-access-logo {
        width: 82px;
    }

    .secure-access-brand {
        margin-bottom: 6px;
    }

    .secure-access-hero-art {
        width: 150px;
        height: 150px;

        margin-bottom: 5px;
    }

    .secure-access-shield-art,
    .secure-access-context-art,
    .secure-access-launch-art,
    .secure-access-welcome-art {
        width: 142px;
        height: 142px;
    }

    .secure-access-shield-halo {
        width: 116px;
        height: 116px;
    }

    .secure-access-shield {
        width: 80px;
        height: 80px;
    }

    .secure-access-shield svg {
        width: 60px;
        height: 60px;
    }

    .secure-access-hero h1 {
        font-size: 27px;
    }

    .secure-access-intro {
        width: min(100%, 330px);

        font-size: 11px;
    }

    .secure-access-progress {
        width: min(100%, 360px);

        margin-top: 18px;
    }

    .secure-access-stage {
        min-height: 48px;
    }

    .secure-access-stage-title {
        font-size: 11px;
    }

    .secure-access-stage-description {
        font-size: 8.8px;
    }
}


/* =========================================================
 * VERY NARROW MOBILE
 * ========================================================= */

@media (max-width: 380px) {

    .secure-access-page {
        padding:
            7px
            9px
            6px;
    }

    .secure-access-logo {
        width: 70px;
    }

    .secure-access-brand {
        margin-bottom: 3px;
    }

    .secure-access-hero-art {
        width: 126px;
        height: 126px;

        margin-bottom: 3px;
    }

    .secure-access-shield-art,
    .secure-access-context-art,
    .secure-access-launch-art,
    .secure-access-welcome-art {
        width: 120px;
        height: 120px;
    }

    .secure-access-shield-halo {
        width: 98px;
        height: 98px;
    }

    .secure-access-shield {
        width: 69px;
        height: 69px;
    }

    .secure-access-shield svg {
        width: 51px;
        height: 51px;
    }

    .secure-access-hero h1 {
        font-size: 23px;
    }

    .secure-access-intro {
        width: min(100%, 285px);

        margin-top: 6px;

        font-size: 9.5px;
    }

    .secure-access-progress {
        width: min(100%, 310px);

        margin-top: 14px;
    }

    .secure-access-stage {
        min-height: 42px;
    }

    .secure-access-stage-marker {
        flex-basis: 27px;

        width: 27px;
        height: 27px;
    }

    .secure-access-stage-copy {
        padding-left: 9px;
    }

    .secure-access-stage-title {
        font-size: 10px;
    }

    .secure-access-stage-description {
        font-size: 8px;
    }
}


/* =========================================================
 * SHORT VIEWPORTS
 * ========================================================= */

@media (max-height: 700px) {

    .secure-access-page {
        padding-top: 5px;
        padding-bottom: 4px;
    }

    .secure-access-content {
        padding-top: 1px;
        padding-bottom: 1px;
    }

    .secure-access-logo {
        width: 68px;
    }

    .secure-access-brand {
        margin-bottom: 2px;
    }

    .secure-access-hero-art {
        width: 128px;
        height: 128px;

        margin-bottom: 2px;
    }

    .secure-access-shield-art,
    .secure-access-context-art,
    .secure-access-launch-art {
        width: 120px;
        height: 120px;
    }

    .secure-access-shield-halo {
        width: 94px;
        height: 94px;
    }

    .secure-access-shield {
        width: 67px;
        height: 67px;
    }

    .secure-access-shield svg {
        width: 50px;
        height: 50px;
    }

    .secure-access-hero h1 {
        font-size: 22px;
    }

    .secure-access-intro {
        margin-top: 5px;
        font-size: 9.5px;
    }

    .secure-access-progress {
        margin-top: 11px;
    }

    .secure-access-stage {
        min-height: 38px;
    }

    .secure-access-stage:last-child {
        min-height: 32px;
    }
}


/* =========================================================
 * VERY SHORT / VERY NARROW DEVICES
 * ========================================================= */

@media (max-width: 380px) and (max-height: 700px) {

    .secure-access-logo {
        width: 62px;
    }

    .secure-access-hero-art {
        width: 112px;
        height: 112px;
    }

    .secure-access-shield-art,
    .secure-access-context-art,
    .secure-access-launch-art {
        width: 106px;
        height: 106px;
    }

    .secure-access-shield-halo {
        width: 84px;
        height: 84px;
    }

    .secure-access-shield {
        width: 60px;
        height: 60px;
    }

    .secure-access-shield svg {
        width: 45px;
        height: 45px;
    }

    .secure-access-hero h1 {
        font-size: 20px;
    }

    .secure-access-intro {
        font-size: 8.8px;
    }

    .secure-access-progress {
        margin-top: 9px;
    }

    .secure-access-stage {
        min-height: 35px;
    }

    .secure-access-stage-title {
        font-size: 9.5px;
    }

    .secure-access-stage-description {
        font-size: 7.5px;
    }
}


/* =========================================================
 * MOTION
 * ========================================================= */

@keyframes secure-access-active-pulse {

    0%,
    100% {
        transform: scale(0.78);
        opacity: 0.72;
    }

    50% {
        transform: scale(1);
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {

    .secure-access-active-marker {
        animation: none;
    }
}

        `}</style>

    </main>
);

}

export default function CreatePin() {
    return (
        <Suspense fallback={null}>
            <CreatePinContent />
        </Suspense>
    );
}
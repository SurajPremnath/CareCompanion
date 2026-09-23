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
        "VERIFYING_ACCESS" |
        "PREPARING_CONTEXT" |
        "OPENING_DASHBOARD"
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
    "PREPARING_CONTEXT"
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
            title: "Verify CareVR Access",
            description:
                "Confirming your authorized CareVR access.",
        },
        {
            key: "PREPARING_CONTEXT",
            title: "Prepare Your CareVR Context",
            description:
                "Preparing your authorized role, modules and patient context.",
        },
        {
            key: "OPENING_DASHBOARD",
            title: "Open Your Dashboard",
            description:
                "Your secure CareVR dashboard is ready.",
        },
    ] as const;

    const activeStageIndex =
        secureStages.findIndex(
            (stage) =>
                stage.key === secureAccessStage
        );

    return (
        <main className="secure-access-page">

            <div className="secure-access-glow secure-access-glow-one" />
            <div className="secure-access-glow secure-access-glow-two" />

            <div className="secure-access-shell">

                <section
                    className="secure-access-card"
                    aria-live="polite"
                    aria-label="CareVR secure access"
                >

                    <div className="secure-access-brand">
                        <img
                            src="/images/CareVR v1.0.png"
                            alt="CareVR"
                            className="secure-access-logo"
                        />
                    </div>

                    <div className="secure-access-hero">

                        <div className="secure-access-orbit">
                            <div className="secure-access-orbit-ring" />

                            <div className="secure-access-shield">
                                <svg
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M24 5L39 11V21C39 31 32.7 38.2 24 42C15.3 38.2 9 31 9 21V11L24 5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M16.5 24L21.5 29L32 18.5"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="secure-access-eyebrow">
                            CAREVR · SECURE ACCESS
                        </div>

                        <h1>
                            Preparing Your
                            <span> CareVR Experience</span>
                        </h1>

                        <p className="secure-access-intro">
                            Your consent is complete.
                            We are securely preparing
                            your authorized CareVR experience.
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
                                    activeStageIndex;

                                const isActive =
                                    index ===
                                    activeStageIndex;

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
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M5 12.5L9.5 17L19 7.5"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : isActive ? (
                                                <span className="secure-access-spinner" />
                                            ) : (
                                                <span className="secure-access-stage-dot" />
                                            )}

                                        </div>

                                        <div className="secure-access-stage-copy">

                                            <div className="secure-access-stage-title">
                                                {stage.title}
                                            </div>

                                            <div className="secure-access-stage-description">
                                                {isActive
                                                    ? stage.description
                                                    : isComplete
                                                        ? "Completed securely."
                                                        : "Waiting for the previous step."
                                                }
                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    <div className="secure-access-status">

                        <span className="secure-access-status-dot" />

                        <span>
                            Your health information remains protected
                            while CareVR prepares your dashboard.
                        </span>

                    </div>

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
             * PREMIUM SECURE ACCESS PROGRESS
             * ========================================================= */

            .secure-access-page {
                position: relative;
                min-height: 100dvh;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background:
                    radial-gradient(
                        circle at 50% 12%,
                        rgba(122, 87, 220, 0.14),
                        transparent 34%
                    ),
                    radial-gradient(
                        circle at 12% 78%,
                        rgba(126, 165, 255, 0.10),
                        transparent 30%
                    ),
                    linear-gradient(
                        180deg,
                        #fbfaff 0%,
                        #f6f3ff 48%,
                        #ffffff 100%
                    );
            }

            .secure-access-shell {
                position: relative;
                z-index: 2;
                width: min(100%, 520px);
            }

            .secure-access-card {
                position: relative;
                overflow: hidden;
                padding: 30px 28px 26px;
                border: 1px solid rgba(116, 82, 205, 0.10);
                border-radius: 30px;
                background:
                    linear-gradient(
                        180deg,
                        rgba(255, 255, 255, 0.96),
                        rgba(250, 248, 255, 0.94)
                    );
                box-shadow:
                    0 28px 70px rgba(68, 45, 126, 0.12),
                    0 8px 24px rgba(68, 45, 126, 0.07);
                backdrop-filter: blur(18px);
            }

            .secure-access-card::before {
                content: "";
                position: absolute;
                inset: 0;
                pointer-events: none;
                background:
                    radial-gradient(
                        circle at 50% 0%,
                        rgba(127, 91, 216, 0.10),
                        transparent 35%
                    );
            }

            .secure-access-brand {
                position: relative;
                z-index: 1;
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
            }

            .secure-access-logo {
                display: block;
                width: 112px;
                height: auto;
                object-fit: contain;
            }

            .secure-access-hero {
                position: relative;
                z-index: 1;
                text-align: center;
            }

            .secure-access-orbit {
                position: relative;
                width: 104px;
                height: 104px;
                margin: 0 auto 20px;
                display: grid;
                place-items: center;
            }

            .secure-access-orbit-ring {
                position: absolute;
                inset: 0;
                border: 1px solid rgba(117, 82, 204, 0.18);
                border-radius: 50%;
                animation:
                    secure-access-orbit-pulse
                    2.8s ease-in-out infinite;
            }

            .secure-access-orbit-ring::after {
                content: "";
                position: absolute;
                inset: 9px;
                border: 1px dashed rgba(117, 82, 204, 0.16);
                border-radius: 50%;
                animation:
                    secure-access-orbit-spin
                    12s linear infinite;
            }

            .secure-access-shield {
                position: relative;
                z-index: 2;
                width: 68px;
                height: 68px;
                display: grid;
                place-items: center;
                border: 1px solid rgba(117, 82, 204, 0.15);
                border-radius: 22px;
                color: #6f45cf;
                background:
                    linear-gradient(
                        145deg,
                        #ffffff 0%,
                        #f0eaff 100%
                    );
                box-shadow:
                    0 12px 28px rgba(102, 66, 190, 0.16),
                    inset 0 1px 0
                        rgba(255, 255, 255, 0.90);
            }

            .secure-access-shield svg {
                width: 38px;
                height: 38px;
            }

            .secure-access-eyebrow {
                margin-bottom: 8px;
                color: #7953c9;
                font-size: 10px;
                font-weight: 800;
                letter-spacing: 1.8px;
            }

            .secure-access-hero h1 {
                position: relative;
                margin: 0;
                color: #20283d;
                font-size: 28px;
                line-height: 1.16;
                font-weight: 760;
                letter-spacing: -0.7px;
            }

            .secure-access-hero h1 span {
                display: block;
                color: #7145cc;
            }

            .secure-access-intro {
                max-width: 360px;
                margin: 12px auto 0;
                color: #70798d;
                font-size: 13px;
                line-height: 1.55;
            }


            /* =========================================================
             * PROGRESS JOURNEY
             * ========================================================= */

            .secure-access-progress {
                position: relative;
                z-index: 1;
                margin: 30px 4px 0;
            }

            .secure-access-progress::before {
                content: "";
                position: absolute;
                top: 22px;
                bottom: 22px;
                left: 17px;
                width: 2px;
                background:
                    linear-gradient(
                        180deg,
                        rgba(116, 82, 205, 0.24),
                        rgba(116, 82, 205, 0.08)
                    );
            }

            .secure-access-stage {
                position: relative;
                display: flex;
                align-items: flex-start;
                min-height: 72px;
            }

            .secure-access-stage:last-child {
                min-height: 58px;
            }

            .secure-access-stage-marker {
                position: relative;
                z-index: 2;
                flex: 0 0 36px;
                width: 36px;
                height: 36px;
                display: grid;
                place-items: center;
                border: 1px solid
                    rgba(120, 127, 148, 0.18);
                border-radius: 50%;
                color: #a1a8b8;
                background: #ffffff;
                box-shadow:
                    0 3px 10px
                    rgba(43, 35, 75, 0.05);
                transition:
                    transform 220ms ease,
                    box-shadow 220ms ease,
                    border-color 220ms ease,
                    color 220ms ease,
                    background 220ms ease;
            }

            .secure-access-stage-marker svg {
                width: 18px;
                height: 18px;
            }

            .secure-access-stage-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #b8bdc9;
            }

            .secure-access-stage-copy {
                min-width: 0;
                padding: 2px 0 0 14px;
            }

            .secure-access-stage-title {
                color: #4a5368;
                font-size: 13.5px;
                line-height: 1.35;
                font-weight: 650;
                transition: color 220ms ease;
            }

            .secure-access-stage-description {
                margin-top: 4px;
                color: #a0a7b5;
                font-size: 11.5px;
                line-height: 1.45;
                transition: color 220ms ease;
            }


            /* Completed */

            .secure-access-stage.is-complete
                .secure-access-stage-marker {
                border-color:
                    rgba(103, 181, 143, 0.28);
                color: #4d9c78;
                background: #f2fbf6;
            }

            .secure-access-stage.is-complete
                .secure-access-stage-title {
                color: #3f8065;
            }

            .secure-access-stage.is-complete
                .secure-access-stage-description {
                color: #91a99e;
            }


            /* Active */

            .secure-access-stage.is-active
                .secure-access-stage-marker {
                border-color:
                    rgba(113, 69, 204, 0.30);
                color: #7045cc;
                background:
                    linear-gradient(
                        145deg,
                        #ffffff,
                        #f1ebff
                    );
                box-shadow:
                    0 0 0 5px
                        rgba(113, 69, 204, 0.07),
                    0 8px 20px
                        rgba(113, 69, 204, 0.15);
                transform: scale(1.05);
            }

            .secure-access-stage.is-active
                .secure-access-stage-title {
                color: #2f3650;
            }

            .secure-access-stage.is-active
                .secure-access-stage-description {
                color: #747d91;
            }

            .secure-access-spinner {
                width: 15px;
                height: 15px;
                border: 2px solid
                    rgba(112, 69, 204, 0.18);
                border-top-color: #7045cc;
                border-radius: 50%;
                animation:
                    secure-access-spinner
                    800ms linear infinite;
            }


            /* =========================================================
             * STATUS
             * ========================================================= */

            .secure-access-status {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
                padding: 10px 12px;
                border: 1px solid
                    rgba(116, 82, 205, 0.08);
                border-radius: 14px;
                color: #858da0;
                background:
                    rgba(248, 246, 255, 0.72);
                font-size: 10.5px;
                line-height: 1.4;
                text-align: center;
            }

            .secure-access-status-dot {
                flex: 0 0 auto;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #6cbd94;
                box-shadow:
                    0 0 0 4px
                    rgba(108, 189, 148, 0.10);
                animation:
                    secure-access-status-pulse
                    1.8s ease-in-out infinite;
            }


            /* =========================================================
             * BACKGROUND LIGHT
             * ========================================================= */

            .secure-access-glow {
                position: fixed;
                z-index: 0;
                pointer-events: none;
                border-radius: 50%;
                filter: blur(2px);
            }

            .secure-access-glow-one {
                top: -120px;
                left: -100px;
                width: 280px;
                height: 280px;
                background:
                    rgba(130, 98, 220, 0.08);
            }

            .secure-access-glow-two {
                right: -130px;
                bottom: -100px;
                width: 300px;
                height: 300px;
                background:
                    rgba(100, 153, 232, 0.07);
            }


            /* =========================================================
             * MOTION
             * ========================================================= */

            @keyframes secure-access-spinner {
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes secure-access-orbit-pulse {
                0%,
                100% {
                    transform: scale(0.96);
                    opacity: 0.65;
                }

                50% {
                    transform: scale(1.04);
                    opacity: 1;
                }
            }

            @keyframes secure-access-orbit-spin {
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes secure-access-status-pulse {
                0%,
                100% {
                    opacity: 0.55;
                }

                50% {
                    opacity: 1;
                }
            }

            @media (prefers-reduced-motion: reduce) {

                .secure-access-orbit-ring,
                .secure-access-orbit-ring::after,
                .secure-access-spinner,
                .secure-access-status-dot {
                    animation: none;
                }
            }


            /* =========================================================
             * MOBILE
             * ========================================================= */

            @media (max-width: 600px) {

                .secure-access-page {
                    min-height: 100dvh;
                    align-items: stretch;
                    padding: 12px;
                }

                .secure-access-shell {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .secure-access-card {
                    padding: 24px 18px 20px;
                    border-radius: 26px;
                }

                .secure-access-brand {
                    margin-bottom: 16px;
                }

                .secure-access-logo {
                    width: 96px;
                }

                .secure-access-orbit {
                    width: 88px;
                    height: 88px;
                    margin-bottom: 16px;
                }

                .secure-access-shield {
                    width: 60px;
                    height: 60px;
                    border-radius: 19px;
                }

                .secure-access-shield svg {
                    width: 34px;
                    height: 34px;
                }

                .secure-access-eyebrow {
                    font-size: 9px;
                    letter-spacing: 1.5px;
                }

                .secure-access-hero h1 {
                    font-size: 25px;
                    letter-spacing: -0.55px;
                }

                .secure-access-intro {
                    margin-top: 10px;
                    font-size: 12.5px;
                }

                .secure-access-progress {
                    margin-top: 24px;
                }

                .secure-access-stage {
                    min-height: 68px;
                }

                .secure-access-stage-copy {
                    padding-left: 12px;
                }

                .secure-access-stage-title {
                    font-size: 13px;
                }

                .secure-access-stage-description {
                    font-size: 11px;
                }

                .secure-access-status {
                    margin-top: 14px;
                    font-size: 10px;
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
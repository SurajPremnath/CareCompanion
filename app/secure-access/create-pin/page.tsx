"use client";

import React, {
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";

import { authService } from "@/lib/auth/authService";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import {
    validateInvitedUserLogin,
} from "@/lib/invitations/invitedUserLoginValidation";

import {
    resolveCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";


import {
    carevrAuthorizationHandoff,
} from "@/lib/authorization/carevrAuthorizationHandoff";

import {
    carevrContextResolver,
} from "@/lib/auth/carevrContextResolver";

export default function CreatePin() {
    const router = useRouter();

const [pin, setPin] = useState("");
const [confirmPin, setConfirmPin] = useState("");
const [showPin, setShowPin] = useState(false);
const [showConfirmPin, setShowConfirmPin] = useState(false);
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);
const [userName, setUserName] = useState("");

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
    validation.status === "ACCEPTED" ||
    validation.status === "PRIMARY"
) {
    /*
     * ---------------------------------------------------------
     * EXISTING CAREVR CONTEXT RESOLUTION
     *
     * PIN creation is complete.
     * CareVR eligibility / consent / role validation
     * has already completed above.
     *
     * Resolve the user's active CareVR contexts using
     * the same resolver used after PIN verification.
     * ---------------------------------------------------------
     */

    const availableContexts =
        await carevrContextResolver
            .getAvailableContexts(
                user.id
            );

    if (
        availableContexts.length === 0
    ) {
        throw new Error(
            "No active CareVR profiles are available for this account."
        );
    }

    if (
        availableContexts.length > 1
    ) {
        router.replace(
            "/profile-selection"
        );
        return;
    }

    /*
     * ---------------------------------------------------------
     * SINGLE CONTEXT
     *
     * Preserve the existing Dashboard handoff.
     * ---------------------------------------------------------
     */

    const dashboardRole =
        availableContexts[0]
            .loginRole;

    await resolveCareVRDashboardHandoff(
        user.id,
        dashboardRole
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

    return (
        <main className="create-pin-page">

            {/* ============================
                EXISTING CAREVR HEADER
            ============================ */}

<MobileHeader
    careMode="SELF"
    onCareModeChange={() => {}}
    userName={userName}

    showCareModeToggle={false}
    showSelfToggle={false}
    showFamilyToggle={false}

    showHomeButton={true}
    onHomeClick={() =>
        router.replace("/login")
    }

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

            {/* ============================
                MAIN CONTENT
            ============================ */}

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
        type={showPin ? "text" : "password"}
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

            `}</style>

        </main>
    );
}
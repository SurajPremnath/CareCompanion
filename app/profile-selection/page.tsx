"use client";

import React, {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import CareVRFooter from "@/Components/common/CareVRFooter";

import { authService } from "@/lib/auth/authService";

import {
    carevrContextResolver,
    type CareVRAvailableContext,
} from "@/lib/auth/carevrContextResolver";

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
    authSessionService,
} from "@/lib/analytics/authSessionService";

import CareVRDashboardHandoffAnimation from "@/Components/common/CareVRDashboardHandoffAnimation";

export default function ProfileSelectionPage() {

    const router = useRouter();

    const [
        availableContexts,
        setAvailableContexts,
    ] = useState<
        CareVRAvailableContext[]
    >([]);

    const [
        selectedContextId,
        setSelectedContextId,
    ] = useState<string | null>(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        continuing,
        setContinuing,
    ] = useState(false);

const [
    showDashboardHandoff,
    setShowDashboardHandoff,
] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        let cancelled = false;

        const loadContexts = async () => {

            try {

                setLoading(true);
                setError("");

                const user =
                    await authService.getCurrentUser();

                if (!user) {

                    router.replace("/login");

                    return;
                }

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

                if (
                    contexts.length === 0
                ) {

                    setError(
                        "No active CareVR profiles are available for this account."
                    );

                    return;
                }

                setAvailableContexts(
                    contexts
                );

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Unable to load CareVR profiles.",
                    err
                );

                setError(
                    "Unable to load your CareVR profiles."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        };

        void loadContexts();

        return () => {
            cancelled = true;
        };

    }, [router]);

    const getRoleIcon = (
        loginRole:
            CareVRAvailableContext["loginRole"]
    ) => {

        switch (loginRole) {

            case "SELF":
                return "👤";

            case "DOCTOR":
                return "🩺";

            case "CARETAKER":
                return "♡";

            case "FAMILY":
                return "👥";

            default:
                return "👤";
        }
    };


    /*
     * The selected context is handed back to Login.
     *
     * The Login page will re-resolve the user's
     * active CareVR contexts before continuing.
     */
const handleSelectedContext = async () => {

    if (
        continuing ||
        !selectedContextId
    ) {
        return;
    }

    try {

        setContinuing(true);
        setError("");

        const user =
            await authService.getCurrentUser();

        if (!user) {

            router.replace("/login");

            return;
        }

        /*
         * Re-resolve the user's active contexts before
         * accepting the selection.
         *
         * The UI selection itself is never authoritative.
         */
const {
    activeAccessRecords,
    contexts: currentContexts,
} =
    await carevrContextResolver
        .getAvailableContexts(
            user.id
        );

        const selectedContext =
            currentContexts.find(
                (context) =>
                    context.accessId ===
                    selectedContextId
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

        const selectedRole =
            selectedContext.loginRole ===
                "DOCTOR"
                ? "DOCTOR"
                : selectedContext.loginRole ===
                    "CARETAKER"
                    ? "CARETAKER"
                    : selectedContext.loginRole ===
                        "FAMILY"
                        ? "SECONDARY_FAMILY_MEMBER"
                        : "SELF";

        /*
         * Use the same normal CareVR login validation
         * used by the existing Login flow.
         */
        const validation =
            await validateInvitedUserLogin({
                email:
                    user.email ?? "",
                userId:
                    user.id,
                selectedRole,
                mode: "NORMAL",
            });

        if (
            validation.status ===
            "CONSENT_REQUIRED"
        ) {

            carevrAuthorizationHandoff.set({
                userId:
                    user.id,
                carevrRole:
                    selectedRole,
                familyId:
                    validation.familyId ??
                    selectedContext.familyId,
                patientId:
                    selectedContext.patientId,
                consentStage:
                    "POST_LOGIN",
                governanceId:
                    null,
                governanceVersion:
                    null,
            });

            router.replace(
                "/consent"
            );

            return;
        }

        if (
            validation.status ===
                "PRIMARY" ||
            validation.status ===
                "ACCEPTED" ||
            validation.status ===
                "NOT_INVITED"
        ) {

            const dashboardRole =
                selectedContext.loginRole;

            const carevrRole =
                selectedRole === "SELF"
                    ? "PRIMARY"
                    : selectedRole;

            carevrAuthorizationHandoff.set({
                userId:
                    user.id,
                carevrRole,
                familyId:
                    selectedContext.familyId,
                patientId:
                    selectedContext.patientId,
                consentStage:
                    "COMPLETED",
                governanceId:
                    null,
                governanceVersion:
                    null,
            });

const encryptionResponse =
    await fetch(
        "/api/security/legacy-patient-encryption",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                accessId:
                    selectedContext.accessId,
                selectedRole:
                    selectedRole === "SELF"
                        ? "SELF"
                        : selectedRole ===
                            "SECONDARY_FAMILY_MEMBER"
                            ? "FAMILY"
                            : selectedRole,
            }),
        }
    );

const encryptionResult =
    await encryptionResponse.json();

if (
    !encryptionResponse.ok ||
    !encryptionResult?.success
) {
    throw new Error(
        encryptionResult?.error ||
            "Unable to secure patient data."
    );
}

await resolveCareVRDashboardHandoff(
    user.id,
    dashboardRole,
    access
);

void authSessionService
    .start()
    .catch(() => {
        // Analytics must never block navigation.
    });

setShowDashboardHandoff(true);

await new Promise<void>((resolve) => {
    window.setTimeout(
        resolve,
        4250
    );
});

router.replace(
    "/dashboard"
);

return;
        }

        if (
            validation.status ===
                "ROLE_MISMATCH" ||
            validation.status ===
                "INVALID_INVITATION" ||
            validation.status ===
                "VALID_INVITATION"
        ) {

            throw new Error(
                validation.message
            );
        }

        throw new Error(
            validation.message
        );

    } catch (err) {

        console.error(
            "Unable to continue with the selected CareVR profile.",
            err
        );

        setError(
            err instanceof Error
                ? err.message
                : "Unable to continue with the selected CareVR profile."
        );

        setContinuing(false);
    }
};

if (showDashboardHandoff) {
    return (
        <CareVRDashboardHandoffAnimation
    onComplete={() => {
        router.replace("/dashboard");
    }}
/>
    );
}

return (
    <main className="profile-selection-page">

        <div className="profile-selection-shell">

                <header className="profile-selection-header">

{/* Home navigation intentionally removed.
    User must choose a CareVR profile/context. */}

                    <div className="profile-selection-brand">

                        <Image
                            src="/images/CareVR v1.0.png"
                            alt="CareVR"
                            width={180}
                            height={60}
                            priority
                            className="carevr-logo"
                        />

                    </div>

                    <div
                        className="header-spacer"
                        aria-hidden="true"
                    />

                </header>

                <section className="profile-selection-content">

                    <div className="profile-selection-heading">

                        <p className="eyebrow">
                            CareVR
                        </p>

                        <h1>
                            Continue as...
                        </h1>

                        <p className="subtitle">
                            Choose the profile you want
                            to use for this session.
                        </p>

                    </div>

                    {loading && (

                        <div className="state-message">
                            Loading your profiles...
                        </div>

                    )}

                    {!loading &&
                        error && (

                            <div
                                className="error-message"
                                role="alert"
                            >
                                {error}
                            </div>

                        )}

                    {!loading &&
                        !error &&
                        availableContexts.length > 0 && (

                            <>

                                <div className="profile-grid">

                                    {availableContexts.map(
                                        (context) => {

                                            const selected =
                                                selectedContextId ===
                                                context.accessId;

                                            return (
                                                <button
                                                    key={
                                                        context.accessId
                                                    }
                                                    type="button"
                                                    className={`profile-card ${
                                                        selected
                                                            ? "profile-card-selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedContextId(
                                                            context.accessId
                                                        )
                                                    }
                                                    disabled={
                                                        continuing
                                                    }
                                                    aria-pressed={
                                                        selected
                                                    }
                                                >

                                                    <span
                                                        className="profile-icon"
                                                        aria-hidden="true"
                                                    >
                                                        {
                                                            getRoleIcon(
                                                                context.loginRole
                                                            )
                                                        }
                                                    </span>

                                                    <span className="profile-label">
                                                        {
                                                            context.label
                                                        }
                                                    </span>

                                                    <span className="profile-description">

                                                        {context.loginRole ===
                                                            "SELF" &&
                                                            "Your personal CareVR profile"}

                                                        {context.loginRole ===
                                                            "DOCTOR" &&
                                                            "Access your assigned doctor context"}

                                                        {context.loginRole ===
                                                            "CARETAKER" &&
                                                            "Care for the people assigned to you"}

                                                        {context.loginRole ===
                                                            "FAMILY" &&
                                                            "Access your family care context"}

                                                    </span>

                                                    {selected && (

                                                        <span
                                                            className="profile-selected-indicator"
                                                            aria-hidden="true"
                                                        >
                                                            ✓
                                                        </span>

                                                    )}

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                                <button
                                    type="button"
                                    className="continue-button"
                                    onClick={
                                        handleSelectedContext
                                    }
                                    disabled={
                                        !selectedContextId ||
                                        continuing
                                    }
                                >
                                    {continuing
                                        ? "Continuing..."
                                        : "Continue"}
                                </button>

                            </>

                        )}

                    <CareVRFooter />

                </section>

            </div>

            <style jsx>{`

                .profile-selection-page {
                    min-height: 100vh;
                    background: #ffffff;
                    color: #172033;
                    display: flex;
                    justify-content: center;
                    box-sizing: border-box;
                }

                .profile-selection-shell {
                    width: 100%;
                    max-width: 960px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    padding: 0 24px;
                    box-sizing: border-box;
                }

                .profile-selection-header {
                    width: 100%;
                    min-height: 84px;
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    border-bottom: 1px solid #eef0f4;
                }

                .profile-selection-brand {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .carevr-logo {
                    width: auto;
                    height: 46px;
                    object-fit: contain;
                }

                .header-spacer {
                    width: 1px;
                }

                .profile-selection-content {
                    width: 100%;
                    max-width: 760px;
                    margin: 0 auto;
                    padding: 58px 0 30px;
                    box-sizing: border-box;
                }

                .profile-selection-heading {
                    text-align: center;
                    margin-bottom: 34px;
                }

                .eyebrow {
                    margin: 0 0 8px;
                    color: #7b8799;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                h1 {
                    margin: 0;
                    color: #172033;
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .subtitle {
                    margin: 10px auto 0;
                    max-width: 500px;
                    color: #7a8597;
                    font-size: 14px;
                    line-height: 1.55;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(210px, 1fr)
                        );
                    gap: 16px;
                }

                .profile-card {
                    position: relative;
                    min-height: 190px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 28px 20px;
                    border: 1px solid #e6e9ef;
                    border-radius: 18px;
                    background: #ffffff;
                    box-shadow:
                        0 4px 18px
                        rgba(23, 32, 51, 0.04);
                    cursor: pointer;
                    transition:
                        border-color 0.18s ease,
                        box-shadow 0.18s ease,
                        transform 0.18s ease;
                    box-sizing: border-box;
                    text-align: center;
                }

                .profile-card:hover {
                    border-color: #cfd5df;
                    box-shadow:
                        0 8px 24px
                        rgba(23, 32, 51, 0.08);
                    transform: translateY(-2px);
                }

                .profile-card-selected {
                    border-color: #172033;
                    box-shadow:
                        0 8px 28px
                        rgba(23, 32, 51, 0.11);
                }

                .profile-icon {
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    border-radius: 50%;
                    background: #f5f7fa;
                    font-size: 28px;
                    line-height: 1;
                }

                .profile-label {
                    color: #172033;
                    font-size: 17px;
                    line-height: 1.3;
                    font-weight: 700;
                }

                .profile-description {
                    margin-top: 7px;
                    max-width: 190px;
                    color: #8a94a8;
                    font-size: 11px;
                    line-height: 1.45;
                }

                .profile-selected-indicator {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #172033;
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 700;
                }

                .continue-button {
                    width: 100%;
                    height: 48px;
                    margin-top: 24px;
                    border: 0;
                    border-radius: 10px;
                    background: #172033;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition:
                        opacity 0.18s ease,
                        transform 0.18s ease;
                }

                .continue-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .continue-button:disabled {
                    opacity: 0.42;
                    cursor: not-allowed;
                }

                .state-message {
                    padding: 40px 20px;
                    text-align: center;
                    color: #7a8597;
                    font-size: 14px;
                }

                .error-message {
                    padding: 14px 16px;
                    border: 1px solid #ead7d7;
                    border-radius: 10px;
                    background: #fff8f8;
                    color: #9a4545;
                    font-size: 13px;
                    line-height: 1.5;
                    text-align: center;
                }

                @media (max-width: 640px) {

                    .profile-selection-shell {
                        padding: 0 16px;
                    }

                    .profile-selection-header {
                        min-height: 72px;
                    }

                    .carevr-logo {
                        height: 38px;
                        width: auto;
                    }


                    .profile-selection-content {
                        padding-top: 42px;
                    }

                    h1 {
                        font-size: 26px;
                    }

                    .subtitle {
                        font-size: 13px;
                    }

                    .profile-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }

                    .profile-card {
                        min-height: 150px;
                    }

                }

            `}</style>

        </main>
    );
}
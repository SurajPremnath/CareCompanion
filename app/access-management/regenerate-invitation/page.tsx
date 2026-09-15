"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    RefreshCw,
} from "lucide-react";

import {
    authService,
} from "@/lib/auth/authService";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import {
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter
    from "@/Components/common/CareVRFooter";

import LanguageSelector
    from "@/Components/language/LanguageSelector";

import {
    getRegenerableInvitations,
    type RegenerableInvitation
} from "./actions";

import {
    regenerateInvitation,
    type RegenerateInvitationResult
} from "./regenerate-invitation-actions";

// ============================================================
// Regenerate Invitation
//
// Purpose:
// Dedicated UI for regenerating an existing invitation.
//
// Scope:
// Select an existing pending invitation, execute the
// authoritative regeneration transaction, and display the
// newly generated invitation credentials/template.
//
// This page does not directly modify invitation, access,
// permission, consent, or patient tables.
// ============================================================


type RegenerationRole =
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";


type RegenerationUser = {
    fullName: string;
    email: string;
};


export default function RegenerateInvitationPage() {

    const router =
        useRouter();


    const [
        user,
        setUser,
    ] =
        useState<RegenerationUser | null>(
            null
        );


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        consentGranted,
        setConsentGranted,
    ] =
        useState(false);


    const [
        loggingOut,
        setLoggingOut,
    ] =
        useState(false);


    const [
        accountMenuOpen,
        setAccountMenuOpen,
    ] =
        useState(false);


    const [
        careMode,
        setCareMode,
    ] =
        useState<MobileCareMode>(
            "FAMILY"
        );


    const [
        selectedRole,
        setSelectedRole,
    ] =
        useState<
            RegenerationRole | ""
        >("");


    const [
        selectedEmail,
        setSelectedEmail,
    ] =
        useState("");


    const [
        selectedInvitationId,
        setSelectedInvitationId,
    ] =
        useState("");


    const [
        selectedAttemptNumber,
        setSelectedAttemptNumber,
    ] =
        useState<number | null>(
            null
        );


    const [
        invitedEmails,
        setInvitedEmails,
    ] =
        useState<RegenerableInvitation[]>([]);


    const [
        loadingInvitations,
        setLoadingInvitations,
    ] =
        useState(false);


    const [
        regenerating,
        setRegenerating,
    ] =
        useState(false);


    const [
        regenerationResult,
        setRegenerationResult,
    ] =
        useState<RegenerateInvitationResult | null>(
            null
        );


    const [
        templateCopied,
        setTemplateCopied,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );


    //--------------------------------------------------------
    // Load authenticated user using the same pattern as the
    // existing Access Management pages.
    //--------------------------------------------------------

    useEffect(() => {

        let cancelled = false;


        async function loadUser() {

            try {

                const authUser =
                    await authService
                        .getCurrentUser();


                if (!authUser) {

                    router.replace(
                        "/login"
                    );

                    return;
                }


                const profile =
                    await profileRepository
                        .getCurrentProfile();


                const consent =
                    await consentStorage
                        .hasAcceptedCurrentConsent();


                if (!profile) {

                    await authService.logout();

                    router.replace(
                        "/login"
                    );

                    return;
                }


                if (!cancelled) {

                    setConsentGranted(
                        consent
                    );

                    setUser({
                        fullName:
                            profile.fullName,

                        email:
                            authUser.email ?? "",
                    });

                }

            }
            catch (loadError) {

                console.error(
                    "Unable to load Regenerate Invitation page.",
                    loadError
                );

                try {

                    await authService.logout();

                }
                catch {
                    // Ignore logout failure.
                }


                router.replace(
                    "/login"
                );

            }
            finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }


        void loadUser();


        return () => {

            cancelled = true;

        };

    }, [router]);


    //--------------------------------------------------------
    // Mobile Header actions
    //--------------------------------------------------------

    const handleLogout =
        async () => {

            if (loggingOut) {
                return;
            }


            setLoggingOut(true);

            setAccountMenuOpen(false);


            try {

                await authService.logout();

                router.replace(
                    "/login"
                );

            }
            catch (logoutError) {

                console.error(
                    "Unable to log out.",
                    logoutError
                );

                setLoggingOut(false);

            }

        };


    //--------------------------------------------------------
    // Role change
    //--------------------------------------------------------

    const handleRoleChange =
        async (
            role:
                RegenerationRole | ""
        ) => {

            setSelectedRole(
                role
            );

            setSelectedEmail(
                ""
            );

            setSelectedInvitationId(
                ""
            );

            setSelectedAttemptNumber(
                null
            );

            setInvitedEmails(
                []
            );

            setRegenerationResult(
                null
            );

            setTemplateCopied(
                false
            );

            setError(
                null
            );

            if (!role) {
                return;
            }

            setLoadingInvitations(
                true
            );

            try {

                const result =
                    await getRegenerableInvitations(
                        role
                    );

                setInvitedEmails(
                    result.invitations
                );

                if (
                    result.invitations.length === 0
                ) {
                    setError(
                        "No pending invitations are available for the selected role."
                    );
                }

            }
            catch (lookupError) {

                console.error(
                    "Unable to load pending invitations.",
                    lookupError
                );

                setError(
                    "Unable to load pending invitations. Please try again."
                );

            }
            finally {

                setLoadingInvitations(
                    false
                );

            }

        };


    //--------------------------------------------------------
    // Invitation selection
    //--------------------------------------------------------

    const handleInvitationChange =
        (
            invitationId: string
        ) => {

            const invitation =
                invitedEmails.find(
                    item =>
                        item.id ===
                        invitationId
                );


            setSelectedInvitationId(
                invitationId
            );

            setSelectedEmail(
                invitation?.email ??
                ""
            );

            setSelectedAttemptNumber(
                invitation?.attemptNumber ??
                null
            );

            setRegenerationResult(
                null
            );

            setTemplateCopied(
                false
            );

            setError(
                null
            );

        };


    //--------------------------------------------------------
    // Regeneration
    //
    // The selected invitation ID is passed to the server
    // action. The server action calls the authoritative
    // recreate_carevr_invitation database function.
    //--------------------------------------------------------

    const handleRegenerate =
        async () => {

            if (
                regenerating ||
                !selectedInvitationId
            ) {
                return;
            }


            setRegenerating(
                true
            );

            setError(
                null
            );

            setRegenerationResult(
                null
            );

            setTemplateCopied(
                false
            );


            try {

                const result =
                    await regenerateInvitation(
                        selectedInvitationId
                    );

                setRegenerationResult(
                    result
                );

                setSelectedAttemptNumber(
                    result.invitationAttemptNumber
                );

            }
            catch (regenerationError) {

                console.error(
                    "Unable to regenerate invitation.",
                    regenerationError
                );

                setError(
                    regenerationError instanceof Error
                        ? regenerationError.message
                        : "Unable to regenerate the invitation. Please try again."
                );

            }
            finally {

                setRegenerating(
                    false
                );

            }

        };


    //--------------------------------------------------------
    // Copy regenerated invitation template.
    //--------------------------------------------------------

    const handleCopyTemplate =
        async () => {

            if (
                !regenerationResult?.templateBody
            ) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    regenerationResult.templateBody
                );

                setTemplateCopied(
                    true
                );

            }
            catch (copyError) {

                console.error(
                    "Unable to copy invitation template.",
                    copyError
                );

                setError(
                    "Unable to copy the invitation template. Please select and copy it manually."
                );

            }

        };


    if (loading) {

        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, " +
                        "\"Segoe UI\", sans-serif",
                    color: "#15203d",
                }}
            >
                Loading...
            </main>
        );

    }


    if (!user) {
        return null;
    }


    return (

        <main className="regenerate-invitation-page">

            <div className="regenerate-invitation-shell">

                <MobileHeader
                    careMode={
                        careMode
                    }
                    onCareModeChange={
                        setCareMode
                    }
                    userName={
                        user.fullName
                    }
                    showCareModeToggle={
                        false
                    }
                    showHomeButton={
                        true
                    }
                    onHomeClick={() =>
                        router.push(
                            "/dashboard"
                        )
                    }
                    accountMenuOpen={
                        accountMenuOpen
                    }
                    onAccountMenuToggle={() =>
                        setAccountMenuOpen(
                            value =>
                                !value
                        )
                    }
                    consentGranted={
                        consentGranted
                    }
                    canAddPatient={false}
                    onAddPatient={() =>
                        router.push(
                            "/add-patient"
                        )
                    }
                    onCareVRJourney={() =>
                        router.push(
                            "/dashboard"
                        )
                    }
                    onHelp={() =>
                        router.push(
                            "/help"
                        )
                    }
                    languageSelector={
                        <LanguageSelector />
                    }
                    onLogout={
                        handleLogout
                    }
                    loggingOut={
                        loggingOut
                    }
                />


                <section className="regenerate-invitation-content">

                    <div className="regenerate-breadcrumb">

                        <span>
                            Access Management
                        </span>

                        <span aria-hidden="true">
                            /
                        </span>

                        <strong>
                            Regenerate Invitation
                        </strong>

                    </div>


                    <div className="regenerate-card">

                        <div className="regenerate-icon">

                            <RefreshCw
                                size={28}
                                strokeWidth={2}
                            />

                        </div>


                        <h1>
                            Regenerate Invitation
                        </h1>


                        <p className="regenerate-introduction">
                            Regenerate an existing invitation
                            when you forgot to send the
                            invitation or temporary password.
                        </p>


                        <div className="regenerate-notice">

                            <strong>
                                This can be done only once.
                            </strong>

                            <span>
                                Regenerating the invitation will
                                close the current invitation and
                                create a new invitation with a
                                new temporary password.
                            </span>

                        </div>


                        <div className="regenerate-form">

                            <div className="regenerate-field">

                                <label
                                    htmlFor="regenerate-role"
                                >
                                    Role
                                </label>

                                <select
                                    id="regenerate-role"
                                    value={
                                        selectedRole
                                    }
                                    disabled={
                                        regenerating
                                    }
                                    onChange={
                                        event =>
                                            handleRoleChange(
                                                event.target.value as
                                                    | RegenerationRole
                                                    | ""
                                            )
                                    }
                                >

                                    <option value="">
                                        Select role
                                    </option>

                                    <option value="SECONDARY_FAMILY_MEMBER">
                                        Secondary Family Member
                                    </option>

                                    <option value="CARETAKER">
                                        Caretaker
                                    </option>

                                    <option value="DOCTOR">
                                        Doctor
                                    </option>

                                </select>

                            </div>


                            <div className="regenerate-field">

                                <label
                                    htmlFor="regenerate-email"
                                >
                                    Invitation
                                </label>

                                <select
                                    id="regenerate-email"
                                    value={
                                        selectedInvitationId
                                    }
                                    disabled={
                                        !selectedRole ||
                                        loadingInvitations ||
                                        invitedEmails.length === 0 ||
                                        regenerating
                                    }
                                    onChange={
                                        event =>
                                            handleInvitationChange(
                                                event.target.value
                                            )
                                    }
                                >

                                    <option value="">
                                        {!selectedRole
                                            ? "Select role first"
                                            : loadingInvitations
                                                ? "Loading invitations..."
                                                : invitedEmails.length === 0
                                                    ? "No pending invitations"
                                                    : "Select invitation"}
                                    </option>

                                    {invitedEmails.map(
                                        invitation => (
                                            <option
                                                key={
                                                    invitation.id
                                                }
                                                value={
                                                    invitation.id
                                                }
                                            >
                                                {
                                                    invitation.email
                                                }
                                                
                                            </option>
                                        )
                                    )}

                                </select>

                                <p className="regenerate-field-help">
                                    Select the existing pending invitation
                                    that you want to replace.
                                </p>

                            </div>


                            <div className="regenerate-details">

                                <div className="regenerate-detail">

                                    <span>
                                        Invitation Attempt
                                    </span>

                                    <strong>
                                        {
                                            selectedAttemptNumber ??
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="regenerate-detail">

                                    <span>
                                        Reason
                                    </span>
<strong>
    {
        selectedAttemptNumber !== null &&
        selectedAttemptNumber > 1
            ? "Invitation Limit crossed. Hence cant regenerate invite"
            : "Forgot to send invite"
    }
</strong>

                                </div>

                            </div>


                            {error && (

                                <div
                                    className="regenerate-error"
                                    role="alert"
                                >
                                    {error}
                                </div>

                            )}


                            <button
                                type="button"
                                className="regenerate-button"
                                disabled={
    !selectedInvitationId ||
    selectedAttemptNumber !== 1 ||
    regenerating ||
    Boolean(regenerationResult)
}
                                onClick={
                                    handleRegenerate
                                }
                            >

                                <RefreshCw
                                    size={17}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                <span>
                                    {
                                        regenerating
                                            ? "Regenerating Invitation..."
                                            : "Regenerate Invitation"
                                    }
                                </span>

                            </button>


                            {regenerationResult && (

                                <div className="regenerate-result">

                                    <div className="regenerate-result-header">

                                        <strong>
                                            Invitation regenerated
                                        </strong>

                                        <span>
                                            Attempt {
                                                regenerationResult
                                                    .invitationAttemptNumber
                                            }
                                        </span>

                                    </div>


                                    <div className="regenerate-result-detail">

                                        <span>
                                            Invitee
                                        </span>

                                        <strong>
                                            {
                                                regenerationResult.email
                                            }
                                        </strong>

                                    </div>


                                    <div className="regenerate-result-detail">

                                        <span>
                                            Temporary Password
                                        </span>

                                        <strong className="regenerate-secret">
                                            {
                                                regenerationResult
                                                    .temporaryPassword
                                            }
                                        </strong>

                                    </div>


                                    <div className="regenerate-result-detail">

                                        <span>
                                            Temporary Password Expires
                                        </span>

                                        <strong>
                                            {
                                                new Date(
                                                    regenerationResult
                                                        .temporaryPasswordExpiresAt
                                                ).toLocaleString()
                                            }
                                        </strong>

                                    </div>


                                    <div className="regenerate-result-detail">

                                        <span>
                                            Invitation Expires
                                        </span>

                                        <strong>
                                            {
                                                new Date(
                                                    regenerationResult
                                                        .invitationExpiresAt
                                                ).toLocaleString()
                                            }
                                        </strong>

                                    </div>


                                    <div className="regenerate-template">

                                        <div className="regenerate-template-header">

                                            <span>
                                                Invitation Template
                                            </span>

                                        </div>


                                        <pre>
                                            {
                                                regenerationResult
                                                    .templateBody
                                            }
                                        </pre>

                                    </div>


                                    <button
                                        type="button"
                                        className="copy-template-button"
                                        onClick={
                                            handleCopyTemplate
                                        }
                                    >
                                        <span>
                                            {
                                                templateCopied
                                                    ? "Template Copied"
                                                    : "Copy Template"
                                            }
                                        </span>
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                <CareVRFooter />

            </div>


            <style jsx global>{`

                * {
                    box-sizing: border-box;
                }


                html,
                body {
                    margin: 0;
                    padding: 0;
                    min-height: 100%;
                }


                body {
                    background: #f8fbff;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    color: #15203d;
                }


                button,
                select {
                    font: inherit;
                }


                .regenerate-invitation-page {
                    min-height: 100vh;
                    min-height: 100dvh;
                    background:
                        linear-gradient(
                            180deg,
                            #f8fbff 0%,
                            #ffffff 52%,
                            #f4f9ff 100%
                        );
                    padding: 0 12px;
                }


                .regenerate-invitation-shell {
                    width: 100%;
                    max-width: 760px;
                    min-height: 100vh;
                    min-height: 100dvh;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                }


                .regenerate-invitation-content {
                    flex: 1 0 auto;
                    width: 100%;
                    padding: 28px 8px 34px;
                }


                .regenerate-breadcrumb {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 18px;
                    color: #6b7d9c;
                    font-size: 13px;
                    line-height: 1.4;
                }


                .regenerate-breadcrumb strong {
                    color: #24416f;
                    font-weight: 700;
                }


                .regenerate-card {
                    width: 100%;
                    max-width: 620px;
                    margin: 0 auto;
                    padding: 30px 26px;
                    border: 1px solid #dce8f5;
                    border-radius: 20px;
                    background: #ffffff;
                    box-shadow:
                        0 7px 25px
                        rgba(34, 72, 118, 0.055);
                }


                .regenerate-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #fff4e7;
                    color: #c56a12;
                }


                .regenerate-card h1 {
                    margin: 0;
                    text-align: center;
                    color: #13265a;
                    font-size:
                        clamp(28px, 7vw, 38px);
                    line-height: 1.15;
                    font-weight: 800;
                    letter-spacing: -0.4px;
                }


                .regenerate-introduction {
                    max-width: 520px;
                    margin: 12px auto 22px;
                    text-align: center;
                    color: #53698f;
                    font-size: 15px;
                    line-height: 1.5;
                }


                .regenerate-notice {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 24px;
                    padding: 14px 15px;
                    border-left: 3px solid #d49a48;
                    border-radius: 0 10px 10px 0;
                    background: #fffbf3;
                }


                .regenerate-notice strong {
                    color: #765719;
                    font-size: 13px;
                    line-height: 1.35;
                }


                .regenerate-notice span {
                    color: #806e48;
                    font-size: 12px;
                    line-height: 1.5;
                }


                .regenerate-form {
                    width: 100%;
                }


                .regenerate-field {
                    margin-bottom: 17px;
                }


                .regenerate-field label {
                    display: block;
                    margin-bottom: 7px;
                    color: #244b7f;
                    font-size: 12px;
                    font-weight: 800;
                }


                .regenerate-field select {
                    width: 100%;
                    min-height: 48px;
                    padding: 0 13px;
                    border: 1px solid #cddded;
                    border-radius: 12px;
                    outline: none;
                    background: #ffffff;
                    color: #15203d;
                    font-size: 14px;
                }


                .regenerate-field select:focus {
                    border-color: #7eafe4;
                    box-shadow:
                        0 0 0 3px
                        rgba(47, 120, 212, 0.08);
                }


                .regenerate-field select:disabled {
                    background: #f5f8fb;
                    color: #93a1b5;
                    cursor: not-allowed;
                }


                .regenerate-field-help {
                    margin:
                        7px 2px 0;
                    color: #7b8ba1;
                    font-size: 11px;
                    line-height: 1.45;
                }


                .regenerate-details {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                    gap: 10px;
                    margin: 4px 0 18px;
                }


                .regenerate-detail {
                    min-width: 0;
                    padding: 13px;
                    border: 1px solid #e0e8f1;
                    border-radius: 12px;
                    background: #f9fbfd;
                }


                .regenerate-detail span {
                    display: block;
                    margin-bottom: 5px;
                    color: #7b8ba1;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }


                .regenerate-detail strong {
                    display: block;
                    color: #24416f;
                    font-size: 12px;
                    line-height: 1.4;
                    overflow-wrap: anywhere;
                }


                .regenerate-error {
                    margin-bottom: 14px;
                    padding: 11px 13px;
                    border: 1px solid #efcaca;
                    border-radius: 10px;
                    background: #fff6f6;
                    color: #9b3d3d;
                    font-size: 12px;
                    line-height: 1.45;
                }


                .regenerate-button {
                    width: 100%;
                    min-height: 49px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border: 0;
                    border-radius: 12px;
                    background: #c56a12;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow:
                        0 8px 18px
                        rgba(197, 106, 18, 0.18);
                }


                .regenerate-button:disabled {
                    background: #cbd4df;
                    box-shadow: none;
                    cursor: not-allowed;
                }


                .regenerate-result {
                    margin-top: 20px;
                    padding: 16px;
                    border: 1px solid #cfe4d5;
                    border-radius: 14px;
                    background: #f7fcf8;
                }


                .regenerate-result-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 14px;
                    padding-bottom: 11px;
                    border-bottom: 1px solid #dcecdf;
                }


                .regenerate-result-header strong {
                    color: #285d38;
                    font-size: 14px;
                    font-weight: 800;
                }


                .regenerate-result-header span {
                    flex-shrink: 0;
                    color: #5d7a65;
                    font-size: 11px;
                    font-weight: 700;
                }


                .regenerate-result-detail {
                    margin-bottom: 11px;
                }


                .regenerate-result-detail span {
                    display: block;
                    margin-bottom: 4px;
                    color: #718679;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }


                .regenerate-result-detail strong {
                    display: block;
                    color: #244b32;
                    font-size: 13px;
                    line-height: 1.45;
                    overflow-wrap: anywhere;
                }


                .regenerate-secret {
                    padding: 9px 10px;
                    border: 1px dashed #b8d4be;
                    border-radius: 8px;
                    background: #ffffff;
                    font-family:
                        "SFMono-Regular",
                        Consolas,
                        "Liberation Mono",
                        monospace;
                    font-size: 14px !important;
                    letter-spacing: 0.04em;
                }


                .regenerate-template {
                    margin-top: 16px;
                    border: 1px solid #dcecdf;
                    border-radius: 10px;
                    overflow: hidden;
                    background: #ffffff;
                }


                .regenerate-template-header {
                    padding: 9px 11px;
                    border-bottom: 1px solid #dcecdf;
                    background: #f3faf5;
                    color: #41664c;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }


                .regenerate-template pre {
                    margin: 0;
                    padding: 12px;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                    color: #294132;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    font-size: 12px;
                    line-height: 1.55;
                }


                .copy-template-button {
                    width: 100%;
                    min-height: 44px;
                    margin-top: 10px;
                    border: 1px solid #b8d8c1;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #285d38;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                }


                .copy-template-button:hover {
                    background: #f3faf5;
                }


                .copy-template-button:active {
                    background: #eaf6ee;
                }


                @media (max-width: 520px) {

                    .regenerate-invitation-page {
                        padding: 0 9px;
                    }


                    .regenerate-invitation-content {
                        padding:
                            22px 4px 28px;
                    }


                    .regenerate-card {
                        padding:
                            24px 16px;
                        border-radius: 17px;
                    }


                    .regenerate-icon {
                        width: 58px;
                        height: 58px;
                    }


                    .regenerate-card h1 {
                        font-size: 29px;
                    }


                    .regenerate-introduction {
                        font-size: 14px;
                    }


                    .regenerate-details {
                        grid-template-columns: 1fr;
                    }


                    .regenerate-result-header {
                        align-items: flex-start;
                        flex-direction: column;
                        gap: 4px;
                    }

                }

            `}</style>

        </main>

    );
}
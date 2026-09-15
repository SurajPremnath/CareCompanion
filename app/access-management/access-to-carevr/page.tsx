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

import {
    supabase,
} from "@/lib/supabase";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import {
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

import {
    productInvitationTemplate,
} from "@/lib/invitations/productInvitationTemplate";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";

import LanguageSelector from "@/Components/language/LanguageSelector";


type AccessToCareVRUser = {
    fullName: string;
};


export default function AccessToCareVRPage() {

    const router =
        useRouter();


    const [
        user,
        setUser,
    ] =
        useState<AccessToCareVRUser | null>(
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
        email,
        setEmail,
    ] =
        useState("");


    const [
        created,
        setCreated,
    ] =
        useState(false);


    const [
        activationLink,
        setActivationLink,
    ] =
        useState("");

    const [
        invitationTemplateSubject,
        setInvitationTemplateSubject,
    ] =
        useState("");


    const [
        invitationTemplateBody,
        setInvitationTemplateBody,
    ] =
        useState("");


    const [
        invitationTemplateCopied,
        setInvitationTemplateCopied,
    ] =
        useState(false);

    //--------------------------------------------------------
    // Load authenticated user for the existing CareVR header.
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
                    });

                }

            }
            catch (error) {

                console.error(
                    "Unable to load Access to CareVR page.",
                    error
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

    const handleAddPatient =
        () => {

            setAccountMenuOpen(false);

            router.push(
                "/add-patient"
            );

        };


    const handleCareVRJourney =
        () => {

            setAccountMenuOpen(false);

            router.push(
                "/dashboard"
            );

        };


    const handleHelp =
        () => {

            setAccountMenuOpen(false);

            router.push(
                "/help"
            );

        };


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
            catch (error) {

                console.error(
                    "Unable to log out.",
                    error
                );

                setLoggingOut(false);

            }

        };


    //--------------------------------------------------------
    // Product Invitation UI
    //--------------------------------------------------------

const handleCreateInvitation =
    async () => {

        const normalizedEmail =
            email.trim().toLowerCase();


        if (!normalizedEmail) {
            return;
        }


        try {

const {
    data: {
        session,
    },
} =
    await supabase.auth.getSession();


if (!session?.access_token) {

    throw new Error(
        "Authentication is required."
    );

}


const response =
    await fetch(
        "/api/access-management/access-to-carevr/invitations",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
                Authorization:
                    `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                email:
                    normalizedEmail,
            }),
        }
    );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ??
                    "Unable to create invitation."
                );

            }


            const token =
                result.activationToken;


            if (
                typeof token !== "string" ||
                !token
            ) {

                throw new Error(
                    "Activation token was not returned."
                );

            }


const activationUrl =
    `https://carevr.in/register?productInvitationToken=${encodeURIComponent(
        token
    )}`;


            const template =
                productInvitationTemplate.create({
                    inviteeEmail:
                        normalizedEmail,
                    activationUrl,
                    expiresAt:
                        "7 days from creation",
                });


            setEmail(
                normalizedEmail
            );

            setActivationLink(
                activationUrl
            );

            setInvitationTemplateSubject(
                template.subject
            );

            setInvitationTemplateBody(
                template.body
            );

            setCreated(true);

        }
        catch (error) {

            console.error(
                "Unable to create CareVR invitation.",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to create invitation."
            );

        }

    };


    const handleCopyLink =
        async () => {

            if (!activationLink) {
                return;
            }

            await navigator.clipboard.writeText(
                activationLink
            );

        };


    const handleCopyInvitationTemplate =
        async () => {

            if (
                !invitationTemplateSubject ||
                !invitationTemplateBody
            ) {
                return;
            }

            const template =
                `Subject: ${invitationTemplateSubject}\n\n${invitationTemplateBody}`;

            await navigator.clipboard.writeText(
                template
            );

            setInvitationTemplateCopied(
                true
            );

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

        <main className="access-carevr-page">


            <MobileHeader
                careMode={careMode}
                onCareModeChange={setCareMode}
                userName={user.fullName}
                showCareModeToggle={false}
                showHomeButton={true}
                onHomeClick={() =>
                    router.push("/dashboard")
                }
                accountMenuOpen={accountMenuOpen}
                onAccountMenuToggle={() =>
                    setAccountMenuOpen(
                        value => !value
                    )
                }
                consentGranted={consentGranted}
                canAddPatient={false}
                onAddPatient={handleAddPatient}
                onCareVRJourney={handleCareVRJourney}
                onHelp={handleHelp}
                languageSelector={<LanguageSelector />}
                onLogout={handleLogout}
                loggingOut={loggingOut}
            />


            <div className="access-carevr-shell">


                <div className="access-carevr-breadcrumb">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/access-management"
                            )
                        }
                    >
                        Access Management
                    </button>

                    <span>/</span>

                    <span>
                        Access to CareVR
                    </span>

                </div>


                <section className="access-carevr-header">

                    <span className="access-carevr-eyebrow">
                        ACCESS MANAGEMENT
                    </span>

                    <h1>
                        Access to CareVR
                    </h1>

                    <p>
                        Invite a person to access the CareVR
                        application.
                    </p>

                </section>


                <section className="access-carevr-card">

                    <div className="access-carevr-card-header">

                        <h2>
                            Create an Invitation
                        </h2>

                        <p>
                            Enter the email address of the
                            person you want to invite.
                        </p>

                    </div>


                    <div className="access-carevr-field">

                        <label htmlFor="invitee-email">
                            Email address
                        </label>

                        <input
                            id="invitee-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="name@example.com"
                            autoComplete="email"
                            disabled={created}
                        />

                    </div>


                    <div className="access-carevr-validity">

                        <span>
                            Invitation validity
                        </span>

                        <strong>
                            7 days
                        </strong>

                    </div>


                    <div className="access-carevr-security">

                        <strong>
                            Important
                        </strong>

                        <p>
                            This link is single-use and expires
                            automatically. Do not share it with
                            anyone other than the intended
                            invitee.
                        </p>

                    </div>


                    {created && (

                        <div className="access-carevr-template-section">

                            <div className="access-carevr-template-header">

                                <label>
                                    Founder Product Invitation Template
                                </label>

                                <p>
                                    Copy this message and send it to the
                                    invitee using your preferred
                                    communication method.
                                </p>

                            </div>


                            <div className="access-carevr-template-box">

                                <strong>
                                    Subject: {invitationTemplateSubject}
                                </strong>

                                <pre>
                                    {invitationTemplateBody}
                                </pre>

                            </div>


                            <button
                                type="button"
                                className={
                                    invitationTemplateCopied
                                        ? "access-carevr-copy-button access-carevr-copy-button-copied"
                                        : "access-carevr-copy-button"
                                }
                                onClick={
                                    handleCopyInvitationTemplate
                                }
                            >
                                {invitationTemplateCopied
                                    ? "✓ Template Copied"
                                    : "Copy Template"}
                            </button>

                        </div>

                    )}


                    <button
                        type="button"
                        className="access-carevr-primary-button"
                        onClick={
                            handleCreateInvitation
                        }
                        disabled={
                            !email.trim() ||
                            created
                        }
                    >
                        Create Invitation
                    </button>

                </section>


                <aside className="access-carevr-flow">

                    <h3>
                        How CareVR access works
                    </h3>


                    <div className="access-carevr-flow-step">

                        <span>1</span>

                        <div>

                            <strong>
                                Invitation
                            </strong>

                            <p>
                                A secure invitation link is created.
                            </p>

                        </div>

                    </div>


                    <div className="access-carevr-flow-step">

                        <span>2</span>

                        <div>

                            <strong>
                                Identity
                            </strong>

                            <p>
                                The invitee establishes their
                                CareVR identity.
                            </p>

                        </div>

                    </div>


                    <div className="access-carevr-flow-step">

                        <span>3</span>

                        <div>

                            <strong>
                                Authentication
                            </strong>

                            <p>
                                The invitee establishes credentials
                                and completes required MFA.
                            </p>

                        </div>

                    </div>


                    <div className="access-carevr-flow-step">

                        <span>4</span>

                        <div>

                            <strong>
                                CareVR Authorization
                            </strong>

                            <p>
                                Existing CareVR access governance
                                determines permitted access.
                            </p>

                        </div>

                    </div>

                </aside>


            </div>


            <CareVRFooter />

            <style jsx>{`

                .access-carevr-page {
                    min-height: 100vh;
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                }

                .access-carevr-shell {
                    width: min(1100px, calc(100% - 40px));
                    margin: 0 auto;
                    padding: 28px 0 60px;
                    flex: 1;
                }

                .access-carevr-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #64748b;
                    margin-bottom: 28px;
                }

                .access-carevr-breadcrumb button {
                    border: none;
                    background: transparent;
                    padding: 0;
                    color: #6d28d9;
                    cursor: pointer;
                    font: inherit;
                }

                .access-carevr-header {
                    margin-bottom: 28px;
                }

                .access-carevr-eyebrow {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    color: #7c3aed;
                }

                .access-carevr-header h1 {
                    margin: 0;
                    font-size: 32px;
                    line-height: 1.2;
                    color: #172033;
                }

                .access-carevr-header p {
                    margin: 10px 0 0;
                    font-size: 16px;
                    color: #64748b;
                }

                .access-carevr-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 28px;
                    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
                }

                .access-carevr-card-header {
                    margin-bottom: 26px;
                }

                .access-carevr-card-header h2 {
                    margin: 0;
                    font-size: 21px;
                    color: #172033;
                }

                .access-carevr-card-header p {
                    margin: 7px 0 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .access-carevr-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 18px;
                }

                .access-carevr-field label,
                .access-carevr-link-section label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #334155;
                }

                .access-carevr-field input {
                    width: 100%;
                    box-sizing: border-box;
                    border: 1px solid #cbd5e1;
                    border-radius: 9px;
                    padding: 12px 14px;
                    font-size: 15px;
                    outline: none;
                }

                .access-carevr-field input:focus {
                    border-color: #7c3aed;
                    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
                }

                .access-carevr-validity {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 16px;
                    background: #f8fafc;
                    border-radius: 9px;
                    margin-bottom: 18px;
                    font-size: 14px;
                    color: #475569;
                }

                .access-carevr-validity strong {
                    color: #172033;
                }

                .access-carevr-security {
                    padding: 16px;
                    border-radius: 10px;
                    background: #f5f3ff;
                    margin-bottom: 22px;
                }

                .access-carevr-security strong {
                    display: block;
                    color: #5b21b6;
                    font-size: 14px;
                    margin-bottom: 5px;
                }

                .access-carevr-security p {
                    margin: 0;
                    color: #475569;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .access-carevr-primary-button {
                    width: 100%;
                    border: none;
                    border-radius: 9px;
                    padding: 13px 18px;
                    background: #7c3aed;
                    color: white;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .access-carevr-primary-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .access-carevr-success {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 26px;
                }

                .access-carevr-success-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    background: #dcfce7;
                    color: #15803d;
                    font-weight: 700;
                    flex: 0 0 auto;
                }

                .access-carevr-success h2 {
                    margin: 0;
                    font-size: 21px;
                    color: #172033;
                }

                .access-carevr-success p {
                    margin: 5px 0 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .access-carevr-detail {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 14px 0;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 14px;
                }

                .access-carevr-detail span {
                    color: #64748b;
                }

                .access-carevr-detail strong {
                    color: #172033;
                    text-align: right;
                    word-break: break-word;
                }

                .access-carevr-link-section {
                    margin-top: 24px;
                }

                .access-carevr-link-box {
                    margin-top: 8px;
                    padding: 13px 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                    font-family: monospace;
                    font-size: 13px;
                    color: #334155;
                    word-break: break-all;
                }

                .access-carevr-secondary-button {
                    margin-top: 12px;
                    border: 1px solid #7c3aed;
                    border-radius: 9px;
                    padding: 10px 15px;
                    background: white;
                    color: #6d28d9;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .access-carevr-link-section p {
                    margin: 10px 0 0;
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .access-carevr-template-section {
                    margin-top: 4px;
                    margin-bottom: 22px;
                }

                .access-carevr-template-header {
                    margin-bottom: 10px;
                }

                .access-carevr-template-header label {
                    display: block;
                    font-size: 15px;
                    font-weight: 700;
                    color: #172033;
                }

                .access-carevr-template-header p {
                    margin: 5px 0 0;
                    color: #475569;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .access-carevr-template-box {
                    padding: 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                }

                .access-carevr-template-box strong {
                    display: block;
                    color: #172033;
                    font-size: 14px;
                    word-break: break-word;
                }

                .access-carevr-template-box pre {
                    margin: 12px 0 0;
                    white-space: pre-wrap;
                    font-family: inherit;
                    color: #475569;
                    font-size: 13px;
                    line-height: 1.55;
                    word-break: break-word;
                }

                .access-carevr-copy-button {
                    width: 100%;
                    margin-top: 12px;
                    border: 1px solid #7c3aed;
                    border-radius: 9px;
                    padding: 11px 15px;
                    background: white;
                    color: #6d28d9;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .access-carevr-copy-button-copied {
                    border-color: #16a34a;
                    background: #16a34a;
                    color: white;
                }

                .access-carevr-back-button {
                    width: 100%;
                    margin-top: 20px;
                    border: none;
                    background: transparent;
                    color: #6d28d9;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .access-carevr-flow {
                    margin-top: 22px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 24px 28px;
                }

                .access-carevr-flow h3 {
                    margin: 0 0 18px;
                    font-size: 17px;
                    color: #172033;
                }

                .access-carevr-flow-step {
                    display: flex;
                    gap: 13px;
                    align-items: flex-start;
                }

                .access-carevr-flow-step + .access-carevr-flow-step {
                    margin-top: 17px;
                }

                .access-carevr-flow-step > span {
                    width: 27px;
                    height: 27px;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    background: #ede9fe;
                    color: #6d28d9;
                    font-size: 12px;
                    font-weight: 700;
                    flex: 0 0 auto;
                }

                .access-carevr-flow-step strong {
                    display: block;
                    font-size: 14px;
                    color: #334155;
                }

                .access-carevr-flow-step p {
                    margin: 3px 0 0;
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.45;
                }

                @media (min-width: 800px) {

                    .access-carevr-shell {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) 320px;
                        column-gap: 24px;
                    }

                    .access-carevr-breadcrumb,
                    .access-carevr-header {
                        grid-column: 1 / -1;
                    }

                    .access-carevr-card {
                        grid-column: 1;
                    }

                    .access-carevr-flow {
                        grid-column: 2;
                        grid-row: 3;
                        margin-top: 0;
                        align-self: start;
                    }

                }

                @media (max-width: 799px) {

                    .access-carevr-shell {
                        width: min(100% - 24px, 720px);
                        padding-top: 20px;
                    }

                }

                @media (max-width: 420px) {

                    .access-carevr-shell {
                        width: calc(100% - 20px);
                        padding-bottom: 40px;
                    }

                    .access-carevr-header h1 {
                        font-size: 27px;
                    }

                    .access-carevr-card,
                    .access-carevr-flow {
                        padding: 20px;
                        border-radius: 13px;
                    }

                    .access-carevr-detail {
                        flex-direction: column;
                        gap: 4px;
                    }

                    .access-carevr-detail strong {
                        text-align: left;
                    }

                }

            `}</style>

        </main>

    );
}
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

import ResponsivePageLayout
    from "@/Components/common/ResponsivePageLayout";

import LanguageSelector
    from "@/Components/language/LanguageSelector";

import {
    Check,
    Copy,
    HandHeart,
    Info,
    KeyRound,
    LockKeyhole,
    Mail,
    Stethoscope,
    UsersRound,
} from "lucide-react";

import {
    createTokenInvitation,
} from "./actions";

import {
    type InvitationRole,
} from "@/lib/invitations/invitationValidation";

import {
    inviteeCaretakerInvitationTemplate,
} from "@/lib/invitations/templates/inviteeCaretakerInvitation";

import {
    inviteeDoctorInvitationTemplate,
} from "@/lib/invitations/templates/inviteeDoctorInvitation";

import {
    inviteeSecondaryFamilyMemberInvitationTemplate,
} from "@/lib/invitations/templates/inviteeSecondaryFamilyMemberInvitation";

// ============================================================
// Invite Care Family
//
// Invitation configuration and temporary-password preparation.
//
// Final invitation persistence/provisioning remains a separate lifecycle step.
// ============================================================


type InviteRole =
    | "SECONDARY"
    | "CARETAKER"
    | "DOCTOR";


type ModuleAccess = {
    id: string;
    name: string;
    description: string;
    access: "CONTRIBUTE" | "VIEW";
    locked?: boolean;
};


type RoleConfiguration = {
    title: string;
    description: string;
    modules: ModuleAccess[];
};


type InviteFamilyUser = {
    fullName: string;
    email: string;
};


const ROLE_CONFIGURATIONS: Record<
    InviteRole,
    RoleConfiguration
> = {
    SECONDARY: {
        title: "Secondary Family Member",
        description:
            "A trusted family member involved in care and support.",
        modules: [
            {
                id: "RECORD_HEALTH",
                name: "Record Health",
                description:
                    "Add and update health information.",
                access: "CONTRIBUTE",
            },
            {
                id: "ASSESSMENT",
                name: "Assessment",
                description:
                    "Contribute information through CareVR assessments.",
                access: "CONTRIBUTE",
            },
            {
                id: "CARE_JOURNEY",
                name: "Care Journey",
                description:
                    "Contribute to the patient's care journey.",
                access: "CONTRIBUTE",
            },
            {
                id: "HEALTH_TIMELINE",
                name: "Health Timeline",
                description:
                    "Review the patient's health timeline.",
                access: "VIEW",
                locked: true,
            },
            {
                id: "DOCTOR_NOTES",
                name: "Doctor Notes",
                description:
                    "Contribute information relevant to the consultation.",
                access: "CONTRIBUTE",
            },
        ],
    },

CARETAKER: {
    title: "Caretaker",
    description:
        "A trusted caregiver who helps with day-to-day care.",
    modules: [
        {
            id: "RECORD_HEALTH",
            name: "Record Health",
            description:
                "Add and update health information.",
            access: "CONTRIBUTE",
        },
        {
            id: "ASSESSMENT",
            name: "Assessment",
            description:
                "Contribute information through CareVR assessments.",
            access: "CONTRIBUTE",
        },
        {
            id: "DOCTOR_NOTES",
            name: "Doctor Notes",
            description:
                "Contribute information relevant to the consultation.",
            access: "CONTRIBUTE",
        },
    ],
},

    DOCTOR: {
        title: "Doctor",
        description:
            "A medical professional involved in the patient's care.",
        modules: [
            {
                id: "HEALTH_TIMELINE",
                name: "Health Timeline",
                description:
                    "Review the patient's health timeline.",
                access: "VIEW",
                locked: true,
            },
            {
                id: "DOCTOR_NOTES",
                name: "Doctor Notes",
                description:
                    "Contribute information relevant to the consultation.",
                access: "CONTRIBUTE",
            },
        ],
    },
};


export default function InviteCareFamilyPage() {

    const router =
        useRouter();


    const [
        user,
        setUser,
    ] =
        useState<InviteFamilyUser | null>(
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
        useState<InviteRole>(
            "SECONDARY"
        );


    const [
        selectedModules,
        setSelectedModules,
    ] =
        useState<string[]>(
            ROLE_CONFIGURATIONS.SECONDARY.modules
                .map(module => module.id)
        );


    const [
        invitationCreated,
        setInvitationCreated,
    ] =
        useState(false);

const [
    inviteeEmail,
    setInviteeEmail,
] =
    useState("");


const [
    creatingInvitation,
    setCreatingInvitation,
] =
    useState(false);

const [
    invitationError,
    setInvitationError,
] =
    useState<string | null>(null);


    const [
        invitationValidated,
        setInvitationValidated,
    ] =
        useState(false);


const [
    invitationToken,
    setInvitationToken,
] =
    useState<string | null>(null);


const invitationLink =
    invitationToken
        ? `${window.location.origin}/invitee-registration?token=${encodeURIComponent(
            invitationToken
        )}`
        : "";

const [
    invitationTokenCopied,
    setInvitationTokenCopied,
] =
    useState(false);


    const [
        invitationTemplateSubject,
        setInvitationTemplateSubject,
    ] =
        useState<string | null>(null);


    const [
        invitationTemplateBody,
        setInvitationTemplateBody,
    ] =
        useState<string | null>(null);

const [invitationTemplateCopied, setInvitationTemplateCopied] =
    useState(false);

    //--------------------------------------------------------
    // Load authenticated user using the same pattern as the
    // existing Access Management page.
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
            catch (error) {

                console.error(
                    "Unable to load Invite Care Family page.",
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

                    setLoading(
                        false
                    );

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

            setAccountMenuOpen(
                false
            );

            router.push(
                "/add-patient"
            );

        };


    const handleCareVRJourney =
        () => {

            setAccountMenuOpen(
                false
            );

            router.push(
                "/dashboard"
            );

        };


    const handleHelp =
        () => {

            setAccountMenuOpen(
                false
            );

            router.push(
                "/help"
            );

        };


    const handleLogout =
        async () => {

            if (loggingOut) {
                return;
            }


            setLoggingOut(
                true
            );

            setAccountMenuOpen(
                false
            );


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

                setLoggingOut(
                    false
                );

            }

        };


    //--------------------------------------------------------
    // Role selection
    //--------------------------------------------------------

    const handleRoleChange =
        (role: InviteRole) => {

            setSelectedRole(
                role
            );

        setInviteeEmail(
            ""
        );

            setInvitationCreated(
                false
            );

            setInvitationValidated(
                false
            );

setInvitationToken(
    null
);

setInvitationTokenCopied(
    false
);

            setSelectedModules(
                ROLE_CONFIGURATIONS[role]
                    .modules
                    .map(module => module.id)
            );

        };


    //--------------------------------------------------------
    // Module selection
    //--------------------------------------------------------

    const handleModuleToggle =
        (moduleId: string) => {

            setInvitationCreated(
                false
            );

            setInvitationValidated(
                false
            );

setInvitationToken(
    null
);

            setSelectedModules(
                current => {

                    if (
                        current.includes(
                            moduleId
                        )
                    ) {

                        return current.filter(
                            id =>
                                id !== moduleId
                        );

                    }


                    return [
                        ...current,
                        moduleId,
                    ];

                }
            );

        };


    const roleConfiguration =
        ROLE_CONFIGURATIONS[
            selectedRole
        ];


    const selectedAccess =
        roleConfiguration.modules.filter(
            module =>
                selectedModules.includes(
                    module.id
                )
        );


    const handleCreateInvitation =
        async () => {

            if (creatingInvitation) {
                return;
            }

            setInvitationError(null);
            setInvitationCreated(false);

            const normalizedInviteeEmail =
                inviteeEmail.trim().toLowerCase();

            const normalizedPrimaryEmail =
                user?.email.trim().toLowerCase() ?? "";

            if (
                normalizedPrimaryEmail &&
                normalizedInviteeEmail ===
                    normalizedPrimaryEmail
            ) {
                setInvitationError(
                    "You cannot create an invitation for your own email address."
                );
                return;
            }

            const role: InvitationRole =
                selectedRole === "SECONDARY"
                    ? "SECONDARY_FAMILY_MEMBER"
                    : selectedRole;

            setCreatingInvitation(true);

            try {
const result = await createTokenInvitation({
    email: normalizedInviteeEmail,
    role,
    modules: selectedAccess.map(
        module => ({
            module: module.id,
            permission: module.access,
        })
    ),
});

setInvitationToken(
    result.invitationToken
);

const invitationLink =
    `${window.location.origin}/invitee-registration?token=${encodeURIComponent(
        result.invitationToken
    )}`;

const template =
    selectedRole === "CARETAKER"
        ? inviteeCaretakerInvitationTemplate
        : selectedRole === "DOCTOR"
            ? inviteeDoctorInvitationTemplate
            : inviteeSecondaryFamilyMemberInvitationTemplate;

const permittedAccess =
    selectedAccess
        .map(
            module =>
                `${module.name} — ${
                    module.access === "VIEW"
                        ? "View Only"
                        : "Contribute"
                }`
        )
        .join("\n");

setInvitationTemplateSubject(
    template.subject
);

setInvitationTemplateBody(
    template.body
        .replace(
            "{{invitee_registration_url}}",
            invitationLink
        )
        .replace(
            "{{permitted_access}}",
            permittedAccess
        )
);

setInvitationTokenCopied(false);
setInvitationTemplateCopied(false);
setInvitationValidated(true);
setInvitationCreated(false);
            }
catch (error) {
    console.error(
        "Unable to create invitation.",
        error
    );

    setInvitationError(
        error instanceof Error
            ? error.message
            : "Unable to create the invitation. Please try again."
    );
}
finally {
    setCreatingInvitation(false);
}
        };


const handleCopyInvitationToken =
    async () => {

        if (!invitationToken) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                invitationToken
            );

            setInvitationTokenCopied(true);
            setInvitationError(null);
        }
        catch (error) {
            console.error(
                "Unable to copy invitation token.",
                error
            );

            setInvitationError(
                "Unable to copy the invitation token. Please copy it manually."
            );
        }
    };

const handleCopyInvitationTemplate = async () => {
    if (
        !invitationTemplateSubject ||
        !invitationTemplateBody
    ) {
        return;
    }

    const plainText =
        `Subject: ${invitationTemplateSubject}\n\n${invitationTemplateBody}`;

    const escapeHtml =
        (value: string) =>
            value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

    const escapedSubject =
        escapeHtml(
            invitationTemplateSubject
        );

    const escapedBody =
        escapeHtml(
            invitationTemplateBody
        );

    const htmlBody =
        escapedBody
            .replace(
                /https:\/\/carevr\.in\/invitee-registration\?token=[^\s<]+/g,
                url =>
                    `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
            )
            .replace(
                /\n/g,
                "<br>"
            );

    const html =
        `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #222;">` +
        `<div style="margin-bottom: 18px;">` +
        `<strong>Subject:</strong> ${escapedSubject}` +
        `</div>` +
        `<div>${htmlBody}</div>` +
        `</div>`;

    try {
        const clipboardItem =
            new ClipboardItem({
                "text/plain":
                    new Blob(
                        [plainText],
                        {
                            type: "text/plain",
                        }
                    ),

                "text/html":
                    new Blob(
                        [html],
                        {
                            type: "text/html",
                        }
                    ),
            });

        await navigator.clipboard.write([
            clipboardItem,
        ]);

        setInvitationTemplateCopied(
            true
        );

        setInvitationError(
            null
        );
    }
    catch (error) {

        console.error(
            "Unable to copy invitation template.",
            error
        );

        setInvitationTemplateCopied(
            false
        );

        setInvitationError(
            "Unable to copy the invitation template. Please copy it manually."
        );
    }
};


const handleFinalizeInvitation =
    () => {

        if (!invitationTokenCopied) {
            return;
        }

        setInvitationCreated(true);
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

<ResponsivePageLayout>

        <main className="invite-care-family-page">

            <div className="invite-care-family-shell">

                {/* ==================================================
                    EXISTING CAREVR HEADER

                    This is the same shared MobileHeader component
                    used by the existing Access Management page.
                ================================================== */}

                <MobileHeader
                    careMode={careMode}
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
                    onAddPatient={
                        handleAddPatient
                    }
                    onCareVRJourney={
                        handleCareVRJourney
                    }
                    onHelp={
                        handleHelp
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


                <section className="invite-care-family-content">

                    <div className="invite-breadcrumb">
                        Access Management
                        <span>
                            /
                        </span>
                        Invite Care Family
                    </div>


                    <div className="invite-heading-row">

                        <div>

                            <div className="invite-section-label">
                                Access Management
                            </div>

                            <h1>
                                Invite Care Family
                            </h1>

                            <p>
                                Invite a Secondary Family Member,
                                Caretaker, or Doctor to share
                                permitted CareVR access for
                                your family.
                            </p>

                        </div>


                        <div className="invite-welcome">

                            <strong>
                                Welcome,{" "}
                                {user.fullName}.
                            </strong>

                            <span>
                                Invite a trusted person to
                                participate in your family's
                                care journey.
                            </span>

                        </div>

                    </div>


                    <div className="invite-layout">

                        <div className="invite-main">

                            {/* ==================================================
                                STEP 1 â€” SELECT ROLE
                            ================================================== */}

                            <section className="invite-card">

                                <div className="step-heading">

                                    <span className="step-number">
                                        1
                                    </span>

                                    <div>
                                        <h2>
                                            Select Role
                                        </h2>

                                        <p>
                                            Choose the role for
                                            the person you want
                                            to invite.
                                        </p>
                                    </div>

                                </div>


                                <div className="role-grid">

                                    {(
                                        Object.keys(
                                            ROLE_CONFIGURATIONS
                                        ) as InviteRole[]
                                    ).map(role => {

                                        const configuration =
                                            ROLE_CONFIGURATIONS[
                                                role
                                            ];

                                        const selected =
                                            selectedRole ===
                                            role;


                                        return (

                                            <button
                                                key={role}
                                                type="button"
                                                className={
                                                    selected
                                                        ? "role-card role-card-selected"
                                                        : "role-card"
                                                }
                                                onClick={() =>
                                                    handleRoleChange(
                                                        role
                                                    )
                                                }
                                            >

                                                <span className="role-card-icon">
                                                    {role === "SECONDARY" ? (
                                                        <UsersRound size={24} strokeWidth={2} aria-hidden="true" />
                                                    ) : role === "CARETAKER" ? (
                                                        <HandHeart size={24} strokeWidth={2} aria-hidden="true" />
                                                    ) : (
                                                        <Stethoscope size={24} strokeWidth={2} aria-hidden="true" />
                                                    )}
                                                </span>


                                                <span className="role-card-title">
                                                    {
                                                        configuration.title
                                                    }
                                                </span>


                                                <span className="role-card-description">
                                                    {
                                                        configuration.description
                                                    }
                                                </span>


                                                <span
                                                    className={
                                                        selected
                                                            ? "role-radio role-radio-selected"
                                                            : "role-radio"
                                                    }
                                                    aria-hidden="true"
                                                >
                                                    {selected ? (
                                                            <Check size={14} strokeWidth={3} aria-hidden="true" />
                                                        ) : null}
                                                </span>

                                            </button>

                                        );

                                    })}

                                </div>

                            </section>


                            {/* ==================================================
                                STEP 2 â€” SELECT MODULES
                            ================================================== */}

                            <section className="invite-card">

                                <div className="step-heading">

                                    <span className="step-number">
                                        2
                                    </span>

                                    <div>
                                        <h2>
                                            Select Modules
                                        </h2>

                                        <p>
                                            Select the CareVR
                                            modules to include
                                            in this invitation.
                                        </p>
                                    </div>

                                </div>


                                <div className="policy-banner">

                                    <span className="policy-banner-icon">
                                        <Check size={14} strokeWidth={3} aria-hidden="true" />
                                    </span>

                                    <div>

                                        <strong>
                                            Access is policy-controlled
                                        </strong>

                                        <p>
                                            Only modules permitted
                                            for the selected role
                                            are shown.
                                        </p>

                                    </div>

                                </div>


                                <div className="module-list">

                                    {roleConfiguration.modules.map(
                                        module => {

                                            const selected =
                                                selectedModules.includes(
                                                    module.id
                                                );


                                            return (

                                                <label
                                                    key={module.id}
                                                    className={
                                                        selected
                                                            ? "module-card module-card-selected"
                                                            : "module-card"
                                                    }
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selected
                                                        }
                                                        onChange={() =>
                                                            handleModuleToggle(
                                                                module.id
                                                            )
                                                        }
                                                    />

                                                    <span className="module-copy">

                                                        <strong>
                                                            {
                                                                module.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                module.description
                                                            }
                                                        </span>

                                                    </span>

                                                </label>

                                            );

                                        }
                                    )}

                                </div>

                            </section>


                            {/* ==================================================
                                STEP 3 â€” ACCESS FOR SELECTED MODULES
                            ================================================== */}

                            <section className="invite-card">

                                <div className="step-heading">

                                    <span className="step-number">
                                        3
                                    </span>

                                    <div>
                                        <h2>
                                            Access for Selected Modules
                                        </h2>

                                        <p>
                                            Access is determined
                                            automatically from the
                                            selected role and modules.
                                        </p>
                                    </div>

                                </div>


                                {selectedAccess.length === 0 ? (

                                    <div className="empty-access">

                                        <span>
                                            Select at least one
                                            module to see the
                                            access that will be
                                            provisioned.
                                        </span>

                                    </div>

                                ) : (

                                    <div className="access-list">

                                        {selectedAccess.map(
                                            module => (

                                                <div
                                                    key={module.id}
                                                    className="access-row"
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                module.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                module.description
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="access-value">

                                                        <span
                                                            className={
                                                                module.access ===
                                                                "VIEW"
                                                                    ? "access-badge access-badge-view"
                                                                    : "access-badge access-badge-contribute"
                                                            }
                                                        >
                                                            {module.access ===
                                                            "VIEW"
                                                                ? "View Only"
                                                                : "Contribute"}
                                                        </span>


                                                        {module.locked && (
                                                            <span className="locked-label">
                                                                <LockKeyhole size={11} strokeWidth={2} aria-hidden="true" />
                                                                Locked by policy
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}


                                <div className="access-warning">

                                    <strong>
                                        Important
                                    </strong>

                                    <span>
                                        The Primary cannot manually
                                        change a role's permitted
                                        access level. Final authoritative
                                        access is determined after the
                                        invitee completes mandatory
                                        onboarding and Consent Management.
                                    </span>

                                </div>

                            </section>


                            {/* ==================================================
                                STEP 4 â€” INVITATION
                            ================================================== */}

                            <section className="invite-card">

                                <div className="step-heading">

                                    <span className="step-number">
                                        4
                                    </span>

                                    <div>
                                        <h2>
                                            Create Invitation
                                        </h2>

                                        <p>
                                            Review the invitation
                                            configuration before
                                            creating it.
                                        </p>
                                    </div>

                                </div>


                                <div className="invitee-email-field">

                                    <label htmlFor="invitee-email">
                                        Invitee Email
                                    </label>

                                    <div className="invitee-email-input-wrap">
                                        <Mail
                                            size={17}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="invitee-email"
                                            type="email"
                                            value={inviteeEmail}
                                            onChange={event => {
                                                setInviteeEmail(event.target.value);
                                                setInvitationError(null);
                                                setInvitationValidated(false);
setInvitationToken(null);
setInvitationTokenCopied(false);
                                                setInvitationCreated(false);
                                            }}
                                            placeholder="Enter the person&apos;s email address"
                                            autoComplete="email"
                                        />
                                    </div>

                                    <small>
                                        The invitation will be created for this email address.
                                    </small>

                                </div>


                                <div className="invitation-summary">

                                    <div>
                                        <span>
                                            Role
                                        </span>

                                        <strong>
                                            {
                                                roleConfiguration.title
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Modules
                                        </span>

                                        <strong>
                                            {
                                                selectedAccess.length
                                            }{" "}
                                            selected
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Access
                                        </span>

                                        <strong>
                                            Policy determined
                                        </strong>
                                    </div>

                                </div>


                                <div className="consent-notice">

                                    <span className="consent-notice-icon">
                                        <LockKeyhole size={15} strokeWidth={2} aria-hidden="true" />
                                    </span>

                                    <div>

                                        <strong>
                                            Final access follows consent
                                        </strong>

                                        <p>
                                            Creating this invitation does
                                            not itself establish final active
                                            access. The invitee must complete
                                            the required onboarding and
                                            Consent Management process.
                                        </p>

                                    </div>

                                </div>


                                {!invitationValidated && (

                                    <button
                                        type="button"
                                        className="create-invitation-button"
                                        disabled={
                                            selectedModules.length === 0 ||
                                            !inviteeEmail.trim() ||
                                            creatingInvitation
                                        }
                                        onClick={handleCreateInvitation}
                                    >
{creatingInvitation
    ? "Creating Invitation..."
    : "Create Invitation"}
                                    </button>

                                )}


                                {invitationError && (
                                    <div
                                        className="invitation-error"
                                        role="alert"
                                    >
                                        {invitationError}
                                    </div>
                                )}

                            </section>


{/* ==================================================
    STEP 5 — SEND THE INVITATION
================================================== */}

{invitationValidated && !invitationCreated && (
    <section className="step-five-wrapper">

        <div className="step-five-heading">

            <div className="step-five-eyebrow">
                Step 5 · Send the Invitation
            </div>

            <h2>
                Personal Email Invitation Template
            </h2>

            <p>
                This is just a template which can be used to send the
                invite via your personal email. CareVR does not send
                this email for you. Copy the template below, paste it
                into your personal email, and send it to the invited
                person.
            </p>

        </div>


        {/* ==================================================
            EMAIL TEMPLATE
        ================================================== */}

        <div className="email-template-card">

            {/* SUBJECT */}

            <div className="email-subject-row">

                <div className="email-field-copy">

                    <span className="email-field-label">
                        Subject
                    </span>

                    <strong>
                        {invitationTemplateSubject}
                    </strong>

                </div>

            </div>


            {/* EMAIL BODY */}

            <div className="email-body-section">

                <div className="email-body-header">

                    <span className="email-field-label">
                        Email
                    </span>

                </div>


                <div className="email-body-content">

                    <pre>
                        {invitationTemplateBody}
                    </pre>

                </div>

            </div>


            {/* PRIMARY COPY ACTION */}

            <button
                type="button"
                className={
                    invitationTemplateCopied
                        ? "copy-email-template-button copy-email-template-button-copied"
                        : "copy-email-template-button"
                }
                onClick={handleCopyInvitationTemplate}
            >

                {invitationTemplateCopied ? (
                    <>
                        <Check
                            size={18}
                            strokeWidth={2.5}
                            aria-hidden="true"
                        />

                        <span>
                            <strong>
                                Email Template Copied
                            </strong>

                            <small>
                                Subject and email body copied
                            </small>
                        </span>
                    </>
                ) : (
                    <>
                        <Copy
                            size={18}
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        <span>
                            <strong>
                                Copy Email Template
                            </strong>

                            <small>
                                Copies both subject and email body
                            </small>
                        </span>
                    </>
                )}

            </button>

        </div>





        {/* ==================================================
            INFORMATION NOTICE
        ================================================== */}

        <div className="invitation-send-notice">

            <span className="invitation-send-notice-icon">
                <Info
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </span>

            <div>

                <strong>
                    Invitation created
                </strong>

                <span>
                    Copy the email template above and send it through
                    your personal email. CareVR does not send the email
                    automatically.
                </span>

            </div>

        </div>


    </section>
)}


                            {invitationCreated && (

                                <section className="completed-invitation-card">
                                    <Check size={18} strokeWidth={3} aria-hidden="true" />
                                    <div>
<strong>Invitation created successfully</strong>
<span>
    The temporary password was copied. The invitation is now pending acceptance.
</span>
                                    </div>
                                </section>

                            )}

                        </div>


                        {/* ==================================================
                            POLICY SIDEBAR
                        ================================================== */}

                        <aside className="invite-sidebar">

                            <div className="policy-card">

                                <div className="policy-card-heading">

                                    <span>
                                        <Info size={14} strokeWidth={2} aria-hidden="true" />
                                    </span>

                                    <h2>
                                        How access works
                                    </h2>

                                </div>


                                <div className="policy-step">

                                    <span>
                                        1
                                    </span>

                                    <div>

                                        <strong>
                                            Select the role
                                        </strong>

                                        <p>
                                            The selected role determines
                                            which modules can be offered.
                                        </p>

                                    </div>

                                </div>


                                <div className="policy-step">

                                    <span>
                                        2
                                    </span>

                                    <div>

                                        <strong>
                                            Select modules
                                        </strong>

                                        <p>
                                            Only policy-valid modules
                                            for that role are displayed.
                                        </p>

                                    </div>

                                </div>


                                <div className="policy-step">

                                    <span>
                                        3
                                    </span>

                                    <div>

                                        <strong>
                                            Access is determined
                                        </strong>

                                        <p>
                                            Access level comes from the
                                            role/module policy.
                                        </p>

                                    </div>

                                </div>


                                <div className="policy-step">

                                    <span>
                                        4
                                    </span>

                                    <div>

                                        <strong>
                                            Invitee completes onboarding
                                        </strong>

                                        <p>
                                            Mandatory password change and
                                            Consent Management follow.
                                        </p>

                                    </div>

                                </div>


                                <div className="policy-step">

                                    <span>
                                        5
                                    </span>

                                    <div>

                                        <strong>
                                            Final access is applied
                                        </strong>

                                        <p>
                                            The authoritative access matrix
                                            is applied after consent.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="role-access-card">

                                <div className="role-access-card-label">
                                    Selected Role
                                </div>

                                <strong>
                                    {
                                        roleConfiguration.title
                                    }
                                </strong>

                                <span>
                                    {
                                        selectedAccess.length
                                    } permitted module
                                    {selectedAccess.length === 1
                                        ? ""
                                        : "s"}
                                </span>

                            </div>

                        </aside>

                    </div>

                </section>


                {/* ==================================================
                    EXISTING CAREVR FOOTER

                    Same shared CareVRFooter component used by
                    Access Management.
                ================================================== */}

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
                input {
                    font: inherit;
                }


                .invite-care-family-page {
                    min-height: 100vh;
                    min-height: 100dvh;
                    background:
                        linear-gradient(
                            180deg,
                            #f8fbff 0%,
                            #ffffff 52%,
                            #f4f9ff 100%
                        );
                    padding: 0 14px;
                }


                .invite-care-family-shell {
                    width: 100%;
                    max-width: 1120px;
                    min-height: 100vh;
                    min-height: 100dvh;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                }


                .invite-care-family-content {
                    flex: 1 0 auto;
                    padding: 30px 10px 34px;
                }


                .invite-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-bottom: 18px;
                    color: #6b7d9c;
                    font-size: 13px;
                    font-weight: 600;
                }


                .invite-breadcrumb span {
                    color: #a4b0c3;
                }


                .invite-heading-row {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 28px;
                    margin-bottom: 28px;
                }


                .invite-section-label {
                    margin-bottom: 5px;
                    color: #5272a6;
                    font-size: 15px;
                    font-weight: 700;
                }


                .invite-heading-row h1 {
                    margin: 0;
                    color: #13265a;
                    font-size: clamp(30px, 5vw, 40px);
                    line-height: 1.12;
                    font-weight: 800;
                    letter-spacing: -0.6px;
                }


                .invite-heading-row p {
                    max-width: 680px;
                    margin: 10px 0 0;
                    color: #53698f;
                    font-size: 16px;
                    line-height: 1.5;
                }


                .invite-welcome {
                    min-width: 230px;
                    max-width: 285px;
                    padding: 16px 18px;
                    border: 1px solid #d9e7f7;
                    border-radius: 15px;
                    background: #f5faff;
                }


                .invite-welcome strong {
                    display: block;
                    color: #18376f;
                    font-size: 15px;
                }


                .invite-welcome span {
                    display: block;
                    margin-top: 5px;
                    color: #6680a5;
                    font-size: 12px;
                    line-height: 1.45;
                }


                .invite-layout {
                    display: grid;
                    grid-template-columns:
                        minmax(0, 1fr)
                        300px;
                    gap: 20px;
                    align-items: start;
                }


                .invite-main {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }


                .invite-card {
                    padding: 24px;
                    border: 1px solid #dce8f5;
                    border-radius: 20px;
                    background: #ffffff;
                    box-shadow:
                        0 7px 25px
                        rgba(34, 72, 118, 0.055);
                }


                .step-heading {
                    display: flex;
                    align-items: flex-start;
                    gap: 13px;
                    margin-bottom: 20px;
                }


                .step-number {
                    width: 34px;
                    height: 34px;
                    flex: 0 0 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #eaf4ff;
                    color: #2563eb;
                    font-size: 15px;
                    font-weight: 800;
                }


                .step-heading h2 {
                    margin: 0;
                    color: #18376f;
                    font-size: 20px;
                    line-height: 1.25;
                    font-weight: 800;
                }


                .step-heading p {
                    margin: 4px 0 0;
                    color: #6b7e9e;
                    font-size: 13px;
                    line-height: 1.45;
                }


                .role-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));
                    gap: 12px;
                }


                .role-card {
                    position: relative;
                    min-height: 165px;
                    padding: 20px 15px 16px;
                    border: 1px solid #dce4ef;
                    border-radius: 16px;
                    background: #ffffff;
                    color: #15203d;
                    text-align: center;
                    cursor: pointer;
                    transition:
                        border-color 150ms ease,
                        background 150ms ease,
                        box-shadow 150ms ease;
                }


                .role-card:hover {
                    border-color: #9fc4ee;
                    background: #fafdff;
                }


                .role-card-selected {
                    border: 2px solid #2f78d4;
                    background: #f2f8ff;
                    box-shadow:
                        0 0 0 3px
                        rgba(47, 120, 212, 0.08);
                }


                .role-card-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #edf5ff;
                    color: #2873c7;
                }


                .role-card-title {
                    display: block;
                    color: #18376f;
                    font-size: 14px;
                    line-height: 1.25;
                    font-weight: 800;
                }


                .role-card-description {
                    display: block;
                    margin-top: 7px;
                    color: #71839f;
                    font-size: 11.5px;
                    line-height: 1.4;
                }


                .role-radio {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #c4cfdd;
                    border-radius: 50%;
                    color: #ffffff;
                    font-size: 11px;
                }


                .role-radio-selected {
                    border-color: #2f78d4;
                    background: #2f78d4;
                }


                .policy-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 11px;
                    margin-bottom: 15px;
                    padding: 13px 14px;
                    border: 1px solid #cfe2f8;
                    border-radius: 13px;
                    background: #f3f9ff;
                }


                .policy-banner-icon {
                    width: 25px;
                    height: 25px;
                    flex: 0 0 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #d9ecff;
                    color: #1970d3;
                    font-size: 12px;
                    font-weight: 800;
                }


                .policy-banner strong {
                    display: block;
                    color: #244f83;
                    font-size: 13px;
                }


                .policy-banner p {
                    margin: 2px 0 0;
                    color: #6680a3;
                    font-size: 11.5px;
                    line-height: 1.4;
                }


                .module-list {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                    gap: 10px;
                }


                .module-card {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    min-height: 75px;
                    padding: 13px;
                    border: 1px solid #dce4ef;
                    border-radius: 13px;
                    background: #ffffff;
                    cursor: pointer;
                }


                .module-card-selected {
                    border-color: #afd1f3;
                    background: #f6fbff;
                }


                .module-card input {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    flex: 0 0 20px;
                    margin: 0;
                    accent-color: #2f78d4;
                    cursor: pointer;
                }


                .module-check {
                    width: 23px;
                    height: 23px;
                    flex: 0 0 23px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1.5px solid #b9c7d8;
                    border-radius: 6px;
                    color: #ffffff;
                    font-size: 12px;
                    font-weight: 800;
                }


                .module-card-selected .module-check {
                    border-color: #2f78d4;
                    background: #2f78d4;
                }


                .module-copy {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }


                .module-copy strong {
                    color: #233e70;
                    font-size: 13px;
                    line-height: 1.25;
                }


                .module-copy span {
                    color: #72849e;
                    font-size: 11px;
                    line-height: 1.35;
                }


                .empty-access {
                    padding: 22px;
                    border: 1px dashed #cbd8e8;
                    border-radius: 13px;
                    background: #f9fbfd;
                    color: #75869e;
                    font-size: 13px;
                    text-align: center;
                }


                .access-list {
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #e0e8f1;
                    border-radius: 13px;
                    overflow: hidden;
                }


                .access-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 14px 15px;
                    border-bottom: 1px solid #e8eef5;
                }


                .access-row:last-child {
                    border-bottom: 0;
                }


                .access-row > div:first-child {
                    min-width: 0;
                }


                .access-row strong {
                    display: block;
                    color: #233e70;
                    font-size: 13px;
                }


                .access-row span {
                    display: block;
                    margin-top: 3px;
                    color: #788aa2;
                    font-size: 11px;
                    line-height: 1.35;
                }


                .access-value {
                    flex: 0 0 auto;
                    text-align: right;
                }


                .access-badge {
                    display: inline-flex !important;
                    align-items: center;
                    justify-content: center;
                    margin: 0 !important;
                    padding: 5px 9px;
                    border-radius: 999px;
                    font-size: 10px !important;
                    font-weight: 800;
                }


                .access-badge-contribute {
                    background: #e8f8f1;
                    color: #16805a !important;
                }


                .access-badge-view {
                    background: #edf4ff;
                    color: #2867b5 !important;
                }


                .locked-label {
                    display: inline-flex !important;
                    align-items: center;
                    gap: 4px;
                    margin-top: 4px !important;
                    color: #8a6d2d !important;
                    font-size: 9px !important;
                    font-weight: 700;
                }


                .access-warning {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-top: 14px;
                    padding: 13px 14px;
                    border-left: 3px solid #d7a73d;
                    background: #fffbf1;
                }


                .access-warning strong {
                    color: #795b18;
                    font-size: 12px;
                }


                .access-warning span {
                    color: #806e48;
                    font-size: 11px;
                    line-height: 1.45;
                }


                .invitee-email-field {
                    margin-bottom: 15px;
                }

                .invitee-email-field label {
                    display: block;
                    margin-bottom: 7px;
                    color: #244b7f;
                    font-size: 12px;
                    font-weight: 800;
                }

                .invitee-email-input-wrap {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    min-height: 48px;
                    padding: 0 13px;
                    border: 1px solid #cddded;
                    border-radius: 12px;
                    background: #ffffff;
                    color: #5f7898;
                }

                .invitee-email-input-wrap:focus-within {
                    border-color: #7eafe4;
                    box-shadow: 0 0 0 3px rgba(47, 120, 212, 0.08);
                }

                .invitee-email-input-wrap input {
                    width: 100%;
                    min-width: 0;
                    border: 0;
                    outline: 0;
                    background: transparent;
                    color: #15203d;
                    font-size: 13px;
                }

                .invitee-email-field small {
                    display: block;
                    margin-top: 5px;
                    color: #7185a0;
                    font-size: 10px;
                    line-height: 1.4;
                }

                .invitation-error {
                    margin-top: 12px;
                    padding: 11px 13px;
                    border: 1px solid #efcaca;
                    border-radius: 10px;
                    background: #fff6f6;
                    color: #9b3d3d;
                    font-size: 11px;
                    line-height: 1.45;
                }

                .invitee-email-field {
                    margin-bottom: 15px;
                }

                .invitee-email-field label {
                    display: block;
                    margin-bottom: 7px;
                    color: #244b7f;
                    font-size: 12px;
                    font-weight: 800;
                }

                .invitee-email-input-wrap {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    min-height: 48px;
                    padding: 0 13px;
                    border: 1px solid #cddded;
                    border-radius: 12px;
                    background: #ffffff;
                    color: #5f7898;
                }

                .invitee-email-input-wrap:focus-within {
                    border-color: #7eafe4;
                    box-shadow: 0 0 0 3px rgba(47, 120, 212, 0.08);
                }

                .invitee-email-input-wrap input {
                    width: 100%;
                    min-width: 0;
                    border: 0;
                    outline: 0;
                    background: transparent;
                    color: #15203d;
                    font-size: 13px;
                }

                .invitee-email-field small {
                    display: block;
                    margin-top: 5px;
                    color: #7185a0;
                    font-size: 10px;
                    line-height: 1.4;
                }

                .invitation-error {
                    margin-top: 12px;
                    padding: 11px 13px;
                    border: 1px solid #efcaca;
                    border-radius: 10px;
                    background: #fff6f6;
                    color: #9b3d3d;
                    font-size: 11px;
                    line-height: 1.45;
                }

                .invitation-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));
                    gap: 10px;
                    margin-bottom: 14px;
                }


                .invitation-summary > div {
                    padding: 13px;
                    border: 1px solid #e0e8f1;
                    border-radius: 12px;
                    background: #f9fbfd;
                }


                .invitation-summary span {
                    display: block;
                    margin-bottom: 5px;
                    color: #7b8ba1;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }


                .invitation-summary strong {
                    color: #24416f;
                    font-size: 12px;
                }


                .consent-notice {
                    display: flex;
                    align-items: flex-start;
                    gap: 11px;
                    margin-bottom: 16px;
                    padding: 14px;
                    border: 1px solid #d9e6f4;
                    border-radius: 13px;
                    background: #f4f9ff;
                }


                .consent-notice-icon {
                    width: 28px;
                    height: 28px;
                    flex: 0 0 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #e0efff;
                    font-size: 14px;
                }


                .consent-notice strong {
                    display: block;
                    color: #244d82;
                    font-size: 12px;
                }


                .consent-notice p {
                    margin: 4px 0 0;
                    color: #6e819d;
                    font-size: 11px;
                    line-height: 1.45;
                }


                .create-invitation-button {
                    width: 100%;
                    min-height: 49px;
                    border: 0;
                    border-radius: 12px;
                    background: #2878d5;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow:
                        0 8px 18px
                        rgba(40, 120, 213, 0.18);
                }


                .create-invitation-button:hover:not(:disabled) {
                    background: #216cc4;
                }


                .create-invitation-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    box-shadow: none;
                }


                .confirmation-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 22px;
                    border: 1px solid #cce9dc;
                    border-radius: 20px;
                    background: #f2fcf7;
                    box-shadow:
                        0 7px 25px
                        rgba(32, 121, 82, 0.05);
                }


                .confirmation-icon {
                    width: 42px;
                    height: 42px;
                    flex: 0 0 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #d9f4e7;
                    color: #15845a;
                    font-size: 18px;
                    font-weight: 900;
                }


                .confirmation-label {
                    color: #18805a;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }


                .confirmation-copy h2 {
                    margin: 4px 0 0;
                    color: #1f5e49;
                    font-size: 19px;
                }


                .confirmation-copy > p {
                    margin: 6px 0 14px;
                    color: #58796d;
                    font-size: 12px;
                    line-height: 1.45;
                }


                .temporary-password-panel {
                    padding: 13px;
                    border: 1px dashed #a9d8c1;
                    border-radius: 11px;
                    background: #ffffff;
                }


                .temporary-password-panel span {
                    display: block;
                    color: #708d82;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }


                .temporary-password-panel strong {
                    display: block;
                    margin-top: 5px;
                    color: #23624e;
                    font-size: 14px;
                }


                .temporary-password-panel small {
                    display: block;
                    margin-top: 5px;
                    color: #789087;
                    font-size: 10px;
                    line-height: 1.4;
                }


                .temporary-password-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 6px;
                }

                .temporary-password-row strong {
                    flex: 1;
                    min-width: 0;
                    margin: 0;
                    color: #23624e;
                    font-size: 16px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    letter-spacing: 0.03em;
                    word-break: break-all;
                }

                .copy-password-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    min-height: 38px;
                    padding: 0 11px;
                    border: 1px solid #b8d8ca;
                    border-radius: 9px;
                    background: #f3fbf7;
                    color: #23624e;
                    font-size: 11px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .copy-password-button:hover {
                    background: #eaf8f1;
                }

                .password-copy-warning {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    margin: 12px 0 14px;
                    padding: 10px 11px;
                    border: 1px solid #eadfbf;
                    border-radius: 10px;
                    background: #fffdf5;
                    color: #806e48;
                    font-size: 10px;
                    line-height: 1.45;
                }

                .completed-invitation-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 16px 18px;
                    border: 1px solid #cce9dc;
                    border-radius: 15px;
                    background: #f2fcf7;
                    color: #18805a;
                }

                .completed-invitation-card > div {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .completed-invitation-card strong {
                    color: #1f5e49;
                    font-size: 12px;
                }

                .completed-invitation-card span {
                    color: #58796d;
                    font-size: 10px;
                    line-height: 1.4;
                }

                .temporary-password-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 6px;
                }

                .temporary-password-row strong {
                    flex: 1;
                    min-width: 0;
                    margin: 0;
                    color: #23624e;
                    font-size: 16px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    letter-spacing: 0.03em;
                    word-break: break-all;
                }

                .copy-password-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    min-height: 38px;
                    padding: 0 11px;
                    border: 1px solid #b8d8ca;
                    border-radius: 9px;
                    background: #f3fbf7;
                    color: #23624e;
                    font-size: 11px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .copy-password-button:hover {
                    background: #eaf8f1;
                }

                .password-copy-warning {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    margin: 12px 0 14px;
                    padding: 10px 11px;
                    border: 1px solid #eadfbf;
                    border-radius: 10px;
                    background: #fffdf5;
                    color: #806e48;
                    font-size: 10px;
                    line-height: 1.45;
                }

                .completed-invitation-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 16px 18px;
                    border: 1px solid #cce9dc;
                    border-radius: 15px;
                    background: #f2fcf7;
                    color: #18805a;
                }

                .completed-invitation-card > div {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .completed-invitation-card strong {
                    color: #1f5e49;
                    font-size: 12px;
                }

                .completed-invitation-card span {
                    color: #58796d;
                    font-size: 10px;
                    line-height: 1.4;
                }

                .invite-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    position: sticky;
                    top: 18px;
                }


                .policy-card,
                .role-access-card {
                    padding: 19px;
                    border: 1px solid #d9e7f5;
                    border-radius: 18px;
                    background: #f5faff;
                }


                .policy-card-heading {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-bottom: 18px;
                }


                .policy-card-heading > span {
                    width: 27px;
                    height: 27px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #e1efff;
                    color: #2873c7;
                    font-size: 12px;
                    font-weight: 800;
                }


                .policy-card-heading h2 {
                    margin: 0;
                    color: #244b7f;
                    font-size: 15px;
                    font-weight: 800;
                }


                .policy-step {
                    display: grid;
                    grid-template-columns: 26px minmax(0, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                }


                .policy-step:last-child {
                    margin-bottom: 0;
                }


                .policy-step > span {
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #ffffff;
                    color: #3276bd;
                    font-size: 10px;
                    font-weight: 800;
                }


                .policy-step strong {
                    display: block;
                    color: #31577f;
                    font-size: 11px;
                }


                .policy-step p {
                    margin: 3px 0 0;
                    color: #7085a0;
                    font-size: 10px;
                    line-height: 1.4;
                }


                .role-access-card {
                    background: #ffffff;
                }


                .role-access-card-label {
                    margin-bottom: 5px;
                    color: #8292a8;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                }


                .role-access-card strong {
                    display: block;
                    color: #254677;
                    font-size: 14px;
                }


                .role-access-card > span {
                    display: block;
                    margin-top: 4px;
                    color: #7487a1;
                    font-size: 10px;
                }


/* ============================================================
   STEP 5 — SEND INVITATION
============================================================ */

.step-five-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
}


.step-five-heading {
    padding: 2px 2px 4px;
}


.step-five-eyebrow {
    margin-bottom: 6px;
    color: #31577f;
    font-size: 12px;
    font-weight: 700;
}


.step-five-heading h2 {
    margin: 0;
    color: #13284b;
    font-size: 25px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.02em;
}


.step-five-heading p {
    max-width: 850px;
    margin: 9px 0 0;
    color: #5f7189;
    font-size: 13px;
    line-height: 1.65;
}


/* ============================================================
   EMAIL TEMPLATE CARD
============================================================ */

.email-template-card {
    padding: 14px;
    border: 1px solid #dbe8f4;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(45, 87, 126, 0.06);
}


.email-subject-row {
    padding: 15px 16px;
    border: 1px solid #e1ebf4;
    border-radius: 12px;
    background: #f7faff;
}


.email-field-label {
    display: block;
    margin-bottom: 6px;
    color: #71849b;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}


.email-field-copy strong {
    display: block;
    color: #203b62;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 700;
}


.email-body-section {
    margin-top: 10px;
    border: 1px solid #e1ebf4;
    border-radius: 12px;
    overflow: hidden;
}


.email-body-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e1ebf4;
    background: #f7faff;
}


.email-body-header .email-field-label {
    margin: 0;
}


.email-body-content {
    background: #ffffff;
}


.email-body-content pre {
    margin: 0;
    padding: 18px 16px;
    min-height: 350px;
    max-height: 500px;
    overflow: auto;

    color: #263a55;
    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    font-size: 12px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}


/* ============================================================
   COPY EMAIL TEMPLATE
============================================================ */

.copy-email-template-button {
    width: 100%;
    min-height: 60px;
    margin-top: 12px;
    padding: 9px 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;

    border: 0;
    border-radius: 12px;
    background: #2878d5;
    color: #ffffff;

    cursor: pointer;

    box-shadow: 0 7px 18px rgba(40, 120, 213, 0.18);

    transition:
        background 0.15s ease,
        transform 0.15s ease,
        box-shadow 0.15s ease;
}


.copy-email-template-button:hover {
    background: #216dc4;
    transform: translateY(-1px);
    box-shadow: 0 9px 20px rgba(40, 120, 213, 0.22);
}


.copy-email-template-button > span {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
}


.copy-email-template-button strong {
    font-size: 12px;
    font-weight: 800;
}


.copy-email-template-button small {
    font-size: 10px;
    line-height: 1.3;
    opacity: 0.85;
}


.copy-email-template-button-copied {
    background: #1f8a68;
}


.copy-email-template-button-copied:hover {
    background: #19785b;
}


/* ============================================================
   TEMPORARY PASSWORD
============================================================ */

.temporary-password-card {
    padding: 16px;
    border: 1px solid #dbe8f4;
    border-radius: 16px;
    background: #ffffff;
}


.temporary-password-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}


.temporary-password-title {
    display: flex;
    align-items: center;
    gap: 9px;
}


.temporary-password-title strong {
    color: #203b62;
    font-size: 13px;
    font-weight: 800;
}


.temporary-password-icon {
    width: 30px;
    height: 30px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 9px;
    background: #eaf3ff;
    color: #2878d5;
}


.temporary-password-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 12px;
    margin-top: 13px;
}


.temporary-password-value-box {
    min-height: 54px;
    display: flex;
    align-items: center;
    padding: 0 15px;

    border: 1px solid #dce8f3;
    border-radius: 11px;
    background: #f7faff;
}


.temporary-password-value-box strong {
    color: #19375d;
    font-size: 14px;
    font-family:
        ui-monospace,
        SFMono-Regular,
        Menlo,
        Monaco,
        Consolas,
        monospace;
    letter-spacing: 0.02em;
    word-break: break-all;
}


.temporary-password-expiry {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px 12px;
    border-left: 1px solid #e3ebf3;
}


.temporary-password-expiry span {
    color: #8091a6;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}


.temporary-password-expiry strong {
    margin-top: 3px;
    color: #31577f;
    font-size: 11px;
}


.temporary-password-expiry small {
    margin-top: 2px;
    color: #8a9bad;
    font-size: 9px;
}


/* ============================================================
   SEND NOTICE
============================================================ */

.invitation-send-notice {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    padding: 12px 14px;

    border: 1px solid #f0dfad;
    border-radius: 12px;
    background: #fffaf0;
}


.invitation-send-notice-icon {
    width: 28px;
    height: 28px;
    flex: 0 0 28px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: #fff1c9;
    color: #8a6820;
}


.invitation-send-notice > div {
    display: flex;
    flex-direction: column;
    gap: 3px;
}


.invitation-send-notice strong {
    color: #735718;
    font-size: 11px;
    font-weight: 800;
}


.invitation-send-notice span {
    color: #806e48;
    font-size: 10px;
    line-height: 1.45;
}


/* ============================================================
   FINISH
============================================================ */

.finish-invitation-button {
    width: 100%;
    min-height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    border: 0;
    border-radius: 13px;

    background: #2878d5;
    color: #ffffff;

    font-size: 13px;
    font-weight: 800;

    cursor: pointer;

    box-shadow: 0 8px 20px rgba(40, 120, 213, 0.18);

    transition:
        background 0.15s ease,
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

.finish-invitation-button:hover:not(:disabled) {
    background: #216dc4;
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(40, 120, 213, 0.22);
}

.finish-invitation-button:disabled {
    background: #c8d7e7;
    color: #ffffff;
    cursor: not-allowed;
    box-shadow: none;
}

.finish-arrow {
    font-size: 18px;
    line-height: 1;
}


/* ============================================================
   RESPONSIVE
============================================================ */

@media (max-width: 900px) {
    .invite-layout {
        grid-template-columns: 1fr;
    }

    .invite-sidebar {
        position: static;
    }

    .policy-card {
        display: none;
    }
}


@media (max-width: 650px) {
    .invite-care-family-page {
        width: 100%;
        min-width: 0;
        padding: 0 8px;
        overflow-x: hidden;
    }

    .invite-care-family-shell {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        overflow-x: hidden;
    }

    .invite-care-family-content {
        width: 100%;
        min-width: 0;
        padding: 18px 2px 22px;
    }

    .invite-heading-row {
        display: block;
        width: 100%;
        min-width: 0;
        margin-bottom: 18px;
    }

    .invite-heading-row h1 {
        font-size: 28px;
        line-height: 1.12;
        letter-spacing: -0.4px;
    }

    .invite-heading-row p {
        max-width: 100%;
        margin-top: 8px;
        font-size: 13px;
        line-height: 1.45;
    }

    .invite-welcome {
        width: 100%;
        min-width: 0;
        max-width: none;
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 13px;
    }

    .invite-layout,
    .invite-main,
    .invite-sidebar {
        width: 100%;
        min-width: 0;
        max-width: 100%;
    }

    .invite-layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 14px;
    }

    .invite-card {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        padding: 16px;
        border-radius: 16px;
        overflow: hidden;
    }

    .step-heading {
        gap: 9px;
        margin-bottom: 14px;
    }

    .step-heading h2 {
        font-size: 18px;
        line-height: 1.2;
    }

    .step-heading p {
        font-size: 11px;
        line-height: 1.45;
    }

    .role-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .role-card {
        width: 100%;
        min-width: 0;
        min-height: 92px;
        padding: 13px 42px 13px 13px;
        text-align: left;
    }

    .role-card-icon {
        margin: 0 0 7px;
    }

    .module-list {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .invitation-summary {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .access-row {
        align-items: flex-start;
        flex-direction: column;
        gap: 5px;
    }

    .access-value {
        width: 100%;
        text-align: left;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    /* ========================================================
       TEMPORARY PASSWORD — MOBILE
    ======================================================== */

    .temporary-password-card {
        width: 100%;
        min-width: 0;
        padding: 13px;
        border-radius: 14px;
    }

    .temporary-password-content {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .temporary-password-value-box {
        min-height: 48px;
        padding: 0 12px;
    }

    .temporary-password-value-box strong {
        font-size: 13px;
        overflow-wrap: anywhere;
        word-break: break-all;
    }

    .temporary-password-expiry {
        padding: 8px 0 0;
        border-left: 0;
        border-top: 1px solid #e3ebf3;
    }

    /* ========================================================
       STEP 5 — MOBILE
    ======================================================== */

    .step-five-heading h2 {
        font-size: 19px;
        line-height: 1.2;
    }

    .step-five-heading p {
        font-size: 11px;
        line-height: 1.45;
    }

    .email-template-card {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        padding: 8px;
        border-radius: 13px;
        overflow: hidden;
    }

    .email-subject-row {
        padding: 10px;
    }

    .email-field-copy strong {
        font-size: 12px;
        line-height: 1.35;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .email-body-section,
    .email-body-content {
        width: 100%;
        min-width: 0;
        max-width: 100%;
    }

    .email-body-content pre {
        min-height: 160px;
        max-height: 280px;
        padding: 11px;
        font-size: 10px;
        line-height: 1.5;
        overflow-x: hidden;
        overflow-y: auto;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .copy-email-template-button {
        width: 100%;
        min-height: 52px;
        padding: 8px 12px;
    }

    .copy-email-template-button strong {
        font-size: 11px;
    }

    .copy-email-template-button small {
        font-size: 9px;
    }

    .invitation-send-notice {
        width: 100%;
        padding: 10px 11px;
    }

    .invitation-send-notice span {
        font-size: 9px;
        line-height: 1.4;
    }

    .finish-invitation-button {
        width: 100%;
        min-height: 50px;
    }
}

`}</style>

</main>

 </ResponsivePageLayout>

    );

}
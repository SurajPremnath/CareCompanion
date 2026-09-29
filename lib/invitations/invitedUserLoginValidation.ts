"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type InvitedUserLoginRole =
    | "SELF"
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";

export type InvitedUserLoginValidationStatus =
    | "PRIMARY"
    | "VALID_INVITATION"
    | "CONSENT_REQUIRED"
    | "ACCEPTED"
    | "NOT_INVITED"
    | "ROLE_MISMATCH"
    | "INVALID_INVITATION";

export type InvitedUserLoginAuthenticationMode =
    | "NORMAL"
    | "GOOGLE";

export interface InvitedUserLoginValidationInput {
    email: string;
    userId: string;
    selectedRole?: InvitedUserLoginRole;
    mode: InvitedUserLoginAuthenticationMode;
}

export interface InvitedUserLoginValidationChecks {
    invitationExists: boolean;
    invitationPendingAndUnexpired: boolean;
    tokenHashValid: boolean;
    invitedByActivePrimary: boolean;
    emailMatches: boolean;
    passwordAuthenticationSucceeded: boolean;
    roleMatches: boolean;
}

export interface InvitedUserLoginValidationResult {
    status: InvitedUserLoginValidationStatus;
    message: string;
    invitationId?: string;
    familyId?: string;
    invitationRole?: InvitedUserLoginRole;
    invitationAttemptNumber?: number;
    checks: InvitedUserLoginValidationChecks;
}

type InvitationRow = {
    id: string;
    family_id: string;
    invited_user_id: string | null;
    invited_by: string;
    invited_email: string;
    role: InvitedUserLoginRole;
    governance_id: string | null;
    invitation_attempt_number: number;
    status:
        | "PENDING"
        | "ACCEPTED"
        | "REJECTED"
        | "EXPIRED"
        | "CANCELLED";
    token_hash: string;
    expires_at: string | null;
    consent_accepted_at: string | null;
    authorised_at: string | null;
    created_at: string;
};


const EMPTY_CHECKS: InvitedUserLoginValidationChecks = {
    invitationExists: false,
    invitationPendingAndUnexpired: false,
    tokenHashValid: false,
    invitedByActivePrimary: false,
    emailMatches: false,
    passwordAuthenticationSucceeded: false,
    roleMatches: false,
};

function isSha256Hex(value: string): boolean {
    return /^[a-f0-9]{64}$/i.test(value);
}

function getRoleName(
    role: InvitedUserLoginRole
): string {
    switch (role) {
        case "SELF":
            return "Self";

        case "SECONDARY_FAMILY_MEMBER":
            return "Secondary Family Member";

        case "CARETAKER":
            return "Caretaker";

        case "DOCTOR":
            return "Doctor";
    }
}


export async function validateInvitedUserLogin(
    input: InvitedUserLoginValidationInput
): Promise<InvitedUserLoginValidationResult> {
    const serverSupabase =
        await createSupabaseServerClient();

const authenticatedUserId =
    input.userId;

const authenticatedEmail =
    input.email.trim().toLowerCase();

const passwordAuthenticationSucceeded =
    authenticatedEmail.length > 0;

const suppliedEmail =
    authenticatedEmail;

let selectedRole =
    input.selectedRole;

const {
    data: invitationRows,
    error: invitationError,
} =
    await serverSupabase
        .from("carevr_invitation")
        .select(
            [
                "id",
                "family_id",
                "invited_user_id",
                "invited_by",
                "invited_email",
                "role",
                "governance_id",
                "invitation_attempt_number",
                "status",
                "token_hash",
                "expires_at",
                "consent_accepted_at",
                "authorised_at",
                "created_at",
            ].join(",")
        )
        .or(
            `invited_user_id.eq.${authenticatedUserId},invited_email.eq.${suppliedEmail}`
        )
        .order("created_at", {
            ascending: false,
        });

if (invitationError) {
    console.error(
        "Unable to load CareVR invitations.",
        invitationError
    );

    throw new Error(
        "Unable to determine the CareVR invitation."
    );
}

const invitations =
    (invitationRows ?? []) as unknown as InvitationRow[];


const latestInvitation =
    invitations.find(
        (invitation) =>
            invitation.invited_email
                .trim()
                .toLowerCase() === suppliedEmail
    ) ?? null;

const latestAcceptedInvitation =
    invitations.find(
        (invitation) =>
            invitation.status === "ACCEPTED" &&
            invitation.invited_email
                .trim()
                .toLowerCase() === suppliedEmail
    ) ?? null;

selectedRole =
    selectedRole ??
    latestAcceptedInvitation?.role ??
    latestInvitation?.role ??
    "SELF";


    const accessType =
        selectedRole === "SELF"
            ? "PRIMARY"
            : selectedRole === "SECONDARY_FAMILY_MEMBER"
                ? "SECONDARY_FAMILY_MEMBER"
                : selectedRole;


const invitationIssuerUserId =
    latestInvitation?.invited_by ?? null;

const {
    data: careVRAccessRows,
    error: careVRAccessError,
} =
    await serverSupabase
        .from("carevr_access")
        .select(
            "id, user_id, family_id, patient_id, access_type, access_status"
        )
        .or(
            invitationIssuerUserId
                ? `user_id.eq.${authenticatedUserId},user_id.eq.${invitationIssuerUserId}`
                : `user_id.eq.${authenticatedUserId}`
        )
        .eq("access_status", "ACTIVE");

if (careVRAccessError) {
    console.error(
        "Unable to validate CareVR access.",
        careVRAccessError
    );

    throw new Error(
        "Unable to validate CareVR access."
    );
}

const activeCareVRAccess =
    careVRAccessRows ?? [];

const authenticatedUserAccess =
    activeCareVRAccess.filter(
        (access) =>
            access.user_id ===
            authenticatedUserId
    );

const selectedAccess =
    authenticatedUserAccess.find(
        (access) =>
            access.access_type ===
            accessType
    ) ?? null;

const primaryAccess =
    authenticatedUserAccess.find(
        (access) =>
            access.access_type ===
            "PRIMARY"
    ) ?? null;


if (
    selectedRole === "SELF" &&
    primaryAccess
) {
    return {
        status: "PRIMARY",
        message: "",
        familyId:
            primaryAccess.family_id,
        checks: {
            ...EMPTY_CHECKS,
            emailMatches:
                authenticatedEmail ===
                suppliedEmail,
            passwordAuthenticationSucceeded,
            roleMatches: true,
        },
    };
}

// No separate profiles lookup.
// PRIMARY is established from active carevr_access.



const invitation =
    latestInvitation;

if (!invitation) {
    return {
        status: "NOT_INVITED",
        message:
            "No active CareVR invitation was found for this email address.",
        checks: {
            ...EMPTY_CHECKS,
            emailMatches:
                authenticatedEmail === suppliedEmail,
            passwordAuthenticationSucceeded,
        },
    };
}

    const invitationRole =
        invitation.role as InvitedUserLoginRole;

    const invitationPendingAndUnexpired =
        invitation.status === "PENDING" &&
        invitation.expires_at !== null &&
        new Date(invitation.expires_at).getTime() >
            Date.now();

    const tokenHashValid =
        typeof invitation.token_hash === "string" &&
        isSha256Hex(invitation.token_hash);


const invitedByActivePrimary =
    invitationIssuerUserId !== null &&
    activeCareVRAccess.some(
        (access) =>
            access.user_id ===
                invitationIssuerUserId &&
            access.access_type ===
                "PRIMARY" &&
            access.access_status ===
                "ACTIVE"
    );

    const emailMatches =
        authenticatedEmail === suppliedEmail &&
        suppliedEmail ===
            invitation.invited_email
                .trim()
                .toLowerCase();

const roleMatches =
    selectedRole === invitationRole;

    const checks: InvitedUserLoginValidationChecks = {
        invitationExists: true,
        invitationPendingAndUnexpired,
        tokenHashValid,
        invitedByActivePrimary,
        emailMatches,
        passwordAuthenticationSucceeded,
        roleMatches,
    };

    if (!roleMatches) {
        return {
            status: "ROLE_MISMATCH",
            message:
                `Please select the correct role: ${getRoleName(
                    invitationRole
                )}.`,
            invitationId: invitation.id,
            familyId: invitation.family_id,
            invitationRole,
            invitationAttemptNumber:
                invitation.invitation_attempt_number,
            checks,
        };
    }

    const consentRequired =
        invitation.status === "ACCEPTED" &&
        invitation.consent_accepted_at === null &&
        tokenHashValid &&
        invitedByActivePrimary &&
        emailMatches &&
        passwordAuthenticationSucceeded &&
        roleMatches;

    if (consentRequired) {
        return {
            status: "CONSENT_REQUIRED",
            message:
                "Invitation accepted. Consent Management is required before continuing.",
            invitationId: invitation.id,
            familyId: invitation.family_id,
            invitationRole,
            invitationAttemptNumber:
                invitation.invitation_attempt_number,
            checks,
        };
    }

    const allInvitationGatesPassed =
        invitationPendingAndUnexpired &&
        tokenHashValid &&
        invitedByActivePrimary &&
        emailMatches &&
        passwordAuthenticationSucceeded &&
        roleMatches;

    if (!allInvitationGatesPassed) {
        return {
            status: "INVALID_INVITATION",
            message:
                "This invitation cannot be used for login.",
            invitationId: invitation.id,
            familyId: invitation.family_id,
            invitationRole,
            invitationAttemptNumber:
                invitation.invitation_attempt_number,
            checks,
        };
    }

    return {
        status: "VALID_INVITATION",
        message:
            "Invitation validated. A mandatory password change is required.",
        invitationId: invitation.id,
        familyId: invitation.family_id,
        invitationRole,
        invitationAttemptNumber:
            invitation.invitation_attempt_number,
        checks,
    };
}
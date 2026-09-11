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
    selectedRole: InvitedUserLoginRole;
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
};

export async function validateInvitedUserLogin(
    input: InvitedUserLoginValidationInput
): Promise<InvitedUserLoginValidationResult> {
    const serverSupabase =
        await createSupabaseServerClient();

    let authenticatedUserId =
        input.userId;

    let authenticatedEmail =
        input.email.trim().toLowerCase();

    let passwordAuthenticationSucceeded =
        authenticatedEmail.length > 0;

    if (input.mode === "NORMAL") {
        const {
            data: { user },
            error: userError,
        } = await serverSupabase.auth.getUser();

        if (userError || !user) {
            return {
                status: "INVALID_INVITATION",
                message: "Authentication is required.",
                checks: EMPTY_CHECKS,
            };
        }

        authenticatedUserId =
            user.id;

        authenticatedEmail =
            user.email?.trim().toLowerCase() ?? "";

        passwordAuthenticationSucceeded =
            authenticatedEmail.length > 0;
    }

    const suppliedEmail =
        input.email.trim().toLowerCase();

    const accessType =
        input.selectedRole === "SELF"
            ? "PRIMARY"
            : input.selectedRole === "SECONDARY_FAMILY_MEMBER"
                ? "SECONDARY_FAMILY_MEMBER"
                : input.selectedRole;

    const {
        data: activeCareVRAccess,
        error: activeCareVRAccessError,
    } =
        await serverSupabase
            .from("carevr_access")
            .select(
                "id, family_id, patient_id, access_type, access_status"
            )
.eq("user_id", authenticatedUserId)
            .eq("access_status", "ACTIVE")
            .eq("access_type", accessType)
            .limit(1)
            .maybeSingle();

    if (activeCareVRAccessError) {
        console.error(
            "Unable to validate active CareVR access.",
            activeCareVRAccessError
        );

        throw new Error(
            "Unable to validate CareVR access."
        );
    }

    if (
        input.selectedRole === "SELF" &&
        activeCareVRAccess?.access_type === "PRIMARY"
    ) {
        return {
            status: "PRIMARY",
            message: "",
            checks: {
                ...EMPTY_CHECKS,
                emailMatches:
                    authenticatedEmail === suppliedEmail,
                passwordAuthenticationSucceeded,
                roleMatches: true,
            },
        };
    }

    const {
        data: primaryProfile,
        error: primaryProfileError,
    } =
        await serverSupabase
            .from("profiles")
            .select("id")
.eq("id", authenticatedUserId)
            .eq("family_member_type", "PRIMARY")
            .maybeSingle();

    if (primaryProfileError) {
        console.error(
            "Unable to validate CareVR PRIMARY profile.",
            primaryProfileError
        );

        throw new Error(
            "Unable to validate the CareVR user profile."
        );
    }

    if (
        primaryProfile &&
        input.selectedRole === "SELF"
    ) {
        return {
            status: "PRIMARY",
            message: "",
            checks: {
                ...EMPTY_CHECKS,
                emailMatches:
                    authenticatedEmail === suppliedEmail,
                passwordAuthenticationSucceeded,
                roleMatches: true,
            },
        };
    }

    const {
        data: acceptedInvitationData,
        error: acceptedInvitationError,
    } =
        await serverSupabase
            .from("carevr_invitation")
            .select(
                [
                    "id",
                    "family_id",
                    "invited_user_id",
                    "invited_email",
                    "role",
                    "governance_id",
                    "status",
                    "consent_accepted_at",
                    "authorised_at",
                ].join(",")
            )
.eq("invited_user_id", authenticatedUserId)
            .eq("role", input.selectedRole)
            .eq("status", "ACCEPTED")
            .not("consent_accepted_at", "is", null)
            .order("created_at", {
                ascending: false,
            })
            .limit(1)
            .maybeSingle();

    const acceptedInvitation =
        acceptedInvitationData as InvitationRow | null;

    if (acceptedInvitationError) {
        console.error(
            "Unable to validate accepted CareVR invitation.",
            acceptedInvitationError
        );

        throw new Error(
            "Unable to validate the invitation."
        );
    }

    if (acceptedInvitation) {
        return {
            status: "ACCEPTED",
            message: "",
            invitationRole:
                acceptedInvitation.role as InvitedUserLoginRole,
            checks: {
                invitationExists: true,
                invitationPendingAndUnexpired: false,
                tokenHashValid: true,
                invitedByActivePrimary: true,
                emailMatches:
                    authenticatedEmail ===
                    acceptedInvitation.invited_email
                        .trim()
                        .toLowerCase(),
                passwordAuthenticationSucceeded,
                roleMatches:
                    input.selectedRole ===
                    acceptedInvitation.role,
            },
        };
    }

    const {
        data: invitationData,
        error: invitationError,
    } =
        await serverSupabase
            .from("carevr_invitation")
            .select(
                [
                    "id",
                    "family_id",
                    "invited_by",
                    "invited_email",
                    "role",
                    "invitation_attempt_number",
                    "status",
                    "token_hash",
                    "expires_at",
                    "consent_accepted_at",
                ].join(",")
            )
            .eq("invited_email", suppliedEmail)
            .order("created_at", {
                ascending: false,
            })
            .limit(1)
            .maybeSingle();

    if (invitationError) {
        console.error(
            "Unable to validate invited-user login.",
            invitationError
        );

        throw new Error(
            "Unable to validate the invitation."
        );
    }

    const invitation =
        invitationData as InvitationRow | null;

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

    const {
        data: primaryAccess,
        error: primaryError,
    } =
        await serverSupabase
            .from("carevr_access")
            .select("id")
            .eq("user_id", invitation.invited_by)
            .eq("access_type", "PRIMARY")
            .eq("access_status", "ACTIVE")
            .limit(1)
            .maybeSingle();

    if (primaryError) {
        console.error(
            "Unable to validate invitation Primary.",
            primaryError
        );

        throw new Error(
            "Unable to validate the invitation issuer."
        );
    }

    const invitedByActivePrimary =
        Boolean(primaryAccess);

    const emailMatches =
        authenticatedEmail === suppliedEmail &&
        suppliedEmail ===
            invitation.invited_email
                .trim()
                .toLowerCase();

    const roleMatches =
        input.selectedRole === invitationRole;

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
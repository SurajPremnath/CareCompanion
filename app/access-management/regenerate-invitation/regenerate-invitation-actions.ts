"use server";

import {
    invitationToken,
} from "@/lib/invitations/invitationToken";

import {
    invitationTemplate,
} from "@/lib/invitations/invitationTemplate";

import {
    temporaryPassword,
} from "@/lib/invitations/temporaryPassword";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

export type RegenerationRole =
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";

export interface RegenerableInvitation {
    id: string;
    email: string;
    attemptNumber: number;
}

export interface RegenerableInvitationEmailsResult {
    emails: string[];
}

export interface RegenerableInvitationsResult {
    invitations: RegenerableInvitation[];
}

export interface RegenerateInvitationResult {
    invitationId: string;
    invitationAttemptNumber: number;
    email: string;
    role: RegenerationRole;
    temporaryPassword: string;
    temporaryPasswordExpiresAt: string;
    invitationToken: string;
    invitationExpiresAt: string;
    templateSubject: string;
    templateBody: string;
}


// ============================================================
// Get pending invitations available for regeneration
// ============================================================

export async function getRegenerableInvitationEmails(
    role: RegenerationRole
): Promise<RegenerableInvitationEmailsResult> {

    const result =
        await getRegenerableInvitations(
            role
        );

    return {
        emails:
            result.invitations.map(
                (invitation) =>
                    invitation.email
            ),
    };
}


// ============================================================
// Get the actual pending invitation records.
//
// The invitation ID is required by the recreation function.
// ============================================================

export async function getRegenerableInvitations(
    role: RegenerationRole
): Promise<RegenerableInvitationsResult> {

    const serverSupabase =
        await createSupabaseServerClient();

    const {
        data: { user },
        error: userError
    } =
        await serverSupabase.auth.getUser();

    if (userError || !user) {
        throw new Error(
            "Authentication is required."
        );
    }

    const {
        data: profile,
        error: profileError
    } =
        await serverSupabase
            .from("profiles")
            .select(
                "id, family_member_type"
            )
            .eq(
                "id",
                user.id
            )
            .single();

    if (profileError) {
        throw profileError;
    }

    if (
        profile.family_member_type !==
        "PRIMARY"
    ) {
        throw new Error(
            "Only the Primary family member can regenerate an invitation."
        );
    }

    const {
        data: membership,
        error: membershipError
    } =
        await serverSupabase
            .from("family_memberships")
            .select(
                "family_id"
            )
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "status",
                "ACTIVE"
            )
            .maybeSingle();

    if (membershipError) {
        throw membershipError;
    }

    if (!membership?.family_id) {
        throw new Error(
            "A Family must be established before regenerating an invitation."
        );
    }

    const {
        data: invitations,
        error: invitationError
    } =
        await serverSupabase
            .from("carevr_invitation")
            .select(
                "id, invited_email, invitation_attempt_number, created_at"
            )
            .eq(
                "family_id",
                membership.family_id
            )
            .eq(
                "invited_by",
                user.id
            )
            .eq(
                "role",
                role
            )
            .eq(
                "status",
                "PENDING"
            )
            .eq(
                "invitation_attempt_number",
                1
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            );

    if (invitationError) {
        throw invitationError;
    }

    return {
        invitations:
            (invitations ?? [])
                .filter(
                    (invitation) =>
                        Boolean(
                            invitation.id &&
                            invitation.invited_email
                        )
                )
                .map(
                    (invitation) => ({
                        id:
                            invitation.id,
                        email:
                            invitation.invited_email
                                .trim()
                                .toLowerCase(),
                        attemptNumber:
                            invitation.invitation_attempt_number,
                    })
                ),
    };
}


// ============================================================
// Regenerate an invitation.
//
// This function:
//   1. authenticates the Primary
//   2. verifies the invitation is Attempt 1
//   3. generates a new temporary password
//   4. generates a new invitation token
//   5. calls the authoritative DB recreation function
//   6. renders the existing invitation template
//
// It does not directly update invitation tables.
// ============================================================

export async function regenerateInvitation(
    invitationId: string
): Promise<RegenerateInvitationResult> {

    const serverSupabase =
        await createSupabaseServerClient();

    const {
        data: { user },
        error: userError
    } =
        await serverSupabase.auth.getUser();

    if (userError || !user) {
        throw new Error(
            "Authentication is required."
        );
    }

    if (!invitationId?.trim()) {
        throw new Error(
            "Invitation ID is required."
        );
    }


    // ----------------------------------------------------------
    // Resolve the selected invitation before generating the
    // replacement credentials.
    //
    // The DB function remains the authoritative security boundary
    // for ownership, lifecycle state, latest-attempt validation,
    // module preservation, closure, and replacement creation.
    // ----------------------------------------------------------

    const {
        data: invitation,
        error: invitationError
    } =
        await serverSupabase
            .from("carevr_invitation")
            .select(
                "id, invited_email, role, status, invitation_attempt_number"
            )
            .eq(
                "id",
                invitationId
            )
            .eq(
                "invited_by",
                user.id
            )
            .single();

    if (invitationError) {
        console.error(
            "Unable to load invitation for regeneration.",
            invitationError
        );

        throw new Error(
            invitationError.message ||
            "Unable to load the selected invitation."
        );
    }

    if (!invitation) {
        throw new Error(
            "The selected invitation could not be found."
        );
    }

    if (
        invitation.status !==
        "PENDING"
    ) {
        throw new Error(
            "Only a pending invitation can be regenerated."
        );
    }

    if (
        invitation.invitation_attempt_number !==
        1
    ) {
        throw new Error(
            "This invitation has already been regenerated."
        );
    }


    const role =
        invitation.role as RegenerationRole;

    if (
        role !==
            "SECONDARY_FAMILY_MEMBER" &&
        role !==
            "CARETAKER" &&
        role !==
            "DOCTOR"
    ) {
        throw new Error(
            "The selected invitation role is not permitted."
        );
    }


    const email =
        invitation.invited_email
            .trim()
            .toLowerCase();


    // ----------------------------------------------------------
    // Generate completely new credentials.
    //
    // The temporary password and invitation token are separate
    // secrets with separate purposes.
    // ----------------------------------------------------------

    const passwordResult =
        temporaryPassword.generate();

    const tokenResult =
        invitationToken.generate();


    const invitationExpiresAt =
        new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
        ).toISOString();


    // ----------------------------------------------------------
    // Recreate the invitation through the authoritative
    // database function.
    //
    // The DB function closes the old invitation, records the
    // CLOSED audit event, preserves the module configuration,
    // and creates the next invitation attempt.
    // ----------------------------------------------------------

    const {
        data,
        error
    } =
        await serverSupabase.rpc(
            "recreate_carevr_invitation",
            {
                p_invitation_id:
                    invitation.id,

                p_token_hash:
                    tokenResult.tokenHash,

                p_expires_at:
                    invitationExpiresAt,
            }
        );

    if (error) {
        console.error(
            "Unable to recreate invitation.",
            error
        );

        throw new Error(
            error.message ||
            "Unable to recreate the invitation."
        );
    }


    const recreatedInvitation =
        data?.[0];

    if (
        !recreatedInvitation?.invitation_id
    ) {
        throw new Error(
            "Invitation recreation did not return an invitation ID."
        );
    }


    // ----------------------------------------------------------
    // Read the replacement invitation modules so the existing
    // role-specific invitation template can be rendered with
    // the same permitted access configuration.
    // ----------------------------------------------------------

    const {
        data: modules,
        error: modulesError
    } =
        await serverSupabase
            .from("carevr_invitation_modules")
            .select(
                "governance_module_id, module, requested_permission, permitted_permission"
            )
            .eq(
                "invitation_id",
                recreatedInvitation.invitation_id
            )
            .eq(
                "status",
                "PERMITTED"
            )
            .order(
                "module",
                {
                    ascending: true,
                }
            );

    if (modulesError) {
        console.error(
            "Unable to load recreated invitation modules.",
            modulesError
        );

        throw new Error(
            modulesError.message ||
            "Unable to load the recreated invitation modules."
        );
    }


    const permittedModules =
        (modules ?? []).map(
            (module) => ({
                id:
                    module.governance_module_id,

                module:
                    module.module,

                requestedPermission:
                    module.requested_permission,

                permittedPermission:
                    module.permitted_permission,
            })
        );


    if (
        permittedModules.length === 0
    ) {
        throw new Error(
            "The recreated invitation has no permitted modules."
        );
    }


    // ----------------------------------------------------------
    // Reuse the existing invitation template system.
    // ----------------------------------------------------------

    const renderedTemplate =
        invitationTemplate.create({
            inviteeEmail:
                email,

            role:
                role,

            modules:
                permittedModules,

            temporaryPassword:
                passwordResult.password,

            expiresAt:
                invitationExpiresAt,
        });


    return {
        invitationId:
            recreatedInvitation.invitation_id,

        invitationAttemptNumber:
            recreatedInvitation.invitation_attempt_number,

        email,

        role,

        temporaryPassword:
            passwordResult.password,

        temporaryPasswordExpiresAt:
            passwordResult.expiresAt,

        invitationToken:
            tokenResult.token,

        invitationExpiresAt,

        templateSubject:
            renderedTemplate.subject,

        templateBody:
            renderedTemplate.body,
    };
}
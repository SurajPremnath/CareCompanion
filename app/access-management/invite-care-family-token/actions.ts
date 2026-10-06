"use server";

import {
    invitationValidation,
    type InvitationRole,
    type InvitationModuleRequest
} from "@/lib/invitations/invitationValidation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
    inviteeInvitationToken
} from "@/lib/invitations/inviteeInvitationToken";

import {
    productInvitationProvisioning
} from "@/lib/invitations/productInvitationProvisioning";

import {
    invitationEmailService
} from "@/lib/email/invitationEmailService";


// ==================================================
// SEND INVITATION EMAIL
// ==================================================

export interface SendInvitationEmailInput {
    email: string;
    subject: string;
    body: string;
}

export interface SendInvitationEmailResult {
    success: true;
    emailId: string;
}

export async function sendInvitationEmail(
    input: SendInvitationEmailInput
): Promise<SendInvitationEmailResult> {

    const serverSupabase =
        await createSupabaseServerClient();

// Authentication is resolved by invitationValidation.validate().
// Reuse validation.userId downstream instead of querying auth again.

/*
const authStartedAt =
    performance.now();

const {
    data: { user },
    error: userError
} =
    await serverSupabase.auth.getUser();


    if (
        userError ||
        !user
    ) {
        throw new Error(
            "Authentication is required to send an invitation email."
        );
    }
*/

    const email =
        input.email
            .trim()
            .toLowerCase();

    if (!email) {
        throw new Error(
            "Invitee email address is required."
        );
    }

    if (!input.subject.trim()) {
        throw new Error(
            "Invitation email subject is required."
        );
    }

    if (!input.body.trim()) {
        throw new Error(
            "Invitation email body is required."
        );
    }

    return await invitationEmailService.send({
        to: email,
        subject: input.subject,
        body: input.body
    });
}


// ==================================================
// CREATE TOKEN INVITATION
// ==================================================

export interface CreateTokenInvitationInput {
    email: string;
    role: InvitationRole;
    modules: InvitationModuleRequest[];
}

export interface CreateTokenInvitationResult {
    success: true;
    invitationId: string;
    invitationAttemptNumber: number;
    email: string;
    role: InvitationRole;
    invitationToken: string;
    invitationExpiresAt: string;
}


export interface CreateTokenInvitationFailure {
    success: false;
    code: string;
    message: string;
    existingInvitationId?: string;
}

export async function createTokenInvitation(
    input: CreateTokenInvitationInput
): Promise<
    CreateTokenInvitationResult |
    CreateTokenInvitationFailure
> {

    const serverSupabase =
        await createSupabaseServerClient();

/*
    const {
        data: { user },
        error: userError
    } =
        await serverSupabase.auth.getUser();

    if (
        userError ||
        !user
    ) {
        throw new Error(
            "Authentication is required to create an invitation."
        );
    }
*/

const validationStartedAt =
    performance.now();

const validationResult =
    await invitationValidation.validate(
        input,
        serverSupabase
    );


if (
    !validationResult.success ||
    !validationResult.data
) {
    if (
        validationResult.code ===
        "INVITATION_ALREADY_ACTIVE"
    ) {
        const {
            data: userData,
            error: userError
        } =
            await serverSupabase.auth.getUser();

        if (
            userError ||
            !userData.user
        ) {
            throw new Error(
                "Authentication is required."
            );
        }

        const {
            data: membership,
            error: membershipError
        } =
            await serverSupabase
                .from("family_memberships")
                .select("family_id")
                .eq(
                    "user_id",
                    userData.user.id
                )
                .eq(
                    "status",
                    "ACTIVE"
                )
                .maybeSingle();

        if (membershipError) {
            throw membershipError;
        }

        const email =
            input.email
                .trim()
                .toLowerCase();

        const {
            data: existingInvitation,
            error: existingInvitationError
        } =
            await serverSupabase
                .from("carevr_invitation")
                .select("id")
                .eq(
                    "family_id",
                    membership?.family_id ?? ""
                )
                .eq(
                    "invited_email",
                    email
                )
                .eq(
                    "role",
                    input.role
                )
                .eq(
                    "status",
                    "PENDING"
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    }
                )
                .limit(1)
                .maybeSingle();

        if (existingInvitationError) {
            throw existingInvitationError;
        }

        return {
            success: false,
            code:
                "INVITATION_ALREADY_EXISTS",
            message:
                "This email address already has an active CareVR invitation.",
            existingInvitationId:
                existingInvitation?.id
        };
    }

    return {
        success: false,
        code:
            validationResult.code ??
            "INVITATION_VALIDATION_FAILED",
        message:
            validationResult.message ??
            "Unable to validate the invitation."
    };
}

    const validation =
        validationResult.data;

    const tokenResult =
        inviteeInvitationToken.generate();

    const invitationExpiresAt =
        new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
        ).toISOString();

    const email =
        input.email
            .trim()
            .toLowerCase();

const rpcStartedAt =
    performance.now();

const {
    data,
    error
} =
    await serverSupabase.rpc(
        "create_carevr_invitation",
        {
            p_invited_email:
                email,

            p_role:
                input.role,

            p_governance_id:
                validation.governanceId,

            p_token_hash:
                tokenResult.tokenHash,

            p_expires_at:
                invitationExpiresAt,

            p_modules:
                validation.permittedModules.map(
                    (module) => ({
                        id:
                            module.id,

                        module:
                            module.module,

                        requestedPermission:
                            module.requestedPermission,

                        permittedPermission:
                            module.permittedPermission
                    })
                )
        }
    );


    if (error) {

        console.error(
            "Unable to create token invitation.",
            error
        );

if (
    error.message ===
    "An invitation for this email address is already active or has already been accepted."
) {
    const {
        data: existingInvitation,
        error: existingInvitationError
    } =
        await serverSupabase
            .from("carevr_invitation")
            .select(
                "id, invitation_attempt_number"
            )
            .eq(
                "invited_email",
                email
            )
            .eq(
                "invited_by",
                validation.userId
            )
            .eq(
                "role",
                input.role
            )
            .eq(
                "status",
                "PENDING"
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            )
            .limit(1)
            .maybeSingle();

    if (existingInvitationError) {
        console.error(
            "Unable to load the existing invitation.",
            existingInvitationError
        );

        throw new Error(
            existingInvitationError.message ||
            "Unable to load the existing invitation."
        );
    }

    return {
        success: false,
        code: "INVITATION_ALREADY_EXISTS",
        message:
            "This email address already has an active CareVR invitation.",
        existingInvitationId:
            existingInvitation?.id
    };
}

        throw new Error(
            error.message ||
            "Unable to create the invitation."
        );
    }

    const createdInvitation =
        data?.[0];

    if (
        !createdInvitation?.invitation_id
    ) {
        throw new Error(
            "Invitation creation did not return an invitation ID."
        );
    }


/*
 * Role clarification
 *
 * This invitation was created by an existing Primary.
 * Record only the entry context so registration can
 * distinguish an INVITATION from a PRODUCT link.
 *
 * This does not replace or modify carevr_invitation.
 */
const {
    error: roleClarificationError,
} =
    await serverSupabase
        .from("role_clarification")
        .insert({
            email,
            type:
                "INVITATION",
            invited_role:
                input.role,
        });

if (roleClarificationError) {

    console.error(
        "Unable to create role clarification record.",
        roleClarificationError
    );

}

const provisioningStartedAt =
    performance.now();

/*
await productInvitationProvisioning
    .provisionAccepted(
        email,
        user.id
    );
*/
/*
await productInvitationProvisioning
    .provisionAccepted(
        email,
        validation.userId
    );


*/
    return {
        success: true,

        invitationId:
            createdInvitation.invitation_id,

        invitationAttemptNumber:
            createdInvitation.invitation_attempt_number,

        email,

        role:
            input.role,

        invitationToken:
            tokenResult.token,

        invitationExpiresAt
    };
}
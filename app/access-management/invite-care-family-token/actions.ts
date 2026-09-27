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

    const {
        data: { user },
        error: userError
    } = await serverSupabase.auth.getUser();

    if (
        userError ||
        !user
    ) {
        throw new Error(
            "Authentication is required to send an invitation email."
        );
    }

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
}

export async function createTokenInvitation(
    input: CreateTokenInvitationInput
): Promise<
    CreateTokenInvitationResult |
    CreateTokenInvitationFailure
> {

    const serverSupabase =
        await createSupabaseServerClient();

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

const validationStartedAt =
    performance.now();

const validationResult =
    await invitationValidation.validate(
        input,
        serverSupabase
    );

console.log(
    "[INVITE-PERF] invitationValidation:",
    Math.round(
        performance.now() -
        validationStartedAt
    ),
    "ms"
);

if (
    !validationResult.success ||
    !validationResult.data
) {
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

console.log(
    "[INVITE-PERF] create_carevr_invitation:",
    Math.round(
        performance.now() -
        rpcStartedAt
    ),
    "ms"
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
    return {
        success: false,
	code: "INVITATION_ALREADY_EXISTS",
        message:
            "This email address already has an active or accepted CareVR invitation. Please reach out to the Primary family member for further details."
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

const provisioningStartedAt =
    performance.now();

await productInvitationProvisioning
    .provisionAccepted(
        email,
        user.id
    );

console.log(
    "[INVITE-PERF] provisionAccepted:",
    Math.round(
        performance.now() -
        provisioningStartedAt
    ),
    "ms"
);

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
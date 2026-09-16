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

export interface CreateTokenInvitationInput {
    email: string;
    role: InvitationRole;
    modules: InvitationModuleRequest[];
}

export interface CreateTokenInvitationResult {
    invitationId: string;
    invitationAttemptNumber: number;
    email: string;
    role: InvitationRole;
    invitationToken: string;
    invitationExpiresAt: string;
}

export async function createTokenInvitation(
    input: CreateTokenInvitationInput
): Promise<CreateTokenInvitationResult> {

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

    const validationResult =
        await invitationValidation.validate(
            input,
            serverSupabase
        );

    if (
        !validationResult.success ||
        !validationResult.data
    ) {
        throw new Error(
            validationResult.message ??
            "Unable to validate the invitation."
        );
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

    await productInvitationProvisioning
        .provisionAccepted(
            email,
            user.id
        );

    return {
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
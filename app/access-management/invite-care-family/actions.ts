"use server";

import { invitationToken } from "@/lib/invitations/invitationToken";
import {
    invitationValidation,
    type InvitationRole,
    type InvitationModuleRequest
} from "@/lib/invitations/invitationValidation";
import { invitationTemplate } from "@/lib/invitations/invitationTemplate";
import { temporaryPassword } from "@/lib/invitations/temporaryPassword";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { invitedUserCredential } from "@/lib/invitations/invitedUserCredential";

export interface CreateInvitationInput {
    email: string;
    role: InvitationRole;
    modules: InvitationModuleRequest[];
}

export interface CreateInvitationResult {
    invitationId: string;
    invitationAttemptNumber: number;
    email: string;
    role: InvitationRole;
    temporaryPassword: string;
    temporaryPasswordExpiresAt: string;
    invitationToken: string;
    invitationExpiresAt: string;
    templateSubject: string;
    templateBody: string;
}

export async function generateInvitationTemporaryPassword() {
    return temporaryPassword.generate();
}

export async function createInvitation(
    input: CreateInvitationInput
): Promise<CreateInvitationResult> {
    const serverSupabase =
        await createSupabaseServerClient();

    const {
        data: { user },
        error: userError
    } = await serverSupabase.auth.getUser();

    if (userError || !user) {
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

    const passwordResult =
        temporaryPassword.generate();

    const tokenResult =
        invitationToken.generate();

    const invitationExpiresAt =
        new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
        ).toISOString();

    const email =
        input.email
            .trim()
            .toLowerCase();

    const credential =
        await invitedUserCredential.create({
            email,
            temporaryPassword:
                passwordResult.password,
            temporaryPasswordExpiresAt:
                passwordResult.expiresAt,
            role:
                input.role,
        });

    const { data, error } =
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
                            id: module.id,
                            module: module.module,
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
            "Unable to create invitation.",
            error
        );

        const {
            error: cleanupError
        } =
            await invitedUserCredential.remove(
                credential.userId
            );

        if (cleanupError) {
            console.error(
                "Unable to clean up the invited user's authentication account after invitation creation failed.",
                cleanupError
            );
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
        const {
            error: cleanupError
        } =
            await invitedUserCredential.remove(
                credential.userId
            );

        if (cleanupError) {
            console.error(
                "Unable to clean up the invited user's authentication account after invitation creation returned no invitation ID.",
                cleanupError
            );
        }

        throw new Error(
            "Invitation creation did not return an invitation ID."
        );
    }

    const renderedTemplate =
        invitationTemplate.create({
            inviteeEmail:
                email,

            role:
                input.role,

            modules:
                validation.permittedModules,

            temporaryPassword:
                passwordResult.password,

            expiresAt:
                invitationExpiresAt,
        });

    return {
        invitationId:
            createdInvitation.invitation_id,

        invitationAttemptNumber:
            createdInvitation.invitation_attempt_number,

        email,

        role:
            input.role,

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
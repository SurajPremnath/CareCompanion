"use server";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    inviteeInvitationToken,
} from "@/lib/invitations/inviteeInvitationToken";

import {
    inviteeCaretakerInvitationTemplate,
} from "@/lib/invitations/templates/inviteeCaretakerInvitation";

import {
    inviteeDoctorInvitationTemplate,
} from "@/lib/invitations/templates/inviteeDoctorInvitation";

import {
    inviteeSecondaryFamilyMemberInvitationTemplate,
} from "@/lib/invitations/templates/inviteeSecondaryFamilyMemberInvitation";

export type RegenerationRole =
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";

export interface RegenerateInvitationResult {
    invitationId: string;
    invitationAttemptNumber: number;
    email: string;
    role: RegenerationRole;
    invitationToken: string;
    invitationExpiresAt: string;
    templateSubject: string;
    templateBody: string;
}

export async function regenerateInvitationToken(
    invitationId: string
): Promise<RegenerateInvitationResult> {

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
            "Authentication is required."
        );
    }

    if (!invitationId?.trim()) {
        throw new Error(
            "Invitation ID is required."
        );
    }

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
            "Unable to load invitation for token regeneration.",
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

    const tokenResult =
        inviteeInvitationToken.generate();

    const invitationExpiresAt =
        new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
        ).toISOString();

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
            "Unable to recreate invitation with new token.",
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

    const permittedAccess =
        (modules ?? [])
            .map(
                (module) =>
                    `${module.module} — ${
                        module.permitted_permission === "VIEW"
                            ? "View Only"
                            : "Contribute"
                    }`
            )
            .join("\n");

    if (!permittedAccess) {
        throw new Error(
            "The recreated invitation has no permitted modules."
        );
    }

    const template =
        role === "CARETAKER"
            ? inviteeCaretakerInvitationTemplate
            : role === "DOCTOR"
                ? inviteeDoctorInvitationTemplate
                : inviteeSecondaryFamilyMemberInvitationTemplate;

const invitationLink =
    `${process.env.NEXT_PUBLIC_SITE_URL}/invitee-registration?token=${encodeURIComponent(
        tokenResult.token
    )}`;

const templateBody =
    template.body
        .replace(
            "{{invitee_registration_url}}",
            invitationLink
        )
        .replace(
            "{{permitted_access}}",
            permittedAccess
        );

    return {
        invitationId:
            recreatedInvitation.invitation_id,

        invitationAttemptNumber:
            recreatedInvitation.invitation_attempt_number,

        email,

        role,

        invitationToken:
            tokenResult.token,

        invitationExpiresAt,

        templateSubject:
            template.subject,

        templateBody,
    };
}
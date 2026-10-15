"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AcceptInvitationResult {
    success: boolean;
    message: string;
}

export interface InvitationContextResult {
    role:
        | "SECONDARY_FAMILY_MEMBER"
        | "CARETAKER"
        | "DOCTOR";
}

interface InvitationRow {
    id: string;
    family_id: string;
    invited_email: string;
    role:
        | "SECONDARY_FAMILY_MEMBER"
        | "CARETAKER"
        | "DOCTOR";
    status:
        | "PENDING"
        | "ACCEPTED"
        | "REJECTED"
        | "EXPIRED"
        | "CANCELLED";
}

export async function getInvitationContext(
    invitationId: string
): Promise<InvitationContextResult> {
    const serverSupabase =
        await createSupabaseServerClient();

    const {
        data: { user },
        error: userError,
    } = await serverSupabase.auth.getUser();

    if (userError || !user) {
        throw new Error(
            "Authentication is required."
        );
    }

    if (!invitationId) {
        throw new Error(
            "Invitation information is missing."
        );
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
                    "invited_email",
                    "role",
                ].join(",")
            )
            .eq("id", invitationId)
            .maybeSingle();

    if (invitationError) {
        console.error(
            "Unable to load invitation context.",
            invitationError
        );

        throw new Error(
            "Unable to validate the invitation."
        );
    }

    const invitation =
        invitationData as Pick<
            InvitationRow,
            "id" | "invited_email" | "role"
        > | null;

    if (!invitation) {
        throw new Error(
            "Invitation not found."
        );
    }

    const authenticatedEmail =
        user.email?.trim().toLowerCase() ?? "";

    const invitedEmail =
        invitation.invited_email
            .trim()
            .toLowerCase();

    if (
        !authenticatedEmail ||
        authenticatedEmail !== invitedEmail
    ) {
        throw new Error(
            "This invitation does not belong to the authenticated user."
        );
    }

    return {
        role: invitation.role,
    };
}

export async function acceptInvitation(
    invitationId: string
): Promise<AcceptInvitationResult> {
    const serverSupabase =
        await createSupabaseServerClient();

    const {
        data: { user },
        error: userError,
    } = await serverSupabase.auth.getUser();

    if (userError || !user) {
        throw new Error(
            "Authentication is required."
        );
    }

    if (!invitationId) {
        throw new Error(
            "Invitation information is missing."
        );
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
                    "invited_email",
                    "role",
                    "status",
                ].join(",")
            )
            .eq("id", invitationId)
            .maybeSingle();

    if (invitationError) {
        console.error(
            "Unable to load invitation for acceptance.",
            invitationError
        );

        throw new Error(
            "Unable to validate the invitation."
        );
    }

    const invitation =
        invitationData as InvitationRow | null;

    if (!invitation) {
        throw new Error(
            "Invitation not found."
        );
    }

    const authenticatedEmail =
        user.email?.trim().toLowerCase() ?? "";

    const invitedEmail =
        invitation.invited_email
            .trim()
            .toLowerCase();

    if (
        !authenticatedEmail ||
        authenticatedEmail !== invitedEmail
    ) {
        throw new Error(
            "This invitation does not belong to the authenticated user."
        );
    }

    if (invitation.status !== "PENDING") {
        throw new Error(
            "This invitation is no longer pending."
        );
    }

    const now =
        new Date();

    const permanentPasswordExpiresAt =
        new Date(now);

    permanentPasswordExpiresAt.setMonth(
        permanentPasswordExpiresAt.getMonth() + 2
    );

    const {
        error: profileError,
    } =
        await serverSupabase
            .from("profiles")
            .update({
                temporary_password_expires_at:
                    null,

                password_changed_at:
                    now.toISOString(),

                password_changed_by:
                    user.id,

                permanent_password_expires_at:
                    permanentPasswordExpiresAt.toISOString(),
            })
            .eq("id", user.id);

    if (profileError) {
        console.error(
            "Unable to update invited-user password lifecycle.",
            profileError
        );

        throw new Error(
            "Password was changed, but the account lifecycle could not be completed."
        );
    }

    const {
        data: acceptedInvitation,
        error: invitationUpdateError,
    } =
        await serverSupabase
            .from("carevr_invitation")
            .update({
                status:
                    "ACCEPTED",

                invited_user_id:
                    user.id,

                accepted_at:
                    now.toISOString(),

                accepted_by:
                    user.id,

                expires_at:
                    null,

                updated_at:
                    now.toISOString(),
            })
            .eq("id", invitationId)
            .eq("status", "PENDING")
            .select("id")
            .maybeSingle();

    if (invitationUpdateError) {
        console.error(
            "Unable to accept invitation.",
            invitationUpdateError
        );

        throw new Error(
            "Password was changed, but the invitation could not be accepted."
        );
    }

    if (!acceptedInvitation) {
        throw new Error(
            "The invitation could not be accepted."
        );
    }

    const {
        error: logError,
    } =
        await serverSupabase
            .from("carevr_invite_log")
            .insert({
                invitation_id:
                    invitationId,

                family_id:
                    invitation.family_id,

                actor_user_id:
                    user.id,

                event_type:
                    "ACCEPTED",

                reason_code:
                    null,

                reason:
                    null,

                remarks:
                    null,

                metadata: {
                    role:
                        invitation.role,

                    invited_email:
                        invitation.invited_email,

                    accepted_by:
                        user.id,
                },
            });

    if (logError) {
        console.error(
            "Unable to write invitation acceptance audit log.",
            logError
        );

        throw new Error(
            "Invitation was accepted, but the audit record could not be written."
        );
    }

    return {
        success: true,
        message:
            "Your password has been changed successfully.",
    };
}
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RegenerationRole =
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";

export type RegenerableInvitation = {
    id: string;
    email: string;
    attemptNumber: number;
};

export interface RegenerableInvitationsResult {
    invitations: RegenerableInvitation[];
}

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
                "id, invited_email, invitation_attempt_number"
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
                    invitation =>
                        Boolean(
                            invitation.invited_email
                        )
                )
                .map(
                    invitation => ({
                        id:
                            invitation.id,
                        email:
                            invitation.invited_email
                                .trim()
                                .toLowerCase(),
                        attemptNumber:
                            invitation
                                .invitation_attempt_number,
                    })
                ),
    };
}

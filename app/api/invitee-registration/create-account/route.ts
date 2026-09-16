import { NextResponse } from "next/server";

import {
    createHash,
} from "crypto";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";

export async function POST(
    request: Request
) {

    let createdUserId:
        string | null = null;

    try {

        const body =
            await request.json();

        const token =
            typeof body.token === "string"
                ? body.token.trim()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        const confirmPassword =
            typeof body.confirmPassword === "string"
                ? body.confirmPassword
                : "";

        if (!token) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invitation token is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!password) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (password.length < 8) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must contain at least 8 characters.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            password !==
            confirmPassword
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Passwords do not match.",
                },
                {
                    status: 400,
                }
            );
        }

        const tokenHash =
            createHash("sha256")
                .update(
                    token,
                    "utf8"
                )
                .digest("hex");

        const {
            data: invitation,
            error: invitationError,
        } =
            await supabaseAdmin
                .from("carevr_invitation")
                .select(
                    `
                    id,
                    family_id,
                    invited_email,
                    role,
                    status,
                    expires_at
                    `
                )
                .eq(
                    "token_hash",
                    tokenHash
                )
                .maybeSingle();

        if (invitationError) {

            console.error(
                "Unable to load invitee registration invitation.",
                invitationError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unable to validate the invitation.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!invitation) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation link is invalid.",
                },
                {
                    status: 200,
                }
            );
        }

        if (
            invitation.status !==
            "PENDING"
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation is no longer available.",
                },
                {
                    status: 200,
                }
            );
        }

        if (
            new Date(
                invitation.expires_at
            ) <= new Date()
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation has expired.",
                },
                {
                    status: 200,
                }
            );
        }

        const email =
            invitation.invited_email
                .trim()
                .toLowerCase();

        const {
            data: existingUsers,
            error: listUsersError
        } =
            await supabaseAdmin.auth.admin.listUsers();

        if (listUsersError) {

            throw new Error(
                listUsersError.message ||
                "Unable to verify the invited user's account."
            );
        }

        const existingUser =
            existingUsers.users.find(
                (candidate) =>
                    candidate.email
                        ?.trim()
                        .toLowerCase() ===
                    email
            );

        if (existingUser) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "An account already exists for this invitation email.",
                },
                {
                    status: 409,
                }
            );
        }

        const {
            data: createdUser,
            error: createUserError
        } =
            await supabaseAdmin.auth.admin.createUser({
                email,

                password,

                email_confirm:
                    true,

                user_metadata: {
                    family_member_type:
                        invitation.role ===
                        "SECONDARY_FAMILY_MEMBER"
                            ? "SECONDARY"
                            : "OTHER",
                },
            });

        if (
            createUserError ||
            !createdUser.user?.id
        ) {

            throw new Error(
                createUserError?.message ||
                "Unable to create the CareVR account."
            );
        }

        createdUserId =
            createdUser.user.id;

        const now =
            new Date().toISOString();

        const {
            error: invitationUpdateError
        } =
            await supabaseAdmin
                .from("carevr_invitation")
                .update({
                    status:
                        "ACCEPTED",

                    invited_user_id:
                        createdUserId,

                    accepted_at:
                        now,

                    accepted_by:
                        createdUserId,

                    expires_at:
                        null,

                    updated_at:
                        now,
                })
                .eq(
                    "id",
                    invitation.id
                )
                .eq(
                    "status",
                    "PENDING"
                );

        if (invitationUpdateError) {

            throw new Error(
                "The account was created, but the invitation could not be accepted."
            );
        }

        const {
            error: logError
        } =
            await supabaseAdmin
                .from("carevr_invite_log")
                .insert({
                    invitation_id:
                        invitation.id,

                    family_id:
                        invitation.family_id,

                    actor_user_id:
                        createdUserId,

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
                            createdUserId,
                    },
                });

        if (logError) {

            throw new Error(
                "The invitation was accepted, but the audit record could not be written."
            );
        }

        return NextResponse.json(
            {
                success: true,

                user: {
                    id:
                        createdUserId,

                    email,
                },

                role:
                    invitation.role,
            },
            {
                status: 200,
            }
        );

    }
    catch (error) {

        if (createdUserId) {

            const {
                error: cleanupError
            } =
                await supabaseAdmin.auth.admin
                    .deleteUser(
                        createdUserId
                    );

            if (cleanupError) {

                console.error(
                    "Unable to clean up invitee Auth account after registration failure.",
                    cleanupError
                );
            }
        }

        console.error(
            "Invitee account creation failed.",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to create the CareVR account.",
            },
            {
                status: 500,
            }
        );
    }
}

import { NextResponse } from "next/server";
import { createHash } from "crypto";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    try {
        const authorizationHeader =
            request.headers.get("authorization");

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Your session has expired. Please sign in again.",
                },
                { status: 401 }
            );
        }

        const accessToken =
            authorizationHeader.substring("Bearer ".length);

        const {
            data: { user },
            error: userError,
        } = await supabaseAdmin.auth.getUser(accessToken);

        if (userError || !user || !user.email) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Authentication is required. Please sign in again.",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const token =
            typeof body.token === "string"
                ? body.token.trim()
                : "";

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invitation token is required.",
                },
                { status: 400 }
            );
        }

        const tokenHash = createHash("sha256")
            .update(token, "utf8")
            .digest("hex");

        const {
            data: invitation,
            error: invitationError,
        } = await supabaseAdmin
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
            .eq("token_hash", tokenHash)
            .maybeSingle();

        if (invitationError) {
            console.error(
                "Unable to load DUAL registration invitation.",
                invitationError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unable to validate the invitation.",
                },
                { status: 500 }
            );
        }

        if (!invitation) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation link is invalid.",
                },
                { status: 400 }
            );
        }

        if (invitation.status !== "PENDING") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation is no longer available.",
                },
                { status: 409 }
            );
        }

        if (
            !invitation.expires_at ||
            new Date(invitation.expires_at) <= new Date()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation has expired.",
                },
                { status: 400 }
            );
        }

        const authenticatedEmail =
            user.email.trim().toLowerCase();

        const invitationEmail =
            invitation.invited_email.trim().toLowerCase();

        if (authenticatedEmail !== invitationEmail) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please sign in with the existing account associated with this invitation.",
                },
                { status: 403 }
            );
        }

        const now = new Date().toISOString();

        const {
            data: acceptedInvitation,
            error: invitationUpdateError,
        } = await supabaseAdmin
            .from("carevr_invitation")
            .update({
                status: "ACCEPTED",
                invited_user_id: user.id,
                accepted_at: now,
                accepted_by: user.id,
                expires_at: null,
                updated_at: now,
            })
            .eq("id", invitation.id)
            .eq("status", "PENDING")
            .select("id")
            .maybeSingle();

        if (invitationUpdateError) {
            console.error(
                "Unable to accept DUAL registration invitation.",
                invitationUpdateError
            );

            throw new Error(
                "The invitation could not be accepted."
            );
        }

        if (!acceptedInvitation) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This invitation has already been accepted or is no longer available.",
                },
                { status: 409 }
            );
        }

        const {
            error: digitalHealthProfileError,
        } = await supabaseAdmin
            .from("digital_health_profile")
            .insert({
                user_id: user.id,
                family_id: invitation.family_id,
                invitation_status: "ACCEPTED",
                consent_status: "PENDING",
                digital_health_flag: false,
                role_status: "SINGLE",
            });

        if (digitalHealthProfileError) {
            console.error(
                "Unable to create invited-family Digital Health Profile.",
                digitalHealthProfileError
            );

            throw new Error(
                "The invitation was accepted, but the digital health profile could not be created."
            );
        }

        const { error: logError } =
            await supabaseAdmin
                .from("carevr_invite_log")
                .insert({
                    invitation_id: invitation.id,
                    family_id: invitation.family_id,
                    actor_user_id: user.id,
                    event_type: "ACCEPTED",
                    reason_code: null,
                    reason: null,
                    remarks: null,
                    metadata: {
                        role: invitation.role,
                        invited_email: invitation.invited_email,
                        accepted_by: user.id,
                        registration_mode: "DUAL",
                    },
                });

        if (logError) {
            console.error(
                "Unable to write DUAL invitation audit record.",
                logError
            );

            throw new Error(
                "The invitation was accepted, but the audit record could not be written."
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                },
                role: invitation.role,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "DUAL invitation acceptance failed.",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to accept the invitation.",
            },
            { status: 500 }
        );
    }
}

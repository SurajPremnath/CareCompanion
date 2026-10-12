
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { invitationEmailService } from "@/lib/email/invitationEmailService";
import { productInvitationTemplate } from "@/lib/invitations/productInvitationTemplate";

const FOUNDER_EMAIL = "premnath.suraj@gmail.com";

async function authorizeFounder(request: NextRequest) {
    const authorizationHeader = request.headers.get("authorization");

    if (!authorizationHeader?.startsWith("Bearer ")) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Authentication is required." },
                { status: 401 }
            ),
        };
    }

    const accessToken = authorizationHeader.slice("Bearer ".length);

    const {
        data: { user },
        error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Authentication is required." },
                { status: 401 }
            ),
        };
    }

    if ((user.email ?? "").trim().toLowerCase() !== FOUNDER_EMAIL) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "You are not authorized to send Primary invitations." },
                { status: 403 }
            ),
        };
    }

    const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("is_founder")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        throw profileError;
    }

    if (profile?.is_founder !== true) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Founder authorization is required." },
                { status: 403 }
            ),
        };
    }

    return { authorized: true as const };
}

export async function POST(request: NextRequest) {
    try {
        const authorization = await authorizeFounder(request);

        if (!authorization.authorized) {
            return authorization.response;
        }

        const body = await request.json().catch(() => null);

        const invitationId =
            typeof body?.invitationId === "string"
                ? body.invitationId.trim()
                : "";

        const activationToken =
            typeof body?.activationToken === "string"
                ? body.activationToken.trim()
                : "";

        if (!invitationId || !activationToken) {
            return NextResponse.json(
                { error: "Invitation ID and activation token are required." },
                { status: 400 }
            );
        }

        const { data: invitation, error: invitationError } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .select("id, email, status, expires_at")
                .eq("id", invitationId)
                .maybeSingle();

        if (invitationError) {
            throw invitationError;
        }

        if (!invitation || invitation.status !== "PENDING") {
            return NextResponse.json(
                { error: "Only pending Primary invitations can be emailed." },
                { status: 409 }
            );
        }

        const { data: primaryRole, error: primaryRoleError } =
            await supabaseAdmin
                .from("role_clarification")
                .select("email")
                .eq("type", "PRODUCT")
                .eq("invited_role", "PRIMARY")
                .ilike("email", invitation.email)
                .limit(1);

        if (primaryRoleError) {
            throw primaryRoleError;
        }

        if (!primaryRole?.length) {
            return NextResponse.json(
                { error: "This is not a Primary product invitation." },
                { status: 403 }
            );
        }

        const tokenHash = createHash("sha256")
            .update(activationToken, "utf8")
            .digest("hex");

        const now = new Date().toISOString();

        const { data: activeToken, error: tokenError } =
            await supabaseAdmin
                .from("carevr_product_invitation_tokens")
                .select("id")
                .eq("product_invitation_id", invitation.id)
                .eq("token_hash", tokenHash)
                .eq("status", "PENDING")
                .is("consumed_at", null)
                .is("revoked_at", null)
                .gt("expires_at", now)
                .maybeSingle();

        if (tokenError) {
            throw tokenError;
        }

        if (!activeToken) {
            return NextResponse.json(
                {
                    error:
                        "This activation link is no longer active. Regenerate the invitation before sending it.",
                },
                { status: 409 }
            );
        }

        const activationUrl =
            `https://carevr.in/register?productInvitationToken=${encodeURIComponent(activationToken)}`;

        const emailContent = productInvitationTemplate.create({
            inviteeEmail: invitation.email,
            activationUrl,
            expiresAt: new Date(invitation.expires_at).toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                }
            ),
        });

        const emailBody = emailContent.body.replace(
            "You have been invited to access the CareVR application.",
            "Your CareVR invitation has been renewed. Please use the updated secure activation link below. Any previously issued activation link is no longer valid."
        );

        const emailResult = await invitationEmailService.send({
            to: invitation.email,
            subject: "Your CareVR Invitation Has Been Renewed",
            body: emailBody,
        });

        return NextResponse.json({
            success: true,
            emailSent: true,
            emailId: emailResult.emailId,
        });
    } catch (error) {
        console.error(
            "Unable to send regenerated Primary invitation email.",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to send the Primary invitation email.",
            },
            { status: 500 }
        );
    }
}

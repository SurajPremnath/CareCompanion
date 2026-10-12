import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { productInvitationToken } from "@/lib/invitations/productInvitationToken";
import { productInvitationTemplate } from "@/lib/invitations/productInvitationTemplate";


const FOUNDER_EMAIL = "premnath.suraj@gmail.com";
const INVITATION_VALIDITY_DAYS = 7;

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
                { error: "You are not authorized to regenerate Primary invitations." },
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

    return {
        authorized: true as const,
    };
}

async function getPrimaryInvitationEmails(): Promise<Set<string>> {
    const { data, error } = await supabaseAdmin
        .from("role_clarification")
        .select("email")
        .eq("type", "PRODUCT")
        .eq("invited_role", "PRIMARY");

    if (error) {
        throw error;
    }

    return new Set(
        (data ?? [])
            .map((row) => row.email?.trim().toLowerCase())
            .filter((email): email is string => Boolean(email))
    );
}

export async function GET(request: NextRequest) {
    try {
        const authorization = await authorizeFounder(request);

        if (!authorization.authorized) {
            return authorization.response;
        }

        const primaryEmails = await getPrimaryInvitationEmails();

        if (primaryEmails.size === 0) {
            return NextResponse.json({ invitations: [] });
        }

        const { data: invitations, error } = await supabaseAdmin
            .from("carevr_product_invitations")
            .select(
                "id, email, status, expires_at, invitation_count"
            )
            .eq("status", "PENDING")
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        const now = Date.now();

        const primaryInvitations = (invitations ?? [])
            .filter((invitation) =>
                primaryEmails.has(invitation.email.trim().toLowerCase())
            )
            .map((invitation) => ({
                id: invitation.id,
                email: invitation.email,
                expiresAt: invitation.expires_at,
                invitationCount: invitation.invitation_count ?? 0,
                expired:
                    !invitation.expires_at ||
                    new Date(invitation.expires_at).getTime() <= now,
            }));

        return NextResponse.json({
            invitations: primaryInvitations,
        });
    } catch (error) {
        console.error(
            "Unable to load Primary product invitations.",
            error
        );

        return NextResponse.json(
            { error: "Unable to load Primary invitations. Please try again." },
            { status: 500 }
        );
    }
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

        if (!invitationId) {
            return NextResponse.json(
                { error: "An invitation ID is required." },
                { status: 400 }
            );
        }

        const { data: invitation, error: invitationError } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .select("id, email, status")
                .eq("id", invitationId)
                .maybeSingle();

        if (invitationError) {
            throw invitationError;
        }

        if (!invitation) {
            return NextResponse.json(
                { error: "The invitation could not be found." },
                { status: 404 }
            );
        }

        if (invitation.status !== "PENDING") {
            return NextResponse.json(
                { error: "Only pending Primary invitations can be regenerated." },
                { status: 409 }
            );
        }

        const primaryEmails = await getPrimaryInvitationEmails();

        if (!primaryEmails.has(invitation.email.trim().toLowerCase())) {
            return NextResponse.json(
                { error: "This is not a Primary product invitation." },
                { status: 403 }
            );
        }

        const { token, tokenHash } = productInvitationToken.generate();

        const expiresAt = new Date(
            Date.now() + INVITATION_VALIDITY_DAYS * 24 * 60 * 60 * 1000
        ).toISOString();

        const { data: regenerated, error: regenerateError } =
            await supabaseAdmin.rpc(
                "recreate_carevr_primary_product_invitation_token",
                {
                    p_invitation_id: invitation.id,
                    p_token_hash: tokenHash,
                    p_expires_at: expiresAt,
                }
            );

        if (regenerateError) {
            throw regenerateError;
        }

        if (regenerated !== true) {
            return NextResponse.json(
                {
                    error:
                        "The invitation could not be regenerated. Refresh the page and try again.",
                },
                { status: 409 }
            );
        }

const activationUrl =
    `https://carevr.in/register?productInvitationToken=${encodeURIComponent(token)}`;

const emailContent = productInvitationTemplate.create({
    inviteeEmail: invitation.email,
    activationUrl,
    expiresAt: new Date(expiresAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    }),
});

const emailSubject =
    "Your CareVR Invitation Has Been Renewed";

const emailBody = emailContent.body.replace(
    "You have been invited to access the CareVR application.",
    "Your CareVR invitation has been renewed. Please use the updated secure activation link below. Any previously issued activation link is no longer valid."
);

return NextResponse.json({
    success: true,
    emailSent: false,
    invitationId: invitation.id,
    email: invitation.email,
    expiresAt,
    activationToken: token,
    activationUrl,
    emailSubject,
    emailBody,
});
    } catch (error) {
        console.error(
            "Unable to regenerate Primary product invitation.",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to regenerate the Primary invitation.",
            },
            { status: 500 }
        );
    }
}
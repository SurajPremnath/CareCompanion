import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { productInvitationToken } from "@/lib/invitations/productInvitationToken";

export async function POST(
    request: NextRequest
) {
    try {

        // --------------------------------------------------
        // AUTHENTICATE FOUNDER / AUTHORIZED USER
        // --------------------------------------------------

        const authorizationHeader =
            request.headers.get("authorization");

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return NextResponse.json(
                {
                    error:
                        "Authentication is required.",
                },
                {
                    status: 401,
                }
            );
        }

        const accessToken =
            authorizationHeader.slice(
                "Bearer ".length
            );

        const {
            data: {
                user,
            },
            error: userError,
        } =
            await supabaseAdmin.auth.getUser(
                accessToken
            );

        if (
            userError ||
            !user
        ) {
            return NextResponse.json(
                {
                    error:
                        "Authentication is required.",
                },
                {
                    status: 401,
                }
            );
        }


        // --------------------------------------------------
        // READ + NORMALIZE EMAIL
        // --------------------------------------------------

        const body =
            await request.json();

        const normalizedEmail =
            typeof body?.email === "string"
                ? body.email
                      .trim()
                      .toLowerCase()
                : "";

        if (!normalizedEmail) {
            return NextResponse.json(
                {
                    error:
                        "Email address is required.",
                },
                {
                    status: 400,
                }
            );
        }


        // --------------------------------------------------
        // FIND EXISTING PRODUCT INVITATION
        //
        // Do NOT create another invitation record.
        // The existing invitation remains authoritative.
        // --------------------------------------------------

        const {
            data: invitation,
            error: invitationError,
        } =
            await supabaseAdmin
                .from(
                    "carevr_product_invitations"
                )
                .select(
                    "id, email, status, expires_at"
                )
                .eq(
                    "email",
                    normalizedEmail
                )
                .maybeSingle();

        if (invitationError) {
            throw invitationError;
        }


        if (!invitation) {
            return NextResponse.json(
                {
                    error:
                        "No existing CareVR invitation was found for this email address.",
                },
                {
                    status: 404,
                }
            );
        }


        // --------------------------------------------------
        // ONLY PENDING INVITATIONS CAN BE RECREATED
        // --------------------------------------------------

        if (
            invitation.status !==
            "PENDING"
        ) {
            return NextResponse.json(
                {
                    error:
                        "This CareVR invitation is no longer pending and cannot be recreated.",
                },
                {
                    status: 409,
                }
            );
        }


        // --------------------------------------------------
        // CHECK EXPIRATION
        //
        // Recreate rotates the activation credential.
        // It does NOT silently extend the invitation lifetime.
        // --------------------------------------------------

        if (
            invitation.expires_at &&
            new Date(
                invitation.expires_at
            ).getTime() <= Date.now()
        ) {
            return NextResponse.json(
                {
                    error:
                        "This CareVR invitation has expired. A new invitation is required.",
                },
                {
                    status: 409,
                }
            );
        }


        // --------------------------------------------------
        // GENERATE NEW ACTIVATION TOKEN
        //
        // Raw token is returned only to the authenticated
        // client. Only the SHA-256 hash is persisted.
        // --------------------------------------------------

        const {
            token,
            tokenHash,
        } =
            productInvitationToken.generate();


        // --------------------------------------------------
        // ATOMIC TOKEN ROTATION
        //
        // The database function:
        // 1. locks the invitation
        // 2. revokes the old pending token
        // 3. inserts the new token hash
        // 4. increments invitation_count
        // 5. updates invitation_sent_at
        //
        // All operations succeed or roll back together.
        // --------------------------------------------------

        const {
            data: recreated,
            error: recreateError,
        } =
            await supabaseAdmin.rpc(
                "recreate_carevr_product_invitation_token",
                {
                    p_invitation_id:
                        invitation.id,
                    p_token_hash:
                        tokenHash,
                    p_expires_at:
                        invitation.expires_at,
                }
            );

        if (recreateError) {
            throw recreateError;
        }

        if (recreated !== true) {
            return NextResponse.json(
                {
                    error:
                        "Unable to recreate the CareVR invitation.",
                },
                {
                    status: 409,
                }
            );
        }


        // --------------------------------------------------
        // RETURN RAW TOKEN
        //
        // Never return tokenHash.
        // --------------------------------------------------

        return NextResponse.json(
            {
                success:
                    true,

                activationToken:
                    token,

                expiresAt:
                    invitation.expires_at,

                invitationId:
                    invitation.id,
            },
            {
                status: 200,
            }
        );

    }
    catch (error) {

        console.error(
            "Unable to recreate CareVR invitation.",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to recreate CareVR invitation.",
            },
            {
                status: 500,
            }
        );
    }
}
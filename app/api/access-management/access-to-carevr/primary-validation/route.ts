import { NextResponse } from "next/server";

import { createHash } from "crypto";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {


try {

    const body =
        await request.json();

    const token =
        typeof body.token === "string"
            ? body.token.trim()
            : "";

    const email =
        typeof body.email === "string"
            ? body.email.trim().toLowerCase()
            : "";

    if (!token) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * Email may be omitted when the registration page first
     * loads and needs to resolve the invitation email.
     *
     * If an email is supplied during registration submission,
     * it will still be checked against the invitation record.
     */

    /*
     * ------------------------------------------------------
     * 1. Hash the Product Invitation token.
     *
     * The raw token is never stored.
     * carevr_product_invitation_tokens.token_hash
     * is the authoritative token representation.
     * ------------------------------------------------------
     */

    const tokenHash =
        createHash("sha256")
            .update(
                token,
                "utf8"
            )
            .digest("hex");

    /*
     * ------------------------------------------------------
     * 2. Validate the Product Invitation token.
     *
     * This is the same Product Invitation system used by
     * the existing CareVR invitation flow.
     *
     * Do NOT use a Primary-specific invitation table.
     * ------------------------------------------------------
     */

    const {
        data: tokenRecord,
        error: tokenError,
    } =
        await supabaseAdmin
            .from(
                "carevr_product_invitation_tokens"
            )
            .select(
                `
                id,
                product_invitation_id,
                status,
                expires_at,
                consumed_at,
                revoked_at
                `
            )
            .eq(
                "token_hash",
                tokenHash
            )
            .maybeSingle();

    if (tokenError) {

        console.error(
            "Unable to validate Primary Product Invitation token.",
            tokenError
        );

        return NextResponse.json(
            {
                message:
                    "Unable to validate the CareVR invitation.",
            },
            {
                status: 500,
            }
        );

    }

    if (!tokenRecord) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * ------------------------------------------------------
     * 3. Token lifecycle validation.
     *
     * The token must still be:
     *
     * PENDING
     * not consumed
     * not revoked
     * not expired
     * ------------------------------------------------------
     */

    if (
        tokenRecord.status !==
        "PENDING"
    ) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    if (
        tokenRecord.consumed_at
    ) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    if (
        tokenRecord.revoked_at
    ) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    if (
        !tokenRecord.expires_at ||
        new Date(
            tokenRecord.expires_at
        ) <= new Date()
    ) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * ------------------------------------------------------
     * 4. Resolve the Product Invitation.
     *
     * The token identifies the invitation.
     * Email is used only as a consistency check.
     * ------------------------------------------------------
     */

    const {
        data: invitation,
        error: invitationError,
    } =
        await supabaseAdmin
            .from(
                "carevr_product_invitations"
            )
            .select(
                `
                id,
                email,
                status,
                expires_at
                `
            )
            .eq(
                "id",
                tokenRecord.product_invitation_id
            )
            .maybeSingle();

    if (invitationError) {

        console.error(
            "Unable to load Primary Product Invitation.",
            invitationError
        );

        return NextResponse.json(
            {
                message:
                    "Unable to validate the CareVR invitation.",
            },
            {
                status: 500,
            }
        );

    }

    if (!invitation) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * ------------------------------------------------------
     * 5. Product Invitation must still be PENDING.
     * ------------------------------------------------------
     */

    if (
        invitation.status !==
        "PENDING"
    ) {

        return NextResponse.json(
            {
                status:
                    invitation.status ===
                    "ACCEPTED"
                        ? "ACCEPTED"
                        : "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * ------------------------------------------------------
     * 6. Verify that the supplied email matches the
     *    email to which the Product Invitation was issued.
     *
     * The token remains the security credential.
     * Email is only a consistency check.
     * ------------------------------------------------------
     */

    const invitationEmail =
        typeof invitation.email === "string"
            ? invitation.email
                .trim()
                .toLowerCase()
            : "";
    if (
        !invitationEmail ||
        (
            email &&
            invitationEmail !== email
        )
    ) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * ------------------------------------------------------
     * 7. Verify Product Invitation expiry as well.
     * ------------------------------------------------------
     */

    if (
        invitation.expires_at &&
        new Date(
            invitation.expires_at
        ) <= new Date()
    ) {

        return NextResponse.json(
            {
                status:
                    "NO_INVITATION",
            },
            {
                status: 200,
            }
        );

    }

    /*
     * ------------------------------------------------------
     * 8. Primary CareVR access.
     *
     * Product Invitation proves that this registration
     * originated from a valid CareVR invitation.
     *
     * carevr_access establishes that this user is
     * authorized as PRIMARY.
     *
     * No Primary-specific invitation table is used.
     * ------------------------------------------------------
     */

return NextResponse.json(
    {
        status:
            "VALID",
        invitationId:
            invitation.id,
        tokenId:
            tokenRecord.id,
        email:
            invitationEmail,
    },
    {
        status: 200,
    }
);

/*
 * ------------------------------------------------------
 * Primary Product Invitation is valid.
 *
 * This endpoint only validates the token and invitation.
 * It does not require profiles or carevr_access because
 * this validation occurs before Auth account creation.
 *
 * The invitation/token is consumed later in the
 * registration lifecycle.
 * ------------------------------------------------------
 */


} catch (error) {

    console.error(
        "Primary CareVR invitation validation failed.",
        error
    );

    return NextResponse.json(
        {
            message:
                "Unable to validate the CareVR invitation.",
        },
        {
            status: 500,
        }
    );

}

}

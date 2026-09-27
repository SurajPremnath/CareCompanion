import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";

import {
    productInvitationToken,
} from "@/lib/invitations/productInvitationToken";


const INVITATION_VALIDITY_DAYS = 7;


export async function POST(
    request: Request
) {

    try {

//--------------------------------------------------
// Resolve the authenticated user from the access
// token supplied by the authenticated browser session.
//--------------------------------------------------

const authorizationHeader =
    request.headers.get(
        "authorization"
    );


if (
    !authorizationHeader ||
    !authorizationHeader.startsWith(
        "Bearer "
    )
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
    authorizationHeader.substring(
        "Bearer ".length
    );


const authCheckStartedAt =
    performance.now();

const {
    data: {
        user,
    },
    error: userError,
} =
    await supabaseAdmin.auth.getUser(
        accessToken
    );

console.log(
    "[INVITATION-PERF] auth.getUser:",
    Math.round(
        performance.now() -
        authCheckStartedAt
    ),
    "ms"
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


        //--------------------------------------------------
        // Validate request.
        //--------------------------------------------------

        const body =
            await request.json();


        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";


        if (!email) {

            return NextResponse.json(
                {
                    error:
                        "Invitee email address is required.",
                },
                {
                    status: 400,
                }
            );

        }

//--------------------------------------------------
// Check whether this email already has an active
// invitation.
//
// PENDING + not expired  → already invited
// ACCEPTED + not expired → already invited
// expired               → allow new invitation
// no invitation          → allow new invitation
//--------------------------------------------------

const now =
    new Date().toISOString();

const existingCheckStartedAt =
    performance.now();

const {
    data: existingInvitation,
    error: existingInvitationError,
} =
    await supabaseAdmin
        .from(
            "carevr_product_invitations"
        )
        .select(
            "id, status, expires_at"
        )
        .eq(
            "email",
            email
        )
        .in(
            "status",
            [
                "PENDING",
                "ACCEPTED",
            ]
        )
        .gt(
            "expires_at",
            now
        )
        .limit(1)
        .maybeSingle();

console.log(
    "[INVITATION-PERF] existing invitation check:",
    Math.round(
        performance.now() -
        existingCheckStartedAt
    ),
    "ms"
);


if (existingInvitationError) {

    throw new Error(
        existingInvitationError.message
    );

}


if (existingInvitation) {

    return NextResponse.json(
        {
            error:
                "An active invitation already exists for this email address.",
        },
        {
            status: 409,
        }
    );

}


//--------------------------------------------------
// Generate the activation token.
//
// The raw token exists only in memory and is never
// persisted in the database.
//--------------------------------------------------

const {
    token,
    tokenHash,
} =
    productInvitationToken.generate();


const expiresAt =
    new Date(
        Date.now() +
        (
            INVITATION_VALIDITY_DAYS *
            24 *
            60 *
            60 *
            1000
        )
    ).toISOString();


//--------------------------------------------------
// Create the Product Invitation.
//--------------------------------------------------

const invitationInsertStartedAt =
    performance.now();

const {
    data: invitation,
    error: invitationError,
} =
    await supabaseAdmin
        .from(
            "carevr_product_invitations"
        )
        .insert({
            email,
            status: "PENDING",
            invitation_sent_at:
                new Date().toISOString(),
            expires_at:
                expiresAt,
            invitation_count: 1,
            created_by:
                user.id,
        })
        .select(
            "id, email, expires_at"
        )
        .single();

console.log(
    "[INVITATION-PERF] invitation insert:",
    Math.round(
        performance.now() -
        invitationInsertStartedAt
    ),
    "ms"
);


        if (
            invitationError ||
            !invitation
        ) {

            throw new Error(
                invitationError?.message ??
                "Unable to create product invitation."
            );

        }


        //--------------------------------------------------
        // Store only the token hash.
        //--------------------------------------------------

const tokenInsertStartedAt =
    performance.now();

const {
    error: tokenError,
} =
    await supabaseAdmin
        .from(
            "carevr_product_invitation_tokens"
        )
        .insert({
            product_invitation_id:
                invitation.id,
            token_hash:
                tokenHash,
            status:
                "PENDING",
            expires_at:
                expiresAt,
        });

console.log(
    "[INVITATION-PERF] token insert:",
    Math.round(
        performance.now() -
        tokenInsertStartedAt
    ),
    "ms"
);


        if (tokenError) {

            //------------------------------------------------
            // The invitation must not remain active if its
            // activation token could not be persisted.
            //------------------------------------------------

            await supabaseAdmin
                .from(
                    "carevr_product_invitations"
                )
                .update({
                    status:
                        "REVOKED",
                    revoked_at:
                        new Date().toISOString(),
                    revoked_by:
                        user.id,
                })
                .eq(
                    "id",
                    invitation.id
                );


            throw new Error(
                tokenError.message
            );

        }


        //--------------------------------------------------
        // Return the raw token exactly once.
        //--------------------------------------------------

        return NextResponse.json({

            invitation: {
                id:
                    invitation.id,

                email:
                    invitation.email,

                expiresAt:
                    invitation.expires_at,
            },

            activationToken:
                token,

        });

    }
    catch (error) {

        console.error(
            "PRODUCT INVITATION CREATION ERROR:",
            error
        );


        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to create product invitation.",
            },
            {
                status: 500,
            }
        );

    }

}
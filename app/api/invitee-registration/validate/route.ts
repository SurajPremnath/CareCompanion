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

    try {

        const body =
            await request.json();

        const token =
            typeof body.token === "string"
                ? body.token.trim()
                : "";

        if (!token) {

            return NextResponse.json(
                {
                    valid: false,
                    message:
                        "Invitation token is required.",
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
            data,
            error,
        } =
            await supabaseAdmin
                .from("carevr_invitation")
                .select(
                    `
                    id,
                    invited_email,
                    role,
                    family_id,
                    governance_id,
                    status,
                    expires_at,
                    accepted_at
                    `
                )
                .eq(
                    "token_hash",
                    tokenHash
                )
                .maybeSingle();

        if (error) {

            console.error(
                "Invitee invitation validation failed.",
                error
            );

            return NextResponse.json(
                {
                    valid: false,
                    message:
                        "Unable to validate the invitation.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!data) {

            return NextResponse.json(
                {
                    valid: false,
                    message:
                        "This invitation link is invalid.",
                },
                {
                    status: 200,
                }
            );
        }

        if (
            data.status !==
            "PENDING"
        ) {

            return NextResponse.json(
                {
                    valid: false,
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
                data.expires_at
            ) <= new Date()
        ) {

            return NextResponse.json(
                {
                    valid: false,
                    message:
                        "This invitation has expired.",
                },
                {
                    status: 200,
                }
            );
        }

        return NextResponse.json(
            {
                valid: true,

                invitation: {
                    id:
                        data.id,

                    email:
                        data.invited_email,

                    role:
                        data.role,

                    familyId:
                        data.family_id,

                    governanceId:
                        data.governance_id,

                    expiresAt:
                        data.expires_at,
                },
            },
            {
                status: 200,
            }
        );

    }
    catch (error) {

        console.error(
            "Invitee invitation validation failed.",
            error
        );

        return NextResponse.json(
            {
                valid: false,
                message:
                    "Unable to validate the invitation.",
            },
            {
                status: 500,
            }
        );
    }
}
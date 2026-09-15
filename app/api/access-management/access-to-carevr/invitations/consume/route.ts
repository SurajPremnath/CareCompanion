import {
    NextResponse,
} from "next/server";

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


        const body =
            await request.json();


        const token =
            typeof body.token === "string"
                ? body.token.trim()
                : "";


        if (!token) {

            return NextResponse.json(
                {
                    error:
                        "Product invitation token is required.",
                },
                {
                    status: 400,
                }
            );

        }


        const tokenHash =
            createHash(
                "sha256"
            )
                .update(
                    token,
                    "utf8"
                )
                .digest(
                    "hex"
                );


        const {
            data,
            error,
        } =
            await supabaseAdmin.rpc(
                "consume_carevr_product_invitation",
                {
                    p_token_hash:
                        tokenHash,
                }
            );


        if (error) {

            throw new Error(
                error.message
            );

        }


        if (data !== true) {

            return NextResponse.json(
                {
                    error:
                        "This CareVR invitation is invalid, expired, revoked, or has already been used.",
                },
                {
                    status: 400,
                }
            );

        }


        return NextResponse.json({
            success: true,
        });

    }
    catch (error) {

        console.error(
            "PRODUCT INVITATION CONSUMPTION ERROR:",
            error
        );


        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to activate the CareVR invitation.",
            },
            {
                status: 500,
            }
        );

    }

}
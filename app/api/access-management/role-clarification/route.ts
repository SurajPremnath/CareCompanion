import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";


export async function POST(
    request: Request
) {

    try {

        const body =
            await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        if (!email) {

            return NextResponse.json(
                {
                    message:
                        "Email address is required.",
                },
                {
                    status: 400,
                }
            );

        }


        /*
         * --------------------------------------------------
         * Get the latest registration context for this email.
         *
         * This table only determines the registration entry
         * path:
         *
         * PRODUCT
         * INVITATION
         * CONVERTED
         *
         * It does not replace any existing authorization,
         * invitation, access, PIN, consent, or registration
         * logic.
         * --------------------------------------------------
         */

        const {
            data: roleClarification,
            error,
        } =
            await supabaseAdmin
                .from("role_clarification")
                .select(
                    "id, email, type, created_at, updated_at"
                )
                .eq(
                    "email",
                    email
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    }
                )
                .limit(1)
                .maybeSingle();


        if (error) {

            console.error(
                "Unable to determine CareVR registration context.",
                error
            );

            return NextResponse.json(
                {
                    message:
                        "Unable to determine CareVR registration context.",
                },
                {
                    status: 500,
                }
            );

        }


        if (!roleClarification) {

            return NextResponse.json(
                {
                    context:
                        null,
                },
                {
                    status: 200,
                }
            );

        }


        return NextResponse.json(
            {
                context:
                    roleClarification.type,

                email:
                    roleClarification.email,
            },
            {
                status: 200,
            }
        );

    }
    catch (error) {

        console.error(
            "ROLE CLARIFICATION ERROR:",
            error
        );

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to determine CareVR registration context.",
            },
            {
                status: 500,
            }
        );

    }

}
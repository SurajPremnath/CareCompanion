import { NextResponse } from "next/server";

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
                ? body.email
                    .trim()
                    .toLowerCase()
                : "";

        if (!email) {

            return NextResponse.json(
                {
                    exists: false,
                    error:
                        "Email is required.",
                },
                {
                    status: 400,
                }
            );

        }

        const {
            data,
            error,
        } =
            await supabaseAdmin.auth.admin.listUsers();

        if (error) {

            throw new Error(
                error.message
            );

        }

        const exists =
            data.users.some(
                (user) =>
                    user.email
                        ?.trim()
                        .toLowerCase() ===
                    email
            );

        return NextResponse.json({
            exists,
        });

    } catch (error) {

        console.error(
            "[VERIFY-AUTH-USER]",
            error
        );

        return NextResponse.json(
            {
                exists: false,
                error:
                    "Unable to verify the CareVR account.",
            },
            {
                status: 500,
            }
        );

    }

}
import { NextResponse } from "next/server";

import {
    productInvitationValidation,
} from "@/lib/invitations/productInvitationValidation";

export async function POST(request: Request) {

    try {

        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim()
                : "";

        if (!email) {

            return NextResponse.json(
                {
                    status: "NO_INVITATION",
                },
                {
                    status: 200,
                }
            );

        }

        const result =
            await productInvitationValidation.validate(
                email
            );

        return NextResponse.json(
            result,
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "Product invitation validation failed.",
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
import { NextRequest, NextResponse } from "next/server";

import { invitationEmailService } from "@/lib/email/invitationEmailService";

export async function POST(
    request: NextRequest
) {
    try {

        const body =
            await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const subject =
            typeof body.subject === "string"
                ? body.subject.trim()
                : "";

        const invitationBody =
            typeof body.body === "string"
                ? body.body.trim()
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

        if (!subject) {
            return NextResponse.json(
                {
                    error:
                        "Invitation subject is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!invitationBody) {
            return NextResponse.json(
                {
                    error:
                        "Invitation message is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const result =
            await invitationEmailService.send({
                to: email,
                subject,
                body: invitationBody,
            });

        return NextResponse.json(
            {
                success: true,
                emailId: result.emailId,
            },
            {
                status: 200,
            }
        );

    }
    catch (error) {

        console.error(
            "Unable to send CareVR invitation email.",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to send the invitation email.",
            },
            {
                status: 500,
            }
        );

    }
}
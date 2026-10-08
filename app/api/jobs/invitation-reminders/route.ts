import { NextResponse } from "next/server";

import {
    reminderService,
} from "@/lib/invitations/reminderService";

import {
    passwordReminderService,
} from "@/lib/security/passwordReminderService";


export const dynamic = "force-dynamic";


export async function GET(
    request: Request
) {

    try {

const cronSecret =
    process.env.CRON_SECRET ??
    process.env.CAREVR_REMINDER_CRON_SECRET;

        const authorization =
            request.headers.get(
                "authorization"
            );


        if (
            !cronSecret ||
            authorization !==
                `Bearer ${cronSecret}`
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }


const invitationResults =
    await reminderService
        .processPendingInvitations();

const passwordResults =
    await passwordReminderService
        .processPendingPasswordReminders();

return NextResponse.json(
    {
        success: true,

        invitationProcessed:
            invitationResults.length,

        passwordProcessed:
            passwordResults.length,

        invitationResults,

        passwordResults,
    },
    {
        status: 200,
    }
);

    } catch (error) {

        console.error(
            "CareVR invitation reminder processing failed.",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to process invitation reminders.",
            },
            {
                status: 500,
            }
        );
    }
}



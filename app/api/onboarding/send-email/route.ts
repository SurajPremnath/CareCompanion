import { NextResponse } from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    onboardingEmailService,
} from "@/lib/email/onboardingEmailService";


export async function POST() {

    try {

const serverSupabase =
    await createSupabaseServerClient();


const {
    data: {
        user,
    },
    error: userError,
} =
    await serverSupabase.auth.getUser();


        if (
            userError ||
            !user
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Authentication required.",
                },
                {
                    status: 401,
                }
            );
        }


        const {
            data: profile,
            error: profileError,
        } =
            await supabaseAdmin
                .from("profiles")
                .select(
                    "email, full_name, onboarding_email_sent"
                )
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        if (profileError) {

            console.error(
                "Unable to load profile for onboarding email.",
                profileError
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to load user profile.",
                },
                {
                    status: 500,
                }
            );
        }


        if (
            profile?.onboarding_email_sent === true
        ) {

            return NextResponse.json(
                {
                    success: true,
                    alreadySent: true,
                },
                {
                    status: 200,
                }
            );
        }


        const email =
            profile?.email ||
            user.email;


        if (!email) {

            return NextResponse.json(
                {
                    success: false,
                    error: "User email address is unavailable.",
                },
                {
                    status: 400,
                }
            );
        }


        const result =
            await onboardingEmailService.send({
                to: email,
                fullName:
                    profile?.full_name ||
                    undefined,
            });


        if (
            result?.success !== true
        ) {

            return NextResponse.json(
                result,
                {
                    status: 200,
                }
            );
        }


        const {
            error: markSentError,
        } =
            await supabaseAdmin
                .from("profiles")
                .update({
                    onboarding_email_sent: true,
                })
                .eq(
                    "id",
                    user.id
                )
                .eq(
                    "onboarding_email_sent",
                    false
                );


        if (markSentError) {

            console.error(
                "Unable to mark onboarding email as sent.",
                markSentError
            );
        }


        return NextResponse.json(
            result,
            {
                status: 200,
            }
        );

    }
    catch (error) {

        console.error(
            "CareVR onboarding email failed.",
            error
        );


        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to send onboarding email.",
            },
            {
                status: 500,
            }
        );
    }
}
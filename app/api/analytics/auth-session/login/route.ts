import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";


//------------------------------------------------------------
// Route Configuration
//------------------------------------------------------------

export const runtime = "nodejs";


//------------------------------------------------------------
// POST
//------------------------------------------------------------

export async function POST(
    request: Request
) {

    try {

        //----------------------------------------------------
        // Authenticate User
        //----------------------------------------------------

        const authorizationHeader =
            request.headers.get(
                "authorization"
            );

        if (
            !authorizationHeader?.startsWith(
                "Bearer "
            )
        ) {

            return NextResponse.json(
                {
                    error:
                        "Authentication required.",
                },
                {
                    status: 401,
                }
            );

        }


        const accessToken =
            authorizationHeader.slice(7);


        const {
            data: {
                user,
            },
            error: authError,
        } =
            await supabaseAdmin.auth.getUser(
                accessToken
            );


        if (
            authError ||
            !user
        ) {

            return NextResponse.json(
                {
                    error:
                        "Invalid or expired session.",
                },
                {
                    status: 401,
                }
            );

        }


        //----------------------------------------------------
        // Read Request
        //----------------------------------------------------

        const body =
            await request.json() as {

                analyticsSessionId?: string | null;

                anonymousId?: string | null;

                platform?: string;

                appVersion?: string | null;

            };


        //----------------------------------------------------
        // Validate Platform
        //----------------------------------------------------

        const platform =
            body.platform ?? "WEB";


        if (
            ![
                "WEB",
                "PWA",
                "ANDROID",
                "IOS",
            ].includes(platform)
        ) {

            return NextResponse.json(
                {
                    error:
                        "Invalid platform.",
                },
                {
                    status: 400,
                }
            );

        }


        //----------------------------------------------------
        // Create Authentication Session
        //----------------------------------------------------

        const {
            data: authSession,
            error: insertError,
        } =
            await supabaseAdmin
                .from("auth_sessions")
                .insert({

                    user_id:
                        user.id,

                    analytics_session_id:
                        body.analyticsSessionId
                            ?? null,

                    anonymous_id:
                        body.anonymousId
                            ?? null,

                    platform,

                    app_version:
                        body.appVersion
                            ?? null,

                })
                .select(
                    "id, logged_in_at"
                )
                .single();


        if (
            insertError ||
            !authSession
        ) {

            console.error(
                "Auth Session Insert Error:",
                insertError
            );

            return NextResponse.json(
                {
                    error:
                        "Unable to create authentication session.",
                },
                {
                    status: 500,
                }
            );

        }


        //----------------------------------------------------
        // Success
        //----------------------------------------------------

        return NextResponse.json({

            success: true,

            authSessionId:
                authSession.id,

            loggedInAt:
                authSession.logged_in_at,

        });

    }
    catch (error: unknown) {

        console.error(
            "Auth Session Login Route Error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Unable to process authentication session.",
            },
            {
                status: 500,
            }
        );

    }

}
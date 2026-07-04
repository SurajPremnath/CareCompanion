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

                authSessionId?: string;

            };


        if (!body.authSessionId) {

            return NextResponse.json(
                {
                    error:
                        "Authentication session ID is required.",
                },
                {
                    status: 400,
                }
            );

        }


        //----------------------------------------------------
        // Close Authentication Session
        //----------------------------------------------------

        const {
            data: closedSession,
            error: updateError,
        } =
            await supabaseAdmin
                .from("auth_sessions")
                .update({

                    logged_out_at:
                        new Date().toISOString(),

                    logout_reason:
                        "USER_LOGOUT",

                })
                .eq(
                    "id",
                    body.authSessionId
                )
                .eq(
                    "user_id",
                    user.id
                )
                .is(
                    "logged_out_at",
                    null
                )
                .select(
                    "id, logged_out_at"
                )
                .maybeSingle();


        if (updateError) {

            console.error(
                "Auth Session Logout Update Error:",
                updateError
            );

            return NextResponse.json(
                {
                    error:
                        "Unable to close authentication session.",
                },
                {
                    status: 500,
                }
            );

        }


        if (!closedSession) {

            return NextResponse.json(
                {
                    error:
                        "Open authentication session not found.",
                },
                {
                    status: 404,
                }
            );

        }


        //----------------------------------------------------
        // Success
        //----------------------------------------------------

        return NextResponse.json({

            success: true,

            authSessionId:
                closedSession.id,

            loggedOutAt:
                closedSession.logged_out_at,

        });

    }
    catch (error: unknown) {

        console.error(
            "Auth Session Logout Route Error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Unable to process authentication logout.",
            },
            {
                status: 500,
            }
        );

    }

}
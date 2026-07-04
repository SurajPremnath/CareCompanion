//------------------------------------------------------------
// CareVR Authentication Session Service
//------------------------------------------------------------

import {
    supabase,
} from "@/lib/supabase";

import {
    getAnalyticsAnonymousId,
    getAnalyticsSessionId,
} from "@/lib/analytics/analyticsIdentity";


//------------------------------------------------------------
// Storage Key
//------------------------------------------------------------

const ACTIVE_AUTH_SESSION_KEY =
    "carevr_active_auth_session_id";


//------------------------------------------------------------
// Result
//------------------------------------------------------------

export interface AuthSessionStartResult {

    authSessionId: string;

    loggedInAt: string;

}


//------------------------------------------------------------
// Authentication Session Service
//------------------------------------------------------------

class AuthSessionService {

    //--------------------------------------------------------
    // Start Authentication Session
    //--------------------------------------------------------

    async start():
        Promise<AuthSessionStartResult> {

        const {
            data,
            error,
        } =
            await supabase.auth.getSession();

        if (
            error ||
            !data.session
        ) {

            throw new Error(
                "Authenticated session is required."
            );

        }


        //----------------------------------------------------
        // Create Server Authentication Session
        //----------------------------------------------------

        const response =
            await fetch(
                "/api/analytics/auth-session/login",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${data.session.access_token}`,

                    },

                    body:
                        JSON.stringify({

                            analyticsSessionId:
                                getAnalyticsSessionId(),

                            anonymousId:
                                getAnalyticsAnonymousId(),

                            platform:
                                "WEB",

                            appVersion:
                                null,

                        }),

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to start authentication session."
            );

        }


        //----------------------------------------------------
        // Read Server Result
        //----------------------------------------------------

        const result =
            await response.json() as {

                success: boolean;

                authSessionId: string;

                loggedInAt: string;

            };


        //----------------------------------------------------
        // Persist Active Authentication Session ID
        //----------------------------------------------------

        localStorage.setItem(
            ACTIVE_AUTH_SESSION_KEY,
            result.authSessionId
        );


        //----------------------------------------------------
        // Return Result
        //----------------------------------------------------

        return {

            authSessionId:
                result.authSessionId,

            loggedInAt:
                result.loggedInAt,

        };

    }


    //--------------------------------------------------------
    // Get Active Authentication Session ID
    //--------------------------------------------------------

    getActiveSessionId():
        string | null {

        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem(
            ACTIVE_AUTH_SESSION_KEY
        );

    }

//--------------------------------------------------------
// End Authentication Session
//--------------------------------------------------------

async end(): Promise<void> {

    const authSessionId =
        this.getActiveSessionId();

    if (!authSessionId) {

        throw new Error(
            "Active authentication session ID is unavailable."
        );

    }


    const {
        data,
        error,
    } =
        await supabase.auth.getSession();


    if (
        error ||
        !data.session
    ) {

        throw new Error(
            "Authenticated session is required."
        );

    }


    const response =
        await fetch(
            "/api/analytics/auth-session/logout",
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${data.session.access_token}`,

                },

                body:
                    JSON.stringify({

                        authSessionId,

                    }),

            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to close authentication session."
        );

    }


    this.clearActiveSessionId();

}


    //--------------------------------------------------------
    // Clear Active Authentication Session ID
    //--------------------------------------------------------

    clearActiveSessionId():
        void {

        if (typeof window === "undefined") {
            return;
        }

        localStorage.removeItem(
            ACTIVE_AUTH_SESSION_KEY
        );

    }

}


//------------------------------------------------------------
// Export Singleton
//------------------------------------------------------------

export const authSessionService =
    new AuthSessionService();
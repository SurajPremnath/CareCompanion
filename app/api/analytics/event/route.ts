import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";

import type {
  AnalyticsEventInput,
} from "@/lib/analytics/analyticsTypes";

import {
  ANALYTICS_MODULES,
  ANALYTICS_EVENTS,
  ANALYTICS_CONTEXTS,
  ANALYTICS_INPUT_METHODS,
} from "@/lib/analytics/analyticsEvents";


//------------------------------------------------------------
// Route Configuration
//------------------------------------------------------------

export const runtime = "nodejs";


//------------------------------------------------------------
// Allowed Runtime Values
//------------------------------------------------------------

const allowedModules =
  new Set(
    Object.values(
      ANALYTICS_MODULES
    )
  );

const allowedEvents =
  new Set(
    Object.values(
      ANALYTICS_EVENTS
    )
  );

const allowedContexts =
  new Set(
    Object.values(
      ANALYTICS_CONTEXTS
    )
  );

const allowedInputMethods =
  new Set(
    Object.values(
      ANALYTICS_INPUT_METHODS
    )
  );


//------------------------------------------------------------
// POST
//------------------------------------------------------------

export async function POST(
  request: Request
) {

  try {

    //--------------------------------------------------------
    // Authenticate User
    //--------------------------------------------------------

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


    //--------------------------------------------------------
    // Read Request
    //--------------------------------------------------------

    const body =
      await request.json() as
        AnalyticsEventInput & {
          sessionId?: string | null;
          anonymousId?: string | null;
          platform?: string;
          appVersion?: string | null;
        };


    //--------------------------------------------------------
    // Validate Module
    //--------------------------------------------------------

    if (
      !allowedModules.has(
        body.module
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid analytics module.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate Event
    //--------------------------------------------------------

    if (
      !allowedEvents.has(
        body.eventName
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid analytics event.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate Context
    //--------------------------------------------------------

    if (
      body.context &&
      !allowedContexts.has(
        body.context
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid analytics context.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate Input Method
    //--------------------------------------------------------

    if (
      body.inputMethod &&
      !allowedInputMethods.has(
        body.inputMethod
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid analytics input method.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate Platform
    //--------------------------------------------------------

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
            "Invalid analytics platform.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Insert Event
    //--------------------------------------------------------

    const {
      error: insertError,
    } =
      await supabaseAdmin
        .from("analytics_events")
        .insert({

          user_id:
            user.id,

          anonymous_id:
            body.anonymousId ?? null,

          session_id:
            body.sessionId ?? null,

          module:
            body.module,

          event_name:
            body.eventName,

          context:
            body.context ?? null,

          page_path:
            body.pagePath ?? null,

          platform,

          app_version:
            body.appVersion ?? null,

          input_method:
            body.inputMethod ?? null,

          metadata:
            body.metadata ?? {},

        });


    if (insertError) {

      console.error(
        "Analytics Event Insert Error:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            "Unable to record analytics event.",
        },
        {
          status: 500,
        }
      );

    }


    //--------------------------------------------------------
    // Success
    //--------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
      }
    );

  }
  catch (error: unknown) {

    console.error(
      "Analytics Event Route Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process analytics event.",
      },
      {
        status: 500,
      }
    );

  }

}
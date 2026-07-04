//------------------------------------------------------------
// CareVR Analytics Service
//------------------------------------------------------------

import {
  supabase,
} from "@/lib/supabase";

import type {
  AnalyticsEventInput,
} from "@/lib/analytics/analyticsTypes";

import {
  getAnalyticsAnonymousId,
  getAnalyticsSessionId,
} from "@/lib/analytics/analyticsIdentity";


//------------------------------------------------------------
// Analytics Service
//------------------------------------------------------------

class AnalyticsService {

  //----------------------------------------------------------
  // Track Authenticated Event
  //----------------------------------------------------------

  async track(
    event: AnalyticsEventInput
  ): Promise<void> {

    try {

      //------------------------------------------------------
      // Get Current Session
      //------------------------------------------------------

      const {
        data,
        error,
      } =
        await supabase.auth.getSession();

      if (
        error ||
        !data.session
      ) {

        return;

      }


      //------------------------------------------------------
      // Build Event Payload
      //------------------------------------------------------

      const payload = {

        ...event,

        sessionId:
          getAnalyticsSessionId(),

        anonymousId:
          getAnalyticsAnonymousId(),

        platform:
          "WEB",

        appVersion:
          null,

      };


      //------------------------------------------------------
      // Send Event
      //------------------------------------------------------

      const response =
        await fetch(
          "/api/analytics/event",
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${data.session.access_token}`,

            },

            body:
              JSON.stringify(
                payload
              ),

          }
        );


      //------------------------------------------------------
      // Analytics Must Not Break Product Flow
      //------------------------------------------------------

      if (!response.ok) {

        console.error(
          "Analytics event rejected:",
          response.status
        );

      }

    }
    catch (error) {

      //------------------------------------------------------
      // Analytics Is Non-Blocking
      //------------------------------------------------------

      console.error(
        "Analytics tracking error:",
        error
      );

    }

  }

}


//------------------------------------------------------------
// Export Singleton
//------------------------------------------------------------

export const analyticsService =
  new AnalyticsService();
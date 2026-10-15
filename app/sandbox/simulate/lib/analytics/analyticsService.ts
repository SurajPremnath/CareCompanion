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
// Effect-Driven View Deduplication
//------------------------------------------------------------

const VIEW_DEDUPLICATION_WINDOW_MS =
  1500;


//------------------------------------------------------------
// Analytics Service
//------------------------------------------------------------

class AnalyticsService {

  private readonly recentViewEvents =
    new Map<string, number>();

  //----------------------------------------------------------
  // Build Stable View Fingerprint
  //----------------------------------------------------------

  private buildViewFingerprint(
    event: AnalyticsEventInput
  ): string {

    const metadataEntries =
      Object.entries(
        event.metadata ?? {}
      )
        .sort(
          ([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
        );

    return JSON.stringify({

      module:
        event.module,

      eventName:
        event.eventName,

      context:
        event.context ?? null,

      pagePath:
        event.pagePath ?? null,

      metadata:
        metadataEntries,

    });

  }


  //----------------------------------------------------------
  // Detect Duplicate View Event
  //----------------------------------------------------------

  private isDuplicateView(
    event: AnalyticsEventInput
  ): boolean {

    if (
      event.eventName !== "VIEWED"
    ) {

      return false;

    }

    const fingerprint =
      this.buildViewFingerprint(
        event
      );

    const now =
      Date.now();

    const previousTimestamp =
      this.recentViewEvents.get(
        fingerprint
      );

    if (
      previousTimestamp !== undefined &&
      now - previousTimestamp <
        VIEW_DEDUPLICATION_WINDOW_MS
    ) {

      return true;

    }

    this.recentViewEvents.set(
      fingerprint,
      now
    );

    return false;

  }

  //----------------------------------------------------------
  // Track Authenticated Event
  //----------------------------------------------------------

    async track(
    event: AnalyticsEventInput
  ): Promise<void> {

    if (
      this.isDuplicateView(event)
    ) {

      return;

    }

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
"use client";

import { useRouter } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

export default function DailyCareReportSelectorPage() {

  const router = useRouter();

  //------------------------------------------------------------
  // Daily Care Report Context Selection
  //------------------------------------------------------------

  const handleContextSelection = async (
    context:
      | typeof ANALYTICS_CONTEXTS.SELF
      | typeof ANALYTICS_CONTEXTS.FAMILY,
    href: string
  ) => {

    await analyticsService.track({

      module:
        ANALYTICS_MODULES.REPORTS,

      eventName:
        ANALYTICS_EVENTS.CONTEXT_SELECTED,

      context,

      pagePath:
        "/reports/daily-care/select",

      metadata: {

        reportCategory:
          "DAILY_CARE",

      },

    });

    router.push(href);

  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    background: "#ffffff",
    cursor: "pointer",
    transition: "0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >

        <AppHeader
          pageTitle="Daily Care Reports"
          pageIcon="📋"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >

          {/* Myself */}

          <div
            style={cardStyle}
            onClick={() =>
  void handleContextSelection(
    ANALYTICS_CONTEXTS.SELF,
    "/reports/daily-care/self"
  )
}
          >

            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              👤 Myself
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
              }}
            >
              View your own Daily Care history,
              vitals and health observations.
            </p>

            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Open
            </button>

          </div>

          {/* Family */}

          <div
            style={cardStyle}
            onClick={() =>
  void handleContextSelection(
    ANALYTICS_CONTEXTS.FAMILY,
    "/reports/daily-care"
  )
}
          >

            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              👨‍👩‍👧 Family
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
              }}
            >
              View Daily Care history for
              your registered family members.
            </p>

            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#16a34a",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Open
            </button>

          </div>

        </div>

        <button
          onClick={() =>
            router.push("/reports")
          }
          style={{
            marginTop: "32px",
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            cursor: "pointer",
          }}
        >
          ← Back to Reports
        </button>

      </div>

    </main>

  );

}
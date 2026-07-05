"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import {
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

export default function ReportsPage() {
  const router = useRouter();

  const openedTrackedRef =
    useRef(false);

  //------------------------------------------------------------
  // Track Reports Landing Page Open
  //------------------------------------------------------------

  useEffect(() => {

    if (openedTrackedRef.current) {

      return;

    }

    openedTrackedRef.current = true;

    void analyticsService.track({

      module:
        ANALYTICS_MODULES.REPORTS,

      eventName:
        ANALYTICS_EVENTS.OPENED,

      pagePath:
        "/reports",

      metadata: {

        viewType:
          "LANDING",

      },

    });

  }, []);

  //------------------------------------------------------------
  // Report Category Navigation
  //------------------------------------------------------------

  const handleReportCategoryClick = async (
    reportCategory: string,
    href: string
  ) => {

    await analyticsService.track({

      module:
        ANALYTICS_MODULES.REPORTS,

      eventName:
        ANALYTICS_EVENTS.FEATURE_CLICKED,

      pagePath:
        "/reports",

      metadata: {

        reportCategory,

      },

    });

    router.push(href);

  };

  //------------------------------------------------------------
  // Back to Dashboard
  //------------------------------------------------------------

  const handleBackToDashboard = async () => {

    await analyticsService.track({

      module:
        ANALYTICS_MODULES.REPORTS,

      eventName:
        ANALYTICS_EVENTS
          .BACK_TO_DASHBOARD_CLICKED,

      pagePath:
        "/reports",

    });

    router.push(
      "/dashboard"
    );

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
  pageTitle="Reports"
  pageIcon="📊"
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
          <div
            style={cardStyle}
            onClick={() =>
  void handleReportCategoryClick(
    "DAILY_CARE",
    "/reports/daily-care/select"
  )
}
          >
            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              📋 Daily Care
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
              }}
            >
              View daily care history, vitals and notes.
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

          <div
            style={cardStyle}
            onClick={() =>
  void handleReportCategoryClick(
    "ASSESSMENT",
    "/reports/assessment"
  )
}
          >
            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              🩺 Assessments
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
              }}
            >
              View Family and Self Assessment history.
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

{/*------------------------------------------------*/}
{/* Clinical Trends */}
{/*------------------------------------------------*/}

<div
  style={cardStyle}
  onClick={() =>
  void handleReportCategoryClick(
    "CLINICAL_TRENDS",
    "/reports/trends/selector"
  )
}
>
  <h2
    style={{
      marginBottom: "10px",
    }}
  >
    📈 Clinical Trends
  </h2>

  <p
    style={{
      color: "#6b7280",
      marginBottom: "20px",
    }}
  >
    Visualize health trends, vitals and
    clinical progress over time.
  </p>

<button
  style={{
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#9333ea",
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
  void handleBackToDashboard()
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
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
"use client";

import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";

import ReportNavigation from "@/app/components/common/ReportNavigation";

import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

export default function AssessmentReportsPage() {
  const router = useRouter();

  //------------------------------------------------------------
  // Assessment Report Context Selection
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
        "/reports/assessment",

      metadata: {

        reportCategory:
          "ASSESSMENT",

      },

    });

    router.push(href);

  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

<AppHeader
  pageTitle="Assessment Reports"
  pageIcon="📋"
/>

        {/* Family Assessments */}

        <div style={cardStyle}>
          <div>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
              }}
            >
              👨‍👩‍👧 Family Assessments
            </h2>

            <p style={descriptionStyle}>
              Review assessments completed for patients under your care.
            </p>
          </div>

          <button
            style={primaryButtonStyle}
            onClick={() =>
  void handleContextSelection(
    ANALYTICS_CONTEXTS.FAMILY,
    "/reports/assessment/family"
  )
}
          >
            Open
          </button>
        </div>

        {/* Self Assessments */}

        <div style={cardStyle}>
          <div>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
              }}
            >
              🧑 Self Assessments
            </h2>

            <p style={descriptionStyle}>
              Review assessments completed for yourself.
            </p>
          </div>

          <button
            style={primaryButtonStyle}
            onClick={() =>
  void handleContextSelection(
    ANALYTICS_CONTEXTS.SELF,
    "/reports/assessment/self"
  )
}
          >
            Open
          </button>
        </div>

<ReportNavigation
  backLabel="Back to Reports"
  backHref="/reports"
  showDashboardButton
/>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "24px",
  fontFamily: "Inter, Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  padding: "32px",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
  lineHeight: 1.6,
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
};


"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MobileHeader from "@/Components/common/MobileHeader";
import CareVRFooter from "@/Components/common/CareVRFooter";
import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";

import ReportNavigation from "@/app/components/common/ReportNavigation";

/*
import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";
*/

export default function AssessmentReportsPage() {
  const router = useRouter();

const [userName, setUserName] = useState("");
const [accountMenuOpen, setAccountMenuOpen] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);

useEffect(() => {
  let active = true;

  const loadProfile = async () => {
    try {
      const profile = await profileRepository.getCurrentProfile();

      if (active) {
        setUserName(profile?.fullName ?? "");
      }
    } catch (error) {
      console.error("Failed to load assessment report header profile:", error);
    }
  };

  void loadProfile();

  return () => {
    active = false;
  };
}, []);

const handleLogout = async () => {
  if (loggingOut) return;

  setLoggingOut(true);

  try {
    await authService.logout();
    router.replace("/login");
  } catch (error) {
    console.error("Assessment report logout failed:", error);
    setLoggingOut(false);
  }
};

  //------------------------------------------------------------
  // Assessment Report Context Selection
  //------------------------------------------------------------

/*
  const handleContextSelection = async (
    context:
      | typeof ANALYTICS_CONTEXTS.SELF
      | typeof ANALYTICS_CONTEXTS.FAMILY,
    href: string

  ) => {
*/


/*
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

*/

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

<MobileHeader
  careMode="FAMILY"
  onCareModeChange={() => {}}
  userName={userName}
  pageTitle="Assessment Reports"
  showCareModeToggle={false}
  showSelfToggle={false}
  showFamilyToggle={false}
  showHomeButton
  onHomeClick={() => router.push("/dashboard")}
  showSwitchProfile={false}
  accountMenuOpen={accountMenuOpen}
  onAccountMenuToggle={() =>
    setAccountMenuOpen((current) => !current)
  }
  consentGranted={false}
  canAddPatient={false}
  onAddPatient={() => {}}
  onCareVRJourney={() => router.push("/carevr-journey")}
  onHelp={() => router.push("/help")}
  onLogout={handleLogout}
  loggingOut={loggingOut}
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
    router.push(
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
    router.push(
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
<CareVRFooter />
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


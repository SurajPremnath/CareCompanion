"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { downloadAssessmentPdf } from "@/lib/utils/pdf/assessmentPdf";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";

import {
  encryptedAssessmentStorage,
  encryptedDetailToAssessmentRecord,
} from "@/lib/storage/encryptedAssessmentStorage";

import { profileRepository } from "@/lib/repositories/profileRepository";
import type { Profile } from "@/lib/types/profile";

import type {
  AssessmentRecord,
  AssessmentRecommendation,
  AssessmentStatus,
} from "@/lib/types/assessment";

import MobileHeader, {
  type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";
import { authService } from "@/lib/auth/authService";

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

function getAssessmentWellbeingSummary(score: number): string {
  if (score >= 19) {
    return "Today's responses indicate encouraging signs of wellbeing. Current routines appear to be supporting overall health. Continue hydration, nutrition and regular monitoring.";
  }

  if (score >= 16) {
    return "Overall wellbeing appears stable today. A few areas may benefit from gentle attention, but today's responses remain largely encouraging.";
  }

  if (score >= 12) {
    return "A few areas deserve additional attention today. Monitoring symptoms and encouraging hydration, nutrition and rest may be helpful.";
  }

  return "Several responses suggest closer observation is needed today. If symptoms persist, worsen or cause concern, consider contacting a healthcare professional.";
}

export default function SelfAssessmentDetailPage() {

const router = useRouter();
const params = useParams();

const [accountMenuOpen, setAccountMenuOpen] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = async () => {
  if (loggingOut) return;

  setLoggingOut(true);

  try {
    await authService.logout();
    router.replace("/sandbox/simulate/app/dashboard");
  } catch (error) {
    console.error("Unable to log out.", error);
    setLoggingOut(false);
  }
};

const handleCareVRJourney = () => {
  setAccountMenuOpen(false);
  router.push("/dashboard");
};

const handleHelp = () => {
  setAccountMenuOpen(false);
  router.push("/help");
};

const handleCareModeChange = (_mode: MobileCareMode) => {
  // Mode switching is intentionally disabled on assessment reports.
};

  const assessmentId =
    params.id as string;

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [assessment, setAssessment] =
    useState<AssessmentRecord | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [error, setError] =
    useState("");


const reportRef = useRef<HTMLDivElement>(null);
const [downloadingPdf, setDownloadingPdf] = useState(false);
const [pdfStage, setPdfStage] = useState("Preparing your report");
const [pdfError, setPdfError] = useState("");

  //------------------------------------------------------------
  // Load Assessment
  //------------------------------------------------------------

useEffect(() => {
  let cancelled = false;

  const loadAssessment = async () => {
    try {
      setError("");
      setLoading(true);

      let loadedAssessment: AssessmentRecord | null = null;

      const encryptedResult =
        await encryptedAssessmentStorage.getById(assessmentId);

      if (encryptedResult.success) {
        loadedAssessment = encryptedDetailToAssessmentRecord(
          encryptedResult.data
        );

        if (!loadedAssessment) {
          throw new Error("The encrypted assessment payload is invalid.");
        }
      } else if (
        encryptedResult.status === 409 &&
        encryptedResult.recordClassification === "HISTORICAL"
      ) {
        const legacyResult = await assessmentStorage.getById(assessmentId);

        if (!legacyResult.success) {
          throw new Error(
            legacyResult.error ?? "Unable to load historical assessment."
          );
        }

        loadedAssessment = legacyResult.data ?? null;

        if (!loadedAssessment) {
          throw new Error("Assessment not found.");
        }
      } else {
        throw new Error(
          encryptedResult.error ?? "Unable to securely load assessment."
        );
      }

      if (cancelled) return;

      setAssessment(loadedAssessment);

      const currentProfile = await profileRepository.getCurrentProfile();

      if (!cancelled) {
        setProfile(currentProfile);
      }
    } catch (error) {
      console.error("Error loading assessment:", error);

      if (!cancelled) {
        setAssessment(null);
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load assessment."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  if (assessmentId) {
    void loadAssessment();
  } else {
    setLoading(false);
  }

  return () => {
    cancelled = true;
  };
}, [assessmentId]);

  //------------------------------------------------------------
  // Helpers
  //------------------------------------------------------------

  const formatStatus = (
    status: AssessmentStatus
  ) => {

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        c => c.toUpperCase()
      );

  };

  const formatRecommendation = (
    recommendation: AssessmentRecommendation
  ) => {

    return recommendation
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        c => c.toUpperCase()
      );

  };

  const yesNo = (
    value: boolean
  ) => value ? "Yes" : "No";

  //------------------------------------------------------------
  // Loading
  //------------------------------------------------------------

  if (loading) {

    return (

      <main style={loadingStyle}>

        <h2>

          Loading...

        </h2>

      </main>

    );

  }

  //------------------------------------------------------------
  // Error
  //------------------------------------------------------------

if (error || !assessment) {

  return (

    <main style={pageStyle}>

      <div style={containerStyle}>

        <div style={errorStyle}>

          {error || "Assessment not found."}

        </div>

        <button
          type="button"
          style={{
            ...actionButtonStyle,
            width: "100%",
            marginTop: "24px",
          }}
          onClick={() =>
            router.push("/reports/assessment/self")
          }
        >
          ← Back to Self Assessments
        </button>

      </div>

      <CareVRFooter />

    </main>

  );

}

  //------------------------------------------------------------
  // Page
  //------------------------------------------------------------

return (

  <main style={pageStyle}>

    <div style={containerStyle}>

      <MobileHeader
        careMode="SELF"
        onCareModeChange={handleCareModeChange}
        userName={profile?.fullName ?? ""}
        showHomeButton={true}
        onHomeClick={() => router.push("/dashboard")}
        showCareModeToggle={false}
        showSelfToggle={false}
        showFamilyToggle={false}
        showSwitchProfile={false}
        accountMenuOpen={accountMenuOpen}
        onAccountMenuToggle={() =>
          setAccountMenuOpen(value => !value)
        }
        consentGranted={true}
        canAddPatient={false}
        onAddPatient={() => {}}
        onCareVRJourney={handleCareVRJourney}
        onHelp={handleHelp}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <div ref={reportRef}>

        <div style={{ background: "white", padding: "14px", borderRadius: "14px", border: "1px solid #ddd" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#111827", marginTop: "24px", marginBottom: "24px" }}>
            📄 Health Assessment Report
          </h2>

          <p><strong>Patient:</strong> {assessment.reportDetails?.patientName ?? profile?.fullName ?? "Unknown"}{assessment.reportDetails?.patientAge ? ` (${assessment.reportDetails.patientAge})` : ""}</p>
          <p><strong>Assessment:</strong> Self Assessment</p>
          <p><strong>Date:</strong> {new Date(assessment.assessmentDate).toLocaleString()}</p>

          <hr style={{ margin: "14px 0" }} />

          <h2>Today's Wellbeing Overview</h2>
          <h1 style={{ marginBottom: "10px" }}>{assessment.normalizedScore}/20</h1>
          <h2>{formatStatus(assessment.status)}</h2>
          <p style={{ lineHeight: "1.7" }}>
            {assessment.reportDetails?.wellbeingSummary ?? getAssessmentWellbeingSummary(assessment.normalizedScore)}
          </p>

          <hr style={{ margin: "14px 0" }} />

          <h2>Wellbeing Observations</h2>
          {assessment.reportDetails?.observations.length ? (
            assessment.reportDetails.observations.map((item, index) => (
              <p key={index}>{item}</p>
            ))
          ) : (
            <p>No saved observations are available for this assessment.</p>
          )}

          <hr style={{ margin: "14px 0" }} />

          <h2>Suggestions For Today</h2>
          {assessment.reportDetails?.suggestions.length ? (
            assessment.reportDetails.suggestions.map((item, index) => (
              <p key={index}>{item}</p>
            ))
          ) : (
            <p>No saved suggestions are available for this assessment.</p>
          )}

          <hr style={{ margin: "14px 0" }} />

          <h2>Today's Health Summary</h2>
          {assessment.reportDetails?.summaryRows.length ? (
            assessment.reportDetails.summaryRows.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  padding: "14px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            ))
          ) : (
            <p>Detailed health-summary values are unavailable for this historical assessment.</p>
          )}

          <hr style={{ margin: "30px 0" }} />

          <h3>Disclaimer</h3>
          <p style={{ color: "#555", lineHeight: "1.6" }}>
            This assessment is designed to support daily wellbeing monitoring and early identification of changes in health status.
          </p>
          <p style={{ color: "#555", lineHeight: "1.6" }}>
            It is not intended to diagnose, treat or replace professional medical advice. If symptoms are severe, worsening or causing concern, please consult a qualified healthcare professional.
          </p>

          <hr style={{ margin: "14px 0" }} />

          <div style={{ textAlign: "center", color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            <p>Created by <strong>Linearise AI Labs</strong></p>
            <p>© {new Date().getFullYear()} CareVR. All Rights Reserved.</p>
          </div>
        </div>
        </div>
      <div style={reportActionsStyle}>

        <button
          type="button"
          style={actionButtonStyle}
          onClick={() =>
            router.push("/reports/assessment/self")
          }
        >
          ← Back to Self Assessments
        </button>

        <button
          type="button"
          style={downloadButtonStyle}
          disabled={downloadingPdf}
          onClick={async () => {
if (!reportRef.current) {
  setPdfError("Unable to access the report for PDF generation.");
  return;
}

if (!assessment) {
  setPdfError("Assessment data is not available for PDF generation.");
  return;
}

if (downloadingPdf) {
  return;
}

            setPdfError("");
            setDownloadingPdf(true);

            try {
await downloadAssessmentPdf(
  reportRef.current,
  profile?.fullName ?? "Unknown",
  (stage) => {
    switch (stage) {
      case "capturing":
        setPdfStage("Capturing your assessment report...");
        break;

      case "building":
        setPdfStage("Building your PDF...");
        break;

      case "saving":
        setPdfStage("Preparing your download...");
        break;
    }
  }
);
            } catch (error) {
              console.error(
                "Assessment PDF generation failed:",
                error
              );

              setPdfError(
                "Unable to generate the PDF. Please try again."
              );
            } finally {
              setDownloadingPdf(false);
            }
          }}
        >
          {downloadingPdf
            ? "Preparing PDF..."
            : "↓ Download PDF"}
        </button>

      </div>

      {pdfError && (
        <div role="alert" style={pdfErrorStyle}>
          {pdfError}
        </div>
      )}

    </div>

  </main>

);

}

function calculateAge(
  dateOfBirth: string
): number {

  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age =
    today.getFullYear() -
    dob.getFullYear();

  const monthDifference =
    today.getMonth() -
    dob.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < dob.getDate()
    )
  ) {
    age--;
  }

  return age;

}

const loadingStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8fafc",
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "24px",
  fontFamily: "Inter, Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  padding: "32px",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "32px",
  padding: "24px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  background: "#fafafa",
};

const sectionHeadingStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "20px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  rowGap: "18px",
  columnGap: "28px",
};

const errorStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#991b1b",
  marginBottom: "24px",
};

const reportActionsStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "24px",
};

const actionButtonStyle: React.CSSProperties = {
  flex: "1 1 220px",
  minWidth: 0,
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: 600,
};

const downloadButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  background: "#1d2d62",
  color: "#ffffff",
  border: "1px solid #1d2d62",
};

const pdfErrorStyle: React.CSSProperties = {
  marginTop: "12px",
  padding: "12px 16px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#991b1b",
};
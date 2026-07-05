"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";

import { profileRepository } from "@/lib/repositories/profileRepository";

import type { Profile } from "@/lib/types/profile";

import type {
  AssessmentRecord,
  AssessmentRecommendation,
  AssessmentStatus,
} from "@/lib/types/assessment";

import AppHeader from "@/app/components/AppHeader";
import ReportTable, {
  ReportTableColumn,
} from "@/app/components/ReportTable";

import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

export default function SelfAssessmentHistoryPage() {

  const router = useRouter();

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [latestAssessment, setLatestAssessment] =
    useState<AssessmentRecord | null>(null);

  const [history, setHistory] =
    useState<AssessmentRecord[]>([]);

const [profile, setProfile] =
  useState<Profile | null>(null);

  //------------------------------------------------------------
  // Load History
  //------------------------------------------------------------

  useEffect(() => {

    const loadHistory = async () => {

      try {

        const result =
          await assessmentStorage.getUserHistory();

        if (!result.success) {

          setError(
            result.error ??
            "Unable to load assessment history."
          );

          return;

        }

        const records =
          (result.data ?? []).filter(
            assessment =>
              assessment.assessmentType ===
              "SELF"
          );

        void analyticsService.track({

          module:
            ANALYTICS_MODULES.REPORTS,

          eventName:
            ANALYTICS_EVENTS.VIEWED,

          context:
            ANALYTICS_CONTEXTS.SELF,

          pagePath:
            "/reports/assessment/self",

          metadata: {

            reportCategory:
              "ASSESSMENT",

            viewType:
              "HISTORY",

            recordCount:
              records.length,

          },

        });

const currentProfile =
  await profileRepository.getCurrentProfile();

setProfile(currentProfile);

        if (records.length === 0) {

          setLatestAssessment(null);
          setHistory([]);

          return;

        }

        setLatestAssessment(
          records[0]
        );

        setHistory(
          records.slice(1)
        );

      }
      finally {

        setLoading(false);

      }

    };

    loadHistory();

  }, []);

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

const columns: ReportTableColumn<AssessmentRecord>[] = [
  {
    key: "date",
    title: "Date",
    width: "34%",
    render: (assessment) =>
      new Date(
        assessment.assessmentDate
      ).toLocaleString(),
  },
  {
    key: "score",
    title: "Score",
    width: "12%",
    align: "center",
    render: (assessment) =>
      `${assessment.normalizedScore}/20`,
  },
  {
    key: "status",
    title: "Status",
    width: "18%",
    align: "center",
    render: (assessment) =>
      formatStatus(assessment.status),
  },
  {
    key: "recommendation",
    title: "Recommendation",
    width: "24%",
    align: "center",
    render: (assessment) =>
      formatRecommendation(
        assessment.recommendation
      ),
  },
  {
    key: "action",
    title: "Action",
    width: "12%",
    align: "center",
    render: (assessment) => (
      <button
        onClick={() =>
          router.push(
            `/reports/assessment/self/${assessment.id}`
          )
        }
      >
        View
      </button>
    ),
  },
];

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
  // Page
  //------------------------------------------------------------

  return (

    <main style={pageStyle}>

      <div style={containerStyle}>

<AppHeader
  pageTitle="Self Assessment Reports"
  pageIcon="👤"
/>

        {error && (

          <div style={errorStyle}>

            {error}

          </div>

        )}

        {!error &&
          latestAssessment && (

          <div
            style={{
              marginBottom:"32px",
              padding:"24px",
              border:"2px solid #2563eb",
              borderRadius:"16px",
              background:"#eff6ff",
            }}
          >

            <h2
              style={{
                marginTop:0,
                marginBottom:"20px",
              }}
            >
              🩺 Latest Self Assessment
            </h2>

            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                rowGap:"16px",
                columnGap:"28px",
              }}
            >

<div>

  <strong>
    Name
  </strong>

  <br />

  {profile?.fullName ?? "-"}

</div>

              <div>

                <strong>Date</strong>

                <br />

                {new Date(
                  latestAssessment.assessmentDate
                ).toLocaleString()}

              </div>

              <div>

                <strong>Score</strong>

                <br />

                {latestAssessment.normalizedScore}/20

              </div>

              <div>

                <strong>Status</strong>

                <br />

                {formatStatus(
                  latestAssessment.status
                )}

              </div>

              <div>

                <strong>Recommendation</strong>

                <br />

                {formatRecommendation(
                  latestAssessment.recommendation
                )}

              </div>

            </div>

            <button
              style={{
                marginTop:"24px",
              }}
              onClick={() =>
                router.push(
                  `/reports/assessment/self/${latestAssessment.id}`
                )
              }
            >
              View Details
            </button>

          </div>

        )}

        {!error &&
          !latestAssessment && (

          <div style={emptyStyle}>

            <h2
              style={{
                marginTop: 0,
              }}
            >
              No Self Assessments
            </h2>

            <p>
              Complete your first Self Assessment to begin building your assessment history.
            </p>

          </div>

        )}

        {!error &&
          history.length > 0 && (

          <>

            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              📚 Assessment History
            </h2>

<ReportTable
  columns={columns}
  data={history}
/>

          </>

        )}

        <button
          style={backButtonStyle}
          onClick={() =>
            router.push(
              "/reports/assessment"
            )
          }
        >
          ← Back to Assessment Reports
        </button>

      </div>

    </main>

  );

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
  maxWidth: "1200px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid #e5e7eb",
};

const errorStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#991b1b",
  marginBottom: "24px",
};

const emptyStyle: React.CSSProperties = {
  padding: "48px",
  textAlign: "center",
  borderRadius: "12px",
  border: "1px dashed #d1d5db",
  background: "#fafafa",
};

const backButtonStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};
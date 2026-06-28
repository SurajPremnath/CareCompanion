"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";

import type {
  AssessmentRecord,
  AssessmentRecommendation,
  AssessmentStatus,
} from "@/lib/types/assessment";

export default function SelfAssessmentDetailPage() {

  const router = useRouter();
  const params = useParams();

  const assessmentId =
    params.id as string;

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [assessment, setAssessment] =
    useState<AssessmentRecord | null>(null);

  const [error, setError] =
    useState("");

  //------------------------------------------------------------
  // Load Assessment
  //------------------------------------------------------------

  useEffect(() => {

    const loadAssessment = async () => {

      try {

        const result =
          await assessmentStorage.getById(
            assessmentId
          );

        if (!result.success) {

          setError(
            result.error ??
            "Unable to load assessment."
          );

          return;

        }

        setAssessment(
          result.data ?? null
        );

      }
      finally {

        setLoading(false);

      }

    };

    if (assessmentId) {

      loadAssessment();

    }

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
            style={backButtonStyle}
            onClick={() =>
              router.push(
                "/reports/assessment/self"
              )
            }
          >
            ← Back to Self Assessments
          </button>

        </div>

      </main>

    );

  }

  //------------------------------------------------------------
  // Page
  //------------------------------------------------------------

  return (

    <main style={pageStyle}>

      <div style={containerStyle}>

        <h1>

          🧑 Self Assessment

        </h1>

        <p
          style={{
            color:"#6b7280",
            marginBottom:"28px",
          }}
        >
          Complete assessment details.
        </p>

        {/*--------------------------------------------------*/}
        {/* Assessment Summary                              */}
        {/*--------------------------------------------------*/}

        <div style={sectionStyle}>

          <h2 style={sectionHeadingStyle}>

            Assessment Summary

          </h2>

          <div style={gridStyle}>

            <div>

              <strong>Assessment Date</strong>

              <br />

              {new Date(
                assessment.assessmentDate
              ).toLocaleString()}

            </div>

            <div>

              <strong>Assessment Type</strong>

              <br />

              Self

            </div>

            <div>

              <strong>Overall Score</strong>

              <br />

              {assessment.normalizedScore}/20

            </div>

            <div>

              <strong>Status</strong>

              <br />

              {formatStatus(
                assessment.status
              )}

            </div>

            <div>

              <strong>Recommendation</strong>

              <br />

              {formatRecommendation(
                assessment.recommendation
              )}

            </div>

            <div>

              <strong>Version</strong>

              <br />

              {assessment.assessmentVersion}

            </div>

          </div>

        </div>

        {/*--------------------------------------------------*/}
        {/* Symptoms                                         */}
        {/*--------------------------------------------------*/}

        <div style={sectionStyle}>

          <h2 style={sectionHeadingStyle}>

            Symptoms & Responses

          </h2>

          <div style={gridStyle}>

            <div>

              <strong>Breathing</strong>

              <br />

              {assessment.answers.breathing}

            </div>

            <div>

              <strong>Cough</strong>

              <br />

              {yesNo(
                assessment.answers.cough
              )}

            </div>

            <div>

              <strong>Blood In Cough</strong>

              <br />

              {yesNo(
                assessment.answers.bloodInCough
              )}

            </div>

            <div>

              <strong>Fever</strong>

              <br />

              {yesNo(
                assessment.answers.fever
              )}

            </div>

            <div>

              <strong>Temperature</strong>

              <br />

              {assessment.answers.temperature !== null
                ? `${assessment.answers.temperature}°F`
                : "Not Recorded"}

            </div>

            <div>

              <strong>Energy</strong>

              <br />

              {assessment.answers.energy}

            </div>

            <div>

              <strong>Appetite</strong>

              <br />

              {assessment.answers.appetite}

            </div>

            <div>

              <strong>Water Intake</strong>

              <br />

              {assessment.answers.waterIntake}

            </div>

            <div>

              <strong>Pain</strong>

              <br />

              {yesNo(
                assessment.answers.pain
              )}

            </div>

            <div>

              <strong>Pain Areas</strong>

              <br />

              {assessment.answers.painAreas.length > 0
                ? assessment.answers.painAreas.join(", ")
                : "None"}

            </div>

            <div>

              <strong>Walking Difficulty</strong>

              <br />

              {yesNo(
                assessment.answers.walkingDifficulty
              )}

            </div>

            <div>

              <strong>Loose Motions</strong>

              <br />

              {yesNo(
                assessment.answers.looseMotions
              )}

            </div>

          </div>

        </div>

        {/*--------------------------------------------------*/}
        {/* Assessment Information                          */}
        {/*--------------------------------------------------*/}

        <div style={sectionStyle}>

          <h2 style={sectionHeadingStyle}>

            Assessment Information

          </h2>

          <div style={gridStyle}>

            <div>

              <strong>Assessment ID</strong>

              <br />

              {assessment.id}

            </div>

            <div>

              <strong>Created</strong>

              <br />

              {new Date(
                assessment.createdAt
              ).toLocaleString()}

            </div>

            <div>

              <strong>Last Updated</strong>

              <br />

              {new Date(
                assessment.updatedAt
              ).toLocaleString()}

            </div>

            <div>

              <strong>Daily Care Record</strong>

              <br />

              {assessment.dailyCareId
                ? "Linked"
                : "Not Linked"}

            </div>

          </div>

        </div>

        <button
          style={backButtonStyle}
          onClick={() =>
            router.push(
              "/reports/assessment/self"
            )
          }
        >
          ← Back to Self Assessments
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

const backButtonStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};
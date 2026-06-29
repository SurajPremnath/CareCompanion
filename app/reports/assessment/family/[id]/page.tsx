"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";

import { patientStorage } from "@/lib/storage/patientStorage";

import type { Patient } from "@/lib/types/patient";

import type {
  AssessmentRecord,
  AssessmentStatus,
  AssessmentRecommendation,
} from "@/lib/types/assessment";

import AppHeader from "@/app/components/AppHeader";

import { downloadAssessmentPdf }
from "@/lib/utils/pdf/assessmentPdf";

export default function FamilyAssessmentDetailPage() {

  const router = useRouter();
  const params = useParams();

const reportRef =
  useRef<HTMLDivElement>(null);

  const assessmentId =
    params.id as string;

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [assessment, setAssessment] =
    useState<AssessmentRecord | null>(null);

  const [patient, setPatient] =
    useState<Patient | null>(null);

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

if (result.data?.patientId) {

const patientResult =
  await patientStorage.getPatient(
    result.data.patientId
  );


  if (patientResult.success) {

    setPatient(
      patientResult.data ?? null
    );

  }

}

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
                "/reports/assessment/family"
              )
            }
          >
            ← Back to Family Assessments
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

<div ref={reportRef}>

<AppHeader
  pageTitle="Family Assessment Report"
  pageIcon="📄"
/>

        {/*--------------------------------------------------*/}
        {/* Assessment Summary                              */}
        {/*--------------------------------------------------*/}

        <div style={sectionStyle}>

          <h2
            style={sectionHeadingStyle}
          >
            Assessment Summary
          </h2>

          <div style={gridStyle}>

<div>

  <strong>
    Patient
  </strong>

  <br />

  {patient?.fullName ?? "Unknown"}

</div>

<div>

  <strong>
    Age
  </strong>

  <br />

  {patient?.dateOfBirth
    ? calculateAge(patient.dateOfBirth)
    : "-"}

</div>

            <div>

              <strong>
                Assessment Date
              </strong>

              <br />

              {new Date(
                assessment.assessmentDate
              ).toLocaleString()}

            </div>

            <div>

              <strong>
                Assessment Type
              </strong>

              <br />

              Family

            </div>

            <div>

              <strong>
                Overall Score
              </strong>

              <br />

              {assessment.normalizedScore}/20

            </div>

            <div>

              <strong>
                Status
              </strong>

              <br />

              {formatStatus(
                assessment.status
              )}

            </div>

            <div>

              <strong>
                Recommendation
              </strong>

              <br />

              {formatRecommendation(
                assessment.recommendation
              )}

            </div>

          </div>

        </div>

        {/*--------------------------------------------------*/}
        {/* Symptoms                                         */}
        {/*--------------------------------------------------*/}

        <div style={sectionStyle}>

          <h2
            style={sectionHeadingStyle}
          >
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
              {yesNo(assessment.answers.cough)}
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

          <h2
            style={sectionHeadingStyle}
          >
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

              {assessment.dailyCareId ??
                "Not Linked"}

            </div>

          </div>

        </div>

<button
  style={{
    width: "100%",
    marginTop: "20px",
    marginBottom: "12px",
    padding: "14px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
  onClick={() => {

    if (!reportRef.current) return;

    void downloadAssessmentPdf(
      reportRef.current,
      patient?.fullName ?? "Patient"
    );

  }}
>
  📄 Download PDF Report
</button>

        <button
          style={backButtonStyle}
          onClick={() =>
            router.push(
              "/reports/assessment/family"
            )
          }
        >
          ← Back to Family Assessments
        </button>

      </div>

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
  columnGap: "28px",
  rowGap: "18px",
};

const errorStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#991b1b",
  marginBottom: "24px",
};

function calculateAge(
  dateOfBirth: string
): number {

  const dob =
    new Date(dateOfBirth);

  const today =
    new Date();

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
      today.getDate() <
      dob.getDate()
    )
  ) {

    age--;

  }

  return age;

}

const backButtonStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};
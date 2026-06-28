"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";
import { patientStorage } from "@/lib/storage/patientStorage";
import type { Patient } from "@/lib/types/patient";


import type {
  AssessmentRecord,
  AssessmentStatus,
  AssessmentRecommendation,
} from "@/lib/types/assessment";

import AppHeader from "@/app/components/AppHeader";

export default function FamilyAssessmentHistoryPage() {

  const router = useRouter();

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  const [latestAssessment, setLatestAssessment] =
    useState<AssessmentRecord | null>(null);

  const [history, setHistory] =
    useState<AssessmentRecord[]>([]);

  //------------------------------------------------------------
  // Load Patients
  //------------------------------------------------------------

  useEffect(() => {

    const loadPatients = async () => {

      const result =
        await patientStorage.getPatients();

      if (!result.success) {

        setError(
          result.error ??
          "Unable to load patients."
        );

        setLoading(false);

        return;

      }

      const patientList =
        result.data ?? [];

      setPatients(patientList);

      if (patientList.length > 0) {

        setSelectedPatientId(
          patientList[0].id
        );

      }
      else {

        setLoading(false);

      }

    };

    loadPatients();

  }, []);

  //------------------------------------------------------------
  // Load Assessment History
  //------------------------------------------------------------

  useEffect(() => {

    if (!selectedPatientId) {

      return;

    }

    const loadHistory = async () => {

      try {

        setLoading(true);

        const result =
          await assessmentStorage.getPatientHistory(
            selectedPatientId
          );

        if (!result.success) {

          setError(
            result.error ??
            "Unable to load assessment history."
          );

          return;

        }

        const records =
          result.data ?? [];

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

  }, [selectedPatientId]);

const selectedPatient =
  patients.find(
    (patient) =>
      patient.id === selectedPatientId
  );

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
        (c) => c.toUpperCase()
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
        (c) => c.toUpperCase()
      );

  };

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
  pageTitle="Family Assessment Reports"
  pageIcon="👨‍👩‍👧"
 />

        {/* Patient Selector */}

        <div
          style={{
            marginBottom: "28px",
            padding: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: 600,
            }}
          >
            Patient
          </label>

          <select
            value={selectedPatientId}
            onChange={(e) =>
              setSelectedPatientId(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
            }}
          >

            {patients.map((patient) => (

              <option
                key={patient.id}
                value={patient.id}
              >

                {patient.fullName}

              </option>

            ))}

          </select>

        </div>

        {error && (

          <div style={errorStyle}>

            {error}

          </div>

        )}

        {!error &&
          latestAssessment && (

          <div
            style={{
              marginBottom: "32px",
              padding: "24px",
              borderRadius: "16px",
              border: "2px solid #2563eb",
              background: "#eff6ff",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              🩺 Latest Assessment
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                rowGap: "16px",
                columnGap: "28px",
              }}
            >

<div>

  <strong>
    Patient
  </strong>

  <br />

  {selectedPatient?.fullName ?? "-"}

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
                marginTop: "24px",
              }}
              onClick={() =>
                router.push(
                  `/reports/assessment/family/${latestAssessment.id}`
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
              No Family Assessments
            </h2>

            <p>
              Complete a Family Assessment to begin building the patient's
              assessment history.
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

            <table style={tableStyle}>

              <thead>

                <tr>

                  <th>Date</th>

                  <th>Score</th>

                  <th>Status</th>

                  <th>Recommendation</th>

                  <th></th>

                </tr>

              </thead>

              <tbody>

                {history.map((assessment) => (

                  <tr
                    key={assessment.id}
                  >

                    <td>

                      {new Date(
                        assessment.assessmentDate
                      ).toLocaleString()}

                    </td>

                    <td>

                      {assessment.normalizedScore}/20

                    </td>

                    <td>

                      {formatStatus(
                        assessment.status
                      )}

                    </td>

                    <td>

                      {formatRecommendation(
                        assessment.recommendation
                      )}

                    </td>

                    <td>

                      <button
                        onClick={() =>
                          router.push(
                            `/reports/assessment/family/${assessment.id}`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

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
  border: "1px dashed #d1d5db",
  borderRadius: "12px",
  background: "#fafafa",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "32px",
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
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAssessmentHistory,
  AssessmentRecord,
} from "@/lib/reportStorage";

export default function ReportsPage() {
  const router = useRouter();

  const [history, setHistory] = useState<
    AssessmentRecord[]
  >([]);

  useEffect(() => {
    const records =
      getAssessmentHistory();

    setHistory(records);
  }, []);

  const latestAssessment =
    history.length > 0
      ? history[0]
      : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          ❤️ CareCompanion
        </h1>

        <h2
          style={{
            marginBottom: "30px",
          }}
        >
          Reports Dashboard
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <h3>
              Total Assessments
            </h3>

            <p
              style={{
                fontSize: "36px",
                fontWeight: "bold",
              }}
            >
              {history.length}
            </p>
          </div>

          <div
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <h3>
              Latest Assessment
            </h3>

            {latestAssessment ? (
              <>
                <p>
                  {
                    latestAssessment.patientName
                  }
                </p>

                <p>
                  Score:{" "}
                  {
                    latestAssessment.score
                  }
                </p>

                <p>
                  {
                    latestAssessment.status
                  }
                </p>
              </>
            ) : (
              <p>
                No assessments
                available
              </p>
            )}
          </div>
        </div>

        <h3>
          Assessment History
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                Date
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                Patient
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                Type
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                Score
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map(
              (assessment) => (
                <tr
                  key={
                    assessment.id
                  }
                >
                  <td
                    style={{
                      padding:
                        "10px",
                    }}
                  >
                    {
                      assessment.assessmentDate
                    }
                  </td>

                  <td
                    style={{
                      padding:
                        "10px",
                    }}
                  >
                    {
                      assessment.patientName
                    }
                  </td>

                  <td
                    style={{
                      padding:
                        "10px",
                    }}
                  >
                    {
                      assessment.assessmentType
                    }
                  </td>

                  <td
                    style={{
                      padding:
                        "10px",
                    }}
                  >
                    {
                      assessment.score
                    }
                  </td>

                  <td
                    style={{
                      padding:
                        "10px",
                    }}
                  >
                    {
                      assessment.status
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <button
          onClick={() =>
            router.push(
              "/dashboard"
            )
          }
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border:
              "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← Back To Dashboard
        </button>
      </div>
    </main>
  );
}
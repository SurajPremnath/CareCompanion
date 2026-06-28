"use client";

import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();

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
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "8px",
          }}
        >
          📊 Reports
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "32px",
          }}
        >
          View previously saved Daily Care records and Assessments.
        </p>

        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          <div
            style={cardStyle}
            onClick={() =>
              router.push("/reports/daily-care")
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
              router.push("/reports/assessment")
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
        </div>

        <button
          onClick={() => router.push("/dashboard")}
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
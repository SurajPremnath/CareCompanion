"use client";

import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";

export default function AssessmentReportsPage() {
  const router = useRouter();

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
              router.push("/reports/assessment/family")
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
              router.push("/reports/assessment/self")
            }
          >
            Open
          </button>
        </div>

        <button
          style={backButtonStyle}
          onClick={() => router.push("/reports")}
        >
          ← Back to Reports
        </button>
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

const backButtonStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  cursor: "pointer",
  background: "#ffffff",
};
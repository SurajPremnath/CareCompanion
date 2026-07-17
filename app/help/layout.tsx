import type { ReactNode } from "react";

export default function HelpLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        {/* Header */}

        <header
          style={{
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              color: "#111827",
            }}
          >
            📖 CareVR Help Centre
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: "4px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            User Guide & Documentation
          </p>

<p
  style={{
    marginTop: "8px",
    color: "#2563eb",
    fontWeight: 600,
    fontSize: "16px",
  }}
>
  AI-powered healthcare companion for patients, families and caregivers.
</p>

          <p
            style={{
              marginTop: "12px",
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: "16px",
            }}
          >
            Learn how to use CareVR to record daily health observations,
            complete assessments, review reports and generate professional
            clinical trend reports.
          </p>
        </header>

        {/* Page Content */}

        {children}

        {/* Footer */}

        <footer
          style={{
            marginTop: "60px",
            paddingTop: "24px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Need Assistance?
          </h3>

          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            If you need additional assistance or would like to share feedback, please contact the CareVR team.
          </p>

<div
  style={{
    marginBottom: "24px",
    padding: "16px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
  }}
>
  <h4
    style={{
      marginTop: 0,
      marginBottom: "8px",
      color: "#1e40af",
    }}
  >
    💡 Feedback & Suggestions
  </h4>

  <p
    style={{
      margin: 0,
      color: "#374151",
      lineHeight: 1.7,
    }}
  >
    We're continually improving CareVR to make healthcare simpler,
    smarter and more accessible. Your feedback helps us build a better
    experience for everyone.
  </p>
</div>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              margin: 0,
            }}
          >
            CareVR v1.0 • © 2026 CareVR
          </p>
        </footer>
      </main>
    </div>
  );
}
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
            Need more help?
          </h3>

          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            If you still need assistance, please contact your CareVR
            Administrator.
          </p>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              margin: 0,
            }}
          >
            CareVR Version 1.0
          </p>
        </footer>
      </main>
    </div>
  );
}
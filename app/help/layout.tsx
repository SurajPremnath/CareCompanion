import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HelpLayout({
  children,
}: {
  children: ReactNode;
}) {
const pathname = usePathname();

const backLink =
  pathname === "/help"
    ? "/dashboard"
    : "/help";

const backText =
  pathname === "/help"
    ? "← Back to Dashboard"
    : "← Back to Help Centre";

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
        {/* Back */}

<Link
  href={backLink}
  style={{
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: 500,
    display: "inline-block",
    marginBottom: "24px",
  }}
>
  {backText}
</Link>

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
            ❓ Help Centre
          </h1>

          <p
            style={{
              marginTop: "12px",
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: "16px",
            }}
          >
            Learn how to use CareVR to record health observations,
            monitor trends and generate professional reports.
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
              marginBottom: "10px",
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
            If you still need assistance, please contact your
            CareVR Administrator.
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
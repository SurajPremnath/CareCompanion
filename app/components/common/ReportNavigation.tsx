"use client";

import Link from "next/link";
import React from "react";

interface ReportNavigationProps {
  backLabel: string;
  backHref: string;

  showReportsButton?: boolean;
  reportsHref?: string;

  showDashboardButton?: boolean;
  dashboardHref?: string;
}

export default function ReportNavigation({
  backLabel,
  backHref,
  showReportsButton = false,
  reportsHref = "/reports/daily-care/select",
  showDashboardButton = true,
  dashboardHref = "/dashboard",
}: ReportNavigationProps) {
  return (
    <div style={containerStyle}>

<Link href={backHref} style={{ textDecoration: "none", flex: "1 1 240px" }}>
  <div style={buttonStyle}>
    ← {backLabel}
  </div>
</Link>

      {showReportsButton && (
<Link
  href={reportsHref}
  style={{ textDecoration: "none", flex: "1 1 240px" }}
>
  <div style={buttonStyle}>
    📋 Daily Care Reports
  </div>
</Link>
      )}

      {showDashboardButton && (
<Link
  href={dashboardHref}
  style={{ textDecoration: "none", flex: "1 1 240px" }}
>
  <div style={buttonStyle}>
    🏠 Dashboard
  </div>
</Link>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  marginTop: "32px",
  marginBottom: "24px",
};

const buttonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  minHeight: "56px",

  padding: "14px 20px",

  background: "#ffffff",

  border: "1px solid #d1d5db",
  borderRadius: "10px",

  color: "#111827",

  fontWeight: 600,
  fontSize: "16px",

  cursor: "pointer",

  boxSizing: "border-box",
};
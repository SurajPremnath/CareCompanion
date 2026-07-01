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
  reportsHref = "/reports/daily-care",
  showDashboardButton = true,
  dashboardHref = "/dashboard",
}: ReportNavigationProps) {
  return (
    <div style={containerStyle}>
      <Link href={backHref} style={buttonStyle}>
        ← {backLabel}
      </Link>

      {showReportsButton && (
        <Link href={reportsHref} style={buttonStyle}>
          📋 Daily Care Reports
        </Link>
      )}

      {showDashboardButton && (
        <Link href={dashboardHref} style={buttonStyle}>
          🏠 Dashboard
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
  flex: "1 1 240px",
  minHeight: "56px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  padding: "14px 20px",

  background: "#ffffff",

  border: "1px solid #d1d5db",
  borderRadius: "10px",

  textDecoration: "none",

  color: "#111827",

  fontWeight: 600,
  fontSize: "16px",

  cursor: "pointer",

  transition: "all 0.2s ease",
};
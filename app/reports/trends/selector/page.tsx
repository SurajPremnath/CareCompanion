"use client";

import { useRouter } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import ReportNavigation from "@/app/components/common/ReportNavigation";

export default function TrendSelectorPage() {

  const router = useRouter();

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
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >

        <AppHeader
          pageTitle="Clinical Trends"
          pageIcon="📈"
        />

        <p
          style={{
            color: "#6b7280",
            marginTop: "16px",
            marginBottom: "32px",
          }}
        >
          Choose whose clinical trends you would like to analyse.
        </p>

<section style={cardStyle}>

  <h2>👤 Self</h2>

  <p style={descriptionStyle}>
    Analyse your own Daily Care records and generate
    clinical trend reports.
  </p>

  <button
    style={primaryButton}
    onClick={() =>
      router.push("/reports/trends/self")
    }
  >
    Continue →
  </button>

</section>

<section style={cardStyle}>

  <h2>👨‍👩‍👧‍👦 Family</h2>

  <p style={descriptionStyle}>
    Analyse Daily Care records for a family member
    and generate clinical trend reports.
  </p>

  <button
    style={primaryButton}
    onClick={() =>
      router.push("/reports/trends")
    }
  >
    Continue →
  </button>

</section>

<ReportNavigation
  backLabel="Back to Reports"
  backHref="/reports"
  showDashboardButton
/>

      </div>

    </main>

  );

}
const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
};

const descriptionStyle: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "12px",
  marginBottom: "24px",
  lineHeight: 1.6,
};

const primaryButton: React.CSSProperties = {
  padding: "14px 28px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 600,
};
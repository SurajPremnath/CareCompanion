"use client";

import Link from "next/link";

import HelpCard from "@/Components/help/HelpCard";

import { performanceTracker } from "@/lib/performance/performanceTracker";

export default function HelpPage() {
  const handleBackToDashboard = () => {
    performanceTracker.start({
      fromPath: "/help",
      toPath: "/dashboard",
      feature: "HELP_TO_DASHBOARD",
    });
  };

  return (
    <>
      <Link
        href="/dashboard"
        onClick={handleBackToDashboard}
        style={{
          textDecoration: "none",
          color: "#2563eb",
          fontWeight: 500,
          display: "inline-block",
          marginBottom: "24px",
        }}
      >
        ← Back to Dashboard
      </Link>

      {/* Welcome */}

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          Welcome to CareVR
        </h2>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.8,
            marginBottom: 0,
          }}
        >
          CareVR helps patients, caregivers and families record daily health
          observations, complete structured assessments, review reports and
          monitor clinical trends. This Help Centre explains every feature in
          simple language.
        </p>
      </section>

      {/* What can you do */}

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          🌟 What can you do with CareVR?
        </h2>

        <ul
          style={{
            paddingLeft: "24px",
            color: "#4b5563",
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          <li>Record daily health observations.</li>
          <li>Track medications and prescriptions.</li>
          <li>Complete health assessments.</li>
          <li>Monitor clinical trends over time.</li>
          <li>Review historical reports.</li>
          <li>Generate professional PDF reports.</li>
          <li>Share health information during doctor consultations.</li>
        </ul>
      </section>

      {/* Healthcare Journey */}

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          🩺 Your Healthcare Journey
        </h2>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.8,
          }}
        >
          CareVR is designed to support your healthcare journey from recording
          daily health information to preparing for doctor consultations.
        </p>

        <ol
          style={{
            paddingLeft: "24px",
            color: "#4b5563",
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          <li>Add yourself or a family member.</li>
          <li>Record daily health observations.</li>
          <li>Manage medications and prescriptions.</li>
          <li>Review reports and clinical trends.</li>
          <li>Generate PDF reports.</li>
          <li>Share health information with your healthcare professional.</li>
        </ol>
      </section>

      {/* New Users */}

      <section
        style={{
          background: "#ecfeff",
          border: "1px solid #a5f3fc",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#155e75",
          }}
        >
          🚀 New to CareVR?
        </h2>

        <p
          style={{
            color: "#374151",
            lineHeight: 1.8,
            marginBottom: 0,
          }}
        >
          If you're using CareVR for the first time, we recommend starting with
          the <strong>Getting Started</strong> guide before exploring the rest
          of the Help Centre.
        </p>
      </section>

      {/* Help Topics */}

      <HelpCard
        icon="🚀"
        title="Getting Started"
        description="Learn how to begin using CareVR and understand the dashboard."
        href="/help/getting-started"
      />

      <HelpCard
        icon="❤️"
        title="Daily Care"
        description="Record temperature, blood pressure, pulse, SpO₂, medications, notes and more."
        href="/help/daily-care"
      />

<HelpCard
  icon="💊"
  title="Medication Management"
  description="Upload prescriptions, review AI-extracted medicines, manage active medications and maintain prescription history."
  href="/help/medication-management"
/>

      <HelpCard
        icon="📋"
        title="Health Assessments"
        description="Understand Self Assessment and Family Assessment."
        href="/help/assessments"
      />

      <HelpCard
        icon="📄"
        title="Reports"
        description="View historical Daily Care and Assessment reports."
        href="/help/reports"
      />

      <HelpCard
        icon="📈"
        title="Clinical Trends"
        description="Visualize trends, statistics and downloadable PDF reports."
        href="/help/clinical-trends"
      />

      <HelpCard
        icon="📑"
        title="PDF Reports"
        description="Generate and share professional PDF reports with healthcare providers."
        href="/help/pdf-reports"
      />

      <HelpCard
        icon="❓"
        title="Frequently Asked Questions"
        description="Find answers to the questions most commonly asked by users."
        href="/help/faq"
      />

      <HelpCard
        icon="🔒"
        title="Privacy & Security"
        description="Learn how CareVR stores and protects your health information."
        href="/help/privacy"
      />

      <HelpCard
        icon="ℹ️"
        title="About CareVR"
        description="Application information, version details and important disclaimers."
        href="/help/about"
      />
    </>
  );
}
import HelpCard from "@/Components/help/HelpCard";

export default function HelpPage() {
  return (
    <>
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
          CareVR helps patients, caregivers and families record daily
          health observations, complete structured assessments, review
          reports and monitor clinical trends. This Help Centre explains
          every feature in simple language.
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
        description="Generate and share professional reports with healthcare providers."
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
import HelpBackButton from "@/Components/help/HelpBackButton";

export default function ReportsPage() {
    return (
        <>
            <HelpBackButton />

            <h2
                style={{
                    fontSize: "30px",
                    marginBottom: "24px",
                    color: "#111827",
                }}
            >
                📄 Reports
            </h2>

            {/* Overview */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Review Your Healthcare Journey</h3>

                <p style={paragraphStyle}>
                    Reports bring together all the healthcare information
                    recorded in CareVR, allowing you to review previous
                    observations, assessments and health records in one
                    organized place.
                </p>

                <p style={paragraphStyle}>
                    Whether you are monitoring your own health or caring for a
                    loved one, Reports help you understand what has happened,
                    when it happened and how health has changed over time.
                </p>
            </section>

            {/* Available Reports */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Available Report Types</h3>

                <ul style={listStyle}>
                    <li>Daily Care Reports</li>
                    <li>Self Assessment Reports</li>
                    <li>Family Assessment Reports</li>
                    <li>Medication History (where available)</li>
                    <li>Health Timeline</li>
                    <li>Clinical Trend Reports</li>
                </ul>
            </section>

            {/* What You Can View */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What Can You Review?</h3>

                <ul style={listStyle}>
                    <li>Vital signs recorded during Daily Care.</li>
                    <li>Symptoms and pain history.</li>
                    <li>Health assessment results and scores.</li>
                    <li>Medication records.</li>
                    <li>Clinical notes and observations.</li>
                    <li>Historical healthcare entries.</li>
                    <li>Overall health progression over time.</li>
                </ul>
            </section>

            {/* Using Reports */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Viewing Reports</h3>

                <ol style={listStyle}>
                    <li>Select yourself or a family member.</li>
                    <li>Select the patient.</li>
                    <li>Choose the report category.</li>
                    <li>Select the required record or reporting period.</li>
                    <li>Review the recorded healthcare information.</li>
                    <li>Generate a PDF report if required.</li>
                </ol>
            </section>

            {/* Benefits */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Why Reports Matter</h3>

                <ul style={listStyle}>
                    <li>Review healthcare history at any time.</li>
                    <li>Understand changes in health over time.</li>
                    <li>Prepare for hospital and doctor visits.</li>
                    <li>Support better continuity of care.</li>
                    <li>Reduce the need to remember past events.</li>
                    <li>Keep healthcare information organized.</li>
                </ul>
            </section>

            {/* Relationship */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>How Reports Work Together</h3>

                <p style={paragraphStyle}>
                    Reports work alongside Daily Care, Health Assessments,
                    Clinical Trends and Health Timeline to provide a complete
                    picture of a patient's healthcare journey. Each feature
                    complements the others, allowing both detailed review and
                    long-term monitoring.
                </p>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Record Daily Care consistently.</li>
                    <li>Complete Health Assessments regularly.</li>
                    <li>Review reports before medical consultations.</li>
                    <li>Use Clinical Trends for visual analysis.</li>
                    <li>Generate updated reports whenever new records are added.</li>
                </ul>
            </section>

            {/* Important */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Information</h3>

                <p style={paragraphStyle}>
                    Reports summarize healthcare information that has been
                    entered into CareVR. They are designed to improve
                    organization, communication and continuity of care, but
                    they should not replace professional medical advice or
                    clinical judgment.
                </p>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Clinical Trends</strong> to visualize
                    health measurements through charts, summary statistics and
                    trend analysis, or explore <strong>PDF Reports</strong> to
                    learn how to generate professional reports for sharing with
                    healthcare professionals.
                </p>
            </section>
        </>
    );
}

const sectionStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const headingStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: "14px",
    color: "#111827",
    fontSize: "22px",
};

const paragraphStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 1.8,
    marginBottom: "16px",
};

const listStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 2,
    paddingLeft: "24px",
    marginBottom: 0,
};
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

                <h3 style={headingStyle}>
                    Overview
                </h3>

                <p style={paragraphStyle}>
                    Reports allow you to review previously recorded health
                    information. They provide an organised view of Daily
                    Care observations and Health Assessments, helping you
                    monitor progress over time.
                </p>

            </section>

            {/* Available Reports */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Available Reports
                </h3>

                <ul style={listStyle}>
                    <li>Daily Care Reports</li>
                    <li>Self Assessment Reports</li>
                    <li>Family Assessment Reports</li>
                    <li>Clinical Trends</li>
                </ul>

            </section>

            {/* Using Reports */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    How to Use Reports
                </h3>

                <ol style={listStyle}>

                    <li>Select the required patient.</li>

                    <li>Choose the report you want to view.</li>

                    <li>Review previous observations and assessments.</li>

                    <li>Use Clinical Trends to analyse changes over time.</li>

                    <li>Generate a PDF report if required.</li>

                </ol>

            </section>

            {/* Benefits */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Why Reports are Useful
                </h3>

                <ul style={listStyle}>

                    <li>Review previous health observations.</li>

                    <li>Identify gradual improvements or deterioration.</li>

                    <li>Prepare for doctor consultations.</li>

                    <li>Maintain a structured health history.</li>

                </ul>

            </section>

            {/* Tips */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Helpful Tips
                </h3>

                <ul style={listStyle}>

                    <li>Record Daily Care regularly for meaningful reports.</li>

                    <li>Complete assessments consistently.</li>

                    <li>Use Clinical Trends for visual analysis.</li>

                    <li>Download PDF reports before hospital visits.</li>

                </ul>

            </section>

            {/* Next */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Next Step
                </h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Clinical Trends</strong> to learn
                    how CareVR visualises health information using charts
                    and summary statistics.
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
    marginBottom: 0,
};

const listStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 2,
    paddingLeft: "24px",
    marginBottom: 0,
};
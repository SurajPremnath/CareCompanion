import HelpBackButton from "@/Components/help/HelpBackButton";

export default function ClinicalTrendsPage() {
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
                📈 Clinical Trends
            </h2>

            {/* Overview */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Overview
                </h3>

                <p style={paragraphStyle}>
                    Clinical Trends helps you understand how a patient's
                    health measurements change over time. It transforms
                    daily observations into charts and summary statistics,
                    making it easier to identify improvements, deterioration
                    or unusual patterns.
                </p>

            </section>

            {/* Available Parameters */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Available Parameters
                </h3>

                <ul style={listStyle}>
                    <li>Temperature</li>
                    <li>Blood Pressure</li>
                    <li>Pulse Rate</li>
                    <li>Blood Oxygen Saturation (SpO₂)</li>
                </ul>

            </section>

            {/* How to Use */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    How to Use Clinical Trends
                </h3>

                <ol style={listStyle}>

                    <li>Select the patient.</li>

                    <li>Select the reporting period.</li>

                    <li>Select one or more health parameters.</li>

                    <li>Generate the trend charts.</li>

                    <li>Review the charts and summary statistics.</li>

                    <li>Download the report as a PDF if required.</li>

                </ol>

            </section>

            {/* Understanding Statistics */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Understanding Summary Statistics
                </h3>

                <ul style={listStyle}>

                    <li><strong>Current</strong> – Latest recorded value.</li>

                    <li><strong>Minimum</strong> – Lowest recorded value during the selected period.</li>

                    <li><strong>Maximum</strong> – Highest recorded value during the selected period.</li>

                    <li><strong>Average</strong> – Average value for the selected period.</li>

                </ul>

            </section>

            {/* Trend Charts */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Reading Trend Charts
                </h3>

                <p style={paragraphStyle}>
                    Each chart displays how a health parameter changes over
                    time. Reviewing trends regularly helps identify gradual
                    improvements or worsening conditions and supports
                    informed discussions with healthcare professionals.
                </p>

            </section>

            {/* Helpful Tips */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Helpful Tips
                </h3>

                <ul style={listStyle}>

                    <li>Record observations regularly for meaningful trends.</li>

                    <li>Compare values over different reporting periods.</li>

                    <li>Review charts together with healthcare professionals.</li>

                    <li>Use PDF reports for consultations and follow-up visits.</li>

                </ul>

            </section>

            {/* Next */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Next Step
                </h3>

                <p style={paragraphStyle}>
                    Continue to <strong>PDF Reports</strong> to learn how
                    to generate and share professional clinical reports.
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
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
                <h3 style={headingStyle}>What are Clinical Trends?</h3>

                <p style={paragraphStyle}>
                    Clinical Trends transforms your recorded health data into
                    meaningful visual insights. Instead of looking at
                    individual readings, you can understand how a patient's
                    health changes over days, weeks or months.
                </p>

                <p style={paragraphStyle}>
                    By identifying patterns and changes over time, Clinical
                    Trends helps patients, caregivers and healthcare
                    professionals make more informed decisions.
                </p>
            </section>

            {/* Data Source */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where Does the Data Come From?</h3>

                <p style={paragraphStyle}>
                    Clinical Trends automatically uses information recorded
                    through Daily Care. Every health observation contributes
                    to building a meaningful clinical history.
                </p>

                <p style={paragraphStyle}>
                    The more consistently Daily Care is recorded, the more
                    valuable and informative your trend analysis becomes.
                </p>
            </section>

            {/* Available Parameters */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Available Health Parameters</h3>

                <ul style={listStyle}>
                    <li>Body Temperature</li>
                    <li>Blood Pressure</li>
                    <li>Pulse Rate</li>
                    <li>Blood Oxygen Saturation (SpO₂)</li>
                    <li>Weight</li>
                </ul>
            </section>

            {/* Generate */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Generating Clinical Trends</h3>

                <ol style={listStyle}>
                    <li>Select yourself or a family member.</li>
                    <li>Select the patient.</li>
                    <li>Choose the reporting period.</li>
                    <li>Select one or more health parameters.</li>
                    <li>Generate the trend analysis.</li>
                    <li>Review charts and summary statistics.</li>
                    <li>Download a PDF report if required.</li>
                </ol>
            </section>

            {/* Statistics */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Understanding Summary Statistics</h3>

                <ul style={listStyle}>
                    <li>
                        <strong>Current</strong> — Most recent recorded value.
                    </li>

                    <li>
                        <strong>Minimum</strong> — Lowest value during the
                        selected period.
                    </li>

                    <li>
                        <strong>Maximum</strong> — Highest value during the
                        selected period.
                    </li>

                    <li>
                        <strong>Average</strong> — Average value across the
                        selected period.
                    </li>
                </ul>
            </section>

            {/* Charts */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Reading Trend Charts</h3>

                <p style={paragraphStyle}>
                    Trend charts provide a visual representation of changes in
                    health measurements over time, making it easier to
                    recognize gradual improvements, deterioration or unusual
                    variations that may otherwise go unnoticed.
                </p>
            </section>

            {/* Benefits */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Benefits of Clinical Trends</h3>

                <ul style={listStyle}>
                    <li>Monitor progress over time.</li>
                    <li>Identify gradual health changes.</li>
                    <li>Support continuity of care.</li>
                    <li>Prepare for healthcare consultations.</li>
                    <li>Track recovery after treatment.</li>
                    <li>Generate professional clinical reports.</li>
                </ul>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Record Daily Care consistently.</li>
                    <li>Use the same monitoring devices whenever possible.</li>
                    <li>Compare trends across different time periods.</li>
                    <li>Review charts together with your healthcare professional.</li>
                    <li>Use PDF reports during consultations.</li>
                </ul>
            </section>

            {/* Important */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Information</h3>

                <p style={paragraphStyle}>
                    Clinical Trends helps visualize recorded healthcare data
                    and should be used as a decision-support tool. It does
                    not diagnose medical conditions or replace professional
                    medical advice.
                </p>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Reports</strong> to learn how Clinical
                    Trends, Daily Care records and Health Assessments work
                    together to create comprehensive healthcare reports.
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
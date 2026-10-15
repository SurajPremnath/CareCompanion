import HelpBackButton from "@/Components/help/HelpBackButton";

export default function PdfReportsPage() {
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
                📑 PDF Reports
            </h2>

            {/* Overview */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Professional Healthcare Reports</h3>

                <p style={paragraphStyle}>
                    CareVR allows you to generate professional PDF reports
                    that consolidate health information into an easy-to-read
                    document suitable for consultations, follow-up visits and
                    maintaining a personal healthcare record.
                </p>

                <p style={paragraphStyle}>
                    Reports are automatically generated using information
                    recorded within CareVR, helping reduce manual effort while
                    presenting healthcare information in a structured format.
                </p>
            </section>

            {/* Report Types */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Available Reports</h3>

                <ul style={listStyle}>
                    <li>Daily Care Reports</li>
                    <li>Health Assessment Reports</li>
                    <li>Clinical Trends Reports</li>
                    <li>Health Timeline Reports (where available)</li>
                </ul>
            </section>

            {/* Report Contents */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What Does a Report Include?</h3>

                <ul style={listStyle}>
                    <li>Patient information</li>
                    <li>Report period</li>
                    <li>Date and time of generation</li>
                    <li>Recorded health observations</li>
                    <li>Health assessment results</li>
                    <li>Clinical trend charts</li>
                    <li>Summary statistics</li>
                    <li>CareVR report branding</li>
                    <li>Medical disclaimer</li>
                </ul>
            </section>

            {/* Generate */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Generating a Report</h3>

                <ol style={listStyle}>
                    <li>Open the appropriate Reports or Clinical Trends section.</li>
                    <li>Select yourself or a family member.</li>
                    <li>Select the patient.</li>
                    <li>Choose the required reporting period.</li>
                    <li>Review the information displayed.</li>
                    <li>Generate the PDF report.</li>
                    <li>Download or share the report as required.</li>
                </ol>
            </section>

            {/* Why */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Why Use PDF Reports?</h3>

                <ul style={listStyle}>
                    <li>Prepare for doctor consultations.</li>
                    <li>Share organized healthcare information.</li>
                    <li>Maintain printable healthcare records.</li>
                    <li>Track health progress over time.</li>
                    <li>Reduce the need to explain historical information repeatedly.</li>
                </ul>
            </section>

            {/* Sharing */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Sharing Reports</h3>

                <p style={paragraphStyle}>
                    Reports can be shared with healthcare professionals,
                    caregivers or family members whenever appropriate. Always
                    review the report before sharing to ensure the information
                    is complete and relevant.
                </p>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Record Daily Care regularly for meaningful reports.</li>
                    <li>Complete Health Assessments consistently.</li>
                    <li>Review reports before every consultation.</li>
                    <li>Generate fresh reports whenever new observations are added.</li>
                    <li>Share only with trusted healthcare professionals and caregivers.</li>
                </ul>
            </section>

            {/* Important */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Information</h3>

                <p style={paragraphStyle}>
                    PDF reports summarize healthcare information that has been
                    recorded within CareVR. They are intended to support
                    communication with healthcare professionals and should not
                    be considered a substitute for professional medical advice,
                    diagnosis or treatment.
                </p>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue to the <strong>Frequently Asked Questions</strong>
                    section for answers to common questions about using
                    CareVR and its features.
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
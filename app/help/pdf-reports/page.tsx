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

                <h3 style={headingStyle}>
                    Overview
                </h3>

                <p style={paragraphStyle}>
                    CareVR allows you to generate professional PDF reports
                    that summarise a patient's health observations over a
                    selected period. These reports are designed to be easily
                    shared with healthcare professionals during consultations.
                </p>

            </section>

            {/* What's Included */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    What is Included?
                </h3>

                <ul style={listStyle}>
                    <li>Patient Information</li>
                    <li>Report Period</li>
                    <li>Generated Date and Time</li>
                    <li>Selected Parameters</li>
                    <li>Summary Statistics</li>
                    <li>Trend Charts</li>
                    <li>CareVR Branding</li>
                    <li>Disclaimer</li>
                </ul>

            </section>

            {/* Generate */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    How to Generate a PDF
                </h3>

                <ol style={listStyle}>

                    <li>Open Clinical Trends.</li>

                    <li>Select the patient.</li>

                    <li>Select the reporting period.</li>

                    <li>Select one or more health parameters.</li>

                    <li>Review the generated charts.</li>

                    <li>Click <strong>Download PDF</strong>.</li>

                </ol>

            </section>

            {/* Why Use PDF */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Why Generate a PDF?
                </h3>

                <ul style={listStyle}>

                    <li>Share health information with doctors.</li>

                    <li>Maintain a printable health record.</li>

                    <li>Track changes over time.</li>

                    <li>Keep organised documentation for future consultations.</li>

                </ul>

            </section>

            {/* Tips */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Helpful Tips
                </h3>

                <ul style={listStyle}>

                    <li>Select an appropriate reporting period.</li>

                    <li>Include only the parameters relevant to your consultation.</li>

                    <li>Review the PDF before sharing.</li>

                    <li>Generate updated reports whenever new observations are recorded.</li>

                </ul>

            </section>

            {/* Next */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Next Step
                </h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Frequently Asked Questions</strong>
                    to find answers to the most common questions about
                    using CareVR.
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
import HelpBackButton from "@/Components/help/HelpBackButton";
export default function AboutPage() {
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
                ℹ️ About CareVR
            </h2>

            {/* About */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    What is CareVR?
                </h3>

                <p style={paragraphStyle}>
                    CareVR is a healthcare companion designed to help
                    patients, families and caregivers maintain organized
                    health records through simple daily observations,
                    structured assessments and professional clinical
                    reports.
                </p>

                <p style={paragraphStyle}>
                    The goal of CareVR is to make it easier to understand
                    health information and support more informed
                    conversations with healthcare professionals.
                </p>

            </section>

            {/* Features */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Key Features
                </h3>

                <ul style={listStyle}>
                    <li>Patient Management</li>
                    <li>Daily Care Recording</li>
                    <li>Self Assessment</li>
                    <li>Family Assessment</li>
                    <li>Historical Reports</li>
                    <li>Clinical Trends</li>
                    <li>Professional PDF Reports</li>
                    <li>Help Centre Documentation</li>
                </ul>

            </section>

            {/* Vision */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Our Vision
                </h3>

                <p style={paragraphStyle}>
                    We believe that healthcare information should be simple,
                    organized and easy to understand. CareVR is built to
                    help individuals and families keep meaningful health
                    records that support continuity of care and better
                    clinical conversations.
                </p>

            </section>

            {/* Version */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Version Information
                </h3>

                <p style={paragraphStyle}>
                    <strong>Application:</strong> CareVR
                </p>

                <p style={paragraphStyle}>
                    <strong>Version:</strong> 1.0
                </p>

                <p style={paragraphStyle}>
                    <strong>Release:</strong> Initial Public Release
                </p>

            </section>

            {/* Disclaimer */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Medical Disclaimer
                </h3>

                <p style={paragraphStyle}>
                    CareVR is intended to support health record keeping and
                    improve communication between patients, caregivers and
                    healthcare professionals. It is not intended to replace
                    professional medical advice, diagnosis or treatment.
                    Always seek guidance from a qualified healthcare
                    professional regarding medical concerns.
                </p>

            </section>

            {/* Copyright */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Copyright
                </h3>

                <p style={paragraphStyle}>
                    © 2026 CareVR. All rights reserved.
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
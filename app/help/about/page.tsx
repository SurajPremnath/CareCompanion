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

            {/* What is CareVR */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What is CareVR?</h3>

                <p style={paragraphStyle}>
                    CareVR is an AI-powered healthcare companion designed to
                    help individuals, families and caregivers securely record,
                    organize, understand and share healthcare information.
                </p>

                <p style={paragraphStyle}>
                    Whether managing your own health or caring for a loved one,
                    CareVR brings together daily observations, medications,
                    prescriptions, assessments, reports and clinical trends
                    into one organized platform.
                </p>

                <p style={paragraphStyle}>
                    Our objective is simple—make healthcare information easier
                    to manage so users can focus more on care and less on
                    paperwork.
                </p>
            </section>

            {/* Vision */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Our Vision</h3>

                <p style={paragraphStyle}>
                    To make healthcare information simple, accessible and
                    meaningful for every patient, caregiver and family through
                    intelligent digital healthcare solutions.
                </p>
            </section>

            {/* Mission */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Our Mission</h3>

                <p style={paragraphStyle}>
                    We aim to simplify everyday healthcare by providing secure,
                    intelligent and easy-to-use tools that help users record,
                    understand and share important health information with
                    confidence.
                </p>
            </section>

            {/* Core Principles */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Our Principles</h3>

                <ul style={listStyle}>
                    <li>Simplicity First</li>
                    <li>Privacy by Design</li>
                    <li>AI with Human Oversight</li>
                    <li>Accessibility for Everyone</li>
                    <li>Mobile-First Experience</li>
                    <li>Localization First</li>
                    <li>Continuity of Care</li>
                    <li>Security and Trust</li>
                </ul>
            </section>

            {/* Core Features */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Core Capabilities</h3>

                <ul style={listStyle}>
                    <li>Patient & Family Management</li>
                    <li>Daily Health Recording</li>
                    <li>Medication Management</li>
                    <li>Prescription Management</li>
                    <li>Self & Family Health Assessments</li>
                    <li>Clinical Trends</li>
                    <li>Historical Reports</li>
                    <li>Professional PDF Reports</li>
                    <li>Health Timeline</li>
                    <li>AI-assisted Healthcare Features</li>
                </ul>
            </section>

            {/* AI */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Artificial Intelligence</h3>

                <p style={paragraphStyle}>
                    CareVR uses Artificial Intelligence to help simplify health
                    record management. AI capabilities assist users in
                    organizing information, understanding prescriptions,
                    generating summaries and improving access to healthcare
                    information.
                </p>

                <p style={paragraphStyle}>
                    AI recommendations are intended to assist users and should
                    always be interpreted alongside advice from qualified
                    healthcare professionals.
                </p>
            </section>

            {/* Privacy */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Privacy & Security</h3>

                <p style={paragraphStyle}>
                    Protecting health information is a core design principle of
                    CareVR. The platform is designed with authenticated access,
                    secure data handling and responsible sharing of healthcare
                    information with authorized users.
                </p>
            </section>

            {/* Version */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Version Information</h3>

                <p style={paragraphStyle}>
                    <strong>Application:</strong> CareVR
                </p>

                <p style={paragraphStyle}>
                    <strong>Version:</strong> 1.0
                </p>

                <p style={paragraphStyle}>
                    <strong>Release:</strong> Public Preview
                </p>

                <p style={paragraphStyle}>
                    <strong>Platform:</strong> Web Application
                </p>
            </section>

            {/* Roadmap */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Looking Ahead</h3>

                <p style={paragraphStyle}>
                    CareVR will continue evolving with intelligent medication
                    management, voice interactions, wearable integrations,
                    healthcare provider collaboration, AI-powered assistance
                    and deeper clinical insights to further simplify healthcare
                    management.
                </p>
            </section>

            {/* Disclaimer */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Medical Disclaimer</h3>

                <p style={paragraphStyle}>
                    CareVR is intended to support health record keeping and
                    improve communication between patients, caregivers and
                    healthcare professionals. It is not intended to replace
                    professional medical advice, diagnosis or treatment.
                    Always consult a qualified healthcare professional for
                    medical decisions.
                </p>
            </section>

            {/* Copyright */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Copyright</h3>

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
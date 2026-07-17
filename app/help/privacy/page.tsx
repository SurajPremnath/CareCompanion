import HelpBackButton from "@/Components/help/HelpBackButton";

export default function PrivacyPage() {
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
                🔒 Privacy & Security
            </h2>

            {/* Privacy Commitment */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Our Commitment to Privacy</h3>

                <p style={paragraphStyle}>
                    At CareVR, protecting your personal and health information
                    is one of our highest priorities. We believe you should
                    remain in control of your healthcare information while
                    benefiting from secure, intelligent healthcare tools.
                </p>

                <p style={paragraphStyle}>
                    CareVR is designed with privacy, security and responsible
                    handling of health information at the core of every feature.
                </p>
            </section>

            {/* Health Information */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Health Information We Store</h3>

                <p style={paragraphStyle}>
                    Depending on how you use CareVR, you may choose to record:
                </p>

                <ul style={listStyle}>
                    <li>Patient information</li>
                    <li>Daily health observations</li>
                    <li>Vital signs</li>
                    <li>Symptoms and notes</li>
                    <li>Medications and prescriptions</li>
                    <li>Health assessments</li>
                    <li>Clinical trends</li>
                    <li>Generated reports</li>
                </ul>
            </section>

            {/* How Information is Used */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>How Your Information is Used</h3>

                <p style={paragraphStyle}>
                    Information recorded within CareVR is used to help you:
                </p>

                <ul style={listStyle}>
                    <li>Maintain organized health records.</li>
                    <li>Monitor health over time.</li>
                    <li>Generate meaningful reports.</li>
                    <li>Prepare for doctor consultations.</li>
                    <li>Better understand healthcare information.</li>
                </ul>
            </section>

            {/* Security */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Security</h3>

                <p style={paragraphStyle}>
                    CareVR uses authenticated user access to help ensure that
                    health information is available only to authorized users.
                    Security measures are incorporated throughout the platform
                    to protect sensitive healthcare information.
                </p>
            </section>

            {/* AI */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Artificial Intelligence</h3>

                <p style={paragraphStyle}>
                    Certain CareVR features may use Artificial Intelligence to
                    assist with organizing healthcare information,
                    understanding prescriptions, generating summaries and
                    improving user experience.
                </p>

                <p style={paragraphStyle}>
                    AI-generated information is intended to assist users and
                    should always be reviewed alongside professional medical
                    advice.
                </p>
            </section>

            {/* Sharing */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Sharing Information</h3>

                <p style={paragraphStyle}>
                    CareVR allows you to generate reports that you may choose
                    to share with doctors, hospitals, caregivers or family
                    members. You remain responsible for deciding when and with
                    whom information is shared.
                </p>
            </section>

            {/* Your Responsibilities */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Your Responsibilities</h3>

                <ul style={listStyle}>
                    <li>Keep your account credentials secure.</li>
                    <li>Verify health information before saving.</li>
                    <li>Review reports before sharing them.</li>
                    <li>Sign out when using shared devices.</li>
                    <li>Keep your contact information up to date.</li>
                </ul>
            </section>

            {/* Important Notice */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Notice</h3>

                <p style={paragraphStyle}>
                    While CareVR is designed to help organize healthcare
                    information, no digital system can completely eliminate
                    risk. Users should always exercise appropriate care when
                    handling personal healthcare information.
                </p>
            </section>

            {/* Medical Disclaimer */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Medical Disclaimer</h3>

                <p style={paragraphStyle}>
                    CareVR is intended to support healthcare record keeping,
                    communication and continuity of care. It is not intended
                    to diagnose, treat or replace professional medical advice,
                    diagnosis or treatment. Always consult a qualified
                    healthcare professional regarding medical concerns.
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
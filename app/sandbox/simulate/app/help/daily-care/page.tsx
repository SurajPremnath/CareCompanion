import HelpBackButton from "@/Components/help/HelpBackButton";

export default function DailyCarePage() {
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
                ❤️ Daily Care
            </h2>

            {/* Overview */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What is Daily Care?</h3>

                <p style={paragraphStyle}>
                    Daily Care is the heart of CareVR. It helps you maintain a
                    structured record of a person's day-to-day health,
                    enabling better monitoring, continuity of care and more
                    informed discussions with healthcare professionals.
                </p>

                <p style={paragraphStyle}>
                    You can record as much or as little information as is
                    available. Every entry contributes to your patient's
                    health history and clinical trends.
                </p>
            </section>

            {/* Information */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What Can You Record?</h3>

                <ul style={listStyle}>
                    <li>Body Temperature</li>
                    <li>Blood Pressure</li>
                    <li>Pulse Rate</li>
                    <li>Blood Oxygen Saturation (SpO₂)</li>
                    <li>Weight</li>
                    <li>Symptoms</li>
                    <li>Pain & Pain Location</li>
                    <li>Energy Levels</li>
                    <li>Appetite</li>
                    <li>Water Intake</li>
                    <li>Walking Difficulty</li>
                    <li>Loose Motions</li>
                    <li>Medications Taken</li>
                    <li>Additional Notes</li>
                </ul>
            </section>

            {/* Recording */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Recording Daily Health</h3>

                <ol style={listStyle}>
                    <li>Select yourself or a family member.</li>
                    <li>Choose the patient.</li>
                    <li>Record the available health observations.</li>
                    <li>Add medications taken, if applicable.</li>
                    <li>Include important notes or observations.</li>
                    <li>Review the information.</li>
                    <li>Save the record.</li>
                </ol>
            </section>

            {/* Flexible */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Flexible Data Entry</h3>

                <p style={paragraphStyle}>
                    Daily Care is designed to work with whatever information
                    you have available. You are not required to complete every
                    field during each recording session.
                </p>

                <p style={paragraphStyle}>
                    Over time, these individual observations build a valuable
                    health history that can help identify changes and support
                    clinical decision-making.
                </p>
            </section>

            {/* AI */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>AI Assistance</h3>

                <p style={paragraphStyle}>
                    CareVR incorporates Artificial Intelligence to simplify
                    health recording. Depending on the available features,
                    AI can assist with interpreting prescriptions,
                    organizing healthcare information, generating summaries
                    and improving the overall recording experience.
                </p>
            </section>

            {/* Reports */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>How Daily Care is Used</h3>

                <ul style={listStyle}>
                    <li>Creates your health history.</li>
                    <li>Supports Clinical Trends.</li>
                    <li>Generates professional reports.</li>
                    <li>Builds your Health Timeline.</li>
                    <li>Helps prepare for doctor consultations.</li>
                </ul>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Record observations consistently.</li>
                    <li>Use the same monitoring devices whenever possible.</li>
                    <li>Record symptoms even when vital signs appear normal.</li>
                    <li>Update medication information regularly.</li>
                    <li>Use notes to capture anything unusual.</li>
                    <li>Review reports before healthcare appointments.</li>
                </ul>
            </section>

            {/* Important */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Information</h3>

                <p style={paragraphStyle}>
                    CareVR is intended to support health record keeping and
                    continuity of care. It is not intended to diagnose,
                    treat or replace professional medical advice. Always
                    consult a qualified healthcare professional regarding
                    medical concerns.
                </p>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Health Assessments</strong> to learn
                    how Self Assessments and Family Assessments complement
                    your Daily Care records and provide a broader view of
                    overall health.
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
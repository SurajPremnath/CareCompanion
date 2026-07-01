export default function DailyCarePage() {
    return (
        <>

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

                <h3 style={headingStyle}>
                    Overview
                </h3>

                <p style={paragraphStyle}>
                    Daily Care allows you to record important health
                    observations for a patient. Recording information
                    consistently helps identify trends and supports better
                    clinical discussions with healthcare professionals.
                </p>

            </section>

            {/* What Can Be Recorded */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    What can be recorded?
                </h3>

                <ul style={listStyle}>
                    <li>Body Temperature</li>
                    <li>Blood Pressure</li>
                    <li>Pulse Rate</li>
                    <li>Blood Oxygen Saturation (SpO₂)</li>
                    <li>Symptoms</li>
                    <li>Pain Locations</li>
                    <li>Medications</li>
                    <li>Clinical Notes</li>
                </ul>

            </section>

            {/* Recording Daily Care */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    How to record Daily Care
                </h3>

                <ol style={listStyle}>

                    <li>Select the patient.</li>

                    <li>
                        Enter the available health observations.
                    </li>

                    <li>
                        Record only values that are available. You are not
                        required to complete every field.
                    </li>

                    <li>
                        Add medications or important notes if applicable.
                    </li>

                    <li>
                        Review the information before saving.
                    </li>

                    <li>
                        Tap <strong>Save</strong> to store the observations.
                    </li>

                </ol>

            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Best Practices
                </h3>

                <ul style={listStyle}>

                    <li>
                        Record observations at approximately the same time
                        every day whenever possible.
                    </li>

                    <li>
                        Use the same thermometer and monitoring devices for
                        consistent readings.
                    </li>

                    <li>
                        Record symptoms even if vital signs are normal.
                    </li>

                    <li>
                        Keep notes concise and clinically meaningful.
                    </li>

                </ul>

            </section>

            {/* Important */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Important
                </h3>

                <p style={paragraphStyle}>
                    CareVR is designed to help organize health information.
                    It does not replace professional medical advice,
                    diagnosis or treatment. Always consult a qualified
                    healthcare professional regarding medical concerns.
                </p>

            </section>

            {/* Next */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Next Step
                </h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Health Assessments</strong> to learn
                    how Self Assessment and Family Assessment help monitor
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
    marginBottom: 0,
};

const listStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 2,
    paddingLeft: "24px",
    marginBottom: 0,
};
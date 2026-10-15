import HelpBackButton from "@/Components/help/HelpBackButton";

export default function AssessmentsPage() {
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
                🩺 Health Assessments
            </h2>

            {/* Overview */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What are Health Assessments?</h3>

                <p style={paragraphStyle}>
                    Health Assessments help you capture a person's overall
                    wellbeing through a structured set of questions. Rather
                    than recording only vital signs, assessments focus on how
                    the individual is feeling and functioning on a day-to-day
                    basis.
                </p>

                <p style={paragraphStyle}>
                    When completed regularly, assessments provide valuable
                    insights into changes in health and complement your Daily
                    Care records.
                </p>
            </section>

            {/* Assessment Types */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Assessment Types</h3>

                <h4 style={subHeadingStyle}>Self Assessment</h4>

                <p style={paragraphStyle}>
                    Used when individuals answer questions about their own
                    health, symptoms and wellbeing.
                </p>

                <h4
                    style={{
                        ...subHeadingStyle,
                        marginTop: "24px",
                    }}
                >
                    Family Assessment
                </h4>

                <p style={paragraphStyle}>
                    Used when a family member or caregiver records observations
                    on behalf of another person who may not be able to complete
                    the assessment themselves.
                </p>
            </section>

            {/* What is Evaluated */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What is Evaluated?</h3>

                <ul style={listStyle}>
                    <li>Breathing</li>
                    <li>Cough</li>
                    <li>Blood in Cough</li>
                    <li>Body Temperature</li>
                    <li>Energy Levels</li>
                    <li>Appetite</li>
                    <li>Water Intake</li>
                    <li>Pain</li>
                    <li>Pain Location</li>
                    <li>Walking Difficulty</li>
                    <li>Loose Motions</li>
                </ul>
            </section>

            {/* Assessment Process */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Completing an Assessment</h3>

                <ol style={listStyle}>
                    <li>Select Self Assessment or Family Assessment.</li>
                    <li>Select the appropriate patient.</li>
                    <li>Answer each question carefully.</li>
                    <li>Provide additional information where requested.</li>
                    <li>Review your responses.</li>
                    <li>Submit the assessment.</li>
                </ol>
            </section>

            {/* Results */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Understanding Your Results</h3>

                <p style={paragraphStyle}>
                    After submission, CareVR evaluates your responses and
                    generates an overall assessment score along with an easy to
                    understand health status.
                </p>

                <p style={paragraphStyle}>
                    These results help identify changes over time and work
                    alongside Daily Care records to provide a broader picture
                    of overall health.
                </p>
            </section>

            {/* Trends */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Assessment History</h3>

                <p style={paragraphStyle}>
                    Every completed assessment becomes part of your health
                    history. Previous assessments can be reviewed through
                    Reports and compared over time to identify meaningful
                    changes in health and wellbeing.
                </p>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Complete assessments regularly.</li>
                    <li>Answer every question honestly.</li>
                    <li>Use the same person to complete Family Assessments whenever possible.</li>
                    <li>Review assessment history alongside Daily Care records.</li>
                    <li>Consult your healthcare professional if symptoms worsen.</li>
                </ul>
            </section>

            {/* Important */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Information</h3>

                <p style={paragraphStyle}>
                    Health Assessments are intended to support ongoing health
                    monitoring and continuity of care. They should not be used
                    as a substitute for professional medical advice,
                    diagnosis or treatment.
                </p>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Reports</strong> to learn how Daily
                    Care records, Assessment history and Clinical Trends work
                    together to provide a complete picture of health over time.
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

const subHeadingStyle: React.CSSProperties = {
    marginBottom: "8px",
    color: "#111827",
    fontSize: "18px",
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
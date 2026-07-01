export default function AssessmentsPage() {
    return (
        <>

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

                <h3 style={headingStyle}>
                    Overview
                </h3>

                <p style={paragraphStyle}>
                    CareVR provides structured health assessments to help
                    monitor a person's overall health and wellbeing. These
                    assessments are intended to support daily monitoring and
                    facilitate meaningful conversations with healthcare
                    professionals.
                </p>

            </section>

            {/* Assessment Types */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Assessment Types
                </h3>

                <h4 style={subHeadingStyle}>
                    Self Assessment
                </h4>

                <p style={paragraphStyle}>
                    Used when individuals record their own health
                    observations and answer assessment questions based on
                    how they are feeling.
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
                    Used when a family member or caregiver completes the
                    assessment on behalf of another person.
                </p>

            </section>

            {/* Assessment Questions */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    What is assessed?
                </h3>

                <ul style={listStyle}>
                    <li>Breathing</li>
                    <li>Cough</li>
                    <li>Blood in Cough</li>
                    <li>Body Temperature</li>
                    <li>Energy Levels</li>
                    <li>Appetite</li>
                    <li>Water Intake</li>
                    <li>Pain</li>
                    <li>Walking Ability</li>
                    <li>Loose Motions</li>
                </ul>

            </section>

            {/* Results */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Understanding the Results
                </h3>

                <p style={paragraphStyle}>
                    After completing an assessment, CareVR calculates an
                    overall health score and classifies the result into an
                    easy-to-understand category. The results help identify
                    changes over time but should always be interpreted in
                    conjunction with clinical advice.
                </p>

            </section>

            {/* Tips */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Helpful Tips
                </h3>

                <ul style={listStyle}>
                    <li>Answer each question honestly.</li>
                    <li>Complete assessments regularly.</li>
                    <li>Compare results over time using Reports.</li>
                    <li>Seek medical advice if symptoms worsen.</li>
                </ul>

            </section>

            {/* Next */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Next Step
                </h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Reports</strong> to learn how to
                    review previous Daily Care records and Assessment
                    history.
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
    marginBottom: 0,
};

const listStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 2,
    paddingLeft: "24px",
    marginBottom: 0,
};
import HelpBackButton from "@/Components/help/HelpBackButton";

export default function GettingStartedPage() {
    return (
        <>
            <HelpBackButton />

            {/* Title */}

            <h2
                style={{
                    fontSize: "30px",
                    marginBottom: "24px",
                    color: "#111827",
                }}
            >
                🚀 Getting Started
            </h2>

            {/* Welcome */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Welcome to CareVR</h3>

                <p style={paragraphStyle}>
                    Welcome to CareVR, your AI-powered healthcare companion.
                    CareVR helps you securely record, organize and understand
                    health information for yourself or your loved ones.
                </p>

                <p style={paragraphStyle}>
                    Whether you are monitoring a chronic condition, recovering
                    from an illness or simply maintaining a personal health
                    record, CareVR makes it easier to keep everything together
                    in one place.
                </p>
            </section>

            {/* Who is CareVR for? */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Who is CareVR for?</h3>

                <ul style={listStyle}>
                    <li>Individuals managing their own health.</li>
                    <li>Family members caring for loved ones.</li>
                    <li>Caregivers supporting patients.</li>
                    <li>People managing long-term medical conditions.</li>
                    <li>Anyone wanting better organized health records.</li>
                </ul>
            </section>

            {/* Getting Started */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Getting Started</h3>

                <ol style={listStyle}>
                    <li>Create your CareVR account.</li>
                    <li>Sign in securely.</li>
                    <li>Add yourself or a family member.</li>
                    <li>Explore the Dashboard.</li>
                    <li>Begin recording health information.</li>
                </ol>
            </section>

            {/* Your Healthcare Journey */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Your Healthcare Journey</h3>

                <ol style={listStyle}>
                    <li>Add yourself or a family member.</li>
                    <li>Record daily health observations.</li>
                    <li>Track medications and prescriptions.</li>
                    <li>Complete health assessments.</li>
                    <li>Review reports and health history.</li>
                    <li>Monitor clinical trends.</li>
                    <li>Generate PDF reports for doctor consultations.</li>
                </ol>
            </section>

            {/* Recording Health */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Recording Daily Health</h3>

                <p style={paragraphStyle}>
                    CareVR allows you to record important daily health
                    information including temperature, blood pressure, pulse,
                    oxygen saturation, symptoms, medications and notes.
                </p>

                <p style={paragraphStyle}>
                    Recording information consistently helps build a meaningful
                    health history that can support better healthcare
                    decisions.
                </p>
            </section>

            {/* Health Assessments */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Health Assessments</h3>

                <p style={paragraphStyle}>
                    CareVR includes structured Self Assessments and Family
                    Assessments that help identify changes in overall health
                    and wellbeing using guided questionnaires.
                </p>
            </section>

            {/* Reports */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Reports & Clinical Trends</h3>

                <p style={paragraphStyle}>
                    Every health record contributes to historical reports and
                    clinical trends, allowing you to review progress over time
                    and prepare for healthcare consultations.
                </p>
            </section>

            {/* AI */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>AI Assistance</h3>

                <p style={paragraphStyle}>
                    CareVR uses Artificial Intelligence to help organize health
                    information, understand prescriptions and improve the way
                    healthcare information is presented. AI is designed to
                    assist users and does not replace professional medical
                    advice.
                </p>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Record health information regularly.</li>
                    <li>Review reports before doctor consultations.</li>
                    <li>Keep medication information up to date.</li>
                    <li>Record observations as accurately as possible.</li>
                    <li>Use notes to capture important symptoms or concerns.</li>
                </ul>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue exploring the Help Centre to learn more about
                    Daily Care, Medication Management, Reports, Clinical
                    Trends, Privacy and Frequently Asked Questions.
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
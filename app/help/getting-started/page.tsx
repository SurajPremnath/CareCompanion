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

            {/* Overview */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Overview
                </h3>

                <p style={paragraphStyle}>
                    CareVR is a simple healthcare application designed to
                    help patients and caregivers record daily health
                    observations, complete health assessments and review
                    clinical reports. The application keeps all important
                    health information together so it can be easily shared
                    during doctor consultations.
                </p>

            </section>

            {/* Who Should Use */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Who should use CareVR?
                </h3>

                <ul style={listStyle}>
                    <li>Patients monitoring their own health.</li>
                    <li>Family members caring for loved ones.</li>
                    <li>Caregivers recording daily observations.</li>
                    <li>Healthcare professionals reviewing reports.</li>
                </ul>

            </section>

            {/* Before You Begin */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Before You Begin
                </h3>

                <ul style={listStyle}>
                    <li>Create your CareVR account.</li>
                    <li>Sign in using your registered email.</li>
                    <li>Add a patient before recording Daily Care.</li>
                    <li>Review the Dashboard to understand the available features.</li>
                </ul>

            </section>

            {/* First Steps */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    First Steps
                </h3>

                <ol style={listStyle}>

                    <li>Add a patient.</li>

                    <li>
                        Record Daily Care observations such as temperature,
                        blood pressure, pulse and oxygen saturation.
                    </li>

                    <li>
                        Complete a Self Assessment or Family Assessment.
                    </li>

                    <li>
                        Review Reports to see previous observations.
                    </li>

                    <li>
                        Open Clinical Trends to visualize changes over time.
                    </li>

                    <li>
                        Generate a PDF report when sharing information
                        with a healthcare professional.
                    </li>

                </ol>

            </section>

            {/* Helpful Tips */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Helpful Tips
                </h3>

                <ul style={listStyle}>

                    <li>
                        Record health observations at approximately the same
                        time every day.
                    </li>

                    <li>
                        Enter values carefully before saving.
                    </li>

                    <li>
                        Keep notes short but meaningful.
                    </li>

                    <li>
                        Review Clinical Trends regularly to identify changes.
                    </li>

                </ul>

            </section>

            {/* Next */}

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    Next Step
                </h3>

                <p style={paragraphStyle}>
                    Continue to the <strong>Daily Care</strong> section to
                    learn how to record daily health observations.
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
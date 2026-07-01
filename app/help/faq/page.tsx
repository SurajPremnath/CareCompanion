import HelpBackButton from "@/Components/help/HelpBackButton";

export default function FaqPage() {
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
                ❓ Frequently Asked Questions
            </h2>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    1. What is CareVR?
                </h3>

                <p style={paragraphStyle}>
                    CareVR is a healthcare application that helps patients,
                    caregivers and families record daily health observations,
                    complete health assessments and review clinical reports.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    2. Who can use CareVR?
                </h3>

                <p style={paragraphStyle}>
                    CareVR can be used by patients, family members,
                    caregivers and healthcare professionals who wish to
                    monitor health information.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    3. Do I need to add a patient before recording Daily Care?
                </h3>

                <p style={paragraphStyle}>
                    Yes. Daily Care observations are always associated with
                    a patient profile.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    4. Do I need to complete every field in Daily Care?
                </h3>

                <p style={paragraphStyle}>
                    No. Record the observations that are available. You can
                    leave fields blank if the information is not available.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    5. Can I complete assessments every day?
                </h3>

                <p style={paragraphStyle}>
                    Yes. Regular assessments provide a better understanding
                    of changes in a patient's overall health.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    6. What is the difference between Self Assessment and Family Assessment?
                </h3>

                <p style={paragraphStyle}>
                    Self Assessment is completed by the patient. Family
                    Assessment is completed by a caregiver or family member
                    on behalf of the patient.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    7. Why are some values missing in Clinical Trends?
                </h3>

                <p style={paragraphStyle}>
                    A parameter is displayed only if it has been recorded
                    during the selected reporting period.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    8. Can I download my reports?
                </h3>

                <p style={paragraphStyle}>
                    Yes. Clinical Trends reports can be downloaded as
                    professional PDF documents.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    9. Is my data secure?
                </h3>

                <p style={paragraphStyle}>
                    CareVR stores your information securely and is designed
                    to protect your health records from unauthorized access.
                </p>

            </section>

            <section style={sectionStyle}>

                <h3 style={headingStyle}>
                    10. Does CareVR replace medical advice?
                </h3>

                <p style={paragraphStyle}>
                    No. CareVR is designed to help organize health
                    information. It does not replace professional medical
                    advice, diagnosis or treatment.
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
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const headingStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: "12px",
    color: "#111827",
    fontSize: "20px",
};

const paragraphStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 1.8,
    marginBottom: 0,
};
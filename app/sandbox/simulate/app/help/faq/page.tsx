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

            {/* General */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>1. What is CareVR?</h3>

                <p style={paragraphStyle}>
                    CareVR is an AI-powered healthcare companion that helps
                    individuals, families and caregivers securely record,
                    organize and understand healthcare information in one
                    place.
                </p>
            </section>

            <section style={sectionStyle}>
                <h3 style={headingStyle}>2. Who can use CareVR?</h3>

                <p style={paragraphStyle}>
                    CareVR is designed for individuals managing their own
                    health, family members caring for loved ones,
                    caregivers and anyone who wants to maintain organized
                    healthcare records.
                </p>
            </section>

            {/* Patients */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    3. Can I manage multiple family members?
                </h3>

                <p style={paragraphStyle}>
                    Yes. CareVR allows you to maintain health records for
                    yourself as well as multiple family members from a
                    single account.
                </p>
            </section>

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    4. Do I need to record every health parameter?
                </h3>

                <p style={paragraphStyle}>
                    No. Record only the information available at that time.
                    Over time, these observations build a meaningful
                    healthcare history.
                </p>
            </section>

            {/* Daily Care */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    5. Why should I record Daily Care regularly?
                </h3>

                <p style={paragraphStyle}>
                    Regular recordings help identify health trends,
                    support continuity of care and provide valuable
                    information during doctor consultations.
                </p>
            </section>

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    6. Can I edit information after saving?
                </h3>

                <p style={paragraphStyle}>
                    Where supported, CareVR allows you to review and update
                    previously recorded information to ensure your health
                    records remain accurate.
                </p>
            </section>

            {/* Assessments */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    7. What is the difference between Self Assessment and Family Assessment?
                </h3>

                <p style={paragraphStyle}>
                    Self Assessment is completed by the individual, while
                    Family Assessment allows a caregiver or family member
                    to record observations on behalf of someone else.
                </p>
            </section>

            {/* Reports */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    8. How are Reports and Clinical Trends different?
                </h3>

                <p style={paragraphStyle}>
                    Reports provide detailed historical records for specific
                    dates, while Clinical Trends help visualize changes in
                    health parameters over time.
                </p>
            </section>

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    9. Can I share my health reports?
                </h3>

                <p style={paragraphStyle}>
                    Yes. CareVR allows you to generate professional PDF
                    reports that can be shared with doctors, hospitals,
                    caregivers or family members whenever required.
                </p>
            </section>

            {/* AI */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    10. How does Artificial Intelligence help?
                </h3>

                <p style={paragraphStyle}>
                    AI assists with organizing healthcare information,
                    understanding prescriptions, generating summaries and
                    improving your overall healthcare experience. AI is
                    designed to assist—not replace—professional medical
                    advice.
                </p>
            </section>

            {/* Privacy */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    11. Is my healthcare information secure?
                </h3>

                <p style={paragraphStyle}>
                    CareVR is designed with authenticated access and secure
                    handling of healthcare information so that only
                    authorized users can access patient records.
                </p>
            </section>

            {/* Medical */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    12. Does CareVR provide medical advice?
                </h3>

                <p style={paragraphStyle}>
                    No. CareVR is a healthcare record management platform.
                    It does not diagnose, treat or replace advice from
                    qualified healthcare professionals.
                </p>
            </section>

            {/* Support */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>
                    13. Where can I learn more?
                </h3>

                <p style={paragraphStyle}>
                    Explore the other Help Centre sections, including
                    Getting Started, Daily Care, Privacy & Security and
                    About CareVR, for detailed guidance on each feature.
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
import HelpBackButton from "@/Components/help/HelpBackButton";

export default function AboutPage() {
    return (
        <>
            <HelpBackButton />

<div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "clamp(18px, 5vw, 24px)",
        width: "100%",
        padding: "0 8px",
        boxSizing: "border-box",
    }}
>
    <img
        src="/images/CareVR v1.0.png"
        alt="CareVR"
        style={{
            display: "block",
            width: "clamp(140px, 45vw, 180px)",
            height: "auto",
            maxWidth: "100%",
        }}
    />
</div>

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
        A world where every patient has an intelligent, continuous
        understanding of their health journey — from everyday
        observations to consultation, diagnosis, treatment and follow-up.
    </p>
</section>

{/* Mission */}

<section style={sectionStyle}>
    <h3 style={headingStyle}>Our Mission</h3>

    <p style={paragraphStyle}>
        To build the simplest and most intelligent personal healthcare
        companion that helps patients, caregivers and doctors understand
        and act on a continuous health journey.
    </p>
</section>

{/* What Makes CareVR Different */}

<section style={sectionStyle}>
    <h3 style={headingStyle}>What Makes CareVR Different</h3>

    <p
        style={{
            ...paragraphStyle,
            fontSize: "20px",
            fontWeight: 600,
            color: "#111827",
        }}
    >
        Others store your health records. CareVR understands your health
        journey.
    </p>

    <p style={paragraphStyle}>
        CareVR is designed to understand how each new piece of health
        information relates to what came before — connecting observations,
        symptoms, consultations, doctors, investigations, diagnoses,
        medications, treatment and follow-up into an evolving clinical
        journey.
    </p>
</section>

{/* Five Pillars */}

<section style={sectionStyle}>
    <h3 style={headingStyle}>Our 5 Pillars</h3>

    <ul style={listStyle}>
        <li>
            <strong>Effortless Capture</strong> — Make recording health
            information simple and natural.
        </li>

        <li>
            <strong>Intelligent Understanding</strong> — Understand what
            health information means, not just store it.
        </li>

        <li>
            <strong>Clinical Continuity</strong> — Connect every new event
            to the patient's evolving clinical journey.
        </li>

        <li>
            <strong>Trusted &amp; Private Care</strong> — Protect health
            information through privacy, security and traceability.
        </li>

        <li>
            <strong>Simple, Fast &amp; Adaptive Experience</strong> —
            Adapt CareVR to the patient, not the other way around.
        </li>
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
    <h3 style={headingStyle}>Clinical Journey Intelligence</h3>

    <p style={paragraphStyle}>
        CareVR is designed to go beyond storing and summarizing health
        information. Its intelligence is built to understand how new
        health information fits into the patient's evolving clinical
        journey.
    </p>

    <p style={paragraphStyle}>
        As information is recorded, CareVR can connect relevant
        observations, symptoms, consultations, doctors, investigations,
        diagnoses, medications, treatment and follow-up information.
        Where clarification is genuinely needed, CareVR can ask focused
        questions rather than making the user repeatedly enter information
        that is already known.
    </p>

    <p style={paragraphStyle}>
        Over time, this creates a more connected understanding of the
        patient's health journey and supports meaningful timelines,
        summaries and reports.
    </p>

    <p style={paragraphStyle}>
        CareVR's intelligence is intended to assist patients, caregivers
        and healthcare professionals. It does not replace medical
        diagnosis, clinical judgment or professional medical advice.
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
                    <strong>Version:</strong> 1.1
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
    padding: "clamp(16px, 4vw, 24px)",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    width: "100%",
    boxSizing: "border-box",
};

const headingStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: "12px",
    color: "#111827",
    fontSize: "clamp(19px, 5vw, 22px)",
    lineHeight: 1.3,
};

const paragraphStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 1.65,
    marginBottom: "14px",
    fontSize: "clamp(15px, 3.8vw, 16px)",
};

const listStyle: React.CSSProperties = {
    color: "#4b5563",
    lineHeight: 1.7,
    paddingLeft: "20px",
    marginBottom: 0,
    fontSize: "clamp(15px, 3.8vw, 16px)",
};
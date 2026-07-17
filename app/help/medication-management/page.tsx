import HelpBackButton from "@/Components/help/HelpBackButton";

export default function MedicationManagementPage() {
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
                💊 Medication Management
            </h2>

            {/* Overview */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What is Medication Management?</h3>

                <p style={paragraphStyle}>
                    Medication Management helps you organize prescriptions,
                    medications and treatment information in one secure place.
                    Whether you are managing your own health or caring for a
                    family member, CareVR makes it easier to keep medication
                    records accurate, accessible and ready for future
                    consultations.
                </p>

                <p style={paragraphStyle}>
                    By combining AI-assisted prescription reading with
                    structured medication records, CareVR reduces manual effort
                    while helping you maintain a complete medication history.
                </p>
            </section>

            {/* Features */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>What Can You Do?</h3>

                <ul style={listStyle}>
                    <li>Add new prescriptions.</li>
                    <li>Capture prescriptions using your device camera.</li>
                    <li>Upload prescription photographs.</li>
                    <li>Upload prescription PDF documents.</li>
                    <li>Use AI to assist in reading prescriptions.</li>
                    <li>Review extracted medicines before saving.</li>
                    <li>Edit medicines when required.</li>
                    <li>View saved prescriptions.</li>
                    <li>Review active medications.</li>
                    <li>Maintain a complete medication history.</li>
                </ul>
            </section>

            {/* Workflow */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Adding a Prescription</h3>

                <ol style={listStyle}>
                    <li>Select yourself or a family member.</li>
                    <li>Select the patient.</li>
                    <li>Choose the consultation type.</li>
                    <li>Capture a photo, upload an image or upload a PDF.</li>
                    <li>Allow CareVR AI to process the prescription.</li>
                    <li>Review the extracted information.</li>
                    <li>Make corrections if required.</li>
                    <li>Save the prescription.</li>
                </ol>
            </section>

            {/* AI */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>AI Prescription Reading</h3>

                <p style={paragraphStyle}>
                    CareVR uses AI to assist in interpreting prescription
                    documents and extracting relevant healthcare information.
                </p>

                <ul style={listStyle}>
                    <li>Doctor information (when available).</li>
                    <li>Consultation date.</li>
                    <li>Diagnosis or clinical observations.</li>
                    <li>Medicine names.</li>
                    <li>Medicine strength.</li>
                    <li>Dosage.</li>
                    <li>Frequency.</li>
                    <li>Duration.</li>
                    <li>Special instructions, where readable.</li>
                </ul>
            </section>

            {/* Review */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Review Before Saving</h3>

                <p style={paragraphStyle}>
                    AI significantly reduces manual work, but you should always
                    review the extracted information before saving a
                    prescription.
                </p>

                <ul style={listStyle}>
                    <li>Verify medicine names.</li>
                    <li>Confirm dosage.</li>
                    <li>Check frequency and timing.</li>
                    <li>Review treatment duration.</li>
                    <li>Edit any incorrect information.</li>
                </ul>
            </section>

            {/* Saved */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Viewing Saved Prescriptions</h3>

                <p style={paragraphStyle}>
                    Saved prescriptions remain available for future reference,
                    allowing you to quickly review previous consultations and
                    prescribed medications whenever needed.
                </p>

                <ul style={listStyle}>
                    <li>Browse previous prescriptions.</li>
                    <li>Open prescription details.</li>
                    <li>Review prescribed medicines.</li>
                    <li>Reference historical treatment information.</li>
                </ul>
            </section>

            {/* Active Medications */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Active Medications</h3>

                <p style={paragraphStyle}>
                    CareVR maintains the currently prescribed medications for
                    each patient, helping patients, caregivers and healthcare
                    professionals quickly understand ongoing treatment without
                    searching through multiple prescriptions.
                </p>
            </section>

            {/* Benefits */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Benefits of Medication Management</h3>

                <ul style={listStyle}>
                    <li>Keep prescriptions organized.</li>
                    <li>Reduce manual data entry.</li>
                    <li>Improve continuity of care.</li>
                    <li>Support caregiver collaboration.</li>
                    <li>Prepare better for doctor consultations.</li>
                    <li>Maintain an accurate medication history.</li>
                </ul>
            </section>

            {/* Best Practices */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Best Practices</h3>

                <ul style={listStyle}>
                    <li>Capture clear, well-lit prescription images.</li>
                    <li>Ensure the complete prescription is visible.</li>
                    <li>Review AI-generated information carefully.</li>
                    <li>Update prescriptions after every consultation.</li>
                    <li>Keep medication records current.</li>
                </ul>
            </section>

            {/* Important */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Important Information</h3>

                <p style={paragraphStyle}>
                    CareVR uses AI to assist in interpreting prescriptions, but
                    handwritten prescriptions may occasionally require manual
                    correction. Users are responsible for verifying all
                    extracted information before relying on it. Medication
                    records within CareVR support healthcare management and do
                    not replace professional medical advice or clinical
                    judgment.
                </p>
            </section>

            {/* Next */}

            <section style={sectionStyle}>
                <h3 style={headingStyle}>Where to Go Next</h3>

                <p style={paragraphStyle}>
                    Continue to <strong>Daily Care</strong> to record daily
                    health observations, explore <strong>Reports</strong> to
                    review historical information, or use
                    <strong> Clinical Trends</strong> and
                    <strong> PDF Reports</strong> to prepare for your next
                    healthcare consultation.
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
"use client";

const CONSULTATION_OPTIONS = [
    "IN_PERSON",
    "VIDEO",
    "PHONE",
    "WHATSAPP",
    "EMAIL",
    "HOME_VISIT",
    "HOSPITAL_ADMISSION",
    "HOSPITAL_DISCHARGE",
    "OTHER",
] as const;

import { useState } from "react";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import PrescriptionTabs, {
    PrescriptionTab,
} from "./prescription/PrescriptionTabs";

import HistoryCard
from "./prescription-review/HistoryCard";

import AssessmentCard
from "./prescription-review/AssessmentCard";

import InvestigationCard
from "./prescription-review/InvestigationCard";

import DoctorInstructionCard
from "./prescription-review/DoctorInstructionCard";

import OtherNotesCard
from "./prescription-review/OtherNotesCard";

import ComplaintsCard
from "./prescription-review/ComplaintsCard";

import PatientCard
from "./prescription-review/PatientCard";

import VitalsCard
from "./prescription-review/VitalsCard";

import ReviewActions
from "./prescription-review/ReviewActions";

interface PrescriptionReviewProps {

    prescription: ExtractedPrescription;

    saving: boolean;

    patientName: string;

    recordContext: "SELF" | "FAMILY";

    savingValidation?: boolean;

    onReupload: () => void;

    onConfirm: () => void;

}


function validatePrescription(

    prescription: ExtractedPrescription,

    selectedPatientName: string,

    recordContext: "SELF" | "FAMILY"

) {

    const errors: string[] = [];

    const warnings: string[] = [];

    //--------------------------------------------------
    // Patient
    //--------------------------------------------------

    if (!selectedPatientName?.trim()) {

        errors.push(
            "No patient selected."
        );

    }

    //--------------------------------------------------
    // Self validation
    //--------------------------------------------------

    if (

        recordContext === "SELF" &&

        prescription.patientName &&

        selectedPatientName &&

        prescription.patientName
            .toLowerCase()
            .trim() !==

        selectedPatientName
            .toLowerCase()
            .trim()

    ) {

        errors.push(

            "This prescription appears to belong to another patient."

        );

    }

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    if (

        prescription.medicines.length === 0

    ) {

        errors.push(

            "No medicines detected."

        );

    }

    //--------------------------------------------------
    // Doctor
    //--------------------------------------------------

    if (

        !prescription.doctorName

    ) {

        warnings.push(

            "Doctor name not detected."

        );

    }

    //--------------------------------------------------
    // Date
    //--------------------------------------------------

    if (

        !prescription.consultationDate

    ) {

        warnings.push(

            "Consultation date not detected."

        );

    }

    //--------------------------------------------------

    return {

        valid:

            errors.length === 0,

        errors,

        warnings,

    };

}

export default function PrescriptionReview({

    prescription,

    saving,

    patientName,

    recordContext,

    savingValidation,

    onReupload,

    onConfirm,

}: PrescriptionReviewProps) {

const [activeTab, setActiveTab] =
    useState<PrescriptionTab>(
        "patient"
    );

const [
    medicineTimings,
    setMedicineTimings,
] = useState<string[]>(

    prescription.medicines.map(

        () => "NOT_SPECIFIED"

    )

);

const [
    consultationMode,
    setConsultationMode,
] = useState(

    prescription.consultationMode ??

    "IN_PERSON"

);

const validation =
    validatePrescription(
        prescription,
        patientName,
        recordContext
    );


    return (


        <div style={reviewContainer}>



            <h2 style={reviewTitle}>
                Prescription Details
            </h2>

          <p style={reviewDescription}>
Note: The information below has been extracted from the uploaded prescription using AI. Please review and confirm its accuracy before saving.                
<strong> Please Click on each Area and VERIFY the extracted prescription before saving.</strong>
		
 
            </p>

<PrescriptionTabs
    activeTab={activeTab}
    onChange={setActiveTab}
/>

{activeTab==="patient"&&(

<>

<PatientCard
    prescription={prescription}
    patientName={patientName}
    consultationMode={consultationMode}
    onConsultationModeChange={setConsultationMode}
/>


</>

)}

{activeTab==="vitals"&&(

<>

<VitalsCard
    prescription={prescription}
/>

</>

)}


{activeTab==="symptoms" && (

<ComplaintsCard

    prescription={prescription}

/>

)}

{/* Relevant Medical History */}

{activeTab==="assessment" && (

<>

<HistoryCard
    prescription={prescription}
/>

<AssessmentCard
    prescription={prescription}
/>

</>

)}

{activeTab==="medication" && (

<div style={informationBox}>



    <div style={informationTitle}>

        ℹ️ Important: Administration Timing

    </div>

    <p style={informationText}>

        CareVR does not infer whether a medicine should be taken
        <strong> before food, after food, with food, or at another specific
        time.</strong>

    </p>

    <p style={informationText}>

        <strong>Please confirm the correct Administration Timing with the consulting doctor before selecting a value.</strong>

    </p>

    <p style={informationText}>

        If the administration timing has not yet been confirmed with the consulting doctor, leave the value as <strong>"Not Specified"</strong> and update it later after verification.

    </p>

</div>

)}
            {/* Medicines */}

{activeTab==="medication" &&
prescription.medicines.length>0 && (

            <section style={section}>

                <h3 style={sectionTitle}>
                    Medications Prescribed
                </h3>

                {
                    prescription.medicines.length === 0

                        ? (

                            <p style={sectionValue}>
                                No medicines could be identified.
                            </p>

                        )

                        : (

                            <table style={table}>

                                <thead>

                                    <tr>

                                        <th style={headerCell}>Medicine</th>

                                        <th style={headerCell}>Strength</th>

                                        <th style={headerCell}>Dose</th>

                                        <th style={headerCell}>Frequency / Schedule</th>

                                        <th style={headerCell}>Duration</th>

                                        <th style={headerCell}>Administration Timing</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        prescription.medicines.map(

                                            (
                                                medicine,
                                                index
                                            ) => (

                                                <tr
                                                    key={`${medicine.name}-${index}`}
                                                >

                                                    <td style={cell}>
                                                        {medicine.name}
                                                    </td>

                                                    <td style={cell}>
                                                        {medicine.strength ?? "-"}
                                                    </td>

                                                    <td style={cell}>
                                                        {medicine.dose ?? "-"}
                                                    </td>

                                                    <td style={cell}>
                                                        {medicine.frequency ?? "-"}
                                                    </td>

                                                    <td style={cell}>
                                                        {medicine.duration ?? "-"}
                                                    </td>


<td style={cell}>

<select

    value={medicineTimings[index]}

    onChange={(event) => {

        const updated = [

            ...medicineTimings

        ];

        updated[index] =

            event.target.value;

        setMedicineTimings(updated);

    }}

    style={selectStyle}

>

<option value="NOT_SPECIFIED">

Not Specified

</option>

<option value="BEFORE_FOOD">

Before Food

</option>

<option value="AFTER_FOOD">

After Food

</option>

<option value="WITH_FOOD">

With Food

</option>

<option value="EMPTY_STOMACH">

Empty Stomach

</option>

<option value="BEFORE_BREAKFAST">

Before Breakfast

</option>

<option value="AFTER_BREAKFAST">

After Breakfast

</option>

<option value="BEFORE_LUNCH">

Before Lunch

</option>

<option value="AFTER_LUNCH">

After Lunch

</option>

<option value="BEFORE_DINNER">

Before Dinner

</option>

<option value="AFTER_DINNER">

After Dinner

</option>

<option value="AT_BEDTIME">

At Bedtime

</option>

<option value="AS_DIRECTED">

As Directed

</option>

</select>

</td>

                                                </tr>

                                            )

                                        )

                                    }

                                </tbody>

                            </table>

                        )

                }

            </section>

)}

{activeTab==="investigations" && (

<InvestigationCard

    prescription={prescription}

/>

)}

{activeTab==="instructions" && (

<DoctorInstructionCard

    prescription={prescription}

/>

)}

{activeTab==="notes" && (

    <OtherNotesCard
        prescription={prescription}
    />

)}

<ReviewActions
    saving={saving}
    validation={validation}
    onConfirm={onConfirm}
    onReupload={onReupload}
/>

</div>

);

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const reviewContainer: React.CSSProperties = {
    padding: "24px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
};

const reviewTitle: React.CSSProperties = {
    margin: 0,
    marginBottom: "8px",
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
};

const reviewDescription: React.CSSProperties = {
    margin: "0 0 24px 0",
    color: "#64748b",
    lineHeight: 1.6,
};

const section: React.CSSProperties = {
    marginBottom: "24px",
    padding: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
};

const sectionTitle: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
};

const sectionValue: React.CSSProperties = {
    margin: 0,
    color: "#374151",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
};

const bulletList: React.CSSProperties = {

    margin: 0,

    paddingLeft: "22px",

    color: "#374151",

    lineHeight: 1.8,

};

const bulletItem: React.CSSProperties = {

    marginBottom: "6px",

};

const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
};

const headerCell: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e2e8f0",
    background: "#f8fafc",
    fontWeight: 700,
    color: "#334155",
};

const cell: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#111827",
    verticalAlign: "top",
};

const detailsTable: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
};

const labelCell: React.CSSProperties = {
    width: "180px",
    padding: "12px",
    fontWeight: 700,
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
};

const buttonRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "32px",
};

const primaryButton: React.CSSProperties = {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
    padding: "12px 20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
};

const selectStyle: React.CSSProperties = {

    width: "100%",

    padding: "8px",

    borderRadius: "6px",

    border: "1px solid #cbd5e1",

    background: "#ffffff",

    fontSize: "14px",

};

const informationBox: React.CSSProperties = {

    marginTop: "18px",

    padding: "16px",

    border: "1px solid #bfdbfe",

    borderRadius: "8px",

    backgroundColor: "#eff6ff",

};

const informationTitle: React.CSSProperties = {

    fontWeight: 700,

    color: "#1d4ed8",

    marginBottom: "10px",

    fontSize: "15px",

};

const informationText: React.CSSProperties = {

    margin: "0 0 8px",

    color: "#374151",

    lineHeight: 1.6,

    fontSize: "14px",

};
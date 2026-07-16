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

import MedicineCard
from "./prescription-review/MedicineCard";

import {
    validatePrescriptionBeforeSave,
} from "@/lib/prescription/prescriptionValidator";


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface PrescriptionReviewProps {

    prescription: ExtractedPrescription;

    saving: boolean;

    patientName: string;

    recordContext: "SELF" | "FAMILY";

    mode: "UPLOAD" | "VIEW";

    savingValidation?: boolean;

    onReupload: () => void;

    onConfirm: (
        prescription: ExtractedPrescription
    ) => void;

}


export default function PrescriptionReview({

    prescription,

    saving,

    patientName,

    recordContext,

    mode,

    savingValidation,

    onReupload,

    onConfirm,

}: PrescriptionReviewProps) {

const {
    t,
} = useLanguage();

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

const [
    reviewPrescription,
    setReviewPrescription,
] = useState<ExtractedPrescription>({

    ...prescription,

});

const validation =
    validatePrescriptionBeforeSave(
        reviewPrescription,
        patientName,
        recordContext
    );


    return (


        <div style={reviewContainer}>



            <h2 style={reviewTitle}>
                {t("medication.prescriptionDetails")}
            </h2>

          <p style={reviewDescription}>
Note: {t("medication.reviewNoteDescription")}                
<strong> {t("medication.reviewInstruction")} </strong>
		
 
            </p>

<PrescriptionTabs
    activeTab={activeTab}
    onChange={setActiveTab}
/>

{activeTab==="patient"&&(

<>

<PatientCard
    prescription={reviewPrescription}
    patientName={patientName}
    consultationMode={consultationMode}

readOnly={
    mode === "VIEW"
}

    onConsultationModeChange={(value) => {

        setConsultationMode(value);

        setReviewPrescription(previous => ({

            ...previous,

            consultationMode: value,

        }));

    }}

    onConsultationDateChange={(value) => {

        setReviewPrescription(previous => ({

            ...previous,

            consultationDate: value,

        }));

    }}
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

{activeTab === "medication" && (

    <MedicineCard
        prescription={prescription}
        medicineTimings={medicineTimings}

readOnly={
        mode === "VIEW"
    }
        onMedicineTimingChange={(index, value) => {

            const updated = [...medicineTimings];
            updated[index] = value;
            setMedicineTimings(updated);

        }}
    />

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

{
    mode === "UPLOAD" && (

        <ReviewActions
            saving={saving}
            validation={validation}
            onConfirm={() =>
                onConfirm(
                    reviewPrescription
                )
            }
            onReupload={onReupload}
        />

    )
}
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


const bulletList: React.CSSProperties = {

    margin: 0,

    paddingLeft: "22px",

    color: "#374151",

    lineHeight: 1.8,

};

const bulletItem: React.CSSProperties = {

    marginBottom: "6px",

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




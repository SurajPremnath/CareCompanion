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

hideVitals?: boolean;

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

hideVitals,

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

    prescription.medicines.map(medicine => {

const text = [

    ...(medicine.timings ?? []),

    medicine.instructions ?? "",

    medicine.frequency ?? "",

].join(" ").toLowerCase();

const frequency =
    (medicine.frequency ?? "")
        .trim()
        .toUpperCase();

const has = (...values: string[]) =>
    values.some(value => text.includes(value));

if (has("before breakfast", "before_breakfast"))
    return "BEFORE_BREAKFAST";

if (has("after breakfast", "after_breakfast"))
    return "AFTER_BREAKFAST";

if (has("before lunch", "before_lunch"))
    return "BEFORE_LUNCH";

if (has("after lunch", "after_lunch"))
    return "AFTER_LUNCH";

if (has("before dinner", "before_dinner"))
    return "BEFORE_DINNER";

if (has("after dinner", "after_dinner"))
    return "AFTER_DINNER";

if (has("before food", "before_food"))
    return "BEFORE_FOOD";

if (has("after food", "after_food"))
    return "AFTER_FOOD";

if (has("empty stomach", "empty_stomach"))
    return "EMPTY_STOMACH";

if (has("bedtime", "at_bedtime"))
    return "AT_BEDTIME";

if (has("morning"))
    return "MORNING";

if (has("afternoon"))
    return "AFTERNOON";

if (has("evening"))
    return "EVENING";

if (has("night"))
    return "NIGHT";

if (has("weekly"))
    return "WEEKLY";

if (has("monthly"))
    return "MONTHLY";

if (has("alternate day", "alternate_day"))
    return "ALTERNATE_DAY";

if (has("sos"))
    return "SOS";


/*--------------------------------------------------
 Frequency Intelligence
---------------------------------------------------*/

if (frequency === "OD")
    return "MORNING";

if (
    frequency === "BD" ||
    frequency === "BID"
)
    return "MORNING";

if (
    frequency === "TDS" ||
    frequency === "TID"
)
    return "MORNING";

if (
    frequency === "QID" ||
    frequency === "QDS"
)
    return "MORNING";

if (frequency === "HS")
    return "AT_BEDTIME";

return "NOT_SPECIFIED";
    })
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

    consultationMode:
        prescription.consultationMode ??
        "IN_PERSON",

});

const [
    reviewMode,
    setReviewMode,
] = useState(false);

const [
    prescriptionSaved,
    setPrescriptionSaved,
] = useState(false);

const [
    reviewCompleted,
    setReviewCompleted,
] = useState(false);

const [
    reviewSummary,
    setReviewSummary,
] = useState<{
    validated: number;
    excluded: number;
    pending: string[];
} | null>(null);

const handleMedicineReviewStatusChange = (
    index: number,
    status: "REVIEW" | "VERIFIED"
) => {

    setReviewPrescription(previous => {

        const medicines = [...previous.medicines];

        medicines[index] = {

            ...medicines[index],

            reviewStatus: status,

        };

        return {

            ...previous,

            medicines,

        };

    });

};

const handleReviewMedicines = () => {

    setReviewMode(true);


};

const handleReviewCompleted = () => {

    const pendingMedicines =
        reviewPrescription.medicines.filter(
            medicine =>
                medicine.reviewStatus === "REVIEW"
        );

    const validatedCount =
        reviewPrescription.medicines.filter(
            medicine =>
                medicine.reviewStatus === "VERIFIED"
        ).length;

    const excludedCount =
        reviewPrescription.medicines.filter(
            medicine =>
                medicine.reviewStatus === "EXCLUDED"
        ).length;

    setReviewSummary({

        validated:
            validatedCount,

        excluded:
            excludedCount,

        pending:
            pendingMedicines.map(
                medicine => medicine.name
            ),

    });

    setReviewMode(false);

    setReviewCompleted(true);

};

const validation =
    validatePrescriptionBeforeSave(
        reviewPrescription,
        patientName,
        recordContext
    );


const handleSave = async () => {

    await onConfirm(
        reviewPrescription
    );

    setPrescriptionSaved(true);

};

    return (


        <div style={reviewContainer} className="prescription-review-container">
            <style>{`
                @media (max-width: 700px) {
                    .prescription-review-container {
                        padding: 12px !important;
                        border-radius: 10px !important;
                    }
                    .prescription-review-container .prescription-review-title {
                        font-size: 20px !important;
                        line-height: 1.25 !important;
                    }
                    .prescription-review-container .prescription-review-description {
                        font-size: 12px !important;
                        line-height: 1.45 !important;
                        margin-bottom: 14px !important;
                    }
                    .prescription-review-container .prescription-review-actions {
                        width: 100% !important;
                    }
                    .prescription-review-container .prescription-review-actions > * {
                        width: 100% !important;
                    }
                }
                @media (max-width: 420px) {
                    .prescription-review-container {
                        padding: 10px !important;
                    }
                    .prescription-review-container .prescription-review-title {
                        font-size: 18px !important;
                    }
                    .prescription-review-container .prescription-review-description {
                        font-size: 11.5px !important;
                    }
                }
            `}</style>



            <h2
                style={reviewTitle}
                className="prescription-review-title"
            >
                {t("medication.prescriptionDetails")}
            </h2>

            <p
                style={reviewDescription}
                className="prescription-review-description"
            >
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
    prescription={reviewPrescription}
    readOnly={mode === "VIEW"}
    onWeightChange={(weight) =>
        setReviewPrescription(previous => ({
            ...previous,
            consultationVitals: previous.consultationVitals
                ? {
                      ...previous.consultationVitals,
                      weight,
                  }
                : null,
        }))
    }
/>

</>

)}


{activeTab==="symptoms" && (

<ComplaintsCard

    prescription={reviewPrescription}

/>

)}

{/* Relevant Medical History */}

{activeTab==="assessment" && (

<>

<HistoryCard
    prescription={reviewPrescription}
/>

<AssessmentCard
    prescription={reviewPrescription}
/>

</>

)}

{activeTab === "medication" && (

<MedicineCard
    prescription={reviewPrescription}
    medicineTimings={medicineTimings}
    reviewMode={reviewMode}
    reviewCompleted={reviewCompleted}
    readOnly={mode === "VIEW"}
    onMedicineTimingChange={(index, value) => {

        const updated = [...medicineTimings];
        updated[index] = value;
        setMedicineTimings(updated);

    }}
    onReviewStatusChange={
        handleMedicineReviewStatusChange
    }
    onMedicineUpdated={(index, medicine) => {

        setReviewPrescription(previous => {

            const medicines = [...previous.medicines];

            medicines[index] = medicine;

            return {

                ...previous,

                medicines,

            };

        });

    }}
/>
)}

{activeTab==="investigations" && (

<InvestigationCard

    prescription={reviewPrescription}

/>

)}

{activeTab==="instructions" && (

<DoctorInstructionCard

    prescription={reviewPrescription}

/>

)}

{activeTab==="notes" && (

    <OtherNotesCard
        prescription={reviewPrescription}
    />

)}

{
    mode === "UPLOAD" && (

<>

{
reviewCompleted &&
reviewSummary && (

<div
    style={{
        marginTop:"20px",
        marginBottom:"20px",
        padding:"16px",
        borderRadius:"10px",
        background:"#eff6ff",
        border:"1px solid #bfdbfe",
    }}
>

<h3
style={{
margin:"0 0 12px 0",
color:"#1e40af",
}}
>
✅ Prescription Review Completed
</h3>

<p>

<strong>

{reviewSummary.validated}

</strong>

{" medicine(s) validated"}

<br />

<strong>

{reviewSummary.excluded}

</strong>

{" medicine(s) excluded"}

<br />

<strong>

{reviewSummary.pending.length}

</strong>

{" medicine(s) pending validation"}

</p>

{

reviewSummary.pending.length>0&&(

<>

<p>

The following medicines still require validation:

</p>

<ul>

{

reviewSummary.pending.map(

medicine=>

<li key={medicine}>

{medicine}

</li>

)

}

</ul>

<p
style={{
marginTop:"12px",
fontWeight:600,
color:"#92400e",
}}
>

Please ensure these medicines are validated before uploading the next prescription.

</p>

</>

)

}

{

reviewSummary.pending.length===0&&(

<p
style={{
fontWeight:600,
color:"#166534",
}}
>

All medicines have been reviewed.

</p>

)

}

</div>

)

}

<div className="prescription-review-actions">
<ReviewActions
    saving={saving}
    saved={prescriptionSaved}
    validation={validation}
    reviewMode={reviewMode}
    reviewCompleted={reviewCompleted}
    onConfirm={handleSave}
    onReupload={onReupload}
    onReviewMedicines={handleReviewMedicines}
    onReviewCompleted={handleReviewCompleted}
/>
</div>

</>

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




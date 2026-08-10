"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface Props {
    prescription: ExtractedPrescription;

    mode?: "PRESCRIPTION" | "DOCTOR_NOTES";
}

const section={
    marginBottom:"24px",
    padding:"18px",
    background:"#fff",
    border:"1px solid #e2e8f0",
    borderRadius:"10px",
} satisfies React.CSSProperties;

export default function ComplaintsCard({
    prescription,
    mode = "PRESCRIPTION",
}: Props) {

const {
    t,
} = useLanguage();

const durationLookup = new Map(

    prescription.presentingComplaints.map(item => [

        item.complaint.toLowerCase(),

        item.duration,

    ])

);

    if(
        prescription.symptoms.length===0
    ){
        return null;
    }

    return(

<section style={section} className="complaints-card-section">


<style>{`
@media (max-width: 700px) {
    .complaints-card-section {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .complaints-card-section h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .complaints-card-section ul {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding-left: 20px !important;
        box-sizing: border-box !important;
    }

    .complaints-card-section li {
        max-width: 100% !important;
        padding: 3px 0 !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        box-sizing: border-box !important;
    }
}

@media (max-width: 420px) {
    .complaints-card-section {
        padding: 10px !important;
    }

    .complaints-card-section h3 {
        font-size: 15px !important;
    }

    .complaints-card-section ul {
        padding-left: 18px !important;
    }

    .complaints-card-section li {
        font-size: 12.5px !important;
        line-height: 1.45 !important;
    }
}
`}</style>

<h3>

🤒 {t("medication.patientSymptoms")}

</h3>

<ul>

{

prescription.symptoms.map((symptom, index) => {

    const duration =
        durationLookup.get(symptom.toLowerCase());

    return (

        <li key={index}>

            {expandMedicalText(symptom)}

            {duration && ` (${duration})`}

        </li>

    );

})

}
</ul>

</section>

    );

}
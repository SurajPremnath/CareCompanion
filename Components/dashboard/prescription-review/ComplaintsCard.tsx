"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface Props{
    prescription:ExtractedPrescription;
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

}:Props){

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

<section style={section}>

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
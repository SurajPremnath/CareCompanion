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

    if(
        prescription.presentingComplaints.length===0
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

prescription.presentingComplaints.map(

(item,index)=>(

<li key={index}>

{expandMedicalText(item.complaint)}

{

item.duration &&

` (${item.duration})`

}

</li>

)

)

}

</ul>

</section>

);

}
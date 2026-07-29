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

export default function DoctorInstructionCard({

    prescription,

}:Props){

const {
    t,
} = useLanguage();

const instructions = [...prescription.doctorInstructions].sort(
    (a, b) => {

        const isPreparation = (value: string) => {

            const text = value.toLowerCase();

            return (
                text.includes("mix") ||
                text.includes("dissolve") ||
                text.includes("dilute")
            );

        };

        return Number(isPreparation(a)) - Number(isPreparation(b));

    }
);


    if(
        prescription.doctorInstructions.length===0
    ){
        return null;
    }

    return(

<section style={section}>

<h3>

🏡 {t("medication.careInstructions")}

</h3>

<ul>

{

instructions.map(

(item,index)=>(

<li key={index}>

{expandMedicalText(item)}

</li>

)

)

}

</ul>

</section>

);

}
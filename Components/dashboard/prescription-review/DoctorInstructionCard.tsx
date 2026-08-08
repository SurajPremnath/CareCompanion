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

<section style={section} className="doctor-instruction-card">


<style>{`
@media (max-width: 700px) {
    .doctor-instruction-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .doctor-instruction-card h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .doctor-instruction-card ul {
        margin: 0 !important;
        padding-left: 20px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    .doctor-instruction-card li {
        padding: 4px 0 !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
    }
}

@media (max-width: 420px) {
    .doctor-instruction-card {
        padding: 10px !important;
    }

    .doctor-instruction-card h3 {
        font-size: 15px !important;
    }

    .doctor-instruction-card ul {
        padding-left: 18px !important;
    }

    .doctor-instruction-card li {
        font-size: 12.5px !important;
        line-height: 1.45 !important;
    }
}
`}</style>

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
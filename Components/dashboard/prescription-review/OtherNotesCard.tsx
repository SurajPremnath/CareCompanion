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

export default function OtherNotesCard({

    prescription,

}:Props){

const {
    t,
} = useLanguage();

if (
    prescription.additionalNotes.length === 0
) {
    return null;
}

    return(

<section style={section}>

<h3>

📝 {t("medication.otherNotes")}

</h3>

<div>

    {prescription.additionalNotes.map(
        (note, index) => (

            <p key={index}>

                {expandMedicalText(note)}

            </p>

        )
    )}

</div>

</section>

);

}
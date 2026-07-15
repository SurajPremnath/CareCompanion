"use client";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

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

    if(
        !prescription.additionalNotes
    ){
        return null;
    }

    return(

<section style={section}>

<h3>

📝 Other Notes

</h3>

<p>

{prescription.additionalNotes}

</p>

</section>

);

}
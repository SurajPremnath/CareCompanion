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

export default function DoctorInstructionCard({

    prescription,

}:Props){

    if(
        prescription.doctorInstructions.length===0
    ){
        return null;
    }

    return(

<section style={section}>

<h3>

🏡 Care Instructions

</h3>

<ul>

{

prescription.doctorInstructions.map(

(item,index)=>(

<li key={index}>

{item}

</li>

)

)

}

</ul>

</section>

);

}
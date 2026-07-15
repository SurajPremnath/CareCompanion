"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
    ConsultationMode,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface PatientCardProps {

    prescription: ExtractedPrescription;

    patientName: string;

    consultationMode: ConsultationMode;

    onConsultationModeChange: (
        value: ConsultationMode
    ) => void;

    onConsultationDateChange: (
        value: string
    ) => void;

}

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

function formatDate(value?: string | null) {

    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {

        return value;

    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

}

function toTitleCase(value?: string | null) {

    if (!value) return "-";

    return value
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());

}

const section: React.CSSProperties = {
    marginBottom:"24px",
    padding:"18px",
    background:"#fff",
    border:"1px solid #e2e8f0",
    borderRadius:"10px",
};

const table:React.CSSProperties={
    width:"100%",
    borderCollapse:"collapse",
};

const label:React.CSSProperties={
    width:180,
    fontWeight:700,
    padding:"12px",
};

const cell:React.CSSProperties={
    padding:"12px",
};

export default function PatientCard({

    prescription,

    patientName,

    consultationMode,

    onConsultationModeChange,

    onConsultationDateChange,

}:PatientCardProps){

return(

<section style={section}>

<h3>👤 Patient Details</h3>

<table style={table}>

<tbody>

<tr>

<td style={label}>Patient</td>

<td style={cell}>{patientName}</td>

<td style={label}>Doctor</td>

<td style={cell}>{prescription.doctorName ?? "-"}</td>

</tr>

<tr>

<td style={label}>Hospital</td>

<td style={cell}>

{expandMedicalText(
toTitleCase(
prescription.hospitalOrClinic
)
)}

</td>

</tr>

<tr>

<td style={label}>

Consultation Date

</td>

<td style={cell}>

<div
style={{
display:"flex",
flexDirection:"column",
gap:"8px",
maxWidth:"260px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontSize:"14px",
fontWeight:600,
color:"#334155",
}}
>

<span>🤖 AI Extracted Date</span>

</div>
<input
type="date"
value={
prescription.consultationDate
? new Date(
prescription.consultationDate
).toISOString().split("T")[0]
: ""
}
onChange={(e)=>
    onConsultationDateChange(
        e.target.value
    )
}
style={{
padding:"10px 12px",
border:"1px solid #cbd5e1",
borderRadius:"8px",
fontSize:"15px",
width:"220px",
}}
/>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontSize:"13px",
color:"#b45309",
fontWeight:500,
}}
>

<span>⚠️</span>

<span>

If the date is incorrect, select the correct consultation date.

</span>

</div>

</div>

</td>

</tr>

<tr>

<td style={label}>

Consultation Mode

</td>

<td style={cell}>

<select

value={consultationMode}

onChange={(e)=>

onConsultationModeChange(

e.target.value as ConsultationMode

)

}

>

{

CONSULTATION_OPTIONS.map(

option=>(

<option
key={option}
value={option}
>

{

option.replaceAll("_"," ")

}

</option>

)

)

}

</select>

</td>

</tr>

</tbody>

</table>

</section>

);

}
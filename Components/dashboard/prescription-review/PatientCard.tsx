"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
    ConsultationMode,
} from "@/lib/prescription-image/prescriptionImageTypes";


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface PatientCardProps {

    prescription: ExtractedPrescription;

    patientName: string;

    consultationMode: ConsultationMode;

    readOnly: boolean;

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

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;

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
    width:"100%",
    boxSizing:"border-box",
};

const table:React.CSSProperties={
    width:"100%",
    borderCollapse:"collapse",
    tableLayout:"fixed",
};

const label:React.CSSProperties={
    width:180,
    fontWeight:700,
    padding:"12px",
    boxSizing:"border-box",
};

const cell:React.CSSProperties={
    padding:"12px",
    boxSizing:"border-box",
    overflowWrap:"anywhere",
};

const mobileResponsiveStyles = `
@media (max-width: 700px) {
    .patient-card-section {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .patient-card-section h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .patient-details-table {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        border-collapse: separate !important;
        table-layout: auto !important;
        box-sizing: border-box !important;
    }

    .patient-details-table tbody {
        display: block !important;
        width: 100% !important;
    }

    .patient-details-table tr {
        width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
    }

    .patient-details-table .patient-row-paired {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
        gap: 0 10px !important;
        margin-bottom: 10px !important;
        padding-bottom: 10px !important;
        border-bottom: 1px solid #e2e8f0 !important;
    }

    .patient-details-table .patient-row-single {
        display: block !important;
        margin-bottom: 10px !important;
        padding-bottom: 10px !important;
        border-bottom: 1px solid #e2e8f0 !important;
    }

    .patient-details-table .patient-row:last-child {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        border-bottom: 0 !important;
    }

    .patient-details-table td {
        display: block !important;
        width: auto !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 5px 0 !important;
        box-sizing: border-box !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        border: 0 !important;
    }

    .patient-details-table .patient-row-single td:first-child,
    .patient-details-table .patient-row-paired td:nth-child(odd) {
        padding-bottom: 2px !important;
        font-size: 11px !important;
        line-height: 1.3 !important;
        color: #64748b !important;
        font-weight: 700 !important;
    }

    .patient-details-table .patient-row-single td:nth-child(2),
    .patient-details-table .patient-row-paired td:nth-child(even) {
        padding-top: 2px !important;
        font-size: 13px !important;
        line-height: 1.45 !important;
        color: #1f2937 !important;
    }

    .patient-details-table input[type="date"],
    .patient-details-table select {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        font-size: 14px !important;
    }

.patient-details-table .patient-date-editor {
    width: auto !important;
    max-width: none !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 8px !important;
    flex-wrap: wrap !important;
}

.patient-date-value {
    font-size: 11px !important;
    line-height: 1.3 !important;
}

.patient-details-table .patient-date-row {
    display: grid !important;
    grid-template-columns: max-content max-content !important;
    column-gap: 12px !important;
    align-items: center !important;
    width: 100% !important;
}

.patient-details-table .patient-date-row td {
    width: auto !important;
}

.patient-details-table .patient-date-row td:first-child {
    white-space: nowrap !important;
}

.patient-details-table .patient-date-row .patient-date-value {
    font-size: 11px !important;
    white-space: nowrap !important;
}

}

@media (max-width: 420px) {
    .patient-card-section {
        padding: 10px !important;
    }

    .patient-card-section h3 {
        font-size: 15px !important;
    }

    .patient-details-table .patient-row-paired {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 6px !important;
    }

    .patient-details-table td {
        font-size: 12.5px !important;
    }

    .patient-details-table .patient-row-single td:first-child,
    .patient-details-table .patient-row-paired td:nth-child(odd) {
        font-size: 10.5px !important;
    }

.patient-details-table .patient-date-row {
    column-gap: 8px !important;
}

.patient-details-table .patient-date-row .patient-date-value {
    font-size: 10.5px !important;
}

}
`;


export default function PatientCard({

    prescription,

    patientName,

    consultationMode,

    readOnly,

    onConsultationModeChange,

    onConsultationDateChange,

}:PatientCardProps){

 const {
    t,
  } = useLanguage();


return(

<section style={section} className="patient-card-section">

<style>{mobileResponsiveStyles}</style>

<h3>👤 {t("medication.patientDetails")}</h3>

 <table style={table} className="patient-details-table">

<tbody>

<tr className="patient-row patient-row-paired">

<td style={label}>{t("medication.patient")}</td>

<td style={cell}>{patientName}</td>

<td style={label}>{t("medication.doctor")}</td>

<td style={cell}>{prescription.doctorName ?? "-"}</td>

</tr>

<tr className="patient-row patient-row-single patient-date-row">

<td style={label}>{t("medication.hospital")}</td>

<td style={cell}>

{expandMedicalText(
toTitleCase(
prescription.hospitalOrClinic
)
)}

</td>

</tr>

<tr className="patient-row patient-row-single">

<td style={label}>

{t("medication.consultationDate")}

</td>

<td style={cell}>

{readOnly ? (

    <span className="patient-date-value">
        {formatDate(
            prescription.consultationDate
        )}
    </span>

) : (

<div
className="patient-date-editor"
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

<span>🤖 {t("medication.aiExtractedDate")}</span>

</div>

<input
disabled={readOnly}
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

{t("medication.consultationDateHelp")}

</span>

</div>

</div>

)}

</td>

</tr>

<tr className="patient-row patient-row-single">

<td style={label}>

{t("medication.consultationMode")}

</td>

<td style={cell}>

{readOnly ? (

    consultationMode.replaceAll("_", " ")

) : (

<select
disabled={readOnly}
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

)}

</td>

</tr>

</tbody>

</table>

</section>

);

}
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

const table={
width:"100%",
borderCollapse:"collapse",
} satisfies React.CSSProperties;

const label={
width:180,
fontWeight:700,
padding:"12px",
} satisfies React.CSSProperties;

const cell={
padding:"12px",
} satisfies React.CSSProperties;

export default function VitalsCard({

prescription,

}:Props){

const {
    t,
} = useLanguage();

const vitals=

prescription.consultationVitals;

if(!vitals){

return null;

}

return(

<section style={section}>

<h3>

❤️ {t("medication.consultationVitals")}

</h3>

<table style={table}>

<tbody>

<tr>

<td style={label}>{t("medication.weight")}</td>

<td style={cell}>{vitals.weight ?? "-"}</td>

</tr>

<tr>

<td style={label}>{t("medication.bloodPressure")}</td>

<td style={cell}>{vitals.bloodPressure ?? "-"}</td>

</tr>

<tr>

<td style={label}>{t("medication.pulse")}</td>

<td style={cell}>{vitals.pulse ?? "-"}</td>

</tr>

<tr>

<td style={label}>{t("medication.spo2")}</td>

<td style={cell}>{vitals.spo2 ?? "-"}</td>

</tr>

<tr>

<td style={label}>{t("medication.temperature")}</td>

<td style={cell}>{vitals.temperature ?? "-"}</td>

</tr>

</tbody>

</table>

</section>

);

}
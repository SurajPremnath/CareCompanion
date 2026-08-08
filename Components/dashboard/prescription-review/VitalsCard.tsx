"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface Props {

    prescription: ExtractedPrescription;

    readOnly: boolean;

    onWeightChange: (weight: string) => void;

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

    readOnly,

    onWeightChange,

}: Props){

const {
    t,
} = useLanguage();

const vitals=

prescription.consultationVitals;

if(!vitals){

return null;

}

return(

<section style={section} className="vitals-card-section">


<style>{`
@media (max-width: 700px) {
    .vitals-card-section {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .vitals-card-section h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .vitals-details-table,
    .vitals-details-table tbody {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    .vitals-details-table tr {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin-bottom: 10px !important;
        padding-bottom: 10px !important;
        border-bottom: 1px solid #e2e8f0 !important;
        box-sizing: border-box !important;
    }

    .vitals-details-table tr:last-child {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        border-bottom: 0 !important;
    }

    .vitals-details-table td {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        padding: 5px 0 !important;
        border: 0 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
    }

    .vitals-details-table td:first-child {
        padding-bottom: 2px !important;
        font-size: 11px !important;
        line-height: 1.3 !important;
        color: #64748b !important;
        font-weight: 700 !important;
    }

    .vitals-details-table td:nth-child(2) {
        padding-top: 2px !important;
        font-size: 13px !important;
        line-height: 1.45 !important;
        color: #1f2937 !important;
    }

    .vitals-details-table input[type="text"] {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        min-height: 42px !important;
        font-size: 14px !important;
    }

    .vitals-details-table td > div {
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow-wrap: anywhere !important;
    }
}

@media (max-width: 420px) {
    .vitals-card-section {
        padding: 10px !important;
    }

    .vitals-card-section h3 {
        font-size: 15px !important;
    }

    .vitals-details-table td:first-child {
        font-size: 10.5px !important;
    }

    .vitals-details-table td:nth-child(2) {
        font-size: 12.5px !important;
    }
}
`}</style>

<h3>

❤️ {t("medication.consultationVitals")}

</h3>

<table style={table} className="vitals-details-table">

<tbody>

<tr>

<td style={label}>{t("medication.weight")}</td>

<td style={cell}>
    {readOnly ? (
        vitals.weight ?? "-"
    ) : (
        <>
            <div
    style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "#64748b",
        marginBottom: "6px",
    }}
>
    🤖 AI extracted this value. Please verify and correct if needed.
</div>

            <input
                type="text"
                value={vitals.weight ?? ""}
                onChange={(e) => onWeightChange(e.target.value)}
                placeholder="Enter weight"
                style={{
                    width: "140px",
                    padding: "6px 8px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    fontSize: "14px",
                }}
            />
        </>
    )}
</td>
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
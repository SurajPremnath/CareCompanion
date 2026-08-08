"use client";

// Remove useEffect.
// Keep useMemo and useState only if still used after your previous changes.
import { useMemo, useState } from "react";

import type {
    ExtractedPrescriptionMedicine,
} from "@/lib/prescription-image/prescriptionImageTypes";

import type {
    MedicineMaster,
} from "@/lib/medication/types/medicineMaster";

import {
    MedicineResolverImpl,
} from "@/lib/medication/resolver/MedicineResolverImpl";

export type MedicineReviewStatus =
    | "REVIEW"
    | "VERIFIED"
    | "REVIEWED";

interface MedicineRowProps {

    medicine: ExtractedPrescriptionMedicine;

    index: number;

    administrationTiming: string;

    administrationTimingLabels: Record<string, string>;

    reviewCompleted: boolean;

    readOnly: boolean;

    onAdministrationTimingChange: (
        index: number,
        value: string
    ) => void;

    onMedicineUpdated: (
        index: number,
        medicine: ExtractedPrescriptionMedicine
    ) => void;

}

export default function MedicineRow({

    medicine,

    index,

    administrationTiming,

    administrationTimingLabels,

    reviewCompleted,

    readOnly,

    onAdministrationTimingChange,

    onMedicineUpdated,

}: MedicineRowProps) {

// ReviewDecision moved to MedicationReviewRow.tsx

// Review state moved to MedicationReviewRow.tsx

// Review logic moved to MedicationReviewRow.tsx



    return (
        <>
            <tr>

<td style={cell}>

    <div style={medicineContainer}>

<div style={medicineName}>

    {medicine.name}

</div>

{/* Generic name removed from display screen */}


{/* Formulation will be shown only in MedicationReviewRow */}

    </div>

</td>

{/* Review handled by MedicationReviewRow */}

<td style={centerCell}>
    {medicine.strength ?? "-"}
</td>

<td style={centerCell}>

{
(
{
    ONCE_DAILY:"Once Daily",
    TWICE_DAILY:"Twice Daily",
    THREE_TIMES_DAILY:"Three Times Daily",
    FOUR_TIMES_DAILY:"Four Times Daily",
    AS_NEEDED:"As Needed",
    WEEKLY:"Weekly",
    MONTHLY:"Monthly",
    OTHER:"Other",

    OD:"Once Daily",
    BD:"Twice Daily",
    TDS:"Three Times Daily",
    QDS:"Four Times Daily",
    SOS:"As Needed",

} as Record<string,string>)

[
    medicine.frequency ?? ""
]

??

medicine.frequency

??

"-"

}

</td>

<td style={centerCell}>
    {medicine.duration ?? "-"}
</td>

<td style={cell}>

{
    administrationTimingLabels[
        administrationTiming
    ] ?? "-"
}

</td>

{
    (reviewCompleted || readOnly) && (

        <td
            style={{
                ...centerCell,
                fontWeight: 600,
            }}
        >

{
    medicine.reviewStatus === "VERIFIED" ? (

        <span
            style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "999px",
                background: "#dcfce7",
                color: "#166534",
                fontWeight: 600,
                fontSize: "13px",
            }}
        >
            🟢 Validated
        </span>

    ) : medicine.reviewStatus === "EXCLUDED" ? (

        <span
            style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "999px",
                background: "#f3f4f6",
                color: "#4b5563",
                fontWeight: 600,
                fontSize: "13px",
            }}
        >
            🚫 Excluded
        </span>

    ) : (

        <span
            style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "999px",
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 600,
                fontSize: "13px",
            }}
        >
            🟡 Pending Validation
        </span>

    )
}

        </td>

    )
}

</tr>

{/* Medication review moved to MedicationReviewRow.tsx */}
</>
    );
}

const cell: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#111827",
    verticalAlign: "top",
};

const centerCell: React.CSSProperties = {
    ...cell,
    textAlign: "center",
};

const reviewCell: React.CSSProperties = {
    ...cell,
    width: "140px",
};

const expandedCell: React.CSSProperties = {
    padding: "20px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
};

const reviewContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
};

const reviewTitle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 700,
};

const radioRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

const label: React.CSSProperties = {
    fontWeight: 600,
    color: "#374151",
};

const searchContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "12px",
};


const searchInput: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
};

const suggestionContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    overflow: "hidden",
};

const suggestionButton: React.CSSProperties = {
    padding: "10px 12px",
    textAlign: "left",
    border: "none",
    borderBottom: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
};

const reviewButton: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #f59e0b",
    background: "#fffbeb",
    color: "#b45309",
    cursor: "pointer",
    fontWeight: 600,
};

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    fontSize: "14px",
};

const timingContainer: React.CSSProperties = {

    display: "flex",

    flexDirection: "column",

    gap: "8px",

};

const timingBadge: React.CSSProperties = {

    display: "inline-flex",

    alignItems: "center",

    width: "fit-content",

    padding: "6px 12px",

    borderRadius: "999px",

    background: "#dcfce7",

    color: "#166534",

    fontWeight: 600,

    fontSize: "13px",

};

const medicineContainer: React.CSSProperties = {

    display: "flex",

    flexDirection: "column",

    gap: "4px",

};

const medicineName: React.CSSProperties = {

    fontWeight: 700,

    fontSize: "15px",

    color: "#111827",

};

const genericName: React.CSSProperties = {

    fontSize: "13px",

    color: "#2563eb",

};

const medicineMeta: React.CSSProperties = {

    fontSize: "12px",

    color: "#64748b",

};
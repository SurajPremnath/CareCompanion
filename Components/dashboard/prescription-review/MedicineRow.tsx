"use client";

import { useEffect, useMemo, useState } from "react";

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

    reviewStatus: MedicineReviewStatus;

    administrationTiming: string;

    administrationTimingLabels: Record<string, string>;

    readOnly: boolean;

    onAdministrationTimingChange: (
        index: number,
        value: string
    ) => void;

    onReviewStatusChange: (
        index: number,
        status: "REVIEW" | "REVIEWED"
    ) => void;

onMedicineUpdated: (
        index: number,
        medicine: ExtractedPrescriptionMedicine
    ) => void;
}

export default function MedicineRow({

    medicine,

    index,

    reviewStatus,

    administrationTiming,

    administrationTimingLabels,

    readOnly,

    onAdministrationTimingChange,

    onReviewStatusChange,

onMedicineUpdated,

}: MedicineRowProps) {

type ReviewDecision =
    | "NONE"
    | "CORRECT"
    | "CHANGE";

const [expanded, setExpanded] =
    useState(false);

const [decision, setDecision] =
    useState<ReviewDecision>("NONE");

useEffect(() => {

    if (reviewStatus === "REVIEWED") {

        setDecision("CORRECT");

    }

}, [reviewStatus]);

const [searchText, setSearchText] =
    useState("");

const [suggestions, setSuggestions] =
    useState<MedicineMaster[]>([]);

const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineMaster | null>(null);

const resolver = useMemo(
    () => new MedicineResolverImpl(),
    []
);

const search =
    searchText.toLowerCase();

useEffect(() => {

    if (
        searchText.trim().length < 2
    ) {

        setSuggestions([]);

        return;

    }

    resolver
        .search(searchText)
        .then(setSuggestions);

}, [resolver, searchText]);


const handleMedicineCorrect = () => {

    setDecision("CORRECT");

    onReviewStatusChange(
    index,
    "REVIEWED"
);

    setExpanded(false);

};


const handleMedicineSelected = (
    selectedMedicine: MedicineMaster
) => {

    setSelectedMedicine(selectedMedicine);

    setSearchText(selectedMedicine.brandName);

    setSuggestions([]);

    setDecision("CORRECT");

    onMedicineUpdated(
        index,
        {
            ...medicine,
            name: selectedMedicine.brandName,
        }
    );

    onReviewStatusChange(
        index,
        "REVIEWED"
    );

    setExpanded(false);

};

    return (
        <>
            <tr>

<td style={cell}>

    <div style={medicineContainer}>

        <div style={medicineName}>

            {selectedMedicine
                ? selectedMedicine.brandName
                : medicine.name}

        </div>

 {selectedMedicine?.genericName && (

    <div style={genericName}>

        Generic:
        {" "}
        {selectedMedicine.genericName}

    </div>

)}

{(selectedMedicine?.strength ?? medicine.strength) && (

    <div style={medicineMeta}>

        Strength:
        {" "}
        {selectedMedicine?.strength ??
         medicine.strength}

    </div>

)}

{selectedMedicine?.formulation && (

    <div style={medicineMeta}>

        Form:
        {" "}
        {selectedMedicine.formulation}

    </div>

)}

    </div>

</td>

{!readOnly && (
<td
    style={{
        ...reviewCell,
        textAlign: "center",
    }}
>
    <button
        type="button"
        style={reviewButton}
        onClick={() =>
            setExpanded(previous => !previous)
        }
    >
        {reviewStatus}
    </button>
</td>
)}

<td style={centerCell}>
    {medicine.dose ?? "-"}
</td>

<td style={centerCell}>
    {medicine.duration ?? "-"}
</td>

<td style={cell}>

{readOnly ? (

    administrationTimingLabels[
        administrationTiming
    ] ?? "-"

) : (

<select
    value={administrationTiming}
    onChange={(event) =>
        onAdministrationTimingChange(
            index,
            event.target.value
        )
    }
    style={selectStyle}
>
    <option value="NOT_SPECIFIED">
        Select Timing
    </option>

    {Object.entries(administrationTimingLabels)
        .filter(
            ([value]) =>
                value !== "NOT_SPECIFIED"
        )
        .map(([value, label]) => (
            <option
                key={value}
                value={value}
            >
                {label}
            </option>
        ))}
</select>

)}

</td>

            </tr>

            {expanded && (

                <tr>

                    <td
    colSpan={5}
    style={expandedCell}
>

                        <div style={reviewContainer}>

                            <div style={reviewTitle}>
                                Review Medicine
                            </div>

                            <label style={radioRow}>

<input
    type="radio"
    name={`review-${index}`}
    checked={decision === "CORRECT"}
    onChange={handleMedicineCorrect}
/>

                                This medicine is correct

                            </label>
                            <label style={radioRow}>

<input
    type="radio"
    name={`review-${index}`}
    checked={decision === "CHANGE"}
    onChange={() =>
        setDecision("CHANGE")
}
/>

                                Change medicine

                            </label>

{decision === "CHANGE" && (

    <div style={searchContainer}>

        <label style={label}>
            Search Medicine
        </label>

<>
    <input
        type="text"
        value={searchText}
        placeholder="Search medicine..."
        onChange={(event) =>
            setSearchText(event.target.value)
        }
        style={searchInput}
    />

    {searchText.trim().length > 0 && (

        <div style={suggestionContainer}>

            {
suggestions
    .filter(medicine =>
        medicine.brandName
            .toLowerCase()
            .includes(search) ||

(medicine.genericName ?? "")
    .toLowerCase()
    .includes(search)
    )
                
                .map(medicine => (

                    <button
    key={medicine.id}
    type="button"
    style={suggestionButton}
    onClick={() =>
        handleMedicineSelected(medicine)
    }
>
                        <>
    <strong>
        {medicine.brandName}
    </strong>

    {medicine.genericName && (
        <>
            {" "}
            ({medicine.genericName})
        </>
    )}
</>
                    </button>

                ))}

        </div>

    )}

</>

    </div>

)}

                        </div>

                    </td>

                </tr>

            )}

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
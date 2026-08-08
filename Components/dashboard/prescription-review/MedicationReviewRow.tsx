"use client";

// Remove useEffect.
// Keep useMemo and useState only if still used after your previous changes.
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    ExtractedPrescriptionMedicine,
} from "@/lib/prescription-image/prescriptionImageTypes";

import type {
    MedicineMaster,
} from "@/lib/medication/types/medicineMaster";

import {
    MedicineResolverImpl,
} from "@/lib/medication/resolver/MedicineResolverImpl";

import type {
    PrescriptionMedicineRecord,
    PrescriptionValidationStatus,
} from "@/lib/prescription/prescriptionTypes";

export type MedicineReviewStatus =
    | "REVIEW"
    | "VERIFIED"
    | "EXCLUDED";

interface MedicineRowProps {

    medicine: ExtractedPrescriptionMedicine;

    index: number;

    administrationTiming: string;

    administrationTimingLabels: Record<string, string>;

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

export default function MedicationReviewRow({

    medicine,

    index,

    administrationTiming,

    administrationTimingLabels,

    readOnly,

    onAdministrationTimingChange,

    onMedicineUpdated,

}: MedicineRowProps) {

// ReviewDecision moved to MedicationReviewRow.tsx

// Review state moved to MedicationReviewRow.tsx

const resolver = useMemo(
    () => new MedicineResolverImpl(),
    []
);

const [
    searchText,
    setSearchText,
] = useState(
    medicine.name
);

const [
    suggestions,
    setSuggestions,
] = useState<
    MedicineMaster[]
>([]);

const [
    selectedDose,
    setSelectedDose,
] = useState(
    medicine.strength ?? ""
);

const [
    selectedMedicine,
    setSelectedMedicine,
] = useState<
    MedicineMaster | null
>(null);

const [
    availableStrengths,
    setAvailableStrengths,
] = useState<string[]>([]);

const [
    selectedFrequency,
    setSelectedFrequency,
] = useState(
    medicine.frequency ?? ""
);

const durationValue =
    (medicine.duration ?? "").trim();

const durationParts =
    durationValue.length > 0
        ? durationValue.split(/\s+/)
        : [];

const [
    selectedDuration,
    setSelectedDuration,
] = useState(
    durationParts[0] || "30"
);

const [
    selectedDurationUnit,
    setSelectedDurationUnit,
] = useState(
    durationParts[1] || "Days"
);

useEffect(() => {

    const parts =
        (medicine.duration ?? "").split(" ");

    setSelectedDuration(
        parts[0] || "30"
    );

    setSelectedDurationUnit(
        parts[1] || "Days"
    );

}, [medicine.duration]);



const [
    reviewStatus,
    setReviewStatus,
] = useState<MedicineReviewStatus>(
    (medicine.reviewStatus as MedicineReviewStatus)
        ?? "REVIEW"
);

useEffect(() => {

    setReviewStatus(
        (medicine.reviewStatus as MedicineReviewStatus)
            ?? "REVIEW"
    );

}, [medicine.reviewStatus]);


useEffect(() => {

    if (!medicine.name) {

        setAvailableStrengths([]);
        return;

    }

    resolver
        .getStrengthsByBrandName(
            medicine.name
        )
        .then(strengths => {

            setAvailableStrengths(
                strengths
            );

        });

}, [
    medicine.name,
    resolver
]);

    return (
        <>
            <tr>

<td style={cell}>

    <div
        style={{
            ...medicineContainer,
            position: "relative",
        }}
    >

        <input
            type="text"
            value={searchText}
            placeholder="Search medicine..."
            onChange={(event) => {

                const value =
                    event.target.value;

                setSearchText(value);

                if (
                    value.trim().length < 2
                ) {

                    setSuggestions([]);

                    return;

                }

resolver
    .search(value)
    .then(results => {

        const uniqueMedicines =
            results.filter(
                (
                    medicine,
                    index,
                    array
                ) =>

                    index ===
                    array.findIndex(
                        item =>
                            item.brandName ===
                            medicine.brandName
                    )
            );

        setSuggestions(
            uniqueMedicines
        );

    });

            }}
            style={searchInput}
        />

        {
            suggestions.length > 0 && (

                <div style={suggestionContainer}>

                    {
                        suggestions.map(
                            (item) => (

                                <button
                                    key={item.id}
                                    type="button"
                                    style={suggestionButton}
onClick={async () => {

    setSelectedMedicine(item);

    setSearchText(item.brandName);

    const strengths =
        await resolver.getStrengthsByBrandName(
            item.brandName
        );

    setAvailableStrengths(
        strengths
    );

    const selectedStrength =
        strengths.includes(
            medicine.strength ?? ""
        )
            ? medicine.strength ?? ""
            : (
                strengths[0] ??
                item.strength ??
                ""
            );

    setSelectedDose(
        selectedStrength
    );

    setSuggestions([]);

    onMedicineUpdated(
        index,
        {

            ...medicine,

            name:
                item.brandName,

            strength:
                selectedStrength,

        }
    );

}}
                                >

<strong>

    {item.brandName}

    {
        item.strength
            ? ` ${item.strength}`
            : ""
    }

</strong>
                                </button>

                            )
                        )
                    }

                </div>

            )
        }

    </div>

</td>

{/* Review handled by MedicationReviewRow */}

<td style={centerCell}>

<select
    value={selectedDose}
    onChange={(event) => {

        const value =
            event.target.value;

        setSelectedDose(
            value
        );

        onMedicineUpdated(
            index,
            {

                ...medicine,

                strength:
                    value,

            }
        );

    }}
    style={{
        ...selectStyle,
        minWidth: "90px",
        width: "90px",
    }}
>

        {
    availableStrengths.length > 0 ? (

        availableStrengths.map(
            (strength) => (

                <option
                    key={strength}
                    value={strength}
                >
                    {strength}
                </option>

            )
        )

    ) : (

        <option value={selectedDose}>
            {selectedDose || "-"}
        </option>

    )
}

</select>

</td>

<td style={centerCell}>

<select
    value={selectedFrequency}
    onChange={(event) => {

        const value =
            event.target.value;

        setSelectedFrequency(
            value
        );

        onMedicineUpdated(
            index,
            {

                ...medicine,

                frequency:
                    value,

            }
        );

    }}
    style={selectStyle}
>

<option value="ONCE_DAILY">
    Once Daily
</option>

<option value="TWICE_DAILY">
    Twice Daily
</option>

<option value="THREE_TIMES_DAILY">
    Three Times Daily
</option>

<option value="FOUR_TIMES_DAILY">
    Four Times Daily
</option>

<option value="AS_NEEDED">
    As Needed
</option>

<option value="WEEKLY">
    Weekly
</option>

<option value="MONTHLY">
    Monthly
</option>

<option value="OTHER">
    Other
</option>

</select>

</td>

<td style={centerCell}>

    <div
        style={{
            display: "flex",
            gap: "6px",
        }}
    >

<select
    value={selectedDuration}
    onChange={(event) => {

        const value =
            event.target.value;

        setSelectedDuration(
            value
        );

        onMedicineUpdated(
            index,
            {

                ...medicine,

                duration:
                    `${value} ${selectedDurationUnit}`,

            }
        );

    }}
    style={durationValueStyle}
>

            {
                Array.from(
                    { length: 90 },
                    (_, i) => i + 1
                ).map(value => (

                    <option
                        key={value}
                        value={value}
                    >
                        {value}
                    </option>

                ))
            }

        </select>

<select
    value={selectedDurationUnit}
    onChange={(event) => {

        const value =
            event.target.value;

        setSelectedDurationUnit(
            value
        );

        onMedicineUpdated(
            index,
            {

                ...medicine,

                duration:
                    `${selectedDuration} ${value}`,

            }
        );

    }}
    style={durationUnitStyle}
>

            <option>Days</option>
            <option>Weeks</option>
            <option>Months</option>

        </select>

    </div>

</td>

<td style={cell}>

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

        {
            Object.entries(
                administrationTimingLabels
            ).map(([value, label]) => (

                <option
                    key={value}
                    value={value}
                >
                    {label}
                </option>

            ))
        }

    </select>

</td>

<td style={centerCell}>

    {
        readOnly ? (

            <span
                style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "13px",
                    background:
                        (
                            (medicine.reviewStatus as MedicineReviewStatus)
                            ?? reviewStatus
                        ) === "VERIFIED"
                            ? "#dcfce7"
                            : "#fef3c7",
                    color:
                        (
                            (medicine.reviewStatus as MedicineReviewStatus)
                            ?? reviewStatus
                        ) === "VERIFIED"
                            ? "#166534"
                            : "#92400e",
                }}
            >
                {
                    (
                        (medicine.reviewStatus as MedicineReviewStatus)
                        ?? reviewStatus
                    ) === "VERIFIED"
                        ? "Validated"
                        : "Pending Validation"
                }
            </span>

        ) : (

            <select
                value={
                    (medicine.reviewStatus as MedicineReviewStatus)
                    ?? reviewStatus
                }
                onChange={(event) => {

                    const value =
                        event.target.value as
                        MedicineReviewStatus;

                    setReviewStatus(value);

                    onMedicineUpdated(
                        index,
                        {

                            ...medicine,

                            reviewStatus: value,

                        }
                    );

                }}
                style={selectStyle}
            >

<option value="REVIEW">
    To be validated with Doctor
</option>

<option value="VERIFIED">
    Validated
</option>

<option value="EXCLUDED">
    Exclude
</option>

            </select>

        )
    }

</td>

            </tr>

{/* Medication review moved to MedicationReviewRow.tsx */}
</>
    );
}

const cell: React.CSSProperties = {
    padding: "12px 6px",
    borderBottom: "1px solid #e2e8f0",
    color: "#111827",
    verticalAlign: "top",
};

const centerCell: React.CSSProperties = {
    ...cell,
    textAlign: "left",
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
    width: "92%",
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
    minWidth: "100px",
};

const durationValueStyle: React.CSSProperties = {

    ...selectStyle,

    width: "58px",

    minWidth: "58px",

};

const durationUnitStyle: React.CSSProperties = {

    ...selectStyle,

    width: "80px",

    minWidth: "80px",

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
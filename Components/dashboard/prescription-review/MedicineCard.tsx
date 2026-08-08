"use client";

import { useState } from "react";

import type {
    ExtractedPrescription,
    ExtractedPrescriptionMedicine,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import MedicineRow from "./MedicineRow";
import MedicationReviewRow from "./MedicationReviewRow";

interface MedicineCardProps {

    prescription: ExtractedPrescription;

    medicineTimings: string[];

    reviewMode: boolean;

    reviewCompleted: boolean;

    readOnly: boolean;

    onMedicineTimingChange: (
        index: number,
        value: string
    ) => void;

    onReviewStatusChange: (
        index: number,
        status: "REVIEW" | "VERIFIED"
    ) => void;

    onMedicineUpdated: (
        index: number,
        medicine: ExtractedPrescriptionMedicine
    ) => void;

}

export default function MedicineCard({

    prescription,

    medicineTimings,

    reviewMode,

    reviewCompleted,

    readOnly,

    onMedicineTimingChange,

    onReviewStatusChange,

    onMedicineUpdated,

}: MedicineCardProps) {

const {
    t,
} = useLanguage();

const [
    editingMedicineIndex,
    setEditingMedicineIndex,
] = useState<number | null>(null);

const administrationTimingLabels: Record<string, string> = {

    NOT_SPECIFIED:
        t("medication.notSpecified"),

    BEFORE_FOOD:
        t("medication.beforeFood"),

    AFTER_FOOD:
        t("medication.afterFood"),

    WITH_FOOD:
        t("medication.withFood"),

    EMPTY_STOMACH:
        t("medication.emptyStomach"),

    BEFORE_BREAKFAST:
        t("medication.beforeBreakfast"),

    AFTER_BREAKFAST:
        t("medication.afterBreakfast"),

    BEFORE_LUNCH:
        t("medication.beforeLunch"),

    AFTER_LUNCH:
        t("medication.afterLunch"),

    BEFORE_DINNER:
        t("medication.beforeDinner"),

    AFTER_DINNER:
        t("medication.afterDinner"),

    MORNING:
        t("medication.morning"),

    AFTERNOON:
        t("medication.afternoon"),

    EVENING:
        t("medication.evening"),

    NIGHT:
        t("medication.night"),

    AT_BEDTIME:
        t("medication.atBedtime"),

    WEEKLY:
        t("medication.weekly"),

    MONTHLY:
        t("medication.monthly"),

    ALTERNATE_DAY:
        t("medication.alternateDay"),

    SOS:
        t("medication.sos"),

    AS_DIRECTED:
        t("medication.asDirected"),

};


    return (
        <>

    <div style={informationBox}>

        <div style={informationTitle}>
            ℹ️ {t("medication.importantAdministrationTiming")}
        </div>

        <p style={informationText}>
            <strong> {t("medication.administrationTimingInfo1")}
            </strong>
        </p>

        <p style={informationText}>
            <strong>
                {t("medication.administrationTimingInfo2")}
            </strong>
        </p>

        <p style={informationText}>
            {t("medication.administrationTimingInfo3")}
        </p>

    </div>

    {prescription.medicines.length > 0 && (

        <section style={section} className="medication-section">

            <h3 style={sectionTitle}>
                {t("medication.medicationsPrescribed")}
            </h3>

            {
                prescription.medicines.length === 0 ? (

                    <p style={sectionValue}>
                        {t("medication.noMedicinesDetected")}
                    </p>

                ) : (

                    <table style={table} className="medication-table">

                        <thead>

                            <tr>

<th
    style={{
        ...headerCell,
        width: "42%",
    }}
>
    {t("medication.medicine")}
</th>

{/* Review column removed.
    Review now happens in MedicationReviewCard. */}

<th
    style={{
        ...headerCell,
        width: "12%",
    }}
>
    {t("medication.dose")}
</th>

<th
    style={{
        ...headerCell,
        width: "12%",
    }}
>
    {t("medication.frequency")}
</th>

<th
    style={{
        ...headerCell,
        width: "14%",
    }}
>
    {t("medication.duration")}
</th>

<th
    style={{
        ...headerCell,
        width:
    reviewMode
        ? "16%"
        : reviewCompleted
            ? "16%"
            : "20%",
    }}
>
    {t("medication.administrationTiming")}
</th>

{
    reviewMode && (

        <th
            style={{
                ...headerCell,
                width: "18%",
            }}
        >
            User Acceptance
        </th>

    )
}

{
    (reviewCompleted || readOnly) && (

        <th
            style={{
                ...headerCell,
                width: "18%",
            }}
        >
            Validation Status
        </th>

    )
}

                            </tr>

                        </thead>

                        <tbody>

                            {

prescription.medicines.map((medicine, index) => (

reviewMode

? (

<MedicationReviewRow
    key={`${medicine.name}-${index}`}
    medicine={medicine}
    index={index}
    administrationTiming={
        medicineTimings[index]
    }
    administrationTimingLabels={
        administrationTimingLabels
    }
    readOnly={readOnly}
    onAdministrationTimingChange={
        onMedicineTimingChange
    }
    onMedicineUpdated={
        onMedicineUpdated
    }
/>

)

: (

<MedicineRow
    key={`${medicine.name}-${index}`}
    medicine={medicine}
    index={index}
    administrationTiming={
        medicineTimings[index]
    }
    administrationTimingLabels={
        administrationTimingLabels
    }
    reviewCompleted={
        reviewCompleted
    }
    readOnly={readOnly}
    onAdministrationTimingChange={
        onMedicineTimingChange
    }
    onMedicineUpdated={
        onMedicineUpdated
    }
/>

)

))

                            }

                        </tbody>

                    </table>

                )

            }

        </section>

    )}

</>
    );
}

const section: React.CSSProperties = {
    marginBottom: "24px",
    padding: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
};

const sectionTitle: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
};

const sectionValue: React.CSSProperties = {
    margin: 0,
    color: "#374151",
    lineHeight: 1.7,
};

const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
};

const headerCell: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e2e8f0",
    background: "#f8fafc",
    fontWeight: 700,
    color: "#334155",
};



const informationBox: React.CSSProperties = {
    marginTop: "18px",
    padding: "16px",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    backgroundColor: "#eff6ff",
};

const informationTitle: React.CSSProperties = {
    fontWeight: 700,
    color: "#1d4ed8",
    marginBottom: "10px",
    fontSize: "15px",
};

const informationText: React.CSSProperties = {
    margin: "0 0 8px",
    color: "#374151",
    lineHeight: 1.6,
    fontSize: "14px",
};
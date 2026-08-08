"use client";

import { useEffect, useState } from "react";

import {
    prescriptionStorage,
} from "@/lib/prescription/prescriptionStorage";

import type {
    CompletePrescriptionRecord,
    PrescriptionMedicineRecord,
} from "@/lib/prescription/prescriptionTypes";

import PendingMedicationRow
    from "@/Components/dashboard/PendingMedicationRow";

interface PendingMedicationValidationProps {

    userId: string;

    patientId: string | null;

    familyId: string | null;

    recordContext: "SELF" | "FAMILY";

    onClose: () => void;

    onSaveComplete: () => Promise<void>;
}

export default function PendingMedicationValidation({

    userId,

    patientId,

    familyId,

    recordContext,

    onClose,

    onSaveComplete,

}: PendingMedicationValidationProps) {

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [prescriptionId, setPrescriptionId] =
        useState("");

    const [pendingMedicines, setPendingMedicines] =
        useState<PrescriptionMedicineRecord[]>([]);

    useEffect(() => {

        loadPendingMedicines();

    }, []);

    async function loadPendingMedicines() {

        setLoading(true);

        const prescription =
            await prescriptionStorage
                .getPendingMedicationValidation({

                    userId,

                    patientId,

                    familyId,

                    recordContext,

                });

        if (!prescription) {

            setLoading(false);

            return;

        }

        setPrescriptionId(
            prescription.prescription.id
        );

        setPendingMedicines(

            prescription.medicines.filter(

                medicine =>

                    medicine.validationStatus === "PENDING"

            )

        );

        setLoading(false);

    }


    async function save() {

        setSaving(true);

try {

    await prescriptionStorage
        .updatePendingMedicines(

            prescriptionId,

            pendingMedicines

        );

    const remainingPending =
        pendingMedicines.filter(
            medicine =>
                medicine.validationStatus === "PENDING"
        );

    if (remainingPending.length === 0) {

        alert(
            "All medicines have been validated successfully."
        );

    } else {

        alert(
            `${remainingPending.length} medicine(s) are still pending validation.`
        );

    }

await onSaveComplete();

onClose();

}
catch (error) {

    alert(
        error instanceof Error
            ? error.message
            : "Unable to save medicines."
    );

}
finally {

    setSaving(false);

}

    }

    if (loading) {

        return (
            <div>
                Loading pending medicines...
            </div>
        );

    }

    return (

        <div>

            <div
    style={{
        marginBottom: "20px",
    }}
>

    <h2
        style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
        }}
    >
        Review & Validate Medicines
    </h2>

    <p
        style={{
            marginTop: "8px",
            color: "#6B7280",
            fontSize: "15px",
            lineHeight: "22px",
        }}
    >
        Review the extracted medicines, make corrections if required, then validate and save.
    </p>

</div>

<div
    style={{
        marginTop: "24px",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
    }}
>

<table
    style={{
        width: "100%",
        minWidth: "900px",
        borderCollapse: "collapse",
    }}
>

        <thead>

            <tr
                style={{
                    background: "#F9FAFB",
                }}
            >

<th style={headerStyle}>Medicine</th>
<th style={headerStyle}>Dose</th>
<th style={headerStyle}>Frequency</th>
<th style={headerStyle}>Duration</th>
<th style={headerStyle}>Timing</th>
<th style={headerStyle}>Status</th>

            </tr>

        </thead>

        <tbody>

{pendingMedicines.map((medicine, index) => (

    <PendingMedicationRow

        key={medicine.id}

        medicine={medicine}

        userId={userId}

        onChange={(updatedMedicine) => {

            const medicines = [
                ...pendingMedicines
            ];

            medicines[index] =
                updatedMedicine;

            setPendingMedicines(
                medicines
            );

        }}

    />

))}

        </tbody>

    </table>

</div>

<div
    style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "24px",
    }}
>

    <button
        type="button"
        onClick={save}
        disabled={saving}
        style={{
            padding: "12px 32px",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
        }}
    >

        {saving ? "Saving..." : "Save"}

    </button>

</div>

        </div>

    );

}

const headerStyle: React.CSSProperties = {

    padding: "12px",

    textAlign: "left",

    fontWeight: 700,

    borderBottom: "1px solid #E5E7EB",

};

const cellStyle: React.CSSProperties = {

    padding: "12px",

    borderBottom: "1px solid #F3F4F6",

    verticalAlign: "middle",

};
"use client";

import { useEffect, useMemo, useState } from "react";

import { prescriptionRepository } from "@/lib/prescription/prescriptionRepository";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    mapPrescriptionToReview,
} from "@/lib/prescription/prescriptionReviewMapper";

import PrescriptionReview
from "@/Components/dashboard/PrescriptionReview";

interface PrescriptionHistoryWorkspaceProps {
    userId: string;
    recordContext: "SELF" | "FAMILY";
    patientId: string | null;
    patientName: string;
}

interface PrescriptionSummary {
    id: string;

    consultationDate: string | null;

    doctorName: string | null;

    hospitalOrClinic: string | null;

    diagnosisOrAssessment: string | null;

    consultationMode: string | null;

    createdAt: string;

    medicineCount: number;
}

type FilterMode =
    | "LATEST"
    | "DATE_RANGE";

export default function PrescriptionHistoryWorkspace({

    userId,

    recordContext,

    patientId,

    patientName,

}: PrescriptionHistoryWorkspaceProps) {

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        prescriptions,

        setPrescriptions

    ] = useState<PrescriptionSummary[]>([]);

const [

    selectedPrescription,

    setSelectedPrescription

] = useState<PrescriptionSummary | null>(null);

    const [

        filterMode,

        setFilterMode

    ] = useState<FilterMode | null>(null);

    const [

        fromDate,

        setFromDate

    ] = useState("");

    const [

        toDate,

        setToDate

    ] = useState("");

const [

    showRetrieve,

    setShowRetrieve

] = useState(false);

const [

    hasRetrieved,

    setHasRetrieved

] = useState(false);

const [

    validationMessage,

    setValidationMessage

] = useState("");


const [

    reviewPrescription,

    setReviewPrescription

] = useState<ExtractedPrescription | null>(null);

const [

    reviewMode,

    setReviewMode

] = useState<"UPLOAD" | "VIEW" | null>(
    null
);


const [

    summary,

    setSummary

] = useState<{

    total: number;

    earliestDate: string | null;

} | null>(null);

useEffect(() => {

    async function loadSummary() {

        try {

            const result =
                await prescriptionRepository.getPrescriptionSummary(

                    userId,

                    recordContext,

                    patientId

                );

            setSummary(
                result
            );

        }

        catch (error) {

            console.error(

                "Unable to load prescription summary.",

                error

            );

        }

    }

    void loadSummary();

},
[
    userId,
    patientId,
    recordContext,
]

);

async function handleRetrieve() {

setValidationMessage("");

if (

    filterMode === "DATE_RANGE"

) {

    if (

        !fromDate ||

        !toDate

    ) {

        setValidationMessage(

            "Please select both From and To dates."

        );

        return;

    }

    if (

        toDate < fromDate

    ) {

        setValidationMessage(

            "To date cannot be earlier than From date."

        );

        return;

    }

}

setLoading(true);

setHasRetrieved(true);

    try {

        const result =
            await prescriptionRepository.getPrescriptionHistory(

                userId,

                recordContext,

                patientId,

                filterMode === "DATE_RANGE"
                    ? fromDate || undefined
                    : undefined,

                filterMode === "DATE_RANGE"
                    ? toDate || undefined
                    : undefined

            );

        setPrescriptions(result);

setSelectedPrescription(

    result.length > 0
        ? result[0]
        : null

);

if (

    result.length === 0

) {

    setReviewMode(
        null
    );

    setReviewPrescription(
        null
    );

}

    }
catch (error) {

    console.error(
        "Unable to load prescriptions.",
        error
    );

    setPrescriptions([]);

    setSelectedPrescription(
        null
    );

    setReviewMode(
        null
    );

    setReviewPrescription(
        null
    );

}
    finally {

        setLoading(false);

    }

}

    const latestPrescription =
        useMemo(() => {

            if (
                prescriptions.length === 0
            ) {

                return null;

            }

            return prescriptions[0];

        }, [prescriptions]);

    const history =
        useMemo(() => {

            if (
                prescriptions.length <= 1
            ) {

                return [];

            }

            return prescriptions.slice(1);

        }, [prescriptions]);

    return (

        <section style={cardStyle}>

{
    summary &&
    summary.total > 0 && (

        <div style={subTitleStyle}>

            📅{" "}

            <strong>

                Available from{" "}

                {
                    summary.earliestDate
                        ? new Date(
                              summary.earliestDate
                          ).toLocaleDateString(
                              "en-GB",
                              {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                              }
                          )
                        : "-"
                }

            </strong>

        </div>

    )

}

            {/* Filter */}

{

summary?.total === 0 ? (

    <section style={filterCard}>

        <div style={emptyCard}>

            <div style={emptyIcon}>

                📄

            </div>

            <h3 style={emptyTitle}>

                No prescriptions uploaded yet

            </h3>

            <p style={emptyText}>

                Upload your first prescription to start building your prescription history.

            </p>

        </div>

    </section>

) : (

<section style={filterCard}>

<div style={optionRow}>

    <button
        type="button"
onClick={async () => {

    setValidationMessage("");

    setFilterMode("LATEST");

    setShowRetrieve(false);

    setHasRetrieved(true);

    try {

        setLoading(true);

        const result =
            await prescriptionRepository.getPrescriptionHistory(

                userId,

                recordContext,

                patientId

            );

        setPrescriptions(result);

        setSelectedPrescription(

            result.length > 0
                ? result[0]
                : null

        );

    }

catch (error) {

    console.error(
        "Unable to load prescriptions.",
        error
    );

    setPrescriptions([]);

    setSelectedPrescription(
        null
    );

    setReviewMode(
        null
    );

    setReviewPrescription(
        null
    );

}

    finally {

        setLoading(false);

    }

}}
        style={{
            ...optionButton,
            ...(filterMode === "LATEST"
                ? selectedOptionButton
                : {}),
        }}
    >

        Show Latest

    </button>

    <button
        type="button"
        onClick={() => {

setValidationMessage("");

setFromDate("");

setToDate("");


setFilterMode("DATE_RANGE");

setShowRetrieve(true);

setHasRetrieved(false);

setPrescriptions([]);

setSelectedPrescription(null);

}}
        style={{
            ...optionButton,
            ...(filterMode === "DATE_RANGE"
                ? selectedOptionButton
                : {}),
        }}
    >

        Search by Date Range

    </button>

</div>

                {

                    filterMode === "DATE_RANGE" && (

                        <div style={dateGrid}>

                            <div>

                                <label style={labelStyle}>

                                    From

                                </label>

                                <input

                                    type="date"

                                    value={fromDate}

onChange={(event) => {

    setValidationMessage("");

    setFromDate(
        event.target.value
    );

}}

                                    style={inputStyle}

                                />

                            </div>

                            <div>

                                <label style={labelStyle}>

                                    To

                                </label>

                                <input

                                    type="date"

                                    value={toDate}

onChange={(event) => {

    setValidationMessage("");

    setToDate(
        event.target.value
    );

}}
                                    style={inputStyle}

                                />

                            </div>

                        </div>

                    )

                }

{
    validationMessage && (

        <div style={validationText}>

            {validationMessage}

        </div>

    )

}

{
    showRetrieve &&
    filterMode === "DATE_RANGE" && (

        <div style={retrieveButtonRow}>

<button
    type="button"

    disabled={
        !fromDate ||
        !toDate ||
        toDate < fromDate
    }

    style={{
        ...primaryButton,

        opacity:
            !fromDate ||
            !toDate ||
            toDate < fromDate
                ? 0.5
                : 1,

        cursor:
            !fromDate ||
            !toDate ||
            toDate < fromDate
                ? "not-allowed"
                : "pointer",

    }}
                onClick={() => {

                    void handleRetrieve();

                }}
            >

                Retrieve

            </button>

        </div>

    )

}

</section>

)
}

            {loading && (

                <div style={emptyCard}>

                    Loading prescriptions...

                </div>

            )}

{
    !loading &&
    hasRetrieved &&
    summary &&
    summary.total > 0 &&
    prescriptions.length === 0 && (

        <div style={emptyCard}>

            <div style={emptyIcon}>

                🔍

            </div>

            <h3 style={emptyTitle}>

                No prescriptions found

            </h3>

            <p style={emptyText}>

                No prescriptions were found for the selected date range.

                Try expanding your search.

            </p>

        </div>

    )

}

            {!loading && latestPrescription && (

                <>

                    <section style={latestCard}>

                        <div style={sectionHeader}>

                            <h3 style={sectionTitle}>
                                ⭐ Latest Prescription
                            </h3>

                        </div>

                        <div style={summaryGrid}>

                            <SummaryItem
                                label="Consultation Date"
                                value={
                                    latestPrescription.consultationDate ??
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Doctor"
                                value={
                                    latestPrescription.doctorName ??
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Hospital"
                                value={
                                    latestPrescription.hospitalOrClinic ??
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Diagnosis"
                                value={
                                    latestPrescription.diagnosisOrAssessment ??
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Consultation"
                                value={
                                    latestPrescription.consultationMode ??
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Medicines"
                                value={`${latestPrescription.medicineCount}`}
                            />

                        </div>

                        <div style={buttonRow}>

                            <button
                                type="button"
                                style={primaryButton}
onClick={async () => {

    if (!latestPrescription) {

        return;

    }

    const record =
        await prescriptionRepository.getPrescriptionDetails(
            latestPrescription.id
        );

    const review =
        mapPrescriptionToReview(
            record
        );

    setReviewPrescription(
        review
    );

    setReviewMode(
        "VIEW"
    );

}}

>

                                View Prescription

                            </button>

                        </div>

                    </section>

{
    reviewMode === "VIEW" &&
    reviewPrescription && (

        <PrescriptionReview

            prescription={reviewPrescription}

            patientName={patientName}

            recordContext={recordContext}

            mode="VIEW"

            saving={false}

            onReupload={() => {}}

            onConfirm={() => {}}

        />

    )

}

{history.length > 0 ? (

    <section style={historyCard}>

        <h3 style={sectionTitle}>

            📚 Prescription History

        </h3>

        {history.map(

            (item) => (

                <div
                    key={item.id}
                    style={historyItem}
                >

                    <div>

                        <strong>

                            {item.consultationDate ?? "-"}

                        </strong>

                        <div style={historyText}>

                            {item.doctorName ?? "-"}

                        </div>

                        <div style={historyText}>

                            {item.hospitalOrClinic ?? "-"}

                        </div>

                    </div>

                    <button
                        type="button"
                        style={secondaryButton}
onClick={async () => {

    const record =
        await prescriptionRepository.getPrescriptionDetails(
            item.id
        );

    const review =
        mapPrescriptionToReview(
            record
        );

    setReviewPrescription(
        review
    );

    setReviewMode(
        "VIEW"
    );

}}
                    >

                        View

                    </button>

                </div>

            )

        )}

    </section>

) : (

    hasRetrieved &&
    latestPrescription && (

        <section style={historyCard}>

            <h3 style={sectionTitle}>

                📚 Prescription History

            </h3>

            <p style={emptyText}>

                No historical prescriptions found for this patient.

            </p>

        </section>

    )

)}
                </>

            )}

        </section>

    );

}

function SummaryItem({

    label,

    value,

}: {

    label: string;

    value: string;

}) {

    return (

        <div style={summaryItem}>

            <div style={summaryLabel}>

                {label}

            </div>

            <div style={summaryValue}>

                {value}

            </div>

        </div>

    );

}
//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const cardStyle: React.CSSProperties = {

    marginTop: "16px",

    background: "#ffffff",

    border: "1px solid #d1d5db",

    borderRadius: "14px",

    padding: "18px",

};

const titleStyle: React.CSSProperties = {

    margin: 0,

    fontSize: "24px",

    fontWeight: 700,

    color: "#111827",

};

const subTitleStyle: React.CSSProperties = {

    marginTop: "8px",

    marginBottom: "24px",

    color: "#6b7280",

};

const filterCard: React.CSSProperties = {

    padding: "20px",

    border: "1px solid #e5e7eb",

    borderRadius: "12px",

    background: "#f9fafb",

    marginBottom: "24px",

};

const dateGrid: React.CSSProperties = {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

    gap: "16px",

    marginTop: "16px",

};

const optionRow: React.CSSProperties = {

    display: "flex",

    gap: "12px",

    marginBottom: "20px",

};

const optionButton: React.CSSProperties = {

    flex: 1,

    padding: "14px",

    borderRadius: "10px",

    border: "1px solid #d1d5db",

    background: "#ffffff",

    cursor: "pointer",

    fontWeight: 600,

    fontSize: "15px",

};

const selectedOptionButton: React.CSSProperties = {

    border: "2px solid #2563eb",

    background: "#eff6ff",

    color: "#1d4ed8",

};

const labelStyle: React.CSSProperties = {

    display: "block",

    marginBottom: "8px",

    fontWeight: 600,

    color: "#374151",

};

const inputStyle: React.CSSProperties = {

    width: "100%",

    padding: "12px",

    border: "1px solid #d1d5db",

    borderRadius: "10px",

    fontSize: "15px",

    boxSizing: "border-box",

};

const latestCard: React.CSSProperties = {

    border: "2px solid #2563eb",

    borderRadius: "14px",

    padding: "24px",

    background: "#eff6ff",

    marginBottom: "24px",

};

const historyCard: React.CSSProperties = {

    border: "1px solid #d1d5db",

    borderRadius: "14px",

    padding: "24px",

    maxHeight: "420px",

    overflowY: "auto",

};

const sectionHeader: React.CSSProperties = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "20px",

};

const sectionTitle: React.CSSProperties = {

    margin: 0,

    fontSize: "20px",

    fontWeight: 700,

};

const summaryGrid: React.CSSProperties = {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

    gap: "16px",

};

const summaryItem: React.CSSProperties = {

    background: "#ffffff",

    border: "1px solid #dbeafe",

    borderRadius: "10px",

    padding: "14px",

};

const summaryLabel: React.CSSProperties = {

    fontSize: "12px",

    color: "#6b7280",

    marginBottom: "4px",

    textTransform: "uppercase",

};

const summaryValue: React.CSSProperties = {

    fontWeight: 600,

    color: "#111827",

};

const historyItem: React.CSSProperties = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "16px",

    borderBottom: "1px solid #e5e7eb",

};

const historyText: React.CSSProperties = {

    color: "#6b7280",

    marginTop: "4px",

    fontSize: "14px",

};

const buttonRow: React.CSSProperties = {

    marginTop: "20px",

};

const retrieveButtonRow: React.CSSProperties = {

    display: "flex",

    justifyContent: "center",

    marginTop: "18px",

};

const primaryButton: React.CSSProperties = {

    padding: "12px 20px",

    background: "#2563eb",

    color: "#ffffff",

    border: "none",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: 600,

};

const secondaryButton: React.CSSProperties = {

    padding: "10px 16px",

    background: "#ffffff",

    border: "1px solid #d1d5db",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: 600,

};

const emptyCard: React.CSSProperties = {

    textAlign: "center",

    padding: "48px 20px",

    border: "1px dashed #d1d5db",

    borderRadius: "14px",

    background: "#fafafa",

};

const emptyIcon: React.CSSProperties = {

    fontSize: "48px",

    marginBottom: "16px",

};

const emptyTitle: React.CSSProperties = {

    margin: 0,

    marginBottom: "8px",

};

const emptyText: React.CSSProperties = {

    color: "#6b7280",

};

const validationText: React.CSSProperties = {

    marginTop: "12px",

    color: "#dc2626",

    fontWeight: 600,

    fontSize: "14px",

    textAlign: "center",

};
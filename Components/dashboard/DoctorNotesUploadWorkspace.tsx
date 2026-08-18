"use client";

import {
    type ChangeEvent,
    type CSSProperties,
    type DragEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    ConsultationMode,
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    prescriptionImageService,
} from "@/lib/prescription-image/prescriptionImageService";

import {
    healthcareStorage,
} from "@/lib/healthcare/healthcareStorage";

import type {
    HealthcareFacility,
} from "@/lib/healthcare/healthcareTypes";

import DoctorNotesReview
    from "@/Components/dashboard/doctorNotes/DoctorNotesReview";

// ============================================================
// Types
// ============================================================

interface ReadingProgressProps {
    label: string;
    message: string;
}

export interface DoctorNotesUploadWorkspaceProps {
    mode: "self" | "family";
    patientId?: string | null;
    patientName?: string;
    currentUserName?: string;
    captureMode?: "MANUAL" | "UPLOAD";
    onCancel?: () => void;
}

interface SelectedDocument {
    id: string;
    file: File;
    type: "IMAGE" | "PDF";
    previewUrl?: string;
}

// ============================================================
// Helpers
// ============================================================

function getTodayDate(): string {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");
}

function toDateInputValue(
    value: string | null | undefined
): string {
    if (!value) {
        return "";
    }

    const trimmed = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }

    const ddmmyyyy = trimmed.match(
        /^(\d{2})-(\d{2})-(\d{4})$/
    );

    if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        return `${year}-${month}-${day}`;
    }

    const ddmmyyyySlash = trimmed.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (ddmmyyyySlash) {
        const [, day, month, year] = ddmmyyyySlash;
        return `${year}-${month}-${day}`;
    }

    return "";
}

// ============================================================
// Shared workspace styles
// Review-page styles intentionally do NOT live here.
// Part 1 / Part 2 are owned by DoctorNotesReview.
// ============================================================

const pageStyle: CSSProperties = {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
};

const cardStyle: CSSProperties = {
    width: "100%",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    background: "#FFFFFF",
    padding: "20px",
    boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
};

const fieldStyle: CSSProperties = {
    width: "100%",
    minHeight: "42px",
    padding: "9px 10px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#FFFFFF",
    color: "#111827",
    boxSizing: "border-box",
};

const readOnlyFieldStyle: CSSProperties = {
    ...fieldStyle,
    display: "flex",
    alignItems: "center",
    background: "#F8FAFC",
};

const primaryButtonStyle: CSSProperties = {
    border: "none",
    borderRadius: "10px",
    padding: "11px 22px",
    background: "#7043F5",
    color: "#FFFFFF",
    fontWeight: 700,
    cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    padding: "11px 18px",
    background: "#FFFFFF",
    color: "#374151",
    fontWeight: 700,
    cursor: "pointer",
};

const disabledButtonStyle: CSSProperties = {
    ...primaryButtonStyle,
    background: "#D1D5DB",
    cursor: "not-allowed",
};

const confirmationCardStyle: CSSProperties = {
    ...cardStyle,
    maxWidth: "1180px",
    margin: "0 auto",
};

const confirmationGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
};

const footerActionsStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "20px",
};

// ============================================================
// Reading Progress
// ============================================================

export function ReadingProgress({
    label,
    message,
}: ReadingProgressProps) {
    return (
        <div
            style={{
                marginTop: "20px",
                padding: "18px",
                borderRadius: "12px",
                background: "#F5F3FF",
                border: "1px solid #DDD6FE",
                color: "#4C1D95",
            }}
        >
            <div
                style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: "12px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#E5E7EB",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "40%",
                        height: "100%",
                        borderRadius: "999px",
                        background: "#7043F5",
                        animation:
                            "carevr-reading-progress 1.2s ease-in-out infinite",
                    }}
                />
            </div>

            <div
                style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#6B7280",
                    textAlign: "center",
                }}
            >
                {message}
            </div>

            <style>{`
                @keyframes carevr-reading-progress {
                    0% {
                        transform: translateX(-120%);
                    }

                    50% {
                        transform: translateX(120%);
                    }

                    100% {
                        transform: translateX(300%);
                    }
                }
            `}</style>
        </div>
    );
}

// ============================================================
// Main Component
// ============================================================

export default function DoctorNotesUploadWorkspace({
    mode,
    patientId,
    patientName,
    currentUserName,
    captureMode = "UPLOAD",
    onCancel,
}: DoctorNotesUploadWorkspaceProps) {
    // --------------------------------------------------------
    // Refs
    // --------------------------------------------------------

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const cameraInputRef =
        useRef<HTMLInputElement | null>(null);

    const pdfInputRef =
        useRef<HTMLInputElement | null>(null);

    const documentsRef =
        useRef<SelectedDocument[]>([]);

    // --------------------------------------------------------
    // State
    // --------------------------------------------------------

    const [
        documents,
        setDocuments,
    ] = useState<SelectedDocument[]>([]);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);

    const [
        isReading,
        setIsReading,
    ] = useState(false);

    const [
        extractedPrescription,
        setExtractedPrescription,
    ] = useState<ExtractedPrescription | null>(
        null
    );

    const [
        doctorName,
        setDoctorName,
    ] = useState("");

    const [
        hospitalOrClinic,
        setHospitalOrClinic,
    ] = useState("");

    const [
        facilities,
        setFacilities,
    ] = useState<HealthcareFacility[]>([]);

    const [
        selectedFacilityId,
        setSelectedFacilityId,
    ] = useState("");

    const [
        loadingFacilities,
        setLoadingFacilities,
    ] = useState(false);

    const [
        consultationDate,
        setConsultationDate,
    ] = useState(getTodayDate());

    const [
        consultationTime,
        setConsultationTime,
    ] = useState("");

    const [
        consultationMode,
        setConsultationMode,
    ] = useState<ConsultationMode | null>(null);

    const [
        consultationLocation,
        setConsultationLocation,
    ] = useState("");

    const [
        manualDoctorNotes,
        setManualDoctorNotes,
    ] = useState("");

    const [
        showDetailsConfirmation,
        setShowDetailsConfirmation,
    ] = useState(false);

    // --------------------------------------------------------
    // Derived values
    // --------------------------------------------------------

    const recordingName =
        mode === "self"
            ? currentUserName ?? "yourself"
            : patientName ?? "your family member";

    const selectedFacility =
        facilities.find(
            facility =>
                facility.id === selectedFacilityId
        );

    const hasPdf =
        documents.some(
            document =>
                document.type === "PDF"
        );

    const hasImages =
        documents.some(
            document =>
                document.type === "IMAGE"
        );

    // --------------------------------------------------------
    // Keep document ref synchronized
    // --------------------------------------------------------

    useEffect(() => {
        documentsRef.current = documents;
    }, [documents]);

    // --------------------------------------------------------
    // Cleanup object URLs on unmount
    // --------------------------------------------------------

    useEffect(() => {
        return () => {
            documentsRef.current.forEach(
                document => {
                    if (document.previewUrl) {
                        URL.revokeObjectURL(
                            document.previewUrl
                        );
                    }
                }
            );
        };
    }, []);

    // --------------------------------------------------------
    // Load active healthcare facilities
    // --------------------------------------------------------

    useEffect(() => {
        let cancelled = false;

        async function loadFacilities() {
            setLoadingFacilities(true);

            try {
                const result =
                    await healthcareStorage
                        .getActiveFacilities();

                if (!cancelled) {
                    setFacilities(result);
                }
            } catch (loadError) {
                console.error(
                    "Unable to load healthcare facilities:",
                    loadError
                );

                if (!cancelled) {
                    setError(
                        "Unable to load hospitals."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingFacilities(false);
                }
            }
        }

        loadFacilities();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================================
    // Document management
    // ========================================================

    const MAX_DOCUMENTS = 5;

    function createDocumentId(): string {
        return `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;
    }

    function addDocuments(
        selectedFiles: FileList | File[]
    ) {
        setError(null);

        const files = Array.from(selectedFiles);

        if (files.length === 0) {
            return;
        }

        const pdfFiles = files.filter(
            file =>
                file.type === "application/pdf"
        );

        const imageFiles = files.filter(
            file =>
                file.type.startsWith("image/")
        );

        const unsupportedFiles = files.filter(
            file =>
                file.type !== "application/pdf" &&
                !file.type.startsWith("image/")
        );

        if (unsupportedFiles.length > 0) {
            setError(
                "Please select image files or PDF documents."
            );
            return;
        }

        // ----------------------------------------------------
        // Prevent mixed PDF + image selection
        // ----------------------------------------------------

        if (
            pdfFiles.length > 0 &&
            imageFiles.length > 0
        ) {
            setError(
                "Please upload either images or PDFs, not both together."
            );
            return;
        }

        // ----------------------------------------------------
        // PDF
        // ----------------------------------------------------

        if (pdfFiles.length > 0) {
            const existingImages =
                documents.some(
                    document =>
                        document.type === "IMAGE"
                );

            if (existingImages) {
                setError(
                    "Please clear the images before uploading PDFs."
                );
                return;
            }

            const remainingSlots =
                MAX_DOCUMENTS - documents.length;

            if (remainingSlots <= 0) {
                setError(
                    `You can upload a maximum of ${MAX_DOCUMENTS} PDFs.`
                );
                return;
            }

            const filesToAdd =
                pdfFiles.slice(
                    0,
                    remainingSlots
                );

            const newDocuments =
                filesToAdd.map(file => ({
                    id: createDocumentId(),
                    file,
                    type: "PDF" as const,
                }));

            setDocuments(previous => [
                ...previous,
                ...newDocuments,
            ]);

            if (
                pdfFiles.length >
                remainingSlots
            ) {
                setError(
                    `Only ${remainingSlots} PDF${
                        remainingSlots === 1
                            ? ""
                            : "s"
                    } could be added. Maximum ${MAX_DOCUMENTS} PDFs allowed.`
                );
            }

            return;
        }

        // ----------------------------------------------------
        // Images
        // ----------------------------------------------------

        if (imageFiles.length > 0) {
            const existingPdf =
                documents.some(
                    document =>
                        document.type === "PDF"
                );

            if (existingPdf) {
                setError(
                    "Please clear the PDFs before uploading images."
                );
                return;
            }

            const remainingSlots =
                MAX_DOCUMENTS - documents.length;

            if (remainingSlots <= 0) {
                setError(
                    `You can upload a maximum of ${MAX_DOCUMENTS} images.`
                );
                return;
            }

            const filesToAdd =
                imageFiles.slice(
                    0,
                    remainingSlots
                );

            const newDocuments =
                filesToAdd.map(file => ({
                    id: createDocumentId(),
                    file,
                    type: "IMAGE" as const,
                    previewUrl:
                        URL.createObjectURL(file),
                }));

            setDocuments(previous => [
                ...previous,
                ...newDocuments,
            ]);

            if (
                imageFiles.length >
                remainingSlots
            ) {
                setError(
                    `Only ${remainingSlots} image${
                        remainingSlots === 1
                            ? ""
                            : "s"
                    } could be added. Maximum ${MAX_DOCUMENTS} images allowed.`
                );
            }
        }
    }

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        if (event.target.files) {
            addDocuments(
                event.target.files
            );
        }

        event.target.value = "";
    }

    function removeDocument(
        documentId: string
    ) {
        setDocuments(previous => {
            const documentToRemove =
                previous.find(
                    document =>
                        document.id ===
                        documentId
                );

            if (
                documentToRemove?.previewUrl
            ) {
                URL.revokeObjectURL(
                    documentToRemove.previewUrl
                );
            }

            return previous.filter(
                document =>
                    document.id !==
                    documentId
            );
        });

        setError(null);
    }

    function clearDocuments() {
        documents.forEach(document => {
            if (document.previewUrl) {
                URL.revokeObjectURL(
                    document.previewUrl
                );
            }
        });

        setDocuments([]);
        setError(null);
        setExtractedPrescription(null);
        setShowDetailsConfirmation(false);
    }

    function handleDrop(
        event: DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
        setIsDragging(false);

        if (event.dataTransfer.files) {
            addDocuments(
                event.dataTransfer.files
            );
        }
    }

    // ========================================================
    // Upload → AI reading
    // ========================================================

    async function handleContinue() {
        if (documents.length === 0) {
            setError(
                "Please upload an image or PDF."
            );
            return;
        }

        if (isReading) {
            return;
        }

        setError(null);
        setExtractedPrescription(null);
        setShowDetailsConfirmation(false);
        setIsReading(true);

        try {
            const result =
                await prescriptionImageService
                    .processFiles(
                        documents.map(
                            document =>
                                document.file
                        ),
                        "DOCTOR_NOTES"
                    );

            if (
                !result.success ||
                !result.data
            ) {
                setError(
                    result.error ??
                        "Unable to read the doctor's notes."
                );
                return;
            }

            const extracted = result.data;

            const resolvedDate =
                toDateInputValue(
                    extracted
                        .encounterIdentity
                        .consultationDate
                );

            const resolvedDoctor =
                extracted
                    .encounterIdentity
                    .doctorName
                    ?.trim() ?? "";

            const resolvedHospital =
                extracted
                    .encounterIdentity
                    .hospitalOrClinic
                    ?.trim() ?? "";

            const resolvedConsultationMode =
                extracted
                    .encounterIdentity
                    .consultationMode
                    ?.trim()
                    .toUpperCase() ?? "";

            const validConsultationModes:
                ConsultationMode[] = [
                    "IN_PERSON",
                    "VIDEO",
                    "PHONE",
                    "WHATSAPP",
                    "EMAIL",
                    "HOME_VISIT",
                    "HOSPITAL_ADMISSION",
                    "HOSPITAL_DISCHARGE",
                    "OTHER",
                ];

            const resolvedMode =
                validConsultationModes.includes(
                    resolvedConsultationMode as ConsultationMode
                )
                    ? (
                        resolvedConsultationMode as ConsultationMode
                    )
                    : null;

            setDoctorName(
                resolvedDoctor
            );

            setHospitalOrClinic(
                resolvedHospital
            );

            setConsultationDate(
                resolvedDate
            );

            setConsultationMode(
                resolvedMode
            );

            setExtractedPrescription(
                extracted
            );

            setShowDetailsConfirmation(
                true
            );
        } catch (readError) {
            console.error(
                "Doctor's Notes Reading Error:",
                readError
            );

            setError(
                readError instanceof Error
                    ? readError.message
                    : "Unable to read the doctor's notes."
            );
        } finally {
            setIsReading(false);
        }
    }

    // ========================================================
    // Return to upload
    // ========================================================

    function handleReupload() {
        documents.forEach(document => {
            if (document.previewUrl) {
                URL.revokeObjectURL(
                    document.previewUrl
                );
            }
        });

        setDocuments([]);
        setExtractedPrescription(null);
        setShowDetailsConfirmation(false);
        setError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (cameraInputRef.current) {
            cameraInputRef.current.value = "";
        }

        if (pdfInputRef.current) {
            pdfInputRef.current.value = "";
        }
    }

    // ========================================================
    // Confirmation
    // ========================================================

    function confirmExtractedDetails() {
        if (!extractedPrescription) {
            return;
        }

        if (!consultationDate) {
            setError(
                "Please select the consultation date."
            );
            return;
        }

        if (!doctorName.trim()) {
            setError(
                "Please enter the doctor's name."
            );
            return;
        }

        if (!consultationMode) {
            setError(
                "Please select the consultation mode."
            );
            return;
        }

        setExtractedPrescription(
            previous => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    encounterIdentity: {
                        ...previous.encounterIdentity,
                        consultationDate,
                        doctorName:
                            doctorName.trim(),
                        hospitalOrClinic:
                            hospitalOrClinic.trim() ||
                            null,
                        consultationMode:
                            consultationMode ||
                            null,
                    },
                };
            }
        );

        setError(null);
        setShowDetailsConfirmation(false);
    }

    // ========================================================
    // Manual capture
    // ========================================================

    function validateManualNotes(): boolean {
        if (!doctorName.trim()) {
            setError(
                "Please enter the doctor's name."
            );
            return false;
        }

        if (!consultationDate) {
            setError(
                "Please select the consultation date."
            );
            return false;
        }

        if (!manualDoctorNotes.trim()) {
            setError(
                "Please enter the doctor's notes."
            );
            return false;
        }

        setError(null);
        return true;
    }

    function handleManualSave() {
        if (!validateManualNotes()) {
            return;
        }

        /*
         * Persistence is intentionally not invented here.
         * The current component has no Doctor's Notes repository
         * contract in its props/imports.
         *
         * This is the complete validated capture payload
         * that the repository layer can consume in the next step.
         */
        console.log(
            "Manual Doctor's Notes ready to save",
            {
                mode,
                patientId:
                    patientId ?? null,
                patientName:
                    recordingName,
                facilityId:
                    selectedFacilityId || null,
                facilityName:
                    selectedFacility?.name ??
                    null,
                doctorName:
                    doctorName.trim(),
                location:
                    consultationLocation.trim() ||
                    null,
                consultationMode,
                consultationDate,
                consultationTime:
                    consultationTime || null,
                notes:
                    manualDoctorNotes.trim(),
            }
        );
    }

    // ========================================================
    // Upload screen
    // ========================================================

    function renderUploadScreen() {
        return (
            <section style={cardStyle}>
                <div
                    style={{
                        marginBottom: "22px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        Doctor's Notes
                    </h2>

                    <p
                        style={{
                            margin: "8px 0 0 0",
                            color: "#6B7280",
                            fontSize: "14px",
                            lineHeight: 1.5,
                        }}
                    >
                        Upload a photo or PDF of
                        the doctor's notes for{" "}
                        <strong>
                            {recordingName}
                        </strong>
                        .
                    </p>
                </div>

                <div
                    onDragOver={event => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => {
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                    style={{
                        border:
                            isDragging
                                ? "2px solid #7043F5"
                                : "2px dashed #D1D5DB",
                        borderRadius: "16px",
                        padding: "30px 20px",
                        textAlign: "center",
                        background:
                            isDragging
                                ? "#F5F3FF"
                                : "#FAFAFA",
                        transition:
                            "all 0.2s ease",
                    }}
                >
                    <div
                        style={{
                            fontSize: "42px",
                            marginBottom: "10px",
                        }}
                    >
                        📄
                    </div>

                    <div
                        style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: "6px",
                        }}
                    >
                        Upload Doctor's Notes
                    </div>

                    <div
                        style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            marginBottom: "18px",
                        }}
                    >
                        Choose up to 5 photos or 5 PDF
                        documents
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            disabled={hasPdf}
                            style={
                                hasPdf
                                    ? disabledButtonStyle
                                    : primaryButtonStyle
                            }
                        >
                            🖼️ Upload Images
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                cameraInputRef.current?.click()
                            }
                            disabled={hasPdf}
                            style={{
                                ...secondaryButtonStyle,
                                opacity:
                                    hasPdf ? 0.5 : 1,
                                cursor:
                                    hasPdf
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            📷 Take Photo
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                pdfInputRef.current?.click()
                            }
                            disabled={hasImages}
                            style={{
                                ...secondaryButtonStyle,
                                opacity:
                                    hasImages
                                        ? 0.5
                                        : 1,
                                cursor:
                                    hasImages
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            📄 Upload PDFs
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleFileChange}
                        style={{
                            display: "none",
                        }}
                    />

                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        style={{
                            display: "none",
                        }}
                    />

                    <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleFileChange}
                        style={{
                            display: "none",
                        }}
                    />
                </div>

                {error && (
                    <ErrorMessage
                        message={error}
                        marginTop="14px"
                    />
                )}

                {documents.length > 0 && (
                    <>
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                gap: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                {hasPdf
                                    ? `${documents.length} PDF${
                                          documents.length === 1
                                              ? ""
                                              : "s"
                                      } selected`
                                    : `${documents.length} image${
                                          documents.length === 1
                                              ? ""
                                              : "s"
                                      } selected`}
                            </div>

                            <button
                                type="button"
                                onClick={clearDocuments}
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    color: "#DC2626",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        {hasImages && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fill, minmax(150px, 1fr))",
                                    gap: "14px",
                                    marginTop: "14px",
                                }}
                            >
                                {documents.map(
                                    (
                                        document,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                document.id
                                            }
                                            style={{
                                                position:
                                                    "relative",
                                                border:
                                                    "1px solid #E5E7EB",
                                                borderRadius:
                                                    "12px",
                                                overflow:
                                                    "hidden",
                                                background:
                                                    "#FFFFFF",
                                            }}
                                        >
                                            <img
                                                src={
                                                    document.previewUrl
                                                }
                                                alt={`Doctor's note ${
                                                    index +
                                                    1
                                                }`}
                                                style={{
                                                    display:
                                                        "block",
                                                    width:
                                                        "100%",
                                                    height:
                                                        "180px",
                                                    objectFit:
                                                        "cover",
                                                }}
                                            />

                                            <div
                                                style={{
                                                    padding:
                                                        "8px 10px",
                                                    fontSize:
                                                        "12px",
                                                    color:
                                                        "#4B5563",
                                                }}
                                            >
                                                Page{" "}
                                                {index +
                                                    1}
                                            </div>

                                            <button
                                                type="button"
                                                aria-label={`Remove image ${
                                                    index +
                                                    1
                                                }`}
                                                onClick={() =>
                                                    removeDocument(
                                                        document.id
                                                    )
                                                }
                                                style={{
                                                    position:
                                                        "absolute",
                                                    top: "8px",
                                                    right: "8px",
                                                    width:
                                                        "30px",
                                                    height:
                                                        "30px",
                                                    borderRadius:
                                                        "50%",
                                                    border:
                                                        "none",
                                                    background:
                                                        "rgba(17,24,39,0.75)",
                                                    color:
                                                        "#FFFFFF",
                                                    fontSize:
                                                        "16px",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {hasPdf && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: "10px",
                                    marginTop: "14px",
                                }}
                            >
                                {documents.map(
                                    document => (
                                        <div
                                            key={
                                                document.id
                                            }
                                            style={{
                                                padding:
                                                    "16px",
                                                border:
                                                    "1px solid #E5E7EB",
                                                borderRadius:
                                                    "12px",
                                                background:
                                                    "#F8FAFC",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "space-between",
                                                gap:
                                                    "12px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap:
                                                        "12px",
                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize:
                                                            "30px",
                                                        flexShrink:
                                                            0,
                                                    }}
                                                >
                                                    📄
                                                </div>

                                                <div
                                                    style={{
                                                        minWidth:
                                                            0,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight:
                                                                700,
                                                            color:
                                                                "#111827",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            document
                                                                .file
                                                                .name
                                                        }
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "4px",
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#64748B",
                                                        }}
                                                    >
                                                        PDF document
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label={`Remove ${
                                                    document.file.name
                                                }`}
                                                onClick={() =>
                                                    removeDocument(
                                                        document.id
                                                    )
                                                }
                                                style={{
                                                    border:
                                                        "none",
                                                    background:
                                                        "transparent",
                                                    color:
                                                        "#DC2626",
                                                    fontSize:
                                                        "20px",
                                                    cursor:
                                                        "pointer",
                                                    flexShrink:
                                                        0,
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}

                {isReading && (
                    <ReadingProgress
                        label="Reading Doctor's Notes..."
                        message="Please wait while CareVR™ reads the document."
                    />
                )}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "24px",
                        flexWrap: "wrap",
                    }}
                >
                    {onCancel ? (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={
                                secondaryButtonStyle
                            }
                        >
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={
                            documents.length ===
                                0 ||
                            isReading
                        }
                        style={
                            documents.length ===
                                0 ||
                            isReading
                                ? disabledButtonStyle
                                : primaryButtonStyle
                        }
                    >
                        {isReading
                            ? "CareVR™ is reading the doctor's notes..."
                            : "Continue →"}
                    </button>
                </div>
            </section>
        );
    }

    // ========================================================
    // Manual screen
    // ========================================================

    function renderManualScreen() {
        return (
            <section style={cardStyle}>
                <div
                    style={{
                        marginBottom: "22px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        Doctor's Notes
                    </h2>

                    <p
                        style={{
                            margin: "8px 0 0 0",
                            color: "#6B7280",
                            fontSize: "14px",
                            lineHeight: 1.5,
                        }}
                    >
                        Record what the doctor
                        communicated during the
                        consultation for{" "}
                        <strong>
                            {recordingName}
                        </strong>
                        .
                    </p>
                </div>

                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <label style={labelStyle}>
                        Patient
                    </label>

                    <div
                        style={
                            readOnlyFieldStyle
                        }
                    >
                        {recordingName}
                    </div>
                </div>

                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <label style={labelStyle}>
                        Hospital
                    </label>

                    <select
                        value={
                            selectedFacilityId
                        }
                        onChange={event => {
                            setSelectedFacilityId(
                                event.target.value
                            );
                            setError(null);
                        }}
                        disabled={
                            loadingFacilities
                        }
                        style={fieldStyle}
                    >
                        <option value="">
                            {loadingFacilities
                                ? "Loading hospitals..."
                                : "Select hospital"}
                        </option>

                        {facilities.map(
                            facility => (
                                <option
                                    key={
                                        facility.id
                                    }
                                    value={
                                        facility.id
                                    }
                                >
                                    {
                                        facility.name
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <label style={labelStyle}>
                        Doctor*
                    </label>

                    <input
                        type="text"
                        value={doctorName}
                        onChange={event =>
                            setDoctorName(
                                event.target.value
                            )
                        }
                        placeholder="Enter doctor's name"
                        style={fieldStyle}
                    />
                </div>

                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <label style={labelStyle}>
                        Consultation Mode
                    </label>

                    <select
                        value={
                            consultationMode ??
                            ""
                        }
                        onChange={event =>
                            setConsultationMode(
                                event.target.value
                                    ? event.target.value as ConsultationMode
                                    : null
                            )
                        }
                        style={fieldStyle}
                    >
                        <option value="">
                            Please select
                        </option>
                        <option value="IN_PERSON">
                            In Person
                        </option>
                        <option value="PHONE">
                            Phone
                        </option>
                        <option value="VIDEO">
                            Video
                        </option>
                        <option value="WHATSAPP">
                            WhatsApp
                        </option>
                        <option value="EMAIL">
                            Email
                        </option>
                        <option value="OTHER">
                            Other
                        </option>
                    </select>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "14px",
                        marginBottom: "18px",
                    }}
                >
                    <div>
                        <label style={labelStyle}>
                            Consultation Date*
                        </label>

                        <input
                            type="date"
                            value={
                                consultationDate
                            }
                            onChange={event =>
                                setConsultationDate(
                                    event.target.value
                                )
                            }
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Consultation Time
                        </label>

                        <input
                            type="time"
                            value={
                                consultationTime
                            }
                            onChange={event =>
                                setConsultationTime(
                                    event.target.value
                                )
                            }
                            style={fieldStyle}
                        />
                    </div>
                </div>

                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <label style={labelStyle}>
                        Consultation Location
                    </label>

                    <input
                        type="text"
                        value={
                            consultationLocation
                        }
                        onChange={event =>
                            setConsultationLocation(
                                event.target.value
                            )
                        }
                        placeholder="Optional"
                        style={fieldStyle}
                    />
                </div>

                <div
                    style={{
                        marginBottom: "22px",
                    }}
                >
                    <label style={labelStyle}>
                        Doctor's Notes*
                    </label>

                    <textarea
                        value={
                            manualDoctorNotes
                        }
                        onChange={event =>
                            setManualDoctorNotes(
                                event.target.value
                            )
                        }
                        placeholder="Enter what the doctor communicated during the consultation..."
                        rows={7}
                        style={{
                            ...fieldStyle,
                            minHeight: "160px",
                            resize: "vertical",
                            fontFamily: "inherit",
                            lineHeight: 1.5,
                        }}
                    />
                </div>

                {error && (
                    <ErrorMessage
                        message={error}
                        marginTop="0"
                    />
                )}

                <div
                    style={footerActionsStyle}
                >
                    {onCancel ? (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={
                                secondaryButtonStyle
                            }
                        >
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        type="button"
                        onClick={handleManualSave}
                        disabled={
                            !doctorName.trim() ||
                            !consultationDate ||
                            !manualDoctorNotes.trim()
                        }
                        style={
                            !doctorName.trim() ||
                            !consultationDate ||
                            !manualDoctorNotes.trim()
                                ? disabledButtonStyle
                                : primaryButtonStyle
                        }
                    >
                        Save Doctor's Notes
                    </button>
                </div>
            </section>
        );
    }

    // ========================================================
    // AI extraction confirmation
    //
    // This replaces the upload screen after extraction.
    // The upload/processing UI is not left behind.
    // ========================================================

    function renderDetailsConfirmation() {
        if (
            !extractedPrescription ||
            !showDetailsConfirmation
        ) {
            return null;
        }

        const extractedDoctorType =
            extractedPrescription
                .encounterIdentity
                .doctorType
                ?.trim() ?? "";

        return (
            <section
                style={confirmationCardStyle}
            >
                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        Verify Doctor's Notes
                    </h2>

                    <p
                        style={{
                            margin:
                                "8px 0 0 0",
                            fontSize: "13px",
                            lineHeight: 1.5,
                            color: "#64748B",
                        }}
                    >
                        Please verify the consultation
                        details before continuing.
                        CareVR™ may not always read
                        handwritten information correctly.
                    </p>
                </div>

                <div
                    style={confirmationGridStyle}
                >
                    <div>
                        <label style={labelStyle}>
                            Consultation Date*
                        </label>

                        <input
                            type="date"
                            value={
                                consultationDate
                            }
                            onChange={event =>
                                setConsultationDate(
                                    event.target.value
                                )
                            }
                            style={fieldStyle}
                        />

                        <div
                            style={{
                                marginTop: "6px",
                                fontSize: "11px",
                                color: "#64748B",
                            }}
                        >
                            Verify the date,
                            especially if it was
                            handwritten.
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Doctor Name*
                        </label>

                        <input
                            type="text"
                            value={doctorName}
                            onChange={event =>
                                setDoctorName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter doctor's name"
                            style={fieldStyle}
                        />

                        {!doctorName.trim() && (
                            <div
                                style={{
                                    marginTop: "6px",
                                    fontSize: "11px",
                                    color: "#B45309",
                                    fontWeight: 600,
                                }}
                            >
                                Doctor name was not
                                found in the document.
                                Please add it.
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Hospital / Clinic
                        </label>

                        <div
                            style={
                                readOnlyFieldStyle
                            }
                        >
                            {hospitalOrClinic ||
                                "—"}
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Doctor Type
                        </label>

                        <div
                            style={
                                readOnlyFieldStyle
                            }
                        >
                            {extractedDoctorType ||
                                "—"}
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Consultation Mode*
                        </label>

                        <select
                            value={
                                consultationMode ??
                                ""
                            }
                            onChange={event => {
                                setConsultationMode(
                                    event.target.value
                                        ? event.target.value as ConsultationMode
                                        : null
                                );
                                setError(null);
                            }}
                            style={fieldStyle}
                        >
                            <option value="">
                                Please select
                            </option>
                            <option value="IN_PERSON">
                                In Person
                            </option>
                            <option value="VIDEO">
                                Video
                            </option>
                            <option value="PHONE">
                                Phone
                            </option>
                            <option value="WHATSAPP">
                                WhatsApp
                            </option>
                            <option value="EMAIL">
                                Email
                            </option>
                            <option value="HOME_VISIT">
                                Home Visit
                            </option>
                            <option value="HOSPITAL_ADMISSION">
                                Hospital Admission
                            </option>
                            <option value="HOSPITAL_DISCHARGE">
                                Hospital Discharge
                            </option>
                            <option value="OTHER">
                                Other
                            </option>
                        </select>

                        {!consultationMode && (
                            <div
                                style={{
                                    marginTop: "6px",
                                    fontSize: "11px",
                                    color: "#B45309",
                                    fontWeight: 600,
                                }}
                            >
                                The document does not
                                specify the consultation
                                mode. Please select one.
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <ErrorMessage
                        message={error}
                        marginTop="14px"
                    />
                )}

                <div
                    style={footerActionsStyle}
                >
                    <button
                        type="button"
                        onClick={handleReupload}
                        style={
                            secondaryButtonStyle
                        }
                    >
                        ← Re-upload
                    </button>

                    <button
                        type="button"
                        onClick={
                            confirmExtractedDetails
                        }
                        disabled={
                            !consultationDate ||
                            !doctorName.trim() ||
                            !consultationMode
                        }
                        style={
                            !consultationDate ||
                            !doctorName.trim() ||
                            !consultationMode
                                ? disabledButtonStyle
                                : primaryButtonStyle
                        }
                    >
                        Continue →
                    </button>
                </div>
            </section>
        );
    }

    // ========================================================
    // Final review
    //
    // IMPORTANT:
    // Part 1 and Part 2 are now entirely owned by
    // DoctorNotesReview. No duplicate UI lives here.
    // ========================================================

    function renderReviewScreen() {
        if (
            !extractedPrescription ||
            showDetailsConfirmation
        ) {
            return null;
        }

        return (
<DoctorNotesReview
    prescription={extractedPrescription}
    documents={documents.map(document => ({
        id: document.id,
        name: document.file.name,
        type: document.type,
        previewUrl: document.previewUrl,
    }))}
    onBack={handleReupload}
    onSave={() => {
        console.log(
            "Doctor's Notes ready to save",
            extractedPrescription
        );
    }}
/>
        );
    }

    // ========================================================
    // Main render
    //
    // Upload mode is now a clean state machine:
    //
    // 1. Upload
    // 2. Reading
    // 3. Confirmation
    // 4. Doctor's Notes review
    //
    // The upload UI is NOT rendered behind the review UI.
    // ========================================================

    if (captureMode === "MANUAL") {
        return (
            <div style={pageStyle}>
                {renderManualScreen()}
            </div>
        );
    }

    if (isReading) {
        return (
            <div style={pageStyle}>
                {renderUploadScreen()}
            </div>
        );
    }

    if (
        extractedPrescription &&
        showDetailsConfirmation
    ) {
        return (
            <div
                style={{
                    width: "100%",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                {renderDetailsConfirmation()}
            </div>
        );
    }

    if (extractedPrescription) {
        return (
            <div
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {renderReviewScreen()}
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            {renderUploadScreen()}
        </div>
    );
}

// ============================================================
// Small presentational component
// ============================================================

function ErrorMessage({
    message,
    marginTop,
}: {
    message: string;
    marginTop: string;
}) {
    return (
        <div
            role="alert"
            style={{
                marginTop,
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                fontSize: "14px",
                lineHeight: 1.5,
            }}
        >
            {message}
        </div>
    );
}
"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import {
    authService,
} from "@/lib/auth/authService";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    prescriptionImageService,
} from "@/lib/prescription-image/prescriptionImageService";


type PrescriptionSource =
    | "camera"
    | "gallery"
    | "pdf"
    | null;


const MAX_FILE_SIZE_BYTES =
    10 * 1024 * 1024;


const SUPPORTED_FILE_TYPES =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ]);


//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function AddPrescriptionPage() {

    const router =
        useRouter();


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        currentUserName,
        setCurrentUserName,
    ] =
        useState("");


const [
    selectedFiles,
    setSelectedFiles,
] =
    useState<File[]>(
        []
    );


    const [
        selectedSource,
        setSelectedSource,
    ] =
        useState<PrescriptionSource>(
            null
        );


    const [
        validationError,
        setValidationError,
    ] =
        useState<string | null>(
            null
        );


const [
    processing,
    setProcessing,
] =
    useState(false);


const [
    extractedPrescription,
    setExtractedPrescription,
] =
    useState<ExtractedPrescription | null>(
        null
    );


    //------------------------------------------------------------
    // Authentication
    //------------------------------------------------------------

    useEffect(() => {

        async function loadUser() {

            try {

                const user =
                    await authService
                        .getCurrentUser();


                if (!user) {

                    router.replace(
                        "/login"
                    );

                    return;

                }


                setCurrentUserName(

                    user.user_metadata
                        ?.full_name ??

                    user.email ??

                    "User"

                );

            }
            catch {

                router.replace(
                    "/login"
                );

                return;

            }
            finally {

                setLoading(false);

            }

        }


        void loadUser();

    }, [router]);


    //------------------------------------------------------------
    // Validate Prescription Image
    //------------------------------------------------------------

    function validatePrescriptionFile(
        file: File
    ): string | null {

        if (
            !SUPPORTED_FILE_TYPES.has(
                file.type
            )
        ) {

            return (
    "Unsupported file format. " +
    "Please use JPG, PNG, WebP, or PDF."
);

        }


        if (
            file.size >
            MAX_FILE_SIZE_BYTES
        ) {

            return (
    "The selected file is too large. " +
    "Maximum allowed size is 10 MB per file."
);

        }


        return null;

    }


    //------------------------------------------------------------
    // Select Prescription
    //------------------------------------------------------------

    function handlePrescriptionFiles(
    event:
        React.ChangeEvent<HTMLInputElement>,

    source:
        Exclude<
            PrescriptionSource,
            null
        >
) {

    const files =
        Array.from(
            event.target.files ?? []
        );


    event.target.value = "";


    if (files.length === 0) {

        return;

    }


    for (const file of files) {

        const error =
            validatePrescriptionFile(
                file
            );


        if (error) {

            setValidationError(
                error
            );

            return;

        }

    }


    setValidationError(
        null
    );


    setExtractedPrescription(
        null
    );


    if (source === "pdf") {

        setSelectedFiles(
            files
        );

    }
    else {

        setSelectedFiles(
            currentFiles => [

                ...currentFiles.filter(
                    file =>
                        file.type !==
                        "application/pdf"
                ),

                ...files,

            ]
        );

    }


    setSelectedSource(
        source
    );

}


    //------------------------------------------------------------
    // Remove Prescription
    //------------------------------------------------------------

    function removeAllSelectedFiles() {

    setSelectedFiles(
        []
    );

    setSelectedSource(
        null
    );

    setValidationError(
        null
    );

    setExtractedPrescription(
        null
    );

}

function removeSelectedFile(
    indexToRemove: number
) {

    setSelectedFiles(
        currentFiles =>
            currentFiles.filter(
                (
                    _file,
                    index
                ) =>
                    index !==
                    indexToRemove
            )
    );


    setExtractedPrescription(
        null
    );

}

    //------------------------------------------------------------
    // Read Prescription
    //------------------------------------------------------------

    async function readPrescription() {

    if (
        selectedFiles.length === 0 ||
        processing
    ) {

        if (
            selectedFiles.length === 0
        ) {

            setValidationError(
                "Please take a photo, choose prescription photos, or upload a PDF."
            );

        }

        return;

    }


    setValidationError(
        null
    );

    setExtractedPrescription(
        null
    );

    setProcessing(
        true
    );


    try {

        const result =
            await prescriptionImageService
                .processFiles(
                    selectedFiles
                );


        if (
            !result.success ||
            !result.data
        ) {

            setValidationError(
                result.error ??
                "Unable to read the prescription."
            );

            return;

        }


        setExtractedPrescription(
            result.data
        );

    }
    catch (error) {

        console.error(
            "Prescription Read Error:",
            error
        );


        setValidationError(
            "Unable to process the prescription."
        );

    }
    finally {

        setProcessing(
            false
        );

    }

}

    //------------------------------------------------------------
    // Loading
    //------------------------------------------------------------

    if (loading) {

        return (

            <main style={loadingContainer}>

                <h2>
                    Loading...
                </h2>

            </main>

        );

    }


    //------------------------------------------------------------
    // Page
    //------------------------------------------------------------

    return (

        <main style={pageContainer}>

            <div style={pageCard}>

                <AppHeader
                    pageTitle="Add Prescription"
                    pageIcon="📄"
                    currentUserName={
                        currentUserName
                    }
                />


                <section style={sectionCard}>

                    <h2 style={questionTitle}>
                        Add your prescription
                    </h2>


                    <p style={helpText}>
                        Take a clear photo of the prescription
                        or choose an existing photo from your device.
                    </p>


                    <div style={captureGrid}>

    {/*----------------------------------------
        Camera
    ----------------------------------------*/}

    <label style={captureButton}>

        <span style={captureIcon}>
            📷
        </span>

        <span style={captureTitle}>
            Take Photo
        </span>

        <span style={captureDescription}>
            Photograph one page at a time.
            You can add more pages.
        </span>


        <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={(event) =>
                handlePrescriptionFiles(
                    event,
                    "camera"
                )
            }
            style={{
                display: "none",
            }}
        />

    </label>


    {/*----------------------------------------
        Gallery
    ----------------------------------------*/}

    <label style={captureButton}>

        <span style={captureIcon}>
            🖼️
        </span>

        <span style={captureTitle}>
            Choose Photos
        </span>

        <span style={captureDescription}>
            Select one or more prescription
            or discharge document photos
        </span>


        <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) =>
                handlePrescriptionFiles(
                    event,
                    "gallery"
                )
            }
            style={{
                display: "none",
            }}
        />

    </label>


    {/*----------------------------------------
        PDF
    ----------------------------------------*/}

    <label style={captureButton}>

        <span style={captureIcon}>
            📄
        </span>

        <span style={captureTitle}>
            Upload PDF
        </span>

        <span style={captureDescription}>
            Upload a prescription or
            discharge summary PDF
        </span>


        <input
            type="file"
            accept="application/pdf"
            onChange={(event) =>
                handlePrescriptionFiles(
                    event,
                    "pdf"
                )
            }
            style={{
                display: "none",
            }}
        />

    </label>

</div>


                    {validationError && (

                        <div style={errorBox}>

                            <p style={errorText}>
                                {validationError}
                            </p>

                        </div>

                    )}


                    {selectedFiles.length > 0 && (

    <div style={selectedFileCard}>

        <div style={selectedFileHeader}>

            <div>

                <p style={selectedLabel}>

                    {
                        selectedFiles[0]?.type ===
                        "application/pdf"
                            ? "PDF selected"
                            : `${selectedFiles.length} page${
                                selectedFiles.length === 1
                                    ? ""
                                    : "s"
                            } selected`
                    }

                </p>


                <p style={fileMeta}>

                    {
                        selectedFiles[0]?.type ===
                        "application/pdf"
                            ? "The complete PDF will be read as one document."
                            : "All selected pages will be read together."
                    }

                </p>

            </div>


            <span style={successIcon}>
                ✓
            </span>

        </div>


        <div style={fileList}>

            {
                selectedFiles.map(
                    (
                        file,
                        index
                    ) => (

                        <div
                            key={
                                `${file.name}-${file.size}-${index}`
                            }
                            style={fileListItem}
                        >

                            <div style={fileInfo}>

                                <span style={filePageIcon}>

                                    {
                                        file.type ===
                                        "application/pdf"
                                            ? "📄"
                                            : "🖼️"
                                    }

                                </span>


                                <div>

                                    <p style={fileName}>
                                        {file.name}
                                    </p>

                                    <p style={fileSize}>
                                        {
                                            (
                                                file.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)
                                        } MB
                                    </p>

                                </div>

                            </div>


                            {
                                selectedFiles[0]?.type !==
                                "application/pdf" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSelectedFile(
                                                index
                                            )
                                        }
                                        style={removeFileButton}
                                        aria-label={
                                            `Remove ${file.name}`
                                        }
                                    >
                                        Remove
                                    </button>

                                )
                            }

                        </div>

                    )
                )
            }

        </div>


        {
            selectedFiles[0]?.type !==
            "application/pdf" && (

                <p style={addMoreHelp}>
                    Need another page? Use Take Photo
                    or Choose Photos above to add it.
                </p>

            )
        }


        <div style={selectedActionGrid}>

            <button
                type="button"
                onClick={
                    readPrescription
                }
                disabled={
                    processing
                }
                style={{
                    ...primaryButton,

                    opacity:
                        processing
                            ? 0.7
                            : 1,

                    cursor:
                        processing
                            ? "not-allowed"
                            : "pointer",
                }}
            >

                {
                    processing
                        ? "Reading document..."
                        : selectedFiles[0]?.type ===
                          "application/pdf"
                            ? "🔍 Read PDF"
                            : `🔍 Read ${
                                selectedFiles.length
                            } Page${
                                selectedFiles.length === 1
                                    ? ""
                                    : "s"
                            }`
                }

            </button>


            <button
                type="button"
                onClick={
                    removeAllSelectedFiles
                }
                disabled={
                    processing
                }
                style={secondaryButton}
            >
                Remove All
            </button>

        </div>

    </div>

)}

{extractedPrescription && (

    <div style={resultCard}>

        <h3 style={resultTitle}>
            Prescription Details
        </h3>


        <div style={detailGrid}>

            <div>

                <span style={detailLabel}>
                    Patient
                </span>

                <p style={detailValue}>
                    {
                        extractedPrescription
                            .patientName ??
                        "Not found"
                    }
                </p>

            </div>


            <div>

                <span style={detailLabel}>
                    Doctor
                </span>

                <p style={detailValue}>
                    {
                        extractedPrescription
                            .doctorName ??
                        "Not found"
                    }
                </p>

            </div>


            <div>

                <span style={detailLabel}>
                    Consultation Date
                </span>

                <p style={detailValue}>
                    {
                        extractedPrescription
                            .consultationDate ??
                        "Not found"
                    }
                </p>

            </div>


            <div>

                <span style={detailLabel}>
                    Mode of Consultation
                </span>

                <p style={detailValue}>
                    {
                        extractedPrescription
                            .consultationMode ??
                        "Not recorded"
                    }
                </p>

            </div>

        </div>


        <h4 style={medicineHeading}>
            Medicines
        </h4>


        {
            extractedPrescription
                .medicines.length === 0
                ? (

                    <p style={emptyText}>
                        No medicines could be read clearly.
                    </p>

                )
                : (

                    extractedPrescription
                        .medicines
                        .map(
                            (
                                medicine,
                                index
                            ) => (

                                <div
                                    key={
                                        `${medicine.name}-${index}`
                                    }
                                    style={medicineCard}
                                >

                                    <strong style={medicineName}>
                                        {medicine.name}
                                    </strong>


                                    <p style={medicineDetail}>
                                        Strength: {
                                            medicine.strength ??
                                            "Not found"
                                        }
                                    </p>


                                    <p style={medicineDetail}>
                                        Dose: {
                                            medicine.dose ??
                                            "Not found"
                                        }
                                    </p>


                                    <p style={medicineDetail}>
                                        Frequency: {
                                            medicine.frequency ??
                                            "Not found"
                                        }
                                    </p>


                                    <p style={medicineDetail}>
                                        Timing: {
                                            medicine.timings.length > 0
                                                ? medicine.timings.join(", ")
                                                : "Not found"
                                        }
                                    </p>


                                    <p style={medicineDetail}>
                                        Duration: {
                                            medicine.duration ??
                                            "Not found"
                                        }
                                    </p>

                                </div>

                            )
                        )

                )
        }

    </div>

)}

                </section>


                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/medications"
                        )
                    }
                    style={backButton}
                >
                    ← Back to Medication Management
                </button>

            </div>

        </main>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const pageContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        background:
            "#f8fafc",

        padding:
            "20px",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const pageCard:
    React.CSSProperties = {

        maxWidth:
            "900px",

        margin:
            "0 auto",

        background:
            "#ffffff",

        padding:
            "32px",

        borderRadius:
            "16px",

        border:
            "1px solid #d1d5db",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",

    };


const loadingContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        display:
            "flex",

        justifyContent:
            "center",

        alignItems:
            "center",

        background:
            "#f8fafc",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const sectionCard:
    React.CSSProperties = {

        marginTop:
            "24px",

        padding:
            "24px",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "14px",

        background:
            "#ffffff",

    };


const questionTitle:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "10px",

        fontSize:
            "24px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const helpText:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "22px",

        color:
            "#6b7280",

        fontSize:
            "15px",

        lineHeight:
            1.6,

    };


const captureGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",

        gap:
            "16px",

    };


const captureButton:
    React.CSSProperties = {

        minHeight:
            "170px",

        padding:
            "24px",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "9px",

        background:
            "#ffffff",

        border:
            "2px solid #2563eb",

        borderRadius:
            "14px",

        cursor:
            "pointer",

        textAlign:
            "center",

        boxSizing:
            "border-box",

    };


const captureIcon:
    React.CSSProperties = {

        fontSize:
            "36px",

    };


const captureTitle:
    React.CSSProperties = {

        fontSize:
            "18px",

        fontWeight:
            700,

        color:
            "#1d4ed8",

    };


const captureDescription:
    React.CSSProperties = {

        maxWidth:
            "220px",

        fontSize:
            "14px",

        lineHeight:
            1.5,

        color:
            "#6b7280",

    };


const errorBox:
    React.CSSProperties = {

        marginTop:
            "18px",

        padding:
            "14px 16px",

        background:
            "#fef2f2",

        border:
            "1px solid #fecaca",

        borderRadius:
            "10px",

    };


const errorText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#dc2626",

        lineHeight:
            1.5,

    };


const selectedFileCard:
    React.CSSProperties = {

        marginTop:
            "22px",

        padding:
            "20px",

        background:
            "#f0fdf4",

        border:
            "1px solid #bbf7d0",

        borderRadius:
            "12px",

    };


const selectedFileHeader:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "flex-start",

        justifyContent:
            "space-between",

        gap:
            "16px",

    };


const selectedLabel:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "6px",

        fontSize:
            "16px",

        fontWeight:
            700,

        color:
            "#166534",

    };


const fileName:
    React.CSSProperties = {

        margin:
            0,

        fontSize:
            "15px",

        fontWeight:
            600,

        color:
            "#111827",

        overflowWrap:
            "anywhere",

    };


const fileMeta:
    React.CSSProperties = {

        marginTop:
            "6px",

        marginBottom:
            0,

        fontSize:
            "13px",

        color:
            "#6b7280",

    };


const successIcon:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        width:
            "32px",

        height:
            "32px",

        flexShrink:
            0,

        borderRadius:
            "50%",

        background:
            "#16a34a",

        color:
            "#ffffff",

        fontWeight:
            700,

    };


const selectedActionGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",

        gap:
            "12px",

        marginTop:
            "18px",

    };


const primaryButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "15px",

        background:
            "#2563eb",

        color:
            "#ffffff",

        border:
            "none",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const secondaryButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "15px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const backButton:
    React.CSSProperties = {

        width:
            "100%",

        marginTop:
            "24px",

        padding:
            "15px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };

const resultCard:
    React.CSSProperties = {

        marginTop:
            "24px",

        padding:
            "22px",

        background:
            "#f8fafc",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "12px",

    };


const resultTitle:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "20px",

        fontSize:
            "21px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const detailGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",

        gap:
            "16px",

    };


const detailLabel:
    React.CSSProperties = {

        display:
            "block",

        marginBottom:
            "5px",

        fontSize:
            "13px",

        fontWeight:
            700,

        color:
            "#6b7280",

    };


const detailValue:
    React.CSSProperties = {

        margin:
            0,

        fontSize:
            "16px",

        fontWeight:
            600,

        color:
            "#111827",

    };


const medicineHeading:
    React.CSSProperties = {

        marginTop:
            "26px",

        marginBottom:
            "12px",

        fontSize:
            "18px",

        color:
            "#111827",

    };


const medicineCard:
    React.CSSProperties = {

        padding:
            "16px",

        marginBottom:
            "12px",

        background:
            "#ffffff",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "10px",

    };


const medicineName:
    React.CSSProperties = {

        display:
            "block",

        marginBottom:
            "10px",

        fontSize:
            "17px",

        color:
            "#111827",

    };


const medicineDetail:
    React.CSSProperties = {

        margin:
            "5px 0",

        fontSize:
            "14px",

        lineHeight:
            1.5,

        color:
            "#4b5563",

    };


const emptyText:
    React.CSSProperties = {

        color:
            "#6b7280",

        lineHeight:
            1.5,

    };

const fileList:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "10px",

        marginTop:
            "18px",

    };


const fileListItem:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "space-between",

        gap:
            "12px",

        padding:
            "12px",

        background:
            "#ffffff",

        border:
            "1px solid #d1fae5",

        borderRadius:
            "9px",

    };


const fileInfo:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "center",

        gap:
            "10px",

        minWidth:
            0,

    };


const filePageIcon:
    React.CSSProperties = {

        fontSize:
            "24px",

        flexShrink:
            0,

    };


const fileSize:
    React.CSSProperties = {

        marginTop:
            "3px",

        marginBottom:
            0,

        fontSize:
            "12px",

        color:
            "#6b7280",

    };


const removeFileButton:
    React.CSSProperties = {

        padding:
            "8px 10px",

        background:
            "#ffffff",

        color:
            "#dc2626",

        border:
            "1px solid #fecaca",

        borderRadius:
            "7px",

        fontSize:
            "13px",

        fontWeight:
            600,

        cursor:
            "pointer",

        flexShrink:
            0,

    };


const addMoreHelp:
    React.CSSProperties = {

        marginTop:
            "14px",

        marginBottom:
            0,

        fontSize:
            "13px",

        lineHeight:
            1.5,

        color:
            "#166534",

    };
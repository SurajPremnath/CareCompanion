"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    MedicationDetailOption,
} from "@/Components/dashboard/ActionOptions";

import {
    prescriptionImageService,
} from "@/lib/prescription-image/prescriptionImageService";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import ConsultationWorkspace
    from "@/Components/dashboard/ConsultationWorkspace";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

interface PrescriptionWorkspaceProps {

    method:
        MedicationDetailOption;

}


type PrescriptionSource =
    | "camera"
    | "gallery"
    | "pdf"
    | null;


//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function PrescriptionWorkspace({

    method,

}: PrescriptionWorkspaceProps) {


    //--------------------------------------------------------
    // Refs
    //--------------------------------------------------------

    const cameraInputRef =
        useRef<HTMLInputElement>(
            null
        );


    const galleryInputRef =
        useRef<HTMLInputElement>(
            null
        );


    const pdfInputRef =
        useRef<HTMLInputElement>(
            null
        );


    //--------------------------------------------------------
    // State
    //--------------------------------------------------------

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
    processing,
    setProcessing,
] =
    useState(
        false
    );


const [
    validationError,
    setValidationError,
] =
    useState<string | null>(
        null
    );


const [
    extractedPrescription,
    setExtractedPrescription,
] =
    useState<ExtractedPrescription | null>(
        null
    );



    //--------------------------------------------------------
    // Open Correct Picker
    //--------------------------------------------------------

    useEffect(() => {

        if (
            method === "TAKE_PHOTO"
        ) {

            cameraInputRef.current
                ?.click();

            return;

        }


        if (
            method === "CHOOSE_PHOTOS"
        ) {

            galleryInputRef.current
                ?.click();

            return;

        }


        if (
            method === "UPLOAD_PDF"
        ) {

            pdfInputRef.current
                ?.click();

        }

    }, [method]);


    //--------------------------------------------------------
    // Handle Files
    //--------------------------------------------------------

    function handleFiles(
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


        event.target.value =
            "";


        if (
            files.length === 0
        ) {

            return;

        }


setValidationError(
    null
);

setExtractedPrescription(
    null
);

        if (
            source === "pdf"
        ) {

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


//--------------------------------------------------------
// Remove Files
//--------------------------------------------------------

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

//--------------------------------------------------------
// Read Prescription
//--------------------------------------------------------

async function readPrescription() {

    if (
        selectedFiles.length === 0 ||
        processing
    ) {

        if (
            selectedFiles.length === 0
        ) {

            setValidationError(
                "Please select a prescription document."
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

    //--------------------------------------------------------
    // UI
    //--------------------------------------------------------

    return (

        <div style={workspaceContainer}>


            {/* Camera */}

            <input
                ref={
                    cameraInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={(event) =>
                    handleFiles(
                        event,
                        "camera"
                    )
                }
                style={{
                    display:
                        "none",
                }}
            />


            {/* Gallery */}

            <input
                ref={
                    galleryInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) =>
                    handleFiles(
                        event,
                        "gallery"
                    )
                }
                style={{
                    display:
                        "none",
                }}
            />


            {/* PDF */}

            <input
                ref={
                    pdfInputRef
                }
                type="file"
                accept="application/pdf"
                onChange={(event) =>
                    handleFiles(
                        event,
                        "pdf"
                    )
                }
                style={{
                    display:
                        "none",
                }}
            />


            {validationError && (

    <div style={errorBox}>

        <p style={errorText}>
            {validationError}
        </p>

    </div>

)}


{selectedFiles.length > 0 && (

    <div style={selectedCard}>

        <p style={selectedTitle}>

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


        {selectedFiles.map(
            (
                file,
                index
            ) => (

                <div
                    key={
                        `${file.name}-${file.size}-${index}`
                    }
                    style={fileRow}
                >

                    <div>

                        <p style={fileName}>
                            {file.name}
                        </p>

                        <p style={fileMeta}>
                            {
                                (
                                    file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)
                            } MB
                        </p>

                    </div>


                    {selectedFiles[0]?.type !==
                        "application/pdf" && (

                        <button
                            type="button"
                            onClick={() =>
                                removeSelectedFile(
                                    index
                                )
                            }
                            style={removeButton}
                        >
                            Remove
                        </button>

                    )}

                </div>

            )
        )}


        <div style={actionRow}>

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

        </div>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const workspaceContainer:
    React.CSSProperties = {

        width:
            "100%",

        marginTop:
            "16px",

    };


const selectedCard:
    React.CSSProperties = {

        padding:
            "16px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "10px",

    };


const selectedTitle:
    React.CSSProperties = {

        margin:
            "0 0 8px 0",

        fontWeight:
            700,

        color:
            "#111827",

    };


const fileName:
    React.CSSProperties = {

        margin:
            "4px 0",

        color:
            "#475569",

        overflowWrap:
            "anywhere",

    };

const fileRow:
    React.CSSProperties = {

        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "16px",

        padding:
            "12px 0",

        borderBottom:
            "1px solid #e2e8f0",

    };


const fileMeta:
    React.CSSProperties = {

        margin:
            "4px 0 0 0",

        fontSize:
            "14px",

        color:
            "#64748b",

    };


const actionRow:
    React.CSSProperties = {

        display:
            "flex",

        gap:
            "12px",

        flexWrap:
            "wrap",

        marginTop:
            "16px",

    };


const primaryButton:
    React.CSSProperties = {

        padding:
            "12px 18px",

        border:
            "none",

        borderRadius:
            "8px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const secondaryButton:
    React.CSSProperties = {

        padding:
            "12px 18px",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const removeButton:
    React.CSSProperties = {

        padding:
            "8px 12px",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "6px",

        cursor:
            "pointer",

    };


const errorBox:
    React.CSSProperties = {

        marginBottom:
            "16px",

        padding:
            "12px 16px",

        background:
            "#fef2f2",

        border:
            "1px solid #fecaca",

        borderRadius:
            "8px",

    };


const errorText:
    React.CSSProperties = {

        margin:
            0,

        fontWeight:
            600,

    };
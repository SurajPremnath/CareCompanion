"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    MedicationDetailOption,
} from "@/Components/dashboard/ActionOptions";


import PrescriptionReview
    from "@/Components/dashboard/PrescriptionReview";

import {
    prescriptionImageService,
} from "@/lib/prescription-image/prescriptionImageService";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    prescriptionStorage,
} from "@/lib/prescription/prescriptionStorage";

import {
    workspaceContainer,
    errorBox,
    errorText,
    successBox,
    successText,
    progressContainer,
    progressHeader,
    progressTrack,
    progressFill,
    cameraContainer,
    cameraVideo,
    cameraActionRow,
    primaryButton,
    secondaryButton,
} from "./PrescriptionWorkspace.styles";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

interface PrescriptionWorkspaceProps {

    method: MedicationDetailOption;

    userId: string;

    recordContext: "SELF" | "FAMILY";

    patientId: string | null;

    patientName: string;      // <-- add

    familyId: string | null;

    onCancelReview: () => void;

}

//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function PrescriptionWorkspace({

    method,
    userId,
    recordContext,
    patientId,
    patientName,
    familyId,
    onCancelReview,

}: PrescriptionWorkspaceProps) {



    //--------------------------------------------------------
    // Refs
    //--------------------------------------------------------

    const galleryInputRef =
        useRef<HTMLInputElement>(
            null
        );

    const pdfInputRef =
        useRef<HTMLInputElement>(
            null
        );

    const videoRef =
        useRef<HTMLVideoElement>(
            null
        );

    const canvasRef =
        useRef<HTMLCanvasElement>(
            null
        );

    const cameraStreamRef =
        useRef<MediaStream | null>(
            null
        );


    //--------------------------------------------------------
    // State
    //--------------------------------------------------------

    const [
        cameraOpen,
        setCameraOpen,
    ] =
        useState(
            false
        );

    const [
        cameraError,
        setCameraError,
    ] =
        useState<string | null>(
            null
        );

    const [
        selectedFiles,
        setSelectedFiles,
    ] =
        useState<File[]>(
            []
        );

    const [
        processing,
        setProcessing,
    ] =
        useState(
            false
        );

    const [
        readingProgress,
        setReadingProgress,
    ] =
        useState(
            0
        );

    const [
        readingStatus,
        setReadingStatus,
    ] =
        useState(
            ""
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

const [
    patientValidationError,
    setPatientValidationError,
] =
    useState<{
        extractedName: string;
    } | null>(
        null
    );

    const [
        saving,
        setSaving,
    ] =
        useState(
            false
        );

    const [
        saveSuccess,
        setSaveSuccess,
    ] =
        useState<string | null>(
            null
        );


    //--------------------------------------------------------
    // Initial Picker
    //--------------------------------------------------------

    useEffect(() => {

        if (
            method === "TAKE_PHOTO"
        ) {

            void openCamera();

            return;

        }

        if (
            method ===
            "CHOOSE_PHOTOS"
        ) {

            galleryInputRef.current
                ?.click();

            return;

        }

        if (
            method ===
            "UPLOAD_PDF"
        ) {

            pdfInputRef.current
                ?.click();

        }

    }, [
        method,
    ]);

    //--------------------------------------------------------
    // Handle Files
    //--------------------------------------------------------

async function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
) {
        const files =
            Array.from(
                event.target.files ?? []
            );

        event.target.value = "";

        if (
            files.length === 0
        ) {

            return;

        }

        setValidationError(
            null
        );

setPatientValidationError(
    null
);

        setSaveSuccess(
            null
        );

        setExtractedPrescription(
            null
        );

        setSelectedFiles(
            files
        );

        await readPrescription(
            files
        );

    }


    //--------------------------------------------------------
    // Open Camera
    //--------------------------------------------------------

    async function openCamera() {

        setCameraError(
            null
        );

        try {

            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({

                        video: {
                            facingMode:
                                "environment",
                        },

                        audio:
                            false,

                    });

            cameraStreamRef.current =
                stream;

            setCameraOpen(
                true
            );

            window.setTimeout(
                async () => {

                    if (
                        !videoRef.current
                    ) {

                        return;

                    }

                    videoRef.current.srcObject =
                        stream;

                    await videoRef.current.play();

                },
                0
            );

        }
        catch {

            setCameraError(
                "Unable to access the camera."
            );

        }

    }


    //--------------------------------------------------------
    // Capture Photo
    //--------------------------------------------------------

    async function captureCameraPhoto() {

        const video =
            videoRef.current;

        const canvas =
            canvasRef.current;

        if (
            !video ||
            !canvas
        ) {

            return;

        }

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;

        const context =
            canvas.getContext(
                "2d"
            );

        if (
            !context
        ) {

            return;

        }

        context.drawImage(
            video,
            0,
            0
        );

        const blob =
            await new Promise<Blob | null>(
                resolve =>
                    canvas.toBlob(
                        resolve,
                        "image/jpeg",
                        0.92
                    )
            );

        if (
            !blob
        ) {

            return;

        }

        const file =
            new File(

                [
                    blob,
                ],

                `prescription-${Date.now()}.jpg`,

                {
                    type:
                        "image/jpeg",
                }

            );

        closeCamera();

        setSelectedFiles(
            [
                file,
            ]
        );


        await readPrescription(
            [
                file,
            ]
        );

    }


    //--------------------------------------------------------
    // Close Camera
    //--------------------------------------------------------

    function closeCamera() {

        cameraStreamRef.current
            ?.getTracks()
            .forEach(

                track =>
                    track.stop()

            );

        cameraStreamRef.current =
            null;

        if (
            videoRef.current
        ) {

            videoRef.current.srcObject =
                null;

        }

        setCameraOpen(
            false
        );

setCameraError(null);

    }


    //--------------------------------------------------------
    // Reset Workspace
    //--------------------------------------------------------

    function removeAllSelectedFiles() {

        setSelectedFiles(
            []
        );

setPatientValidationError(
    null
);

        setExtractedPrescription(
            null
        );

setReadingProgress(0);

setReadingStatus("");

    }


//--------------------------------------------------------
// Cancel Review
//--------------------------------------------------------

function cancelReview() {

    removeAllSelectedFiles();

    onCancelReview();

}

    //--------------------------------------------------------
    // Read Prescription
    //--------------------------------------------------------

    async function readPrescription(
        filesToRead: File[] = selectedFiles
    ) {

        if (
            filesToRead.length === 0 ||
            processing
        ) {

            if (
                filesToRead.length === 0
            ) {

                setValidationError(
                    "Please select a prescription."
                );

            }

            return;

        }

        setValidationError(
            null
        );

        setSaveSuccess(
            null
        );

        setExtractedPrescription(
            null
        );

        setProcessing(
            true
        );

        setReadingProgress(
            10
        );

        setReadingStatus(
            "Preparing prescription..."
        );

        try {

            const progressTimer =
                window.setInterval(
                    () => {

                        setReadingProgress(
                            current => {

                                if (
                                    current >= 90
                                ) {

                                    return current;

                                }

                                if (
                                    current < 50
                                ) {

                                    return current + 5;

                                }

                                if (
                                    current < 75
                                ) {

                                    return current + 3;

                                }

                                return current + 1;

                            }
                        );

                    },
                    700
                );

            setReadingProgress(
                35
            );

            setReadingStatus(
                "Reading prescription..."
            );

            let result;

            try {

                result =
                    await prescriptionImageService
                        .processFiles(
                            filesToRead
                        );

            }
            finally {

                window.clearInterval(
                    progressTimer
                );

            }

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

setReadingProgress(
    100
);

setReadingStatus(
    "Prescription successfully read."
);

//------------------------------------------------------
// SELF Patient Validation
//------------------------------------------------------

const extractedName =
    result.data.patientName
        ?.replace(/^MR\.?/i, "")
        ?.replace(/^MRS\.?/i, "")
        ?.replace(/^MS\.?/i, "")
        ?.trim();

const selectedName =
    patientName
        ?.trim();

if (

    recordContext === "SELF" &&

    extractedName &&

    selectedName &&

    extractedName.toLowerCase() !==
    selectedName.toLowerCase()

) {

    setPatientValidationError({

        extractedName,

    });

    return;

}

setPatientValidationError(null);

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
    // Save Prescription
    //--------------------------------------------------------

async function savePrescription(
    reviewedPrescription: ExtractedPrescription
) {

    if (saving) {

        return;

    }

    setValidationError(null);

    setSaveSuccess(null);

    setSaving(true);

    try {

        await prescriptionStorage
            .savePrescription(

                reviewedPrescription,

                {
                    userId,
                    patientId,
                    familyId,
                    recordContext,
                }

            );

        removeAllSelectedFiles();

        setSaveSuccess(
            "Prescription saved successfully."
        );

    }
    catch (error) {

        console.error(
            "Prescription Save Error:",
            error
        );

        setValidationError(

            error instanceof Error
                ? error.message
                : "Unable to save prescription."

        );

    }
    finally {

        setSaving(false);

    }

}

    //--------------------------------------------------------
    // UI
    //--------------------------------------------------------

    return (

        <div style={workspaceContainer}>

            {/* Hidden Camera Input */}


            {/* Hidden Gallery Input */}

            <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) =>
                    handleFiles(event)
                }
                style={{
                    display: "none",
                }}
            />

            {/* Hidden PDF Input */}

            <input
    ref={pdfInputRef}
    type="file"
    accept="application/pdf"
    onChange={(event) =>
        handleFiles(event)
    }
    style={{
        display: "none",
    }}
/>

            {/* Camera */}

            {

                cameraOpen && (

                    <div style={cameraContainer}>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={cameraVideo}
                        />

                        <canvas
                            ref={canvasRef}
                            style={{
                                display:
                                    "none",
                            }}
                        />

                        <div
                            style={
                                cameraActionRow
                            }
                        >

                            <button
                                type="button"
                                onClick={
                                    captureCameraPhoto
                                }
                                style={
                                    primaryButton
                                }
                            >
                                📷 Capture Photo
                            </button>

                            <button
                                type="button"
                                onClick={
                                    closeCamera
                                }
                                style={
                                    secondaryButton
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                )

            }

            {/* Camera Error */}

            {

                cameraError && (

                    <div
                        style={errorBox}
                    >

                        <p
                            style={errorText}
                        >

                            {cameraError}

                        </p>

                    </div>

                )

            }

            {/* Validation Error */}

            {

                validationError && (

                    <div
                        style={errorBox}
                    >

                        <p
                            style={errorText}
                        >

                            {validationError}

                        </p>

                    </div>

                )

            }

            {/* Success */}

            {

                saveSuccess && (

                    <div
                        style={successBox}
                    >

                        <p
                            style={successText}
                        >

                            {saveSuccess}

                        </p>

                    </div>

                )

            }

            {/* Progress */}

            {

                processing && (

                    <div
                        style={
                            progressContainer
                        }
                    >

                        <div
                            style={
                                progressHeader
                            }
                        >

                            <span>

                                {
                                    readingStatus
                                }

                            </span>

                            <span>

                                {
                                    readingProgress
                                }%

                            </span>

                        </div>

                        <div
                            style={
                                progressTrack
                            }
                        >

                            <div

                                style={{

                                    ...progressFill,

                                    width:
                                        `${readingProgress}%`,

                                }}

                            />

                        </div>

                    </div>

                )

            }


{

    patientValidationError && (

        <div style={errorBox}>

            <h3>

                ❌ Prescription belongs to another patient

            </h3>

            <p>

                This prescription appears to belong to

                <strong>

                    {" "}
                    {patientValidationError.extractedName}

                </strong>

            </p>

            <p>

                You are currently adding a prescription for

                <strong>

                    {" "}
                    {patientName}

                </strong>

            </p>

            <p>

                Please re-upload the correct prescription or
                return and choose the appropriate family member.

            </p>

            <button

                type="button"

                onClick={cancelReview}

                style={secondaryButton}

            >

                Re-upload Prescription

            </button>

        </div>

    )

}


            {/* Review */}

            {

                extractedPrescription && (

                    <PrescriptionReview
    prescription={extractedPrescription}

    patientName={patientName}

recordContext={recordContext}

    saving={saving}

    onReupload={cancelReview}

    onConfirm={savePrescription}
/>

                )

            }

        </div>

    );

}
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
    patientStorage,
} from "@/lib/storage/patientStorage";

import {
    prescriptionRepository,
} from "@/lib/prescription/prescriptionRepository";


import {
    generateValidationCards,
} from "@/lib/prescription-ai/validation/gatekeeperGenerator";

import {
    validateCards,
} from "@/lib/prescription-ai/validation/gatekeeper";

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


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import type {
    CompletePrescriptionRecord,
} from "@/lib/prescription/prescriptionTypes";

import {
    mapPrescriptionToReview,
} from "@/lib/prescription/prescriptionReviewMapper";

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

    onSaveComplete?: () => void;
}

//------------------------------------------------------------
// Patient Age Fallback
//------------------------------------------------------------

function calculatePatientAge(
    dateOfBirth: string | null
): string | null {

    if (!dateOfBirth) {
        return null;
    }

    const birthDate =
        new Date(dateOfBirth);

    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {
        return null;
    }

    const today =
        new Date();

    if (birthDate > today) {
        return null;
    }

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
                birthDate.getDate()
        )
    ) {
        age--;
    }

    return String(age);
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
    onSaveComplete,
}: PrescriptionWorkspaceProps) {


const {
    t,
} = useLanguage();

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
    prescriptionReviewMode,
    setPrescriptionReviewMode,
] =
    useState<"UPLOAD" | "VIEW">(
        "UPLOAD"
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

const MAX_IMAGE_SIZE =
    2 * 1024 * 1024; // 2 MB

//--------------------------------------------------------
// Initial Picker
//--------------------------------------------------------

useEffect(() => {

    // If the user moves away from Take Photo,
    // make sure the camera is completely closed.
    if (
        method !== "TAKE_PHOTO"
    ) {
        closeCamera();
    }

    if (
        method === "TAKE_PHOTO"
    ) {

        void openCamera();

        return;

    }

    if (
        method === "CHOOSE_PHOTOS"
    ) {

        const input =
            galleryInputRef.current;

        if (!input) {
            return;
        }

        input.click();

        return;
    }

    if (
        method === "UPLOAD_PDF"
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

const oversizedFiles =
    files.filter(
        file =>
            file.size > MAX_IMAGE_SIZE
    );

if (
    oversizedFiles.length > 0
) {

    const fileNames =
        oversizedFiles
            .map(
                file =>
                    `• ${file.name}`
            )
            .join("\n");

    setValidationError(

        t("medication.uploadFileTooLargeMessage")

    );


    event.target.value = "";

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

setPrescriptionReviewMode(
    "UPLOAD"
);

setSelectedFiles(files);

await readPrescription(files);


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
                t("medication.cameraUnavailable")
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
// Check Existing Prescription
//--------------------------------------------------------

async function checkExistingPrescription(
    extracted:
        ExtractedPrescription
): Promise<{
    mode: "UPLOAD" | "VIEW";
    prescription: CompletePrescriptionRecord | null;
}> {

    try {

        //----------------------------------------------------
        // Read existing prescriptions for this patient.
        //----------------------------------------------------

        const existingPrescriptions =
            await prescriptionStorage
                .getPatientPrescriptions({
                    userId,
                    patientId,
                    familyId,
                    recordContext,
                });

        //----------------------------------------------------
        // We only treat the upload as the same prescription
        // when this patient has exactly ONE saved prescription.
        //----------------------------------------------------

        if (
            existingPrescriptions.length !== 1
        ) {

            return {
                mode: "UPLOAD",
                prescription: null,
            };

        }

        //----------------------------------------------------
        // There is exactly one saved prescription.
        //----------------------------------------------------

        const existingPrescription =
            existingPrescriptions[0];

        const saved =
            existingPrescription.prescription;

        //----------------------------------------------------
        // Normalise doctor / hospital names.
        //----------------------------------------------------

        const normalise =
            (
                value:
                    string | null | undefined
            ) =>
                value
                    ?.trim()
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .replace(
                        /[.,]/g,
                        ""
                    ) ?? "";

const incomingDoctor =
    normalise(
        extracted.encounterIdentity
            .doctorName
    );

        const savedDoctor =
            normalise(
                saved.doctorName
            );

const incomingHospital =
    normalise(
        extracted.encounterIdentity
            .hospitalOrClinic
    );

        const savedHospital =
            normalise(
                saved.hospitalOrClinic
            );

        //----------------------------------------------------
        // Doctor must match.
        //----------------------------------------------------

        const sameDoctor =
            Boolean(
                incomingDoctor &&
                savedDoctor &&
                incomingDoctor ===
                    savedDoctor
            );

        //----------------------------------------------------
        // Hospital must match.
        //----------------------------------------------------

        const sameHospital =
            Boolean(
                incomingHospital &&
                savedHospital &&
                incomingHospital ===
                    savedHospital
            );

        //----------------------------------------------------
        // If doctor or hospital does not match,
        // this is treated as a new prescription.
        //----------------------------------------------------

        if (
            !sameDoctor ||
            !sameHospital
        ) {

            console.log(
                "PRESCRIPTION MATCH: NO"
            );

            console.log(
                "Doctor:",
                incomingDoctor,
                "vs",
                savedDoctor
            );

            console.log(
                "Hospital:",
                incomingHospital,
                "vs",
                savedHospital
            );

            return {
                mode: "UPLOAD",
                prescription: null,
            };

        }

        //----------------------------------------------------
        // Same patient + same doctor + same hospital.
        //
        // Now check whether all SAVED medicines have been
        // validated.
        //
        // We deliberately DO NOT compare them with OCR.
        //----------------------------------------------------

        const medicines =
            existingPrescription.medicines;

        const allMedicinesValidated =
            medicines.length > 0 &&
            medicines.every(
                medicine =>
                    medicine.validationStatus ===
                    "VALIDATED"
            );

        //----------------------------------------------------
        // If any saved medicine is still pending,
        // do not enter VIEW mode.
        //----------------------------------------------------

        if (
            !allMedicinesValidated
        ) {

            console.log(
                "PRESCRIPTION MATCH: FOUND"
            );

            console.log(
                "PRESCRIPTION STATUS: PENDING VALIDATION"
            );

            return {
                mode: "UPLOAD",
                prescription: null,
            };

        }

        //----------------------------------------------------
        // SAME PRESCRIPTION
        //
        // Return the complete saved database record.
        //
        // Nothing from the new OCR medicine extraction
        // is used for VIEW mode.
        //----------------------------------------------------

        console.log(
            "PRESCRIPTION MATCH: SAME PRESCRIPTION"
        );

        console.log(
            "Using saved prescription from database."
        );

        return {
            mode: "VIEW",
            prescription:
                existingPrescription,
        };

    }
    catch (error) {

        console.error(
            "Prescription duplicate check failed:",
            error
        );

        return {
            mode: "UPLOAD",
            prescription: null,
        };

    }

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
                    t("medication.selectPrescription")
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
    t("medication.preparingPrescription")
);

// Give the browser one render cycle to display
// the progress UI before starting prescription processing.
await new Promise<void>(
    resolve => {
        window.setTimeout(
            resolve,
            0
        );
    }
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
        t("medication.readingPrescription")
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
        t("medication.readFailed")

    );

    return;

}

setReadingProgress(
    100
);

setReadingStatus(
    t("medication.prescriptionReadSuccess")
);

//------------------------------------------------------
// PATIENT DATABASE FALLBACK
//
// OCR remains the primary source.
//
// Only when Age or Sex was not extracted,
// use the already-selected patient's registered data.
//
// Never overwrite a value successfully extracted
// from the prescription.
//------------------------------------------------------

let resolvedPrescription =
    result.data;

//------------------------------------------------------
// CONSULTATION DATE FALLBACK
//
// OCR remains the primary source.
//
// If OCR successfully reads a consultation date,
// keep that value.
//
// If OCR does not return a date,
// use today's date.
//
// The date remains editable in PatientCard.
//------------------------------------------------------

if (
    !resolvedPrescription
        .encounterIdentity
        .consultationDate
) {

    const today =
        new Date();

    const todayDate =
        [
            today.getFullYear(),
            String(
                today.getMonth() + 1
            ).padStart(2, "0"),
            String(
                today.getDate()
            ).padStart(2, "0"),
        ].join("-");

    resolvedPrescription = {

        ...resolvedPrescription,

        encounterIdentity: {

            ...resolvedPrescription
                .encounterIdentity,

            consultationDate:
                todayDate,

        },

    };

    console.log(
        "CONSULTATION DATE FALLBACK:",
        todayDate
    );
}

const ageMissing =
    !resolvedPrescription
        .patientIdentity
        .patientAge;

const sexMissing =
    !resolvedPrescription
        .patientIdentity
        .patientGender;

if (
    patientId &&
    (
        ageMissing ||
        sexMissing
    )
) {

    try {

        const patientResult =
            await patientStorage.getPatient(
                patientId
            );

        if (
            patientResult.success &&
            patientResult.data
        ) {

            const patient =
                patientResult.data;

            const resolvedAge =
                ageMissing
                    ? calculatePatientAge(
                        patient.dateOfBirth
                    )
                    : null;

            const resolvedSex =
                sexMissing
                    ? patient.gender
                    : null;

            resolvedPrescription = {

                ...resolvedPrescription,

                patientIdentity: {

                    ...resolvedPrescription
                        .patientIdentity,

                    patientAge:
                        ageMissing &&
                        resolvedAge
                            ? resolvedAge
                            : resolvedPrescription
                                .patientIdentity
                                .patientAge,

                    patientGender:
                        sexMissing &&
                        resolvedSex
                            ? resolvedSex
                            : resolvedPrescription
                                .patientIdentity
                                .patientGender,

                },

            };

            console.log(
                "PATIENT FALLBACK:",
                {
                    patientId,
                    age:
                        ageMissing
                            ? resolvedAge
                            : "OCR",
                    sex:
                        sexMissing
                            ? resolvedSex
                            : "OCR",
                }
            );

        }

    }
    catch (patientError) {

        console.error(
            "Patient fallback failed:",
            patientError
        );

    }

}

//------------------------------------------------------
// CAREVR GATEKEEPER
//------------------------------------------------------

const validationCards =
    generateValidationCards(
        resolvedPrescription
    );

const response = await fetch(
    "/api/gatekeeper",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            originalPrescription:
                JSON.stringify(
                    resolvedPrescription
                ),
            validationCards,
        }),
    }
);

//------------------------------------------------------
// SELF Patient Validation
//------------------------------------------------------

const extractedName =
    result.data.patientIdentity
        .patientName
        ?.replace(/^MR\.?/i, "")
        ?.replace(/^MRS\.?/i, "")
        ?.replace(/^MS\.?/i, "")
        ?.trim()
        ?.toLowerCase();

const selectedName =
    patientName
        ?.trim()
        ?.toLowerCase();

setPatientValidationError(null);

if (
    recordContext === "SELF" &&
    extractedName &&
    selectedName &&
    extractedName !== selectedName
) {
    setPatientValidationError({
        extractedName,
    });

    return;
}



//------------------------------------------------------
// Check whether this document already exists
//------------------------------------------------------

console.log(
    "OCR CONSULTATION DATE:",
    result.data.encounterIdentity
        .consultationDate
);

console.log(
    "OCR DOCTOR:",
    result.data.encounterIdentity
        .doctorName
);

console.log(
    "OCR HOSPITAL:",
    result.data.encounterIdentity
        .hospitalOrClinic
);

//------------------------------------------------------
// Check whether this document already exists
//------------------------------------------------------

const duplicateResult =
    await checkExistingPrescription(
        resolvedPrescription
    );

//------------------------------------------------------
// IMPORTANT
//
// If OCR has failed to read important editable
// information, keep this as an UPLOAD review.
//
// The user must still be able to correct:
// - Age
// - Sex
// - Consultation Date
// - Consultation Mode
// - other editable fields
//
// A partially-read prescription must NEVER become
// read-only simply because the duplicate checker
// found an existing prescription.
//------------------------------------------------------

const ageUnavailable =
    !resolvedPrescription
        .patientIdentity
        .patientAge;

const sexUnavailable =
    !resolvedPrescription
        .patientIdentity
        .patientGender;

const doctorTypeUnavailable =
    !resolvedPrescription
        .encounterIdentity
        .doctorType;

const consultationDateUnavailable =
    !resolvedPrescription
        .encounterIdentity
        .consultationDate;

//------------------------------------------------------
// If important OCR information is missing,
// keep the review editable.
//------------------------------------------------------

const requiresEditableReview =
    ageUnavailable ||
    sexUnavailable ||
    doctorTypeUnavailable ||
    consultationDateUnavailable;

if (
    duplicateResult.mode === "VIEW" &&
    duplicateResult.prescription &&
    !requiresEditableReview
) {

    setPrescriptionReviewMode(
        "VIEW"
    );

    setExtractedPrescription(
        mapPrescriptionToReview(
            duplicateResult.prescription
        )
    );

    return;
}

//------------------------------------------------------
// Otherwise this remains a normal upload review.
//
// This preserves the OCR result plus any patient
// database fallback values.
//------------------------------------------------------

setPrescriptionReviewMode(
    "UPLOAD"
);

setExtractedPrescription(
    resolvedPrescription
);

        }
catch (error) {

    console.error(
        t("medication.prescriptionReadError"),
        error
    );

    if (error instanceof Error) {

        setValidationError(error.message);

    }
    else {

        setValidationError(
            t("medication.processingFailed")
        );

    }

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


//------------------------------------------------------------
// SAVE PRESCRIPTION
//------------------------------------------------------------

const savedPrescription =
    await prescriptionStorage.savePrescription(
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
    t("medication.saveSuccess")
);

onSaveComplete?.();

    }
    catch (error) {

        console.error(
            "Prescription Save Error:",
            error
        );

        setValidationError(

            error instanceof Error
                ? error.message
                : t("medication.saveFailed")

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
                                📷 {t("medication.capturePhoto")}
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
                                {t("common.cancel")}
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

                {t("medication.patientMismatchTitle")}

            </h3>

            <p>

                {t("medication.patientMismatch")}

                <strong>

                    {" "}
                    {patientValidationError.extractedName}

                </strong>

            </p>

            <p>

                {t("medication.currentlyAddingPrescriptionFor")}

                <strong>

                    {" "}
                    {patientName}

                </strong>

            </p>

            <p>

                {t("medication.chooseCorrectPrescription")}

            </p>

            <button

                type="button"

                onClick={cancelReview}

                style={secondaryButton}

            >

                {t("medication.reupload")}

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

    mode={prescriptionReviewMode}

    saving={saving}

    onReupload={cancelReview}

    onConfirm={savePrescription}

/>

                )

            }

        </div>

    );

}
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

import {
    prescriptionStorage,
} from "@/lib/prescription/prescriptionStorage";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

interface PrescriptionWorkspaceProps {

    method:
        MedicationDetailOption;

    userId:
        string;

    recordContext:
        "SELF" | "FAMILY";

    patientId:
        string | null;

    familyId:
        string | null;

    onCancelReview:
        () => void;

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

    userId,

    recordContext,

    patientId,

    familyId,

    onCancelReview,

}: PrescriptionWorkspaceProps) {


    //--------------------------------------------------------
    // Refs
    //--------------------------------------------------------

    const cameraInputRef =
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
    reviewedPrescription,
    setReviewedPrescription,
] =
    useState<ExtractedPrescription | null>(
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
    // Open Correct Picker
    //--------------------------------------------------------

    useEffect(() => {

if (
    method === "TAKE_PHOTO"
) {

    void openCamera();

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

    async function handleFiles(
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

setReviewedPrescription(
    null
);

        setSelectedFiles(
    files
);


        setSelectedSource(
            source
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
            await navigator.mediaDevices
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
                    videoRef.current
                ) {

                    videoRef.current.srcObject =
                        stream;


                    try {

                        await videoRef.current
                            .play();

                    }
                    catch (error) {

                        console.error(
                            "Camera Playback Error:",
                            error
                        );

                    }

                }

            },
            0
        );

    }
    catch (error) {

        console.error(
            "Camera Access Error:",
            error
        );


        setCameraError(
            "Unable to access the camera. Please check camera permission and try again."
        );

    }

}

//--------------------------------------------------------
// Capture Camera Photo
//--------------------------------------------------------

async function captureCameraPhoto() {

    const video =
        videoRef.current;

    const canvas =
        canvasRef.current;


    if (
        !video ||
        !canvas ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        setCameraError(
            "Camera is not ready. Please try again."
        );

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

        setCameraError(
            "Unable to capture the photo."
        );

        return;

    }


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    const blob =
        await new Promise<Blob | null>(
            resolve => {

                canvas.toBlob(
                    resolve,
                    "image/jpeg",
                    0.92
                );

            }
        );


    if (
        !blob
    ) {

        setCameraError(
            "Unable to prepare the captured photo."
        );

        return;

    }


    const capturedFile =
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
            capturedFile,
        ]
    );


    setSelectedSource(
        "camera"
    );


    await readPrescription(
        [
            capturedFile,
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

setReviewedPrescription(
    null
);

}

//--------------------------------------------------------
// Cancel Review
//--------------------------------------------------------

function cancelReview() {

    removeAllSelectedFiles();

    onCancelReview();

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

setReviewedPrescription(
    null
);

}

//--------------------------------------------------------
// Update Reviewed Medicine
//--------------------------------------------------------

function updateReviewedMedicine(
    medicineIndex: number,
    updates:
        Partial<
            ExtractedPrescription["medicines"][number]
        >
) {

    setReviewedPrescription(
        current => {

            if (!current) {

                return current;

            }


            return {

                ...current,

                medicines:
                    current.medicines.map(
                        (
                            medicine,
                            index
                        ) =>
                            index === medicineIndex
                                ? {
                                    ...medicine,
                                    ...updates,
                                }
                                : medicine
                    ),

            };

        }
    );

}

//--------------------------------------------------------
// Add Reviewed Medicine
//--------------------------------------------------------

function addReviewedMedicine() {

    setReviewedPrescription(
        current => {

            if (!current) {

                return current;

            }


            return {

                ...current,

                medicines: [

                    ...current.medicines,

                    {
                        name:
                            "",

                        strength:
                            null,

                        form:
                            null,

                        dose:
                            null,

                        frequency:
                            null,

                        timings:
                            [],

                        duration:
                            null,

                        instructions:
                            null,
                    },

                ],

            };

        }
    );

}


//--------------------------------------------------------
// Remove Reviewed Medicine
//--------------------------------------------------------

function removeReviewedMedicine(
    medicineIndex: number
) {

    setReviewedPrescription(
        current => {

            if (!current) {

                return current;

            }


            return {

                ...current,

                medicines:
                    current.medicines.filter(
                        (
                            _medicine,
                            index
                        ) =>
                            index !== medicineIndex
                    ),

            };

        }
    );

}

//--------------------------------------------------------
// Read Prescription
//--------------------------------------------------------

async function readPrescription(
    filesToRead:
        File[] = selectedFiles
) {

if (
    filesToRead.length === 0 ||
    processing
) {

    if (
        filesToRead.length === 0
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

setReadingProgress(
    10
);

setReadingStatus(
    "Preparing prescription pages..."
);


    try {

setReadingProgress(
    35
);

setReadingStatus(
    "Reading prescription..."
);


const progressTimer =
    window.setInterval(
        () => {

            setReadingProgress(
                current => {

                    if (current >= 90) {

                        return current;

                    }

                    if (current < 50) {

                        return current + 5;

                    }

                    if (current < 75) {

                        return current + 3;

                    }

                    return current + 1;

                }
            );

        },
        700
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
    "Prescription ready for review."
);

setExtractedPrescription(
    result.data
);

setReviewedPrescription(
    structuredClone(
        result.data
    )
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

async function savePrescription() {

    if (
        !reviewedPrescription ||
        saving
    ) {

        return;

    }


    setValidationError(
        null
    );

    setSaveSuccess(
        null
    );

    setSaving(
        true
    );


    try {

        await prescriptionStorage
            .saveReviewedPrescription(

                reviewedPrescription,

                {

                    userId,

                    patientId,

                    familyId,

                    recordContext,

                }

            );


        //----------------------------------------------------
        // Clear Temporary Media And Review State
        // Only After Successful Persistence
        //----------------------------------------------------

        setSelectedFiles(
            []
        );

        setSelectedSource(
            null
        );

        setExtractedPrescription(
            null
        );

        setReviewedPrescription(
            null
        );


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

        setSaving(
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

{cameraOpen && (

    <div style={cameraContainer}>

        <video
            ref={
                videoRef
            }
            autoPlay
            playsInline
            muted
            style={cameraVideo}
        />


        <canvas
            ref={
                canvasRef
            }
            style={{
                display:
                    "none",
            }}
        />


        <div style={cameraActionRow}>

            <button
    type="button"
    onClick={
        captureCameraPhoto
    }
    style={primaryButton}
>
    📷 Capture Photo
</button>


            <button
                type="button"
                onClick={
                    closeCamera
                }
                style={secondaryButton}
            >
                Cancel
            </button>

        </div>

    </div>

)}


{cameraError && (

    <div style={errorBox}>

        <p style={errorText}>
            {cameraError}
        </p>

    </div>

)}

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


{saveSuccess && (

    <div style={successBox}>

        <p style={successText}>
            {saveSuccess}
        </p>

    </div>

)}

            {validationError && (

    <div style={errorBox}>

        <p style={errorText}>
            {validationError}
        </p>

    </div>

)}


{processing && (

    <div style={progressContainer}>

        <div style={progressHeader}>

            <span>
                {readingStatus}
            </span>

            <span>
                {readingProgress}%
            </span>

        </div>


        <div style={progressTrack}>

            <div
                style={{
                    ...progressFill,

                    width:
                        `${readingProgress}%`,
                }}
            />

        </div>

    </div>

)}
{extractedPrescription &&
    reviewedPrescription && (

    <div style={reviewContainer}>

        <h3 style={reviewTitle}>
            Review Prescription
        </h3>


        <p style={reviewDescription}>
            Review the information read from the document
            before saving.
        </p>


        <div style={reviewSection}>

            <h4 style={sectionTitle}>
                Diagnosis / Doctor Assessment
            </h4>


<textarea
    value={
        reviewedPrescription
            .diagnosisOrAssessment ??
        ""
    }
    placeholder="Not clearly available in document"
    onChange={(event) => {

        const value =
            event.target.value;

        setReviewedPrescription(
            current =>
                current
                    ? {
                        ...current,

                        diagnosisOrAssessment:
                            value || null,
                    }
                    : current
        );

    }}
    style={reviewTextarea}
/>

        </div>


        <div style={reviewSection}>

            <h4 style={sectionTitle}>
                Prescription Details
            </h4>


            <div style={detailsGrid}>

                <div style={detailItem}>

                    <span style={detailLabel}>
                        Doctor
                    </span>

<input
    type="text"
    value={
        reviewedPrescription
            .doctorName ??
        ""
    }
    placeholder="Not clearly available"
    onChange={(event) => {

        const value =
            event.target.value;

        setReviewedPrescription(
            current =>
                current
                    ? {
                        ...current,

                        doctorName:
                            value || null,
                    }
                    : current
        );

    }}
    style={reviewInput}
/>

                </div>


                <div style={detailItem}>

                    <span style={detailLabel}>
                        Date
                    </span>

<input
    type="text"
    value={
        reviewedPrescription
            .consultationDate ??
        ""
    }
    placeholder="Not clearly available"
    onChange={(event) => {

        const value =
            event.target.value;

        setReviewedPrescription(
            current =>
                current
                    ? {
                        ...current,

                        consultationDate:
                            value || null,
                    }
                    : current
        );

    }}
    style={reviewInput}
/>

                </div>


                <div style={detailItem}>

                    <span style={detailLabel}>
                        Hospital / Clinic
                    </span>

<input
    type="text"
    value={
        reviewedPrescription
            .hospitalOrClinic ??
        ""
    }
    placeholder="Not clearly available"
    onChange={(event) => {

        const value =
            event.target.value;

        setReviewedPrescription(
            current =>
                current
                    ? {
                        ...current,

                        hospitalOrClinic:
                            value || null,
                    }
                    : current
        );

    }}
    style={reviewInput}
/>

                </div>

            </div>

        </div>


        <div style={reviewSection}>

            <h4 style={sectionTitle}>
                Medicines
            </h4>


            {
                reviewedPrescription
    .medicines.length === 0
                    ? (

                        <p style={sectionValue}>
                            No medicines were clearly
                            identified in the document.
                        </p>

                    )
                    : (

                        <div style={medicineList}>

                            {
                                reviewedPrescription
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

                                                <div style={medicineHeader}>

                                                    <span style={medicineNumber}>
                                                        {index + 1}
                                                    </span>

                                                    <div style={medicineNameContainer}>

                                                        <input
    type="text"
    value={
        medicine.name
    }
    aria-label={
        `Medicine ${index + 1} name`
    }
    onChange={(event) =>
        updateReviewedMedicine(
            index,
            {
                name:
                    event.target.value,
            }
        )
    }
    style={medicineNameInput}
/>


</div>


<button
    type="button"
    onClick={() =>
        removeReviewedMedicine(
            index
        )
    }
    aria-label={
        `Remove medicine ${index + 1}`
    }
    style={removeMedicineButton}
>
    Remove
</button>

</div>

<div style={medicineDetailsGrid}>

    <div style={detailItem}>

        <span style={detailLabel}>
            Strength
        </span>

        <input
            type="text"
            value={
                medicine.strength ??
                ""
            }
            placeholder="Not clearly available"
            onChange={(event) =>
                updateReviewedMedicine(
                    index,
                    {
                        strength:
                            event.target.value ||
                            null,
                    }
                )
            }
            style={reviewInput}
        />

    </div>


    <div style={detailItem}>

        <span style={detailLabel}>
            Form
        </span>

        <input
            type="text"
            value={
                medicine.form ??
                ""
            }
            placeholder="e.g. Tablet"
            onChange={(event) =>
                updateReviewedMedicine(
                    index,
                    {
                        form:
                            event.target.value ||
                            null,
                    }
                )
            }
            style={reviewInput}
        />

    </div>


                                                </div>


                                                <div style={medicineDetailsGrid}>

                                                    <div style={detailItem}>

                                                        <span style={detailLabel}>
                                                            Dose
                                                        </span>

                                                        <input
    type="text"
    value={
        medicine.dose ??
        ""
    }
    placeholder="Not clearly available"
    onChange={(event) =>
        updateReviewedMedicine(
            index,
            {
                dose:
                    event.target.value ||
                    null,
            }
        )
    }
    style={reviewInput}
/>

                                                    </div>


                                                    <div style={detailItem}>

                                                        <span style={detailLabel}>
                                                            Frequency
                                                        </span>

                                                        <input
    type="text"
    value={
        medicine.frequency ??
        ""
    }
    placeholder="Not clearly available"
    onChange={(event) =>
        updateReviewedMedicine(
            index,
            {
                frequency:
                    event.target.value ||
                    null,
            }
        )
    }
    style={reviewInput}
/>

                                                    </div>


                                                    <div style={detailItem}>

                                                        <span style={detailLabel}>
                                                            Timing
                                                        </span>

                                                        <input
    type="text"
    value={
        medicine.timings.join(
            ", "
        )
    }
    placeholder="e.g. Morning, Night"
    onChange={(event) => {

        const timings =
            event.target.value
                .split(",")
                .map(
                    timing =>
                        timing.trim()
                )
                .filter(Boolean);


        updateReviewedMedicine(
            index,
            {
                timings,
            }
        );

    }}
    style={reviewInput}
/>

                                                    </div>


                                                    <div style={detailItem}>

                                                        <span style={detailLabel}>
                                                            Duration
                                                        </span>

                                                        <input
    type="text"
    value={
        medicine.duration ??
        ""
    }
    placeholder="Not clearly available"
    onChange={(event) =>
        updateReviewedMedicine(
            index,
            {
                duration:
                    event.target.value ||
                    null,
            }
        )
    }
    style={reviewInput}
/>

                                                    </div>

                                                </div>


                                                <div style={instructionBox}>

    <span style={detailLabel}>
        Instructions
    </span>

    <textarea
        value={
            medicine.instructions ??
            ""
        }
        placeholder="Not clearly available"
        onChange={(event) =>
            updateReviewedMedicine(
                index,
                {
                    instructions:
                        event.target.value ||
                        null,
                }
            )
        }
        style={medicineInstructionTextarea}
    />

</div>
                                            </div>

                                        )
                                    )
                            }

                        </div>

                    )
            }


<div style={addMedicineActionRow}>

    <button
        type="button"
        onClick={
            addReviewedMedicine
        }
        style={addMedicineButton}
    >
        + Add Medicine
    </button>

</div>

</div>
        <div style={reviewSection}>

    <h4 style={sectionTitle}>
        Additional Instructions
    </h4>

    <textarea
        value={
            reviewedPrescription
                .additionalInstructions ??
            ""
        }
        placeholder="Not clearly available in document"
        onChange={(event) => {

            const value =
                event.target.value;


            setReviewedPrescription(
                current =>
                    current
                        ? {
                            ...current,

                            additionalInstructions:
                                value || null,
                        }
                        : current
            );

        }}
        style={reviewTextarea}
    />

</div>


<div
    className="prescription-review-actions"
    style={reviewActionRow}
>

    <button
        type="button"
        onClick={
            removeAllSelectedFiles
        }
        disabled={
            saving
        }
        style={secondaryButton}
    >
        Cancel Review
    </button>


    <button
        type="button"
        onClick={
            savePrescription
        }
        disabled={
            saving
        }
        style={{
            ...primaryButton,

            opacity:
                saving
                    ? 0.7
                    : 1,

            cursor:
                saving
                    ? "not-allowed"
                    : "pointer",
        }}
    >

        {
            saving
                ? "Saving..."
                : "Save Prescription"
        }

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

const progressContainer:
    React.CSSProperties = {

        marginTop:
            "16px",

        padding:
            "14px",

        background:
            "#ffffff",

        border:
            "1px solid #dbeafe",

        borderRadius:
            "10px",

    };


const progressHeader:
    React.CSSProperties = {

        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "12px",

        marginBottom:
            "10px",

        fontSize:
            "14px",

        fontWeight:
            700,

        color:
            "#1e3a8a",

    };


const progressTrack:
    React.CSSProperties = {

        width:
            "100%",

        height:
            "10px",

        background:
            "#dbeafe",

        borderRadius:
            "999px",

        overflow:
            "hidden",

    };


const progressFill:
    React.CSSProperties = {

        height:
            "100%",

        background:
            "#2563eb",

        borderRadius:
            "999px",

        transition:
            "width 0.4s ease",

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

const successBox:
    React.CSSProperties = {

        marginBottom:
            "16px",

        padding:
            "12px 16px",

        background:
            "#f0fdf4",

        border:
            "1px solid #bbf7d0",

        borderRadius:
            "8px",

    };


const successText:
    React.CSSProperties = {

        margin:
            0,

        fontWeight:
            600,

    };

const reviewContainer:
    React.CSSProperties = {

        padding:
            "20px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };


const reviewTitle:
    React.CSSProperties = {

        margin:
            "0 0 8px",

        fontSize:
            "22px",

        color:
            "#111827",

    };


const reviewDescription:
    React.CSSProperties = {

        margin:
            "0 0 20px",

        color:
            "#64748b",

        lineHeight:
            1.5,

    };


const reviewSection:
    React.CSSProperties = {

        marginBottom:
            "18px",

        padding:
            "16px",

        background:
            "#ffffff",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "10px",

    };


const sectionTitle:
    React.CSSProperties = {

        margin:
            "0 0 12px",

        fontSize:
            "17px",

        color:
            "#111827",

    };


const sectionValue:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#374151",

        lineHeight:
            1.6,

        whiteSpace:
            "pre-wrap",

    };


const detailsGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",

        gap:
            "14px",

    };


const detailItem:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "4px",

        minWidth:
            0,

    };


const detailLabel:
    React.CSSProperties = {

        fontSize:
            "13px",

        fontWeight:
            700,

        color:
            "#64748b",

    };


const detailValue:
    React.CSSProperties = {

        fontSize:
            "15px",

        color:
            "#111827",

        lineHeight:
            1.5,

        overflowWrap:
            "anywhere",

    };


const medicineList:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "14px",

    };


const medicineCard:
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


const medicineHeader:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "flex-start",

        gap:
            "12px",

        marginBottom:
            "14px",

    };


const medicineNumber:
    React.CSSProperties = {

        width:
            "28px",

        height:
            "28px",

        flex:
            "0 0 28px",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        background:
            "#e2e8f0",

        borderRadius:
            "50%",

        fontWeight:
            700,

        color:
            "#334155",

    };


const medicineName:
    React.CSSProperties = {

        margin:
            0,

        fontSize:
            "17px",

        color:
            "#111827",

    };


const medicineMeta:
    React.CSSProperties = {

        margin:
            "4px 0 0",

        color:
            "#64748b",

        fontSize:
            "14px",

    };


const medicineDetailsGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(140px, 1fr))",

        gap:
            "14px",

    };


const instructionBox:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "4px",

        marginTop:
            "14px",

        paddingTop:
            "14px",

        borderTop:
            "1px solid #e2e8f0",

    };


const reviewActionRow:
    React.CSSProperties = {

        display:
            "flex",

        justifyContent:
            "flex-end",

        gap:
            "12px",

        flexWrap:
            "wrap",

        marginTop:
            "16px",

    };

const reviewInput:
    React.CSSProperties = {

        width:
            "100%",

        boxSizing:
            "border-box",

        padding:
            "10px 12px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "15px",

        color:
            "#111827",

        background:
            "#ffffff",

    };


const reviewTextarea:
    React.CSSProperties = {

        width:
            "100%",

        minHeight:
            "100px",

        boxSizing:
            "border-box",

        padding:
            "12px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "15px",

        lineHeight:
            1.6,

        color:
            "#111827",

        background:
            "#ffffff",

        resize:
            "vertical",

    };

const medicineNameInput:
    React.CSSProperties = {

        width:
            "100%",

        boxSizing:
            "border-box",

        padding:
            "8px 10px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "17px",

        fontWeight:
            700,

        color:
            "#111827",

        background:
            "#ffffff",

    };


const medicineInstructionTextarea:
    React.CSSProperties = {

        width:
            "100%",

        minHeight:
            "72px",

        boxSizing:
            "border-box",

        padding:
            "10px 12px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "15px",

        lineHeight:
            1.5,

        color:
            "#111827",

        background:
            "#ffffff",

        resize:
            "vertical",

    };

const medicineNameContainer:
    React.CSSProperties = {

        flex:
            1,

        minWidth:
            0,

    };

const removeMedicineButton:
    React.CSSProperties = {

        flex:
            "0 0 auto",

        padding:
            "8px 10px",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "7px",

        fontSize:
            "14px",

        fontWeight:
            600,

        cursor:
            "pointer",

    };


const addMedicineActionRow:
    React.CSSProperties = {

        display:
            "flex",

        justifyContent:
            "flex-start",

        marginTop:
            "16px",

    };


const addMedicineButton:
    React.CSSProperties = {

        padding:
            "10px 14px",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "15px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };

const cameraContainer:
    React.CSSProperties = {

        width:
            "100%",

        marginBottom:
            "16px",

        padding:
            "16px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

        boxSizing:
            "border-box",

    };


const cameraVideo:
    React.CSSProperties = {

        display:
            "block",

        width:
            "100%",

        maxHeight:
            "520px",

        objectFit:
            "contain",

        background:
            "#000000",

        borderRadius:
            "10px",

    };


const cameraActionRow:
    React.CSSProperties = {

        display:
            "flex",

        justifyContent:
            "center",

        gap:
            "12px",

        flexWrap:
            "wrap",

        marginTop:
            "16px",

    };
"use client";

import {
    ChangeEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";


import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    prescriptionImageService,
} from "@/lib/prescription-image/prescriptionImageService";

import PrescriptionReview
    from "@/Components/dashboard/PrescriptionReview";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

interface ReadingProgressProps {
    label: string;
    message: string;
}

interface DoctorNotesUploadWorkspaceProps {
    mode: "self" | "family";

    patientId?: string | null;

    patientName?: string;

    currentUserName?: string;

    onCancel?: () => void;
}

interface SelectedImage {
    id: string;

    file: File;

    previewUrl: string;
}


//------------------------------------------------------------
// Reading Progress
//------------------------------------------------------------

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


//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function DoctorNotesUploadWorkspace({
    mode,
    patientId,
    patientName,
    currentUserName,
    onCancel,
}: DoctorNotesUploadWorkspaceProps) {

    const {
        t,
    } = useLanguage();

    //--------------------------------------------------------
    // Refs
    //--------------------------------------------------------

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const cameraInputRef =
        useRef<HTMLInputElement | null>(null);


    //--------------------------------------------------------
    // State
    //--------------------------------------------------------

    const [
        images,
        setImages,
    ] = useState<SelectedImage[]>([]);

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


    //--------------------------------------------------------
    // Constants
    //--------------------------------------------------------

    const MAX_IMAGES = 5;

    const recordingName =
        mode === "self"
            ? currentUserName ?? "yourself"
            : patientName ?? "your family member";


    //--------------------------------------------------------
    // Cleanup
    //--------------------------------------------------------

    useEffect(() => {

        return () => {

            images.forEach(
                image =>
                    URL.revokeObjectURL(
                        image.previewUrl
                    )
            );

        };

    }, [images]);


    //--------------------------------------------------------
    // Add Images
    //--------------------------------------------------------

    function addImages(
        selectedFiles: FileList | File[]
    ) {

        setError(null);

        const files =
            Array.from(selectedFiles);

        if (
            files.length === 0
        ) {
            return;
        }

        const remainingSlots =
            MAX_IMAGES - images.length;

        if (
            remainingSlots <= 0
        ) {

            setError(
                `You can upload a maximum of ${MAX_IMAGES} images.`
            );

            return;
        }

        const filesToAdd =
            files.slice(
                0,
                remainingSlots
            );

        const invalidFile =
            filesToAdd.find(
                file =>
                    !file.type.startsWith(
                        "image/"
                    )
            );

        if (invalidFile) {

            setError(
                "Please select image files only."
            );

            return;
        }

        const newImages =
            filesToAdd.map(
                file => ({
                    id:
                        `${Date.now()}-${Math.random()
                            .toString(36)
                            .slice(2)}`,

                    file,

                    previewUrl:
                        URL.createObjectURL(
                            file
                        ),
                })
            );

        setImages(
            previous => [
                ...previous,
                ...newImages,
            ]
        );

        if (
            files.length >
            remainingSlots
        ) {

            setError(
                `Only ${remainingSlots} image${
                    remainingSlots === 1
                        ? ""
                        : "s"
                } could be added. Maximum ${MAX_IMAGES} images allowed.`
            );
        }
    }


    //--------------------------------------------------------
    // File Input
    //--------------------------------------------------------

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>
    ) {

        if (
            event.target.files
        ) {

            addImages(
                event.target.files
            );
        }

        event.target.value = "";
    }


    //--------------------------------------------------------
    // Remove Image
    //--------------------------------------------------------

    function removeImage(
        imageId: string
    ) {

        setImages(
            previous => {

                const imageToRemove =
                    previous.find(
                        image =>
                            image.id ===
                            imageId
                    );

                if (
                    imageToRemove
                ) {

                    URL.revokeObjectURL(
                        imageToRemove.previewUrl
                    );
                }

                return previous.filter(
                    image =>
                        image.id !==
                        imageId
                );
            }
        );

        setError(null);
    }


    //--------------------------------------------------------
    // Clear Images
    //--------------------------------------------------------

    function clearImages() {

        images.forEach(
            image =>
                URL.revokeObjectURL(
                    image.previewUrl
                )
        );

        setImages([]);

        setError(null);

        setExtractedPrescription(
            null
        );
    }


    //--------------------------------------------------------
    // Drop
    //--------------------------------------------------------

    function handleDrop(
        event: React.DragEvent<HTMLDivElement>
    ) {

        event.preventDefault();

        setIsDragging(false);

        if (
            event.dataTransfer.files
        ) {

            addImages(
                event.dataTransfer.files
            );
        }
    }


    //--------------------------------------------------------
    // Continue / Read Doctor's Notes
    //--------------------------------------------------------

async function handleContinue() {

    if (
        images.length === 0
    ) {

        setError(
            "Please upload at least one image."
        );

        return;
    }

    if (
        isReading
    ) {

        return;
    }

    setError(null);

    setExtractedPrescription(
        null
    );

    setIsReading(true);

    try {

        const result =
            await prescriptionImageService.processFiles(
                images.map(
                    image =>
                        image.file
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

        setExtractedPrescription(
            result.data
        );

    }
    catch (error) {

        console.error(
            "Doctor's Notes Reading Error:",
            error
        );

        setError(
            error instanceof Error
                ? error.message
                : "Unable to read the doctor's notes."
        );

    }
    finally {

        setIsReading(false);
    }
}


    //--------------------------------------------------------
    // Re-upload
    //--------------------------------------------------------

    function handleReupload() {

        setExtractedPrescription(
            null
        );

        setError(null);
    }


    //--------------------------------------------------------
    // UI
    //--------------------------------------------------------

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >

            {!extractedPrescription && (
                <>

                    {/* HEADER */}

                    <div
                        style={{
                            marginBottom: "20px",
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
                            Upload Doctor's Notes
                        </h2>

                        <p
                            style={{
                                marginTop: "8px",
                                marginBottom: 0,
                                color: "#6B7280",
                                fontSize: "14px",
                                lineHeight: 1.5,
                            }}
                        >
                            Upload clear photos of the doctor's
                            notes for{" "}
                            <strong>
                                {recordingName}
                            </strong>
                            .
                        </p>

                    </div>


                    {/* UPLOAD AREA */}

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

                            padding:
                                "30px 20px",

                            textAlign:
                                "center",

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
                            📷
                        </div>

                        <div
                            style={{
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "#111827",
                                marginBottom: "6px",
                            }}
                        >
                            Upload images of the doctor's notes
                        </div>

                        <div
                            style={{
                                fontSize: "13px",
                                color: "#6B7280",
                                marginBottom: "18px",
                            }}
                        >
                            You can upload up to {MAX_IMAGES} images
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

                                disabled={
                                    images.length >=
                                    MAX_IMAGES
                                }

                                style={{
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "11px 18px",
                                    background: "#7043F5",
                                    color: "#FFFFFF",
                                    fontWeight: 700,

                                    cursor:
                                        images.length >=
                                        MAX_IMAGES
                                            ? "not-allowed"
                                            : "pointer",

                                    opacity:
                                        images.length >=
                                        MAX_IMAGES
                                            ? 0.5
                                            : 1,
                                }}
                            >
                                🖼️ Choose Images
                            </button>


                            <button
                                type="button"

                                onClick={() =>
                                    cameraInputRef.current?.click()
                                }

                                disabled={
                                    images.length >=
                                    MAX_IMAGES
                                }

                                style={{
                                    border:
                                        "1px solid #D1D5DB",

                                    borderRadius:
                                        "10px",

                                    padding:
                                        "11px 18px",

                                    background:
                                        "#FFFFFF",

                                    color:
                                        "#111827",

                                    fontWeight:
                                        700,

                                    cursor:
                                        images.length >=
                                        MAX_IMAGES
                                            ? "not-allowed"
                                            : "pointer",

                                    opacity:
                                        images.length >=
                                        MAX_IMAGES
                                            ? 0.5
                                            : 1,
                                }}
                            >
                                📷 Take Photo
                            </button>

                        </div>


                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={
                                handleFileChange
                            }
                            style={{
                                display: "none",
                            }}
                        />


                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={
                                handleFileChange
                            }
                            style={{
                                display: "none",
                            }}
                        />

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div
                            role="alert"
                            style={{
                                marginTop: "14px",
                                padding:
                                    "12px 14px",
                                borderRadius:
                                    "10px",
                                background:
                                    "#FEF2F2",
                                border:
                                    "1px solid #FECACA",
                                color:
                                    "#B91C1C",
                                fontSize:
                                    "14px",
                                lineHeight:
                                    1.5,
                            }}
                        >
                            {error}
                        </div>
                    )}


                    {/* IMAGE COUNT */}

                    {images.length > 0 && (
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
                                {images.length} image
                                {images.length === 1
                                    ? ""
                                    : "s"} selected
                            </div>


                            <button
                                type="button"
                                onClick={
                                    clearImages
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    color:
                                        "#DC2626",
                                    fontWeight:
                                        600,
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Clear all
                            </button>

                        </div>
                    )}


                    {/* PREVIEWS */}

                    {images.length > 0 && (
                        <div
                            style={{
                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(150px, 1fr))",

                                gap:
                                    "14px",

                                marginTop:
                                    "14px",
                            }}
                        >

                            {images.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <div
                                        key={
                                            image.id
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
                                                image.previewUrl
                                            }

                                            alt={
                                                `Doctor's note ${
                                                    index + 1
                                                }`
                                            }

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

                                                whiteSpace:
                                                    "nowrap",

                                                overflow:
                                                    "hidden",

                                                textOverflow:
                                                    "ellipsis",
                                            }}
                                        >
                                            Page{" "}
                                            {index + 1}
                                        </div>


                                        <button
                                            type="button"

                                            aria-label={
                                                `Remove image ${
                                                    index + 1
                                                }`
                                            }

                                            onClick={() =>
                                                removeImage(
                                                    image.id
                                                )
                                            }

                                            style={{
                                                position:
                                                    "absolute",

                                                top:
                                                    "8px",

                                                right:
                                                    "8px",

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


                    {/* READING PROGRESS */}

                    {isReading && (
                        <ReadingProgress
                            label="Reading Doctor's Notes..."
                            message="Please wait while CareVR reads the notes."
                        />
                    )}


                    {/* ACTIONS */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap:
                                "12px",
                            marginTop:
                                "24px",
                            flexWrap:
                                "wrap",
                        }}
                    >

                        {onCancel ? (
                            <button
                                type="button"
                                onClick={
                                    onCancel
                                }
                                style={{
                                    border:
                                        "1px solid #D1D5DB",
                                    borderRadius:
                                        "10px",
                                    padding:
                                        "11px 18px",
                                    background:
                                        "#FFFFFF",
                                    color:
                                        "#374151",
                                    fontWeight:
                                        700,
                                    cursor:
                                        "pointer",
                                }}
                            >
                                ← Back
                            </button>
                        ) : (
                            <div />
                        )}


                        <button
                            type="button"
                            onClick={
                                handleContinue
                            }

                            disabled={
                                images.length === 0 ||
                                isReading
                            }

                            style={{
                                border:
                                    "none",

                                borderRadius:
                                    "10px",

                                padding:
                                    "11px 22px",

                                background:
                                    images.length > 0
                                        ? "#7043F5"
                                        : "#D1D5DB",

                                color:
                                    "#FFFFFF",

                                fontWeight:
                                    700,

                                cursor:
                                    images.length > 0
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                        >
                            {isReading
                                ? "Reading Doctor's Notes..."
                                : "Continue →"}
                        </button>

                    </div>

                </>
            )}


            {/* ================================================= */}
            {/* SAME REVIEW PANELS AS PRESCRIPTION */}
            {/* ================================================= */}

            {extractedPrescription && !isReading && (

                <PrescriptionReview

                    prescription={
                        extractedPrescription
                    }

                    saving={
                        false
                    }

                    patientName={
                        recordingName
                    }

                    recordContext={
                        mode === "self"
                            ? "SELF"
                            : "FAMILY"
                    }

                    mode="VIEW"

                    hideVitals={
                        true
                    }

                    onReupload={
                        handleReupload
                    }

                    onConfirm={
                        () => {}
                    }

                />

            )}

        </div>
    );
}
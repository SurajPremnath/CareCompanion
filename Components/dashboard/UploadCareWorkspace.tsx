"use client";

import {
    useState,
} from "react";

import {
    medicalImageService,
} from "@/lib/medical-image/medicalImageService";

import {
    dailyCareStorage,
} from "@/lib/storage/DailyCareStorage";

import {
    selfDailyCareStorage,
} from "@/lib/storage/SelfDailyCareStorage";

import type {
    TemperatureUnit,
} from "@/lib/medical-image/medicalImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";


type ImageSource =
    | "camera"
    | "gallery";


interface UploadCareWorkspaceProps {

    mode:
        | "self"
        | "family";

    patientId?:
        string;

    patientName?:
        string;

    currentUserName:
        string;

}


interface UploadReadingState {

    temperature:
        string;

    temperatureUnit:
        TemperatureUnit;

weightKg:string;

    systolic:
        string;

    diastolic:
        string;

    pulse:
        string;

    spo2:
        string;

}


function createEmptyReading():
    UploadReadingState {

    return {

        temperature:
            "",

        temperatureUnit:
            "F",

weightKg: "",

        systolic:
            "",

        diastolic:
            "",

        pulse:
            "",

        spo2:
            "",

    };

}


export default function UploadCareWorkspace({

    mode,

    patientId,

    patientName,

    currentUserName,

}: UploadCareWorkspaceProps) {

const {
    t,
} = useLanguage();

    const [
        reading,
        setReading,
    ] =
        useState<UploadReadingState>(
            createEmptyReading()
        );


    const [
        processingImage,
        setProcessingImage,
    ] =
        useState(false);


    const [
        saving,
        setSaving,
    ] =
        useState(false);


    const [
        activeImageSource,
        setActiveImageSource,
    ] =
        useState<ImageSource | null>(
            null
        );


    const [
        imageReadSuccessful,
        setImageReadSuccessful,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );


    const [
        successMessage,
        setSuccessMessage,
    ] =
        useState<string | null>(
            null
        );


    const recordingName =

        mode === "self"

            ? currentUserName

            : patientName ?? t("medication.yourFamilyMember");


    //--------------------------------------------------------
    // Update Field
    //--------------------------------------------------------

    function updateField<
        K extends keyof UploadReadingState
    >(
        field: K,
        value: UploadReadingState[K]
    ) {

        setReading(previous => ({

            ...previous,

            [field]:
                value,

        }));

    }


    //--------------------------------------------------------
    // Reset
    //--------------------------------------------------------

    function resetUploadSession() {

        setReading(
            createEmptyReading()
        );

        setProcessingImage(
            false
        );

        setSaving(
            false
        );

        setActiveImageSource(
            null
        );

        setImageReadSuccessful(
            false
        );

        setError(
            null
        );

        setSuccessMessage(
            null
        );

    }


    //--------------------------------------------------------
    // Process Image
    //--------------------------------------------------------

    async function handleMedicalImage(

        event:
            React.ChangeEvent<HTMLInputElement>,

        source:
            ImageSource

    ) {

        const image =
            event.target.files?.[0];


        event.target.value =
            "";


        if (!image) {

            return;

        }


        if (
            processingImage ||
            saving
        ) {

            return;

        }


        setError(
            null
        );

        setSuccessMessage(
            null
        );

        setActiveImageSource(
            source
        );

        setProcessingImage(
            true
        );


        try {

            const result =

                await medicalImageService
                    .processImage(
                        image
                    );


            if (
                !result.success ||
                !result.data
            ) {

                setError(

                    result.error ??

                    t("dailyCare.unableToReadImage")

                );

                return;

            }


            const readings =
                result.data;


            const hasReading =

                readings.temperature !== null ||

                readings.weightKg !== null ||

                readings.systolic !== null ||

                readings.diastolic !== null ||

                readings.pulse !== null ||

                readings.spo2 !== null;


            if (!hasReading) {

                setError(
                    t("dailyCare.noReadingDetected")
                );

                return;

            }


            setReading(previous => ({

                temperature:

                    readings.temperature !== null

                        ? String(
                            readings.temperature
                        )

                        : "",


                temperatureUnit:

                    readings.temperatureUnit ??

                    previous.temperatureUnit,


weightKg:

    readings.weightKg !== null

        ? String(readings.weightKg)

        : previous.weightKg,

                systolic:
	
                    readings.systolic !== null

                        ? String(
                            readings.systolic
                        )

                        : "",


                diastolic:

                    readings.diastolic !== null

                        ? String(
                            readings.diastolic
                        )

                        : "",


                pulse:

                    readings.pulse !== null

                        ? String(
                            readings.pulse
                        )

                        : "",


                spo2:

                    readings.spo2 !== null

                        ? String(
                            readings.spo2
                        )

                        : "",

            }));


            setImageReadSuccessful(
                true
            );

        }
        catch (processingError) {

            console.error(

                t("medication.uploadCareImageProcessingError"),

                processingError

            );


            setError(

                processingError instanceof Error

                    ? processingError.message

                    : t("dailyCare.unableToProcessImage")

            );

        }
        finally {

            setProcessingImage(
                false
            );

            setActiveImageSource(
                null
            );

        }

    }


    //--------------------------------------------------------
    // Save
    //--------------------------------------------------------

    async function saveReading() {

        if (saving) {

            return;

        }


        if (
            mode === "family" &&
            !patientId
        ) {

            setError(
                "Please select a family member."
            );

            return;

        }


        const hasReading =

            reading.temperature.trim() !== "" ||

            reading.weightKg.trim() !== "" ||

            reading.systolic.trim() !== "" ||

            reading.diastolic.trim() !== "" ||

            reading.pulse.trim() !== "" ||

            reading.spo2.trim() !== "";


        if (!hasReading) {

            setError(
                t("dailyCare.keepOneReading")
            );

            return;

        }


        setSaving(
            true
        );

        setError(
            null
        );

        setSuccessMessage(
            null
        );


        try {

            const commonReading = {

                recordedAt:
                    new Date().toISOString(),

                overallStatus:
                    null,

                temperature:

                    reading.temperature.trim()

                        ? Number(
                            reading.temperature
                        )

                        : null,

                temperatureUnit:
                    reading.temperatureUnit,

weightKg:

    reading.weightKg.trim()

        ? Number(reading.weightKg)

        : null,

                systolic:

                    reading.systolic.trim()

                        ? Number(
                            reading.systolic
                        )

                        : null,

                diastolic:

                    reading.diastolic.trim()

                        ? Number(
                            reading.diastolic
                        )

                        : null,

                pulse:

                    reading.pulse.trim()

                        ? Number(
                            reading.pulse
                        )

                        : null,

                spo2:

                    reading.spo2.trim()

                        ? Number(
                            reading.spo2
                        )

                        : null,

                symptoms:
                    [],

                otherSymptom:
                    null,

                painLocations:
                    [],

                otherPainLocation:
                    null,

            };


            const result =

                mode === "self"

                    ? await selfDailyCareStorage
                        .save(
                            commonReading
                        )

                    : await dailyCareStorage
                        .save({

                            ...commonReading,

                            patientId:
                                patientId!,

                        });


            if (!result.success) {

                setError(

                    result.error ??

                    t("dailyCare.unableToSaveReading")

                );

                return;

            }


            setSuccessMessage(
                t("dailyCare.healthReadingSaved")
            );


            setReading(
                createEmptyReading()
            );

            setImageReadSuccessful(
                false
            );

        }
        catch (saveError) {

            console.error(

                t("medication.uploadCareSaveError"),

                saveError

            );


            setError(

                saveError instanceof Error

                    ? saveError.message

                    : t("dailyCare.unableToSaveReading")

            );

        }
        finally {

            setSaving(
                false
            );

        }

    }


    //--------------------------------------------------------
    // Render
    //--------------------------------------------------------

    return (

        <section style={workspace}>


{!imageReadSuccessful && (

    <div style={headerBlock}>

        <h3 style={title}>
            📷 {t("dailyCare.uploadHealthReading")}
        </h3>

        <p style={description}>
            {t("dailyCare.uploadReadingDescription")}
        </p>

    </div>

)}

            {!imageReadSuccessful && (

                <div style={uploadGrid}>


                    <label
                        style={{
                            ...uploadButton,

                            opacity:

                                processingImage ||
                                saving

                                    ? 0.7

                                    : 1,

                            cursor:

                                processingImage ||
                                saving

                                    ? "not-allowed"

                                    : "pointer",
                        }}
                    >

                        {

activeImageSource === "camera"
    ? t("dailyCare.readingImage")
    : `📷 ${t("dailyCare.takePhoto")}`

                        }


                        <input

                            type="file"

                            accept=
                                "image/jpeg,image/png,image/webp"

                            capture=
                                "environment"

                            disabled={
                                processingImage ||
                                saving
                            }

                            onChange={
                                event =>
                                    handleMedicalImage(
                                        event,
                                        "camera"
                                    )
                            }

                            style={{
                                display:
                                    "none",
                            }}

                        />

                    </label>


                    <label
                        style={{
                            ...uploadButton,

                            opacity:

                                processingImage ||
                                saving

                                    ? 0.7

                                    : 1,

                            cursor:

                                processingImage ||
                                saving

                                    ? "not-allowed"

                                    : "pointer",
                        }}
                    >

                        {

activeImageSource === "gallery"
    ? t("dailyCare.readingImage")
    : `📷 ${t("medication.choosePhoto")}`


                        }


                        <input

                            type="file"


                            accept=
                                "image/jpeg,image/png,image/webp"

                            disabled={
                                processingImage ||
                                saving
                            }

                            onChange={
                                event =>
                                    handleMedicalImage(
                                        event,
                                        "gallery"
                                    )
                            }

                            style={{
                                display:
                                    "none",
                            }}

                        />

                    </label>

                </div>

            )}


            {processingImage && (

                <div style={processingBox}>

                    <p style={processingText}>

                        {t("dailyCare.readingHealthInformation")}

                    </p>

                </div>

            )}


            {error && (

                <div style={errorBox}>

                    <p style={messageText}>
                        {error}
                    </p>


                    {!processingImage &&
                        !imageReadSuccessful && (

                        <button
                            type="button"
                            onClick={
                                resetUploadSession
                            }
                            style={secondaryButton}
                        >
                            Try Again
                        </button>

                    )}

                </div>

            )}


            {successMessage && (

                <div style={successBox}>

                    {successMessage}

                </div>

            )}


            {imageReadSuccessful && (

                <div style={reviewSection}>


                    <div>

                        <h3 style={reviewTitle}>

                            {t("dailyCare.reviewHealthReading")}

                        </h3>


                        <p style={description}>

                            {t("dailyCare.reviewReadingDescription")}

                        </p>

                    </div>


                    <div style={fieldGrid}>


                        <div>

                            <label style={fieldLabel}>
                                {t("medication.temperature")}
                            </label>

                            <input

                                type="number"

                                step="0.1"

                                value={
                                    reading.temperature
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "temperature",
                                            event.target.value
                                        )
                                }

                                style={inputStyle}

                            />

                        </div>

<div>

    <label style={fieldLabel}>
        Weight
    </label>

    <input
        type="number"
        step="0.1"
        value={reading.weightKg}
        onChange={event =>
            updateField(
                "weightKg",
                event.target.value
            )
        }
        style={inputStyle}
    />

</div>


                        <div>

                            <label style={fieldLabel}>
                                {t("dailyCare.unit")}
                            </label>

                            <select

                                value={
                                    reading.temperatureUnit
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "temperatureUnit",
                                            event.target.value as TemperatureUnit
                                        )
                                }

                                style={inputStyle}

                            >

                                <option value="F">
                                    °F
                                </option>

                                <option value="C">
                                    °C
                                </option>

                            </select>

                        </div>


                        <div>

                            <label style={fieldLabel}>
                                Systolic
                            </label>

                            <input

                                type="number"

                                value={
                                    reading.systolic
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "systolic",
                                            event.target.value
                                        )
                                }

                                style={inputStyle}

                            />

                        </div>


                        <div>

                            <label style={fieldLabel}>
                                {t("dailyCare.diastolic")}
                            </label>

                            <input

                                type="number"

                                value={
                                    reading.diastolic
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "diastolic",
                                            event.target.value
                                        )
                                }

                                style={inputStyle}

                            />

                        </div>


                        <div>

                            <label style={fieldLabel}>
                                {t("medication.pulse")}
                            </label>

                            <input

                                type="number"

                                value={
                                    reading.pulse
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "pulse",
                                            event.target.value
                                        )
                                }

                                style={inputStyle}

                            />

                        </div>


                        <div>

                            <label style={fieldLabel}>
                                {t("medication.spo2")}
                            </label>

                            <input

                                type="number"

                                value={
                                    reading.spo2
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "spo2",
                                            event.target.value
                                        )
                                }

                                style={inputStyle}

                            />

                        </div>

                    </div>


<div style={actionRow}>

    <button
        type="button"
        onClick={
            resetUploadSession
        }
        disabled={
            saving
        }
        style={cancelButton}
    >
        {t("common.cancel")}
    </button>


    <button
        type="button"
        onClick={
            resetUploadSession
        }
        disabled={
            saving
        }
        style={secondaryButton}
    >
        📷 {t("medication.useAnotherPhoto")}
    </button>


    <button
        type="button"
        onClick={
            saveReading
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
        }}
    >

        {
saving
    ? t("dailyCare.saving")
    : `💾 ${t("medication.saveHealthReading")}`
        }

    </button>

</div>

                </div>

            )}

        </section>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const workspace:
    React.CSSProperties = {

        marginTop:
            "20px",

};


const headerBlock:
    React.CSSProperties = {

        marginBottom:
            "20px",

};


const title:
    React.CSSProperties = {

        margin:
            "0 0 8px 0",

        fontSize:
            "22px",

        color:
            "#111827",

};


const reviewTitle:
    React.CSSProperties = {

        margin:
            "0 0 8px 0",

        fontSize:
            "20px",

        color:
            "#111827",

};


const description:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#6b7280",

        lineHeight:
            1.5,

};


const uploadGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap:
            "12px",

};


const uploadButton:
    React.CSSProperties = {

        padding:
            "16px",

        textAlign:
            "center",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            600,

        color:
            "#1d4ed8",

};


const processingBox:
    React.CSSProperties = {

        marginTop:
            "16px",

        padding:
            "18px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

};


const processingText:
    React.CSSProperties = {

        margin:
            0,

        textAlign:
            "center",

        fontWeight:
            600,

        color:
            "#2563eb",

};


const reviewSection:
    React.CSSProperties = {

        display:
            "grid",

        gap:
            "20px",

};


const fieldGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",

        gap:
            "16px",

};


const fieldLabel:
    React.CSSProperties = {

        display:
            "block",

        marginBottom:
            "8px",

        fontWeight:
            600,

        color:
            "#374151",

};


const inputStyle:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "12px",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "8px",

        fontSize:
            "16px",

        boxSizing:
            "border-box",

        background:
            "#ffffff",

};


const actionRow:
    React.CSSProperties = {

        display:
            "flex",

        flexWrap:
            "wrap",

        gap:
            "12px",

};


const primaryButton:
    React.CSSProperties = {

        flex:
            1,

        minWidth:
            "220px",

        padding:
            "14px 18px",

        border:
            "none",

        borderRadius:
            "10px",

        background:
            "#2563eb",

        color:
            "#ffffff",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

};

const cancelButton:
    React.CSSProperties = {

        flex:
            1,

        minWidth:
            "140px",

        padding:
            "14px 18px",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        background:
            "#ffffff",

        color:
            "#6b7280",

        fontSize:
            "16px",

        fontWeight:
            600,

        cursor:
            "pointer",

    };


const secondaryButton:
    React.CSSProperties = {

        flex:
            1,

        minWidth:
            "180px",

        padding:
            "14px 18px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "10px",

        background:
            "#ffffff",

        color:
            "#374151",

        fontSize:
            "16px",

        fontWeight:
            600,

        cursor:
            "pointer",

};


const errorBox:
    React.CSSProperties = {

        marginTop:
            "16px",

        padding:
            "14px",

        border:
            "1px solid #fecaca",

        borderRadius:
            "10px",

        background:
            "#fef2f2",

        color:
            "#991b1b",

};


const successBox:
    React.CSSProperties = {

        marginTop:
            "16px",

        padding:
            "14px",

        border:
            "1px solid #bbf7d0",

        borderRadius:
            "10px",

        background:
            "#f0fdf4",

        color:
            "#166534",

        fontWeight:
            600,

};


const messageText:
    React.CSSProperties = {

        margin:
            "0 0 12px 0",

};
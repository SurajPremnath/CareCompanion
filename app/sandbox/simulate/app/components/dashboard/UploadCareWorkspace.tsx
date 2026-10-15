"use client";

import {
    useState,
} from "react";

import {
    medicalImageService,
} from "@/lib/medical-image/medicalImageService";

import {
    supabase,
} from "@/lib/supabase";

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

import SymptomsCard
    from "@/app/daily-care/components/SymptomsCard";

import type {
    DailyCareSymptom,
    PainLocation,
} from "@/lib/types/dailyCare";

import PainLocationCard
    from "@/app/daily-care/components/PainLocationCard";


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

    date:
        string;

    time:
        string;

    temperature:
        string;

    temperatureUnit:
        TemperatureUnit;

    weightKg:
        string;

    systolic:
        string;

    diastolic:
        string;

    pulse:
        string;

    spo2:
        string;

    symptoms:
        DailyCareSymptom[];

    otherSymptom:
        string;

    painLocations:
        PainLocation[];

    otherPainLocation:
        string;

}


function createEmptyReading():
    UploadReadingState {

    const now =
        new Date();

    const date =
        now.toISOString()
            .split("T")[0];

    const time =
        now.toTimeString()
            .slice(0, 5);

    return {

        date,

        time,

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

        symptoms:
            [],

        otherSymptom:
            "",

        painLocations:
            [],

        otherPainLocation:
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
    temperatureOptions,
    setTemperatureOptions,
] =
    useState<number[]>([]);

const [
    weightOptions,
    setWeightOptions,
] =
    useState<number[]>([]);

const [
    systolicOptions,
    setSystolicOptions,
] =
    useState<number[]>([]);

const [
    diastolicOptions,
    setDiastolicOptions,
] =
    useState<number[]>([]);

const [
    pulseOptions,
    setPulseOptions,
] =
    useState<number[]>([]);

const [
    spo2Options,
    setSpo2Options,
] =
    useState<number[]>([]);

const [
    showSymptoms,
    setShowSymptoms,
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
// Toggle Symptom
//--------------------------------------------------------

function toggleSymptom(
    symptom:
        DailyCareSymptom
) {

    const exists =
        reading.symptoms.includes(
            symptom
        );

    if (exists) {

        const updatedSymptoms =
            reading.symptoms.filter(
                item =>
                    item !== symptom
            );

        setReading(previous => ({

            ...previous,

            symptoms:
                updatedSymptoms,

            painLocations:
                symptom === "BODY_PAIN"
                    ? []
                    : previous.painLocations,

            otherPainLocation:
                symptom === "BODY_PAIN"
                    ? ""
                    : previous.otherPainLocation,

            otherSymptom:
                symptom === "OTHER"
                    ? ""
                    : previous.otherSymptom,

        }));

        return;
    }

    updateField(
        "symptoms",
        [
            ...reading.symptoms,
            symptom,
        ]
    );
}

//--------------------------------------------------------
// Toggle Pain Location
//--------------------------------------------------------

function togglePainLocation(
    location:
        PainLocation
) {

    const exists =
        reading.painLocations.includes(
            location
        );

    if (exists) {

        const updatedLocations =
            reading.painLocations.filter(
                item =>
                    item !== location
            );

        setReading(previous => ({

            ...previous,

            painLocations:
                updatedLocations,

            otherPainLocation:
                location === "OTHER"
                    ? ""
                    : previous.otherPainLocation,

        }));

        return;
    }

    updateField(
        "painLocations",
        [
            ...reading.painLocations,
            location,
        ]
    );
}

    //--------------------------------------------------------
    // Reset
    //--------------------------------------------------------

function resetUploadSession() {

    setReading(
        createEmptyReading()
    );

    setPulseOptions([]);

    setSpo2Options([]);

    setShowSymptoms(
        false
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

async function handleMedicalImages(

    event:
        React.ChangeEvent<HTMLInputElement>,

    source:
        ImageSource

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

//--------------------------------------------------------
// New Upload - Clear Previous Multiple Reading Options
//--------------------------------------------------------

setPulseOptions([]);

setSpo2Options([]);

setActiveImageSource(
    source
);

setProcessingImage(
    true
);

    try {

let readings;

let temperatureValues: number[] = [];

let weightValues: number[] = [];

let systolicValues: number[] = [];

let diastolicValues: number[] = [];

let pulseValues: number[] = [];

let spo2Values: number[] = [];

if (files.length > 1) {

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Keep the existing multi-image processing path.
    // --------------------------------------------------------

const result =
    await medicalImageService
        .processImages(
            files
        );

if (
    !result.success ||
    !result.data
) {

    setError(
        result.error ??
        t(
            "dailyCare.unableToReadImage"
        )
    );

    return;
}

readings =
    result.data;

temperatureValues =
    result.data.temperatureValues ?? [];

weightValues =
    result.data.weightValues ?? [];

systolicValues =
    result.data.systolicValues ?? [];

diastolicValues =
    result.data.diastolicValues ?? [];

pulseValues =
    result.data.pulseValues ?? [];

spo2Values =
    result.data.spo2Values ?? [];

setTemperatureOptions(
    temperatureValues
);

setWeightOptions(
    weightValues
);

setSystolicOptions(
    systolicValues
);

setDiastolicOptions(
    diastolicValues
);

setPulseOptions(pulseValues);
setSpo2Options(spo2Values);


} else {

    // --------------------------------------------------------
    // Existing single-image flow.
    // Do not change existing behaviour.
    // --------------------------------------------------------

    const result =
        await medicalImageService
            .processImages(
                files
            );

    if (
        !result.success ||
        !result.data
    ) {

        setError(
            result.error ??
            t(
                "dailyCare.unableToReadImage"
            )
        );

        return;
    }

    readings =
        result.data;

setTemperatureOptions([]);

setWeightOptions([]);

setSystolicOptions([]);

setDiastolicOptions([]);

    setPulseOptions([]);

    setSpo2Options([]);
}

const hasReading =

    readings.temperature !==
        null ||

    readings.weightKg !==
        null ||

    readings.systolic !==
        null ||

    readings.diastolic !==
        null ||

    readings.pulse !==
        null ||

    readings.spo2 !==
        null ||

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Use the values returned by this upload immediately.
    // --------------------------------------------------------
    pulseValues.length > 0 ||

    spo2Values.length > 0;

        if (!hasReading) {

            setError(
                t(
                    "dailyCare.noReadingDetected"
                )
            );

            return;

        }

        setReading(
            previous => ({

                ...previous,

temperature:
    temperatureValues.length > 1
        ? ""
        : readings.temperature !==
            null
            ? String(
                readings.temperature
            )
            : previous.temperature,

                temperatureUnit:
                    readings.temperatureUnit ??
                    previous.temperatureUnit,

weightKg:
    weightValues.length > 1
        ? ""
        : readings.weightKg !==
            null
            ? String(
                readings.weightKg
            )
            : previous.weightKg,

systolic:
    systolicValues.length > 1
        ? ""
        : readings.systolic !==
            null
            ? String(
                readings.systolic
            )
            : previous.systolic,

diastolic:
    diastolicValues.length > 1
        ? ""
        : readings.diastolic !==
            null
            ? String(
                readings.diastolic
            )
            : previous.diastolic,

// --------------------------------------------------------
// Record Health - Pulse
// If multiple Pulse readings were detected, wait for the
// user to choose one instead of using the singular value.
// --------------------------------------------------------
pulse:
    pulseValues.length > 1
        ? ""
        : readings.pulse !==
            null
            ? String(
                readings.pulse
            )
            : previous.pulse,

// --------------------------------------------------------
// Record Health - SpO₂
// If multiple SpO₂ readings were detected, wait for the
// user to choose one instead of using the singular value.
// --------------------------------------------------------
spo2:
    spo2Values.length > 1
        ? ""
        : readings.spo2 !==
            null
            ? String(
                readings.spo2
            )
            : previous.spo2,

            })
        );

        setImageReadSuccessful(
            true
        );

    }
    catch (
        processingError
    ) {

        console.error(
            "Upload Care Image Processing Error:",
            processingError
        );

        setError(
            processingError instanceof Error
                ? processingError.message
                : t(
                    "dailyCare.unableToProcessImage"
                )
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

    //--------------------------------------------------------
    // Validate Current Session Before Save
    //--------------------------------------------------------

    let {
        data: {
            session,
        },
        error: sessionError,
    } =
        await supabase.auth.getSession();


    //--------------------------------------------------------
    // Refresh Session If Required
    //--------------------------------------------------------

    if (
        sessionError ||
        !session?.access_token
    ) {

        const {
            data: {
                session: refreshedSession,
            },
            error: refreshError,
        } =
            await supabase.auth.refreshSession();

        if (
            refreshError ||
            !refreshedSession?.access_token
        ) {

            setError(
                "Your session has expired. Please sign in again."
            );

            return;
        }

        session =
            refreshedSession;
    }


    const commonReading = {

    recordedAt:
        `${reading.date}T${reading.time}:00`,

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
                    reading.symptoms,

                otherSymptom:
                    reading.otherSymptom.trim()
                        ? reading.otherSymptom.trim()
                        : null,

painLocations:
    reading.painLocations,

otherPainLocation:
    reading.otherPainLocation.trim()
        ? reading.otherPainLocation.trim()
        : null,

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

<h3
    className="upload-care-title"
    style={title}
>
    📷 {t("dailyCare.uploadHealthReading")}
</h3>

<p
    className="upload-care-description"
    style={description}
>
    {t("dailyCare.uploadReadingDescription")}
</p>

    </div>

)}

            {!imageReadSuccessful && (

                <div
    className="upload-care-grid"
    style={uploadGrid}
>


                    <label
                    className="upload-care-button"
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

    multiple

    disabled={
        processingImage ||
        saving
    }

    onChange={
        event =>
            handleMedicalImages(
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
                    className="upload-care-button"
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

    multiple

    disabled={
        processingImage ||
        saving
    }

    onChange={
        event =>
            handleMedicalImages(
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

<h3
    className="upload-review-title"
    style={reviewTitle}
>
    {t("dailyCare.reviewHealthReading")}
</h3>


<p
    className="upload-review-description"
    style={description}
>
    {t("dailyCare.reviewReadingDescription")}
</p>

                    </div>

<div
    className="upload-review-date-time"
    style={{
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "20px",
    }}
>    <div>

        <label
            style={fieldLabel}
        >
            Date
        </label>

        <input
className="upload-review-input"
            type="date"

            value={
                reading.date
            }

            disabled={
                saving
            }

            onChange={
                event =>
                    updateField(
                        "date",
                        event.target.value
                    )
            }

            style={
                inputStyle
            }
        />

    </div>

    <div>

        <label
            style={fieldLabel}
        >
            Time
        </label>

        <input
className="upload-review-input"
            type="time"

            value={
                reading.time
            }

            disabled={
                saving
            }

            onChange={
                event =>
                    updateField(
                        "time",
                        event.target.value
                    )
            }

            style={
                inputStyle
            }
        />

    </div>

</div>


                    <div
    className="upload-review-fields"
    style={fieldGrid}
>


                        <div>

                            <label style={fieldLabel}>
                                {t("medication.temperature")}
                            </label>

{temperatureOptions.length > 1 && (
    <div style={multipleReadingBox}>

        <p style={multipleReadingMessage}>
            Multiple Temperature readings found. Select one or use the average.
        </p>

        <div style={readingOptionRow}>

            {temperatureOptions.map(
                (value, index) => (

                    <button
                        key={`temperature-${value}-${index}`}
                        type="button"
                        onClick={() => {

                            updateField(
                                "temperature",
                                String(value)
                            );

                            setTemperatureOptions([]);

                        }}
                        style={readingOptionButton}
                    >
                        {value}°
                        {reading.temperatureUnit}
                    </button>

                )
            )}

            <button
                type="button"
                onClick={() => {

                    const average =
                        temperatureOptions.reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        ) /
                        temperatureOptions.length;

                    updateField(
                        "temperature",
                        average.toFixed(1)
                    );

                    setTemperatureOptions([]);

                }}
                style={readingOptionButton}
            >
                Average{" "}
                {(
                    temperatureOptions.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    temperatureOptions.length
                ).toFixed(1)}
                °
                {reading.temperatureUnit}
            </button>

        </div>

    </div>
)}

<input
    className="upload-review-input"
    type="number"
    step="0.1"
    value={reading.temperature}
    onChange={event =>
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

{weightOptions.length > 1 && (
    <div style={multipleReadingBox}>

        <p style={multipleReadingMessage}>
            Multiple Weight readings found. Select one or use the average.
        </p>

        <div style={readingOptionRow}>

            {weightOptions.map(
                (value, index) => (

                    <button
                        key={`weight-${value}-${index}`}
                        type="button"
                        onClick={() => {

                            updateField(
                                "weightKg",
                                String(value)
                            );

                            setWeightOptions([]);

                        }}
                        style={readingOptionButton}
                    >
                        {value} kg
                    </button>

                )
            )}

            <button
                type="button"
                onClick={() => {

                    const average =
                        weightOptions.reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        ) /
                        weightOptions.length;

                    updateField(
                        "weightKg",
                        average.toFixed(1)
                    );

                    setWeightOptions([]);

                }}
                style={readingOptionButton}
            >
                Average{" "}
                {(
                    weightOptions.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    weightOptions.length
                ).toFixed(1)} kg
            </button>

        </div>

    </div>
)}

<input
    className="upload-review-input"
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
className="upload-review-input"
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

{systolicOptions.length > 1 && (
    <div style={multipleReadingBox}>

        <p style={multipleReadingMessage}>
            Multiple Systolic readings found. Select one or use the average.
        </p>

        <div style={readingOptionRow}>

            {systolicOptions.map(
                (value, index) => (

                    <button
                        key={`systolic-${value}-${index}`}
                        type="button"
                        onClick={() => {

                            updateField(
                                "systolic",
                                String(value)
                            );

                            setSystolicOptions([]);

                        }}
                        style={readingOptionButton}
                    >
                        {value}
                    </button>

                )
            )}

<button
    type="button"
    onClick={() => {

        const average =
            systolicOptions.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) /
            systolicOptions.length;

updateField(
    "systolic",
    average.toFixed(1)
);

        setSystolicOptions([]);

    }}
    style={readingOptionButton}
>
    Average{" "}
    {(
        systolicOptions.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        systolicOptions.length
    ).toFixed(1)}
</button>

        </div>

    </div>
)}

<input
    className="upload-review-input"
    type="number"
    value={reading.systolic}
    onChange={event =>
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

{diastolicOptions.length > 1 && (
    <div style={multipleReadingBox}>

        <p style={multipleReadingMessage}>
            Multiple Diastolic readings found. Select one or use the average.
        </p>

        <div style={readingOptionRow}>

            {diastolicOptions.map(
                (value, index) => (

                    <button
                        key={`diastolic-${value}-${index}`}
                        type="button"
                        onClick={() => {

                            updateField(
                                "diastolic",
                                String(value)
                            );

                            setDiastolicOptions([]);

                        }}
                        style={readingOptionButton}
                    >
                        {value}
                    </button>

                )
            )}

            <button
                type="button"
                onClick={() => {

                    const average =
                        diastolicOptions.reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        ) /
                        diastolicOptions.length;

                    updateField(
                        "diastolic",
                        average.toFixed(1)
                    );

                    setDiastolicOptions([]);

                }}
                style={readingOptionButton}
            >
                Average{" "}
                {(
                    diastolicOptions.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    diastolicOptions.length
                ).toFixed(1)}
            </button>

        </div>

    </div>
)}

<input
    className="upload-review-input"
    type="number"
    value={reading.diastolic}
    onChange={event =>
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

    {pulseOptions.length > 1 && (
        <div style={multipleReadingBox}>

            <p style={multipleReadingMessage}>
                Multiple Pulse readings found. Select one or use the average.
            </p>

            <div style={readingOptionRow}>

                {pulseOptions.map(
                    (value, index) => (
                        <button
                            key={`pulse-${value}-${index}`}
                            type="button"
                            onClick={() => {
                                updateField(
                                    "pulse",
                                    String(value)
                                );

                                setPulseOptions([]);
                            }}
                            style={readingOptionButton}
                        >
                            {value} 
                        </button>
                    )
                )}

<button
    type="button"
    onClick={() => {

        const average =
            pulseOptions.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) /
            pulseOptions.length;

        updateField(
            "pulse",
            average.toFixed(1)
        );

        setPulseOptions([]);
    }}
    style={readingOptionButton}
>
    Avg{" "}
    {(
        pulseOptions.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        pulseOptions.length
    ).toFixed(1)}{" "}
</button>

            </div>

        </div>
    )}

    <input
        className="upload-review-input"
        type="number"
        value={reading.pulse}
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

    {spo2Options.length > 1 && (
        <div style={multipleReadingBox}>

            <p style={multipleReadingMessage}>
                It has been noticed that SpO₂ is coming
                from multiple sources. Which one is correct?
            </p>

            <div style={readingOptionRow}>

                {spo2Options.map(
                    (value, index) => (
                        <button
                            key={`spo2-${value}-${index}`}
                            type="button"
                            onClick={() => {
                                updateField(
                                    "spo2",
                                    String(value)
                                );

                                setSpo2Options([]);
                            }}
                            style={readingOptionButton}
                        >
                            {value}%
                        </button>
                    )
                )}

<button
    type="button"
    onClick={() => {

        const average =
            spo2Options.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) /
            spo2Options.length;

        updateField(
            "spo2",
            average.toFixed(1)
        );

        setSpo2Options([]);
    }}
    style={readingOptionButton}
>
    Average{" "}
    {(
        spo2Options.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        spo2Options.length
    ).toFixed(1)}%
</button>

            </div>

        </div>
    )}

    <input
        className="upload-review-input"
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


{/*------------------------------------------------
  Symptoms
------------------------------------------------*/}

<SymptomsCard
    expanded={
        showSymptoms
    }
    disabled={
        saving
    }
    symptoms={
        reading.symptoms
    }
    otherSymptom={
        reading.otherSymptom
    }
    onToggle={
        () =>
            setShowSymptoms(
                previous =>
                    !previous
            )
    }
    onSymptomToggle={
        toggleSymptom
    }
    onOtherSymptomChange={
        value =>
            updateField(
                "otherSymptom",
                value
            )
    }
/>


{/*------------------------------------------------
  Pain Location
------------------------------------------------*/}

{
    reading.symptoms.includes(
        "BODY_PAIN"
    ) && (

        <PainLocationCard
            painLocations={
                reading.painLocations
            }
            otherPainLocation={
                reading.otherPainLocation
            }
            disabled={
                saving
            }
            onPainLocationToggle={
                togglePainLocation
            }
            onOtherPainLocationChange={
                value =>
                    updateField(
                        "otherPainLocation",
                        value
                    )
            }
        />

    )
}


<div
    className="upload-review-actions"
    style={actionRow}
>

    <button
        type="button"
        className="upload-review-cancel"
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
        className="upload-review-another"
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
        className="upload-review-save"
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

<style jsx>{`
    @media (max-width: 640px) {

        /* ---------------------------------
           Initial Upload Reading screen
        --------------------------------- */

        .upload-care-title {
            font-size: 17px !important;
            margin-bottom: 5px !important;
            line-height: 1.2;
        }

        .upload-care-description {
            font-size: 12px;
            line-height: 1.35;
        }

        .upload-care-grid {
            gap: 8px !important;
        }

        .upload-care-button {
            padding: 11px 8px !important;
            font-size: 13px !important;
            border-radius: 9px !important;
        }


        /* ---------------------------------
           Review heading
        --------------------------------- */

        .upload-review-title {
            font-size: 15px !important;
            line-height: 1.2;
        }

        .upload-review-description {
            font-size: 12px;
            line-height: 1.35;
        }


        /* ---------------------------------
           Date + Time
        --------------------------------- */

.upload-review-date-time label,
.upload-review-fields label {
    font-size: 13px !important;
    margin-bottom: 5px !important;
    line-height: 1.2 !important;
}

.upload-review-date-time {
    display: grid !important;
    grid-template-columns:
        minmax(0, 1fr) minmax(0, 1fr) !important;

    gap: 12px !important;

    margin-bottom:
        10px !important;

    width: 100% !important;
}

.upload-review-date-time > div {
    min-width: 0 !important;
    width: 95% !important;
}

.upload-review-date-time .upload-review-input {
    display: flex !important;

    width: calc(100% - 6px) !important;
    max-width: 100% !important;

    height: 42px !important;

    box-sizing: border-box !important;

    padding: 0 10px !important;

    font-size: 14px !important;

    line-height: 42px !important;

    vertical-align: middle !important;
}

        /* ---------------------------------
           Health readings
        --------------------------------- */

        .upload-review-fields {
            grid-template-columns:
                1fr 1fr !important;

            gap: 10px !important;
        }

.upload-review-input {
    width: 100% !important;
    height: 42px !important;
    box-sizing: border-box !important;
    padding: 9px 10px !important;
    font-size: 15px !important;
    line-height: 1.2;
}


        /* ---------------------------------
           Review actions
        --------------------------------- */

        .upload-review-actions {
            display: grid !important;

            grid-template-columns:
                1fr 1.4fr !important;

            gap: 8px !important;

            margin-top:
                4px !important;
        }

        .upload-review-cancel {
            min-width: 0 !important;

            padding:
                10px 8px !important;

            font-size:
                12px !important;

            border-radius:
                9px !important;
        }

        .upload-review-another {
            min-width: 0 !important;

            padding:
                10px 8px !important;

            font-size:
                12px !important;

            border-radius:
                9px !important;
        }

        .upload-review-save {
            grid-column:
                1 / -1;

            min-width:
                0 !important;

            padding:
                10px 10px !important;

            font-size:
                13px !important;

            border-radius:
                9px !important;
        }
    }



.upload-review-fields {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
    gap: 12px !important;
}

.upload-review-fields {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
    gap: 10px !important;
}

.upload-review-input {
    width: 100% !important;
    height: 40px !important;
    box-sizing: border-box !important;
    padding: 8px 9px !important;
    font-size: 14px !important;
    line-height: 1.2;
}

        .upload-review-actions {
            gap:
                7px !important;
        }

        .upload-review-cancel,
        .upload-review-another {
            padding:
                9px 6px !important;

            font-size:
                11.5px !important;
        }

        .upload-review-save {
            padding:
                9px 8px !important;

            font-size:
                12px !important;
        }
    }
`}</style>

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


const multipleReadingBox:
    React.CSSProperties = {

    marginBottom:
        "8px",

    padding:
        "10px",

    border:
        "1px solid #f59e0b",

    borderRadius:
        "8px",

    background:
        "#fffbeb",

};


const multipleReadingMessage:
    React.CSSProperties = {

    margin:
        "0 0 8px 0",

    fontSize:
        "13px",

    lineHeight:
        1.4,

    fontWeight:
        600,

    color:
        "#92400e",

};


const readingOptionRow:
    React.CSSProperties = {

    display:
        "flex",

    flexWrap:
        "wrap",

    gap:
        "7px",

};


const readingOptionButton:
    React.CSSProperties = {

    padding:
        "8px 10px",

    border:
        "1px solid #cbd5e1",

    borderRadius:
        "8px",

    background:
        "#ffffff",

    color:
        "#374151",

    fontSize:
        "13px",

    fontWeight:
        600,

    cursor:
        "pointer",

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
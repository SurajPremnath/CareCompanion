"use client";

import {
    useState,
} from "react";

import type {
    DailyCareSymptom,
    PainLocation,
} from "@/lib/types/dailyCare";

import VitalsCard
    from "@/app/daily-care/components/VitalsCard";

import SymptomsCard
    from "@/app/daily-care/components/SymptomsCard";

import PainLocationCard
    from "@/app/daily-care/components/PainLocationCard";

import {
    dailyCareStorage,
} from "@/lib/storage/DailyCareStorage";

import {
    selfDailyCareStorage,
} from "@/lib/storage/SelfDailyCareStorage";

import {
    AppAlert,
} from "@/lib/utils/appAlert";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

//------------------------------------------------------------
// Types
//------------------------------------------------------------

type TemperatureUnit =
    | "F"
    | "C";


interface ManualCareFormState {

    date:
        string;

    time:
        string;

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

    symptoms:
        DailyCareSymptom[];

    otherSymptom:
        string;

    painLocations:
        PainLocation[];

    otherPainLocation:
        string;

}


interface ManualCareWorkspaceProps {

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


//------------------------------------------------------------
// Date / Time Helpers
//------------------------------------------------------------

function getCurrentDate():
    string {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


function getCurrentTime():
    string {

    const now =
        new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );

    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );

    return `${hours}:${minutes}`;

}


//------------------------------------------------------------
// Initial State
//------------------------------------------------------------

function createInitialForm():
    ManualCareFormState {

    return {

        date:
            getCurrentDate(),

        time:
            getCurrentTime(),

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


//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function ManualCareWorkspace({

    mode,

    patientId,

    patientName,

    currentUserName,

}: ManualCareWorkspaceProps) {

const {
    t,
} = useLanguage();

    //--------------------------------------------------------
    // State
    //--------------------------------------------------------

    const [
        formData,
        setFormData,
    ] =
        useState<ManualCareFormState>(
            createInitialForm()
        );


    const [
        saving,
        setSaving,
    ] =
        useState(false);


    const [
        showVitals,
        setShowVitals,
    ] =
        useState(false);


    const [
        showSymptoms,
        setShowSymptoms,
    ] =
        useState(false);


    const recordingName =

        mode === "self"

            ? currentUserName

            : patientName ?? "your family member";


    //--------------------------------------------------------
    // Field Update
    //--------------------------------------------------------

    function updateField<
        K extends keyof ManualCareFormState
    >(
        field: K,
        value: ManualCareFormState[K]
    ) {

        setFormData(previous => ({

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
            formData.symptoms.includes(
                symptom
            );


        if (exists) {

            const updatedSymptoms =

                formData.symptoms.filter(
                    item =>
                        item !== symptom
                );


            setFormData(previous => ({

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
                ...formData.symptoms,
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

            formData.painLocations.includes(
                location
            );


        if (exists) {

            const updatedLocations =

                formData.painLocations.filter(
                    item =>
                        item !== location
                );


            setFormData(previous => ({

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
                ...formData.painLocations,
                location,
            ]

        );

    }


    //--------------------------------------------------------
    // Validation
    //--------------------------------------------------------

    function validateForm():
        boolean {


        if (
            mode === "family" &&
            !patientId
        ) {

            AppAlert.warning(
                t("medication.pleaseSelectFamilyMember")
            );

            return false;

        }


        const hasTemperature =

            formData.temperature.trim() !== "";


const hasWeight =
    formData.weightKg.trim() !== "";

        const hasVitals =

            formData.systolic.trim() !== "" ||

            formData.diastolic.trim() !== "" ||

            formData.pulse.trim() !== "" ||

            formData.spo2.trim() !== "";


        const hasSymptoms =

            formData.symptoms.length > 0;


        const hasPainLocations =

            formData.painLocations.length > 0;


        if (
            !hasTemperature &&
            !hasWeight &&
            !hasVitals &&
            !hasSymptoms &&
            !hasPainLocations
        ) {

            AppAlert.warning(
t("medication.pleaseRecordatleastOneObservation")
            );

            return false;

        }


        if (hasTemperature) {

            const temperature =

                Number(
                    formData.temperature
                );


            if (
                Number.isNaN(
                    temperature
                )
            ) {

                AppAlert.warning(
                    t("dailyCare.invalidTemperature")
                );

                return false;

            }

        }


        if (
            formData.systolic &&
            Number.isNaN(
                Number(
                    formData.systolic
                )
            )
        ) {

            AppAlert.warning(
                t("dailyCare.invalidBloodPressure")
            );

            return false;

        }


        if (
            formData.diastolic &&
            Number.isNaN(
                Number(
                    formData.diastolic
                )
            )
        ) {

            AppAlert.warning(
                t("dailyCare.invalidBloodPressure")
            );

            return false;

        }


        if (
            formData.pulse &&
            Number.isNaN(
                Number(
                    formData.pulse
                )
            )
        ) {

            AppAlert.warning(
                t("dailyCare.invalidPulse")
            );

            return false;

        }


        if (
            formData.spo2 &&
            Number.isNaN(
                Number(
                    formData.spo2
                )
            )
        ) {

            AppAlert.warning(
                t("dailyCare.invalidSpo2")
            );

            return false;

        }


        if (
            formData.symptoms.includes(
                "OTHER"
            ) &&
            !formData.otherSymptom.trim()
        ) {

            AppAlert.warning(
                t("dailyCare.specifyOtherSymptom")
            );

            return false;

        }


        if (
            formData.painLocations.includes(
                "OTHER"
            ) &&
            !formData.otherPainLocation.trim()
        ) {

            AppAlert.warning(
                t("dailyCare.specifyPainLocation")
            );

            return false;

        }


        return true;

    }


    //--------------------------------------------------------
    // Reset
    //--------------------------------------------------------

    function resetForm() {

        const currentUnit =
            formData.temperatureUnit;


        setFormData({

            ...createInitialForm(),

            temperatureUnit:
                currentUnit,

        });


        setShowVitals(
            false
        );


        setShowSymptoms(
            false
        );

    }


    //--------------------------------------------------------
    // Save
    //--------------------------------------------------------

    async function handleSave() {

        if (saving) {

            return;

        }


        if (!validateForm()) {

            return;

        }


        setSaving(
            true
        );


        try {

            const commonReading = {

                recordedAt:

                    `${formData.date}T${formData.time}:00`,

                overallStatus:
                    null,

                temperature:

                    formData.temperature.trim()

                        ? Number(
                            formData.temperature
                        )

                        : null,

                temperatureUnit:
                    formData.temperatureUnit,

weightKg:
    formData.weightKg.trim()
        ? Number(formData.weightKg)
        : null,

                systolic:

                    formData.systolic.trim()

                        ? Number(
                            formData.systolic
                        )

                        : null,

                diastolic:

                    formData.diastolic.trim()

                        ? Number(
                            formData.diastolic
                        )

                        : null,

                pulse:

                    formData.pulse.trim()

                        ? Number(
                            formData.pulse
                        )

                        : null,

                spo2:

                    formData.spo2.trim()

                        ? Number(
                            formData.spo2
                        )

                        : null,

                symptoms:
                    formData.symptoms,

                otherSymptom:

                    formData.otherSymptom.trim()

                        ? formData.otherSymptom.trim()

                        : null,

                painLocations:
                    formData.painLocations,

                otherPainLocation:

                    formData.otherPainLocation.trim()

                        ? formData.otherPainLocation.trim()

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

                throw new Error(

                    result.error ??

                    t("dailyCare.unableToSaveHealthInformation")

                );

            }


            resetForm();


            AppAlert.success(
                t("dailyCare.healthInformationSaved")
            );

        }
        catch (error) {

            console.error(

                t("medication.manualCareSaveError"),

                error

            );


            AppAlert.error(

                error instanceof Error

                    ? error.message

                    : t("dailyCare.unableToSaveHealthInformation")

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


            <div style={headerBlock}>

                <h3 style={title}>

                    ✍️ {t("dailyCare.enterHealthInformation")}

                </h3>


                <p style={description}>

                     {t("dailyCare.recordHealthInformationFor")
        .replace("{name}", recordingName)}
<br />
    {t("dailyCare.enterRelevantInformation")}
</p>
            </div>


            {/*------------------------------------------------
              Date and Time
            ------------------------------------------------*/}

            <section style={cardStyle}>

                <h3 style={sectionTitle}>
                    🕒 {t("dailyCare.dateAndTime")}
                </h3>


                <div style={dateTimeGrid}>


                    <div>

                        <label style={labelStyle}>
                            {t("dailyCare.date")}
                        </label>

                        <input
                            type="date"
                            value={
                                formData.date
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
                            style={inputStyle}
                        />

                    </div>


                    <div>

                        <label style={labelStyle}>
                            {t("dailyCare.time")}
                        </label>

                        <input
                            type="time"
                            value={
                                formData.time
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
                            style={inputStyle}
                        />

                    </div>


                </div>

            </section>


            {/*------------------------------------------------
              Temperature
            ------------------------------------------------*/}

            <section style={cardStyle}>

                <h3 style={sectionTitle}>
                    🌡 {t("dailyCare.temperature")}
                </h3>


                <div style={temperatureGrid}>


                    <div>

                        <label style={labelStyle}>
                            {t("dailyCare.temperature")}
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            placeholder=
                                {t("dailyCare.enterTemperature")}
                            value={
                                formData.temperature
                            }
                            disabled={
                                saving
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

                        <label style={labelStyle}>
                            {t("dailyCare.unit")}
                        </label>

                        <select
                            value={
                                formData.temperatureUnit
                            }
                            disabled={
                                saving
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


                </div>

            </section>


{/*------------------------------------------------
  Weight
------------------------------------------------*/}

<section style={cardStyle}>

    <h3 style={sectionTitle}>
        ⚖ {t("medication.weight")}
    </h3>

    <div style={temperatureGrid}>

        <div>

            <label style={labelStyle}>
                {t("medication.weight")}
            </label>

            <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter weight"
                value={formData.weightKg}
                disabled={saving}
                onChange={(event) =>
                    updateField(
                        "weightKg",
                        event.target.value
                    )
                }
                style={inputStyle}
            />

        </div>

        <div>

            <label style={labelStyle}>
                {t("dailyCare.unit")}
            </label>

            <div
                style={{
                    ...inputStyle,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    minHeight: "52px",
                    fontWeight: 600,
                }}
            >
                kg
            </div>

        </div>

    </div>

</section>

            {/*------------------------------------------------
              Vitals
            ------------------------------------------------*/}

            <VitalsCard
                expanded={
                    showVitals
                }
                disabled={
                    saving
                }
                systolic={
                    formData.systolic
                }
                diastolic={
                    formData.diastolic
                }
                pulse={
                    formData.pulse
                }
                spo2={
                    formData.spo2
                }
                onToggle={
                    () =>
                        setShowVitals(
                            previous =>
                                !previous
                        )
                }
                onSystolicChange={
                    value =>
                        updateField(
                            "systolic",
                            value
                        )
                }
                onDiastolicChange={
                    value =>
                        updateField(
                            "diastolic",
                            value
                        )
                }
                onPulseChange={
                    value =>
                        updateField(
                            "pulse",
                            value
                        )
                }
                onSpo2Change={
                    value =>
                        updateField(
                            "spo2",
                            value
                        )
                }
            />


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
                    formData.symptoms
                }
                otherSymptom={
                    formData.otherSymptom
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
                formData.symptoms.includes(
                    "BODY_PAIN"
                ) && (

                    <PainLocationCard
                        painLocations={
                            formData.painLocations
                        }
                        otherPainLocation={
                            formData.otherPainLocation
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


            {/*------------------------------------------------
              Save
            ------------------------------------------------*/}

            <div
    className="manual-care-actions"
    style={actionRow}
>

                <button
                    type="button"
                    onClick={
                        resetForm
                    }
                    disabled={
                        saving
                    }
                    style={secondaryButton}
                >
                    {t("medication.clear")}
                </button>


                <button
                    type="button"
                    onClick={
                        handleSave
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

                            : t("dailyCare.saveHealthInformation")
                    }

                </button>

            </div>


<style jsx>{`
    @media (max-width: 640px) {

        .manual-care-actions {
            flex-direction: column-reverse !important;
        }

        .manual-care-actions button {
            width: 100% !important;
            min-width: 0 !important;
            flex: none !important;
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


const description:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#6b7280",

        lineHeight:
            1.5,

};


const cardStyle:
    React.CSSProperties = {

        background:
            "#ffffff",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "12px",

        padding:
            "24px",

        marginBottom:
            "24px",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",

    };


const sectionTitle:
    React.CSSProperties = {

        margin:
            "0 0 20px 0",

        fontSize:
            "22px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const labelStyle:
    React.CSSProperties = {

        display:
            "block",

        marginBottom:
            "8px",

        fontWeight:
            600,

        color:
            "#111827",

        fontSize:
            "15px",

    };


const inputStyle:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "14px",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        boxSizing:
            "border-box",

        background:
            "#ffffff",

        outline:
            "none",

    };


const dateTimeGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap:
            "16px",

    };


const temperatureGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "2fr 1fr",

        gap:
            "16px",

        alignItems:
            "end",

    };


const actionRow:
    React.CSSProperties = {

        display:
            "flex",

        flexWrap:
            "wrap",

        gap:
            "12px",

        marginTop:
            "24px",

    };


const primaryButton:
    React.CSSProperties = {

        flex:
            1,

        minWidth:
            "220px",

        padding:
            "16px",

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

        minWidth:
            "140px",

        padding:
            "16px",

        background:
            "#ffffff",

        color:
            "#374151",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            600,

        cursor:
            "pointer",

    };
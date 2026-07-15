"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import type {
    Patient,
} from "@/lib/types/patient";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

type PersonSelectorProps = {

    value: PersonSelection;

    onChange: (
        value: PersonSelection
    ) => void;

    question: string;

    disabled?: boolean;

};

export type PersonMode =
    | "SELF"
    | "FAMILY"
    | "";


export interface PersonSelection {

    mode:
        PersonMode;

    patientId:
        string | null;

    patientName:
        string | null;

}




//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function PersonSelector({

    value,

    onChange,

    question =
        "Who is this for?",

    disabled = false,

}: PersonSelectorProps) {


    const [
        patients,
        setPatients,
    ] =
        useState<Patient[]>([]);


    const [
        loadingPatients,
        setLoadingPatients,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );


    //--------------------------------------------------------
    // Load Patients Only For Family
    //--------------------------------------------------------

    useEffect(() => {

        if (
            value.mode !== "FAMILY"
        ) {

            return;

        }


        async function loadPatients() {

            setLoadingPatients(true);

            setError(null);


            try {

                const result =
                    await patientStorage
                        .getPatients();


                if (
                    !result.success
                ) {

                    setPatients([]);

                    setError(
                        result.error ??
                        "Unable to load family members."
                    );

                    return;

                }


                const patientList =
                    result.data ?? [];


                setPatients(
                    patientList
                );

            }
            catch (loadError) {

                console.error(
                    "Person Selector Patient Load Error:",
                    loadError
                );


                setPatients([]);

                setError(
                    "Unable to load family members."
                );

            }
            finally {

                setLoadingPatients(false);

            }

        }


        void loadPatients();

    }, [value.mode]);


    //--------------------------------------------------------
    // Render
    //--------------------------------------------------------

return (

    <div style={sectionWrapper}>

        <label style={label}>
            {question}
        </label>


        <div
    style={{

        ...container,

        opacity:
            disabled
                ? 0.55
                : 1,

        pointerEvents:
            disabled
                ? "none"
                : "auto",

    }}
>

            <div style={modeOptions}>

    <button
        type="button"
disabled={disabled}
        onClick={() => {
if (disabled) {

        return;

    }
onChange({

    mode:
        "SELF",

    patientId:
        null,

    patientName:
        null,

});

        }}
        style={{
            ...modeButton,

            ...(value.mode === "SELF"
                ? selectedModeButton
                : {}),
        }}
    >

        <span style={modeIcon}>
            👤
        </span>

        <span>
            Myself
        </span>

        {value.mode === "SELF" && (

            <span style={selectedCheck}>
            </span>

        )}

    </button>


    <button
        type="button"
disabled={disabled}
        onClick={() => {
if (disabled) {

        return;

    }
onChange({

    mode:
        "FAMILY",

    patientId:
        null,

    patientName:
        null,

});

        }}
        style={{
            ...modeButton,

            ...(value.mode === "FAMILY"
                ? selectedModeButton
                : {}),
        }}
    >

        <span style={modeIcon}>
            👨‍👩‍👧
        </span>

        <span>
            Family
        </span>

        {value.mode === "FAMILY" && (

            <span style={selectedCheck}>
            </span>

        )}

    </button>

</div>


            {value.mode ===
                "FAMILY" && (

                <div style={familySection}>

                    <label style={label}>
                        Select family member
                    </label>


                    {loadingPatients ? (

                        <p style={mutedText}>
                            Loading family members...
                        </p>

                    ) : error ? (

                        <p style={errorText}>
                            {error}
                        </p>

                    ) : patients.length === 0 ? (

                        <p style={mutedText}>
                            No family members found.
                        </p>

                    ) : (

                        <select
disabled={disabled}
                            value={
                                value.patientId ??
                                ""
                            }
                            onChange={(event) => {

const selectedPatient =
    patients.find(
        patient =>
            patient.id === event.target.value
    );

onChange({

    mode:
        "FAMILY",

    patientId:
        event.target.value || null,

    patientName:
        selectedPatient?.fullName ?? null,

});

                            }}
                            style={selectStyle}
                        >

                            <option value="">
                                Select patient
                            </option>


                            {
                                patients.map(
                                    patient => (

                                        <option
                                            key={
                                                patient.id
                                            }
                                            value={
                                                patient.id
                                            }
                                        >
                                            {
                                                patient.fullName
                                            }
                                        </option>

                                    )
                                )
                            }

                        </select>

                    )}

                </div>

            )}

        </div>

</div>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const sectionWrapper:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "12px",

        width:
            "100%",

    };

const container:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "12px",

        width:
            "100%",

        padding:
            "20px 24px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

        boxSizing:
            "border-box",

    };

const modeOptions:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

        gap:
            "12px",

        width:
            "100%",

    };


const modeButton:
    React.CSSProperties = {

        position:
            "relative",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "10px",

        minHeight:
            "56px",

        padding:
            "12px 16px",

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
            600,

        cursor:
            "pointer",

        boxSizing:
            "border-box",

    };


const selectedModeButton:
    React.CSSProperties = {

        background:
            "#eff6ff",

        border:
            "2px solid #2563eb",

    };


const modeIcon:
    React.CSSProperties = {

        fontSize:
            "20px",

        lineHeight:
            1,

    };


const selectedCheck:
    React.CSSProperties = {

        position:
            "absolute",

        right:
            "14px",

        fontSize:
            "16px",

        fontWeight:
            700,

        color:
            "#2563eb",

    };


const familySection:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "10px",

        marginTop:
            "4px",

    };


const label:
    React.CSSProperties = {

        fontSize:
            "16px",

        fontWeight:
            600,

        color:
            "#111827",

    };


const selectStyle:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "14px 16px",

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
            600,

        cursor:
            "pointer",

        boxSizing:
            "border-box",

    };


const mutedText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#6b7280",

        fontSize:
            "15px",

    };


const errorText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#b91c1c",

        fontSize:
            "15px",

        fontWeight:
            500,

    };
"use client";

import {
    useState,
} from "react";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

export type ActionOption =
    | "VOICE"
    | "MANUAL"
    | "ADD_PRESCRIPTION"
    | "CONSULTATION_MODE"
    | "DAILY_CARE"
    | "ASSESSMENT_HISTORY"
    | "CLINICAL_TRENDS"
    | "DETAILED_TIMELINE"
    | "";


export type MedicationDetailOption =
    | "TAKE_PHOTO"
    | "CHOOSE_PHOTOS"
    | "UPLOAD_PDF"
    | "IN_PERSON"
    | "VIDEO"
    | "PHONE"
    | "HOME_VISIT"
    | "OTHER"
    | "";

type SupportedAction =
    | "RECORD_HEALTH"
    | "MEDICATION_MANAGEMENT"
    | "ASSESSMENT"
    | "VIEW_HEALTH";


interface ActionOptionsProps {

    selectedAction:
        SupportedAction;

    onStartAssessment?:
        () => void;

    onOptionChange?:
        (option: ActionOption) => void;

    onMedicationDetailChange?:
        (
            detail:
                MedicationDetailOption
        ) => void;

}

//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function ActionOptions({

    selectedAction,

    onStartAssessment,

    onOptionChange,

    onMedicationDetailChange,

}: ActionOptionsProps) {

    const [
        selectedOption,
        setSelectedOption,
    ] =
        useState<ActionOption>(
            ""
        );


const [
    medicationDetailOption,
    setMedicationDetailOption,
] =
    useState<MedicationDetailOption>(
        ""
    );


const [
    otherConsultationMode,
    setOtherConsultationMode,
] =
    useState(
        ""
    );

    //--------------------------------------------------------
    // Assessment
    //--------------------------------------------------------

    if (
        selectedAction === "ASSESSMENT"
    ) {

        return (

            <div style={container}>

<button
    type="button"
    style={primaryButton}
    onClick={
        onStartAssessment
    }
>
    📋 Start Assessment
</button>

            </div>

        );

    }


    //--------------------------------------------------------
    // Other Actions
    //--------------------------------------------------------

    return (

        <div style={container}>

{selectedAction === "RECORD_HEALTH" && (

    <>

        <label style={label}>
            How would you like to record health?
        </label>

        <div style={optionGridTwo}>

            <button
                type="button"
                onClick={() => {

                    setSelectedOption(
                        "VOICE"
                    );

                    onOptionChange?.(
                        "VOICE"
                    );

                }}
                style={optionButton}
            >

                <span style={optionIcon}>
                    🎙️
                </span>

                <span style={optionLabel}>
                    Record with Voice
                </span>

            </button>


            <button
                type="button"
                onClick={() => {

                    setSelectedOption(
                        "MANUAL"
                    );

                    onOptionChange?.(
                        "MANUAL"
                    );

                }}
                style={optionButton}
            >

                <span style={optionIcon}>
                    ✍️
                </span>

                <span style={optionLabel}>
                    Enter Manually
                </span>

            </button>

        </div>

    </>

)}




                {
                    selectedAction ===
                        "MEDICATION_MANAGEMENT" && (

                        <>

                            <option value="ADD_PRESCRIPTION">
                                📄 Add Prescription
                            </option>

                            <option value="CONSULTATION_MODE">
                                🩺 Mode of Consultation
                            </option>

                        </>

                    )
                }


                {
                    selectedAction ===
                        "VIEW_HEALTH" && (

                        <>

                            <option value="DAILY_CARE">
                                📋 Daily Care
                            </option>

                            <option value="ASSESSMENT_HISTORY">
                                🩺 Assessments
                            </option>

                            <option value="CLINICAL_TRENDS">
                                📈 Clinical Trends
                            </option>

<option value="DETAILED_TIMELINE">
    🗓️ Detailed Timeline
</option>

                        </>

                    )
                }


{selectedAction === "MEDICATION_MANAGEMENT" &&
    selectedOption === "ADD_PRESCRIPTION" && (

    <div style={detailSection}>

        <label style={label}>
            How would you like to add the prescription?
        </label>


        <select
            value={
                medicationDetailOption
            }
onChange={(event) => {

    const nextDetail =
        event.target.value as
            MedicationDetailOption;

    setMedicationDetailOption(
        nextDetail
    );

    onMedicationDetailChange?.(
        nextDetail
    );

}}	
            style={selectStyle}
        >

            <option value="">
                Select upload method
            </option>

            <option value="TAKE_PHOTO">
                📷 Take Photo
            </option>

            <option value="CHOOSE_PHOTOS">
                🖼️ Choose Photos
            </option>

            <option value="UPLOAD_PDF">
                📄 Upload PDF
            </option>

        </select>

    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    selectedOption === "CONSULTATION_MODE" && (

    <div style={detailSection}>

        <label style={label}>
            How was the consultation conducted?
        </label>


        <select
            value={
                medicationDetailOption
            }
onChange={(event) => {

    const nextMode =
        event.target.value as
            MedicationDetailOption;

    setMedicationDetailOption(
        nextMode
    );

    onMedicationDetailChange?.(
        nextMode
    );

    if (
        nextMode !== "OTHER"
    ) {

        setOtherConsultationMode(
            ""
        );

    }

}}
            style={selectStyle}
        >

            <option value="">
                Select consultation mode
            </option>

            <option value="IN_PERSON">
                🩺 In Person
            </option>

            <option value="VIDEO">
                📹 Video Consultation
            </option>

            <option value="PHONE">
                📞 Phone Consultation
            </option>

            <option value="HOME_VISIT">
                🏠 Home Visit
            </option>

            <option value="OTHER">
                ✏️ Other
            </option>

        </select>


        {medicationDetailOption === "OTHER" && (

            <input
                type="text"
                value={
                    otherConsultationMode
                }
                onChange={(event) => {

                    setOtherConsultationMode(
                        event.target.value
                    );

                }}
                placeholder="Please specify consultation mode"
                style={textInput}
            />

        )}

    </div>

)}

        </div>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const container:
    React.CSSProperties = {

        width:
            "100%",

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "12px",

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


const primaryButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "15px 18px",

        background:
            "#2563eb",

        color:
            "#ffffff",

        border:
            "none",

        borderRadius:
            "10px",

        fontSize:
            "17px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };

const detailSection:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "12px",

        marginTop:
            "8px",

        paddingTop:
            "18px",

        borderTop:
            "1px solid #e5e7eb",

    };


const textInput:
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

        boxSizing:
            "border-box",

    };

const optionGridTwo:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

        gap:
            "16px",

    };


const optionButton:
    React.CSSProperties = {

        minHeight:
            "110px",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "10px",

        padding:
            "16px",

        background:
            "#ffffff",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "12px",

        cursor:
            "pointer",

        fontFamily:
            "inherit",

    };


const optionIcon:
    React.CSSProperties = {

        fontSize:
            "30px",

    };


const optionLabel:
    React.CSSProperties = {

        fontSize:
            "15px",

        fontWeight:
            700,

        color:
            "#111827",

        textAlign:
            "center",

    };
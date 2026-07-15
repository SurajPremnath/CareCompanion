"use client";

import {
    useState,
} from "react";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

export type ActionOption =
    | "VOICE"
    | "UPLOAD"
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

selectedMedicationDetail?:
    MedicationDetailOption;

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

    selectedMedicationDetail,

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

        <div style={optionGridThree}>

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
                style={{
    ...optionButton,

    ...(selectedOption === "VOICE"
        ? selectedOptionButton
        : {}),
}}
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
            "UPLOAD"
        );

        onOptionChange?.(
            "UPLOAD"
        );

    }}
    style={{
    ...optionButton,

    ...(selectedOption === "UPLOAD"
        ? selectedOptionButton
        : {}),
}}
>

    <span style={optionIcon}>
        📷
    </span>

    <span style={optionLabel}>
        Upload Reading
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
                style={{
    ...optionButton,

    ...(selectedOption === "MANUAL"
        ? selectedOptionButton
        : {}),
}}
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




{selectedAction === "MEDICATION_MANAGEMENT" && (

    <>

        <label style={label}>
            What would you like to do?
        </label>


        <div style={optionGridTwo}>

            <button
                type="button"
                onClick={() => {

                    setSelectedOption(
                        "ADD_PRESCRIPTION"
                    );

                    setMedicationDetailOption(
                        ""
                    );

                    onMedicationDetailChange?.(
                        ""
                    );

                }}
                style={{
    ...optionButton,

    ...(selectedOption === "ADD_PRESCRIPTION"
        ? selectedOptionButton
        : {}),
}}
            >

                <span style={optionIcon}>
                    📄
                </span>

                <span style={optionLabel}>
                    Add Prescription
                </span>

            </button>


            <button
                type="button"
                onClick={() => {

                    setSelectedOption(
                        "CONSULTATION_MODE"
                    );

                    setMedicationDetailOption(
                        ""
                    );

                    onMedicationDetailChange?.(
                        ""
                    );

                }}
                style={{
    ...optionButton,

    ...(selectedOption === "CONSULTATION_MODE"
        ? selectedOptionButton
        : {}),
}}
            >

                <span style={optionIcon}>
                    🩺
                </span>

                <span style={optionLabel}>
                    Mode of Consultation
                </span>

            </button>

        </div>

    </>

)}


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

{/* Upload Guidance */}

<div
    style={{
        background: "#FFF9E6",
        border: "1px solid #E8D27A",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 14,
        lineHeight: 1.6,
    }}
>

    <strong>
        📷 For Best Results
    </strong>

    <div>

        • Supported formats: JPG, JPEG and PNG

        <br />

        • Use clear, well-lit images

        <br />

        • Crop unnecessary background

        <br />

        • Recommended image size: 300 KB – 1 MB

        <br />

        • Maximum supported size: 2 MB per image

    </div>

</div>


<div style={optionGridThree}>

    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "TAKE_PHOTO"
            );

            onMedicationDetailChange?.(
                "TAKE_PHOTO"
            );

        }}
        style={{
            ...optionButton,

            ...(selectedMedicationDetail === "TAKE_PHOTO"
    ? selectedOptionButton
    : {}),
        }}
    >
        <span style={optionIcon}>
            📷
        </span>

        <span style={optionLabel}>
            Take Photo
        </span>
    </button>


    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "CHOOSE_PHOTOS"
            );

            onMedicationDetailChange?.(
                "CHOOSE_PHOTOS"
            );

        }}
        style={{
            ...optionButton,

            ...(selectedMedicationDetail === "CHOOSE_PHOTOS"
    ? selectedOptionButton
    : {}),
        }}
    >
        <span style={optionIcon}>
            🖼️
        </span>

        <span style={optionLabel}>
            Choose Photos
        </span>
    </button>


    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "UPLOAD_PDF"
            );

            onMedicationDetailChange?.(
                "UPLOAD_PDF"
            );

        }}
        style={{
            ...optionButton,

            ...(selectedMedicationDetail === "UPLOAD_PDF"
    ? selectedOptionButton
    : {}),
        }}
    >
        <span style={optionIcon}>
            📄
        </span>

        <span style={optionLabel}>
            Upload PDF
        </span>
    </button>

</div>        

    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    selectedOption === "CONSULTATION_MODE" && (

    <div style={detailSection}>

        <label style={label}>
            How was the consultation conducted?
        </label>


<div style={optionGridThree}>

    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "IN_PERSON"
            );

            onMedicationDetailChange?.(
                "IN_PERSON"
            );

        }}
        style={{
    ...optionButton,

    ...(medicationDetailOption === "IN_PERSON"
        ? selectedOptionButton
        : {}),
}}
    >
        <span style={optionIcon}>
            🩺
        </span>

        <span style={optionLabel}>
            In Person
        </span>
    </button>


    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "VIDEO"
            );

            onMedicationDetailChange?.(
                "VIDEO"
            );

        }}
        style={{
    ...optionButton,

    ...(medicationDetailOption === "VIDEO"
        ? selectedOptionButton
        : {}),
}}
    >
        <span style={optionIcon}>
            📹
        </span>

        <span style={optionLabel}>
            Video
        </span>
    </button>


    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "PHONE"
            );

            onMedicationDetailChange?.(
                "PHONE"
            );

        }}
        style={{
    ...optionButton,

    ...(medicationDetailOption === "PHONE"
        ? selectedOptionButton
        : {}),
}}
    >
        <span style={optionIcon}>
            📞
        </span>

        <span style={optionLabel}>
            Phone
        </span>
    </button>


    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "HOME_VISIT"
            );

            onMedicationDetailChange?.(
                "HOME_VISIT"
            );

        }}
        style={{
    ...optionButton,

    ...(medicationDetailOption === "HOME_VISIT"
        ? selectedOptionButton
        : {}),
}}
    >
        <span style={optionIcon}>
            🏠
        </span>

        <span style={optionLabel}>
            Home Visit
        </span>
    </button>


    <button
        type="button"
        onClick={() => {

            setMedicationDetailOption(
                "OTHER"
            );

            onMedicationDetailChange?.(
                "OTHER"
            );

        }}
        style={{
    ...optionButton,

    ...(medicationDetailOption === "OTHER"
        ? selectedOptionButton
        : {}),
}}
    >
        <span style={optionIcon}>
            ✏️
        </span>

        <span style={optionLabel}>
            Other
        </span>
    </button>

</div>


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

const selectedOptionButton:
    React.CSSProperties = {

        background:
            "#eff6ff",

        border:
            "3px solid #2563eb",

        boxShadow:
            "0 0 0 4px rgba(37, 99, 235, 0.12)",

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

const optionGridThree:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",

        gap:
            "16px",

    };
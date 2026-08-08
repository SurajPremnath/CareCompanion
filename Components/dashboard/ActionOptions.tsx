"use client";

import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import ClinicalTrendPdfGenerator
    from "@/app/journey-review/mobile/ClinicalTrendPdfGenerator";

import ExecutiveSummaryPdfGenerator
    from "@/app/journey-review/mobile/ExecutiveSummaryPdfGenerator";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

export type ActionOption =
    | "VOICE"
    | "UPLOAD"
    | "MANUAL"
    | "ADD_PRESCRIPTION"
    | "VIEW_PRESCRIPTIONS"
    | "DAILY_CARE"
    | "ASSESSMENT_HISTORY"
    | "CLINICAL_TRENDS"
    | "DETAILED_TIMELINE"
    | "MOBILE_CLINICAL_TRENDS"
    | "";


export type MedicationDetailOption =
    | "TAKE_PHOTO"
    | "CHOOSE_PHOTOS"
    | "UPLOAD_PDF"
    | "CONTINUE_VALIDATION"
    | "VIEW_PRESCRIPTIONS"
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

    personMode:
        "SELF" | "FAMILY";

    patientId:
        string | null;

    patientName:
        string;

hasPendingMedicationValidation:
    boolean;

checkingPendingMedicationValidation: boolean;

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

    personMode,

    patientId,

    patientName,

hasPendingMedicationValidation,

checkingPendingMedicationValidation,

    onStartAssessment,

    onOptionChange,

    onMedicationDetailChange,

    selectedMedicationDetail,

}: ActionOptionsProps) {

const {
    t,
} = useLanguage();


const router = useRouter();

const [
    selectedOption,
    setSelectedOption,
] =
    useState<ActionOption>(
        ""
    );

const [
    selectedMobileTimelineAction,
    setSelectedMobileTimelineAction,
] = useState<
    "" |
    "EXECUTIVE_SUMMARY" |
    "CLINICAL_TRENDS"
>("");


const [
    selectedTimelinePeriod,
    setSelectedTimelinePeriod,
] = useState<
    "MONTHLY" |
    "QUARTERLY" |
    "HALF_YEARLY" |
    "ANNUALLY" |
    ""
>("");

const [
    selectedTimelineValue,
    setSelectedTimelineValue,
] = useState("");

const [
    selectedTimelineIndex,
    setSelectedTimelineIndex,
] = useState(0);

const timelinePeriods = [
    {
        value: "MONTHLY",
        label: "Monthly",
        icon: "💎",
    },
    {
        value: "QUARTERLY",
        label: "Quarterly",
        icon: "💠",
    },
    {
        value: "HALF_YEARLY",
        label: "Half-Yearly",
        icon: "🔷",
    },
    {
        value: "ANNUALLY",
        label: "Annually",
        icon: "👑",
    },
] as const;

const currentDate = new Date();

const getTimelineOptions = () => {
    switch (selectedTimelinePeriod) {
        case "MONTHLY": {
    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - index,
            1
        );

        return {
            value: `${date.getFullYear()}-${date.getMonth() + 1}`,
            label: date.toLocaleString("en-IN", {
                month: "long",
                year: "numeric",
            }),
        };
    });
}

        case "QUARTERLY": {
    return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - index * 3,
            1
        );

        const quarter =
            Math.floor(date.getMonth() / 3) + 1;

        return {
            value: `${date.getFullYear()}-Q${quarter}`,
            label: `Q${quarter} ${date.getFullYear()}`,
        };
    });
}

        case "HALF_YEARLY": {
    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - index * 6,
            1
        );

        const half =
            date.getMonth() < 6 ? 1 : 2;

        return {
            value: `${date.getFullYear()}-H${half}`,
            label: `H${half} ${date.getFullYear()}`,
        };
    });
}

        case "ANNUALLY": {
    return Array.from({ length: 10 }, (_, index) => {
        const year = currentDate.getFullYear() - index;

        return {
            value: `${year}`,
            label: `${year}`,
        };
    });
}

        default:
            return [];
    }
};

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
    📋 {t("assessment.startAssessment")}
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
            {t("medication.howWouldYouLikeToRecordHealth")}
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
                    {t("medication.recordWithVoice")}
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
        {t("medication.uploadReading")}
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
{t("medication.enterManually")}
                </span>

            </button>

        </div>

    </>

)}




{selectedAction === "MEDICATION_MANAGEMENT" && (

    <>

        {checkingPendingMedicationValidation ? (

            <div
                style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#6B7280",
                    fontWeight: 600,
                }}
            >

                Checking pending validations...

            </div>

        ) : (

        <>

        <label style={label}>
            {t("medication.whatWouldYouLikeToDo")}
        </label>

        <div style={optionGridTwo}>

            <button
                type="button"
onClick={() => {

    if (hasPendingMedicationValidation) {

        setMedicationDetailOption(
            "CONTINUE_VALIDATION"
        );

        onMedicationDetailChange?.(
            "CONTINUE_VALIDATION"
        );

        return;

    }

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
    {hasPendingMedicationValidation ? "⚠️" : "📄"}
</span>

<span style={optionLabel}>
    {
        hasPendingMedicationValidation
            ? "Continue Validation"
            : t("medication.addPrescription")
    }
</span>

            </button>


            <button
                type="button"
onClick={() => {

    setSelectedOption(
        "VIEW_PRESCRIPTIONS"
    );

    setMedicationDetailOption(
        "VIEW_PRESCRIPTIONS"
    );

    onMedicationDetailChange?.(
        "VIEW_PRESCRIPTIONS"
    );

}}
                style={{
    ...optionButton,

    ...(selectedOption === "VIEW_PRESCRIPTIONS"
    ? selectedOptionButton
    : {}),
}}
            >

    <span style={optionIcon}>
        📖
    </span>

    <span style={optionLabel}>
        View Prescriptions
    </span>

</button>

        </div>

        </>

        )}

    </>

)}


{
    selectedAction === "VIEW_HEALTH" && (

        <>

            <label style={label}>
                Health Timeline
            </label>

            <div style={optionGridTwo}>

<button
    type="button"
    style={optionButton}
    onClick={() => {

        if (personMode === "SELF") {

            router.push("/reports/daily-care/self");

            return;

        }

        router.push("/reports/daily-care");

    }}
>
    <span style={optionIcon}>📋</span>
    <span style={optionLabel}>Daily Care</span>
</button>

<button
    type="button"
    style={optionButton}
    onClick={() => {
        if (personMode === "SELF") {
            router.push("/reports/assessment/self");
            return;
        }

        router.push("/reports/assessment/family");
    }}
>
    <span style={optionIcon}>🩺</span>
    <span style={optionLabel}>Assessments</span>
</button>

<button
    type="button"
    style={optionButton}
    onClick={() => {
        if (personMode === "SELF") {
            router.push("/reports/trends/self");
            return;
        }

        router.push("/reports/trends");
    }}
>
    <span style={optionIcon}>📈</span>
    <span style={optionLabel}>Clinical Trends</span>
</button>

<button
    type="button"
    onClick={() => {

        if (window.innerWidth < 768) {

            setSelectedOption(
                selectedOption === "DETAILED_TIMELINE"
                    ? ""
                    : "DETAILED_TIMELINE"
            );

            return;
        }

        setSelectedOption("DETAILED_TIMELINE");

        router.push("/journey-review");

    }}
    style={{
        ...optionButton,
        ...(selectedOption === "DETAILED_TIMELINE"
            ? selectedOptionButton
            : {}),
    }}
>
    <span style={optionIcon}>🗓️</span>
    <span style={optionLabel}>Detailed Timeline</span>
</button>

</div>

{selectedOption === "DETAILED_TIMELINE" &&
    window.innerWidth < 768 && (

    <div
        style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
        }}
    >

<button
    type="button"
    style={optionButton}
    onClick={() => {

        setSelectedMobileTimelineAction(
            "EXECUTIVE_SUMMARY"
        );

    }}
>
    <span style={optionIcon}>
        📄
    </span>

    <span style={optionLabel}>
        Executive Summary
    </span>

</button>

<button
    type="button"
    style={optionButton}
    onClick={() => {

        setSelectedMobileTimelineAction(
            "CLINICAL_TRENDS"
        );

    }}
>
    <span style={optionIcon}>📈</span>

    <span style={optionLabel}>
        Clinical Trends
    </span>

</button>

{selectedMobileTimelineAction === "EXECUTIVE_SUMMARY" && (

    <div
        style={{
            marginTop: "20px"
        }}
    >

        <ExecutiveSummaryPdfGenerator
            patientId={patientId}
            patientName={patientName}
            onComplete={() => {

                setSelectedMobileTimelineAction("");

            }}
        />

    </div>

)}

{selectedMobileTimelineAction === "CLINICAL_TRENDS" && (

    <div
        style={{
            marginTop: "20px"
        }}
    >

        <ClinicalTrendPdfGenerator
            patientId={patientId}
            patientName={patientName}
            onComplete={() => {

                setSelectedMobileTimelineAction("");

            }}
        />

    </div>

)}

</div>

)}

    </>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    selectedOption === "ADD_PRESCRIPTION" && (

    <div style={detailSection}>

        <label style={label}>
            {t("medication.howWouldYouLikeToAddPrescription")}
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
        📷 {t("medication.forBestResults")}
    </strong>

    <div>

        • {t("medication.supportedFormats")}

        <br />

        • {t("medication.useClearImages")}

        <br />

        • {t("medication.cropBackground")}

        <br />

        • {t("medication.recommendedImageSize")}

        <br />

        • {t("medication.maximumImageSize")}

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
            {t("medication.takePhoto")}
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
            {t("medication.choosePhotos")}
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
            {t("medication.uploadPdf")}
        </span>
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

const optionGridFour: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    columnGap: "40px",
    rowGap: "16px",
    width: "100%",
    marginTop: "8px",
};

const timelineRadioLabel: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    whiteSpace: "nowrap",
};

const selectedTimelineRadioLabel: React.CSSProperties = {
    background: "#EFF6FF",
    border: "2px solid #2563EB",
    borderRadius: "10px",
};

const timelineNavigator: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    margin: "24px auto 0",
    padding: "12px 20px",
    width: "fit-content",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "999px",
};

const timelineArrowButton: React.CSSProperties = {
    width: "42px",
    height: "42px",
    border: "1px solid #E5E7EB",
    borderRadius: "50%",
    background: "#FFFFFF",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const timelineTitle: React.CSSProperties = {
    flex: 1,
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
};
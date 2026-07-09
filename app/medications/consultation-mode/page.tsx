"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import {
    authService,
} from "@/lib/auth/authService";

import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import type {
    Patient,
} from "@/lib/types/patient";
//------------------------------------------------------------
// Consultation Mode
//------------------------------------------------------------

type ConsultationMode =
    | "IN_PERSON"
    | "VIDEO"
    | "PHONE"
    | "HOME_VISIT"
    | "OTHER";


interface ConsultationModeOption {

    value: ConsultationMode;

    icon: string;

    title: string;

    description: string;

}


const CONSULTATION_MODES:
    ConsultationModeOption[] = [

        {
            value: "IN_PERSON",
            icon: "🏥",
            title: "In Person",
            description:
                "Visited a doctor, clinic, or hospital",
        },

        {
            value: "VIDEO",
            icon: "📹",
            title: "Video Consultation",
            description:
                "Consulted the doctor through a video call",
        },

        {
            value: "PHONE",
            icon: "📞",
            title: "Phone Consultation",
            description:
                "Consulted the doctor over a phone call",
        },

        {
            value: "HOME_VISIT",
            icon: "🏠",
            title: "Home Visit",
            description:
                "Doctor visited the patient at home",
        },

        {
            value: "OTHER",
            icon: "➕",
            title: "Other",
            description:
                "Another type of consultation",
        },

    ];

//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function ConsultationModePage() {

    const router =
        useRouter();


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        currentUserName,
        setCurrentUserName,
    ] =
        useState("");


    const [
        patients,
        setPatients,
    ] =
        useState<Patient[]>(
            []
        );


    const [
        selectedPatientId,
        setSelectedPatientId,
    ] =
        useState<string>(
            ""
        );


    const [
        selectedMode,
        setSelectedMode,
    ] =
        useState<ConsultationMode | null>(
            null
        );


    const [
        consultationDate,
        setConsultationDate,
    ] =
        useState(
            new Date()
                .toISOString()
                .slice(0, 10)
        );


    const [
        doctorName,
        setDoctorName,
    ] =
        useState("");


    const [
        hospitalOrClinic,
        setHospitalOrClinic,
    ] =
        useState("");


    const [
        consultationPlatform,
        setConsultationPlatform,
    ] =
        useState("");


    const [
        otherModeDetails,
        setOtherModeDetails,
    ] =
        useState("");


    const [
        notes,
        setNotes,
    ] =
        useState("");

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );


    //------------------------------------------------------------
    // Load User And Patients
    //------------------------------------------------------------

    useEffect(() => {

        async function loadPage() {

            try {

                const user =
                    await authService
                        .getCurrentUser();


                if (!user) {

                    router.replace(
                        "/login"
                    );

                    return;

                }


                setCurrentUserName(

                    user.user_metadata
                        ?.full_name ??

                    user.email ??

                    "User"

                );


                const patientResult =
    await patientStorage
        .getPatients();


if (
    !patientResult.success ||
    !patientResult.data
) {

    setError(
        patientResult.error ??
        "Unable to load patients."
    );

    return;

}


const patientList =
    patientResult.data;


setPatients(
    patientList
);


if (
    patientList.length === 1
) {

    setSelectedPatientId(
        patientList[0].id
    );

}

            }
            catch (loadError) {

                console.error(
                    "Consultation Mode Load Error:",
                    loadError
                );


                setError(
                    "Unable to load patients. Please try again."
                );

            }
            finally {

                setLoading(false);

            }

        }


        void loadPage();

    }, [router]);


    //------------------------------------------------------------
    // Reset Consultation Details
    //------------------------------------------------------------

    function resetConsultationDetails() {

        setSelectedMode(
            null
        );

        setConsultationDate(
            new Date()
                .toISOString()
                .slice(0, 10)
        );

        setDoctorName(
            ""
        );

        setHospitalOrClinic(
            ""
        );

        setConsultationPlatform(
            ""
        );

        setOtherModeDetails(
            ""
        );

        setNotes(
            ""
        );

    }

    //------------------------------------------------------------
    // Selected Patient
    //------------------------------------------------------------

    const selectedPatient =
        patients.find(
            patient =>
                patient.id ===
                selectedPatientId
        ) ?? null;


    //------------------------------------------------------------
    // Loading
    //------------------------------------------------------------

    if (loading) {

        return (

            <main style={loadingContainer}>

                <h2>
                    Loading...
                </h2>

            </main>

        );

    }


    //------------------------------------------------------------
    // Page
    //------------------------------------------------------------

    return (

        <main style={pageContainer}>

            <div style={pageCard}>

                <AppHeader
                    pageTitle="Mode of Consultation"
                    pageIcon="🩺"
                    currentUserName={
                        currentUserName
                    }
                />


                <section style={sectionCard}>

                    <div style={stepHeader}>

                        <span style={stepNumber}>
                            1
                        </span>

                        <div>

                            <h2 style={sectionTitle}>
                                Select Patient
                            </h2>

                            <p style={sectionHelp}>
                                Who was the consultation for?
                            </p>

                        </div>

                    </div>


                    {error && (

                        <div style={errorBox}>

                            <p style={errorText}>
                                {error}
                            </p>

                        </div>

                    )}


                    {!error &&
                     patients.length === 0 && (

                        <div style={emptyState}>

                            <div style={emptyIcon}>
                                👤
                            </div>

                            <h3 style={emptyTitle}>
                                No patients added yet
                            </h3>

                            <p style={emptyText}>
                                Add the patient first, then return
                                to record the consultation.
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/patients/add"
                                    )
                                }
                                style={primaryButton}
                            >
                                + Add Patient
                            </button>

                        </div>

                    )}


                    {patients.length > 0 && (

                        <div style={patientGrid}>

                            {
                                patients.map(
                                    patient => {

                                        const isSelected =
                                            patient.id ===
                                            selectedPatientId;


                                        return (

                                            <button
                                                key={
                                                    patient.id
                                                }
                                                type="button"
                                                onClick={() => {

    if (
        patient.id ===
        selectedPatientId
    ) {

        return;

    }


    setSelectedPatientId(
        patient.id
    );


    resetConsultationDetails();

}}
                                                style={{

                                                    ...patientButton,

                                                    border:
                                                        isSelected
                                                            ? "2px solid #2563eb"
                                                            : "1px solid #d1d5db",

                                                    background:
                                                        isSelected
                                                            ? "#eff6ff"
                                                            : "#ffffff",

                                                }}
                                            >

                                                <span style={patientIcon}>
                                                    👤
                                                </span>


                                                <span style={patientName}>
                                                    {patient.fullName}
                                                </span>


                                                {isSelected && (

                                                    <span style={selectedBadge}>
                                                        Selected
                                                    </span>

                                                )}

                                            </button>

                                        );

                                    }
                                )
                            }

                        </div>

                    )}


                    {selectedPatient && (

                        <div style={selectionConfirmation}>

                            <span>
                                ✓
                            </span>

                            <span>
                                Consultation for{" "}
                                <strong>
                                    {selectedPatient.fullName}
                                </strong>
                            </span>

                        </div>

                    )}

                </section>

{selectedPatient && (

    <section style={sectionCard}>

        <div style={stepHeader}>

            <span style={stepNumber}>
                2
            </span>


            <div>

                <h2 style={sectionTitle}>
                    Mode of Consultation
                </h2>


                <p style={sectionHelp}>
                    How was the consultation conducted?
                </p>

            </div>

        </div>


        <div style={modeGrid}>

            {
                CONSULTATION_MODES.map(
                    mode => {

                        const isSelected =
                            selectedMode ===
                            mode.value;


                        return (

                            <button
                                key={
                                    mode.value
                                }
                                type="button"
                                onClick={() => {

    if (
        mode.value ===
        selectedMode
    ) {

        return;

    }


    setSelectedMode(
        mode.value
    );

    setHospitalOrClinic(
        ""
    );

    setConsultationPlatform(
        ""
    );

    setOtherModeDetails(
        ""
    );

}}
                                style={{

                                    ...modeButton,

                                    border:
                                        isSelected
                                            ? "2px solid #2563eb"
                                            : "1px solid #d1d5db",

                                    background:
                                        isSelected
                                            ? "#eff6ff"
                                            : "#ffffff",

                                }}
                            >

                                <span style={modeIcon}>
                                    {mode.icon}
                                </span>


                                <span style={modeTitle}>
                                    {mode.title}
                                </span>


                                <span style={modeDescription}>
                                    {mode.description}
                                </span>


                                {isSelected && (

                                    <span style={selectedBadge}>
                                        Selected
                                    </span>

                                )}

                            </button>

                        );

                    }
                )
            }

        </div>


        {selectedMode && (

            <div style={selectionConfirmation}>

                <span>
                    ✓
                </span>


                <span>

                    Consultation mode:{" "}

                    <strong>

                        {
                            CONSULTATION_MODES
                                .find(
                                    mode =>
                                        mode.value ===
                                        selectedMode
                                )
                                ?.title
                        }

                    </strong>

                </span>

            </div>

        )}

    </section>

)}

                {selectedPatient &&
                 selectedMode && (

                    <section style={sectionCard}>

                        <div style={stepHeader}>

                            <span style={stepNumber}>
                                3
                            </span>


                            <div>

                                <h2 style={sectionTitle}>
                                    Consultation Details
                                </h2>


                                <p style={sectionHelp}>
                                    Add the details you know.
                                    You can leave optional fields blank.
                                </p>

                            </div>

                        </div>


                        <div style={formGrid}>

                            {/* Consultation Date */}

                            <div style={formField}>

                                <label
                                    htmlFor="consultationDate"
                                    style={fieldLabel}
                                >
                                    Consultation Date
                                </label>


                                <input
                                    id="consultationDate"
                                    type="date"
                                    value={
                                        consultationDate
                                    }
                                    onChange={(event) =>
                                        setConsultationDate(
                                            event.target.value
                                        )
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Doctor Name */}

                            <div style={formField}>

                                <label
                                    htmlFor="doctorName"
                                    style={fieldLabel}
                                >
                                    Doctor Name
                                    <span style={optionalText}>
                                        {" "}Optional
                                    </span>
                                </label>


                                <input
                                    id="doctorName"
                                    type="text"
                                    value={
                                        doctorName
                                    }
                                    onChange={(event) =>
                                        setDoctorName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter doctor's name"
                                    style={inputStyle}
                                />

                            </div>


                            {/* In Person */}

                            {selectedMode ===
                             "IN_PERSON" && (

                                <div style={formField}>

                                    <label
                                        htmlFor="hospitalOrClinic"
                                        style={fieldLabel}
                                    >
                                        Hospital or Clinic
                                        <span style={optionalText}>
                                            {" "}Optional
                                        </span>
                                    </label>


                                    <input
                                        id="hospitalOrClinic"
                                        type="text"
                                        value={
                                            hospitalOrClinic
                                        }
                                        onChange={(event) =>
                                            setHospitalOrClinic(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter hospital or clinic name"
                                        style={inputStyle}
                                    />

                                </div>

                            )}


                            {/* Video */}

                            {selectedMode ===
                             "VIDEO" && (

                                <div style={formField}>

                                    <label
                                        htmlFor="consultationPlatform"
                                        style={fieldLabel}
                                    >
                                        Video Platform
                                        <span style={optionalText}>
                                            {" "}Optional
                                        </span>
                                    </label>


                                    <input
                                        id="consultationPlatform"
                                        type="text"
                                        value={
                                            consultationPlatform
                                        }
                                        onChange={(event) =>
                                            setConsultationPlatform(
                                                event.target.value
                                            )
                                        }
                                        placeholder="For example: hospital app or video call"
                                        style={inputStyle}
                                    />

                                </div>

                            )}


                            {/* Other */}

                            {selectedMode ===
                             "OTHER" && (

                                <div style={formField}>

                                    <label
                                        htmlFor="otherModeDetails"
                                        style={fieldLabel}
                                    >
                                        Consultation Type
                                    </label>


                                    <input
                                        id="otherModeDetails"
                                        type="text"
                                        value={
                                            otherModeDetails
                                        }
                                        onChange={(event) =>
                                            setOtherModeDetails(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Describe the consultation type"
                                        style={inputStyle}
                                    />

                                </div>

                            )}

                        </div>


                        <div style={notesField}>

                            <label
                                htmlFor="consultationNotes"
                                style={fieldLabel}
                            >
                                Notes
                                <span style={optionalText}>
                                    {" "}Optional
                                </span>
                            </label>


                            <textarea
                                id="consultationNotes"
                                value={
                                    notes
                                }
                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                                placeholder="Add any useful consultation notes"
                                rows={4}
                                style={textareaStyle}
                            />

                        </div>

                    </section>

                )}


                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/medications"
                        )
                    }
                    style={backButton}
                >
                    ← Back to Medication Management
                </button>

            </div>

        </main>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const pageContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        background:
            "#f8fafc",

        padding:
            "20px",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const pageCard:
    React.CSSProperties = {

        maxWidth:
            "900px",

        margin:
            "0 auto",

        background:
            "#ffffff",

        padding:
            "32px",

        borderRadius:
            "16px",

        border:
            "1px solid #d1d5db",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",

    };


const loadingContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        display:
            "flex",

        justifyContent:
            "center",

        alignItems:
            "center",

        background:
            "#f8fafc",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const sectionCard:
    React.CSSProperties = {

        marginTop:
            "24px",

        padding:
            "24px",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "14px",

        background:
            "#ffffff",

    };


const stepHeader:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "flex-start",

        gap:
            "14px",

        marginBottom:
            "22px",

    };


const stepNumber:
    React.CSSProperties = {

        width:
            "34px",

        height:
            "34px",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        flexShrink:
            0,

        borderRadius:
            "50%",

        background:
            "#2563eb",

        color:
            "#ffffff",

        fontSize:
            "16px",

        fontWeight:
            700,

    };


const sectionTitle:
    React.CSSProperties = {

        margin:
            0,

        fontSize:
            "22px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const sectionHelp:
    React.CSSProperties = {

        marginTop:
            "5px",

        marginBottom:
            0,

        fontSize:
            "14px",

        color:
            "#6b7280",

    };


const patientGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap:
            "14px",

    };


const patientButton:
    React.CSSProperties = {

        minHeight:
            "130px",

        padding:
            "18px",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "8px",

        borderRadius:
            "12px",

        cursor:
            "pointer",

        textAlign:
            "center",

    };


const patientIcon:
    React.CSSProperties = {

        fontSize:
            "30px",

    };


const patientName:
    React.CSSProperties = {

        fontSize:
            "17px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const selectedBadge:
    React.CSSProperties = {

        padding:
            "4px 9px",

        background:
            "#dbeafe",

        color:
            "#1d4ed8",

        borderRadius:
            "999px",

        fontSize:
            "12px",

        fontWeight:
            700,

    };


const selectionConfirmation:
    React.CSSProperties = {

        display:
            "flex",

        alignItems:
            "center",

        gap:
            "8px",

        marginTop:
            "18px",

        padding:
            "13px 15px",

        background:
            "#f0fdf4",

        border:
            "1px solid #bbf7d0",

        borderRadius:
            "10px",

        color:
            "#166534",

        fontSize:
            "14px",

    };


const emptyState:
    React.CSSProperties = {

        padding:
            "30px 20px",

        textAlign:
            "center",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };


const emptyIcon:
    React.CSSProperties = {

        fontSize:
            "36px",

        marginBottom:
            "10px",

    };


const emptyTitle:
    React.CSSProperties = {

        margin:
            "0 0 8px 0",

        color:
            "#111827",

    };


const emptyText:
    React.CSSProperties = {

        margin:
            "0 0 18px 0",

        color:
            "#6b7280",

        lineHeight:
            1.5,

    };


const primaryButton:
    React.CSSProperties = {

        padding:
            "14px 20px",

        background:
            "#2563eb",

        color:
            "#ffffff",

        border:
            "none",

        borderRadius:
            "10px",

        fontSize:
            "15px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const errorBox:
    React.CSSProperties = {

        padding:
            "14px",

        background:
            "#fef2f2",

        border:
            "1px solid #fecaca",

        borderRadius:
            "10px",

    };


const errorText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#dc2626",

    };


const backButton:
    React.CSSProperties = {

        width:
            "100%",

        marginTop:
            "24px",

        padding:
            "15px",

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
            700,

        cursor:
            "pointer",

    };

const modeGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap:
            "14px",

    };


const modeButton:
    React.CSSProperties = {

        minHeight:
            "165px",

        padding:
            "20px",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "8px",

        borderRadius:
            "12px",

        cursor:
            "pointer",

        textAlign:
            "center",

    };


const modeIcon:
    React.CSSProperties = {

        fontSize:
            "34px",

        marginBottom:
            "2px",

    };


const modeTitle:
    React.CSSProperties = {

        fontSize:
            "17px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const modeDescription:
    React.CSSProperties = {

        maxWidth:
            "200px",

        fontSize:
            "13px",

        lineHeight:
            1.5,

        color:
            "#6b7280",

    };

const formGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",

        gap:
            "18px",

    };


const formField:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "7px",

    };


const fieldLabel:
    React.CSSProperties = {

        fontSize:
            "14px",

        fontWeight:
            700,

        color:
            "#374151",

    };


const optionalText:
    React.CSSProperties = {

        fontSize:
            "12px",

        fontWeight:
            400,

        color:
            "#9ca3af",

    };


const inputStyle:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "13px 14px",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "9px",

        fontSize:
            "16px",

        color:
            "#111827",

        background:
            "#ffffff",

        boxSizing:
            "border-box",

    };


const notesField:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "7px",

        marginTop:
            "18px",

    };


const textareaStyle:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "13px 14px",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "9px",

        fontSize:
            "16px",

        fontFamily:
            "inherit",

        lineHeight:
            1.5,

        resize:
            "vertical",

        boxSizing:
            "border-box",

    };
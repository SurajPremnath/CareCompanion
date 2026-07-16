"use client";

import {
    useEffect,
    useState,
} from "react";

import type {
    MedicationDetailOption,
} from "@/Components/dashboard/ActionOptions";


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";


//------------------------------------------------------------
// Props
//------------------------------------------------------------

interface ConsultationWorkspaceProps {

    mode:
        MedicationDetailOption;

}


//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function ConsultationWorkspace({

    mode,

}: ConsultationWorkspaceProps) {

const {
    t,
} = useLanguage();

    //--------------------------------------------------------
    // State
    //--------------------------------------------------------

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
        useState(
            ""
        );


    const [
        hospitalOrClinic,
        setHospitalOrClinic,
    ] =
        useState(
            ""
        );


    const [
        consultationPlatform,
        setConsultationPlatform,
    ] =
        useState(
            ""
        );


    const [
        otherModeDetails,
        setOtherModeDetails,
    ] =
        useState(
            ""
        );


    const [
        notes,
        setNotes,
    ] =
        useState(
            ""
        );


    //--------------------------------------------------------
    // Reset mode-specific fields
    //--------------------------------------------------------

    useEffect(() => {

        setHospitalOrClinic(
            ""
        );

        setConsultationPlatform(
            ""
        );

        setOtherModeDetails(
            ""
        );

    }, [mode]);


    //--------------------------------------------------------
    // UI
    //--------------------------------------------------------

    return (

        <div style={workspaceContainer}>

            <h3 style={title}>
                t("medication.consultationDetails")
            </h3>


            <p style={helpText}>
                t("medication.consultationDetailsDescription")
            </p>


            <div style={formGrid}>


                {/* Consultation Date */}

                <div style={formField}>

                    <label
                        htmlFor="consultationDate"
                        style={fieldLabel}
                    >
                        t("medication.consultationDate")
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
                        t("medication.doctorName")
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
                        placeholder={t("medication.enterDoctorName")}
                        style={inputStyle}
                    />

                </div>


                {/* In Person */}

                {mode === "IN_PERSON" && (

                    <div style={formField}>

                        <label
                            htmlFor="hospitalOrClinic"
                            style={fieldLabel}
                        >
                            t("medication.hospitalOrClinic")
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
                            placeholder={t("medication.enterHospitalOrClinic")}
                            style={inputStyle}
                        />

                    </div>

                )}


                {/* Video */}

                {mode === "VIDEO" && (

                    <div style={formField}>

                        <label
                            htmlFor="consultationPlatform"
                            style={fieldLabel}
                        >
                            t("medication.videoPlatform")
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
                            placeholder={t("medication.exampleVideoPlatform")}
                            style={inputStyle}
                        />

                    </div>

                )}


                {/* Phone */}

                {mode === "PHONE" && (

                    <div style={formField}>

                        <label
                            style={fieldLabel}
                        >
                            t("medication.consultationType")
                        </label>


                        <div style={modeConfirmation}>
                            📞 t("medication.phoneConsultation")
                        </div>

                    </div>

                )}


                {/* Home Visit */}

                {mode === "HOME_VISIT" && (

                    <div style={formField}>

                        <label
                            htmlFor="homeVisitDoctor"
                            style={fieldLabel}
                        >
                            t("medication.doctorServiceDetails")
                            <span style={optionalText}>
                                {" "}Optional
                            </span>
                        </label>


                        <input
                            id="homeVisitDoctor"
                            type="text"
                            value={
                                hospitalOrClinic
                            }
                            onChange={(event) =>
                                setHospitalOrClinic(
                                    event.target.value
                                )
                            }
                            placeholder={t("medication.enterDoctorServiceDetails")}
                            style={inputStyle}
                        />

                    </div>

                )}


                {/* Other */}

                {mode === "OTHER" && (

                    <div style={formField}>

                        <label
                            htmlFor="otherModeDetails"
                            style={fieldLabel}
                        >
                            t("medication.consultationMethod")
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
                            placeholder={t("medication.describeConsultationMethod")}
                            style={inputStyle}
                        />

                    </div>

                )}


                {/* Notes */}

                <div style={fullWidthField}>

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
                        placeholder={t("medication.enterConsultationNotes")}
                        rows={4}
                        style={textAreaStyle}
                    />

                </div>

            </div>

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

        padding:
            "20px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

        boxSizing:
            "border-box",

    };


const title:
    React.CSSProperties = {

        margin:
            "0 0 6px 0",

        fontSize:
            "22px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const helpText:
    React.CSSProperties = {

        margin:
            "0 0 20px 0",

        color:
            "#64748b",

        lineHeight:
            1.5,

    };


const formGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",

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
            "8px",

    };


const fullWidthField:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "8px",

        gridColumn:
            "1 / -1",

    };


const fieldLabel:
    React.CSSProperties = {

        fontSize:
            "15px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const optionalText:
    React.CSSProperties = {

        fontSize:
            "13px",

        fontWeight:
            400,

        color:
            "#64748b",

    };


const inputStyle:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "12px 14px",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "16px",

        boxSizing:
            "border-box",

    };


const textAreaStyle:
    React.CSSProperties = {

        ...inputStyle,

        resize:
            "vertical",

        fontFamily:
            "inherit",

    };


const modeConfirmation:
    React.CSSProperties = {

        padding:
            "12px 14px",

        background:
            "#ffffff",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        color:
            "#334155",

    };
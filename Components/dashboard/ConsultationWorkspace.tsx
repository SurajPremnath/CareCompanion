"use client";

import {
    useEffect,
    useState,
} from "react";

import type {
    MedicationDetailOption,
} from "@/Components/dashboard/ActionOptions";


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
                Consultation Details
            </h3>


            <p style={helpText}>
                Add the details you know.
                Optional fields can be left blank.
            </p>


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

                {mode === "IN_PERSON" && (

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
                            placeholder="Enter hospital or clinic"
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
                            placeholder="Example: WhatsApp, Zoom"
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
                            Consultation Type
                        </label>


                        <div style={modeConfirmation}>
                            📞 Phone Consultation
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
                            Doctor / Service Details
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
                            placeholder="Enter doctor or service details"
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
                            Consultation Method
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
                            placeholder="Describe the consultation method"
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
                        placeholder="Add any consultation notes"
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
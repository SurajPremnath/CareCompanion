"use client";

import {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import { authService } from "@/lib/auth/authService";

import { patientStorage } from "@/lib/storage/patientStorage";

import type { Patient } from "@/lib/types/patient";

import VoiceRecorder from "@/Components/daily-care/VoiceRecorder";

import {
    medicalVoiceService,
} from "@/lib/medical-voice/medicalVoiceService";

import type {
    MedicalVoiceDailyCareDraft,
} from "@/lib/medical-voice/medicalVoiceTypes";

import {
    dailyCareStorage,
} from "@/lib/storage/DailyCareStorage";

import {
    selfDailyCareStorage,
} from "@/lib/storage/SelfDailyCareStorage";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

type CareMode =
    | "self"
    | "family"
    | null;

type EntryMode =
    | "voice"
    | "manual"
    | null;

export default function CarePage() {

    const router = useRouter();

    const {
        t,
    } = useLanguage();

    const [loading, setLoading] =
        useState(true);

    const [
        currentUserName,
        setCurrentUserName,
    ] = useState("");

    const [
        careMode,
        setCareMode,
    ] = useState<CareMode>(null);

    const [
        entryMode,
        setEntryMode,
    ] = useState<EntryMode>(null);

    const [
        patients,
        setPatients,
    ] = useState<Patient[]>([]);

    const [
        loadingPatients,
        setLoadingPatients,
    ] = useState(false);

    const [
        selectedPatientId,
        setSelectedPatientId,
    ] = useState("");

    const [
        processingVoice,
        setProcessingVoice,
    ] = useState(false);

    const [
        voiceTranscript,
        setVoiceTranscript,
    ] = useState<string | null>(null);

    const [
        voiceDraft,
        setVoiceDraft,
    ] = useState<
        MedicalVoiceDailyCareDraft | null
    >(null);

    const [
        voiceError,
        setVoiceError,
    ] = useState<string | null>(null);

    const [
        voiceConfirmed,
        setVoiceConfirmed,
    ] = useState(false);

const [
    savingVoice,
    setSavingVoice,
] = useState(false);

const [
    feverTemperature,
    setFeverTemperature,
] =
    useState<string>("");


const [
    feverTemperatureUnknown,
    setFeverTemperatureUnknown,
] =
    useState(false);

const [
    clarificationError,
    setClarificationError,
] =
    useState<string | null>(null);

    //------------------------------------------------------------
    // Authentication
    //------------------------------------------------------------

    useEffect(() => {

        async function loadUser() {

            try {

                const user =
                    await authService.getCurrentUser();

                if (!user) {

                    router.replace("/login");

                    return;

                }

                setCurrentUserName(
                    user.user_metadata?.full_name ??
                    user.email ??
                    "User"
                );

            }
            catch {

                router.replace("/login");

                return;

            }
            finally {

                setLoading(false);

            }

        }

        void loadUser();

    }, [router]);

    //------------------------------------------------------------
    // Load Family Patients
    //------------------------------------------------------------

    useEffect(() => {

        if (careMode !== "family") {

            return;

        }

        async function loadPatients() {

            setLoadingPatients(true);

            try {

                const result =
                    await patientStorage.getPatients();

if (!result.success) {

    setPatients([]);

    return;

}

                const patientList =
                    result.data ?? [];

                setPatients(patientList);

                if (patientList.length > 0) {

                    setSelectedPatientId(
                        currentSelectedPatientId => {

                            const selectedPatientStillExists =
                                patientList.some(
                                    patient =>
                                        patient.id ===
                                        currentSelectedPatientId
                                );

                            if (
                                selectedPatientStillExists
                            ) {

                                return currentSelectedPatientId;

                            }

                            return patientList[0].id;

                        }
                    );

                }
                else {

                    setSelectedPatientId("");

                }

            }
            finally {

                setLoadingPatients(false);

            }

        }

        void loadPatients();

    }, [careMode]);

    //------------------------------------------------------------
    // Helpers
    //------------------------------------------------------------

    const selectedPatient =
        patients.find(
            patient =>
                patient.id === selectedPatientId
        ) ?? null;

    const recordingName =
        careMode === "self"
            ? currentUserName
            : selectedPatient?.fullName ?? "";

const needsFeverTemperatureClarification =
    voiceDraft !== null &&
    voiceDraft.symptoms.includes("FEVER") &&
    voiceDraft.temperature === null;

    //------------------------------------------------------------
    // Reset Temporary Voice Session
    //------------------------------------------------------------

    function resetVoiceSession() {

    setProcessingVoice(false);

    setVoiceTranscript(null);

    setVoiceDraft(null);

    setVoiceError(null);

    setVoiceConfirmed(false);

    setFeverTemperature("");

    setFeverTemperatureUnknown(false);

setClarificationError(null);
}

    //------------------------------------------------------------
    // Mode Selection
    //------------------------------------------------------------

        function selectCareMode(
        mode: Exclude<CareMode, null>
    ) {

        resetVoiceSession();

        setCareMode(mode);

        setEntryMode(null);

        if (mode === "self") {

            setSelectedPatientId("");

        }

    }

    //------------------------------------------------------------
    // Navigation
    //------------------------------------------------------------

    function openDailyCare() {

        router.push("/daily-care");

    }

    function openSelfAssessment() {

        router.push("/self/page2");

    }

    function openFamilyAssessment() {

        router.push("/family");

    }

    function openAssessment() {

        if (careMode === "self") {

            openSelfAssessment();

            return;

        }

        openFamilyAssessment();

    }

    function openMedicationManagement() {

        /*
         Medication Management route
         will be connected after the
         new module is created.
        */

    }

        //------------------------------------------------------------
    // Process Voice Recording
    //------------------------------------------------------------

    async function processVoiceRecording(
        audio: File
    ) {

        setProcessingVoice(true);

        setVoiceError(null);

        setVoiceTranscript(null);

        setVoiceDraft(null);

        setVoiceConfirmed(false);


        const result =
    await medicalVoiceService.processVoice(
        audio,
        "care_recording"
    );


        if (!result.success) {

            setVoiceError(
    result.error ??
    "Unable to complete the request."
);

            setProcessingVoice(false);

            return;

        }


        setVoiceTranscript(
            result.data.transcript
        );

        setVoiceDraft(
            result.data.draft
        );

        setProcessingVoice(false);

    }


    //------------------------------------------------------------
    // Re-record
    //------------------------------------------------------------

    function reRecordVoice() {

        resetVoiceSession();

        setEntryMode("voice");

    }


    //------------------------------------------------------------
    // Confirm - UI Phase Only
    //------------------------------------------------------------

    function confirmVoice() {

    if (
        !voiceTranscript ||
        !voiceDraft
    ) {

        return;

    }


    if (
        needsFeverTemperatureClarification &&
        !feverTemperature &&
        !feverTemperatureUnknown
    ) {

        setClarificationError(
    "Please select the temperature or choose I DON'T KNOW."
);

        return;

    }


    setVoiceError(null);

setClarificationError(null);

    setVoiceConfirmed(true);

}

//------------------------------------------------------------
// Save Confirmed Voice Observation
//------------------------------------------------------------

async function saveVoiceObservation() {

    if (
        savingVoice ||
        !voiceDraft ||
        !careMode
    ) {

        return;

    }


    if (
        careMode === "family" &&
        !selectedPatientId
    ) {

        setVoiceError(
            "Please select a family member."
        );

        return;

    }


    setSavingVoice(true);

    setVoiceError(null);


    try {

        const temperature =

            needsFeverTemperatureClarification
                ? (
                    feverTemperatureUnknown
                        ? null
                        : Number(feverTemperature)
                )
                : voiceDraft.temperature;


        const temperatureUnit =

            needsFeverTemperatureClarification &&
            feverTemperature
                ? "F"
                : (
                    voiceDraft.temperatureUnit ??
                    "F"
                );


        const overallStatus:
    | "NO_CONCERNS_REPORTED"
    | "CONCERNS_REPORTED"
    | null =

    voiceDraft.overallObservation ===
    "NO_CONCERNS_REPORTED"

        ? "NO_CONCERNS_REPORTED"

        : (
            voiceDraft.symptoms.length > 0 ||
            voiceDraft.painLocations.length > 0
        )

            ? "CONCERNS_REPORTED"

            : null;


const commonReading = {

    recordedAt:
        new Date().toISOString(),

    overallStatus,

    temperature,

            temperatureUnit,

            systolic:
                voiceDraft.systolic,

            diastolic:
                voiceDraft.diastolic,

            pulse:
                voiceDraft.pulse,

            spo2:
                voiceDraft.spo2,

            symptoms:
                voiceDraft.symptoms,

            otherSymptom:
                voiceDraft.otherSymptom,

            painLocations:
                voiceDraft.painLocations,

            otherPainLocation:
                voiceDraft.otherPainLocation,

        };


        const result =

            careMode === "self"

                ? await selfDailyCareStorage.save(
                    commonReading
                )

                : await dailyCareStorage.save({

                    ...commonReading,

                    patientId:
                        selectedPatientId,

                });


        if (!result.success) {

            setVoiceError(
    result.error ??
    "Unable to complete the request."
);

            return;

        }


        resetVoiceSession();

        setEntryMode(null);

        setCareMode(null);

        setSelectedPatientId("");

    }
    catch (error) {

        console.error(
            "Care Voice Save Error:",
            error
        );

        setVoiceError(
            error instanceof Error
                ? error.message
                : "Unable to save the health update."
        );

    }
    finally {

        setSavingVoice(false);

    }

}

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
    currentUserName={
        currentUserName
    }
/>

                {/*------------------------------------------------
                    Self / Family
                ------------------------------------------------*/}

                <section style={sectionCard}>

                    <h2 style={mainQuestion}>
                        Who are you recording for?
                    </h2>

                    <div style={twoColumnGrid}>

                        <button
                            type="button"
                            onClick={() =>
                                selectCareMode("self")
                            }
                            style={{
                                ...choiceButton,

                                ...(careMode === "self"
                                    ? selectedButton
                                    : {}),
                            }}
                        >
                            👤

                            <span>
                                Myself
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                selectCareMode("family")
                            }
                            style={{
                                ...choiceButton,

                                ...(careMode === "family"
                                    ? selectedButton
                                    : {}),
                            }}
                        >
                            👨‍👩‍👧

                            <span>
                                Family
                            </span>
                        </button>

                    </div>

                </section>

                {/*------------------------------------------------
                    Family Patient
                ------------------------------------------------*/}

                {careMode === "family" && (

                    <section style={sectionCard}>

                        <h3 style={sectionTitle}>
                            Recording for
                        </h3>

                        {loadingPatients ? (

                            <p style={mutedText}>
                                Loading family members...
                            </p>

                        ) : patients.length === 0 ? (

                            <div>

                                <p style={mutedText}>
                                    No family member has been added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/add-patient"
                                        )
                                    }
                                    style={primaryButton}
                                >
                                    ➕ Add Patient
                                </button>

                            </div>

                        ) : (

                            <>

                                <select
                                    value={selectedPatientId}
                                    onChange={(event) => {

    resetVoiceSession();

    setSelectedPatientId(
        event.target.value
    );

    setEntryMode(null);

}}
                                    style={selectStyle}
                                >

                                    {patients.map(
                                        patient => (

                                            <option
                                                key={patient.id}
                                                value={patient.id}
                                            >
                                                {patient.fullName}
                                            </option>

                                        )
                                    )}

                                </select>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/add-patient"
                                        )
                                    }
                                    style={textButton}
                                >
                                    + Add another patient
                                </button>

                            </>

                        )}

                    </section>

                )}

                {/*------------------------------------------------
                    Recording Choice
                ------------------------------------------------*/}

                {(
                    careMode === "self" ||
                    (
                        careMode === "family" &&
                        selectedPatient
                    )
                ) && (

                    <section style={sectionCard}>

                        <h2 style={mainQuestion}>

                            {careMode === "self"
                                ? "How are you today?"
                                : `How is ${recordingName} today?`
                            }

                        </h2>

                        <div style={twoColumnGrid}>

                            <button
                                type="button"
                                onClick={() => {

    resetVoiceSession();

    setEntryMode("voice");

}}
                                style={{
                                    ...actionButton,

                                    ...(entryMode === "voice"
                                        ? selectedButton
                                        : {}),
                                }}
                            >
                                🎙️

                                <span>
                                    Record with Voice
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setEntryMode(
                                        entryMode === "manual"
                                            ? null
                                            : "manual"
                                    )
                                }
                                style={{
                                    ...actionButton,

                                    ...(entryMode === "manual"
                                        ? selectedButton
                                        : {}),
                                }}
                            >
                                ✍️

                                <span>
                                    Enter Manually
                                </span>
                            </button>

                        </div>

                    </section>

                )}


                {/*------------------------------------------------
                    Voice Recording
                ------------------------------------------------*/}

                {entryMode === "voice" && (

                    <section style={sectionCard}>

                        {!voiceTranscript &&
    !processingVoice &&
    !voiceConfirmed &&
    !voiceError && (

                            <>

                                <h3 style={sectionTitle}>

                                    {careMode === "self"
                                        ? "Tell us how you are today"
                                        : `Tell us how ${recordingName} is today`
                                    }

                                </h3>

                                <VoiceRecorder
                                    onRecordingReady={
                                        processVoiceRecording
                                    }
                                    disabled={
                                        processingVoice
                                    }
                                />

                            </>

                        )}


                        {processingVoice && (

                            <div style={statusBox}>

                                <p style={statusText}>
                                    Understanding your recording...
                                </p>

                            </div>

                        )}


                        {voiceError && (

    <div>

        <p style={errorText}>
            {voiceError}
        </p>

        {!voiceConfirmed && (

            <button
                type="button"
                onClick={reRecordVoice}
                style={primaryButton}
            >
                🎙️ Record Again
            </button>

        )}

    </div>

)}
                        {voiceTranscript &&
                            !voiceConfirmed && (

                            <>

                                <h3 style={sectionTitle}>
                                    Transcript
                                </h3>

                                <div style={transcriptBox}>

                                    <p style={transcriptText}>
                                        {voiceTranscript}
                                    </p>

                                </div>


{needsFeverTemperatureClarification && (

    <div style={clarificationCard}>

        <h3 style={sectionTitle}>
            You mentioned fever.
        </h3>

        <p style={mutedText}>
            Do you know the temperature?
        </p>

        <select
            value={feverTemperature}
            disabled={feverTemperatureUnknown}
            onChange={(event) => {

    setFeverTemperature(
        event.target.value
    );

    setFeverTemperatureUnknown(false);

    setClarificationError(null);

}}
            style={selectStyle}
        >
            <option value="">
                Select temperature
            </option>

            {Array.from(
                { length: 111 },
                (_, index) =>
                    (
                        99 +
                        index / 10
                    ).toFixed(1)
            ).map(
                temperature => (

                    <option
                        key={temperature}
                        value={temperature}
                    >
                        {temperature}°F
                    </option>

                )
            )}

        </select>

        <button
            type="button"
            onClick={() => {

    setFeverTemperature("");

    setFeverTemperatureUnknown(true);

    setClarificationError(null);

}}
            style={{
                ...secondaryButton,

                ...(feverTemperatureUnknown
                    ? selectedButton
                    : {}),
            }}
                >
            I DON&apos;T KNOW
        </button>


        {clarificationError && (

            <p
                style={{
                    ...errorText,
                    marginTop: "12px",
                    marginBottom: 0,
                }}
            >
                {clarificationError}
            </p>

        )}

    </div>

)}


                                <div style={voiceActionGrid}>

                                    <button
                                        type="button"
                                        onClick={confirmVoice}
                                        style={primaryButton}
                                    >
                                        ✓ Confirm
                                    </button>

                                    <button
                                        type="button"
                                        onClick={reRecordVoice}
                                        style={secondaryButton}
                                    >
                                        🎙️ Re-record
                                    </button>

                                </div>

                            </>

                        )}


                        {voiceConfirmed && (

    <div style={successBox}>

        <p style={successText}>
            ✓ Recording confirmed
        </p>

        <p style={mutedText}>
            Your health update is ready to save.
        </p>

        <button
            type="button"
            onClick={saveVoiceObservation}
            disabled={savingVoice}
            style={{
                ...primaryButton,

                ...(savingVoice
                    ? {
                        opacity: 0.6,
                        cursor: "not-allowed",
                    }
                    : {}),
            }}
        >
            {savingVoice
                ? "Saving..."
                : "Save Health Update"
            }
        </button>

    </div>

)}
                    </section>

                )}

                {/*------------------------------------------------
                    Manual Modules
                ------------------------------------------------*/}

                {entryMode === "manual" && (

                    <section style={sectionCard}>

                        <h3 style={sectionTitle}>
                            What would you like to record?
                        </h3>

                        <div style={moduleGrid}>

                            <button
                                type="button"
                                onClick={openDailyCare}
                                style={moduleButton}
                            >
                                ❤️

                                <span>
                                    Daily Care
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={
                                    openMedicationManagement
                                }
                                style={moduleButton}
                            >
                                💊

                                <span>
                                    Medication Management
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={openAssessment}
                                style={moduleButton}
                            >
                                🩺

                                <span>
                                    Assessment
                                </span>
                            </button>

                        </div>

                    </section>

                )}

                <button
                    type="button"
                    onClick={() =>
                        router.push("/dashboard")
                    }
                    style={backButton}
                >
                    ← {t("dashboard.backToHome")}
                </button>
                
            </div>

        </main>

    );

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const pageContainer: React.CSSProperties = {

    minHeight: "100vh",

    background: "#f8fafc",

    padding: "24px",

    fontFamily:
        "Inter, Arial, sans-serif",

};

const pageCard: React.CSSProperties = {

    maxWidth: "900px",

    margin: "0 auto",

    background: "#ffffff",

    padding: "32px",

    borderRadius: "16px",

    border:
        "1px solid #d1d5db",

    boxShadow:
        "0 4px 12px rgba(0,0,0,0.06)",

};

const loadingContainer: React.CSSProperties = {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "#f8fafc",

    fontFamily:
        "Inter, Arial, sans-serif",

};

const sectionCard: React.CSSProperties = {

    marginTop: "24px",

    padding: "24px",

    border:
        "1px solid #e2e8f0",

    borderRadius: "14px",

    background: "#ffffff",

};

const mainQuestion: React.CSSProperties = {

    marginTop: 0,

    marginBottom: "20px",

    fontSize: "24px",

    fontWeight: 700,

    color: "#111827",

};

const sectionTitle: React.CSSProperties = {

    marginTop: 0,

    marginBottom: "16px",

    fontSize: "20px",

    fontWeight: 700,

    color: "#111827",

};

const twoColumnGrid: React.CSSProperties = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "14px",

};

const moduleGrid: React.CSSProperties = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",

    gap: "14px",

};

const choiceButton: React.CSSProperties = {

    minHeight: "90px",

    padding: "18px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    background: "#ffffff",

    color: "#111827",

    border:
        "1px solid #d1d5db",

    borderRadius: "12px",

    fontSize: "17px",

    fontWeight: 700,

    cursor: "pointer",

};

const actionButton: React.CSSProperties = {

    ...choiceButton,

    minHeight: "110px",

    fontSize: "18px",

};

const moduleButton: React.CSSProperties = {

    minHeight: "100px",

    padding: "18px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    background: "#ffffff",

    color: "#111827",

    border:
        "1px solid #d1d5db",

    borderRadius: "12px",

    fontSize: "16px",

    fontWeight: 700,

    cursor: "pointer",

};

const selectedButton: React.CSSProperties = {

    border:
        "2px solid #2563eb",

    background: "#eff6ff",

    color: "#1d4ed8",

};

const selectStyle: React.CSSProperties = {

    width: "100%",

    padding: "14px",

    border:
        "1px solid #d1d5db",

    borderRadius: "10px",

    fontSize: "16px",

    background: "#ffffff",

    boxSizing: "border-box",

};

const primaryButton: React.CSSProperties = {

    width: "100%",

    padding: "15px",

    background: "#2563eb",

    color: "#ffffff",

    border: "none",

    borderRadius: "10px",

    fontSize: "16px",

    fontWeight: 700,

    cursor: "pointer",

};

const textButton: React.CSSProperties = {

    marginTop: "12px",

    padding: 0,

    border: "none",

    background: "transparent",

    color: "#2563eb",

    fontSize: "15px",

    fontWeight: 600,

    cursor: "pointer",

};

const backButton: React.CSSProperties = {

    width: "100%",

    marginTop: "24px",

    padding: "15px",

    background: "#ffffff",

    color: "#111827",

    border:
        "1px solid #d1d5db",

    borderRadius: "10px",

    fontSize: "16px",

    fontWeight: 700,

    cursor: "pointer",

};

const mutedText: React.CSSProperties = {

    color: "#6b7280",

    lineHeight: 1.5,

};

const statusBox: React.CSSProperties = {

    padding: "20px",

    textAlign: "center",

    borderRadius: "12px",

    background: "#f8fafc",

    border: "1px solid #e2e8f0",

};

const statusText: React.CSSProperties = {

    margin: 0,

    fontSize: "16px",

    fontWeight: 600,

    color: "#334155",

};

const transcriptBox: React.CSSProperties = {

    padding: "18px",

    marginBottom: "18px",

    borderRadius: "12px",

    background: "#f8fafc",

    border: "1px solid #e2e8f0",

};

const transcriptText: React.CSSProperties = {

    margin: 0,

    fontSize: "17px",

    lineHeight: 1.6,

    color: "#111827",

};

const clarificationCard: React.CSSProperties = {

    padding: "18px",

    marginBottom: "18px",

    borderRadius: "12px",

    background: "#fff7ed",

    border: "1px solid #fed7aa",

};

const voiceActionGrid: React.CSSProperties = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",

    gap: "12px",

};

const secondaryButton: React.CSSProperties = {

    width: "100%",

    padding: "15px",

    background: "#ffffff",

    color: "#111827",

    border: "1px solid #d1d5db",

    borderRadius: "10px",

    fontSize: "16px",

    fontWeight: 700,

    cursor: "pointer",

};

const errorText: React.CSSProperties = {

    marginTop: 0,

    marginBottom: "16px",

    color: "#dc2626",

    lineHeight: 1.5,

};

const successBox: React.CSSProperties = {

    padding: "20px",

    textAlign: "center",

    borderRadius: "12px",

    background: "#f0fdf4",

    border: "1px solid #bbf7d0",

};

const successText: React.CSSProperties = {

    marginTop: 0,

    marginBottom: "8px",

    fontSize: "18px",

    fontWeight: 700,

    color: "#166534",

};


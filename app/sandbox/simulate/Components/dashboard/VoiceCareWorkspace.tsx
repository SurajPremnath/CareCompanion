"use client";

import VoiceRecorder from
    "@/Components/daily-care/VoiceRecorder";

import {
    useEffect,
    useState,
} from "react";


import type {
    MedicalVoiceDailyCareDraft,
} from "@/lib/medical-voice/medicalVoiceTypes";


import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

import {
    AppAlert,
} from "@/lib/utils/appAlert";


interface VoiceCareWorkspaceProps {

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


export default function VoiceCareWorkspace({

    mode,

    patientId,

    patientName,

    currentUserName,

}: VoiceCareWorkspaceProps) {

const {
    t,
} = useLanguage();


const [
    processingVoice,
    setProcessingVoice,
] = useState(false);


const [
    voiceTranscript,
    setVoiceTranscript,
] = useState<string | null>(
    null
);


const [
    showTranscript,
    setShowTranscript,
] = useState(false);


const [
    audioPlaybackUrl,
    setAudioPlaybackUrl,
] = useState<string | null>(
    null
);

const [
    voiceDraft,
    setVoiceDraft,
] = useState<
    MedicalVoiceDailyCareDraft | null
>(null);


const [
    voiceError,
    setVoiceError,
] = useState<string | null>(
    null
);


const [
    savingVoice,
    setSavingVoice,
] = useState(false);

const [
    feverTemperature,
    setFeverTemperature,
] = useState<string>("");


const [
    feverTemperatureUnknown,
    setFeverTemperatureUnknown,
] = useState(false);


const [
    clarificationError,
    setClarificationError,
] = useState<string | null>(
    null
);


useEffect(() => {

    return () => {

        if (audioPlaybackUrl) {

            URL.revokeObjectURL(
                audioPlaybackUrl
            );

        }

    };

}, [audioPlaybackUrl]);


    const recordingName =

        mode === "self"
            ? currentUserName
            : patientName ?? "";


const needsFeverTemperatureClarification =

    voiceDraft !== null &&

    voiceDraft.symptoms.includes(
        "FEVER"
    ) &&

    voiceDraft.temperature === null;

function resetVoiceSession() {

    if (audioPlaybackUrl) {

        URL.revokeObjectURL(
            audioPlaybackUrl
        );

    }

    setAudioPlaybackUrl(null);

    setShowTranscript(false);

    setProcessingVoice(false);

    setVoiceTranscript(null);

    setVoiceDraft(null);

    setVoiceError(null);

    setFeverTemperature("");

    setFeverTemperatureUnknown(false);

    setClarificationError(null);

}

async function processVoiceRecording(audio: File) {
    setProcessingVoice(true);
    setVoiceError(null);
    setVoiceTranscript(null);
    setVoiceDraft(null);
    setShowTranscript(false);

    if (audioPlaybackUrl) {
        URL.revokeObjectURL(audioPlaybackUrl);
    }

    const playbackUrl = URL.createObjectURL(audio);
    setAudioPlaybackUrl(playbackUrl);

    try {
        // Sandbox simulation: do not send audio to an AI service.
        // Keep the selected audio available for the existing playback UI.
        const simulatedTranscript =
            "I have been feeling slightly tired today. My temperature is 98.6 degrees Fahrenheit. My pulse is 72 beats per minute.";

        const simulatedDraft: MedicalVoiceDailyCareDraft = {
            overallObservation: "CONCERNS_REPORTED",
            temperature: 98.6,
            temperatureUnit: "F",
            weightKg: null,
            systolic: null,
            diastolic: null,
            pulse: 72,
            spo2: null,
            symptoms: [],
            otherSymptom: "Slight tiredness",
            painLocations: [],
            otherPainLocation: null,
        };

        setVoiceTranscript(simulatedTranscript);
        setVoiceDraft(simulatedDraft);
    } catch {
        setVoiceError("Unable to load the simulated voice example. Please try again.");
    } finally {
        setProcessingVoice(false);
    }
}



function reRecordVoice() {

    resetVoiceSession();

}

async function saveVoiceObservation() {

    if (
        savingVoice ||
        !voiceDraft
    ) {

        return;

    }


    if (
        mode === "family" &&
        !patientId
    ) {

        setVoiceError(
            t("medication.pleaseSelectFamilyMember")
        );

        return;

    }


if (
    needsFeverTemperatureClarification &&
    !feverTemperature &&
    !feverTemperatureUnknown
) {

    setClarificationError(
        t("medication.selectTemperatureOrDontKnow")
    );

    return;

}

setClarificationError(null);

    setSavingVoice(true);

    setVoiceError(null);


    try {

        const temperature =

            needsFeverTemperatureClarification

                ? (
                    feverTemperatureUnknown
                        ? null
                        : Number(
                            feverTemperature
                        )
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

    weightKg:
        voiceDraft.weightKg,

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


        // Simulation Sandbox: preserve the voice workflow,
        // but do not persist the resulting health record.
        void commonReading;

        resetVoiceSession();

        AppAlert.success(
            "This is just a simulation. Record not saved into database."
        );

    }
    catch (error) {

        console.error(
            t("medication.voiceCareSaveError"),
            error
        );

        setVoiceError(

            error instanceof Error

                ? error.message

                : t("dailyCare.unableToSaveHealthUpdate")

        );

    }
    finally {

        setSavingVoice(false);

    }

}

    return (

        <section>

{!voiceDraft &&
    !processingVoice && (
        <>
            <h3 className="voice-care-heading">
                {mode === "self"
                    ? t("dailyCare.tellUsHowYouFeel")
                    : t("dailyCare.tellUsHowPatientFeels")
                        .replace("{name}", recordingName)}
            </h3>

<div className="sandbox-voice-instructions">
    <div className="sandbox-voice-instructions-header">
        <span className="sandbox-voice-demo-label">
            VOICE DEMONSTRATION
        </span>

        <h4>Try a sample health update</h4>

        <p>
            Read the example below aloud at your natural pace.
        </p>
    </div>

    <blockquote className="sandbox-voice-sample">
        <span className="sandbox-voice-quote-mark" aria-hidden="true">
            “
        </span>

        <p>
            I am feeling slightly tired today.
        </p>

        <p>
            My temperature is 98.6 degrees Fahrenheit,
            and my pulse is 72 beats per minute.
        </p>

        <p>
            I have no other symptoms.
        </p>
    </blockquote>

    <div className="sandbox-voice-disclaimer">
        <span aria-hidden="true">ⓘ</span>

        <p>
            This is a demonstration. You may use fictional
            details. No actual health record will be saved.
        </p>
    </div>
</div>

            <VoiceRecorder
                onRecordingReady={processVoiceRecording}
                disabled={processingVoice}
            />
        </>
    )}


{processingVoice && (

    <div style={processingContainer}>

        <p style={processingText}>
            {t("dailyCare.understandingRecording")}
        </p>

<div style={progressTrack}>

    <div
        className="voice-progress-indicator"
        style={progressIndicator}
    />

</div>

        <p style={processingHint}>
            {t("dailyCare.preparingHealthUpdate")}
        </p>

    </div>

)}

{voiceError &&
    !voiceDraft && (

    <div>

        <p>
            {voiceError}
        </p>

        <button
            type="button"
            onClick={
                resetVoiceSession
            }
        >
            🎙️ {t("dailyCare.recordAgain")}
        </button>

    </div>

)}


{voiceDraft && voiceTranscript && (

    <div style={reviewContainer}>

        <h3 style={reviewTitle}>
            {t("medication.reviewRecording")}
        </h3>

        <p style={reviewDescription}>
            {t("medication.healthUpdateReady")}
        </p>


        {audioPlaybackUrl && (

            <div style={playbackContainer}>

                <audio
                    controls
                    src={audioPlaybackUrl}
                    style={audioPlayer}
                />

            </div>

        )}


        {showTranscript && (

            <div style={transcriptContainer}>

                <h4 style={transcriptTitle}>
                    {t("dailyCare.transcript")}
                </h4>

                <p style={transcriptText}>
                    {voiceTranscript}
                </p>

            </div>

        )}


        {needsFeverTemperatureClarification && (

            <div style={clarificationContainer}>

                <h3>
                    {t("dailyCare.mentionedFever")}
                </h3>

                <p>
                    {t("dailyCare.knowTemperature")}
                </p>


                <div style={feverControlRow}>

                    <select
                        value={
                            feverTemperature
                        }
                        style={temperatureSelect}
                        disabled={
                            feverTemperatureUnknown
                        }
                        onChange={(event) => {

                            setFeverTemperature(
                                event.target.value
                            );

                            setFeverTemperatureUnknown(
                                false
                            );

                            setClarificationError(
                                null
                            );

                        }}
                    >

                        <option value="">
                            {t("dailyCare.selectTemperature")}
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
                                    key={
                                        temperature
                                    }
                                    value={
                                        temperature
                                    }
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

                            setFeverTemperatureUnknown(
                                true
                            );

                            setClarificationError(
                                null
                            );

                        }}
                        style={unknownButton}
                    >
                        I DON&apos;T KNOW
                    </button>

                </div>


                {clarificationError && (

                    <p style={errorText}>
                        {clarificationError}
                    </p>

                )}

            </div>

        )}


        {voiceError && (

            <p style={errorText}>
                {voiceError}
            </p>

        )}


<div
    className="voice-review-actions"
    style={reviewActionRow}
>
    <div className="voice-review-secondary-actions">
        <button
            type="button"
            onClick={() =>
                setShowTranscript(
                    previous =>
                        !previous
                )
            }
            disabled={
                savingVoice
            }
            style={secondaryActionButton}
        >
            {
                showTranscript
                    ? "📄 Hide Transcript"
                    : "📄 Show Transcript"
            }
        </button>

        <button
            type="button"
            onClick={
                reRecordVoice
            }
            disabled={
                savingVoice
            }
            style={secondaryActionButton}
        >
            🎙️ Re-record
        </button>
    </div>

    <button
        type="button"
        onClick={
            saveVoiceObservation
        }
        disabled={
            savingVoice
        }
        style={{
            ...saveButton,
            opacity:
                savingVoice
                    ? 0.7
                    : 1,
        }}
    >
        {
            savingVoice
                ? "Saving..."
                : "✓ Save"
        }
    </button>
</div>

    </div>

)}

<style jsx>{`
    .voice-progress-indicator {
        animation: voiceProgress 1.4s ease-in-out infinite;
    }

    @keyframes voiceProgress {
        0% {
            transform: translateX(-120%);
        }

        100% {
            transform: translateX(320%);
        }
    }

    .voice-care-heading {
        margin: 0 0 8px;
        font-size: 16px;
        line-height: 1.5;
        font-weight: 600;
    }

    /* Sandbox voice sample instructions */
    .sandbox-voice-instructions {
        box-sizing: border-box;
        width: 100%;
        margin: 20px 0 24px;
        padding: 22px;
        border: 1px solid #dce8e3;
        border-radius: 16px;
        background: #f7faf8;
        color: #243b32;
    }

    .sandbox-voice-instructions-header {
        margin-bottom: 18px;
    }

    .sandbox-voice-demo-label {
        display: inline-block;
        margin-bottom: 10px;
        color: #39745b;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.1px;
    }

    .sandbox-voice-instructions-header h4 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 650;
        line-height: 1.4;
    }

    .sandbox-voice-instructions-header p {
        margin: 0;
        color: #5c6f66;
        font-size: 14px;
        line-height: 1.7;
    }

    .sandbox-voice-sample {
        box-sizing: border-box;
        width: 100%;
        margin: 0;
        padding: 20px;
        border-left: 3px solid #61977e;
        border-radius: 0 12px 12px 0;
        background: #ffffff;
    }

    .sandbox-voice-quote-mark {
        display: block;
        height: 30px;
        color: #61977e;
        font-size: 42px;
        font-weight: 600;
        line-height: 1;
    }

    .sandbox-voice-sample p {
        margin: 0 0 14px;
        font-size: 16px;
        line-height: 1.8;
        overflow-wrap: anywhere;
    }

    .sandbox-voice-sample p:last-child {
        margin-bottom: 0;
    }

    .sandbox-voice-disclaimer {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-top: 16px;
        color: #596b63;
    }

    .sandbox-voice-disclaimer > span {
        flex-shrink: 0;
        font-size: 16px;
        line-height: 1.5;
    }

    .sandbox-voice-disclaimer p {
        margin: 0;
        font-size: 12px;
        line-height: 1.7;
    }

    @media (max-width: 640px) {
        .voice-care-heading {
            margin-bottom: 6px;
            font-size: 14px;
            line-height: 1.5;
        }

        .sandbox-voice-instructions {
            margin: 16px 0 20px;
            padding: 16px;
            border-radius: 14px;
        }

        .sandbox-voice-instructions-header {
            margin-bottom: 14px;
        }

        .sandbox-voice-instructions-header h4 {
            font-size: 16px;
        }

        .sandbox-voice-instructions-header p {
            font-size: 13px;
        }

        .sandbox-voice-sample {
            padding: 16px;
        }

        .sandbox-voice-sample p {
            font-size: 15px;
            line-height: 1.75;
        }

        .sandbox-voice-disclaimer p {
            font-size: 12px;
        }

        .voice-review-actions {
            flex-direction: column;
            gap: 8px;
            margin-top: 12px;
        }

        .voice-review-secondary-actions {
            display: flex;
            width: 100%;
            gap: 8px;
        }

        .voice-review-secondary-actions button {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            min-height: 42px !important;
            padding: 9px 8px !important;
            font-size: 12px !important;
            border-radius: 10px !important;
            white-space: nowrap;
        }

        .voice-review-actions > button {
            width: 100%;
            min-width: 0 !important;
            min-height: 42px !important;
            padding: 9px 10px !important;
            font-size: 13px !important;
            border-radius: 10px !important;
            flex: none !important;
        }
    }
`}</style>

        </section>

    );

}

const processingContainer:
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
            "0 0 12px",

        fontSize:
            "16px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const progressTrack:
    React.CSSProperties = {

        width:
    "32%",

        height:
            "8px",

        background:
            "#e2e8f0",

        borderRadius:
            "999px",

        overflow:
            "hidden",

    };


const progressIndicator:
    React.CSSProperties = {

        width:
            "60%",

        height:
            "100%",

        background:
            "#2563eb",

        borderRadius:
            "999px",

    };


const processingHint:
    React.CSSProperties = {

        margin:
            "10px 0 0",

        fontSize:
            "13px",

fontWeight:
    600,

        color:
            "#64748b",

    };

const feverControlRow:
    React.CSSProperties = {

        display:
            "flex",

        flexWrap:
            "wrap",

        alignItems:
            "center",

        gap:
            "12px",

        marginTop:
            "12px",

        marginBottom:
            "12px",

    };


const temperatureSelect:
    React.CSSProperties = {

        flex:
            "1 1 180px",

        minWidth:
            "160px",

        padding:
            "12px",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        background:
            "#ffffff",

    };


const unknownButton:
    React.CSSProperties = {

        flex:
            "0 1 auto",

        minHeight:
            "46px",

        padding:
            "12px 16px",

        border:
            "1px solid #2563eb",

        borderRadius:
            "10px",

        background:
            "#ffffff",

        color:
            "#1d4ed8",

        fontSize:
            "14px",

        fontWeight:
            700,

        cursor:
            "pointer",

        whiteSpace:
            "nowrap",

    };

const reviewContainer:
    React.CSSProperties = {

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

    };


const reviewTitle:
    React.CSSProperties = {

        margin:
            "0 0 8px",

        fontSize:
            "22px",

        color:
            "#111827",

    };


const reviewDescription:
    React.CSSProperties = {

        margin:
            "0 0 20px",

        color:
            "#64748b",

        lineHeight:
            1.5,

    };


const playbackContainer:
    React.CSSProperties = {

        marginBottom:
            "16px",

    };


const audioPlayer:
    React.CSSProperties = {

        width:
            "100%",

        maxWidth:
            "520px",

    };


const transcriptContainer:
    React.CSSProperties = {

        marginBottom:
            "16px",

        padding:
            "16px",

        background:
            "#ffffff",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "10px",

    };


const transcriptTitle:
    React.CSSProperties = {

        margin:
            "0 0 8px",

        color:
            "#111827",

    };


const transcriptText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#374151",

        lineHeight:
            1.6,

    };


const clarificationContainer:
    React.CSSProperties = {

        marginBottom:
            "16px",

        padding:
            "16px",

        background:
            "#ffffff",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "10px",

    };


const reviewActionRow:
    React.CSSProperties = {

        display:
            "flex",

        flexWrap:
            "wrap",

        gap:
            "12px",

        marginTop:
            "20px",

    };


const secondaryActionButton:
    React.CSSProperties = {

        flex:
            "1 1 180px",

        minHeight:
            "50px",

        padding:
            "12px 16px",

        background:
            "#ffffff",

        color:
            "#1f2937",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "15px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const saveButton:
    React.CSSProperties = {

        flex:
            "1 1 180px",

        minHeight:
            "50px",

        padding:
            "12px 16px",

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


const errorText:
    React.CSSProperties = {

        color:
            "#b91c1c",

        fontWeight:
            600,

    };
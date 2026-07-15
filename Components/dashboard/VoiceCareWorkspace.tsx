"use client";

import VoiceRecorder from
    "@/Components/daily-care/VoiceRecorder";

import {
    useEffect,
    useState,
} from "react";

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

async function processVoiceRecording(
    audio: File
) {

    setProcessingVoice(true);

    setVoiceError(null);

    setVoiceTranscript(null);

    setVoiceDraft(null);

setShowTranscript(false);


if (audioPlaybackUrl) {

    URL.revokeObjectURL(
        audioPlaybackUrl
    );

}


const playbackUrl =
    URL.createObjectURL(
        audio
    );


setAudioPlaybackUrl(
    playbackUrl
);

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
            "Please select a family member."
        );

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


        const result =

            mode === "self"

                ? await selfDailyCareStorage.save(
                    commonReading
                )

                : await dailyCareStorage.save({

                    ...commonReading,

                    patientId:
                        patientId!,

                });


        if (!result.success) {

            setVoiceError(
                result.error ??
                "Unable to complete the request."
            );

            return;

        }


        resetVoiceSession();

    }
    catch (error) {

        console.error(
            "Voice Care Save Error:",
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

    return (

        <section>

{!voiceDraft &&
    !processingVoice && (

    <h3>
        {
            mode === "self"
                ? "Tell us how are you feeling today"
                : `Tell us how ${recordingName} is today`
        }
    </h3>

)}

{!voiceDraft &&
    !processingVoice &&
    !voiceError && (

    <VoiceRecorder
        onRecordingReady={
            processVoiceRecording
        }
        disabled={
            processingVoice
        }
    />

)}


{processingVoice && (

    <div style={processingContainer}>

        <p style={processingText}>
            Understanding your recording...
        </p>

<div style={progressTrack}>

    <div
        className="voice-progress-indicator"
        style={progressIndicator}
    />

</div>

        <p style={processingHint}>
            Please wait while we prepare your health update.
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
            🎙️ Record Again
        </button>

    </div>

)}


{voiceDraft && voiceTranscript && (

    <div style={reviewContainer}>

        <h3 style={reviewTitle}>
            Review Recording
        </h3>

        <p style={reviewDescription}>
            Your health update is ready.
            You can review it or save directly.
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
                    Transcript
                </h4>

                <p style={transcriptText}>
                    {voiceTranscript}
                </p>

            </div>

        )}


        {needsFeverTemperatureClarification && (

            <div style={clarificationContainer}>

                <h3>
                    You mentioned fever.
                </h3>

                <p>
                    Do you know the temperature?
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
        animation:
            voiceProgress 1.4s ease-in-out infinite;
    }

    @keyframes voiceProgress {

        0% {
            transform:
                translateX(-120%);
        }

        100% {
            transform:
                translateX(320%);
        }

    }

    @media (max-width: 640px) {

        .voice-review-actions {
            flex-direction: column;
        }

        .voice-review-actions button {
            width: 100%;
            min-width: 0;
            flex: none;
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
"use client";

import VoiceRecorder from
    "@/Components/daily-care/VoiceRecorder";

import {
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

    setProcessingVoice(false);

    setVoiceTranscript(null);

    setVoiceDraft(null);

    setVoiceError(null);

    setVoiceConfirmed(false);

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

            <h3>
                {
                    mode === "self"
                        ? "Tell us how are you feeling today"
                        : `Tell us how ${recordingName} is today`
                }
            </h3>

            {!voiceTranscript &&
    !processingVoice &&
    !voiceConfirmed &&
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
    !voiceConfirmed && (

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


{voiceTranscript &&
    !voiceConfirmed && (

    <div>

        <h3>
            Transcript
        </h3>

        <p>
            {voiceTranscript}
        </p>


        {needsFeverTemperatureClarification && (

            <div>

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

                    <p>
                        {clarificationError}
                    </p>

                )}

            </div>

        )}


        <div>

            <button
                type="button"
                onClick={
                    confirmVoice
                }
            >
                ✓ Confirm
            </button>


            <button
                type="button"
                onClick={
                    reRecordVoice
                }
            >
                🎙️ Re-record
            </button>

        </div>

    </div>

)}

{voiceConfirmed && (

    <div>

        <p>
            ✓ Recording confirmed
        </p>

        <p>
            Your health update is ready to save.
        </p>


        {voiceError && (

    <p>
        {voiceError}
    </p>

)}


        <button
            type="button"
            onClick={
                saveVoiceObservation
            }
            disabled={
                savingVoice
            }
        >
            {
                savingVoice
                    ? "Saving..."
                    : "Save Health Update"
            }
        </button>

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
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";


//------------------------------------------------------------
// Props
//------------------------------------------------------------

interface VoiceRecorderProps {

  onRecordingReady:
    (audio: File) => void;

  disabled?: boolean;

}


//------------------------------------------------------------
// Voice Recorder
//------------------------------------------------------------

export default function VoiceRecorder({
  onRecordingReady,
  disabled = false,
}: VoiceRecorderProps) {

  //----------------------------------------------------------
  // State
  //----------------------------------------------------------

  const [
    isRecording,
    setIsRecording,
  ] =
    useState(false);

const [
  error,
  setError,
] =
  useState<
    string | null
  >(null);

  //----------------------------------------------------------
  // Refs
  //----------------------------------------------------------

  const mediaRecorderRef =
    useRef<
      MediaRecorder | null
    >(null);


  const streamRef =
    useRef<
      MediaStream | null
    >(null);


  const audioChunksRef =
    useRef<Blob[]>([]);


  //----------------------------------------------------------
  // Stop Media Tracks
  //----------------------------------------------------------

  function stopMediaTracks() {

    if (!streamRef.current) {

      return;

    }

    streamRef.current
      .getTracks()
      .forEach(
        (track) =>
          track.stop()
      );

    streamRef.current =
      null;

  }


  //----------------------------------------------------------
  // Cleanup On Unmount
  //----------------------------------------------------------

  useEffect(() => {

    return () => {

      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state ===
          "recording"
      ) {

        recorder.stop();

      }

      stopMediaTracks();

    };

  }, []);


  //----------------------------------------------------------
  // Start Recording
  //----------------------------------------------------------

  async function startRecording() {

    if (
      disabled ||
      isRecording
    ) {

      return;

    }

    setError(
      null
    );


    try {

      //------------------------------------------------------
      // Browser Support
      //------------------------------------------------------

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {

        setError(
          "Voice recording is not supported on this device or browser."
        );

        return;

      }


      if (
        typeof MediaRecorder ===
        "undefined"
      ) {

        setError(
          "Voice recording is not supported on this device or browser."
        );

        return;

      }


      //------------------------------------------------------
      // Request Microphone
      //------------------------------------------------------

      const stream =
        await navigator.mediaDevices
          .getUserMedia({
            audio: true,
          });


      streamRef.current =
        stream;


      //------------------------------------------------------
      // Create Recorder
      //------------------------------------------------------

      const recorder =
        new MediaRecorder(
          stream
        );


      mediaRecorderRef.current =
        recorder;


      audioChunksRef.current =
        [];


      //------------------------------------------------------
      // Collect Audio
      //------------------------------------------------------

      recorder.ondataavailable =
        (
          event:
            BlobEvent
        ) => {

          if (
            event.data.size > 0
          ) {

            audioChunksRef.current
              .push(
                event.data
              );

          }

        };


      //------------------------------------------------------
      // Recording Complete
      //------------------------------------------------------

      recorder.onstop =
        () => {

          const mimeType =
            recorder.mimeType ||
            "audio/webm";


const audioBlob =
  new Blob(
    audioChunksRef.current,
    {
      type:
        mimeType,
    }
  );


audioChunksRef.current =
  [];


          mediaRecorderRef.current =
            null;


          stopMediaTracks();


          if (
            audioBlob.size === 0
          ) {

            setError(
              "No voice recording was captured. Please try again."
            );

            return;

          }


          const extension =
            mimeType.includes(
              "mp4"
            )
              ? "m4a"
              : mimeType.includes(
                  "mpeg"
                )
              ? "mp3"
              : mimeType.includes(
                  "ogg"
                )
              ? "ogg"
              : mimeType.includes(
                  "wav"
                )
              ? "wav"
              : "webm";


          const audioFile =
            new File(
              [
                audioBlob,
              ],
              `daily-care-voice.${extension}`,
              {
                type:
                  mimeType,
              }
            );


          onRecordingReady(
            audioFile
          );

        };


      //------------------------------------------------------
      // Recorder Error
      //------------------------------------------------------

      recorder.onerror =
        () => {

          setError(
            "Voice recording failed. Please try again."
          );

          setIsRecording(
            false
          );

          stopMediaTracks();

        };


      //------------------------------------------------------
      // Begin
      //------------------------------------------------------

recorder.start(
  1000
);

setIsRecording(
  true
);

    }
    catch (error) {

      console.error(
        "Voice Recording Error:",
        error
      );

      stopMediaTracks();


      if (
        error instanceof DOMException &&
        (
          error.name ===
            "NotAllowedError" ||
          error.name ===
            "PermissionDeniedError"
        )
      ) {

        setError(
          "Microphone permission is required to record Daily Care details."
        );

        return;

      }


      setError(
        "Unable to start voice recording. Please try again."
      );

    }

  }


  //----------------------------------------------------------
  // Stop Recording
  //----------------------------------------------------------

  function stopRecording() {

    const recorder =
      mediaRecorderRef.current;


    if (
      !recorder ||
      recorder.state !==
        "recording"
    ) {

      return;

    }


    recorder.stop();

    setIsRecording(
      false
    );

  }


  //----------------------------------------------------------
  // Render
  //----------------------------------------------------------

  return (

    <div className="space-y-3">

      {!isRecording ? (

        <button
          type="button"
          onClick={
            startRecording
          }
          disabled={
            disabled
          }
          className="
            w-full
            rounded-xl
            bg-blue-600
            px-4
            py-3
            font-semibold
            text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          🎙️ Start Recording
        </button>

      ) : (

        <button
          type="button"
          onClick={
            stopRecording
          }
          className="
            w-full
            rounded-xl
            bg-red-600
            px-4
            py-3
            font-semibold
            text-white
          "
        >
          ⏹ Stop Recording
        </button>

      )}


      {isRecording && (

        <p
          className="
            text-center
            text-sm
            font-medium
            text-red-600
          "
        >
          Recording… Speak naturally.
        </p>

      )}



      {error && (

        <p
          className="
            text-sm
            text-red-600
          "
        >
          {error}
        </p>

      )}

    </div>

  );

}
import type {
  MedicalVoiceProcessingResult,
} from "./medicalVoiceTypes";

import {
  supabase,
} from "@/lib/supabase";

import type {
    MedicalVoiceProcessingMode,
} from "./medicalVoiceTypes";

//------------------------------------------------------------
// Medical Voice Service
//------------------------------------------------------------

export const medicalVoiceService = {

  async processVoice(
    audio: File,
    mode: MedicalVoiceProcessingMode =
        "daily_care"
): Promise<MedicalVoiceProcessingResult> {

    try {

      //------------------------------------------------------
      // Get Current Session
      //------------------------------------------------------

      const {
        data: {
          session,
        },
        error: sessionError,
      } =
        await supabase.auth.getSession();


      if (
        sessionError ||
        !session?.access_token
      ) {

        return {

          success: false,

          error:
            "Your session has expired. Please sign in again.",

        };

      }


      //------------------------------------------------------
      // Build Form Data
      //------------------------------------------------------

      const formData =
        new FormData();

      formData.append(
        "audio",
        audio
      );

formData.append(
    "mode",
    mode
);
      //------------------------------------------------------
      // Process Voice
      //------------------------------------------------------

      const response =
        await fetch(
          "/api/medical-voice",
          {

            method:
              "POST",

            headers: {

              Authorization:
                `Bearer ${session.access_token}`,

            },

            body:
              formData,

          }
        );


      const result =
        await response.json();


      //------------------------------------------------------
      // API Failure
      //------------------------------------------------------

      if (!response.ok) {

        return {

          success: false,

          error:
            result?.error ??
            "Unable to process the voice recording.",

        };

      }


      //------------------------------------------------------
      // Success
      //------------------------------------------------------

      return {

        success: true,

        data:
          result.data,

      };

    }
catch (error) {

  console.error(
    "Medical Voice Processing Error:",
    error
  );

  const message =
    error instanceof Error
      ? error.message
      : String(error);


  return {

    success: false,

    error:
      `Voice request failed: ${message}`,

  };

}

  },

};
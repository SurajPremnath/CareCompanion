import type {
  MedicalImageProcessingResult,
  DoctorNotesImageProcessingResult,
} from "./medicalImageTypes";

import {
  supabase,
} from "@/lib/supabase";

//------------------------------------------------------------
// Medical Image Analysis Modes
//------------------------------------------------------------

export type MedicalImageAnalysisMode =
  | "RECORD_HEALTH"
  | "DOCTOR_NOTES";

//------------------------------------------------------------
// Medical Image Service
//------------------------------------------------------------

export const medicalImageService = {

  //----------------------------------------------------------
  // Record Health
  //
  // Existing functionality remains unchanged.
  //----------------------------------------------------------

async processImages(
    images: File[]
): Promise<MedicalImageProcessingResult> {

    try {

        if (
            images.length === 0
        ) {

            return {
                success: false,
                error:
                    "Please upload at least one image.",
            };

        }

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

        const formData =
            new FormData();

        images.forEach(
            image => {

                formData.append(
                    "images",
                    image
                );

            }
        );

        formData.append(
            "analysisMode",
            "RECORD_HEALTH"
        );

        const response =
            await fetch(
                "/api/medical-image",
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

        if (
            !response.ok
        ) {

            return {
                success: false,
                error:
                    result?.error ??
                    "Unable to read the medical images.",
            };

        }

        return {
            success: true,
            data:
                result.data,
        };

    }
    catch (
        error
    ) {

        console.error(
            "Medical Images Processing Error:",
            error
        );

        return {
            success: false,
            error:
                "Unable to process the medical images.",
        };

    }

},

  //----------------------------------------------------------
  // Doctor's Notes
  //----------------------------------------------------------

  async processDoctorNotes(
    images: File[]
  ): Promise<DoctorNotesImageProcessingResult> {

    try {

      if (
        images.length === 0
      ) {

        return {
          success: false,
          error:
            "Please upload at least one image.",
        };

      }

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

      const formData =
        new FormData();

      images.forEach(
        image => {

          formData.append(
            "images",
            image
          );

        }
      );

      formData.append(
        "analysisMode",
        "DOCTOR_NOTES"
      );

      const response =
        await fetch(
          "/api/medical-image",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {

        return {
          success: false,
          error:
            result?.error ??
            "Unable to read the doctor's notes.",
        };

      }

      return {
        success: true,
        data: result.data,
      };

    }
    catch (error) {

      console.error(
        "Doctor's Notes Image Processing Error:",
        error
      );

      return {
        success: false,
        error:
          "Unable to process the doctor's notes.",
      };

    }

  },

};
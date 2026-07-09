import type {
  PrescriptionImageProcessingResult,
} from "./prescriptionImageTypes";

import {
  supabase,
} from "@/lib/supabase";


//------------------------------------------------------------
// Prescription Image Service
//------------------------------------------------------------

export const prescriptionImageService = {

  async processFiles(
    files: File[]
  ): Promise<PrescriptionImageProcessingResult> {

    try {

      //------------------------------------------------------
      // Validate Files
      //------------------------------------------------------

      if (
        files.length === 0
      ) {

        return {

          success: false,

          error:
            "No prescription document was selected.",

        };

      }


      //------------------------------------------------------
      // Get Authenticated Session
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


      for (const file of files) {

        formData.append(
          "documents",
          file
        );

      }


      //------------------------------------------------------
      // Call Prescription API
      //------------------------------------------------------

      const response =
        await fetch(
          "/api/prescription-image",
          {

            method: "POST",

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
      // API Error
      //------------------------------------------------------

      if (!response.ok) {

        return {

          success: false,

          error:
            result?.error ??
            "Unable to read the prescription.",

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
        "Prescription Document Processing Error:",
        error
      );


      return {

        success: false,

        error:
          "Unable to process the prescription document.",

      };

    }

  },

};
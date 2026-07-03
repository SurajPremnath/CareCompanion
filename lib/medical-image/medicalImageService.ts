import type {
  MedicalImageProcessingResult,
} from "./medicalImageTypes";

//------------------------------------------------------------
// Medical Image Service
//------------------------------------------------------------

export const medicalImageService = {

  async processImage(
    image: File
  ): Promise<MedicalImageProcessingResult> {

    try {

      const formData =
        new FormData();

      formData.append(
        "image",
        image
      );

      const response =
        await fetch(
          "/api/medical-image",
          {
            method: "POST",
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
            "Unable to read the medical image.",
        };

      }

      return {
        success: true,
        data: result.data,
      };

    }
    catch (error) {

      console.error(
        "Medical Image Processing Error:",
        error
      );

      return {
        success: false,
        error:
          "Unable to process the medical image.",
      };

    }

  },

};
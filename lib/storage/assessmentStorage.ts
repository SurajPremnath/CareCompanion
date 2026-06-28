import { assessmentRepository } from "@/lib/repositories/assessmentRepository";
import { authService } from "@/lib/auth/authService";

import type {
  AssessmentInput,
  AssessmentRecord,
} from "@/lib/types/assessment";

import type { Result } from "@/lib/types/result";

export class AssessmentStorage {

  //------------------------------------------------------------
  // Save Assessment
  //------------------------------------------------------------

  async save(
    request: Omit<
      AssessmentInput,
      "userId"
    >
  ): Promise<Result<AssessmentRecord>> {

    try {

      if (!request.patientId) {

        return {

          success: false,

          error:
            "Patient is required."

        };

      }

      if (!request.answers) {

        return {

          success: false,

          error:
            "Assessment answers are required."

        };

      }

      if (
        request.rawScore < 0
      ) {

        return {

          success: false,

          error:
            "Invalid raw score."

        };

      }

      if (
        request.normalizedScore < 0 ||
        request.normalizedScore > 20
      ) {

        return {

          success: false,

          error:
            "Invalid assessment score."

        };

      }

      const userId =
        await authService.getCurrentUserId();

      const assessment: AssessmentInput = {

        ...request,

        userId,

      };

      const savedAssessment =
        await assessmentRepository.create(
          assessment
        );

      return {

        success: true,

        data: savedAssessment,

      };

    }
    catch (error) {

      console.error(
        "Error saving assessment:",
        error
      );

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to save assessment.",

      };

    }

  }

  //------------------------------------------------------------
  // Get Assessment
  //------------------------------------------------------------

  async getById(
    id: string
  ): Promise<Result<AssessmentRecord>> {

    try {

      const assessment =
        await assessmentRepository.getById(
          id
        );

      if (!assessment) {

        return {

          success: false,

          error:
            "Assessment not found."

        };

      }

      return {

        success: true,

        data: assessment,

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load assessment.",

      };

    }

  }

  //------------------------------------------------------------
  // Patient History
  //------------------------------------------------------------

  async getPatientHistory(
    patientId: string
  ): Promise<Result<AssessmentRecord[]>> {

    try {

      const history =
        await assessmentRepository.getByPatientId(
          patientId
        );

      return {

        success: true,

        data: history,

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load patient history.",

      };

    }

  }

  //------------------------------------------------------------
  // User History
  //------------------------------------------------------------

  async getUserHistory(
  ): Promise<Result<AssessmentRecord[]>> {

    try {

      const userId =
        await authService.getCurrentUserId();

      const history =
        await assessmentRepository.getByUserId(
          userId
        );

      return {

        success: true,

        data: history,

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load assessments.",

      };

    }

  }

  //------------------------------------------------------------
  // Update
  //------------------------------------------------------------

  async update(
    id: string,
    request: Omit<
      AssessmentInput,
      "userId"
    >
  ): Promise<Result<AssessmentRecord>> {

    try {

      const userId =
        await authService.getCurrentUserId();

      const assessment: AssessmentInput = {

        ...request,

        userId,

      };

      const updatedAssessment =
        await assessmentRepository.update(
          id,
          assessment
        );

      return {

        success: true,

        data: updatedAssessment,

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to update assessment.",

      };

    }

  }

  //------------------------------------------------------------
  // Delete
  //------------------------------------------------------------

  async delete(
    id: string
  ): Promise<Result<boolean>> {

    try {

      await assessmentRepository.delete(
        id
      );

      return {

        success: true,

        data: true,

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to delete assessment.",

      };

    }

  }

}

export const assessmentStorage =
  new AssessmentStorage();
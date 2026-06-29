import { dailyCareRepository } from "@/lib/repositories/DailyCareRepository";
import { authService } from "@/lib/auth/authService";

import type {
  DailyCare,
  CreateDailyCareRequest
} from "@/lib/types/dailyCare";

import type { Result } from "@/lib/types/result";

export class DailyCareStorage {

  //------------------------------------------------------------
  // Save Daily Care
  //------------------------------------------------------------

async save(
  request: CreateDailyCareRequest
): Promise<Result<DailyCare>> {

    try {

      if (!request.patientId) {

        return {

          success: false,

          error: "Patient is required."

        };

      }


const userId =
  await authService.getCurrentUserId();

if (!userId) {

  return {

    success: false,

    error: "User not authenticated."

  };

}

const dailyCare: Omit<
  DailyCare,
  "id" | "createdAt" | "updatedAt"
> = {

  ...request,

  userId

};

const savedDailyCare =
  await dailyCareRepository.create(
    dailyCare
  );

      return {

        success: true,

        data: savedDailyCare

      };

    }
    catch (error) {

      console.error(
        "Error saving daily care:",
        error
      );

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to save Daily Care."

      };

    }

  }

  //------------------------------------------------------------
  // Get Reading
  //------------------------------------------------------------

  async getById(
    id: string
  ): Promise<Result<DailyCare>> {

    try {

      const dailyCare =
        await dailyCareRepository.getById(id);

      if (!dailyCare) {

        return {

          success: false,

          error: "Daily Care record not found."

        };

      }

      return {

        success: true,

        data: dailyCare

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load Daily Care."

      };

    }

  }

  //------------------------------------------------------------
  // Patient History
  //------------------------------------------------------------

  async getPatientHistory(
    patientId: string
  ): Promise<Result<DailyCare[]>> {

    try {

      const history =
        await dailyCareRepository.getByPatientId(
          patientId
        );

      return {

        success: true,

        data: history

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load patient history."

      };

    }

  }

  //------------------------------------------------------------
  // User History
  //------------------------------------------------------------

  async getUserHistory(
  ): Promise<Result<DailyCare[]>> {

    try {

      const userId =
        await authService.getCurrentUserId();

      if (!userId) {

        return {

          success: false,

          error: "User not authenticated."

        };

      }

      const history =
        await dailyCareRepository.getByUserId(
          userId
        );

      return {

        success: true,

        data: history

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load Daily Care history."

      };

    }

  }

  //------------------------------------------------------------
  // Delete Reading
  //------------------------------------------------------------

  async delete(
    id: string
  ): Promise<Result<boolean>> {

    try {

      await dailyCareRepository.delete(id);

      return {

        success: true,

        data: true

      };

    }
    catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to delete Daily Care."

      };

    }

  }

}

export const dailyCareStorage =
  new DailyCareStorage();
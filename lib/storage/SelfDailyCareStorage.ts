import { selfDailyCareRepository } from "@/lib/repositories/SelfDailyCareRepository";
import { authService } from "@/lib/auth/authService";

import type {
  SelfDailyCare,
  CreateSelfDailyCareRequest
} from "@/lib/types/selfDailyCare";

import type { Result } from "@/lib/types/result";

export class SelfDailyCareStorage {

  //------------------------------------------------------------
  // Save Self Daily Care
  //------------------------------------------------------------

  async save(
    request: CreateSelfDailyCareRequest
  ): Promise<Result<SelfDailyCare>> {

    try {

      const userId =
        await authService.getCurrentUserId();

      if (!userId) {

        return {

          success: false,

          error: "User not authenticated."

        };

      }

      const dailyCare: Omit<
        SelfDailyCare,
        "id" | "createdAt" | "updatedAt"
      > = {

        ...request,

        userId

      };

      const savedDailyCare =
        await selfDailyCareRepository.create(
          dailyCare
        );

      return {

        success: true,

        data: savedDailyCare

      };

    }
    catch (error) {

      console.error(
        "Error saving Self Daily Care:",
        error
      );

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to save Self Daily Care."

      };

    }

  }

  //------------------------------------------------------------
  // Get Reading
  //------------------------------------------------------------

  async getById(
    id: string
  ): Promise<Result<SelfDailyCare>> {

    try {

      const dailyCare =
        await selfDailyCareRepository.getById(id);

      if (!dailyCare) {

        return {

          success: false,

          error: "Self Daily Care record not found."

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
            : "Unable to load Self Daily Care."

      };

    }

  }

  //------------------------------------------------------------
  // User History
  //------------------------------------------------------------

  async getUserHistory(
  ): Promise<Result<SelfDailyCare[]>> {

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
        await selfDailyCareRepository.getByUserId(
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
            : "Unable to load Self Daily Care history."

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

      await selfDailyCareRepository.delete(id);

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
            : "Unable to delete Self Daily Care."

      };

    }

  }

}

export const selfDailyCareStorage =
  new SelfDailyCareStorage();
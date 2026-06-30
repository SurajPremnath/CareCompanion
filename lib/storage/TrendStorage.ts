import {
  trendRepository
} from "@/lib/repositories/TrendRepository";

import type {
  TrendPeriod
} from "@/lib/trends/trendRequest";

import type { DailyCare } from "@/lib/types/dailyCare";
import type { Result } from "@/lib/types/result";

export class TrendStorage {

  //------------------------------------------------------------
  // Get Trend History
  //------------------------------------------------------------

  async getTrendHistory(
    patientId: string,
    period: TrendPeriod
  ): Promise<Result<DailyCare[]>> {

    try {

      if (!patientId.trim()) {

        return {

          success: false,

          error: "Patient is required."

        };

      }

      return await trendRepository.getTrendHistory(
        patientId,
        period
      );

    }
    catch (error) {

      console.error(
        "TrendStorage:",
        error
      );

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load clinical trends."

      };

    }

  }

}

export const trendStorage =
  new TrendStorage();
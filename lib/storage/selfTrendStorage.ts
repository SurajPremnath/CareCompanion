import {
  selfTrendRepository
} from "@/lib/repositories/SelfTrendRepository";

import type {
  TrendPeriod
} from "@/lib/trends/trendRequest";

import type {
  SelfDailyCare,
} from "@/lib/types/selfDailyCare";

import type { Result } from "@/lib/types/result";

export class SelfTrendStorage {

  //------------------------------------------------------------
  // Get Trend History
  //------------------------------------------------------------

  async getTrendHistory(
    patientId: string,
    period: TrendPeriod
  ): Promise<Result<SelfDailyCare[]>> {

    try {

      if (!patientId.trim()) {

        return {

          success: false,

          error: "Patient is required."

        };

      }

      return await selfTrendRepository.getTrendHistory(
  patientId,
  period
);

    }
    catch (error) {

      console.error(
        "SelfTrendStorage:",
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

export const selfTrendStorage =
  new SelfTrendStorage();
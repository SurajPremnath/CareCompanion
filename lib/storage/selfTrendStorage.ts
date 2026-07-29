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
    patientId: string | null,
    period: TrendPeriod,
  startDate?: string,
  endDate?: string
  ): Promise<Result<SelfDailyCare[]>> {


    try {

if (
  patientId &&
  !patientId.trim()
) {

  return {

    success: false,

    error: "Invalid patient."

  };



      }

return await selfTrendRepository.getTrendHistory(
  patientId,
  period,
  startDate,
  endDate
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
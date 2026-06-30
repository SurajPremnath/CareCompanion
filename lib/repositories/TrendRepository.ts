import { dailyCareRepository } from "@/lib/repositories/DailyCareRepository";

import type { DailyCare } from "@/lib/types/dailyCare";

import type { Result } from "@/lib/types/result";

import type {
  TrendPeriod
} from "@/lib/trends/trendRequest";

export class TrendRepository {

  //------------------------------------------------------------
  // Patient Trend History
  //------------------------------------------------------------

  async getTrendHistory(
    patientId: string,
    period: TrendPeriod
  ): Promise<Result<DailyCare[]>> {

    try {

      const history =
        await dailyCareRepository.getByPatientId(
          patientId
        );

      const filtered =
        this.filterByPeriod(
          history,
          period
        );

      const sorted =
        filtered.sort((a, b) =>
          new Date(a.recordedAt).getTime() -
          new Date(b.recordedAt).getTime()
        );

      return {

        success: true,

        data: sorted

      };

    }
    catch (error) {

      console.error(
        "TrendRepository:",
        error
      );

      return {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load trend history."

      };

    }

  }

  //------------------------------------------------------------
  // Filter Period
  //------------------------------------------------------------

  private filterByPeriod(
    history: DailyCare[],
    period: TrendPeriod
  ): DailyCare[] {

    if (period === -1) {

      return history;

    }

    const now = new Date();

    let startDate = new Date(now);

    switch (period) {

      case 1:

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        break;

      case 7:

        startDate.setDate(
          now.getDate() - 7
        );

        break;

      case 30:

        startDate.setDate(
          now.getDate() - 30
        );

        break;

    }

    return history.filter(record =>

      new Date(record.recordedAt) >= startDate

    );

  }

}

export const trendRepository =
  new TrendRepository();
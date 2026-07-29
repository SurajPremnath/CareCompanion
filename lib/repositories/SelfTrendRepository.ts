import { selfDailyCareRepository }
from "@/lib/repositories/SelfDailyCareRepository";

import type { SelfDailyCare } from "@/lib/types/selfDailyCare";

import type { Result } from "@/lib/types/result";

import type {
  TrendPeriod
} from "@/lib/trends/trendRequest";

export class SelfTrendRepository {

  //------------------------------------------------------------
  // Patient Trend History
  //------------------------------------------------------------

  async getTrendHistory(
  patientId: string | null,
  period: TrendPeriod,
  startDate?: string,
  endDate?: string
): Promise<Result<SelfDailyCare[]>> {

    try {

      const history =
        await selfDailyCareRepository.getByUserId();


      const filtered =
        this.filterByPeriod(
          history,
          period,
  startDate,
  endDate
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
        "SelfTrendRepository:",
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
  history: SelfDailyCare[],
  period: TrendPeriod,
  startDateInput?: string,
  endDateInput?: string
): SelfDailyCare[] {

  if (
    startDateInput &&
    endDateInput
  ) {

    const startDate =
      new Date(startDateInput);

    startDate.setHours(
      0,
      0,
      0,
      0
    );


    const endDate =
      new Date(endDateInput);

    endDate.setHours(
      23,
      59,
      59,
      999
    );


    return history.filter(record => {

      const recordedDate =
        new Date(record.recordedAt);

      return (
        recordedDate >= startDate &&
        recordedDate <= endDate
      );

    });

  }


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

export const selfTrendRepository =
    new SelfTrendRepository();
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
    period: TrendPeriod,
  startDate?: string,
  endDate?: string
  ): Promise<Result<DailyCare[]>> {

    try {

      const history =
        await dailyCareRepository.getByPatientId(
          patientId
        );

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
    period: TrendPeriod,
  startDate?: string,
  endDate?: string
  ): DailyCare[] {


if (startDate && endDate) {

  const start = new Date(startDate);
  start.setHours(0,0,0,0);

  const end = new Date(endDate);
  end.setHours(23,59,59,999);

  return history.filter(record => {
    const date = new Date(record.recordedAt);

    return date >= start && date <= end;
  });

}

    if (period === -1) {

      return history;

    }

const now = new Date();

let calculatedStartDate = new Date(now);

switch (period) {

      case 1:

calculatedStartDate.setHours(
  0,
  0,
  0,
  0
);

        break;

      case 7:

calculatedStartDate.setDate(
  now.getDate() - 7
);

        break;

      case 30:

calculatedStartDate.setDate(
  now.getDate() - 30
);

        break;

    }

return history.filter(record =>

  new Date(record.recordedAt) >= calculatedStartDate

);

  }

}

export const trendRepository =
  new TrendRepository();
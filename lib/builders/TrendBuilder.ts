//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import type { DailyCare } from "@/lib/types/dailyCare";

import type { TrendRequest } from "@/lib/trends/trendRequest";

import type {
  TrendResult,
  ParameterTrend,
  TrendPoint,
  TrendStatistics,
  TrendParameterType
} from "@/lib/trends/trendResult";

//------------------------------------------------------------
// Trend Builder
//------------------------------------------------------------

export class TrendBuilder {

  //----------------------------------------------------------
  // Build Trend Result
  //----------------------------------------------------------

  build(
    request: TrendRequest,
    records: DailyCare[]
  ): TrendResult {

    return {

      patientId: request.patientId,

      patientName: request.patientName,

      period: request.period,

      selectedParameters:
        request.parameters,

      summary: {

        recordCount: records.length,

        earliestRecord:
          this.getEarliestRecord(records),

        latestRecord:
          this.getLatestRecord(records),

        missingValues:
          this.getMissingValues(records)

      },

      parameters: [

        this.buildParameterTrend(
          "temperature",
          request.parameters.temperature,
          records
        ),

        this.buildParameterTrend(
          "bloodPressure",
          request.parameters.bloodPressure,
          records
        ),

        this.buildParameterTrend(
          "pulse",
          request.parameters.pulse,
          records
        ),

        this.buildParameterTrend(
          "spo2",
          request.parameters.spo2,
          records
        )

      ],

      clinicalSummary: {

        messages: []

      }

    };

  }

  //----------------------------------------------------------
  // Build Parameter
  //----------------------------------------------------------

  private buildParameterTrend(

    parameter: TrendParameterType,

    enabled: boolean,

    records: DailyCare[]

  ): ParameterTrend {

if (!enabled) {

  return {

    parameter,

    enabled: false,

    statistics: {

      current: null,

      minimum: null,

      maximum: null,

      average: null,

    },

    axis: {

      min: 0,

      max: 0,

    },

    points: [],

  };

}

const points =
  this.buildPoints(
    parameter,
    records
  );

const statistics =
  this.buildStatistics(points);

return {

  parameter,

  enabled: true,

  statistics,

  axis: {

    min: 0,

    max: 0,

  },

  points,

};

  }

  //----------------------------------------------------------
  // Build Points
  //----------------------------------------------------------

  private buildPoints(

    parameter: TrendParameterType,

    records: DailyCare[]

  ): TrendPoint[] {

    return records
      .map(record => {

        let value:
          number | null = null;

        switch (parameter) {

          case "temperature":

            value =
              record.temperature;

            break;

          case "pulse":

            value =
              record.pulse;

            break;

          case "spo2":

            value =
              record.spo2;

            break;

          case "bloodPressure":

            value =
              record.systolic;

            break;

        }

        if (value === null) {

          return null;

        }

        return {

          recordedAt:
            record.recordedAt,

          value

        };

      })

      .filter(
        (
          point
        ): point is TrendPoint =>
          point !== null
      );

  }

  //----------------------------------------------------------
  // Statistics
  //----------------------------------------------------------

  private buildStatistics(
    points: TrendPoint[]
  ): TrendStatistics {

    if (points.length === 0) {

      return {

        current: null,

        minimum: null,

        maximum: null,

        average: null

      };

    }

    const values =
      points.map(
        point => point.value
      );

    return {

      current:
        values[values.length - 1],

      minimum:
        Math.min(...values),

      maximum:
        Math.max(...values),

      average:
        Number(
          (
            values.reduce(
              (a, b) => a + b,
              0
            ) /
            values.length
          ).toFixed(1)
        )

    };

  }

  //----------------------------------------------------------
  // Summary Helpers
  //----------------------------------------------------------

  private getEarliestRecord(
    records: DailyCare[]
  ): string | null {

    if (!records.length) {

      return null;

    }

    return records[0].recordedAt;

  }

  private getLatestRecord(
    records: DailyCare[]
  ): string | null {

    if (!records.length) {

      return null;

    }

    return records[
      records.length - 1
    ].recordedAt;

  }

  private getMissingValues(
    records: DailyCare[]
  ): number {

    let missing = 0;

    records.forEach(record => {

      if (
        record.temperature == null
      ) missing++;

      if (
        record.systolic == null
      ) missing++;

      if (
        record.pulse == null
      ) missing++;

      if (
        record.spo2 == null
      ) missing++;

    });

    return missing;

  }

}

export const trendBuilder =
  new TrendBuilder();
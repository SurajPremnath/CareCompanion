//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import type {
  TrendResult,
  TrendParameterType,
} from "@/lib/trends/trendResult";

import type {
  TrendReport,
} from "./trendReport";

import {
  TrendChartConfig,
} from "./trendChartConfig";

//------------------------------------------------------------
// Trend Report Builder
//------------------------------------------------------------

export class TrendReportBuilder {

  build(
    trend: TrendResult
  ): TrendReport {

    //--------------------------------------------------------
    // Selected Parameters
    //--------------------------------------------------------

const selectedParameters =
  trend.parameters
    .filter(
      parameter => parameter.enabled
    )
    .map(
      parameter =>
        TrendChartConfig[
  parameter.parameter
].title.replace(
  "₂",
  "2"
)
    );

    //--------------------------------------------------------
    // Build Report
    //--------------------------------------------------------

//--------------------------------------------------------
// Report Period
//--------------------------------------------------------

//--------------------------------------------------------
// Report Period
//--------------------------------------------------------

let reportPeriod = "";

switch (trend.period) {

  case 1:
    reportPeriod = "Last 24 Hours";
    break;

  case 7:
    reportPeriod = "Last 7 Days";
    break;

  case 30:
    reportPeriod = "Last 30 Days";
    break;

  case -1:
    reportPeriod = "All Records";
    break;

  default:
    reportPeriod = "Unknown";

}
    return {

      trend,

      generatedAt:
        new Date().toISOString(),

 patientName:
  trend.patientName,

reportPeriod:
  reportPeriod,

selectedParameters,

chartImages: [],

    };

  }

}

export const trendReportBuilder =
  new TrendReportBuilder();
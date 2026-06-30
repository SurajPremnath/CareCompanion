//------------------------------------------------------------
// Trend Report
//------------------------------------------------------------

import type {
  TrendParameterType,
  TrendResult,
} from "@/lib/trends/trendResult";

export interface TrendReport {

  //----------------------------------------------------------
  // Report Details
  //----------------------------------------------------------

  trend: TrendResult;

  generatedAt: string;

  //----------------------------------------------------------
  // Patient Details
  //----------------------------------------------------------

  patientName: string;

  reportPeriod: string;

  //----------------------------------------------------------
  // Parameters
  //----------------------------------------------------------

  selectedParameters: string[];

chartImages: string[];

}
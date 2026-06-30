//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import type {
  TrendPeriod,
  TrendParameters
} from "@/lib/trends/trendRequest";

//------------------------------------------------------------
// Trend Parameter Type
//------------------------------------------------------------

export type TrendParameterType =
  | "temperature"
  | "bloodPressure"
  | "pulse"
  | "spo2";

//------------------------------------------------------------
// Trend Point
//------------------------------------------------------------

export interface TrendPoint {

  //----------------------------------------------------------
  // Recorded Date & Time
  //----------------------------------------------------------

  recordedAt: string;

  //----------------------------------------------------------
  // Parameter Value
  //----------------------------------------------------------

  value: number;

}

//------------------------------------------------------------
// Trend Statistics
//------------------------------------------------------------

export interface TrendStatistics {

  current: number | null;

  minimum: number | null;

  maximum: number | null;

  average: number | null;

}

//------------------------------------------------------------
// Parameter Trend
//------------------------------------------------------------

export interface ParameterTrend {

  parameter: TrendParameterType;

  enabled: boolean;

  statistics: TrendStatistics;

  points: TrendPoint[];

}

//------------------------------------------------------------
// Trend Summary
//------------------------------------------------------------

export interface TrendSummary {

  recordCount: number;

  earliestRecord: string | null;

  latestRecord: string | null;

  missingValues: number;

}

//------------------------------------------------------------
// Clinical Summary
//------------------------------------------------------------

export interface ClinicalSummary {

  messages: string[];

}

//------------------------------------------------------------
// Trend Result
//------------------------------------------------------------

export interface TrendResult {

  //----------------------------------------------------------
  // Patient
  //----------------------------------------------------------

  patientId: string;

  patientName: string;

  //----------------------------------------------------------
  // Trend Configuration
  //----------------------------------------------------------

  period: TrendPeriod;

  selectedParameters: TrendParameters;

  //----------------------------------------------------------
  // Dashboard Summary
  //----------------------------------------------------------

  summary: TrendSummary;

  //----------------------------------------------------------
  // Parameter Trends
  //----------------------------------------------------------

  parameters: ParameterTrend[];

  //----------------------------------------------------------
  // Clinical Summary
  //----------------------------------------------------------

  clinicalSummary: ClinicalSummary;

}
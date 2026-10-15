import type { SelfDailyCare } from "@/lib/types/selfDailyCare";
import { ClinicalSummary } from "@/lib/clinical-summary/ClinicalSummaryTypes";

export type DailyCareReportType =
  | "self"
  | "family";

export interface DailyCarePdfRequest {

  reportType: DailyCareReportType;

  title: string;

  patientName: string;

  age?: number | null;

  caregiverName?: string | null;

  relationship?: string | null;

  record: SelfDailyCare;

  observationSummary: ClinicalSummary;

}
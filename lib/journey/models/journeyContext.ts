import type { Patient } from "@/lib/patient";
import type { DailyCare } from "@/lib/dailyCare";
import type {
  CompletePrescriptionRecord,
} from "@/lib/prescription/prescriptionTypes";

import type {
  ResolvedConsultation,
} from "../consultation/consultationTypes";

import type {
  JourneyAnalysisResult,
  JourneyComparisonItem,
  JourneyEdge,
  JourneyGovernanceResult,
  JourneyNode,
  JourneyQuestion,
  JourneySummary,
  JourneyTimelineEvent,
} from "./journeyTypes";

/**
 * ============================================================
 * Journey Execution Metadata
 * ============================================================
 */

export interface JourneyExecutionMetadata {
  engineVersion: string;

  executionId: string;

  startedAt: string;

  completedAt?: string;

  processingTimeMs?: number;
}

/**
 * ============================================================
 * Journey Input
 * ============================================================
 *
 * Canonical input supplied to the Journey Engine.
 */

export interface JourneyInput {

  patient: Patient;

  consultation: ResolvedConsultation;

  prescription: CompletePrescriptionRecord;

  previousConsultations: ResolvedConsultation[];

  previousPrescriptions: CompletePrescriptionRecord[];

  dailyCare: DailyCare[];
}

/**
 * ============================================================
 * Builder Outputs
 * ============================================================
 */

export interface JourneyBuilderState {

  comparison: JourneyComparisonItem[];

  activeMedications: string[];

  stoppedMedications: string[];

  newMedications: string[];

  nodes: JourneyNode[];

  edges: JourneyEdge[];

  timeline: JourneyTimelineEvent[];

  summary?: JourneySummary;

  questions: JourneyQuestion[];

  governance?: JourneyGovernanceResult;

  analysis?: JourneyAnalysisResult;
}

/**
 * ============================================================
 * Journey Context
 * ============================================================
 *
 * Runtime object passed through every Journey builder.
 *
 * Journey Engine
 *      ↓
 * Consultation
 *      ↓
 * Comparison
 *      ↓
 * Treatment
 *      ↓
 * Node Builder
 *      ↓
 * Edge Builder
 *      ↓
 * Graph Builder
 *      ↓
 * Timeline Builder
 *      ↓
 * Summary Builder
 *      ↓
 * Question Builder
 *
 * Every stage enriches this object.
 */

export interface JourneyContext {

  input: JourneyInput;

  state: JourneyBuilderState;

  metadata: JourneyExecutionMetadata;
}
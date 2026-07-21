// lib/journey/journeyAnalysisModels.ts

import {
  Journey,
  JourneyContext,
} from "./journeyModels";

import {
  JourneyConfidence,
  JourneyChangeType,
  JourneyStatus,
  JourneyActionType,
  TreatmentStatus,
  MedicineStatus,
  RecommendationPriority,
  SeverityLevel,
  TimelineEventType,
  QuestionType,
} from "./journeyTypes";

/* ============================================================
 * Comparison
 * ============================================================ */

export interface DetectedChange {
  id: string;

  type: JourneyChangeType;

  title: string;

  description: string;

  previousValue?: string;

  currentValue?: string;

  severity: SeverityLevel;

  confidence: number;

requiresConfirmation?: boolean;

accepted?: boolean;

rejected?: boolean;

reason?: string;

  metadata?: Record<string, unknown>;
}

export interface ComparisonResult {
  hasChanges: boolean;

  confidence: number;

  changes: DetectedChange[];

  summary?: string;

  requiresReview?: boolean;

  reviewed?: boolean;

  metadata?: Record<string, unknown>;
}

/* ============================================================
 * Treatment
 * ============================================================ */

export interface ActiveTreatment {
  id: string;

  consultationId?: string;
  consultationDate?: string;
  consultationType?: string;

  doctorId?: string;
  doctorName?: string;
  doctorSpecialty?: string;

  hospitalId?: string;
  hospitalName?: string;

  diagnosis?: string;

treatmentStatus?: TreatmentStatus;

  startDate?: string;
  endDate?: string;

  followUpDate?: string;

  medicines: JourneyMedicine[];

  procedures: JourneyProcedure[];

  investigations: JourneyInvestigation[];

  recommendations?: JourneyRecommendation[];

  notes?: string[];

  metadata?: Record<string, unknown>;
}

export interface JourneyMedicine {
  id: string;

  name: string;

  genericName?: string;
  brandName?: string;

  strength?: string;

  dose?: string;
  dosage?: string;

  frequency?: string;
  timing?: string;
  duration?: string;

  route?: string;
  form?: string;

  instructions?: string;

  indication?: string;

  startDate?: string;
  endDate?: string;

  prescribingDoctor?: string;

  status: MedicineStatus;
    
  confidence?: number;

  metadata?: Record<string, unknown>;
}

export interface JourneyProcedure {
  id: string;

  name: string;

  type?: string;

  status?: string;

  date?: string;

  outcome?: string;

  notes?: string[];

  metadata?: Record<string, unknown>;
}

export interface JourneyInvestigation {
  id: string;

  name: string;

  category?: string;

  status?: string;

  orderedDate?: string;

  completedDate?: string;

  result?: string;

  interpretation?: string;

  notes?: string[];

  metadata?: Record<string, unknown>;
}


export interface TreatmentDecision {
  status: TreatmentStatus;

  activeTreatment: ActiveTreatment;

  recommendations: JourneyRecommendation[];

  requiresReview?: boolean;

  confidence?: number;

  metadata?: Record<string, unknown>;
}

export interface JourneyRecommendation {
  id: string;

  priority: RecommendationPriority;
  

  category: string;

  title: string;

  description: string;

  reason?: string;

  action?: string;

  confidence?: number;

  completed?: boolean;

  metadata?: Record<string, unknown>;
}

/* ============================================================
 * Timeline
 * ============================================================ */

export interface TimelineEvent {
  /* ==========================================================
   * Identity
   * ========================================================== */

  id: string;

  /* ==========================================================
   * Date / Time
   * ========================================================== */

  /**
   * Canonical engine timestamp.
   */
  timestamp: string;

  /**
   * Legacy UI compatibility.
   */
  eventDate: string;

  /* ==========================================================
   * Event Type
   * ========================================================== */

  /**
   * Canonical engine type.
   */
  type: TimelineEventType;

  /**
   * Legacy UI compatibility.
   */
  eventType: TimelineEventType;

  /* ==========================================================
   * Display
   * ========================================================== */

  title: string;

  description?: string;

  subtitle?: string;

  /* ==========================================================
   * Clinical
   * ========================================================== */

  severity?: SeverityLevel;

  status?: JourneyStatus;

  confidence?: number;

  /* ==========================================================
   * Related Objects
   * ========================================================== */

  consultationId?: string;

  prescriptionId?: string;

  medicineId?: string;

  investigationId?: string;

  procedureId?: string;

  /* ==========================================================
   * Visual
   * ========================================================== */

  highlighted?: boolean;

  color?: string;

  icon?: string;

  /* ==========================================================
   * Metadata
   * ========================================================== */

  metadata?: Record<string, unknown>;
}

export type JourneyTimelineEvent = TimelineEvent;

export interface TimelineResult {
  events: TimelineEvent[];
}

/* ============================================================
 * Questions
 * ============================================================ */

export interface JourneyQuestion {
  id: string;

  title: string;

  description?: string;

  type: QuestionType;

  required: boolean;

  options?: JourneyQuestionOption[];

  metadata?: Record<string, unknown>;
}

export interface JourneyQuestionOption {
  id: string;

  label: string;

  value: string;
}

export interface JourneyAnswer {
  questionId: string;

  value: string | string[];

  metadata?: Record<string, unknown>;
}

export interface QuestionResult {
  questions: JourneyQuestion[];
}

/* ============================================================
 * Clinical Summary
 * ============================================================ */

export interface JourneySummaryItem {
  id?: string;

  title: string;

  previousValue?: string;

  currentValue?: string;

  reason?: string;

  /**
   * Indicates whether this item should be visually emphasized
   * in the Journey Review summary.
   */
  highlighted?: boolean;

  /**
   * Additional contextual information for future extensions.
   */
  metadata?: Record<string, unknown>;
}

export type SummaryItem = JourneySummaryItem;

export interface JourneySummary {
  title: string;

  subtitle?: string;

  items: JourneySummaryItem[];
}

export interface ClinicalSummaryResult {
  summary: JourneySummary;
}

/* ============================================================
 * Consultation
 * ============================================================ */

export interface ConsultationContext {
  consultationId: string;

  consultationDate: string;

  consultationType?: string;

  mode?: string;

  providerId?: string;

  providerName?: string;

  facilityId?: string;

  facilityName?: string;

  specialty?: string;

  sourcePrescriptionId?: string;

  notes?: string;

  confidence?: number;
}

/* ============================================================
 * Actions
 * ============================================================ */

export interface JourneyAction {
  id: string;

  type: JourneyActionType;

  title: string;

  description?: string;

  priority?: "LOW" | "MEDIUM" | "HIGH";

  completed?: boolean;

  dueDate?: string;

  url?: string;

  metadata?: Record<string, unknown>;
}

/* ============================================================
 * Final Analysis
 * ============================================================ */

export interface JourneyAnalysisResult {
  /* ==========================================================
   * Core
   * ========================================================== */

  journey?: Journey;

  context: JourneyContext;

  /* ==========================================================
   * Engine Results (Rich Models)
   * ========================================================== */

  comparison: ComparisonResult;

  treatment: TreatmentDecision;

  timeline: TimelineResult;

  questionResult: QuestionResult;

  clinicalSummary: ClinicalSummaryResult;

  /* ==========================================================
   * UI Compatibility (Flattened Read Model)
   * ========================================================== */

  summary: JourneySummary;

  detectedChanges: DetectedChange[];

  questions: JourneyQuestion[];

  treatmentDecision: TreatmentDecision;

  activeTreatment: ActiveTreatment;

  timelineEvents: TimelineEvent[];

  /* ==========================================================
   * Review
   * ========================================================== */

  confidence: number;

  confidenceLevel?: JourneyConfidence;

  status: JourneyStatus;

  readyToPersist: boolean;

  requiresReview: boolean;

  actions: JourneyAction[];
}
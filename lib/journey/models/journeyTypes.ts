import {
  ComparisonOutcome,
  ConfidenceLevel,
  GovernanceDecision,
  JourneyEdgeType,
  JourneyEventType,
  JourneyNodeType,
  JourneyQuestionType,
  JourneyStatus,
  TimelineDirection,
} from "./journeyEnums";

/* ==========================================================
 * Base
 * ========================================================== */

export interface JourneyIdentifier {
  id: string;
}

export interface JourneyAudit {
  createdAt: string;
  updatedAt: string;
}

export interface JourneyExecutionResult<T> {
  success: boolean;
  data: T;
  warnings: string[];
  errors: string[];
}

/* ==========================================================
 * Graph
 * ========================================================== */

export interface JourneyNodeMetadata {
  patientId?: string;
  consultationId?: string;
  prescriptionId?: string;
  doctorName?: string;
  hospitalName?: string;
  confidence?: number;
  tags: string[];
}

export interface JourneyNode extends JourneyIdentifier {
  type: JourneyNodeType;

  title: string;

  subtitle?: string;

  description?: string;

  eventDate: string;

  status: JourneyStatus;

  metadata: JourneyNodeMetadata;
}

export interface JourneyEdge extends JourneyIdentifier {
  fromNodeId: string;

  toNodeId: string;

  relationship: JourneyEdgeType;

  confidence: ConfidenceLevel;
}

export interface JourneyGraph {
  nodes: JourneyNode[];

  edges: JourneyEdge[];
}

/* ==========================================================
 * Timeline
 * ========================================================== */

export interface JourneyTimelineEvent extends JourneyIdentifier {
  eventType: JourneyEventType;

  title: string;

  description?: string;

  eventDate: string;

  direction: TimelineDirection;

  nodeId?: string;
}

export interface JourneyTimeline {
  events: JourneyTimelineEvent[];
}

/* ==========================================================
 * Comparison
 * ========================================================== */

export interface JourneyComparisonItem {
  entityType: string;

  entityId?: string;

  entityName: string;

  outcome: ComparisonOutcome;

  previousValue?: string;

  currentValue?: string;

  confidence: ConfidenceLevel;

  remarks?: string;
}

export interface JourneyComparison {
  items: JourneyComparisonItem[];

  hasChanges: boolean;
}

/* ==========================================================
 * Questions
 * ========================================================== */

export interface JourneyQuestion {
  id: string;

  type: JourneyQuestionType;

  question: string;

  mandatory: boolean;

  generatedByAI: boolean;
}

export interface JourneyQuestions {
  questions: JourneyQuestion[];

  unresolvedCount: number;
}

/* ==========================================================
 * Summary
 * ========================================================== */

export interface JourneySummary {
  headline: string;

  clinicalSummary: string;

  medicationSummary: string;

  recommendationSummary: string;
}

/* ==========================================================
 * Governance
 * ========================================================== */

export interface JourneyGovernanceResult {
  decision: GovernanceDecision;

  confidence: ConfidenceLevel;

  reasoning: string;

  requiresHumanReview: boolean;
}

/* ==========================================================
 * Builder Contracts
 * ========================================================== */

export interface JourneyBuilderResult<T> {
  success: boolean;

  output: T;

  warnings: string[];

  errors: string[];
}
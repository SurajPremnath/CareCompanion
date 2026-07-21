/**
 * CareVR
 * Clinical Question Intelligence Engine
 * --------------------------------------------------------
 * Domain Types
 */

export type UUID = string;

export type ISODateString = string;

export type QuestionCategory =
  | "DIAGNOSIS_CLARIFICATION"
  | "MEDICATION_ADHERENCE"
  | "MEDICATION_TOLERANCE"
  | "ADVERSE_EFFECT"
  | "SYMPTOM_PROGRESSION"
  | "MISSING_INFORMATION"
  | "INVESTIGATION_FOLLOW_UP"
  | "TREATMENT_COMPLIANCE"
  | "DUPLICATE_UPLOAD"
  | "TIMELINE_GAP"
  | "CAREGIVER_CLARIFICATION"
  | "EMERGENCY_ESCALATION"
  | "AI_CONFIDENCE_VALIDATION"
  | "LIFESTYLE_RECOMMENDATION"
  | "FOLLOW_UP_REMINDER"
  | "MEDICATION_CHANGE"
  | "MEDICATION_DISCONTINUATION"
  | "MEDICATION_ADDITION"
  | "DOSAGE_CHANGE"
  | "FREQUENCY_CHANGE"
  | "DURATION_CHANGE"
  | "CONSULTATION_CLARIFICATION"
  | "PRESCRIPTION_VALIDATION"
  | "INVESTIGATION_RESULT"
  | "OTHER";

export type QuestionPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "INFORMATIONAL";

export type QuestionStatus =
  | "PENDING"
  | "ASKED"
  | "ANSWERED"
  | "DISMISSED"
  | "SKIPPED"
  | "EXPIRED"
  | "CANCELLED";

export type QuestionSeverity =
  | "NONE"
  | "MINOR"
  | "MODERATE"
  | "MAJOR"
  | "SEVERE"
  | "LIFE_THREATENING";

export type QuestionSource =
  | "AI"
  | "TIMELINE_ENGINE"
  | "TREATMENT_ENGINE"
  | "COMPARISON_ENGINE"
  | "MEDICATION_ENGINE"
  | "PRESCRIPTION_ENGINE"
  | "VOICE_ENGINE"
  | "ASSESSMENT_ENGINE"
  | "DAILY_CARE_ENGINE"
  | "USER"
  | "CAREGIVER"
  | "SYSTEM";

export type TargetAudience =
  | "PATIENT"
  | "CAREGIVER"
  | "BOTH"
  | "CLINICIAN"
  | "SYSTEM";

export type TriggerType =
  | "FIRST_CONSULTATION"
  | "FOLLOW_UP_CONSULTATION"
  | "MEDICATION_ADDED"
  | "MEDICATION_STOPPED"
  | "DOSAGE_CHANGED"
  | "FREQUENCY_CHANGED"
  | "DURATION_CHANGED"
  | "INVESTIGATION_ORDERED"
  | "INVESTIGATION_COMPLETED"
  | "VOICE_ANALYSIS"
  | "ASSESSMENT_COMPLETED"
  | "PRESCRIPTION_ANALYSED"
  | "TIMELINE_UPDATED"
  | "CLINICAL_SUMMARY_UPDATED"
  | "AI_LOW_CONFIDENCE"
  | "DUPLICATE_DETECTED"
  | "MANUAL"
  | "OTHER";

export type ConsultationMode =
  | "IN_PERSON"
  | "TELECONSULTATION"
  | "PHONE"
  | "WHATSAPP"
  | "EMAIL"
  | "VIDEO"
  | "HOME_VISIT"
  | "UNKNOWN";

export type EvidenceType =
  | "MEDICATION"
  | "PRESCRIPTION"
  | "TIMELINE_EVENT"
  | "SYMPTOM"
  | "ASSESSMENT"
  | "DAILY_CARE"
  | "VOICE"
  | "IMAGE"
  | "LAB_RESULT"
  | "VITAL"
  | "DIAGNOSIS"
  | "OBSERVATION"
  | "OTHER";

export type QuestionResponseType =
  | "YES_NO"
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "TIME"
  | "SINGLE_SELECT"
  | "MULTI_SELECT"
  | "TEMPERATURE"
  | "BLOOD_PRESSURE"
  | "SPO2"
  | "PULSE"
  | "MEDICATION"
  | "FILE"
  | "VOICE";

export interface ClinicalEvidenceReference {
  readonly id: UUID;
  readonly type: EvidenceType;
  readonly source: QuestionSource;
  readonly referenceId: UUID;
  readonly label: string;
  readonly confidence?: number;
}

export interface TriggerReference {
  readonly id: UUID;
  readonly trigger: TriggerType;
  readonly source: QuestionSource;
  readonly description: string;
  readonly createdAt: ISODateString;
}

export interface TimelineReference {
  readonly timelineId: UUID;
  readonly eventId: UUID;
  readonly eventDate?: ISODateString;
  readonly eventType: string;
}

export interface TreatmentReference {
  readonly treatmentId?: UUID;
  readonly prescriptionId?: UUID;
  readonly medicationId?: UUID;
  readonly consultationId?: UUID;
}

export interface QuestionOption {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly order: number;
  readonly isDefault?: boolean;
}

export interface QuestionCondition {
  readonly field: string;
  readonly operator:
    | "EQUALS"
    | "NOT_EQUALS"
    | "GREATER_THAN"
    | "LESS_THAN"
    | "GREATER_OR_EQUAL"
    | "LESS_OR_EQUAL"
    | "CONTAINS"
    | "NOT_CONTAINS"
    | "EXISTS"
    | "NOT_EXISTS"
    | "IN"
    | "NOT_IN";
  readonly value: unknown;
}

export interface QuestionRule {
  readonly id: UUID;
  readonly name: string;
  readonly description?: string;
  readonly category: QuestionCategory;
  readonly priority: QuestionPriority;
  readonly conditions: readonly QuestionCondition[];
  readonly enabled: boolean;
}

export interface QuestionMetadata {
  readonly createdBy: QuestionSource;
  readonly generatedAt: ISODateString;
  readonly updatedAt?: ISODateString;
  readonly version: number;
  readonly aiModel?: string;
  readonly confidence: number;
  readonly tags: readonly string[];
}

export interface ClinicalQuestion {
  readonly id: UUID;
  readonly patientId: UUID;

  readonly category: QuestionCategory;
  readonly priority: QuestionPriority;
  readonly severity: QuestionSeverity;
  readonly status: QuestionStatus;

  readonly title: string;
  readonly question: string;
  readonly clinicalReason: string;

  readonly responseType: QuestionResponseType;
  readonly options?: readonly QuestionOption[];

  readonly target: TargetAudience;

  readonly consultationMode?: ConsultationMode;

  readonly evidence: readonly ClinicalEvidenceReference[];
  readonly triggers: readonly TriggerReference[];

  readonly timeline?: TimelineReference;
  readonly treatment?: TreatmentReference;

  readonly ruleId?: UUID;

  readonly dueAt?: ISODateString;
  readonly expiresAt?: ISODateString;

  readonly metadata: QuestionMetadata;
}

export interface QuestionAnswer {
  readonly questionId: UUID;
  readonly patientId: UUID;

  readonly answeredBy: TargetAudience;

  readonly answer:
    | string
    | number
    | boolean
    | string[]
    | Record<string, unknown>
    | null;

  readonly notes?: string;

  readonly answeredAt: ISODateString;
}

export interface QuestionGenerationContext {
  readonly patientId: UUID;

  readonly consultationId?: UUID;
  readonly prescriptionId?: UUID;
  readonly timelineEventId?: UUID;

  readonly trigger: TriggerType;
  readonly consultationMode?: ConsultationMode;

  readonly evidence: readonly ClinicalEvidenceReference[];

  readonly comparisonCompleted: boolean;
  readonly treatmentAnalysed: boolean;
  readonly timelineUpdated: boolean;
}

export interface QuestionEvaluationResult {
  readonly shouldAsk: boolean;
  readonly confidence: number;

  readonly questions: readonly ClinicalQuestion[];

  readonly generatedAt: ISODateString;

  readonly reasoning: readonly string[];
}

export interface QuestionSearchCriteria {
  readonly patientId: UUID;
  readonly status?: QuestionStatus;
  readonly category?: QuestionCategory;
  readonly priority?: QuestionPriority;
}

export interface QuestionStatistics {
  readonly total: number;
  readonly pending: number;
  readonly answered: number;
  readonly dismissed: number;
  readonly overdue: number;
}

export interface QuestionEngineConfiguration {
  readonly minimumConfidence: number;
  readonly enableDeduplication: boolean;
  readonly enableTimelineValidation: boolean;
  readonly enableTreatmentValidation: boolean;
  readonly enableEmergencyEscalation: boolean;
  readonly maximumQuestionsPerEvaluation: number;
}
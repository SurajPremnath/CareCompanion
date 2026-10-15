import type {
  ClinicalEvidenceReference,
  ClinicalQuestion,
  ConsultationMode,
  ISODateString,
  QuestionAnswer,
  QuestionCategory,
  QuestionEngineConfiguration,
  QuestionEvaluationResult,
  QuestionMetadata,
  QuestionOption,
  QuestionPriority,
  QuestionResponseType,
  QuestionRule,
  QuestionSearchCriteria,
  QuestionSeverity,
  QuestionStatistics,
  QuestionStatus,
  QuestionGenerationContext,
  TargetAudience,
  TimelineReference,
  TreatmentReference,
  TriggerReference,
  UUID,
} from "./QuestionTypes";

export interface QuestionEntity extends ClinicalQuestion {}

export interface QuestionRecord {
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
  readonly options: readonly QuestionOption[];

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

export interface QuestionCreateRequest {
  readonly patientId: UUID;

  readonly category: QuestionCategory;
  readonly priority: QuestionPriority;
  readonly severity?: QuestionSeverity;

  readonly title: string;
  readonly question: string;
  readonly clinicalReason: string;

  readonly responseType: QuestionResponseType;
  readonly options?: readonly QuestionOption[];

  readonly target: TargetAudience;
  readonly consultationMode?: ConsultationMode;

  readonly evidence?: readonly ClinicalEvidenceReference[];
  readonly triggers?: readonly TriggerReference[];

  readonly timeline?: TimelineReference;
  readonly treatment?: TreatmentReference;

  readonly ruleId?: UUID;

  readonly dueAt?: ISODateString;
  readonly expiresAt?: ISODateString;

  readonly confidence: number;
  readonly tags?: readonly string[];
  readonly source: QuestionMetadata["createdBy"];
}

export interface QuestionUpdateRequest {
  readonly id: UUID;

  readonly status?: QuestionStatus;
  readonly priority?: QuestionPriority;
  readonly severity?: QuestionSeverity;

  readonly title?: string;
  readonly question?: string;
  readonly clinicalReason?: string;

  readonly dueAt?: ISODateString;
  readonly expiresAt?: ISODateString;

  readonly metadata?: Partial<QuestionMetadata>;
}

export interface QuestionAnswerRequest
  extends Omit<QuestionAnswer, "answeredAt"> {
  readonly answeredAt?: ISODateString;
}

export interface QuestionBundle {
  readonly patientId: UUID;
  readonly generatedAt: ISODateString;
  readonly questions: readonly ClinicalQuestion[];
  readonly statistics: QuestionStatistics;
}

export interface QuestionEvaluationRequest {
  readonly context: QuestionGenerationContext;
  readonly rules: readonly QuestionRule[];
}

export interface QuestionEvaluationResponse
  extends QuestionEvaluationResult {}

export interface QuestionRepositoryResult {
  readonly success: boolean;
  readonly question?: ClinicalQuestion;
  readonly questions?: readonly ClinicalQuestion[];
  readonly error?: string;
}

export interface QuestionListResult {
  readonly items: readonly ClinicalQuestion[];
  readonly total: number;
}

export interface QuestionSearchRequest {
  readonly criteria: QuestionSearchCriteria;
  readonly limit?: number;
  readonly offset?: number;
}

export interface QuestionEngineState {
  readonly configuration: QuestionEngineConfiguration;
  readonly initialized: boolean;
  readonly version: string;
}

export interface QuestionAuditEntry {
  readonly id: UUID;
  readonly questionId: UUID;
  readonly patientId: UUID;

  readonly action:
    | "CREATED"
    | "UPDATED"
    | "ANSWERED"
    | "DISMISSED"
    | "EXPIRED"
    | "DELETED";

  readonly performedBy: string;
  readonly timestamp: ISODateString;

  readonly previousState?: Record<string, unknown>;
  readonly currentState?: Record<string, unknown>;
}

export interface QuestionTimelineLink {
  readonly patientId: UUID;
  readonly questionId: UUID;
  readonly timelineEventId: UUID;
  readonly linkedAt: ISODateString;
}

export interface QuestionTreatmentLink {
  readonly patientId: UUID;
  readonly questionId: UUID;
  readonly treatmentId: UUID;
  readonly linkedAt: ISODateString;
}

export interface QuestionEngineDependencies {
  readonly timelineAvailable: boolean;
  readonly comparisonAvailable: boolean;
  readonly treatmentAvailable: boolean;
  readonly medicationAvailable: boolean;
  readonly assessmentAvailable: boolean;
  readonly dailyCareAvailable: boolean;
  readonly prescriptionAvailable: boolean;
  readonly voiceAvailable: boolean;
}

export interface QuestionSummary {
  readonly patientId: UUID;
  readonly totalQuestions: number;
  readonly pendingQuestions: number;
  readonly criticalQuestions: number;
  readonly lastGeneratedAt?: ISODateString;
}
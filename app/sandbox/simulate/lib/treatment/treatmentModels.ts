/* ============================================================================
 * CareVR
 * Treatment Domain
 * ----------------------------------------------------------------------------
 * File        : treatmentModels.ts
 * Description : Immutable domain models for the Treatment bounded context.
 * ----------------------------------------------------------------------------
 * Architecture:
 * - Pure domain models only
 * - No persistence logic
 * - No validation logic
 * - No business rules
 * ========================================================================== */

import type {
  AuditMetadata,
  ConfidenceScore,
  ISODate,
  ISODateTime,
  JsonObject,
  UUID
} from './treatmentTypes';

import {
  ConsultationMode,
  ConsultationSource,
  DiagnosisStatus,
  FollowUpStatus,
  InvestigationStatus,
  DosageUnit,
  MedicineFrequency,
  MedicineForm,
  MedicineInstructionType,
  MedicineRoute,
  MedicineStatus,
  MedicineTiming,
  MedicineType,
  PrnReason,
  ScheduleType,
  TreatmentOutcome,
  TreatmentPriority,
  TreatmentSource,
  TreatmentStatus
} from './treatmentTypes';

/* ============================================================================
 * Common Value Objects
 * ========================================================================== */

export interface ContactInformation {
  readonly phone?: string;
  readonly alternatePhone?: string;
  readonly email?: string;
  readonly website?: string;
}

export interface PostalAddress {
  readonly line1?: string;
  readonly line2?: string;
  readonly landmark?: string;
  readonly area?: string;
  readonly city?: string;
  readonly district?: string;
  readonly state?: string;
  readonly country?: string;
  readonly postalCode?: string;
}

export interface GeoLocation {
  readonly latitude?: number;
  readonly longitude?: number;
}

export interface NameValuePair {
  readonly name: string;
  readonly value: string;
}

/* ============================================================================
 * Doctor
 * ========================================================================== */

export interface DoctorModel {
  readonly id: UUID;

  readonly name: string;

  readonly registrationNumber?: string;

  readonly qualification?: string;

  readonly specialization?: string;

  readonly department?: string;

  readonly hospitalId?: UUID;

  readonly contact?: ContactInformation;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Hospital
 * ========================================================================== */

export interface HospitalModel {
  readonly id: UUID;

  readonly name: string;

  readonly department?: string;

  readonly address?: PostalAddress;

  readonly location?: GeoLocation;

  readonly contact?: ContactInformation;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Diagnosis
 * ========================================================================== */

export interface DiagnosisModel {
  readonly id: UUID;

  readonly diagnosis: string;

  readonly icd10Code?: string;

  readonly snomedCode?: string;

  readonly status: DiagnosisStatus;

  readonly isPrimary: boolean;

  readonly notes?: string;

  readonly confidence?: ConfidenceScore;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Investigation
 * ========================================================================== */

export interface InvestigationModel {
  readonly id: UUID;

  readonly name: string;

  readonly category?: string;

  readonly status: InvestigationStatus;

  readonly advisedDate?: ISODate;

  readonly scheduledDate?: ISODate;

  readonly completedDate?: ISODate;

  readonly reportAvailable: boolean;

  readonly reportReferenceId?: UUID;

  readonly notes?: string;

  readonly confidence?: ConfidenceScore;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Follow-up
 * ========================================================================== */

export interface FollowUpModel {
  readonly id: UUID;

  readonly status: FollowUpStatus;

  readonly followUpDate?: ISODate;

  readonly purpose?: string;

  readonly department?: string;

  readonly doctorId?: UUID;

  readonly hospitalId?: UUID;

  readonly notes?: string;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Consultation Reference
 * Every treatment must trace back to its originating consultation.
 * ========================================================================== */

export interface ConsultationReference {
  readonly consultationId: UUID;

  readonly consultationDate: ISODateTime;

  readonly mode: ConsultationMode;

  readonly source: ConsultationSource;

  readonly doctorId?: UUID;

  readonly hospitalId?: UUID;

  readonly originalDocumentId?: UUID;

  readonly confidence?: ConfidenceScore;
}

/* ============================================================================
 * Medicine Dose
 * ========================================================================== */

export interface MedicineDose {
  readonly amount: number;

  readonly unit: DosageUnit;

  readonly strength?: string;

  readonly concentration?: string;

  readonly notes?: string;
}

/* ============================================================================
 * Medicine Schedule
 * ========================================================================== */

export interface MedicineSchedule {
  readonly id: UUID;

  /**
   * Fixed / PRN / Tapering / Variable / Cyclic
   */
  readonly scheduleType: ScheduleType;

  /**
   * 1-0-1, BID, TID etc.
   */
  readonly frequency: MedicineFrequency;

  /**
   * Morning / After Breakfast / Bedtime etc.
   */
  readonly timings: readonly MedicineTiming[];

  /**
   * Start of this schedule.
   */
  readonly startDate: ISODate;

  /**
   * Optional schedule end.
   */
  readonly endDate?: ISODate;

  /**
   * Useful when duration is prescribed instead of end date.
   */
  readonly durationInDays?: number;

  /**
   * PRN support.
   */
  readonly isPrn: boolean;

  readonly prnReason?: PrnReason;

  /**
   * Structured instructions.
   */
  readonly instructionTypes: readonly MedicineInstructionType[];

  /**
   * Free text from prescription.
   */
  readonly customInstructions?: string;

  /**
   * Future reminder engine.
   */
  readonly reminderEnabled: boolean;

  /**
   * Future reminder schedules.
   */
  readonly reminderTimes?: readonly string[];

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Medicine
 * Canonical medicine entity.
 * ========================================================================== */

export interface MedicineModel {
  readonly id: UUID;

  /**
   * Exactly as written by doctor.
   */
  readonly prescribedName: string;

  /**
   * AI normalized.
   */
  readonly genericName?: string;

  /**
   * AI normalized.
   */
  readonly brandName?: string;

  readonly medicineType: MedicineType;

  readonly form: MedicineForm;

  readonly route: MedicineRoute;

  readonly status: MedicineStatus;

  /**
   * Tablet strength etc.
   */
  readonly dose: MedicineDose;

  /**
   * Multiple schedules supported.
   *
   * Example:
   *  Week1 → 10mg
   *  Week2 → 5mg
   */
  readonly schedules: readonly MedicineSchedule[];

  /**
   * Clinical indication.
   */
  readonly indication?: string;

  /**
   * Original prescription instruction.
   */
  readonly instructions?: string;

  readonly manufacturer?: string;

  readonly batchNumber?: string;

  readonly requiresMonitoring: boolean;

  readonly isHighRisk: boolean;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Treatment Medicine
 *
 * Junction entity.
 *
 * Enables:
 * - versioning
 * - reconciliation
 * - reminder engine
 * - adherence
 * - interaction engine
 * ========================================================================== */

export interface TreatmentMedicineModel {
  readonly id: UUID;

  readonly treatmentId: UUID;

  readonly medicine: MedicineModel;

  /**
   * Preserve doctor's prescription order.
   */
  readonly sequence: number;

  readonly aiExtracted: boolean;

  readonly manuallyAdded: boolean;

  readonly verifiedByUser: boolean;

  readonly verifiedAt?: ISODateTime;

  readonly extractionConfidence?: ConfidenceScore;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}


export interface TreatmentClinicalContext {
  readonly diagnoses: readonly DiagnosisModel[];

  readonly medicines: readonly TreatmentMedicineModel[];

  readonly investigations: readonly InvestigationModel[];

  readonly followUp?: FollowUpModel;
}

/* ============================================================================
 * Treatment Plan
 *
 * Aggregate Root
 * ========================================================================== */

export interface TreatmentPlanModel {
  readonly id: UUID;

  readonly patientId: UUID;

  /**
   * Increment every treatment revision.
   */
  readonly version: number;

  readonly status: TreatmentStatus;

  readonly source: TreatmentSource;

  readonly priority: TreatmentPriority;

  readonly outcome: TreatmentOutcome;

  readonly isActive: boolean;

  /**
   * Previous treatment snapshot.
   */
  readonly previousTreatmentId?: UUID;

  /**
   * Forward reference.
   */
  readonly supersededByTreatmentId?: UUID;

  /**
   * Traceability.
   */
  readonly consultation: ConsultationReference;

  readonly doctor?: DoctorModel;

  readonly hospital?: HospitalModel;

readonly clinicalContext: TreatmentClinicalContext;

  /**
   * Doctor comments.
   */
  readonly treatmentNotes?: string;

  /**
   * AI observations.
   */
  readonly clinicalNotes?: string;

  readonly startDate: ISODate;

  readonly endDate?: ISODate;

  readonly metadata?: JsonObject;

  readonly audit: AuditMetadata;
}

/* ============================================================================
 * Comparison Models
 * ========================================================================== */

import {
  ExtractionStatus,
  MedicineMatchType,
  OperationResult,
  ProcessingStage,
  QuestionPriority,
  QuestionReason,
  ReconciliationStatus,
  TimelineEventType
} from './treatmentTypes';

export interface MedicineComparisonModel {
  readonly medicineId?: UUID;

  readonly previousMedicine?: MedicineModel;

  readonly currentMedicine?: MedicineModel;

  readonly reconciliationStatus: ReconciliationStatus;

  readonly matchType: MedicineMatchType;

  readonly confidence?: ConfidenceScore;

  readonly requiresUserConfirmation: boolean;

  readonly timelineEvent: TimelineEventType;

  readonly summary: string;

  readonly metadata?: JsonObject;
}

export interface TreatmentComparisonModel {
  readonly previousTreatmentId?: UUID;

  readonly currentTreatmentId: UUID;

  readonly medicineComparisons: readonly MedicineComparisonModel[];

  readonly medicinesAdded: readonly MedicineModel[];

  readonly medicinesRemoved: readonly MedicineModel[];

  readonly medicinesModified: readonly MedicineModel[];

  readonly unchangedMedicines: readonly MedicineModel[];

  readonly hasChanges: boolean;

  readonly requiresReview: boolean;

  readonly confidence?: ConfidenceScore;

  readonly metadata?: JsonObject;
}

/* ============================================================================
 * AI Follow-up Questions
 * ========================================================================== */

export interface FollowUpQuestionModel {
  readonly id: UUID;

  readonly priority: QuestionPriority;

  readonly reason: QuestionReason;

  readonly question: string;

  readonly targetMedicineId?: UUID;

  readonly required: boolean;

  readonly answered: boolean;

  readonly answer?: string;

  readonly metadata?: JsonObject;
}

/* ============================================================================
 * Consultation Summary
 * ========================================================================== */

export interface ConsultationSummaryModel {
  readonly consultationId: UUID;

  readonly consultationDate: ISODateTime;

  readonly consultationMode: ConsultationMode;

  readonly doctorName?: string;

  readonly hospitalName?: string;

  readonly diagnosisSummary: readonly string[];

  readonly medicineSummary: readonly string[];

  readonly investigationSummary: readonly string[];

  readonly followUpSummary?: string;

  readonly narrative: string;

  readonly confidence?: ConfidenceScore;
}

/* ============================================================================
 * Treatment Summary
 * ========================================================================== */

export interface TreatmentSummaryModel {
  readonly treatmentId: UUID;

  readonly patientId: UUID;

  readonly version: number;

  readonly activeMedicineCount: number;

  readonly medicinesAdded: number;

  readonly medicinesRemoved: number;

  readonly medicinesModified: number;

  readonly hasCriticalChanges: boolean;

  readonly followUpRequired: boolean;

  readonly summary: string;

  readonly confidence?: ConfidenceScore;
}

/* ============================================================================
 * Treatment Review
 * ========================================================================== */

export interface TreatmentReviewModel {
  readonly treatment: TreatmentPlanModel;

  readonly comparison?: TreatmentComparisonModel;

  readonly consultation: ConsultationSummaryModel;

  readonly followUpQuestions: readonly FollowUpQuestionModel[];

  readonly summary: TreatmentSummaryModel;

  readonly readyForActivation: boolean;

  readonly metadata?: JsonObject;
}

/* ============================================================================
 * Prescription Extraction
 * ========================================================================== */

export interface PrescriptionExtractionModel {
  readonly extractionId: UUID;

  readonly sourceDocumentId: UUID;

  readonly status: ExtractionStatus;

  readonly processingStage: ProcessingStage;

  readonly extractedDoctor?: DoctorModel;

  readonly extractedHospital?: HospitalModel;

  readonly extractedDiagnoses: readonly DiagnosisModel[];

  readonly extractedMedicines: readonly MedicineModel[];

  readonly extractedInvestigations: readonly InvestigationModel[];

  readonly extractedFollowUp?: FollowUpModel;

  readonly rawText?: string;

  readonly confidence?: ConfidenceScore;

  readonly metadata?: JsonObject;
}

/* ============================================================================
 * Treatment Processing Result
 * ========================================================================== */

export interface TreatmentProcessingResultModel {
  readonly operationResult: OperationResult;

  readonly treatment?: TreatmentPlanModel;

  readonly comparison?: TreatmentComparisonModel;

  readonly review?: TreatmentReviewModel;

  readonly extraction?: PrescriptionExtractionModel;

  readonly timelineEvents: readonly TimelineEventType[];

  readonly warnings: readonly string[];

  readonly errors: readonly string[];

  readonly processingTimeMs: number;
}

/* ============================================================================
 * Aggregate Root
 * ========================================================================== */

export interface TreatmentAggregateModel {
  readonly activeTreatment?: TreatmentPlanModel;

  readonly archivedTreatments: readonly TreatmentPlanModel[];

  readonly latestComparison?: TreatmentComparisonModel;

  readonly latestSummary?: TreatmentSummaryModel;

  readonly lastUpdated: ISODateTime;
}

/* ============================================================================
 * Readonly Utility Types
 * ========================================================================== */

export type ReadonlyTreatmentPlan = Readonly<TreatmentPlanModel>;
export type ReadonlyTreatmentMedicine = Readonly<TreatmentMedicineModel>;
export type ReadonlyMedicine = Readonly<MedicineModel>;
export type ReadonlyTreatmentComparison = Readonly<TreatmentComparisonModel>;
export type ReadonlyTreatmentReview = Readonly<TreatmentReviewModel>;
export type ReadonlyTreatmentAggregate = Readonly<TreatmentAggregateModel>;

/* ============================================================================
 * File Complete
 * ========================================================================== */
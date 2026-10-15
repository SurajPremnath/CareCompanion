/* ============================================================================
 * CareVR
 * Treatment Domain
 * ----------------------------------------------------------------------------
 * File        : treatmentValidation.ts
 * Description : Validation framework for the Treatment domain.
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * • Structural validation
 * • Field validation
 * • Collection validation
 * • Cross-object validation helpers
 * • Immutable validation results
 *
 * NOTE
 * ----------------------------------------------------------------------------
 * Business rules belong in treatmentRules.ts
 * ========================================================================== */

import type {
  DiagnosisModel,
  FollowUpModel,
  InvestigationModel,
  MedicineDose,
  MedicineModel,
  MedicineSchedule,
  TreatmentClinicalContext,
  TreatmentComparisonModel,
  TreatmentPlanModel
} from './treatmentModels';

/* ============================================================================
 * Validation Limits
 * ========================================================================== */

export const VALIDATION_LIMITS = Object.freeze({

  MEDICINE_NAME_MAX_LENGTH: 200,

  GENERIC_NAME_MAX_LENGTH: 200,

  BRAND_NAME_MAX_LENGTH: 200,

  DIAGNOSIS_MAX_LENGTH: 500,

  NOTES_MAX_LENGTH: 5000,

  CUSTOM_INSTRUCTION_MAX_LENGTH: 1000,

  MAX_MEDICINES_PER_TREATMENT: 100,

  MAX_DIAGNOSES_PER_TREATMENT: 25,

  MAX_INVESTIGATIONS_PER_TREATMENT: 100,

  MAX_SCHEDULES_PER_MEDICINE: 20,

  MAX_TIMINGS_PER_SCHEDULE: 12,

  MAX_REMINDER_TIMES: 12

} as const);

/* ============================================================================
 * Validation Error Codes
 * ========================================================================== */

export enum ValidationErrorCode {

  REQUIRED = 'REQUIRED',

  INVALID_VALUE = 'INVALID_VALUE',

  INVALID_FORMAT = 'INVALID_FORMAT',

  INVALID_RANGE = 'INVALID_RANGE',

  INVALID_DATE = 'INVALID_DATE',

  INVALID_UUID = 'INVALID_UUID',

  INVALID_ENUM = 'INVALID_ENUM',

  DUPLICATE = 'DUPLICATE',

  CONFLICT = 'CONFLICT',

  EXCEEDS_LIMIT = 'EXCEEDS_LIMIT',

  INVALID_STATE = 'INVALID_STATE',

  BUSINESS_CONSTRAINT = 'BUSINESS_CONSTRAINT',

  MISSING_DEPENDENCY = 'MISSING_DEPENDENCY'
}

/* ============================================================================
 * Validation Severity
 * ========================================================================== */

export enum ValidationSeverity {

  ERROR = 'ERROR',

  WARNING = 'WARNING',

  INFO = 'INFO'
}

/* ============================================================================
 * Validation Models
 * ========================================================================== */

export interface ValidationIssue {

  readonly code: ValidationErrorCode;

  readonly severity: ValidationSeverity;

  readonly field: string;

  readonly message: string;

  readonly value?: unknown;
}

export interface ValidationResult {

  readonly valid: boolean;

  readonly errors: readonly ValidationIssue[];

  readonly warnings: readonly ValidationIssue[];
}

/* ============================================================================
 * Validation Builders
 * ========================================================================== */

const EMPTY_RESULT: ValidationResult = Object.freeze({

  valid: true,

  errors: Object.freeze([]),

  warnings: Object.freeze([])

});

function createIssue(
  severity: ValidationSeverity,
  field: string,
  code: ValidationErrorCode,
  message: string,
  value?: unknown
): ValidationIssue {

  return Object.freeze({

    severity,

    field,

    code,

    message,

    value

  });

}

function createError(
  field: string,
  code: ValidationErrorCode,
  message: string,
  value?: unknown
): ValidationIssue {

  return createIssue(
    ValidationSeverity.ERROR,
    field,
    code,
    message,
    value
  );

}

function createWarning(
  field: string,
  code: ValidationErrorCode,
  message: string,
  value?: unknown
): ValidationIssue {

  return createIssue(
    ValidationSeverity.WARNING,
    field,
    code,
    message,
    value
  );

}

function createResult(
  errors: ValidationIssue[],
  warnings: ValidationIssue[] = []
): ValidationResult {

  return Object.freeze({

    valid: errors.length === 0,

    errors: Object.freeze([...errors]),

    warnings: Object.freeze([...warnings])

  });

}

/* ============================================================================
 * Primitive Validators
 * ========================================================================== */

function isBlank(value?: string | null): boolean {

  return value == null || value.trim().length === 0;

}

function exceedsLength(
  value: string | undefined,
  maxLength: number
): boolean {

  return !!value && value.length > maxLength;

}

function isPositive(
  value?: number
): boolean {

  return value !== undefined && value > 0;

}

function isNonNegative(
  value?: number
): boolean {

  return value !== undefined && value >= 0;

}

function isValidDate(
  value?: string
): boolean {

  if (!value) {

    return false;

  }

  return !Number.isNaN(Date.parse(value));

}

function isDefined<T>(
  value: T | null | undefined
): value is T {

  return value !== undefined && value !== null;

}

/* ============================================================================
 * Internal Helpers
 * ========================================================================== */

function mergeResults(
  ...results: readonly ValidationResult[]
): ValidationResult {

  const errors: ValidationIssue[] = [];

  const warnings: ValidationIssue[] = [];

  for (const result of results) {

    errors.push(...result.errors);

    warnings.push(...result.warnings);

  }

  return createResult(errors, warnings);

}

/* ============================================================================
 * Primitive Model Validators
 * ========================================================================== */

function validateMedicineDose(
  dose: MedicineDose
): ValidationResult {

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!isPositive(dose.amount)) {
    errors.push(
      createError(
        'dose.amount',
        ValidationErrorCode.INVALID_RANGE,
        'Dose amount must be greater than zero.',
        dose.amount
      )
    );
  }

  if (!dose.unit) {
    errors.push(
      createError(
        'dose.unit',
        ValidationErrorCode.REQUIRED,
        'Dose unit is required.'
      )
    );
  }

  if (
    exceedsLength(
      dose.strength,
      VALIDATION_LIMITS.GENERIC_NAME_MAX_LENGTH
    )
  ) {
    warnings.push(
      createWarning(
        'dose.strength',
        ValidationErrorCode.EXCEEDS_LIMIT,
        'Strength exceeds recommended length.'
      )
    );
  }

  return createResult(errors, warnings);

}

/* ============================================================================
 * Medicine Schedule Validation
 * ========================================================================== */

function validateMedicineSchedule(
  schedule: MedicineSchedule
): ValidationResult {

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!schedule.id) {
    errors.push(
      createError(
        'schedule.id',
        ValidationErrorCode.REQUIRED,
        'Schedule identifier is required.'
      )
    );
  }

  if (!isValidDate(schedule.startDate)) {
    errors.push(
      createError(
        'schedule.startDate',
        ValidationErrorCode.INVALID_DATE,
        'Invalid schedule start date.'
      )
    );
  }

  if (
    schedule.endDate &&
    !isValidDate(schedule.endDate)
  ) {
    errors.push(
      createError(
        'schedule.endDate',
        ValidationErrorCode.INVALID_DATE,
        'Invalid schedule end date.'
      )
    );
  }

  if (
    isDefined(schedule.durationInDays) &&
    schedule.durationInDays <= 0
  ) {
    errors.push(
      createError(
        'schedule.durationInDays',
        ValidationErrorCode.INVALID_RANGE,
        'Duration must be greater than zero.'
      )
    );
  }

  if (
    schedule.timings.length >
    VALIDATION_LIMITS.MAX_TIMINGS_PER_SCHEDULE
  ) {
    errors.push(
      createError(
        'schedule.timings',
        ValidationErrorCode.EXCEEDS_LIMIT,
        `Maximum ${VALIDATION_LIMITS.MAX_TIMINGS_PER_SCHEDULE} timings allowed.`
      )
    );
  }

  if (
    schedule.reminderTimes &&
    schedule.reminderTimes.length >
      VALIDATION_LIMITS.MAX_REMINDER_TIMES
  ) {
    errors.push(
      createError(
        'schedule.reminderTimes',
        ValidationErrorCode.EXCEEDS_LIMIT,
        `Maximum ${VALIDATION_LIMITS.MAX_REMINDER_TIMES} reminder times allowed.`
      )
    );
  }

  return createResult(errors, warnings);

}

/* ============================================================================
 * Medicine Validation
 * ========================================================================== */

function validateMedicine(
  medicine: MedicineModel
): ValidationResult {

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (isBlank(medicine.prescribedName)) {
    errors.push(
      createError(
        'prescribedName',
        ValidationErrorCode.REQUIRED,
        'Medicine name is required.'
      )
    );
  }

  if (
    exceedsLength(
      medicine.prescribedName,
      VALIDATION_LIMITS.MEDICINE_NAME_MAX_LENGTH
    )
  ) {
    errors.push(
      createError(
        'prescribedName',
        ValidationErrorCode.EXCEEDS_LIMIT,
        `Medicine name exceeds ${VALIDATION_LIMITS.MEDICINE_NAME_MAX_LENGTH} characters.`
      )
    );
  }

  if (
    medicine.schedules.length === 0
  ) {
    errors.push(
      createError(
        'schedules',
        ValidationErrorCode.REQUIRED,
        'At least one medicine schedule is required.'
      )
    );
  }

  if (
    medicine.schedules.length >
    VALIDATION_LIMITS.MAX_SCHEDULES_PER_MEDICINE
  ) {
    errors.push(
      createError(
        'schedules',
        ValidationErrorCode.EXCEEDS_LIMIT,
        `Maximum ${VALIDATION_LIMITS.MAX_SCHEDULES_PER_MEDICINE} schedules allowed.`
      )
    );
  }

  const doseResult = validateMedicineDose(
    medicine.dose
  );

  errors.push(...doseResult.errors);
  warnings.push(...doseResult.warnings);

  for (const schedule of medicine.schedules) {

    const scheduleResult =
      validateMedicineSchedule(schedule);

    errors.push(...scheduleResult.errors);
    warnings.push(...scheduleResult.warnings);

  }

  return createResult(errors, warnings);

}

/* ============================================================================
 * Diagnosis Validation
 * ========================================================================== */

function validateDiagnosis(
  diagnosis: DiagnosisModel
): ValidationResult {

  const errors: ValidationIssue[] = [];

  if (isBlank(diagnosis.diagnosis)) {
    errors.push(
      createError(
        'diagnosis',
        ValidationErrorCode.REQUIRED,
        'Diagnosis is required.'
      )
    );
  }

  if (
    exceedsLength(
      diagnosis.diagnosis,
      VALIDATION_LIMITS.DIAGNOSIS_MAX_LENGTH
    )
  ) {
    errors.push(
      createError(
        'diagnosis',
        ValidationErrorCode.EXCEEDS_LIMIT,
        `Diagnosis exceeds ${VALIDATION_LIMITS.DIAGNOSIS_MAX_LENGTH} characters.`
      )
    );
  }

  return createResult(errors);

}

/* ============================================================================
 * Investigation Validation
 * ========================================================================== */

function validateInvestigation(
  investigation: InvestigationModel
): ValidationResult {

  const errors: ValidationIssue[] = [];

  if (isBlank(investigation.name)) {
    errors.push(
      createError(
        'name',
        ValidationErrorCode.REQUIRED,
        'Investigation name is required.'
      )
    );
  }

  if (
    investigation.advisedDate &&
    !isValidDate(investigation.advisedDate)
  ) {
    errors.push(
      createError(
        'advisedDate',
        ValidationErrorCode.INVALID_DATE,
        'Invalid advised date.'
      )
    );
  }

  if (
    investigation.scheduledDate &&
    !isValidDate(investigation.scheduledDate)
  ) {
    errors.push(
      createError(
        'scheduledDate',
        ValidationErrorCode.INVALID_DATE,
        'Invalid scheduled date.'
      )
    );
  }

  if (
    investigation.completedDate &&
    !isValidDate(investigation.completedDate)
  ) {
    errors.push(
      createError(
        'completedDate',
        ValidationErrorCode.INVALID_DATE,
        'Invalid completed date.'
      )
    );
  }

  return createResult(errors);

}

/* ============================================================================
 * Follow-up Validation
 * ========================================================================== */

function validateFollowUp(
  followUp: FollowUpModel
): ValidationResult {

  const errors: ValidationIssue[] = [];

  if (
    followUp.followUpDate &&
    !isValidDate(followUp.followUpDate)
  ) {
    errors.push(
      createError(
        'followUpDate',
        ValidationErrorCode.INVALID_DATE,
        'Invalid follow-up date.'
      )
    );
  }

  return createResult(errors);

}

/* ============================================================================
 * Treatment Clinical Context Validation
 * ========================================================================== */

function validateTreatmentClinicalContext(
  context: TreatmentClinicalContext
): ValidationResult {

  const results: ValidationResult[] = [];

  if (
    context.medicines.length >
    VALIDATION_LIMITS.MAX_MEDICINES_PER_TREATMENT
  ) {
    results.push(
      createResult([
        createError(
          'clinicalContext.medicines',
          ValidationErrorCode.EXCEEDS_LIMIT,
          `Maximum ${VALIDATION_LIMITS.MAX_MEDICINES_PER_TREATMENT} medicines allowed.`
        )
      ])
    );
  }

  if (
    context.diagnoses.length >
    VALIDATION_LIMITS.MAX_DIAGNOSES_PER_TREATMENT
  ) {
    results.push(
      createResult([
        createError(
          'clinicalContext.diagnoses',
          ValidationErrorCode.EXCEEDS_LIMIT,
          `Maximum ${VALIDATION_LIMITS.MAX_DIAGNOSES_PER_TREATMENT} diagnoses allowed.`
        )
      ])
    );
  }

  if (
    context.investigations.length >
    VALIDATION_LIMITS.MAX_INVESTIGATIONS_PER_TREATMENT
  ) {
    results.push(
      createResult([
        createError(
          'clinicalContext.investigations',
          ValidationErrorCode.EXCEEDS_LIMIT,
          `Maximum ${VALIDATION_LIMITS.MAX_INVESTIGATIONS_PER_TREATMENT} investigations allowed.`
        )
      ])
    );
  }

  for (const medicine of context.medicines) {
    results.push(validateMedicine(medicine.medicine));
  }

  for (const diagnosis of context.diagnoses) {
    results.push(validateDiagnosis(diagnosis));
  }

  for (const investigation of context.investigations) {
    results.push(validateInvestigation(investigation));
  }

  if (context.followUp) {
    results.push(validateFollowUp(context.followUp));
  }

  return mergeResults(...results);

}

/* ============================================================================
 * Treatment Plan Validation
 * ========================================================================== */

function validateTreatmentPlan(
  treatment: TreatmentPlanModel
): ValidationResult {

  const results: ValidationResult[] = [];

  if (!treatment.id) {
    results.push(
      createResult([
        createError(
          'id',
          ValidationErrorCode.REQUIRED,
          'Treatment identifier is required.'
        )
      ])
    );
  }

  if (!treatment.patientId) {
    results.push(
      createResult([
        createError(
          'patientId',
          ValidationErrorCode.REQUIRED,
          'Patient identifier is required.'
        )
      ])
    );
  }

  if (!isPositive(treatment.version)) {
    results.push(
      createResult([
        createError(
          'version',
          ValidationErrorCode.INVALID_RANGE,
          'Treatment version must be greater than zero.'
        )
      ])
    );
  }

  if (!isValidDate(treatment.startDate)) {
    results.push(
      createResult([
        createError(
          'startDate',
          ValidationErrorCode.INVALID_DATE,
          'Invalid treatment start date.'
        )
      ])
    );
  }

  if (
    treatment.endDate &&
    !isValidDate(treatment.endDate)
  ) {
    results.push(
      createResult([
        createError(
          'endDate',
          ValidationErrorCode.INVALID_DATE,
          'Invalid treatment end date.'
        )
      ])
    );
  }

  results.push(
    validateTreatmentClinicalContext(
      treatment.clinicalContext
    )
  );

  return mergeResults(...results);

}

/* ============================================================================
 * Treatment Comparison Validation
 * ========================================================================== */

function validateTreatmentComparison(
  comparison: TreatmentComparisonModel
): ValidationResult {

  const errors: ValidationIssue[] = [];

  if (!comparison.currentTreatmentId) {
    errors.push(
      createError(
        'currentTreatmentId',
        ValidationErrorCode.REQUIRED,
        'Current treatment identifier is required.'
      )
    );
  }

  return createResult(errors);

}

/* ============================================================================
 * Collection Validation
 * ========================================================================== */

function validateTreatmentPlans(
  treatments: readonly TreatmentPlanModel[]
): ValidationResult {

  return mergeResults(
    ...treatments.map(validateTreatmentPlan)
  );

}

/* ============================================================================
 * Public API
 * ========================================================================== */

export const TreatmentValidator = Object.freeze({

  validateMedicineDose,

  validateMedicineSchedule,

  validateMedicine,

  validateDiagnosis,

  validateInvestigation,

  validateFollowUp,

  validateTreatmentClinicalContext,

  validateTreatmentPlan,

  validateTreatmentComparison,

  validateTreatmentPlans

});

/* ============================================================================
 * File Complete
 * ========================================================================== */
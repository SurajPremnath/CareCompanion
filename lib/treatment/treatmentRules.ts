/* ============================================================================
 * CareVR
 * Treatment Domain
 * ----------------------------------------------------------------------------
 * File        : treatmentRules.ts
 * Description : Business rule engine for Treatment Management.
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * • Treatment lifecycle decisions
 * • Prescription business rules
 * • Medicine reconciliation rules
 * • Timeline decision rules
 * • Follow-up decision rules
 * • Treatment activation decisions
 *
 * NOTE
 * ----------------------------------------------------------------------------
 * Structural validation belongs in treatmentValidation.ts
 * Persistence belongs in repositories.
 * ========================================================================== */

import type {
  MedicineModel,
  TreatmentClinicalContext,
  TreatmentComparisonModel,
  TreatmentPlanModel
} from './treatmentModels';

import {
  TreatmentStatus,
  TreatmentChangeType,
  MedicineStatus,
  FollowUpStatus
} from './treatmentTypes';

/* ============================================================================
 * Business Constants
 * ========================================================================== */

const BUSINESS_LIMITS = Object.freeze({

  MAX_ACTIVE_TREATMENTS: 1,

  MAX_MEDICINES_PER_PLAN: 100,

  MAX_DIAGNOSES_PER_PLAN: 25,

  MAX_INVESTIGATIONS_PER_PLAN: 100,

  FOLLOWUP_OVERDUE_DAYS: 7

});

/* ============================================================================
 * Rule Severity
 * ========================================================================== */

enum RuleSeverity {

  INFO = 'INFO',

  WARNING = 'WARNING',

  ERROR = 'ERROR'

}

/* ============================================================================
 * Rule Action
 * ========================================================================== */

enum RuleActionType {

  NONE = 'NONE',

  ACTIVATE_TREATMENT = 'ACTIVATE_TREATMENT',

  ARCHIVE_TREATMENT = 'ARCHIVE_TREATMENT',

  COMPLETE_TREATMENT = 'COMPLETE_TREATMENT',

  DISCONTINUE_TREATMENT = 'DISCONTINUE_TREATMENT',

  CREATE_TIMELINE_EVENT = 'CREATE_TIMELINE_EVENT',

  CREATE_FOLLOWUP = 'CREATE_FOLLOWUP',

  CREATE_RECONCILIATION = 'CREATE_RECONCILIATION',

  UPDATE_MEDICATION = 'UPDATE_MEDICATION'

}

/* ============================================================================
 * Internal Rule Contracts
 * ========================================================================== */

interface RuleViolation {

  readonly code: string;

  readonly field: string;

  readonly severity: RuleSeverity;

  readonly message: string;

}

interface RuleWarning {

  readonly field: string;

  readonly message: string;

}

interface RuleAction {

  readonly type: RuleActionType;

  readonly payload?: Readonly<Record<string, unknown>>;

}

interface RuleResult {

  readonly allowed: boolean;

  readonly violations: readonly RuleViolation[];

  readonly warnings: readonly RuleWarning[];

  readonly actions: readonly RuleAction[];

}

/* ============================================================================
 * Rule Builders
 * ========================================================================== */

const EMPTY_RULE_RESULT: RuleResult = Object.freeze({

  allowed: true,

  violations: Object.freeze([]),

  warnings: Object.freeze([]),

  actions: Object.freeze([])

});

function violation(

  code: string,

  field: string,

  message: string,

  severity: RuleSeverity = RuleSeverity.ERROR

): RuleViolation {

  return Object.freeze({

    code,

    field,

    message,

    severity

  });

}

function warning(

  field: string,

  message: string

): RuleWarning {

  return Object.freeze({

    field,

    message

  });

}

function action(

  type: RuleActionType,

  payload?: Readonly<Record<string, unknown>>

): RuleAction {

  return Object.freeze({

    type,

    payload

  });

}

function ruleResult(

  violations: RuleViolation[] = [],

  warnings: RuleWarning[] = [],

  actions: RuleAction[] = []

): RuleResult {

  return Object.freeze({

    allowed: violations.length === 0,

    violations: Object.freeze([...violations]),

    warnings: Object.freeze([...warnings]),

    actions: Object.freeze([...actions])

  });

}

/* ============================================================================
 * Rule Utilities
 * ========================================================================== */

function mergeRuleResults(

  ...results: readonly RuleResult[]

): RuleResult {

  const violations: RuleViolation[] = [];

  const warnings: RuleWarning[] = [];

  const actions: RuleAction[] = [];

  let allowed = true;

  for (const result of results) {

    if (!result.allowed) {

      allowed = false;

    }

    violations.push(...result.violations);

    warnings.push(...result.warnings);

    actions.push(...result.actions);

  }

  return Object.freeze({

    allowed,

    violations: Object.freeze(violations),

    warnings: Object.freeze(warnings),

    actions: Object.freeze(actions)

  });

}

function hasActiveTreatment(

  treatments: readonly TreatmentPlanModel[]

): boolean {

  return treatments.some(

    treatment => treatment.status === TreatmentStatus.ACTIVE

  );

}

function getActiveTreatment(

  treatments: readonly TreatmentPlanModel[]

): TreatmentPlanModel | undefined {

  return treatments.find(

    treatment => treatment.status === TreatmentStatus.ACTIVE

  );

}

function medicineExists(

  context: TreatmentClinicalContext,

  medicineName: string

): boolean {

  const search = medicineName.trim().toLowerCase();

  return context.medicines.some(

    medicine =>
      medicine.medicine.prescribedName.trim().toLowerCase() === search

  );

}

function isTreatmentCompleted(

  treatment: TreatmentPlanModel

): boolean {

  return treatment.status === TreatmentStatus.COMPLETED;

}

function isTreatmentArchived(

  treatment: TreatmentPlanModel

): boolean {

  return treatment.status === TreatmentStatus.ARCHIVED;

}

/* ============================================================================
 * Part 2A
 * Treatment Lifecycle Rules
 * ========================================================================== */

function evaluateSingleActiveTreatment(
  existingTreatments: readonly TreatmentPlanModel[],
  incomingTreatment: TreatmentPlanModel
): RuleResult {

  const activeTreatments = existingTreatments.filter(
    treatment =>
      treatment.isActive &&
      treatment.status === TreatmentStatus.ACTIVE &&
      treatment.id !== incomingTreatment.id
  );

  if (activeTreatments.length === 0) {
    return EMPTY_RULE_RESULT;
  }

  const actions: RuleAction[] = [];

  for (const treatment of activeTreatments) {

    actions.push(
      action(
        RuleActionType.SUPERSEDE_TREATMENT,
        Object.freeze({
          treatmentId: treatment.id
        })
      )
    );

  }

  
  return ruleResult([], [], actions);

}

/* ============================================================================
 * Version Rules
 * ========================================================================== */

function evaluateVersionIncrement(
  previousTreatment: TreatmentPlanModel | undefined,
  incomingTreatment: TreatmentPlanModel
): RuleResult {

  if (!previousTreatment) {
    return EMPTY_RULE_RESULT;
  }

  const violations: RuleViolation[] = [];

  if (
    incomingTreatment.version <= previousTreatment.version
  ) {

    violations.push(
      violation(
        'INVALID_VERSION',
        'version',
        'Treatment version must be greater than previous version.'
      )
    );

  }

  return ruleResult(violations);

}

/* ============================================================================
 * Treatment Activation
 * ========================================================================== */

function evaluateTreatmentActivation(
  existingTreatments: readonly TreatmentPlanModel[],
  incomingTreatment: TreatmentPlanModel
): RuleResult {

  const results: RuleResult[] = [];

  if (incomingTreatment.status !== TreatmentStatus.ACTIVE) {

    return EMPTY_RULE_RESULT;

  }

  results.push(

    evaluateSingleActiveTreatment(
      existingTreatments,
      incomingTreatment
    )

  );

  const previousTreatment = existingTreatments.find(

    treatment =>
      treatment.id === incomingTreatment.previousTreatmentId

  );

  results.push(

    evaluateVersionIncrement(
      previousTreatment,
      incomingTreatment
    )

  );

  const activeTreatment = getActiveTreatment(
    existingTreatments
  );

  if (
    activeTreatment &&
    activeTreatment.id !== incomingTreatment.id
  ) {

    results.push(

      ruleResult(
        [],
        [
          warning(
            'status',
            'Incoming treatment will replace currently active treatment.'
          )
        ],
        [
          action(
            RuleActionType.ARCHIVE_TREATMENT,
            Object.freeze({
              treatmentId: activeTreatment.id
            })
          ),
          action(
            RuleActionType.ACTIVATE_TREATMENT,
            Object.freeze({
              treatmentId: incomingTreatment.id
            })
          )
        ]
      )

    );

  }
  else {

    results.push(

      ruleResult(
        [],
        [],
        [
          action(
            RuleActionType.ACTIVATE_TREATMENT,
            Object.freeze({
              treatmentId: incomingTreatment.id
            })
          )
        ]
      )

    );

  }

  return mergeRuleResults(...results);

}

/* ============================================================================
 * Treatment Replacement Rules
 * ========================================================================== */

function evaluateTreatmentReplacement(
  previousTreatment: TreatmentPlanModel | undefined,
  incomingTreatment: TreatmentPlanModel
): RuleResult {

  if (!previousTreatment) {
    return EMPTY_RULE_RESULT;
  }

  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];
  const actions: RuleAction[] = [];

  if (!previousTreatment.isActive) {

    warnings.push(
      warning(
        'previousTreatmentId',
        'Referenced previous treatment is not active.'
      )
    );

  }

  if (
    previousTreatment.patientId !== incomingTreatment.patientId
  ) {

    violations.push(
      violation(
        'PATIENT_MISMATCH',
        'patientId',
        'Replacement treatment must belong to the same patient.'
      )
    );

  }

  if (
    previousTreatment.id === incomingTreatment.id
  ) {

    violations.push(
      violation(
        'SELF_REFERENCE',
        'id',
        'Treatment cannot replace itself.'
      )
    );

  }

  actions.push(
action(
    RuleActionType.SUPERSEDE_TREATMENT,
    Object.freeze({
        treatmentId: previousTreatment.id,
        supersededByTreatmentId: incomingTreatment.id
    })
)
  );

  actions.push(
    action(
      RuleActionType.ACTIVATE_TREATMENT,
      Object.freeze({
        treatmentId: incomingTreatment.id
      })
    )
  );

  actions.push(
    action(
      RuleActionType.CREATE_TIMELINE_EVENT,
      Object.freeze({
        changeType: TreatmentChangeType.MODIFIED,
        previousTreatmentId: previousTreatment.id,
        currentTreatmentId: incomingTreatment.id
      })
    )
  );

  return ruleResult(
    violations,
    warnings,
    actions
  );

}

/* ============================================================================
 * Treatment Supersession Rules
 * ========================================================================== */

function evaluateTreatmentSupersession(
  previousTreatment: TreatmentPlanModel | undefined,
  incomingTreatment: TreatmentPlanModel
): RuleResult {

  if (!previousTreatment) {
    return EMPTY_RULE_RESULT;
  }

  const violations: RuleViolation[] = [];
  const actions: RuleAction[] = [];

  if (
    incomingTreatment.previousTreatmentId !==
    previousTreatment.id
  ) {

    violations.push(
      violation(
        'INVALID_PREVIOUS_REFERENCE',
        'previousTreatmentId',
        'Incoming treatment does not reference the expected previous treatment.'
      )
    );

  }

  actions.push(
action(
    RuleActionType.SUPERSEDE_TREATMENT,
    Object.freeze({
        treatmentId: previousTreatment.id,
        supersededByTreatmentId: incomingTreatment.id
    })
)
  );

  return ruleResult(
    violations,
    [],
    actions
  );

}

/* ============================================================================
 * Treatment Archival Rules
 * ========================================================================== */

function evaluateTreatmentArchival(
  treatment: TreatmentPlanModel
): RuleResult {

if (treatment.status !== TreatmentStatus.ARCHIVED) {
    return EMPTY_RULE_RESULT;
}

  const actions: RuleAction[] = [];

  actions.push(
    action(
      RuleActionType.ARCHIVE_TREATMENT,
      Object.freeze({
        treatmentId: treatment.id
      })
    )
  );

  actions.push(
    action(
      RuleActionType.CREATE_TIMELINE_EVENT,
      Object.freeze({
        treatmentId: treatment.id,
        changeType: TreatmentChangeType.ARCHIVED
      })
    )
  );

  return ruleResult(
    [],
    [],
    actions
  );

}

/* ============================================================================
 * Part 2C
 * Treatment Completion / Discontinuation / Reactivation Rules
 * ========================================================================== */

function evaluateTreatmentCompletion(
  treatment: TreatmentPlanModel
): RuleResult {

  if (treatment.status !== TreatmentStatus.COMPLETED) {
    return EMPTY_RULE_RESULT;
  }

  const violations: RuleViolation[] = [];
  const actions: RuleAction[] = [];

  if (treatment.isActive) {

    violations.push(
      violation(
        'ACTIVE_COMPLETED_TREATMENT',
        'isActive',
        'Completed treatment cannot remain active.'
      )
    );

  }

  actions.push(
    action(
      RuleActionType.COMPLETE_TREATMENT,
      Object.freeze({
        treatmentId: treatment.id
      })
    )
  );

  actions.push(
    action(
      RuleActionType.CREATE_TIMELINE_EVENT,
      Object.freeze({
        treatmentId: treatment.id,
        changeType: TreatmentChangeType.COMPLETED
      })
    )
  );

  return ruleResult(
    violations,
    [],
    actions
  );

}

/* ============================================================================
 * Treatment Discontinuation
 * ========================================================================== */

function evaluateTreatmentDiscontinuation(
  treatment: TreatmentPlanModel,
  reason?: string
): RuleResult {

if (treatment.status !== TreatmentStatus.DISCONTINUED) {
    return EMPTY_RULE_RESULT;
}

  const actions: RuleAction[] = [];

  actions.push(
    action(
      RuleActionType.DISCONTINUE_TREATMENT,
      Object.freeze({
        treatmentId: treatment.id,
        reason
      })
    )
  );

// Intentionally left blank.
//
// A discontinued treatment is NOT archived.
// It remains available for future reactivation and
// preserves the patient's clinical timeline.

  actions.push(
    action(
      RuleActionType.CREATE_TIMELINE_EVENT,
      Object.freeze({
        treatmentId: treatment.id,
        changeType: TreatmentChangeType.DISCONTINUED,
        reason
      })
    )
  );

  return ruleResult(
    [],
    [],
    actions
  );

}

/* ============================================================================
 * Treatment Reactivation
 * ========================================================================== */

function evaluateTreatmentReactivation(
  treatment: TreatmentPlanModel
): RuleResult {

// Reactivation rules are evaluated only for
// treatments explicitly marked as reactivated.

if (!treatment.isActive) {
    return EMPTY_RULE_RESULT;
}

return EMPTY_RULE_RESULT;

  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];
  const actions: RuleAction[] = [];

  if (
    treatment.previousTreatmentId &&
    treatment.supersededByTreatmentId
  ) {

    warnings.push(
      warning(
        'supersededByTreatmentId',
        'Previously superseded treatment is being reactivated.'
      )
    );

  }

  actions.push(
    action(
      RuleActionType.ACTIVATE_TREATMENT,
      Object.freeze({
        treatmentId: treatment.id,
        reactivated: true
      })
    )
  );

  actions.push(
    action(
      RuleActionType.CREATE_TIMELINE_EVENT,
      Object.freeze({
        treatmentId: treatment.id,
        changeType: TreatmentChangeType.ARCHIVED
      })
    )
  );

  return ruleResult(
    violations,
    warnings,
    actions
  );

}
/* ============================================================================
 * Part 3A
 * Medicine Business Rules
 * ========================================================================== */

function evaluateMedicineStatusTransitions(
  medicines: readonly TreatmentMedicineModel[]
): RuleResult {

  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];
  const actions: RuleAction[] = [];

  for (const treatmentMedicine of medicines) {

    const medicine = treatmentMedicine.medicine;

    switch (medicine.status) {

      case MedicineStatus.ACTIVE:

        actions.push(
          action(
            RuleActionType.UPDATE_MEDICATION,
            Object.freeze({
              treatmentMedicineId: treatmentMedicine.id,
              medicineId: medicine.id,
              status: MedicineStatus.ACTIVE
            })
          )
        );
        break;

case MedicineStatus.PAUSED:

    actions.push(
      action(
        RuleActionType.UPDATE_MEDICATION,
        Object.freeze({
          treatmentMedicineId: treatmentMedicine.id,
          medicineId: medicine.id,
          status: MedicineStatus.PAUSED
        })
      )
    );

    actions.push(
      action(
        RuleActionType.CREATE_TIMELINE_EVENT,
        Object.freeze({
          medicineId: medicine.id,
          changeType: TreatmentChangeType.UPDATED
        })
      )
    );

    break;


      case MedicineStatus.STOPPED:

        actions.push(
          action(
            RuleActionType.UPDATE_MEDICATION,
            Object.freeze({
              treatmentMedicineId: treatmentMedicine.id,
              medicineId: medicine.id,
              status: MedicineStatus.STOPPED
            })
          )
        );

        actions.push(
          action(
            RuleActionType.CREATE_TIMELINE_EVENT,
            Object.freeze({
              medicineId: medicine.id,
              changeType: TreatmentChangeType.UPDATED
            })
          )
        );
        break;

case MedicineStatus.DISCONTINUED:

    actions.push(
      action(
        RuleActionType.UPDATE_MEDICATION,
        Object.freeze({
          treatmentMedicineId: treatmentMedicine.id,
          medicineId: medicine.id,
          status: MedicineStatus.DISCONTINUED
        })
      )
    );

    actions.push(
      action(
        RuleActionType.CREATE_TIMELINE_EVENT,
        Object.freeze({
          medicineId: medicine.id,
          changeType: TreatmentChangeType.DISCONTINUED
        })
      )
    );

    break;


case MedicineStatus.PRN:

    actions.push(
      action(
        RuleActionType.UPDATE_MEDICATION,
        Object.freeze({
          treatmentMedicineId: treatmentMedicine.id,
          medicineId: medicine.id,
          status: MedicineStatus.PRN
        })
      )
    );

    break;

case MedicineStatus.INACTIVE:

    actions.push(
      action(
        RuleActionType.UPDATE_MEDICATION,
        Object.freeze({
          treatmentMedicineId: treatmentMedicine.id,
          medicineId: medicine.id,
          status: MedicineStatus.INACTIVE
        })
      )
    );

    break;


      case MedicineStatus.COMPLETED:

        actions.push(
          action(
            RuleActionType.UPDATE_MEDICATION,
            Object.freeze({
              treatmentMedicineId: treatmentMedicine.id,
              medicineId: medicine.id,
              status: MedicineStatus.COMPLETED
            })
          )
        );
        break;

case MedicineStatus.UNKNOWN:

    warnings.push(
      warning(
        'medicine.status',
        'Medicine status is UNKNOWN.'
      )
    );

    break;

default:

    warnings.push(
      warning(
        'medicine.status',
        `Unhandled medicine status '${medicine.status}'.`
      )
    );

  }

  return ruleResult(
    violations,
    warnings,
    actions
  );

}

/* ============================================================================
 * Duplicate Medicine Rules
 * ========================================================================== */

function evaluateMedicineDuplicates(
  medicines: readonly TreatmentMedicineModel[]
): RuleResult {

  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];

  const seen = new Map<string, TreatmentMedicineModel>();

  for (const medicine of medicines) {

    const key =
      medicine.medicine.prescribedName
        .trim()
        .toLowerCase();

    if (!seen.has(key)) {

      seen.set(key, medicine);
      continue;

    }

    warnings.push(
      warning(
        'clinicalContext.medicines',
        `Duplicate medicine detected: ${medicine.medicine.prescribedName}`
      )
    );

  }

  return ruleResult(
    violations,
    warnings,
    []
  );

}

/* ============================================================================
 * Medicine Activation Rules
 * ========================================================================== */

function evaluateMedicineActivation(
  medicines: readonly TreatmentMedicineModel[]
): RuleResult {

  const actions: RuleAction[] = [];

  for (const medicine of medicines) {

if (
    medicine.medicine.status !== MedicineStatus.ACTIVE &&
    medicine.medicine.status !== MedicineStatus.PRN
) {
    continue;
}

    actions.push(
      action(
        RuleActionType.UPDATE_MEDICATION,
        Object.freeze({
          treatmentMedicineId: medicine.id,
          medicineId: medicine.medicine.id,
          activate: true
        })
      )
    );

  }

  return ruleResult(
    [],
    [],
    actions
  );

}

/* ============================================================================
 * Medicine Deactivation Rules
 * ========================================================================== */

function evaluateMedicineDeactivation(
  medicines: readonly TreatmentMedicineModel[]
): RuleResult {

  const actions: RuleAction[] = [];

  for (const medicine of medicines) {

if (
    medicine.medicine.status === MedicineStatus.ACTIVE ||
    medicine.medicine.status === MedicineStatus.PRN
) {
    continue;
}

    actions.push(
      action(
        RuleActionType.UPDATE_MEDICATION,
        Object.freeze({
          treatmentMedicineId: medicine.id,
          medicineId: medicine.medicine.id,
          activate: false
        })
      )
    );

  }

  return ruleResult(
    [],
    [],
    actions
  );

}

/* ============================================================================
 * Medicine Consistency Rules
 * ========================================================================== */

function evaluateMedicineConsistency(
  medicines: readonly TreatmentMedicineModel[]
): RuleResult {

  const violations: RuleViolation[] = [];

  for (const treatmentMedicine of medicines) {

    const medicine = treatmentMedicine.medicine;

    if (
      medicine.schedules.length === 0
    ) {

      violations.push(
        violation(
          'MISSING_SCHEDULE',
          'medicine.schedules',
          `Medicine '${medicine.prescribedName}' has no schedule.`
        )
      );

    }

    if (
      medicine.dose.amount <= 0
    ) {

      violations.push(
        violation(
          'INVALID_DOSE',
          'medicine.dose.amount',
          `Medicine '${medicine.prescribedName}' has an invalid dose.`
        )
      );

    }

  }

  return ruleResult(
    violations,
    [],
    []
  );

}

/* ============================================================================
 * Medicine Ordering Rules
 * ========================================================================== */

function evaluateMedicineOrdering(
  medicines: readonly TreatmentMedicineModel[]
): RuleResult {

  const warnings: RuleWarning[] = [];

  const ordered =
    [...medicines]
      .sort(
        (a, b) =>
          a.sequence - b.sequence
      );

  for (let i = 0; i < ordered.length; i++) {

    if (
      ordered[i].sequence !== i + 1
    ) {

      warnings.push(
        warning(
          'sequence',
          'Medicine sequence contains gaps.'
        )
      );

      break;

    }

  }

  return ruleResult(
    [],
    warnings,
    []
  );

}
/* ============================================================================
 * Part 3B
 * Follow-up, Timeline & Clinical Context Rules
 * ========================================================================== */

function evaluateFollowUpRules(
  followUp: FollowUpModel | undefined
): RuleResult {

  if (!followUp) {
    return EMPTY_RULE_RESULT;
  }

  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];
  const actions: RuleAction[] = [];

  switch (followUp.status) {

    case FollowUpStatus.ADVISED:

      actions.push(
        action(
          RuleActionType.CREATE_FOLLOWUP,
          Object.freeze({
            followUpId: followUp.id,
            followUpDate: followUp.followUpDate
          })
        )
      );

      break;

    case FollowUpStatus.MISSED:

      warnings.push(
        warning(
          "followUp.status",
          "Patient follow-up is overdue."
        )
      );

      actions.push(
        action(
          RuleActionType.CREATE_TIMELINE_EVENT,
          Object.freeze({
            followUpId: followUp.id,
            status: FollowUpStatus.OVERDUE
          })
        )
      );

      break;

    case FollowUpStatus.COMPLETED:
      break;

    default:

      warnings.push(
        warning(
          "followUp.status",
          "Unknown follow-up status."
        )
      );

  }

  return ruleResult(
    violations,
    warnings,
    actions
  );

}

/* ============================================================================
 * Timeline Rules
 * ========================================================================== */

function evaluateTimelineRules(
  treatment: TreatmentPlanModel
): RuleResult {

  const actions: RuleAction[] = [];

  actions.push(
    action(
      RuleActionType.CREATE_TIMELINE_EVENT,
      Object.freeze({
        treatmentId: treatment.id,
        treatmentStatus: treatment.status,
        version: treatment.version,
        consultationId:
          treatment.consultation.consultationId
      })
    )
  );

  return ruleResult(
    [],
    [],
    actions
  );

}

/* ============================================================================
 * Clinical Context Rules
 * ========================================================================== */

function evaluateClinicalContextRules(
  context: TreatmentClinicalContext
): RuleResult {

  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];

  if (
    context.diagnoses.length === 0
  ) {

    warnings.push(
      warning(
        "clinicalContext.diagnoses",
        "No diagnosis available."
      )
    );

  }

  if (
    context.medicines.length === 0
  ) {

    violations.push(
      violation(
        "NO_MEDICINES",
        "clinicalContext.medicines",
        "Treatment must contain at least one medicine."
      )
    );

  }

  if (
    context.investigations.length === 0
  ) {

    warnings.push(
      warning(
        "clinicalContext.investigations",
        "No investigations attached."
      )
    );

  }

  return ruleResult(
    violations,
    warnings,
    []
  );

}

/* ============================================================================
 * Composite Clinical Rule Evaluation
 * ========================================================================== */

function evaluateClinicalRules(
  treatment: TreatmentPlanModel
): RuleResult {

  return mergeRuleResults(

    evaluateClinicalContextRules(
      treatment.clinicalContext
    ),

    evaluateMedicineStatusTransitions(
      treatment.clinicalContext.medicines
    ),

    evaluateMedicineDuplicates(
      treatment.clinicalContext.medicines
    ),

    evaluateMedicineActivation(
      treatment.clinicalContext.medicines
    ),

    evaluateMedicineDeactivation(
      treatment.clinicalContext.medicines
    ),

    evaluateMedicineConsistency(
      treatment.clinicalContext.medicines
    ),

    evaluateMedicineOrdering(
      treatment.clinicalContext.medicines
    ),

    evaluateFollowUpRules(
      treatment.clinicalContext.followUp
    ),

    evaluateTimelineRules(
      treatment
    )

  );

}

/* ============================================================================
 * Part 3C
 * Composite Evaluation & Public API
 * ========================================================================== */

function evaluateTreatmentComparison(
  comparison: TreatmentComparisonModel
): RuleResult {

  const warnings: RuleWarning[] = [];
  const actions: RuleAction[] = [];

  if (!comparison.hasChanges) {
    return EMPTY_RULE_RESULT;
  }

  if (comparison.requiresReview) {

    warnings.push(
      warning(
        "comparison.requiresReview",
        "Treatment comparison requires clinical review."
      )
    );

  }

  if (comparison.medicinesAdded.length > 0) {

    actions.push(
      action(
        RuleActionType.CREATE_TIMELINE_EVENT,
        Object.freeze({
          event: "MEDICINES_ADDED",
          count: comparison.medicinesAdded.length
        })
      )
    );

  }

  if (comparison.medicinesRemoved.length > 0) {

    actions.push(
      action(
        RuleActionType.CREATE_TIMELINE_EVENT,
        Object.freeze({
          event: "MEDICINES_REMOVED",
          count: comparison.medicinesRemoved.length
        })
      )
    );

  }

  if (comparison.medicinesModified.length > 0) {

    actions.push(
      action(
        RuleActionType.CREATE_TIMELINE_EVENT,
        Object.freeze({
          event: "MEDICINES_MODIFIED",
          count: comparison.medicinesModified.length
        })
      )
    );

  }

  return ruleResult(
    [],
    warnings,
    actions
  );

}

/* ============================================================================
 * Complete Treatment Evaluation
 * ========================================================================== */

function evaluateTreatment(
  existingTreatments: readonly TreatmentPlanModel[],
  incomingTreatment: TreatmentPlanModel,
  comparison?: TreatmentComparisonModel
): RuleResult {

  const previousTreatment =
    existingTreatments.find(
      treatment =>
        treatment.id ===
        incomingTreatment.previousTreatmentId
    );

  const results: RuleResult[] = [

    evaluateTreatmentActivation(
      existingTreatments,
      incomingTreatment
    ),

    evaluateTreatmentReplacement(
      previousTreatment,
      incomingTreatment
    ),

    evaluateTreatmentSupersession(
      previousTreatment,
      incomingTreatment
    ),

    evaluateTreatmentCompletion(
      incomingTreatment
    ),

    evaluateTreatmentDiscontinuation(
      incomingTreatment
    ),

// Reactivation will be evaluated in the
// Treatment Service where previous and current
// treatment states are available.

// evaluateTreatmentReactivation(
//     incomingTreatment
// ),

    evaluateClinicalRules(
      incomingTreatment
    )

  ];

  if (comparison) {

    results.push(
      evaluateTreatmentComparison(
        comparison
      )
    );

  }

  return mergeRuleResults(
    ...results
  );

}

/* ============================================================================
 * Public API
 * ========================================================================== */

export const TreatmentRules = Object.freeze({

  evaluateTreatment,

  evaluateTreatmentActivation,

  evaluateSingleActiveTreatment,

  evaluateVersionIncrement,

  evaluateTreatmentReplacement,

  evaluateTreatmentSupersession,

  evaluateTreatmentArchival,

  evaluateTreatmentCompletion,

  evaluateTreatmentDiscontinuation,

  evaluateTreatmentReactivation,

  evaluateMedicineStatusTransitions,

  evaluateMedicineDuplicates,

  evaluateMedicineActivation,

  evaluateMedicineDeactivation,

  evaluateMedicineConsistency,

  evaluateMedicineOrdering,

  evaluateFollowUpRules,

  evaluateTimelineRules,

  evaluateClinicalContextRules,

  evaluateClinicalRules,

  evaluateTreatmentComparison

});

/* ============================================================================
 * File Complete
 * ========================================================================== */
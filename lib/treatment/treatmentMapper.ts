/* ============================================================================
 * CareVR
 * Treatment Mapper
 * ----------------------------------------------------------------------------
 * Maps between:
 * • OCR / AI Extraction
 * • API DTOs
 * • Database Models
 * • Timeline Models
 * • Repository Models
 * ========================================================================== */

import type {
  TreatmentPlanModel,
  TreatmentClinicalContext,
  TreatmentMedicineModel,
  MedicineModel,
  DiagnosisModel,
  InvestigationModel,
  FollowUpModel,
  TreatmentComparisonModel
} from './treatmentModels';

import {
  TreatmentStatus,
  MedicineStatus,
  ConsultationMode,
  TreatmentChangeType
} from './treatmentTypes';

/* ============================================================================
 * Internal Helpers
 * ========================================================================== */

function clone<T>(value: T): T {
  return structuredClone(value);
}

function freeze<T>(value: T): Readonly<T> {
  return Object.freeze(value);
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalize(value: string | undefined | null): string {
  return value?.trim() ?? '';
}

function normalizeLower(value: string | undefined | null): string {
  return normalize(value).toLowerCase();
}

function safeArray<T>(value: readonly T[] | undefined): readonly T[] {
  return value ?? [];
}

/* ============================================================================
 * Medicine Mapper
 * ========================================================================== */

function mapMedicine(
  medicine: MedicineModel
): MedicineModel {

  return freeze({

    ...clone(medicine),

    prescribedName: normalize(medicine.prescribedName),

    status:
      medicine.status ??
      MedicineStatus.ACTIVE

  });

}

function mapTreatmentMedicine(
  treatmentMedicine: TreatmentMedicineModel
): TreatmentMedicineModel {

  return freeze({

    ...clone(treatmentMedicine),

    medicine: mapMedicine(
      treatmentMedicine.medicine
    )

  });

}

/* ============================================================================
 * Diagnosis Mapper
 * ========================================================================== */

function mapDiagnosis(
  diagnosis: DiagnosisModel
): DiagnosisModel {

  return freeze({

    ...clone(diagnosis),

    diagnosis: normalize(
      diagnosis.diagnosis
    )

  });

}

/* ============================================================================
 * Investigation Mapper
 * ========================================================================== */

function mapInvestigation(
  investigation: InvestigationModel
): InvestigationModel {

  return freeze({

    ...clone(investigation),

    investigation: normalize(
      investigation.investigation
    )

  });

}

/* ============================================================================
 * Follow-up Mapper
 * ========================================================================== */

function mapFollowUp(
  followUp: FollowUpModel | undefined
): FollowUpModel | undefined {

  if (!followUp) {
    return undefined;
  }

  return freeze({

    ...clone(followUp),

    notes: normalize(followUp.notes)

  });

}

/* ============================================================================
 * Clinical Context Mapper
 * ========================================================================== */

function mapClinicalContext(
  context: TreatmentClinicalContext
): TreatmentClinicalContext {

  return freeze({

    ...clone(context),

    diagnoses: freeze(
      safeArray(context.diagnoses)
        .map(mapDiagnosis)
    ),

    medicines: freeze(
      safeArray(context.medicines)
        .map(mapTreatmentMedicine)
    ),

    investigations: freeze(
      safeArray(context.investigations)
        .map(mapInvestigation)
    ),

    followUp: mapFollowUp(
      context.followUp
    )

  });

}

/* ============================================================================
 * Treatment Mapper
 * ========================================================================== */

function mapTreatment(
  treatment: TreatmentPlanModel
): TreatmentPlanModel {

  return freeze({

    ...clone(treatment),

    status:
      treatment.status ??
      TreatmentStatus.ACTIVE,

    consultation: clone(
      treatment.consultation
    ),

    clinicalContext:
      mapClinicalContext(
        treatment.clinicalContext
      ),

    createdAt:
      treatment.createdAt ??
      nowIso(),

    updatedAt:
      nowIso()

  });

}
/* ============================================================================
 * Timeline Mapper
 * ========================================================================== */

function mapTimelineEvent(
  treatment: TreatmentPlanModel,
  changeType: TreatmentChangeType
) {

  return freeze({

    patientId: treatment.patientId,

    treatmentId: treatment.id,

    consultationId:
      treatment.consultation.consultationId,

    version: treatment.version,

    changeType,

    status: treatment.status,

    occurredAt: nowIso()

  });

}

/* ============================================================================
 * Treatment Comparison Mapper
 * ========================================================================== */

function mapTreatmentComparison(
  comparison: TreatmentComparisonModel
): TreatmentComparisonModel {

  return freeze({

    ...clone(comparison),

    medicinesAdded: freeze([
      ...safeArray(comparison.medicinesAdded)
    ]),

    medicinesRemoved: freeze([
      ...safeArray(comparison.medicinesRemoved)
    ]),

    medicinesModified: freeze([
      ...safeArray(comparison.medicinesModified)
    ])

  });

}

/* ============================================================================
 * Public API
 * ========================================================================== */

export const TreatmentMapper = Object.freeze({

  mapMedicine,

  mapTreatmentMedicine,

  mapDiagnosis,

  mapInvestigation,

  mapFollowUp,

  mapClinicalContext,

  mapTreatment,

  mapTimelineEvent,

  mapTreatmentComparison

});
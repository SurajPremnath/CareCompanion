/* ============================================================================
 * CareVR
 * Treatment Repository
 * ----------------------------------------------------------------------------
 * Repository layer for Treatment Management.
 *
 * Responsibilities
 * • Database persistence
 * • Reads
 * • Updates
 * • Version retrieval
 * • Active treatment lookup
 * • History retrieval
 * ========================================================================== */

import type {
  TreatmentPlanModel,
  TreatmentComparisonModel
} from './treatmentModels';

export interface TreatmentRepository {

  create(
    treatment: TreatmentPlanModel
  ): Promise<TreatmentPlanModel>;

  update(
    treatment: TreatmentPlanModel
  ): Promise<TreatmentPlanModel>;

  archive(
    treatmentId: string
  ): Promise<void>;

  supersede(
    treatmentId: string,
    supersededByTreatmentId: string
  ): Promise<void>;

  discontinue(
    treatmentId: string,
    reason?: string
  ): Promise<void>;

  complete(
    treatmentId: string
  ): Promise<void>;

  activate(
    treatmentId: string
  ): Promise<void>;

  findById(
    treatmentId: string
  ): Promise<TreatmentPlanModel | null>;

  findActiveTreatment(
    patientId: string
  ): Promise<TreatmentPlanModel | null>;

  findLatestTreatment(
    patientId: string
  ): Promise<TreatmentPlanModel | null>;

  findTreatmentHistory(
    patientId: string
  ): Promise<readonly TreatmentPlanModel[]>;

  compareTreatments(
    previousTreatmentId: string,
    currentTreatmentId: string
  ): Promise<TreatmentComparisonModel>;

  delete(
    treatmentId: string
  ): Promise<void>;

}
/* ============================================================================
 * Base Repository
 * ========================================================================== */

export abstract class BaseTreatmentRepository
  implements TreatmentRepository {

  abstract create(
    treatment: TreatmentPlanModel
  ): Promise<TreatmentPlanModel>;

  abstract update(
    treatment: TreatmentPlanModel
  ): Promise<TreatmentPlanModel>;

  abstract archive(
    treatmentId: string
  ): Promise<void>;

  abstract supersede(
    treatmentId: string,
    supersededByTreatmentId: string
  ): Promise<void>;

  abstract discontinue(
    treatmentId: string,
    reason?: string
  ): Promise<void>;

  abstract complete(
    treatmentId: string
  ): Promise<void>;

  abstract activate(
    treatmentId: string
  ): Promise<void>;

  abstract findById(
    treatmentId: string
  ): Promise<TreatmentPlanModel | null>;

  abstract findActiveTreatment(
    patientId: string
  ): Promise<TreatmentPlanModel | null>;

  abstract findLatestTreatment(
    patientId: string
  ): Promise<TreatmentPlanModel | null>;

  abstract findTreatmentHistory(
    patientId: string
  ): Promise<readonly TreatmentPlanModel[]>;

  abstract compareTreatments(
    previousTreatmentId: string,
    currentTreatmentId: string
  ): Promise<TreatmentComparisonModel>;

  abstract delete(
    treatmentId: string
  ): Promise<void>;

}

/* ============================================================================
 * Repository Helpers
 * ========================================================================== */

export function sortByVersion(
  treatments: readonly TreatmentPlanModel[]
): readonly TreatmentPlanModel[] {

  return [...treatments].sort(
    (a, b) => b.version - a.version
  );

}

export function getLatestTreatment(
  treatments: readonly TreatmentPlanModel[]
): TreatmentPlanModel | null {

  const sorted = sortByVersion(
    treatments
  );

  return sorted.length > 0
    ? sorted[0]
    : null;

}

export function getActiveTreatment(
  treatments: readonly TreatmentPlanModel[]
): TreatmentPlanModel | null {

  return (
    treatments.find(
      treatment =>
        treatment.isActive
    ) ?? null
  );

}
/* ============================================================================
 * Repository Utilities
 * ========================================================================== */

export function getTreatmentByVersion(
  treatments: readonly TreatmentPlanModel[],
  version: number
): TreatmentPlanModel | null {

  return (
    treatments.find(
      treatment => treatment.version === version
    ) ?? null
  );

}

export function getTreatmentById(
  treatments: readonly TreatmentPlanModel[],
  treatmentId: string
): TreatmentPlanModel | null {

  return (
    treatments.find(
      treatment => treatment.id === treatmentId
    ) ?? null
  );

}

export function getPreviousTreatment(
  treatments: readonly TreatmentPlanModel[],
  treatment: TreatmentPlanModel
): TreatmentPlanModel | null {

  if (!treatment.previousTreatmentId) {
    return null;
  }

  return (
    treatments.find(
      item =>
        item.id === treatment.previousTreatmentId
    ) ?? null
  );

}

export function getNextTreatment(
  treatments: readonly TreatmentPlanModel[],
  treatment: TreatmentPlanModel
): TreatmentPlanModel | null {

  return (
    treatments.find(
      item =>
        item.previousTreatmentId === treatment.id
    ) ?? null
  );

}

export function hasActiveTreatment(
  treatments: readonly TreatmentPlanModel[]
): boolean {

  return treatments.some(
    treatment =>
      treatment.isActive
  );

}

export function getTreatmentCount(
  treatments: readonly TreatmentPlanModel[]
): number {

  return treatments.length;

}

/* ============================================================================
 * Public Exports
 * ========================================================================== */

export const TreatmentRepositoryUtils = Object.freeze({

  sortByVersion,

  getLatestTreatment,

  getActiveTreatment,

  getTreatmentByVersion,

  getTreatmentById,

  getPreviousTreatment,

  getNextTreatment,

  hasActiveTreatment,

  getTreatmentCount

});
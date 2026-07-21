/* ============================================================================
 * CareVR
 * Treatment Storage
 * ----------------------------------------------------------------------------
 * Storage implementation for Treatment Repository.
 *
 * Responsibilities
 * • Supabase persistence
 * • CRUD
 * • Active treatment lookup
 * • Version history
 * • Treatment comparison retrieval
 * ========================================================================== */

import { supabase } from '@/lib/supabase/client';

import type {
  TreatmentPlanModel,
  TreatmentComparisonModel
} from './treatmentModels';

import { BaseTreatmentRepository } from './treatmentRepository';

export class TreatmentStorage
  extends BaseTreatmentRepository {

  private readonly TABLE =
    'treatments';

  async create(
    treatment: TreatmentPlanModel
  ): Promise<TreatmentPlanModel> {

    throw new Error(
      'Not implemented.'
    );

  }

  async update(
    treatment: TreatmentPlanModel
  ): Promise<TreatmentPlanModel> {

    throw new Error(
      'Not implemented.'
    );

  }

  async archive(
    treatmentId: string
  ): Promise<void> {

    throw new Error(
      'Not implemented.'
    );

  }

  async supersede(
    treatmentId: string,
    supersededByTreatmentId: string
  ): Promise<void> {

    throw new Error(
      'Not implemented.'
    );

  }

  async discontinue(
    treatmentId: string,
    reason?: string
  ): Promise<void> {

    throw new Error(
      'Not implemented.'
    );

  }

  async complete(
    treatmentId: string
  ): Promise<void> {

    throw new Error(
      'Not implemented.'
    );

  }

  async activate(
    treatmentId: string
  ): Promise<void> {

    throw new Error(
      'Not implemented.'
    );

  }
  async findById(
    treatmentId: string
  ): Promise<TreatmentPlanModel | null> {

    throw new Error(
      'Not implemented.'
    );

  }

  async findActiveTreatment(
    patientId: string
  ): Promise<TreatmentPlanModel | null> {

    throw new Error(
      'Not implemented.'
    );

  }

  async findLatestTreatment(
    patientId: string
  ): Promise<TreatmentPlanModel | null> {

    throw new Error(
      'Not implemented.'
    );

  }

  async findTreatmentHistory(
    patientId: string
  ): Promise<
    readonly TreatmentPlanModel[]
  > {

    throw new Error(
      'Not implemented.'
    );

  }

  async compareTreatments(
    previousTreatmentId: string,
    currentTreatmentId: string
  ): Promise<TreatmentComparisonModel> {

    throw new Error(
      'Not implemented.'
    );

  }

  async delete(
    treatmentId: string
  ): Promise<void> {

    throw new Error(
      'Not implemented.'
    );

  }

}
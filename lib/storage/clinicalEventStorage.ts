import {
  ClinicalEvent,
  CreateClinicalEventRequest,
} from "@/lib/types/clinicalEvent";

import { ClinicalEventRepository } from "@/lib/repositories/clinicalEventRepository";

export class ClinicalEventStorage {

  //------------------------------------------------------------
  // Create Clinical Event
  //------------------------------------------------------------

  static async create(
    event: CreateClinicalEventRequest
  ): Promise<void> {

    await ClinicalEventRepository.create(event);

  }

  //------------------------------------------------------------
  // Get Event By Id
  //------------------------------------------------------------

  static async getById(
    id: string
  ): Promise<ClinicalEvent | null> {

    return ClinicalEventRepository.getById(id);

  }

  //------------------------------------------------------------
  // Get Patient Timeline
  //------------------------------------------------------------

  static async getByPatient(
    patientId: string
  ): Promise<ClinicalEvent[]> {

    return ClinicalEventRepository.getByPatient(patientId);

  }

}
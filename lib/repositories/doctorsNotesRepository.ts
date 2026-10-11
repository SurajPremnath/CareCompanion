import "server-only";

import {
  createProtectedDoctorsNote,
  getProtectedDoctorsNotes,
  getProtectedDoctorsNotesAndTreatments
} from "@/lib/security/dataProtection/doctorsNotesPersistenceService";

import {
  DoctorsNote,
  CreateDoctorsNoteRequest,
  CreateDoctorsNoteResult,
} from "@/lib/types/doctorsNote";

export class DoctorsNotesRepository {
  async create(
    request: CreateDoctorsNoteRequest
  ): Promise<CreateDoctorsNoteResult> {
    return createProtectedDoctorsNote(request);
  }

  async getForPeriod(
    patientId: string,
    startDate: string,
    endDate: string
  ): Promise<DoctorsNote[]> {
    return getProtectedDoctorsNotes(
      patientId,
      startDate,
      endDate
    );
  }

  async getNotesAndTreatmentsForPeriod(
    careMode: "SELF" | "FAMILY",
    patientId: string | null,
    startDate: string,
    endDate: string
  ) {
    return getProtectedDoctorsNotesAndTreatments(
      careMode,
      patientId,
      startDate,
      endDate
    );
  }

}

export const doctorsNotesRepository =
  new DoctorsNotesRepository();
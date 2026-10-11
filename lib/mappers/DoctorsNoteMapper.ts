import {
  DoctorsNote,
  DoctorNoteCareMode,
} from "../types/doctorsNote";

export interface DoctorsNoteRow {
  id: string;
  care_mode: DoctorNoteCareMode;
  user_id: string;
  patient_id: string | null;
  provider_id: string;
  doctor_profile_id: string | null;
  facility_id: string | null;
  author_user_id: string;
  note_at: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export class DoctorsNoteMapper {
  static fromDatabase(row: DoctorsNoteRow): DoctorsNote {
    return {
      id: row.id,
      careMode: row.care_mode,
      userId: row.user_id,
      patientId: row.patient_id,
      providerId: row.provider_id,
      doctorProfileId: row.doctor_profile_id,
      facilityId: row.facility_id,
      authorUserId: row.author_user_id,
      noteAt: row.note_at,
      note: row.note,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
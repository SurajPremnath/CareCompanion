export type DoctorNoteCareMode = "SELF" | "FAMILY";

export interface DoctorsNote {
  id: string;
  careMode: DoctorNoteCareMode;
  userId: string;
  patientId: string | null;
  providerId: string;
  doctorProfileId: string | null;
  facilityId: string | null;
  authorUserId: string;
  noteAt: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorNoteTreatmentInput {
  medication: string;
  dosage: string;
  duration: string;
}

export interface CreateDoctorsNoteRequest {
  careMode: DoctorNoteCareMode;
  patientId: string | null;
  providerId?: string | null;
  doctorName?: string | null;
  doctorProfileId?: string | null;
  facilityId?: string | null;
  facilityName?: string | null;
  specialisation?: string | null;
  noteAt?: string | null;
  note?: string | null;
  treatments?: DoctorNoteTreatmentInput[];
}

export interface CreateDoctorsNoteResult {
  note: DoctorsNote | null;
  noteId: string | null;
  treatmentsSaved: number;
}
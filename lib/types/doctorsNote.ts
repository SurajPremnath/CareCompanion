export interface DoctorsNote {
  id: string;

  patientId: string;

  providerId: string;

  doctorProfileId: string | null;

  facilityId: string | null;

  authorUserId: string;

  noteAt: string;

  note: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateDoctorsNoteRequest {
  patientId: string;

  providerId: string;

  doctorProfileId?: string | null;

  facilityId?: string | null;

  noteAt: string;

  note: string;
}
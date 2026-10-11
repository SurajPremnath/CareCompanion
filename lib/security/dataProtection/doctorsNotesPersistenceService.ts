import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  protectDoctorsNoteData,
  unprotectDoctorsNoteData,
} from "@/lib/security/dataProtection/doctorsNotesDataProtectionService";
import { encryptValue } from "@/lib/security/encryption/encryptionService";
import {
  DoctorsNote,
  CreateDoctorsNoteRequest,
  CreateDoctorsNoteResult,
} from "@/lib/types/doctorsNote";
import {
  DoctorsNoteMapper,
  DoctorsNoteRow,
} from "@/lib/mappers/DoctorsNoteMapper";

/**
 * Creates a doctor note, treatments, or both.
 *
 * Note and treatment content is encrypted before being sent to
 * the database. The database RPC handles the inserts atomically.
 */
export async function createProtectedDoctorsNote(
  request: CreateDoctorsNoteRequest
): Promise<CreateDoctorsNoteResult> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (
    request.careMode !== "SELF" &&
    request.careMode !== "FAMILY"
  ) {
    throw new Error("Invalid care mode.");
  }

  if (
    request.careMode === "SELF" &&
    request.patientId !== null
  ) {
    throw new Error("SELF mode must not include a patient.");
  }

  if (
    request.careMode === "FAMILY" &&
    !request.patientId
  ) {
    throw new Error("A patient is required in FAMILY mode.");
  }

  const hasNote =
    typeof request.note === "string" &&
    request.note.trim().length > 0;

  const completedTreatments = (
    request.treatments ?? []
  ).filter(
    (treatment) =>
      typeof treatment.medication === "string" &&
      treatment.medication.trim().length > 0
  );

  if (!hasNote && completedTreatments.length === 0) {
    throw new Error(
      "A doctor's note or at least one treatment is required."
    );
  }

  let encryptedNote:
    | {
        note_ciphertext: string;
        provider_id: string;
        doctor_profile_id: string | null;
        facility_id: string | null;
        note_at: string;
      }
    | null = null;

  if (hasNote) {
    if (!request.providerId) {
      throw new Error("A doctor is required for a doctor's note.");
    }

    if (!request.noteAt) {
      throw new Error("Note date and time are required.");
    }

    const noteDate = new Date(request.noteAt);

    if (Number.isNaN(noteDate.getTime())) {
      throw new Error("Invalid note date and time.");
    }

    const protection = protectDoctorsNoteData({
      note: request.note!.trim(),
    });

    const noteCiphertext =
      protection.protectedData.note_ciphertext;

    if (
      typeof noteCiphertext !== "string" ||
      noteCiphertext.trim().length === 0
    ) {
      throw new Error("Doctor note could not be protected.");
    }

    encryptedNote = {
      note_ciphertext: noteCiphertext,
      provider_id: request.providerId,
      doctor_profile_id: request.doctorProfileId ?? null,
      facility_id: request.facilityId ?? null,
      note_at: noteDate.toISOString(),
    };
  }

  const encryptedTreatments = completedTreatments.map(
    (treatment) => ({
      treatment_medication_ciphertext: encryptValue(
        treatment.medication.trim()
      ),
      dosage_ciphertext: treatment.dosage.trim()
        ? encryptValue(treatment.dosage.trim())
        : null,
      duration_ciphertext: treatment.duration.trim()
        ? encryptValue(treatment.duration.trim())
        : null,
    })
  );

  const { data, error } = await supabase.rpc(
    "save_doctors_note_and_treatments",
    {
      p_care_mode: request.careMode,
      p_patient_id: request.patientId,
      p_note: encryptedNote,
      p_treatments: encryptedTreatments,
    }
  );

  if (error) {
    throw error;
  }

  if (!data || typeof data !== "object") {
    throw new Error(
      "The database did not return a valid save result."
    );
  }

  const result = data as {
    note?: Record<string, unknown> | null;
    note_id?: string | null;
    treatments_saved?: number;
  };

  let savedNote: DoctorsNote | null = null;

  if (result.note) {
    const decryptedNote = unprotectDoctorsNoteData(
      result.note
    );

    savedNote = DoctorsNoteMapper.fromDatabase(
      decryptedNote as unknown as DoctorsNoteRow
    );
  }

  return {
    note: savedNote,
    noteId: result.note_id ?? null,
    treatmentsSaved: result.treatments_saved ?? 0,
  };
}

/**
 * Retrieves doctor notes for a patient within a date range,
 * then decrypts and maps the results.
 */
export async function getProtectedDoctorsNotes(
  patientId: string,
  startDate: string,
  endDate: string
): Promise<DoctorsNote[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!patientId) {
    throw new Error("Patient is required.");
  }

  const { data, error } = await supabase
    .from("doctors_notes")
    .select("*")
    .eq("patient_id", patientId)
    .gte("note_at", startDate)
    .lte("note_at", endDate)
    .order("note_at", { ascending: false });

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row) => {
    const decryptedNote = unprotectDoctorsNoteData(
      row as Record<string, unknown>
    );

    return DoctorsNoteMapper.fromDatabase(
      decryptedNote as unknown as DoctorsNoteRow
    );
  });
}
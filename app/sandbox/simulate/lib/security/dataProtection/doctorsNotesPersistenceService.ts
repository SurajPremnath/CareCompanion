import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  protectDoctorsNoteData,
  unprotectDoctorsNoteData,
} from "@/lib/security/dataProtection/doctorsNotesDataProtectionService";

import {
  decryptValue,
  encryptValue,
} from "@/lib/security/encryption/encryptionService";

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


export interface ProtectedDoctorsNotesAndTreatmentsResult {
  doctorsNotes: DoctorsNote[];
  treatments: {
    id: string;
    doctorNoteId: string | null;
    medication: string;
    dosage: string;
    duration: string;
    displayOrder: number;
    createdAt: string;
    careMode: "SELF" | "FAMILY";
    patientId: string | null;
  }[];
}

export async function getProtectedDoctorsNotesAndTreatments(
  careMode: "SELF" | "FAMILY",
  patientId: string | null,
  startDate: string,
  endDate: string
): Promise<ProtectedDoctorsNotesAndTreatmentsResult> {
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
    careMode === "SELF" &&
    patientId !== null
  ) {
    throw new Error("SELF mode must not include a patient.");
  }

  if (
    careMode === "FAMILY" &&
    !patientId
  ) {
    throw new Error("A patient is required in FAMILY mode.");
  }

  if (!startDate || !endDate) {
    throw new Error("A report start date and end date are required.");
  }

  const periodEnd =
    /^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ? `${endDate}T23:59:59.999Z`
      : endDate;

  let notesQuery = supabase
    .from("doctors_notes")
    .select("*")
    .eq("user_id", user.id)
    .eq("care_mode", careMode)
    .gte("note_at", startDate)
    .lte("note_at", periodEnd)
    .order("note_at", { ascending: false });

  let treatmentsQuery = supabase
    .from("doctor_note_treatments")
    .select("*")
    .eq("user_id", user.id)
    .eq("care_mode", careMode)
    .gte("created_at", startDate)
    .lte("created_at", periodEnd)
    .order("created_at", { ascending: false });

  if (careMode === "SELF") {
    notesQuery = notesQuery
      .is("patient_id", null)
      .eq("author_user_id", user.id);

    treatmentsQuery = treatmentsQuery
      .is("patient_id", null);
  } else {
    notesQuery = notesQuery.eq("patient_id", patientId!);

    treatmentsQuery = treatmentsQuery.eq(
      "patient_id",
      patientId!
    );
  }

  const [
    { data: noteRows, error: notesError },
    { data: treatmentRows, error: treatmentsError },
  ] = await Promise.all([
    notesQuery,
    treatmentsQuery,
  ]);

  if (notesError) {
    throw notesError;
  }

  if (treatmentsError) {
    throw treatmentsError;
  }

  const doctorsNotes = (noteRows ?? []).map((row) => {
    const decryptedNote = unprotectDoctorsNoteData(
      row as Record<string, unknown>
    );

    return DoctorsNoteMapper.fromDatabase(
      decryptedNote as unknown as DoctorsNoteRow
    );
  });

  const treatments =
    (treatmentRows ?? []).map((row) => ({
      id: row.id,
      doctorNoteId: row.doctor_note_id,
      medication: decryptValue(
        row.treatment_medication_ciphertext
      ),
      dosage: row.dosage_ciphertext
        ? decryptValue(row.dosage_ciphertext)
        : "",
      duration: row.duration_ciphertext
        ? decryptValue(row.duration_ciphertext)
        : "",
      displayOrder: row.display_order,
      createdAt: row.created_at,
      careMode: row.care_mode as "SELF" | "FAMILY",
      patientId: row.patient_id,
    }));

  return {
    doctorsNotes,
    treatments,
  };
}

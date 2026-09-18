import "server-only";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  protectDoctorsNoteData,
  unprotectDoctorsNoteData,
} from "@/lib/security/dataProtection/doctorsNotesDataProtectionService";

import {
  DoctorsNote,
  CreateDoctorsNoteRequest,
} from "@/lib/types/doctorsNote";

import {
  DoctorsNoteMapper,
  DoctorsNoteRow,
} from "@/lib/mappers/DoctorsNoteMapper";

export async function createProtectedDoctorsNote(
  request: CreateDoctorsNoteRequest
): Promise<DoctorsNote> {

  const supabase =
    await createSupabaseServerClient();

  //------------------------------------------------------
  // Authentication
  //------------------------------------------------------

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  //------------------------------------------------------
  // Basic input validation
  //------------------------------------------------------

  if (!request.patientId) {
    throw new Error(
      "Patient is required."
    );
  }

  if (!request.providerId) {
    throw new Error(
      "Doctor is required."
    );
  }

  if (!request.note.trim()) {
    throw new Error(
      "Doctor note cannot be empty."
    );
  }

  if (!request.noteAt) {
    throw new Error(
      "Note date and time are required."
    );
  }

  //------------------------------------------------------
  // Protect note content
  //------------------------------------------------------

  const protection =
    protectDoctorsNoteData({
      note: request.note,
    });

  if (!protection.protectedData.note_ciphertext) {
    throw new Error(
      "Doctor note could not be protected."
    );
  }

  //------------------------------------------------------
  // Construct persistence payload
  //
  // author_user_id comes ONLY from the authenticated
  // Supabase user. It is never accepted from the UI.
  //------------------------------------------------------

  const persistenceRow = {
    patient_id:
      request.patientId,

    provider_id:
      request.providerId,

    doctor_profile_id:
      request.doctorProfileId ?? null,

    facility_id:
      request.facilityId ?? null,

    author_user_id:
      user.id,

    note_at:
      request.noteAt,

    note_ciphertext:
      protection.protectedData.note_ciphertext,
  };

  //------------------------------------------------------
  // Persist through authenticated Supabase client.
  //
  // RLS is the authoritative authorization boundary.
  //------------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("doctors_notes")
    .insert(persistenceRow)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Doctor note was created but could not be retrieved."
    );
  }

  //------------------------------------------------------
  // Decrypt only after the authorized row has been
  // returned through RLS.
  //------------------------------------------------------

  const decrypted =
    unprotectDoctorsNoteData(
      data as Record<string, unknown>
    );

  return DoctorsNoteMapper.fromDatabase(
    decrypted as unknown as DoctorsNoteRow
  );
}


//======================================================
// PROTECTED READ
//======================================================

export async function getProtectedDoctorsNotes(
  patientId: string,
  startDate: string,
  endDate: string,
): Promise<DoctorsNote[]> {

  const supabase =
    await createSupabaseServerClient();

  //------------------------------------------------------
  // Authentication
  //------------------------------------------------------

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  //------------------------------------------------------
  // Basic input validation
  //------------------------------------------------------

  if (!patientId) {
    throw new Error(
      "Patient is required."
    );
  }

  if (!startDate) {
    throw new Error(
      "Start date is required."
    );
  }

  if (!endDate) {
    throw new Error(
      "End date is required."
    );
  }

  if (startDate > endDate) {
    throw new Error(
      "Start date cannot be after end date."
    );
  }

  //------------------------------------------------------
  // Build the exact selected reporting period.
  //
  // startDate:
  // beginning of selected start day
  //
  // endDate:
  // end of selected end day
  //------------------------------------------------------

  const periodStart =
    `${startDate}T00:00:00.000Z`;

  const periodEnd =
    `${endDate}T23:59:59.999Z`;

  //------------------------------------------------------
  // Retrieve notes through the authenticated Supabase
  // client.
  //
  // Existing doctors_notes SELECT RLS remains the
  // authoritative patient-access boundary.
  //------------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("doctors_notes")
    .select("*")
    .eq(
      "patient_id",
      patientId,
    )
    .gte(
      "note_at",
      periodStart,
    )
    .lte(
      "note_at",
      periodEnd,
    )
    .order(
      "note_at",
      {
        ascending: true,
      },
    );

  if (error) {
    throw error;
  }

  //------------------------------------------------------
  // Decrypt only after the rows have been returned
  // through the authenticated RLS-protected query.
  //------------------------------------------------------

  return (data ?? []).map(
    row => {

      const decrypted =
        unprotectDoctorsNoteData(
          row as Record<string, unknown>,
        );

      return DoctorsNoteMapper.fromDatabase(
        decrypted as unknown as DoctorsNoteRow,
      );
    },
  );
}
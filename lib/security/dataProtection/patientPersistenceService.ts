import "server-only";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  protectPatientData,
} from "@/lib/security/dataProtection/patientDataProtectionService";

import {
  patientValidator,
} from "@/lib/validators/patientValidator";

import {
  createLookupHash,
} from "@/lib/security/encryption/encryptionService";

export interface CreateProtectedPatientInput {
  fullName: string;
  dateOfBirth: string | null;
  gender:
    | "Male"
    | "Female"
    | "Other"
    | "Prefer not to say";
  relationship: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ProtectedPatientPersistenceRow {
  user_id: string;
  family_id: string;

  // Temporary compatibility fields during encryption migration
  full_name: string;
  date_of_birth: string | null;

  // Protected fields
  full_name_ciphertext: string;
  full_name_lookup_hash: string;
  date_of_birth_ciphertext: string | null;
  date_of_birth_lookup_hash: string | null;

  gender:
    | "Male"
    | "Female"
    | "Other"
    | "Prefer not to say";
  relationship: string;
  status: "ACTIVE" | "INACTIVE";
}

export async function createProtectedPatient(
  patient: CreateProtectedPatientInput
) {

  const supabase =
    await createSupabaseServerClient();

  //------------------------------------------------------
  // Authentication
  //------------------------------------------------------

  const {
    data: {
      user
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
  // Resolve ACTIVE PRIMARY CareVR access
  //------------------------------------------------------

  const {
    data: access,
    error: accessError,
  } = await supabase
    .from("carevr_access")
    .select("family_id")
    .eq("user_id", user.id)
    .eq("access_type", "PRIMARY")
    .eq("access_status", "ACTIVE")
    .not("family_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (accessError) {
    throw accessError;
  }

  if (!access?.family_id) {
    throw new Error(
      "Active PRIMARY CareVR Family could not be resolved."
    );
  }

  //------------------------------------------------------
  // Validate Patient
  //------------------------------------------------------

  const validation =
    patientValidator.validate(patient);

  if (!validation.success) {
    throw new Error(
      validation.error ??
      "Patient validation failed."
    );
  }

  //------------------------------------------------------
  // Patient Limit Validation
  //------------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  if (profile?.role === "STANDARD") {

    const {
      count,
      error: countError,
    } = await supabase
      .from("patients")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("status", "ACTIVE");

    if (countError) {
      throw countError;
    }

    if ((count ?? 0) >= 2) {
      throw new Error(
        "Standard accounts can manage up to two family members. Please upgrade your CareVR plan to add more."
      );
    }
  }

  //------------------------------------------------------
  // Duplicate Patient Validation
  //------------------------------------------------------

  const fullNameLookupHash =
    createLookupHash(
      patient.fullName
    );

  const dateOfBirthLookupHash =
    patient.dateOfBirth
      ? createLookupHash(
          patient.dateOfBirth
        )
      : null;

  let duplicateQuery =
    supabase
      .from("patients")
      .select("id")
      .eq(
        "family_id",
        access.family_id
      )
      .eq(
        "status",
        "ACTIVE"
      )
      .eq(
        "full_name_lookup_hash",
        fullNameLookupHash
      );

  if (dateOfBirthLookupHash) {
    duplicateQuery =
      duplicateQuery.eq(
        "date_of_birth_lookup_hash",
        dateOfBirthLookupHash
      );
  }

  const {
    data: duplicatePatient,
    error: duplicateError,
  } =
    await duplicateQuery.maybeSingle();

  if (duplicateError) {
    throw duplicateError;
  }

  if (duplicatePatient) {
    throw new Error(
      "A patient with the same name and date of birth already exists."
    );
  }


  //------------------------------------------------------
  // Protect Patient data
  //------------------------------------------------------

  const protection =
    protectPatientData(patient);

  //------------------------------------------------------
  // Construct persistence payload
  //------------------------------------------------------

  const persistenceRow:
    ProtectedPatientPersistenceRow = {
    user_id:
      user.id,

    family_id:
      access.family_id,

    // Temporary plaintext compatibility during migration
    full_name:
      patient.fullName,

    date_of_birth:
      patient.dateOfBirth,


    full_name_ciphertext:
      protection.protectedData
        .full_name_ciphertext!,

    full_name_lookup_hash:
      protection.protectedData
        .full_name_lookup_hash!,

    date_of_birth_ciphertext:
      protection.protectedData
        .date_of_birth_ciphertext ??
      null,

    date_of_birth_lookup_hash:
      protection.protectedData
        .date_of_birth_lookup_hash ??
      null,

    gender:
      patient.gender,

    relationship:
      patient.relationship,

    status:
      patient.status,
  };

  //------------------------------------------------------
  // Persist through Supabase RLS
  //------------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("patients")
    .insert(persistenceRow)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Patient could not be created."
    );
  }

  return data;
}
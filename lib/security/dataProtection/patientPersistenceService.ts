import "server-only";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  protectPatientData,
  unprotectPatientData,
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

//------------------------------------------------------
// Update Digital Health Profile
//------------------------------------------------------
//
// Reuse the exact same persistenceRow that was used
// to insert the patient.
//
// No second patient query.
// No second encryption.
// No second family resolution.
//
// DHP is updated for the same user + family.
//------------------------------------------------------

//------------------------------------------------------
// Update Digital Health Profile
//------------------------------------------------------
//
// Reuse the exact same persistenceRow that was used
// to insert the patient.
//
// No second patient query.
// No second encryption.
// No second family resolution.
//
// DHP is updated for the same user + family.
// Existing patient context is preserved and the new
// patient is appended.
//------------------------------------------------------

const {
  data: digitalHealthProfile,
  error: digitalHealthProfileFetchError,
} = await supabase
  .from("digital_health_profile")
  .select("patients")
  .eq("user_id", user.id)
  .eq("family_id", access.family_id)
  .maybeSingle();

if (digitalHealthProfileFetchError) {
  throw digitalHealthProfileFetchError;
}

const existingPatients = Array.isArray(digitalHealthProfile?.patients)
  ? digitalHealthProfile.patients
  : [];

const updatedPatients = [
  ...existingPatients,
  {
    id: data.id,
    ...persistenceRow,
  },
];

const {
  error: digitalHealthProfileError,
} = await supabase
  .from("digital_health_profile")
  .update({
    patients: updatedPatients,
  })
  .eq("user_id", user.id)
  .eq("family_id", access.family_id);

if (digitalHealthProfileError) {
  throw digitalHealthProfileError;
}

return data;
}

export async function getProtectedPatient(
  patientId: string,
  familyId?: string
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
  // Retrieve through Supabase RLS
  //------------------------------------------------------

  let query =
    supabase
      .from("patients")
      .select(
        "id, user_id, family_id, full_name, date_of_birth, full_name_ciphertext, full_name_lookup_hash, date_of_birth_ciphertext, date_of_birth_lookup_hash, gender, relationship, status, created_at, updated_at"
      )
      .eq("id", patientId)
      .eq("status", "ACTIVE");

if (familyId) {
  query =
    query.eq(
      "family_id",
      familyId
    );
}

  const {
    data,
    error,
  } =
    await query.maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  //------------------------------------------------------
  // Decrypt protected fields
  //------------------------------------------------------

  const decrypted =
    unprotectPatientData(
      data as Record<string, unknown>
    );

  //------------------------------------------------------
  // Return application-level patient data
  //------------------------------------------------------

  return {
    id:
      decrypted.id as string,

    userId:
      decrypted.user_id as string,

    familyId:
      decrypted.family_id as string | null,

    fullName:
      decrypted.fullName as string,

    dateOfBirth:
      decrypted.dateOfBirth as string | null,

    gender:
      decrypted.gender as
        | "Male"
        | "Female"
        | "Other"
        | "Prefer not to say"
        | null,

    relationship:
      decrypted.relationship as string | null,

    status:
      decrypted.status as
        | "ACTIVE"
        | "INACTIVE",

    createdAt:
      decrypted.created_at as string,

    updatedAt:
      decrypted.updated_at as string,
  };
}

export async function getProtectedPatientScopeForAccess(
  accessId: string,
  selectedRole:
    | "SELF"
    | "FAMILY"
    | "CARETAKER"
    | "DOCTOR"
) {
  const supabase =
    await createSupabaseServerClient();

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

  const {
    data: access,
    error: accessError,
  } =
    await supabase
      .from("carevr_access")
      .select(
        "id, user_id, family_id, patient_id, access_type, access_status"
      )
      .eq("id", accessId)
      .eq("user_id", user.id)
      .eq("access_status", "ACTIVE")
      .maybeSingle();

  if (accessError) {
    throw accessError;
  }

  if (!access) {
    throw new Error(
      "CareVR access is not available."
    );
  }

  const allowedAccessTypes =
    selectedRole === "SELF"
      ? ["PRIMARY"]
      : selectedRole === "FAMILY"
        ? [
            "PRIMARY",
            "SECONDARY_FAMILY_MEMBER",
          ]
        : selectedRole === "CARETAKER"
          ? ["CARETAKER"]
          : ["DOCTOR"];

  if (
    !allowedAccessTypes.includes(
      access.access_type
    )
  ) {
    throw new Error(
      "Selected CareVR role is not authorized for this access."
    );
  }

  //------------------------------------------------------
  // Resolve Patient Scope from Digital Health Profile
  //------------------------------------------------------
  //
  // Authorization has already been completed above.
  //
  // DHP is now the patient-context read source.
  // No patients-table query.
  // No patient decryption.
  //
  //------------------------------------------------------

  let scope:
    | "SELF_ONLY"
    | "PATIENTS" = "PATIENTS";

  if (
    selectedRole === "SELF"
  ) {
    scope = "SELF_ONLY";

    if (!access.family_id) {
      return {
        scope,
        patients: [],
      };
    }
  } else if (
    !access.patient_id &&
    !access.family_id
  ) {
    return {
      scope,
      patients: [],
    };
  }

  //------------------------------------------------------
  // Load DHP
  //------------------------------------------------------

const digitalHealthProfileQuery =
    supabase
        .from("digital_health_profile")
        .select(`
            patients,
            carevr_access:carevr_access_id!inner (
                access_type,
                access_status
            )
        `)
        .eq(
            "family_id",
            access.family_id
        )
        .eq(
            "digital_health_flag",
            true
        )
        .eq(
            "carevr_access.access_type",
            "PRIMARY"
        )
        .eq(
            "carevr_access.access_status",
            "ACTIVE"
        );

  const {
    data: digitalHealthProfile,
    error: digitalHealthProfileError,
  } =
    await digitalHealthProfileQuery.maybeSingle();

  if (digitalHealthProfileError) {
    throw digitalHealthProfileError;
  }

  const dhpPatients =
    Array.isArray(
      digitalHealthProfile?.patients
    )
      ? digitalHealthProfile.patients
      : [];

  //------------------------------------------------------
  // Apply the same authorized patient scope
  //------------------------------------------------------

  let scopedPatients = dhpPatients.filter(
    (patient) =>
      patient &&
      typeof patient.id === "string" &&
      patient.status === "ACTIVE"
  );

  if (access.patient_id) {
    scopedPatients =
      scopedPatients.filter(
        (patient) =>
          patient.id ===
          access.patient_id
      );
  } else if (access.family_id) {
    scopedPatients =
      scopedPatients.filter(
        (patient) =>
          patient.family_id ===
          access.family_id
      );
  }

  //------------------------------------------------------
  // Return application-level patient scope
  //------------------------------------------------------

  const patients =
    scopedPatients
      .map((patient) => ({
        id:
          patient.id,

        userId:
          patient.user_id as string,

        fullName:
          patient.full_name as string,

        relationship:
          patient.relationship as
            | string
            | null,
      }))
      .sort(
        (a, b) =>
          a.fullName.localeCompare(
            b.fullName
          )
      );

  return {
    scope,
    patients,
  };
}
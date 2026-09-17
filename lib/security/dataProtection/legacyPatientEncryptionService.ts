import "server-only";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  createLookupHash,
  encryptValue,
} from "@/lib/security/encryption/encryptionService";

export type PatientProtectionRole =
  | "SELF"
  | "FAMILY"
  | "CARETAKER"
  | "DOCTOR";

type PatientForProtection = {
  patient_id: string;
  patient_user_id: string;
  patient_family_id: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  status: string;
  full_name_ciphertext: string | null;
  full_name_lookup_hash: string | null;
  date_of_birth_ciphertext: string | null;
  date_of_birth_lookup_hash: string | null;
  access_user_id: string;
  access_type: string;
  access_status: string;
  access_family_id: string | null;
  access_patient_id: string | null;
};

function mapRoleToAccessType(
  role: PatientProtectionRole
):
  | "PRIMARY"
  | "SECONDARY_FAMILY_MEMBER"
  | "CARETAKER"
  | "DOCTOR" {
  switch (role) {
    case "SELF":
      return "PRIMARY";

    case "FAMILY":
      return "SECONDARY_FAMILY_MEMBER";

    case "CARETAKER":
      return "CARETAKER";

    case "DOCTOR":
      return "DOCTOR";

    default:
      throw new Error(
        "Invalid CareVR role for patient protection."
      );
  }
}

export async function encryptPatientsPostRoleAssessment(
  {
    accessId,
    selectedRole,
  }: {
    accessId: string;
    selectedRole: PatientProtectionRole;
  }
): Promise<number> {

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
  } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  //------------------------------------------------------
  // Resolve confirmed CareVR role
  //------------------------------------------------------

const accessType =
  mapRoleToAccessType(selectedRole);

  //------------------------------------------------------
  // Discover ONLY legacy patients applicable to
  // the authenticated user + confirmed role.
  //
  // The RPC contains the locked SQL query semantics.
  //------------------------------------------------------

const {
  data: patients,
  error: discoveryError,
} =
  await supabase.rpc(
    "get_legacy_patients_for_protection",
    {
      p_user_id: user.id,
      p_access_type: accessType,
    }
  );

  if (discoveryError) {
    throw discoveryError;
  }


if (!patients?.length) {
    return 0;
}

  //------------------------------------------------------
  // Protect only the patients returned by the
  // role-scoped legacy discovery query.
  //------------------------------------------------------

  let protectedCount = 0;

for (
  const patient
  of patients as PatientForProtection[]
) {

    const updatePayload: Record<
      string,
      string
    > = {};

    //----------------------------------------------------
    // Full Name
    //----------------------------------------------------

    if (
      patient.full_name &&
      (
        !patient.full_name_ciphertext ||
        !patient.full_name_lookup_hash
      )
    ) {
      updatePayload.full_name_ciphertext =
        encryptValue(
          patient.full_name
        );

      updatePayload.full_name_lookup_hash =
        createLookupHash(
          patient.full_name
        );
    }

    //----------------------------------------------------
    // Date of Birth
    //----------------------------------------------------

    if (
      patient.date_of_birth &&
      (
        !patient.date_of_birth_ciphertext ||
        !patient.date_of_birth_lookup_hash
      )
    ) {
      updatePayload.date_of_birth_ciphertext =
        encryptValue(
          patient.date_of_birth
        );

      updatePayload.date_of_birth_lookup_hash =
        createLookupHash(
          patient.date_of_birth
        );
    }

    //----------------------------------------------------
    // Nothing missing for this patient
    //----------------------------------------------------

    if (
      Object.keys(updatePayload).length === 0
    ) {
      continue;
    }

    //----------------------------------------------------
    // Persist through authenticated Supabase client.
    // RLS remains the enforcement boundary.
    //----------------------------------------------------

    const {
      error: updateError,
    } =
      await supabase
        .from("patients")
        .update(updatePayload)
        .eq(
          "id",
          patient.patient_id
        );

    if (updateError) {
      throw updateError;
    }

    protectedCount++;
  }

  return protectedCount;
}

export const encryptPatientsIfNeeded =
  encryptPatientsPostRoleAssessment;

export const encryptLegacyPatientsPostRoleAssessment =
  encryptPatientsPostRoleAssessment;

export type LegacyPatientProtectionRole =
  PatientProtectionRole;
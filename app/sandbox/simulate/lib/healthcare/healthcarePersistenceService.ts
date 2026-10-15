import "server-only";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export interface SaveHealthcareDetailsRequest {
  patientId: string;

  providerId?: string | null;
  doctorName?: string | null;

  facilityId?: string | null;
  facilityName?: string | null;

  specialisation?: string | null;
}

export interface SavedHealthcareDetails {
  providerId: string;
  facilityId: string | null;
}


export async function saveHealthcareDetails(
  request: SaveHealthcareDetailsRequest,
): Promise<SavedHealthcareDetails> {

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
      "User is not authenticated.",
    );
  }

  //------------------------------------------------------
  // Basic validation
  //------------------------------------------------------

  if (!request.patientId) {
    throw new Error(
      "Patient is required.",
    );
  }

  const doctorName =
    request.doctorName?.trim() ?? "";

  const facilityName =
    request.facilityName?.trim() ?? "";

  const specialisation =
    request.specialisation?.trim() ?? "";

  //------------------------------------------------------
  // Resolve ACTIVE PRIMARY CareVR access
  //------------------------------------------------------

  const {
    data: access,
    error: accessError,
  } =
    await supabase
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
      "Active PRIMARY CareVR Family could not be resolved.",
    );
  }

  //------------------------------------------------------
  // Validate patient belongs to PRIMARY family
  //------------------------------------------------------

  const {
    data: patient,
    error: patientError,
  } =
    await supabase
      .from("patients")
      .select("id, family_id")
      .eq("id", request.patientId)
      .eq("family_id", access.family_id)
      .maybeSingle();

  if (patientError) {
    throw patientError;
  }

  if (!patient) {
    throw new Error(
      "Selected patient is not authorized.",
    );
  }

  //------------------------------------------------------
  // Resolve Doctor
  //------------------------------------------------------

  let providerId =
    request.providerId ?? null;

  if (!providerId) {

    if (!doctorName) {
      throw new Error(
        "Doctor is required.",
      );
    }

    const {
      data: existingProvider,
      error: providerLookupError,
    } =
      await supabase
        .from("healthcare_providers")
        .select(
          "id, specialization, is_active",
        )
        .eq("name", doctorName)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

    if (providerLookupError) {
      throw providerLookupError;
    }

    if (existingProvider) {

      providerId =
        existingProvider.id;

    } else {

      const {
        data: createdProvider,
        error: providerCreateError,
      } =
        await supabase
          .from("healthcare_providers")
          .insert({
            name: doctorName,
            provider_type: "DOCTOR",
            specialization:
              specialisation || null,
            is_active: true,
          })
          .select("id")
          .single();

      if (providerCreateError) {
        throw providerCreateError;
      }

      if (!createdProvider) {
        throw new Error(
          "Doctor could not be created.",
        );
      }

      providerId =
        createdProvider.id;
    }

  } else {

    //----------------------------------------------------
    // Existing doctor selected
    //
    // Update specialization only when the user supplied
    // a value.
    //----------------------------------------------------

    if (specialisation) {

      const {
        error: providerUpdateError,
      } =
        await supabase
          .from("healthcare_providers")
          .update({
            specialization:
              specialisation,
          })
          .eq("id", providerId)
          .eq("is_active", true);

      if (providerUpdateError) {
        throw providerUpdateError;
      }
    }
  }

  //------------------------------------------------------
  // Resolve Hospital
  //------------------------------------------------------

  let facilityId =
    request.facilityId ?? null;

  if (!facilityId && facilityName) {

    const {
      data: existingFacility,
      error: facilityLookupError,
    } =
      await supabase
        .from("healthcare_facilities")
        .select("id")
        .eq("name", facilityName)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

    if (facilityLookupError) {
      throw facilityLookupError;
    }

    if (existingFacility) {

      facilityId =
        existingFacility.id;

    } else {

      const {
        data: createdFacility,
        error: facilityCreateError,
      } =
        await supabase
          .from("healthcare_facilities")
          .insert({
            name: facilityName,
            facility_type: "HOSPITAL",
            city: "Not Specified",
            country: "India",
            is_active: true,
          })
          .select("id")
          .single();

      if (facilityCreateError) {
        throw facilityCreateError;
      }

      if (!createdFacility) {
        throw new Error(
          "Hospital could not be created.",
        );
      }

      facilityId =
        createdFacility.id;
    }
  }

  //------------------------------------------------------
  // Associate Doctor with Hospital
  //------------------------------------------------------

  if (facilityId) {

    const {
      data: existingAssociation,
      error: associationLookupError,
    } =
      await supabase
        .from("healthcare_provider_facilities")
        .select("id")
        .eq(
          "provider_id",
          providerId,
        )
        .eq(
          "facility_id",
          facilityId,
        )
        .limit(1)
        .maybeSingle();

    if (associationLookupError) {
      throw associationLookupError;
    }

    if (!existingAssociation) {

      const {
        error: associationCreateError,
      } =
        await supabase
          .from("healthcare_provider_facilities")
          .insert({
            provider_id:
              providerId,
            facility_id:
              facilityId,
            is_primary: true,
          });

      if (associationCreateError) {
        throw associationCreateError;
      }
    }
  }

  //------------------------------------------------------
  // Resolve patient ↔ doctor relationship
  //------------------------------------------------------

  const {
    data: existingPatientDoctor,
    error: patientDoctorLookupError,
  } =
    await supabase
      .from("patient_doctors")
      .select("id, facility_id")
      .eq(
        "patient_id",
        request.patientId,
      )
      .eq(
        "provider_id",
        providerId,
      )
      .eq(
        "is_active",
        true,
      )
      .limit(1)
      .maybeSingle();

  if (patientDoctorLookupError) {
    throw patientDoctorLookupError;
  }

  if (existingPatientDoctor) {

    const {
      error: patientDoctorUpdateError,
    } =
      await supabase
        .from("patient_doctors")
        .update({
          facility_id:
            facilityId,
        })
        .eq(
          "id",
          existingPatientDoctor.id,
        );

    if (patientDoctorUpdateError) {
      throw patientDoctorUpdateError;
    }

  } else {

    const {
      error: patientDoctorCreateError,
    } =
      await supabase
        .from("patient_doctors")
        .insert({
          patient_id:
            request.patientId,
          provider_id:
            providerId,
          facility_id:
            facilityId,
          is_primary: true,
          is_active: true,
        });

    if (patientDoctorCreateError) {
      throw patientDoctorCreateError;
    }
  }

if (!providerId) {
  throw new Error(
    "Doctor could not be resolved.",
  );
}

return {
  providerId,
  facilityId,
};
}
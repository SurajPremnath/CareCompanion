import "server-only";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export interface DoctorsNoteDoctorOption {
  providerId: string;
  doctorName: string;
  specialisation: string | null;
  facilityId: string | null;
  facilityName: string | null;
}

export class DoctorsNotesOptionsRepository {
  async getForPatient(
    patientId: string,
  ): Promise<DoctorsNoteDoctorOption[]> {
    const supabase =
      await createSupabaseServerClient();

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

    if (!patientId) {
      return [];
    }

    const {
      data,
      error,
    } = await supabase
      .from("patient_doctors")
      .select(`
        provider_id,
        facility_id,
        healthcare_providers (
          id,
          name,
          specialization
        ),
        healthcare_facilities (
          id,
          name
        )
      `)
      .eq("patient_id", patientId)
      .eq("is_active", true);

    if (error) {
      throw error;
    }

    return (data ?? [])
      .map((row) => {
        const provider =
          Array.isArray(
            row.healthcare_providers,
          )
            ? row.healthcare_providers[0]
            : row.healthcare_providers;

        const facility =
          Array.isArray(
            row.healthcare_facilities,
          )
            ? row.healthcare_facilities[0]
            : row.healthcare_facilities;

        if (!provider) {
          return null;
        }

        return {
          providerId: row.provider_id,
          doctorName: provider.name,
          specialisation:
            provider.specialization ?? null,
          facilityId:
            row.facility_id ?? null,
          facilityName:
            facility?.name ?? null,
        };
      })
      .filter(
        (
          doctor,
        ): doctor is DoctorsNoteDoctorOption =>
          doctor !== null,
      );
  }
}

export const doctorsNotesOptionsRepository =
  new DoctorsNotesOptionsRepository();
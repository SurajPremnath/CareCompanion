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

export interface DoctorsNotesSuggestions {
  doctors: DoctorsNoteDoctorOption[];
  hospitals: string[];
  specialities: string[];
}

export class DoctorsNotesOptionsRepository {
  private async getAuthenticatedClient() {
    const supabase =
      await createSupabaseServerClient();

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

    return supabase;
  }

  async getForPatient(
    patientId: string,
  ): Promise<DoctorsNoteDoctorOption[]> {
    const supabase = await this.getAuthenticatedClient();

    if (!patientId) {
      return [];
    }

    const { data, error } = await supabase
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
        const provider = Array.isArray(row.healthcare_providers)
          ? row.healthcare_providers[0]
          : row.healthcare_providers;

        const facility = Array.isArray(row.healthcare_facilities)
          ? row.healthcare_facilities[0]
          : row.healthcare_facilities;

        if (!provider) {
          return null;
        }

        return {
          providerId: row.provider_id,
          doctorName: provider.name,
          specialisation: provider.specialization ?? null,
          facilityId: row.facility_id ?? null,
          facilityName: facility?.name ?? null,
        };
      })
      .filter(
        (doctor): doctor is DoctorsNoteDoctorOption =>
          doctor !== null,
      );
  }

  async getSuggestions(): Promise<DoctorsNotesSuggestions> {
    const supabase = await this.getAuthenticatedClient();

    const [
      providersResult,
      facilitiesResult,
      associationsResult,
    ] = await Promise.all([
      supabase
        .from("healthcare_providers")
        .select("id, name, specialization")
        .eq("provider_type", "DOCTOR")
        .eq("is_active", true)
        .order("name"),

      supabase
        .from("healthcare_facilities")
        .select("id, name")
        .eq("is_active", true)
        .order("name"),

      supabase
        .from("healthcare_provider_facilities")
        .select("provider_id, facility_id, is_primary")
        .order("is_primary", { ascending: false }),
    ]);

    if (providersResult.error) {
      throw providersResult.error;
    }

    if (facilitiesResult.error) {
      throw facilitiesResult.error;
    }

    if (associationsResult.error) {
      throw associationsResult.error;
    }

    const providers = providersResult.data ?? [];
    const facilities = facilitiesResult.data ?? [];
    const associations = associationsResult.data ?? [];

    const facilitiesById = new Map(
      facilities.map((facility) => [
        facility.id,
        facility.name,
      ]),
    );

    const associationByProvider = new Map<
      string,
      { facilityId: string; facilityName: string }
    >();

    for (const association of associations) {
      if (
        !associationByProvider.has(association.provider_id) &&
        facilitiesById.has(association.facility_id)
      ) {
        associationByProvider.set(
          association.provider_id,
          {
            facilityId: association.facility_id,
            facilityName: facilitiesById.get(
              association.facility_id,
            )!,
          },
        );
      }
    }

    const doctors: DoctorsNoteDoctorOption[] =
      providers.map((provider) => {
        const association =
          associationByProvider.get(provider.id);

        return {
          providerId: provider.id,
          doctorName: provider.name,
          specialisation: provider.specialization ?? null,
          facilityId: association?.facilityId ?? null,
          facilityName: association?.facilityName ?? null,
        };
      });

    const hospitals = [
      ...new Set(
        facilities
          .map((facility) => facility.name?.trim())
          .filter((name): name is string => Boolean(name)),
      ),
    ].sort((a, b) => a.localeCompare(b));

    const specialities = [
      ...new Set(
        providers
          .map((provider) => provider.specialization?.trim())
          .filter((name): name is string => Boolean(name)),
      ),
    ].sort((a, b) => a.localeCompare(b));

    return {
      doctors,
      hospitals,
      specialities,
    };
  }
}

export const doctorsNotesOptionsRepository =
  new DoctorsNotesOptionsRepository();

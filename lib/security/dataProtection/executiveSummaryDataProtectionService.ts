import "server-only";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    unprotectPatientData,
} from "@/lib/security/dataProtection/patientDataProtectionService";

import {
    getProtectedPatientScopeForAccess,
} from "@/lib/security/dataProtection/patientPersistenceService";

export interface ExecutiveSummaryPatientContext {
    id: string;
    fullName: string;
    dateOfBirth: string | null;
    gender:
        | "Male"
        | "Female"
        | "Other"
        | "Prefer not to say"
        | null;
    status:
        | "ACTIVE"
        | "INACTIVE";
}

export interface ExecutiveSummaryDoctorContext {
    providerId: string;
    doctorName: string;
    specialisation: string | null;
    facilityId: string | null;
    hospitalName: string | null;
}

export interface ExecutiveSummaryPatientContextResult {
    patient: ExecutiveSummaryPatientContext;
    doctors: ExecutiveSummaryDoctorContext[];
}

export async function getExecutiveSummaryPatientContext(
    patientId: string,
    accessId: string,
    selectedRole:
        | "SELF"
        | "FAMILY"
        | "CARETAKER"
        | "DOCTOR",
): Promise<ExecutiveSummaryPatientContextResult> {

    if (!patientId) {
        throw new Error(
            "Patient is required.",
        );
    }

    if (!accessId) {
        throw new Error(
            "CareVR access is required.",
        );
    }

const scopedPatients =
    await getProtectedPatientScopeForAccess(
        accessId,
        selectedRole,
    );

const patientIsInScope =
    scopedPatients.patients.some(
        (patient) =>
            patient.id === patientId,
    );

if (!patientIsInScope) {
    throw new Error(
        "Selected patient is not available in the current CareVR context.",
    );
}

    const supabase =
        await createSupabaseServerClient();

    const {
        data: patientRow,
        error: patientError,
    } =
        await supabase
            .from("patients")
            .select(
                `
                id,
                user_id,
                family_id,
                full_name,
                date_of_birth,
                full_name_ciphertext,
                full_name_lookup_hash,
                date_of_birth_ciphertext,
                date_of_birth_lookup_hash,
                gender,
                relationship,
                status,
                created_at,
                updated_at
                `,
            )
            .eq("id", patientId)
            .eq("status", "ACTIVE")
            .maybeSingle();

    if (patientError) {
        throw patientError;
    }

    if (!patientRow) {
        throw new Error(
            "Selected patient could not be found.",
        );
    }

    const decryptedPatient =
        unprotectPatientData(
            patientRow as Record<string, unknown>,
        );

    const {
        data: doctorRows,
        error: doctorError,
    } =
        await supabase
            .from("patient_doctors")
            .select(
                `
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
                `,
            )
            .eq(
                "patient_id",
                patientId,
            )
            .eq(
                "is_active",
                true,
            );

    if (doctorError) {
        throw doctorError;
    }

    const doctors =
        (doctorRows ?? [])
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
                    providerId:
                        row.provider_id,

                    doctorName:
                        provider.name,

                    specialisation:
                        provider.specialization ??
                        null,

                    facilityId:
                        row.facility_id ??
                        null,

                    hospitalName:
                        facility?.name ??
                        null,
                };
            })
            .filter(
                (
                    doctor,
                ): doctor is ExecutiveSummaryDoctorContext =>
                    doctor !== null,
            );

    return {
        patient: {
            id:
                decryptedPatient.id as string,

            fullName:
                decryptedPatient.fullName as string,

            dateOfBirth:
                decryptedPatient.dateOfBirth as
                    | string
                    | null,

            gender:
                decryptedPatient.gender as
                    | "Male"
                    | "Female"
                    | "Other"
                    | "Prefer not to say"
                    | null,

            status:
                decryptedPatient.status as
                    | "ACTIVE"
                    | "INACTIVE",
        },

        doctors,
    };
}
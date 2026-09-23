import "server-only";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

export async function runVerifyPinAccessDiagnostic() {
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
            "User is not authenticated."
        );
    }

    const {
        data: accessRows,
        error: accessError,
    } =
        await supabase
            .from("carevr_access")
            .select(`
                id,
                user_id,
                family_id,
                patient_id,
                access_type,
                access_status
            `)
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "access_status",
                "ACTIVE"
            )
            .order(
                "created_at",
                {
                    ascending: true,
                }
            );

    if (accessError) {
        throw accessError;
    }

    const accessRecords =
        accessRows ?? [];

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_access",
        accessRecords.map(
            (access) => ({
                id: access.id,
                userId:
                    access.user_id,
                familyId:
                    access.family_id,
                patientId:
                    access.patient_id,
                accessType:
                    access.access_type,
                accessStatus:
                    access.access_status,
            })
        )
    );

    return accessRecords;
}
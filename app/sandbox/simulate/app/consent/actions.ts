"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function markDigitalHealthConsentAccepted(): Promise<{
    success: true;
}> {

    const serverSupabase =
        await createSupabaseServerClient();

    const {
        data: {
            user
        },
        error: userError
    } =
        await serverSupabase.auth.getUser();

    if (
        userError ||
        !user
    ) {
        throw new Error(
            "Authentication is required to update the digital health profile."
        );
    }

    const {
        error
    } =
        await serverSupabase
            .from("digital_health_profile")
            .update({
                consent_status:
                    "ACCEPTED",

                digital_health_flag:
                    true,

                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "invitation_status",
                "ACCEPTED"
            );

    if (error) {

        console.error(
            "Unable to update digital health profile after consent.",
            error
        );

        throw new Error(
            "Unable to update the digital health profile."
        );
    }

    return {
        success: true,
    };
}
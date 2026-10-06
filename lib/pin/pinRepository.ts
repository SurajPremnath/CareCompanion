import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface CareVRPinRecord {
    id: string;
    userId: string;
    pinHash: string;
    failedAttempts: number;
    lockedUntil: string | null;
    lockoutLevel: number;
}

export async function getCareVRPinRecord(
    userId: string
): Promise<CareVRPinRecord | null> {

    const {
        data,
        error,
    } =
        await supabaseAdmin
            .from("carevr_pin")
            .select(
                "id, user_id, pin_hash, failed_attempts, locked_until, lockout_level"
            )
            .eq(
                "user_id",
                userId
            )
            .maybeSingle();

    if (error) {
        throw new Error(
            error.message ||
            "Unable to retrieve the CareVR PIN record."
        );
    }

    if (!data) {
        return null;
    }

return {
    id:
        data.id,

    userId:
        data.user_id,

    pinHash:
        data.pin_hash,

        failedAttempts:
            data.failed_attempts,

        lockedUntil:
            data.locked_until,

        lockoutLevel:
            data.lockout_level,
    };
}

export async function recordSuccessfulPinVerification(
    userId: string
): Promise<void> {

    const {
        error,
    } =
        await supabaseAdmin
            .from("carevr_pin")
            .update({
                failed_attempts: 0,
                lockout_level: 0,
                locked_until: null,
                last_verified_at:
                    new Date().toISOString(),
                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "user_id",
                userId
            );

    if (error) {
        throw new Error(
            error.message ||
            "Unable to update the CareVR PIN verification state."
        );
    }
}

export async function hasCareVRPin(
    userId: string
): Promise<boolean> {
    const {
        data,
        error,
    } = await supabaseAdmin
        .from("carevr_pin")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw new Error(
            error.message ||
            "Unable to determine CareVR PIN status."
        );
    }

    return Boolean(data);
}

export async function updateCareVRPin(
    userId: string,
    pinHash: string
): Promise<void> {

    const {
        error,
    } =
        await supabaseAdmin
            .from("carevr_pin")
            .update({
                pin_hash: pinHash,
                failed_attempts: 0,
                lockout_level: 0,
                locked_until: null,
                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "user_id",
                userId
            );

    if (error) {
        throw new Error(
            error.message ||
            "Unable to update the CareVR PIN."
        );
    }
}
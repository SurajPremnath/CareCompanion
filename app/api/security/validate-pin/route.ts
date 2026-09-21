import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
    verifyPin,
} from "@/lib/pin/pinSecurityService";

import {
    getCareVRPinRecord,
    recordSuccessfulPinVerification,
} from "@/lib/pin/pinRepository";

export async function POST(
    request: Request
) {
    try {
        const supabase =
            await createSupabaseServerClient();

        const {
            data: { user },
            error: userError,
        } =
            await supabase.auth.getUser();

        if (
            userError ||
            !user
        ) {
            return NextResponse.json(
                {
                    error:
                        "You must be signed in to verify your CareVR PIN.",
                },
                {
                    status: 401,
                }
            );
        }

        const body =
            await request.json();

        const pin =
            body?.pin;

        if (
            typeof pin !== "string" ||
            !/^\d{6}$/.test(pin)
        ) {
            return NextResponse.json(
                {
                    error:
                        "CareVR PIN must contain exactly 6 digits.",
                },
                {
                    status: 400,
                }
            );
        }

        const pinRecord =
            await getCareVRPinRecord(
                user.id
            );

        if (!pinRecord) {
            return NextResponse.json(
                {
                    error:
                        "CareVR PIN has not been created for this account.",
                    pinRequired: true,
                },
                {
                    status: 404,
                }
            );
        }

        if (
            pinRecord.lockoutLevel >= 4
        ) {
            return NextResponse.json(
                {
                    error:
                        "Your CareVR PIN access requires account recovery.",
                    escalationRequired: true,
                },
                {
                    status: 423,
                }
            );
        }

        if (
            pinRecord.lockedUntil
        ) {
            const lockedUntil =
                new Date(
                    pinRecord.lockedUntil
                );

            if (
                lockedUntil.getTime() >
                Date.now()
            ) {
                const remainingSeconds =
                    Math.ceil(
                        (
                            lockedUntil.getTime() -
                            Date.now()
                        ) / 1000
                    );

                return NextResponse.json(
                    {
                        error:
                            "Your CareVR PIN is temporarily locked. Please try again later.",
                        locked: true,
                        lockedUntil:
                            pinRecord.lockedUntil,
                        remainingSeconds,
                    },
                    {
                        status: 423,
                    }
                );
            }
        }

        const isValid =
            await verifyPin(
                pin,
                pinRecord.pinHash
            );

        if (isValid) {

            await recordSuccessfulPinVerification(
                user.id
            );

            return NextResponse.json({
                success: true,
            });
        }

        /*
         * The failed-attempt counter and progressive
         * lockout are handled by the database function.
         */
const {
    data: failureState,
    error: failureError,
} =
    await supabaseAdmin.rpc(
        "carevr_pin_record_failure",
        {
            p_user_id:
                user.id,
        }
    );

        if (failureError) {
            throw new Error(
                failureError.message ||
                "Unable to record the failed PIN attempt."
            );
        }

        const state =
            Array.isArray(failureState)
                ? failureState[0]
                : failureState;

if (
    state?.escalation_required === true
) {
    return NextResponse.json(
        {
            error:
                "Your CareVR PIN access requires account recovery.",
            escalationRequired: true,
            lockoutLevel:
                Number(
                    state?.lockout_level ?? 4
                ),
        },
        {
            status: 423
        }
    );
}

if (
    state?.locked_until
) {
    return NextResponse.json(
        {
            error:
                "Too many incorrect PIN attempts. Your CareVR PIN has been temporarily locked.",
            locked: true,
            lockedUntil:
                state.locked_until,
            lockoutLevel:
                Number(
                    state?.lockout_level ?? 0
                ),
        },
        {
            status: 423,
        }
    );
}

        const failedAttempts =
            Number(
                state?.failed_attempts ?? 0
            );

        const attemptsRemaining =
            Math.max(
                0,
                3 - failedAttempts
            );

        return NextResponse.json(
            {
                error:
                    "Incorrect CareVR PIN.",
                attemptsRemaining,
            },
            {
                status: 401,
            }
        );

    } catch {
        return NextResponse.json(
            {
                error:
                    "Unable to verify your CareVR PIN.",
            },
            {
                status: 500,
            }
        );
    }
}
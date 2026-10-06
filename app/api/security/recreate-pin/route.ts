import { NextResponse } from "next/server";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    hashPin,
    verifyPin,
} from "@/lib/pin/pinSecurityService";

import {
    getCareVRPinRecord,
    updateCareVRPin,
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

        if (userError || !user) {
            return NextResponse.json(
                {
                    error:
                        "You must be signed in to reset your CareVR PIN.",
                },
                {
                    status: 401,
                }
            );
        }

        const body =
            await request.json();

        const currentPin =
            body?.currentPin;

        const newPin =
            body?.newPin;

        if (
            typeof currentPin !== "string" ||
            !/^\d{6}$/.test(currentPin)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Current CareVR PIN must contain exactly 6 digits.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            typeof newPin !== "string" ||
            !/^\d{6}$/.test(newPin)
        ) {
            return NextResponse.json(
                {
                    error:
                        "New CareVR PIN must contain exactly 6 digits.",
                },
                {
                    status: 400,
                }
            );
        }

        if (currentPin === newPin) {
            return NextResponse.json(
                {
                    error:
                        "Your new PIN must be different from your current PIN.",
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
                        "No CareVR PIN exists for this account.",
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
                        "Your CareVR PIN requires additional verification before it can be reset.",
                    escalationRequired: true,
                },
                {
                    status: 423,
                }
            );
        }

        if (
            pinRecord.lockedUntil &&
            new Date(
                pinRecord.lockedUntil
            ).getTime() >
                Date.now()
        ) {
            return NextResponse.json(
                {
                    error:
                        "Your CareVR PIN is temporarily locked. Please try again later.",
                    locked: true,
                    lockedUntil:
                        pinRecord.lockedUntil,
                },
                {
                    status: 423,
                }
            );
        }

        const isValid =
            await verifyPin(
                currentPin,
                pinRecord.pinHash
            );

        if (!isValid) {
            return NextResponse.json(
                {
                    error:
                        "Current CareVR PIN is incorrect.",
                },
                {
                    status: 401,
                }
            );
        }

        const newPinHash =
            await hashPin(newPin);

        await updateCareVRPin(
            user.id,
            newPinHash
        );

        return NextResponse.json({
            success: true,
        });

    } catch (error) {
        console.error(
            "CareVR PIN reset failed:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Unable to reset your CareVR PIN.",
            },
            {
                status: 500,
            }
        );
    }
}
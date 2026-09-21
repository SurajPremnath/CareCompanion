import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hashPin } from "@/lib/pin/pinSecurityService";

export async function POST(request: Request) {
    try {
        const supabase =
            await createSupabaseServerClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                {
                    error:
                        "You must be signed in to create a CareVR PIN.",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const pin = body?.pin;

        if (
            typeof pin !== "string" ||
            !/^\d{6}$/.test(pin)
        ) {
            return NextResponse.json(
                {
                    error:
                        "CareVR PIN must contain exactly 6 digits.",
                },
                { status: 400 }
            );
        }

        const pinHash = await hashPin(pin);

        const { error: insertError } =
            await supabase
                .from("carevr_pin")
                .insert({
                    user_id: user.id,
                    pin_hash: pinHash,
                });

if (insertError) {
    console.error(
        "CareVR PIN insert failed:",
        insertError
    );

    return NextResponse.json(
        {
            error:
                insertError.message ||
                "Unable to save your CareVR PIN.",
        },
        { status: 500 }
    );
}

        return NextResponse.json({
            success: true,
        });
    } catch {
        return NextResponse.json(
            {
                error:
                    "Unable to save your CareVR PIN.",
            },
            { status: 500 }
        );
    }
}
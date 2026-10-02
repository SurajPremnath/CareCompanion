import { NextResponse } from "next/server";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    hasCareVRPin,
} from "@/lib/pin/pinRepository";

export async function GET() {
    try {
const supabaseStartedAt =
    performance.now();

const supabase =
    await createSupabaseServerClient();

const supabaseClientReadyAt =
    performance.now();


const userStartedAt =
    performance.now();

const {
    data: { user },
    error: userError,
} =
    await supabase.auth.getUser();

const userCompletedAt =
    performance.now();


if (userError || !user) {
    return NextResponse.json(
        {
            error:
                "You must be signed in.",
        },
        { status: 401 }
    );
}

const pinStartedAt =
    performance.now();

const hasPin =
    await hasCareVRPin(user.id);

const pinCompletedAt =
    performance.now();


        return NextResponse.json({
            hasPin,
        });
    } catch {
        return NextResponse.json(
            {
                error:
                    "Unable to determine CareVR PIN status.",
            },
            { status: 500 }
        );
    }
}
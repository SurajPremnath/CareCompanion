import { NextResponse } from "next/server";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    hasCareVRPin,
} from "@/lib/pin/pinRepository";

export async function GET() {
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
                        "You must be signed in.",
                },
                { status: 401 }
            );
        }

        const hasPin =
            await hasCareVRPin(user.id);

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
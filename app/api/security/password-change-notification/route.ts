import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { passwordChangeEmailService } from "@/lib/email/passwordChangeEmailService";

export async function POST() {
    try {
        const supabase =
            await createSupabaseServerClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: "Authentication required." },
                { status: 401 }
            );
        }

        if (!user.email) {
            return NextResponse.json(
                { error: "Authenticated email address is unavailable." },
                { status: 400 }
            );
        }

        const {
            data: profile,
            error: profileError,
        } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: "Unable to retrieve your profile name." },
                { status: 500 }
            );
        }

        await passwordChangeEmailService.send({
            to: user.email,
            name: profile.full_name?.trim() || "CareVR User",
            changedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "CareVR password-change notification failed.",
            error
        );

        return NextResponse.json(
            {
                error:
                    "The password-change notification could not be sent.",
            },
            { status: 500 }
        );
    }
}
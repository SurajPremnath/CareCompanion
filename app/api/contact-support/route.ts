
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileRepository } from "@/lib/repositories/profileRepository";
import { sendContactSupportEmail } from "@/lib/email/contactSupportEmailService";

const allowedCategories = new Set([
    "Account and Login",
    "PIN and Security",
    "Family and Patient Profiles",
    "Health Records and Reports",
    "Invitations and Access",
    "Technical Issue",
    "Other",
]);

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Please sign in to contact support." },
                { status: 401 }
            );
        }

        const body: unknown = await request.json();

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { success: false, error: "Invalid request." },
                { status: 400 }
            );
        }

        const input = body as Record<string, unknown>;
        const category = typeof input.category === "string" ? input.category.trim() : "";
        const subject = typeof input.subject === "string" ? input.subject.trim() : "";
        const message = typeof input.message === "string" ? input.message.trim() : "";

        if (!allowedCategories.has(category)) {
            return NextResponse.json(
                { success: false, error: "Please select a valid support category." },
                { status: 400 }
            );
        }

        if (subject.length < 3 || subject.length > 120) {
            return NextResponse.json(
                { success: false, error: "Subject must be between 3 and 120 characters." },
                { status: 400 }
            );
        }

        if (message.length < 10 || message.length > 5000) {
            return NextResponse.json(
                { success: false, error: "Message must be between 10 and 5000 characters." },
                { status: 400 }
            );
        }

        const profile = await profileRepository.getCurrentProfile();

        const name =
            typeof profile?.fullName === "string" && profile.fullName.trim()
                ? profile.fullName.trim()
                : typeof user.user_metadata?.full_name === "string"
                  ? user.user_metadata.full_name.trim()
                  : "CareVR User";

        const email = user.email?.trim().toLowerCase();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Your registered email address is unavailable." },
                { status: 400 }
            );
        }

        await sendContactSupportEmail({
            name,
            email,
            category,
            subject,
            message,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact support submission failed.", error);

        return NextResponse.json(
            {
                success: false,
                error: "We could not send your request right now. Please try again later.",
            },
            { status: 500 }
        );
    }
}


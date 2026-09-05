import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const VALID_ROLES = [
    "SELF",
    "DOCTOR",
    "CARETAKER",
    "FAMILY",
] as const;

export async function GET(
    request: Request
) {

const { searchParams, origin } =
    new URL(request.url);

const code =
    searchParams.get("code");

const selectedRole =
    searchParams.get("role");

const role =
    selectedRole &&
    VALID_ROLES.includes(
        selectedRole as typeof VALID_ROLES[number]
    )
        ? selectedRole
        : "SELF";

const supabase =
    await createSupabaseServerClient();

if (code) {

    await supabase.auth.exchangeCodeForSession(
        code
    );

}

return NextResponse.redirect(
    new URL(
        `/auth/callback/complete?role=${encodeURIComponent(role)}`,
        origin
    )
);

}
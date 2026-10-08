import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export async function GET() {
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
          error: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("permanent_password_expires_at")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        {
          error:
            "Unable to determine password status.",
        },
        { status: 500 }
      );
    }

    const expiresAt =
      profile?.permanent_password_expires_at ?? null;

    const isExpired =
      expiresAt !== null &&
      new Date(expiresAt).getTime() <= Date.now();

    return NextResponse.json({
      isExpired,
      expiresAt,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to determine password status.",
      },
      { status: 500 }
    );
  }
}
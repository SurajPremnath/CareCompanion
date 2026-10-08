import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  isPasswordReused,
  recordPasswordHistory,
} from "@/lib/security/password/passwordHistoryService";

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
            "You must be signed in.",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const newPassword =
      typeof body?.newPassword ===
      "string"
        ? body.newPassword
        : "";

    if (!newPassword) {
      return NextResponse.json(
        {
          error:
            "New password is required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const reused =
      await isPasswordReused(
        user.id,
        newPassword
      );

    if (reused) {
      return NextResponse.json(
        {
          error:
            "Your new password must be different from your previous password.",
        },
        { status: 409 }
      );
    }

    const {
      error: updateError,
    } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      return NextResponse.json(
        {
          error:
            "Unable to change your password.",
        },
        { status: 400 }
      );
    }

    await recordPasswordHistory(
      user.id,
      newPassword
    );

    const now =
      new Date();

    const permanentPasswordExpiresAt =
      new Date(now);

    permanentPasswordExpiresAt.setMonth(
      permanentPasswordExpiresAt.getMonth() + 2
    );

    const {
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .update({
          password_changed_at:
            now.toISOString(),
          password_changed_by:
            user.id,
          permanent_password_expires_at:
            permanentPasswordExpiresAt.toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
      console.error(
        "Unable to update password lifecycle.",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Password was changed, but the account lifecycle could not be completed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresAt:
        permanentPasswordExpiresAt.toISOString(),
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to change your password.",
      },
      { status: 500 }
    );
  }
}
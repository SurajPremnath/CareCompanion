import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  isPasswordReused,
  recordPasswordHistory,
} from "@/lib/security/password/passwordHistoryService";

import {
  passwordChangeEmailService,
} from "@/lib/email/passwordChangeEmailService";

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
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const newPassword =
      typeof body?.newPassword === "string"
        ? body.newPassword
        : "";

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required." },
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

    const {
      data: profile,
      error: profileLookupError,
    } = await supabase
      .from("profiles")
      .select(
        "temporary_password_expires_at, permanent_password_expires_at"
      )
      .eq("id", user.id)
      .single();

    if (profileLookupError || !profile) {
      return NextResponse.json(
        {
          error:
            "Unable to verify password lifecycle.",
        },
        { status: 500 }
      );
    }

    const isTemporaryPassword =
      Boolean(profile.temporary_password_expires_at);

    const storedPermanentPasswordExpiresAt =
      profile.permanent_password_expires_at;

    const isPermanentPasswordExpired =
      typeof storedPermanentPasswordExpiresAt === "string" &&
      !Number.isNaN(
        new Date(storedPermanentPasswordExpiresAt).getTime()
      ) &&
      new Date(storedPermanentPasswordExpiresAt).getTime() <=
        Date.now();

    if (
      isTemporaryPassword ||
      !isPermanentPasswordExpired
    ) {
      return NextResponse.json(
        {
          error:
            "This password-change process is available only for an expired permanent password.",
        },
        { status: 403 }
      );
    }

    const reused = await isPasswordReused(
      user.id,
      newPassword
    );

    if (reused) {
      return NextResponse.json(
        {
          error:
            "Your new password cannot be the same as any of your last 3 recorded passwords.",
        },
        { status: 409 }
      );
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      return NextResponse.json(
        { error: "Unable to change your password." },
        { status: 400 }
      );
    }

    // Do not add temporary invitation passwords to history.
    // For a permanent password change, record the newly set password.
    if (!isTemporaryPassword) {
      try {
        await recordPasswordHistory(
          user.id,
          newPassword
        );
      } catch (historyError) {
        console.error(
          "Password changed, but history recording failed.",
          historyError
        );

        return NextResponse.json(
          {
            error:
              "Your password was changed, but password history could not be saved. Please contact support before attempting another change.",
            passwordChanged: true,
          },
          { status: 500 }
        );
      }
    }

    const now = new Date();
    const permanentPasswordExpiresAt =
      new Date(now);

    permanentPasswordExpiresAt.setMonth(
      permanentPasswordExpiresAt.getMonth() + 2
    );

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          password_changed_at: now.toISOString(),
          password_changed_by: user.id,
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
            "Your password was changed, but its expiry information could not be updated.",
          passwordChanged: true,
        },
        { status: 500 }
      );
    }

    // Send the security notification only after the
    // password and expiry metadata have been updated.
    // Email failure must not undo the password change.
    if (user.email) {
      try {
        await passwordChangeEmailService.send({
          to: user.email,
          changedAt: now.toISOString(),
        });
      } catch (notificationError) {
        console.error(
          "Password changed successfully, but the security notification could not be sent.",
          notificationError
        );
      }
    } else {
      console.error(
        "Password changed successfully, but the authenticated user's email is unavailable."
      );
    }

    return NextResponse.json({
      success: true,
      expiresAt:
        permanentPasswordExpiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { error: "Unable to change your password." },
      { status: 500 }
    );
  }
}
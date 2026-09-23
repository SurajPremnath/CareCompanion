import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

const password =
  typeof body.password === "string"
    ? body.password
    : "";

const captchaToken =
  typeof body.captchaToken === "string"
    ? body.captchaToken
    : "";

if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

if (!password) {
  return NextResponse.json(
    { message: "Password is required." },
    { status: 400 }
  );
}

if (!captchaToken) {
  return NextResponse.json(
    { message: "Security verification is required." },
    { status: 400 }
  );
}

const supabaseStartedAt = performance.now();

const supabase =
  await createSupabaseServerClient();

const supabaseClientReadyAt =
  performance.now();

console.log(
  `[LOGIN-SERVER-PERF] createSupabaseServerClient: ${Math.round(
    supabaseClientReadyAt - supabaseStartedAt
  )} ms`
);

const authStartedAt =
  performance.now();

const { data, error } =
  await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  });

const authCompletedAt =
  performance.now();

console.log(
  `[LOGIN-SERVER-PERF] signInWithPassword: ${Math.round(
    authCompletedAt - authStartedAt
  )} ms`
);

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { message: "Unable to authenticate the user." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error("Password login failed.", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to login.",
      },
      { status: 500 }
    );
  }
}
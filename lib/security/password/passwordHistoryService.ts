import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

import {
  promisify,
} from "node:util";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";

const scryptAsync =
  promisify(scrypt);

const SALT_LENGTH_BYTES = 16;
const KEY_LENGTH_BYTES = 64;

function generateSalt(): string {
  return randomBytes(
    SALT_LENGTH_BYTES
  ).toString("base64");
}

async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const derivedKey =
    (await scryptAsync(
      password,
      salt,
      KEY_LENGTH_BYTES
    )) as Buffer;

  return derivedKey.toString(
    "base64"
  );
}

export async function isPasswordReused(
  userId: string,
  newPassword: string
): Promise<boolean> {

const serverSupabase =
  await createSupabaseServerClient();

const {
  data: { user },
  error: userError,
} =
  await serverSupabase.auth.getUser();

if (userError || !user) {
  throw new Error(
    "Authentication is required."
  );
}

if (user.id !== userId) {
  throw new Error(
    "Unauthorized password history access."
  );
}

  const {
    data,
    error,
  } =

await supabaseAdmin
  .from("carevr_password_history")
      .select(
        "password_hash,salt"
      )
      .eq("user_id", userId)
      .maybeSingle();

  if (error) {
    throw new Error(
      "Unable to verify password history."
    );
  }

  if (!data) {
    return false;
  }

  const candidateHash =
    await hashPassword(
      newPassword,
      data.salt
    );

  const storedHash =
    Buffer.from(
      data.password_hash,
      "base64"
    );

  const candidateHashBuffer =
    Buffer.from(
      candidateHash,
      "base64"
    );

  if (
    storedHash.length !==
    candidateHashBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    storedHash,
    candidateHashBuffer
  );
}

export async function recordPasswordHistory(
  userId: string,
  password: string
): Promise<void> {

const serverSupabase =
  await createSupabaseServerClient();

const {
  data: { user },
  error: userError,
} =
  await serverSupabase.auth.getUser();

if (userError || !user) {
  throw new Error(
    "Authentication is required."
  );
}

if (user.id !== userId) {
  throw new Error(
    "Unauthorized password history access."
  );
}

  const salt =
    generateSalt();

  const passwordHash =
    await hashPassword(
      password,
      salt
    );

  const {
    error,
  } =

await supabaseAdmin
  .from("carevr_password_history")
      .upsert(
        {
          user_id: userId,
          password_hash:
            passwordHash,
          salt,
          created_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "user_id",
        }
      );

  if (error) {
    throw new Error(
      "Unable to record password history."
    );
  }
}
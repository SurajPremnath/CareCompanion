import { supabase } from "@/lib/supabase";

export type TOTPLoginStatus =
  | "VERIFIED"
  | "ENROLLMENT_REQUIRED";

export interface TOTPCheckResult {
  status: TOTPLoginStatus;
  factorId: string | null;
}

export async function checkTOTP(): Promise<TOTPCheckResult> {
  const { data, error } =
    await supabase.auth.mfa.listFactors();

  if (error) {
    throw error;
  }

  const verifiedTotpFactor =
    data?.all?.find(
      (factor) =>
        factor.factor_type === "totp" &&
        factor.status === "verified"
    );

  if (verifiedTotpFactor) {
    return {
      status: "VERIFIED",
      factorId: verifiedTotpFactor.id,
    };
  }

  return {
    status: "ENROLLMENT_REQUIRED",
    factorId: null,
  };
}
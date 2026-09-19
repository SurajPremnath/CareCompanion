import { supabase } from "@/lib/supabase";

export type WebAuthnLoginStatus =
  | "VERIFIED"
  | "NOT_ENROLLED";

export interface WebAuthnCheckResult {
  status: WebAuthnLoginStatus;
  factorId: string | null;
}

export async function checkWebAuthn(): Promise<WebAuthnCheckResult> {
  const { data, error } =
    await supabase.auth.mfa.listFactors();

  if (error) {
    throw error;
  }

  const verifiedWebAuthnFactor =
    data?.all?.find(
      (factor) =>
        factor.factor_type === "webauthn" &&
        factor.status === "verified"
    );

  if (verifiedWebAuthnFactor) {
    return {
      status: "VERIFIED",
      factorId: verifiedWebAuthnFactor.id,
    };
  }

  return {
    status: "NOT_ENROLLED",
    factorId: null,
  };
}
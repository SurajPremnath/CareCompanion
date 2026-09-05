"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authService } from "@/lib/auth/authService";
import { resolveCareVRDashboardHandoff } from "@/lib/auth/carevrDashboardHandoff";

type CareVRRole =
  | "SELF"
  | "DOCTOR"
  | "CARETAKER"
  | "FAMILY";

const VALID_ROLES: CareVRRole[] = [
  "SELF",
  "DOCTOR",
  "CARETAKER",
  "FAMILY",
];

function GoogleAuthComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const completeGoogleLogin = async () => {
      try {
        const requestedRole =
          searchParams.get("role") as CareVRRole | null;

        const selectedRole =
          requestedRole &&
          VALID_ROLES.includes(requestedRole)
            ? requestedRole
            : null;

        if (!selectedRole) {
          throw new Error(
            "Please return to Login and select your CareVR role."
          );
        }

        const authenticatedUser =
          await authService.getCurrentUser();

        if (!authenticatedUser) {
          throw new Error(
            "Unable to establish your CareVR session. Please return to Login."
          );
        }

        await resolveCareVRDashboardHandoff(
          authenticatedUser.id,
          selectedRole
        );

        if (!cancelled) {
          router.replace("/dashboard");
        }
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : "Unable to complete Google login.";

        router.replace(
          `/login?error=${encodeURIComponent(message)}`
        );
      }
    };

    void completeGoogleLogin();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main>
      <p>Completing your CareVR login...</p>
    </main>
  );
}

export default function GoogleAuthCompletePage() {
  return (
    <Suspense
      fallback={
        <main>
          <p>Completing your CareVR login...</p>
        </main>
      }
    >
      <GoogleAuthComplete />
    </Suspense>
  );
}
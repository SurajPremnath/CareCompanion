"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { authService } from "@/lib/auth/authService";
import {
  resolveCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";

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

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {

    let cancelled = false;

    const completeGoogleLogin =
      async () => {

        try {

          const requestedRole =
  searchParams.get("role") as CareVRRole | null;

          const selectedRole =
            requestedRole &&
            VALID_ROLES.includes(
              requestedRole
            )
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

            router.replace(
              "/dashboard"
            );

          }

        }
        catch (err) {

          if (cancelled) return;

          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Unable to complete Google login."
          );

        }

      };

    void completeGoogleLogin();

    return () => {

      cancelled = true;

    };

  }, [
    router,
    searchParams,
  ]);

  if (errorMessage) {

    return (
      <main>
        <p>{errorMessage}</p>

<a
  href="/login"
>
  Return to Login
</a>
      </main>
    );

  }

  return (
    <main>
      <p>
        Completing your CareVR login...
      </p>
    </main>
  );

}

export default function GoogleAuthCompletePage() {

  return (
    <Suspense
      fallback={
        <main>
          <p>
            Completing your CareVR login...
          </p>
        </main>
      }
    >
      <GoogleAuthComplete />
    </Suspense>
  );

}
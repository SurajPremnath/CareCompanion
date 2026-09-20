"use client";

import {
  Suspense,
  useEffect,
  useRef,
} from "react";


import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { authService } from "@/lib/auth/authService";

import {
  resolveCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";

import {
  carevrAuthorizationHandoff,
} from "@/lib/authorization/carevrAuthorizationHandoff";

import {
  validateInvitedUserLogin,
} from "@/lib/invitations/invitedUserLoginValidation";

import PasskeyCaptcha, {
  type PasskeyCaptchaHandle,
} from "@/app/components/security/PasskeyCaptcha";

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

const passkeyCaptchaRef =
  useRef<PasskeyCaptchaHandle>(null);

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

const hasPasskey =
  await authService.hasPasskey();

if (!hasPasskey) {

  router.replace(
    `/secure-access?flow=LOGIN&provider=GOOGLE&role=${encodeURIComponent(
      selectedRole
    )}`
  );

  return;

}

const captchaToken =
  await passkeyCaptchaRef.current?.getToken();

if (!captchaToken) {

  throw new Error(
    "Unable to complete Passkey security verification."
  );

}

const passkeyAuthenticatedUser =
  await authService.authenticatePasskey(
    captchaToken
  );

if (
  passkeyAuthenticatedUser.id !==
  authenticatedUser.id
) {

  await authService.logout();

  throw new Error(
    "The Passkey does not belong to the account you are trying to access."
  );

}

const validationResult =
  await validateInvitedUserLogin({
              email:
                authenticatedUser.email ?? "",
              userId:
                authenticatedUser.id,
              selectedRole:
                selectedRole === "FAMILY"
                  ? "SECONDARY_FAMILY_MEMBER"
                  : selectedRole,
              mode:
                "GOOGLE",
            });


if (
  validationResult.status ===
  "PRIMARY"
) {
  carevrAuthorizationHandoff.set({
    userId: authenticatedUser.id,
    carevrRole: "PRIMARY",
    familyId: null,
    patientId: null,
    consentStage: "COMPLETED",
    governanceId: null,
    governanceVersion: null,
  });

  await resolveCareVRDashboardHandoff(
    authenticatedUser.id,
    selectedRole
  );

  if (!cancelled) {
    router.replace(
      "/dashboard"
    );
  }

  return;
}

if (
  validationResult.status ===
  "VALID_INVITATION"
) {
  if (!validationResult.invitationId) {
    throw new Error(
      "Invitation information is missing."
    );
  }

  router.replace(
    `/invite-reset-temp-pwd?invitationId=${encodeURIComponent(
      validationResult.invitationId
    )}`
  );

  return;
}

if (
  validationResult.status ===
  "CONSENT_REQUIRED"
) {
  const carevrRole =
    selectedRole === "DOCTOR"
      ? "DOCTOR"
      : selectedRole === "CARETAKER"
        ? "CARETAKER"
        : selectedRole === "FAMILY"
          ? "SECONDARY_FAMILY_MEMBER"
          : "PRIMARY";

  carevrAuthorizationHandoff.set({
    userId: authenticatedUser.id,
    carevrRole,
    familyId:
      validationResult.familyId ?? null,
    patientId: null,
    consentStage: "POST_LOGIN",
    governanceId: null,
    governanceVersion: null,
  });

  router.replace(
    "/consent"
  );

  return;
}

if (
  validationResult.status ===
  "ACCEPTED"
) {
  const carevrRole =
    selectedRole === "DOCTOR"
      ? "DOCTOR"
      : selectedRole === "CARETAKER"
        ? "CARETAKER"
        : selectedRole === "FAMILY"
          ? "SECONDARY_FAMILY_MEMBER"
          : "PRIMARY";

  carevrAuthorizationHandoff.set({
    userId: authenticatedUser.id,
    carevrRole,
    familyId:
      validationResult.familyId ?? null,
    patientId: null,
    consentStage: "COMPLETED",
    governanceId: null,
    governanceVersion: null,
  });

  await resolveCareVRDashboardHandoff(
    authenticatedUser.id,
    selectedRole
  );

  if (!cancelled) {
    router.replace(
      "/dashboard"
    );
  }

  return;
}

if (
  validationResult.status ===
    "ROLE_MISMATCH" ||
  validationResult.status ===
    "INVALID_INVITATION"
) {
  throw new Error(
    validationResult.message
  );
}

if (
  validationResult.status ===
    "NOT_INVITED" &&
  selectedRole === "FAMILY"
) {
  throw new Error(
    "Family Member Access Not Available\n\n" +
    "This account is registered as a Primary member of CareVR and does not have Family Member access. " +
    "Please sign in using your Primary role."
  );
}

if (
  validationResult.status ===
  "NOT_INVITED"
) {
  await resolveCareVRDashboardHandoff(
    authenticatedUser.id,
    selectedRole
  );

  if (!cancelled) {
    router.replace(
      "/dashboard"
    );
  }

  return;
}

throw new Error(
  validationResult.message
);

        }
        catch (err) {

          if (cancelled) {
            return;
          }

          const message =
            err instanceof Error
              ? err.message
              : "Unable to complete Google login.";

          alert(message);

          router.replace(
            "/login"
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

return (
  <main>
    <PasskeyCaptcha
      ref={passkeyCaptchaRef}
    />

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
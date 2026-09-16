"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

import CareVRFooter from "@/Components/common/CareVRFooter";

import {
  Turnstile,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";

import { authService } from "@/lib/auth/authService";

import { authSecurity } from "@/lib/auth/authSecurity";

import {
  authSessionService,
} from "@/lib/analytics/authSessionService";

import {
  performanceTracker,
} from "@/lib/performance/performanceTracker";


import {
  resolveCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";

import {
  carevrAuthorizationHandoff,
} from "@/lib/authorization/carevrAuthorizationHandoff";

import {
  carevrContextResolver,
} from "@/lib/auth/carevrContextResolver";

import {
  validateInvitedUserLogin,
} from "@/lib/invitations/invitedUserLoginValidation";

import { inviteeToPrimaryHandoff } from "@/lib/authorization/inviteeToPrimaryHandoff";

export default function LoginPage() {
  const router = useRouter();

  const loginPageReadyRef = useRef(false);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);
const [error, setError] = useState("");

const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

const turnstileRef =
  useRef<TurnstileInstance>(null);

const [showPassword, setShowPassword] =
    useState(false);

const [loginMethod, setLoginMethod] =
  useState<"EMAIL" | "GOOGLE">("EMAIL");

const [totpLogin, setTotpLogin] =
    useState<{
        user: Awaited<
            ReturnType<typeof authService.login>
        >;
        factorId: string;
    } | null>(null);

const [totpEnrollment, setTotpEnrollment] =
    useState<{
        user: Awaited<
            ReturnType<typeof authService.login>
        >;
        factorId: string;
        qrCode: string;
        secret: string;
        uri: string;
    } | null>(null);

const [totpCode, setTotpCode] =
    useState("");

/*
 * Care context is resolved from the authenticated user's
 * ACTIVE carevr_access records.
 *
 * The selected context is an actual CareVR access record.
 * Display labels are handled by the context resolver.
 */
const [selectedContext, setSelectedContext] =
    useState<"FAMILY" | "ORGANISATION">("FAMILY");

const [selectedRole, setSelectedRole] =
    useState<
        "SELF" |
        "DOCTOR" |
        "CARETAKER" |
        "FAMILY"
    >("SELF");

const [availableCareVRContexts, setAvailableCareVRContexts] =
    useState<
        import("@/lib/auth/carevrContextResolver")
            .CareVRAvailableContext[]
    >([]);

const [selectedCareVRContextId, setSelectedCareVRContextId] =
    useState<string | null>(null);

const [showCareVRContextSelection, setShowCareVRContextSelection] =
    useState(false);

  useEffect(() => {
    if (loginPageReadyRef.current) {
      return;
    }

    loginPageReadyRef.current = true;

    void performanceTracker.complete({
      toPath: "/login",
    });
  }, []);

const completeLogin = async (
  authenticatedUser: Awaited<
    ReturnType<typeof authService.login>
  >,
  selectedAccessId?: string
) => {
  const availableContexts =
    await carevrContextResolver
      .getAvailableContexts(
        authenticatedUser.id
      );

  if (
    availableContexts.length === 0
  ) {
    throw new Error(
      "No active CareVR access is assigned to this account."
    );
  }

  setAvailableCareVRContexts(
    availableContexts
  );

  if (
    availableContexts.length > 1 &&
    !selectedAccessId
  ) {
    setShowCareVRContextSelection(
      true
    );
    return;
  }

  const context =
    selectedAccessId
      ? availableContexts.find(
          (availableContext) =>
            availableContext.accessId ===
            selectedAccessId
        )
      : availableContexts[0];

  if (!context) {
    throw new Error(
      "Selected CareVR context is no longer available."
    );
  }

  setSelectedCareVRContextId(
    context.accessId
  );

  const invitationValidation =
    await validateInvitedUserLogin({
      email: email.trim(),
      userId: authenticatedUser.id,
      selectedRole:
        context.loginRole === "DOCTOR"
          ? "DOCTOR"
          : context.loginRole ===
              "CARETAKER"
            ? "CARETAKER"
            : context.loginRole ===
                "FAMILY"
              ? "SECONDARY_FAMILY_MEMBER"
              : "SELF",
      mode: "NORMAL",
    });

  if (
    invitationValidation.status ===
    "PRIMARY"
  ) {
    carevrAuthorizationHandoff.set({
      userId: authenticatedUser.id,
      carevrRole: "PRIMARY",
      familyId:
        context.familyId,
      patientId:
        context.patientId,
      consentStage: "COMPLETED",
      governanceId: null,
      governanceVersion: null,
    });

    await resolveCareVRDashboardHandoff(
      authenticatedUser.id,
      context.loginRole
    );

    void authSessionService
      .start()
      .catch(() => {
        // Analytics must never block navigation.
      });

    router.replace("/dashboard");
    return;
  }

  if (
    invitationValidation.status ===
    "VALID_INVITATION"
  ) {
    if (
      !invitationValidation.invitationId
    ) {
      throw new Error(
        "Invitation information is missing."
      );
    }

    router.replace(
      `/invite-reset-temp-pwd?invitationId=${encodeURIComponent(
        invitationValidation.invitationId
      )}`
    );
    return;
  }

  if (
    invitationValidation.status ===
    "CONSENT_REQUIRED"
  ) {
    const carevrRole =
      context.loginRole === "DOCTOR"
        ? "DOCTOR"
        : context.loginRole ===
            "CARETAKER"
          ? "CARETAKER"
          : context.loginRole ===
              "FAMILY"
            ? "SECONDARY_FAMILY_MEMBER"
            : "PRIMARY";

    carevrAuthorizationHandoff.set({
      userId: authenticatedUser.id,
      carevrRole,
      familyId:
        context.familyId,
      patientId:
        context.patientId,
      consentStage: "POST_LOGIN",
      governanceId: null,
      governanceVersion: null,
    });

    router.replace("/consent");
    return;
  }

  if (
    invitationValidation.status ===
    "ACCEPTED"
  ) {
    const carevrRole =
      context.loginRole === "DOCTOR"
        ? "DOCTOR"
        : context.loginRole ===
            "CARETAKER"
          ? "CARETAKER"
          : context.loginRole ===
              "FAMILY"
            ? "SECONDARY_FAMILY_MEMBER"
            : "PRIMARY";

    carevrAuthorizationHandoff.set({
      userId: authenticatedUser.id,
      carevrRole,
      familyId:
        context.familyId,
      patientId:
        context.patientId,
      consentStage: "COMPLETED",
      governanceId: null,
      governanceVersion: null,
    });

    await resolveCareVRDashboardHandoff(
      authenticatedUser.id,
      context.loginRole
    );

    void authSessionService
      .start()
      .catch(() => {
        // Analytics must never block navigation.
      });

    router.replace("/dashboard");
    return;
  }

  if (
    invitationValidation.status ===
    "ROLE_MISMATCH"
  ) {
    throw new Error(
      invitationValidation.message
    );
  }

  if (
    invitationValidation.status ===
    "INVALID_INVITATION"
  ) {
    throw new Error(
      invitationValidation.message
    );
  }

  if (
    invitationValidation.status ===
    "NOT_INVITED"
  ) {
    await resolveCareVRDashboardHandoff(
      authenticatedUser.id,
      context.loginRole
    );

    void authSessionService
      .start()
      .catch(() => {
        // Analytics must never block navigation.
      });

    router.replace("/dashboard");
    return;
  }

  throw new Error(
    invitationValidation.message
  );
};

const handleLogin = async () => {
  setError("");

  if (!email.trim()) {
    setError("Email is required.");
    return;
  }

  if (!password) {
    setError("Password is required.");
    return;
  }

  try {

const productInvitationResponse =
  await fetch(
    "/api/access-management/access-to-carevr/validation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    }
  );

const productInvitation =
  await productInvitationResponse.json();

if (!productInvitationResponse.ok) {
  throw new Error(
    productInvitation.message ||
      "Unable to validate the CareVR invitation."
  );
}

if (
  productInvitation.status ===
  "NO_INVITATION"
) {
  setError(
    "You do not have an invitation to access CareVR."
  );
  return;
}

if (
  productInvitation.status ===
  "PENDING"
) {
  setError(
    "Your CareVR invitation is still pending. Please complete your registration before signing in."
  );
  return;
}

    setLoading(true);

    const verifiedCaptchaToken =
      authSecurity.requireCaptchaToken(
        captchaToken
      );

  setCaptchaToken(null);

  performanceTracker.start({
    fromPath: "/login",
    toPath: "/dashboard",
    feature: "LOGIN_TO_DASHBOARD",
  });

  const authenticatedUser =
    await authService.login(
      email.trim(),
      password,
      verifiedCaptchaToken
    );

const totpStatus =
  await authService.getTOTPLoginStatus();

if (
  totpStatus.requiresMFA &&
  totpStatus.factorId
) {
  setTotpLogin({
    user: authenticatedUser,
    factorId: totpStatus.factorId,
  });

  return;
}

if (totpStatus.requiresEnrollment) {
  const enrollment =
    await authService.enrollTOTP();

  setTotpEnrollment({
    user: authenticatedUser,
    factorId: enrollment.id,
    qrCode: enrollment.totp.qr_code,
    secret: enrollment.totp.secret,
    uri: enrollment.totp.uri,
  });

  return;
}

await completeLogin(authenticatedUser);

  } catch (err) {
    performanceTracker.cancel();

    const message =
      err instanceof Error
        ? err.message
        : "Unable to login.";

    setError(message);
} finally {
  setCaptchaToken(null);
  turnstileRef.current?.reset();
  setLoading(false);
}
};

const handleVerifyTOTPEnrollment = async () => {

  if (!totpEnrollment) {
    setError("TOTP enrollment is not available.");
    return;
  }

  if (totpCode.length !== 6) {
    setError(
      "Please enter the 6-digit code from your authenticator."
    );
    return;
  }

  try {

    setLoading(true);

    setError("");

    const challengeId =
      await authService.challengeTOTP(
        totpEnrollment.factorId
      );

    await authService.verifyTOTP(
      totpEnrollment.factorId,
      challengeId,
      totpCode
    );

    const authenticatedUser =
      totpEnrollment.user;

    setTotpEnrollment(null);
    setTotpCode("");

    await completeLogin(authenticatedUser);

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Unable to verify your authenticator.";

    setError(message);

  } finally {

    setLoading(false);

  }
};

const handleVerifyLoginTOTP = async () => {

  if (!totpLogin) {
    setError("TOTP verification is not available.");
    return;
  }

  if (totpCode.length !== 6) {
    setError(
      "Please enter the 6-digit code from your authenticator."
    );
    return;
  }

  try {

    setLoading(true);

    setError("");

    const challengeId =
      await authService.challengeTOTP(
        totpLogin.factorId
      );

await authService.verifyTOTP(
  totpLogin.factorId,
  challengeId,
  totpCode
);

const authenticatedUser = totpLogin.user;

setTotpLogin(null);
setTotpCode("");

await completeLogin(authenticatedUser);

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Unable to verify your authenticator code.";

    setError(message);

  } finally {

    setLoading(false);

  }
};

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      await authService.signInWithGoogle(
  selectedRole
);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to continue with Google.";

      setError(message);
      setGoogleLoading(false);
    }
  };

return (
  <>


{totpEnrollment ? (
<main
  className="login-page"
  style={{
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    background: "#f1eaff",
    overflow: "auto",
  }}
>
  <section className="login-shell">
    <div className="login-left">

      <div
        className="login-content"
        style={{
          marginLeft: "60px",
          marginTop: "60px",
          gap: "18px",
        }}
      >

        <div className="login-heading">
          <h1>Secure Your CareVR Account</h1>

          <p>
            Scan the QR code with your authenticator app,
            then enter the 6-digit code to continue.
          </p>
        </div>

        {error && (
          <div
            className="login-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          <img
            src={totpEnrollment.qrCode}
            alt="CareVR authenticator setup QR code"
            style={{
              width: "180px",
              height: "180px",
              background: "#ffffff",
              padding: "10px",
              borderRadius: "12px",
            }}
          />


        </div>

        <div
          className="field"
          style={{
            marginTop: "22px",
            marginBottom: "22px",
          }}
        >
          <label htmlFor="loginTotpEnrollmentCode">
            Authenticator Code
          </label>

          <div className="input-wrap">

            <input
              id="loginTotpEnrollmentCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={totpCode}
              onChange={(e) =>
                setTotpCode(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="000000"
              className="login-input"
              disabled={loading}
              maxLength={6}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleVerifyTOTPEnrollment();
                }
              }}
            />

          </div>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            void handleVerifyTOTPEnrollment()
          }
          disabled={
            loading ||
            totpCode.length !== 6
          }
style={{
  width: "min(100%, 220px)",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "13px",
  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor:
    loading || totpCode.length !== 6
      ? "not-allowed"
      : "pointer",
  opacity:
    loading || totpCode.length !== 6
      ? 0.6
      : 1,
  boxShadow:
    "0 10px 22px rgba(106, 62, 239, 0.19)",
}}
        >
          {loading
            ? "Verifying..."
            : "Verify & Continue"}
        </button>

      </div>
    </div>

    <div
      className="login-right"
      aria-hidden="true"
    />
  </section>
</main>

) : totpLogin ? (


<main
  className="login-page"
  style={{
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    background: "#f1eaff",
    overflow: "auto",
  }}
>
        <section className="login-shell">
          <div className="login-left">

            <div
  className="login-content"
  style={{
    marginLeft: "60px",
marginTop: "60px",
gap: "18px",
  }}
>

              <div className="login-heading">
                <h1>Verify Your CareVR Account</h1>

                <p>
                  Open your authenticator app and
                  enter the 6-digit verification code.
                </p>
</div>



{error && (
                <div
                  className="login-error"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div
  className="field"
  style={{
    marginTop: "22px",
    marginBottom: "22px",
  }}
>

                <label htmlFor="loginTotpCode">
                  Authenticator Code
                </label>

                <div className="input-wrap">

                  <input
                    id="loginTotpCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={totpCode}
                    onChange={(e) =>
                      setTotpCode(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    className="login-input"
                    disabled={loading}
                    maxLength={6}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void handleVerifyLoginTOTP();
                      }
                    }}
                  />

                </div>

              </div>

<button
  type="button"
  className="primary-button"
  onClick={() =>
    void handleVerifyLoginTOTP()
  }
  disabled={
    loading ||
    totpCode.length !== 6
  }
style={{
  width: "min(100%, 220px)",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "13px",
  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor:
    loading || totpCode.length !== 6
      ? "not-allowed"
      : "pointer",
  opacity:
    loading || totpCode.length !== 6
      ? 0.6
      : 1,
  boxShadow:
    "0 10px 22px rgba(106, 62, 239, 0.19)",
}}
>
  {loading
    ? "Verifying..."
    : "Verify & Continue"}
</button>

            </div>

          </div>

          <div
            className="login-right"
            aria-hidden="true"
          />

        </section>
      </main>

    ) : (
      <>
        <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        min-height: 100%;
      }

      body {
        background: #ffffff;
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        color: #15203d;
      }

      button,
      input {
        font: inherit;
      }

      .login-page {
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 28px;
        background: #f1eaff;
      }

      .login-shell {
        width: min(1180px, 100%);
        min-height: 720px;
        display: grid;
        grid-template-columns: 47% 53%;
        position: relative;
        overflow: hidden;
        border-radius: 28px;
        border: 1px solid #e9e5f3;
        background: #ffffff;
        box-shadow:
          0 30px 80px rgba(36, 28, 75, 0.10),
          0 6px 20px rgba(36, 28, 75, 0.04);
      }

      /* ==============================
         LEFT â€” LOGIN
      ============================== */

      .login-left {
        display: flex;
        flex-direction: column;
        padding: 34px 54px 30px;
        background: #f1eaff;
      }

/* =========================================================
   DESKTOP CAREVR LOGO
   ========================================================= */

.carevr-logo {
  width: 250px;
  height: 150px;
  margin-bottom: 28px;

  background-image: url("/images/CareVR%20v1.0.png");
  background-repeat: no-repeat;
  background-position: left top;
  background-size: contain;
}

      .login-content {
        width: 100%;
        max-width: 430px;
        margin: auto;
      }

      .login-heading {
        margin-bottom: 28px;
      }

      .login-heading h1 {
        margin: 0;
        font-size: 42px;
        line-height: 1.08;
        letter-spacing: -1.8px;
        font-weight: 730;
        color: #15203d;
      }

      .login-heading p {
        margin: 9px 0 0;
        font-size: 16px;
        line-height: 1.5;
        color: #737b91;
      }

      .login-error {
        margin-bottom: 16px;
        padding: 11px 13px;
        border: 1px solid #ffd0d0;
        border-radius: 11px;
        background: #fff5f5;
        color: #b42318;
        font-size: 13px;
        line-height: 1.45;
      }

/* ---------------------------------------------------------
   LOGIN VALIDATION PANEL

   Positioned independently so validation never pushes the
   role panels or any controls below them downward.

   The panel is intentionally compact and narrower than
   the login form.
--------------------------------------------------------- */

.login-validation-panel {
  position: absolute;

  left: 0;
  top: -54px;

  width: 39%;
  min-height: 30px;

  padding: 3px 8px;

  border: 1px solid #ffd0d0;
  border-radius: 7px;

  background: #fff5f5;

  color: #b42318;

  font-size: 10px;
  line-height: 14px;

  z-index: 20;
}

.login-validation-visible {
  visibility: visible;
}

      .field {
        margin-bottom: 16px;
      }

      .field label {
        display: block;
        margin-bottom: 7px;
        font-size: 14px;
        line-height: 1.3;
        font-weight: 700;
        color: #25304d;
      }

      .input-wrap {
        position: relative;
      }

      .input-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        width: 19px;
        height: 19px;
        transform: translateY(-50%);
        color: #8991a5;
        pointer-events: none;
      }

      .login-input {
        width: 100%;
        height: 53px;
        padding: 0 46px;
        border: 1px solid #d9dce6;
        border-radius: 13px;
        outline: none;
        background: #ffffff;
        color: #15203d;
        font-size: 15px;
        transition:
          border-color 160ms ease,
          box-shadow 160ms ease;
      }

      .login-input::placeholder {
        color: #9ba1b2;
      }

      .login-input:focus {
        border-color: #7043f5;
        box-shadow: 0 0 0 4px rgba(112, 67, 245, 0.09);
      }

      .password-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        transform: translateY(-50%);
        border: 0;
        border-radius: 9px;
        background: transparent;
        color: #7f879d;
        cursor: pointer;
      }

      .password-toggle:hover {
        background: #f6f3ff;
        color: #7043f5;
      }

.login-security-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 4px;
}

.login-captcha {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  overflow: visible;
}

.login-action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  width: 100%;
  column-gap: 24px;
  row-gap: 0;
  align-items: center;
  margin: -8px 0 0;
}

.login-action-grid .primary-button {
  grid-column: 1;
  grid-row: 1 / span 2;
  justify-self: center;
  width: 104px;
  height: 34px;
  margin: 0;
  padding: 0;
  border-radius: 9px;
  font-size: 11.5px;
  font-weight: 700;
  transform: translateY(-2px);
  box-shadow:
    0 4px 10px
    rgba(106, 62, 239, 0.14);
}

.login-action-grid .forgot-password {
  grid-column: 2;
  grid-row: 1;
  justify-self: start;
  width: auto;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #7043f5;
  font-size: 11.5px;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transform: translateY(2px);
}

.login-create-account {
  grid-column: 2;
  grid-row: 2;

  justify-self: start;

  width: auto;
  height: auto;

  margin: 0;
  padding: 0;

  border: 0;
  border-radius: 0;

  background: transparent;
  color: #7043f5;

  font-size: 11.5px;
  font-weight: 650;
  line-height: 1.2;

  white-space: nowrap;
  cursor: pointer;
  transform: translateY(-6px);
}

.login-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 100%;
  gap: 5px 12px;
  margin: 0;
}

.login-actions .forgot-password {
  grid-column: 1;
  grid-row: 1;

  justify-self: center;

  display: block;
  width: auto;

  margin: 0;
  padding: 0;

  font-size: 12px;
  line-height: 1.2;
}

.login-actions .primary-button {
  grid-column: 1;
  grid-row: 2;

  justify-self: center;

  display: flex;

  width: 82px;
  height: 34px;

  margin: 0;

  border-radius: 9px;

  font-size: 11px;
}

      .primary-button {
        width: 100%;
        height: 53px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 13px;
        background: linear-gradient(135deg, #7545f5, #6432e8);
        color: #ffffff;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(106, 62, 239, 0.19);
        transition:
          transform 160ms ease,
          box-shadow 160ms ease;
      }

      .primary-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 13px 27px rgba(106, 62, 239, 0.25);
      }

      .primary-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 21px 0;
      }

      .divider-line {
        flex: 1;
        height: 1px;
        background: rgba(229, 230, 236, 0.65);
      }

      .divider-text {
        color: #9399aa;
        font-size: 12px;
      }

      .google-button {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid #d9dce6;
        border-radius: 11px;
        background: rgba(255, 255, 255, 0.96);
        color: #30384f;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition:
          background 160ms ease,
          border-color 160ms ease;
      }

      .google-button:hover:not(:disabled) {
        background: #fafaff;
        border-color: #c8ccda;
      }

      .google-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .google-icon {
        width: 19px;
        height: 19px;
      }

.register {
  margin: 8px 0 0;
  text-align: center;
  color: #7b8296;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 600;
}

.register button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7043f5;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 700;
  cursor: pointer;
}

.registerPrompt {
  font-size: 15px;
  font-weight: 600;
  color: #7b8296;
}

      /* ==============================
         COMMON CAREVR FOOTER
      ============================== */

      .login-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
      }



      /* ==============================
         RIGHT â€” BRAND IMAGE
      ============================== */

.login-right {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  background:
    #f2edff
    url("/images/Desktop%20Login%20Background.png")
    center center / 100% 100%
    no-repeat;
}

      /* ==============================
         CARE CONTEXT
         ============================== */

      .context-selection {
        width: 100%;
        margin-bottom: 14px;
      }

      .context-selection-title {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 1.3;
        font-weight: 700;
        color: #15203d;
      }

      .context-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .context-option {
        min-height: 64px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border: 1px solid #d9dce6;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.82);
        color: #15203d;
        text-align: left;
        cursor: pointer;
        transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
      }

      .context-option:hover:not(:disabled) {
        border-color: #b9a7f7;
        background: rgba(255, 255, 255, 0.96);
      }

      .context-option-selected {
        border: 2px solid #7043f5;
        background: #f7f3ff;
        box-shadow: 0 0 0 2px rgba(112, 67, 245, 0.10);
      }

      .context-option:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .context-icon {
        width: 34px;
        height: 34px;
        flex: 0 0 34px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #f1eaff;
        color: #7043f5;
      }

      .context-option-copy {
        min-width: 0;
      }

      .context-option-title {
        display: block;
        font-size: 13px;
        font-weight: 750;
        line-height: 1.2;
      }

      .context-option-description {
        display: block;
        margin-top: 3px;
        font-size: 10.5px;
        line-height: 1.25;
        color: #737b91;
      }

      /* =========================================================
         ROLE SELECTION

         UI-only at this stage.
         Authentication and authorization remain unchanged.
      ========================================================= */

      .role-selection {
        width: 100%;
        margin-bottom: 20px;
      }

      .role-selection-title {
        margin-bottom: 10px;

        font-size: 14px;
        line-height: 1.3;

        font-weight: 700;

        color: #15203d;
      }

.role-options {
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 7px;
}

.role-option {
  min-height: 66px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 5px;

  padding: 7px 4px;

  border: 1px solid #d9dce6;
  border-radius: 11px;

  background: #ffffff;

  color: #15203d;

  cursor: pointer;

  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

      .role-option:hover:not(:disabled) {
        border-color: #b9a7f7;
        background: #faf8ff;
      }

.role-option-selected {
  border: 1px solid #7043f5;

  background: #f7f3ff;

  box-shadow:
    0 0 0 2px
    rgba(112, 67, 245, 0.12);
}

      .role-option:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .role-icon {
        width: 30px;
        height: 30px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #f1eaff;

        color: #7043f5;

        font-size: 15px;
        font-weight: 700;
        line-height: 1;
      }

      .role-label {
        font-size: 12px;
        line-height: 1.2;

        font-weight: 700;

        text-align: center;
      }


      /* ==============================
         TABLET
      ============================== */

      @media (max-width: 900px) {
        .login-page {
          padding: 18px;
        }

        .login-shell {
          max-width: 600px;
          min-height: auto;
          display: block;
        }

        .login-right {
          min-height: 300px;
          height: 38vh;
          max-height: 360px;
        }

        .login-left {
          min-height: 0;
          padding: 34px 46px 30px;
        }

        .login-content {
          margin: 0 auto;
        }
      }


      /* =========================================================
         MOBILE LOGIN
      ========================================================= */

      @media (max-width: 600px) {

        /* ---------------------------------------------------------
           MOBILE CARE CONTEXT
        --------------------------------------------------------- */

        .context-selection {
          margin-bottom: 9px;
        }

        .context-selection-title {
          margin-bottom: 5px;
          font-size: 10.5px;
        }

        .context-options {
          gap: 6px;
        }

        .context-option {
          min-height: 57px;
          gap: 7px;
          padding: 7px 8px;
          border-radius: 10px;
        }

        .context-icon {
          width: 28px;
          height: 28px;
          flex-basis: 28px;
        }

        .context-option-title {
          font-size: 10.5px;
        }

        .context-option-description {
          margin-top: 2px;
          font-size: 8.5px;
        }

        /* ---------------------------------------------------------
           MOBILE ROLE SELECTION

           UI-only at this stage.
           Authentication and authorization remain unchanged.
        --------------------------------------------------------- */

        .role-selection {
          margin-bottom: 12px;
        }

        .role-selection-title {
          margin-bottom: 5px;
          font-size: 10.5px;
        }

        .role-options {
          gap: 7px;
        }

.role-option {
  height: 58px;
  min-height: 58px;
  padding: 4px;
  border-radius: 10px;

  box-sizing: border-box;

  align-items: center;
  justify-content: center;
}

        .role-icon {
          width: 27px;
          height: 27px;
          font-size: 16px;
        }

        .role-label {
          font-size: 10.5px;
        }

        .login-page {
    display: block;
    width: 100%;
    height: 100dvh;
    min-height: 100dvh;
    padding: 0;
    overflow: hidden;
    background: #f1eaff;
  }

.login-shell {
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;

  display: block;

  overflow: hidden;

  border: 0;
  border-radius: 0;
  box-shadow: none;

  background-color: #f1eaff;
  background-image: url("/images/Mobile%20Login%20Background.png");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
}

@media (max-width: 600px) {
  /* Desktop artwork panel is not used on mobile */
  .login-right {
    display: none;
  }
}

.login-footer {
  display: None;
}

.login-register-desktop {
  display: none;
}

  /* ---------------------------------------------------------
     LOGIN LAYER
     --------------------------------------------------------- */

  .login-left {
    position: absolute;
    z-index: 2;
    inset: 0;

    display: block;

    min-height: 0;
    padding: 0;

    background: transparent;
  }

/* ---------------------------------------------------------
   MOBILE CAREVR LOGO

   The logo is rendered by the login page so the new purple
   background can be used without the old baked-in artwork.
--------------------------------------------------------- */

.carevr-logo {
  display: none;
}
  /* ---------------------------------------------------------
     LOGIN CONTENT

     This deliberately sits in the empty middle section
     of the mobile artwork.
     --------------------------------------------------------- */

.login-content {
  position: absolute;

  top: 28%;
  left: 6%;
  right: 6%;

  width: auto;
  max-width: none;

  margin: 0;
}

  /* ---------------------------------------------------------
     WELCOME
     --------------------------------------------------------- */

  .login-heading {
    margin-bottom: 9px;
  }

  .login-heading h1 {
    margin: 0;

    font-size: 27px;
    line-height: 1.1;

    letter-spacing: -0.5px;

    font-weight: 700;

    color: #15203d;
  }

.login-heading p {
  display: block;
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.3;
  color: #5f6780;
}

  /* ---------------------------------------------------------
     ERROR
     --------------------------------------------------------- */

  .login-error {
    margin-bottom: 8px;

    padding: 7px 9px;

    border: 1px solid #ffd0d0;
    border-radius: 10px;

    background: rgba(255, 245, 245, 0.96);

    color: #b42318;

    font-size: 10.5px;
    line-height: 1.4;
  }

  /* ---------------------------------------------------------
     INPUT FIELDS
     --------------------------------------------------------- */

  .field {
    margin-bottom: 7px;
  }

  .field label {
    display: block;

    margin-bottom: 3px;

    font-size: 10.5px;
    line-height: 1.25;

    font-weight: 700;

    color: #4b556d;
  }

  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;

    left: 13px;
    top: 50%;

    width: 17px;
    height: 17px;

    transform: translateY(-50%);

    color: #8991a5;

    pointer-events: none;
  }

.login-input {
  width: 100%;
  height: 41px;
  padding: 0 42px;
  border: 1px solid #d9dce6;
  border-radius: 11px;
  outline: none;
  background: rgba(255, 255, 255, 0.96);
  color: #15203d;
  font-size: 16px;
  -webkit-appearance: none;
  appearance: none;
}

  .login-input::placeholder {
    color: #9ba1b2;
  }

  .login-input:focus {
    border-color: #7043f5;

    box-shadow:
      0 0 0 3px rgba(112, 67, 245, 0.09);
  }

  /* ---------------------------------------------------------
     PASSWORD EYE
     --------------------------------------------------------- */

  .password-toggle {
    position: absolute;

    right: 3px;
    top: 50%;

    width: 35px;
    height: 35px;

    display: grid;
    place-items: center;

    transform: translateY(-50%);

    border: 0;
    border-radius: 9px;

    background: transparent;

    color: #7f879d;

    cursor: pointer;
  }

  /* ---------------------------------------------------------
     FORGOT PASSWORD + SIGN IN
     --------------------------------------------------------- */

.login-actions {
  display: none;
}

.login-action-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;

  width: 100%;

  column-gap: 24px;
  row-gap: 5px;

  align-items: center;

  margin: -8px 0 0;
}

.login-action-grid .primary-button {
  grid-column: 1;
  grid-row: 1 / span 2;

  justify-self: center;

  width: 104px;
  height: 40px;

  margin: 0;
  padding: 0;

  border-radius: 10px;

  font-size: 12px;
  font-weight: 700;
}

.login-action-grid .forgot-password {
  grid-column: 2;
  grid-row: 1;

  justify-self: start;

  width: auto;
  margin: 0;
  padding: 0;

  border: 0;
  background: transparent;
  color: #7043f5;

  font-size: 12px;
  font-weight: 650;
  line-height: 1.2;

  white-space: nowrap;
  cursor: pointer;
}

.login-create-account {
  grid-column: 2;
  grid-row: 2;

  justify-self: start;

  width: auto;
  height: auto;

  margin: 0;
  padding: 0;

  border: 0;
  border-radius: 0;

  background: transparent;
  color: #7043f5;

  font-size: 12px;
  font-weight: 650;
  line-height: 1.2;

  white-space: nowrap;
  cursor: pointer;
}

  /* ---------------------------------------------------------
     MOBILE LOGIN METHOD TABS
     --------------------------------------------------------- */

  .login-method-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;

    width: 100%;
    height: 38px;

    margin-bottom: 9px;
    padding: 3px;

    border: 1px solid #ddd7f2;
    border-radius: 11px;

    background: rgba(255, 255, 255, 0.72);
  }

/* ---------------------------------------------------------
   MOBILE LOGIN METHOD TABS
   --------------------------------------------------------- */

.login-method-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;

  width: 100%;
  height: 32px;

  margin-bottom: 8px;
  padding: 2px;

  border: 1px solid #ddd7f2;
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.72);
}

.login-method-content[data-login-method="EMAIL"]
  .login-google-panel,
.login-method-content[data-login-method="EMAIL"]
  .divider {
  display: none;
}

.login-method-content[data-login-method="GOOGLE"]
  .login-email-panel {
  display: none;
}

.login-method-content[data-login-method="GOOGLE"]
  .divider {
  display: none;
}

.login-method-content[data-login-method="GOOGLE"]
  .login-google-panel {
  display: block;
}

.login-method-tab {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;

  margin: 0;
  padding: 0;

  box-sizing: border-box;

  border: 0;
  border-radius: 7px;

  background: transparent;

  color: #737b91;

  font-size: 11px;
  font-weight: 700;
  line-height: 1;

  cursor: pointer;
}

.login-method-tab-active {
  background: #ffffff;

  color: #7043f5;

  border: 1px solid #7043f5;

  box-shadow:
    0 2px 6px
    rgba(112, 67, 245, 0.12);
}

/* ---------------------------------------------------------
   GOOGLE
   --------------------------------------------------------- */

.login-method-content[data-login-method="EMAIL"]
  .login-google-panel,
.login-method-content[data-login-method="EMAIL"]
  .divider {
  display: none;
}

.login-method-content[data-login-method="GOOGLE"]
  .login-email-panel {
  display: none;
}

.login-method-content[data-login-method="GOOGLE"]
  .divider {
  display: none;
}

.login-method-content[data-login-method="GOOGLE"]
  .login-google-panel {
  display: block;
}

  .login-method-tab {
    border: 0;
    border-radius: 8px;

    background: transparent;

    color: #737b91;

    font-size: 12px;
    font-weight: 700;

    cursor: pointer;
  }

  .login-method-tab-active {
    background: #ffffff;

    color: #7043f5;

    box-shadow:
      0 2px 6px
      rgba(36, 28, 75, 0.08);
  }

  /* ---------------------------------------------------------
     GOOGLE
     --------------------------------------------------------- */

  .divider {
    display: flex;
    align-items: center;

    gap: 7px;

    margin: 6px 0;
  }

  .divider-text {
    color: #a1a6b3;

    font-size: 9.5px;
  }

  .google-button {
    width: 100%;
    height: 43px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 9px;

    border: 1px solid #d9dce6;
    border-radius: 11px;

    background: rgba(255, 255, 255, 0.96);

    color: #202943;

    font-size: 12px;
    font-weight: 600;

    cursor: pointer;
  }

  .google-icon {
    width: 17px;
    height: 17px;
  }

  /* ---------------------------------------------------------
     REGISTER
     --------------------------------------------------------- */

  .register {
    margin: 8px 0 0;

    text-align: center;

    color: #7b8296;

    font-size: 10.5px;
  }

      @media (max-width: 380px) {
        .login-content {
          top: 20%;
          left: 5%;
          right: 5%;
        }

        .login-heading h1 {
          font-size: 22px;
        }

        .login-heading p {
          font-size: 11.5px;
        }

        .login-actions {
          grid-template-columns: 1fr 1.55fr;
          gap: 8px;
        }

        .forgot-password {
          font-size: 16px;
        }

        .field {
          margin-bottom: 7px;
        }

        .login-input,
        .primary-button,
        .google-button {
          height: 39px;
        }

        .divider {
          margin: 7px 0;
        }

        .register {
          margin-top: 6px;
        }
      }

      @media (max-height: 700px) and (max-width: 600px) {
        .login-content {
          top: 20%;
        }

        .login-heading {
          margin-bottom: 8px;
        }

        .login-heading h1 {
          font-size: 21px;
        }

        .login-heading p {
          font-size: 11px;
        }

        .field {
          margin-bottom: 6px;
        }

        .login-input,
        .primary-button,
        .google-button {
          height: 37px;
        }

        .forgot-password {
          font-size: 14px;
        }

        .divider {
          margin: 6px 0;
        }

        .register {
          margin-top: 5px;
        }
      }

      /* =========================================================
         CAREVR LOGIN VISUAL RESTORATION
         
         Visual-only override.
         Authentication, TOTP, CAPTCHA, CareVR access,
         context resolution and navigation are untouched.
      ========================================================= */

      @media (min-width: 601px) {

        .login-method-tabs {
          display: none !important;
        }

        .login-page {
          min-height: 100vh;
          min-height: 100dvh;
          padding: 28px;
          background: #f1eaff;
        }

        .login-shell {
          width: min(1180px, 100%);
          min-height: 720px;
          display: grid;
          grid-template-columns: 47% 53%;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid #e9e5f3;
          background: #ffffff;
          box-shadow:
            0 30px 80px rgba(36, 28, 75, 0.10),
            0 6px 20px rgba(36, 28, 75, 0.04);
        }

        .login-left {
          display: flex;
          flex-direction: column;
          padding: 34px 54px 30px;
          background: #ffffff;
        }

        .carevr-logo {
          display: block;
          width: 250px;
          height: 150px;
          margin-bottom: 28px;
          background-image: url("/images/CareVR%20v1.0.png");
          background-repeat: no-repeat;
          background-position: left top;
          background-size: contain;
        }

.login-right {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  background:
    #f2edff
    url("/images/Desktop%20Login%20Background.png")
    center center / 100% 100%
    no-repeat;
}
      }

      @media (max-width: 600px) {

        .login-page {
          display: block;
          width: 100%;
          height: 100dvh;
          min-height: 100dvh;
          padding: 0;
          overflow: hidden;
          background: #f1eaff;
        }

        .login-shell {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100dvh;
          display: block;
          overflow: hidden;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          background-color: #f1eaff;
          background-image:
            url("/images/Mobile%20Login%20Background.png");
          background-repeat: no-repeat;
          background-position: center top;
          background-size: 100% 100%;
        }

        .login-right {
          display: none;
        }

        .login-left {
          position: absolute;
          z-index: 2;
          inset: 0;
          display: block;
          min-height: 0;
          padding: 0;
          background: transparent;
        }

        .carevr-logo {
          display: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          transition: none !important;
          animation: none !important;
        }
      }
    `}</style>

    <main className="login-page">
      <section className="login-shell">

        {/* ============================
            LEFT â€” LOGIN
        ============================ */}

        <div className="login-left">

          <div
  className="carevr-logo"
  aria-label="CareVR"
/>

<div className="login-content">


<div className="context-selection">
  <div className="context-selection-title"></div>
  <div className="context-selection-title"></div>
  <div className="context-selection-title"></div>
  <div className="context-options" role="group" aria-label="Care context">
    <button
      type="button"
      className={`context-option ${
        selectedContext === "FAMILY"
          ? "context-option-selected"
          : ""
      }`}
      onClick={() => setSelectedContext("FAMILY")}
      disabled={loading || googleLoading}
      aria-pressed={selectedContext === "FAMILY"}
    >
      <span className="context-icon" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M9.5 20v-5h5v5" />
        </svg>
      </span>
      <span className="context-option-copy">
        <span className="context-option-title">Care Family</span>
        <span className="context-option-description">For individuals and families</span>
      </span>
    </button>

    <button
      type="button"
      className={`context-option ${
        selectedContext === "ORGANISATION"
          ? "context-option-selected"
          : ""
      }`}
      onClick={() => setSelectedContext("ORGANISATION")}
      disabled={true}
      aria-pressed={selectedContext === "ORGANISATION"}
      aria-label="Care Organisation (coming soon)"
    >
      <span className="context-icon" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-4h4v4" />
        </svg>
      </span>
      <span className="context-option-copy">
        <span className="context-option-title">Care Organisation</span>
        <span className="context-option-description">Coming soon — for care teams and providers</span>
      </span>
    </button>
  </div>
</div>

{showCareVRContextSelection && (
  <div className="role-selection">
    <div className="role-selection-title">
      Continue as...
    </div>

    <div className="role-options">

      {availableCareVRContexts.map(
        (context) => (
          <button
            key={context.accessId}
            type="button"
            className={`role-option ${
              selectedCareVRContextId ===
              context.accessId
                ? "role-option-selected"
                : ""
            }`}
onClick={async () => {
  try {
    setLoading(true);
    setError("");

    setSelectedCareVRContextId(
      context.accessId
    );

    setSelectedRole(
      context.loginRole
    );

    setShowCareVRContextSelection(
      false
    );

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "Unable to identify the authenticated user."
      );
    }

    await completeLogin(
      user,
      context.accessId
    );

  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Unable to continue with the selected CareVR context.";

    setError(message);
    setShowCareVRContextSelection(
      true
    );
  } finally {
    setLoading(false);
  }
}}
            disabled={
              loading ||
              googleLoading
            }
          >
            <span className="role-icon">
              {context.loginRole === "SELF"
                ? "👤"
                : context.loginRole ===
                    "DOCTOR"
                  ? "🩺"
                  : context.loginRole ===
                      "CARETAKER"
                    ? "♡"
                    : "👥"}
            </span>

            <span className="role-label">
              {context.label}
            </span>
          </button>
        )
      )}

    </div>
  </div>
)}

    <div
      className="login-method-tabs"
      role="tablist"
      aria-label="Login method"
    >
  <button
    type="button"
    className={`login-method-tab ${
      loginMethod === "EMAIL"
        ? "login-method-tab-active"
        : ""
    }`}
    role="tab"
    aria-selected={loginMethod === "EMAIL"}
    onClick={() =>
      setLoginMethod("EMAIL")
    }
    disabled={loading || googleLoading}
  >
    Email
  </button>

  <button
    type="button"
    className={`login-method-tab ${
      loginMethod === "GOOGLE"
        ? "login-method-tab-active"
        : ""
    }`}
    role="tab"
    aria-selected={loginMethod === "GOOGLE"}
    onClick={() =>
      setLoginMethod("GOOGLE")
    }
    disabled={loading || googleLoading}
  >
    Google
  </button>
</div>
{error && (
  <div
    className="login-error"
    role="alert"
    aria-live="polite"
  >
    {error}
  </div>
)}

<div
  className="login-method-content"
  data-login-method={loginMethod}
>

  <div className="login-email-panel">

    {/* EMAIL */}

            <div className="field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrap">

                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2.5"
                  />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="login-input"
                  disabled={loading}
                  autoComplete="email"
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div className="field">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrap">

                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="login-input"
                  style={{
                    paddingRight: "48px",
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleLogin();
                    }
                  }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.5 4.4A11 11 0 0 1 12 4c5.3 0 9 4.8 10 8-0.4 1.1-1.2 2.4-2.3 3.4" />
                      <path d="M6.7 6.7C4.5 8.1 3.1 10.2 2 12c1 2.8 4.5 8 10 8 1.3 0 2.5-.2 3.6-.7" />
                    </svg>
                  ) : (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  )}
                </button>

              </div>
            </div>

<div className="login-security-actions">
  <div className="login-captcha">
    <Turnstile
  ref={turnstileRef}
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={(token) => setCaptchaToken(token)}
      onExpire={() => setCaptchaToken(null)}
      onError={() => setCaptchaToken(null)}
    />
  </div>

  <div className="login-action-grid">
    <button
      type="button"
      className="primary-button"
      onClick={() =>
        void handleLogin()
      }
      disabled={loading}
    >
      {loading
        ? "Signing In..."
        : "Sign In"}
    </button>

    <button
      type="button"
      className="forgot-password"
      onClick={() =>
        router.push("/forgot-password")
      }
      disabled={loading}
    >
      Forgot Password?
    </button>

    <button
      type="button"
      className="login-create-account"
      onClick={() => {
        inviteeToPrimaryHandoff.clear();
        router.replace("/register");
      }}
      disabled={loading}
    >
      Create an Account
    </button>
  </div>
</div>
 </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">
                or
              </span>
              <span className="divider-line" />
            </div>

<div className="login-google-panel">
            <button
              type="button"
              className="google-button"
              onClick={() =>
                void handleGoogleLogin()
              }
              disabled={
                loading ||
                googleLoading
              }
            >
              <svg
                className="google-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.6 12.23c0-.79-.07-1.55-.21-2.28H12v4.31h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.56Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.97-.9 6.62-2.45l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.61 0-4.83-1.76-5.62-4.13H3.04v2.59A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.38 13.87A6.01 6.01 0 0 1 6.06 12c0-.65.11-1.28.32-1.87V7.54H3.04A10 10 0 0 0 2 12c0 1.61.38 3.13 1.04 4.46l3.34-2.59Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6c1.47 0 2.79.51 3.83 1.51l2.87-2.87C16.96 2.99 14.69 2 12 2a10 10 0 0 0-8.96 5.54l3.34 2.59C7.17 7.76 9.39 6 12 6Z"
                />
              </svg>

              {googleLoading
                ? "Connecting..."
                : "Continue with Google"}
            </button>
	</div>
</div>

<div className="register login-register-desktop">
  <span className="registerPrompt">New to CareVR?  </span>{" "}
  <button
    type="button"
    onClick={() => {
      inviteeToPrimaryHandoff.clear();

      router.replace("/register");
    }}
    disabled={loading}
  >
    Create an account
  </button>
</div>

    </div>
  </div>

<div className="login-footer">
  <CareVRFooter />
</div>

{/* ============================
    RIGHT — BRAND EXPERIENCE
============================ */}

    <div
      className="login-right"
      aria-hidden="true"
    />

      </section>
</main>
      </>
    )}
  </>
);
}
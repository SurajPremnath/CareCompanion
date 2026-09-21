"use client";

import {
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type { User } from "@supabase/supabase-js";

import { authService } from "@/lib/auth/authService";

import PasskeyCaptcha, {
  type PasskeyCaptchaHandle,
} from "@/app/components/security/PasskeyCaptcha";

import CareVRFooter from "@/Components/common/CareVRFooter";

interface ValidPasskeyProps {
  user: User;
  onValidated: (
    authenticatedUser: User
  ) => void | Promise<void>;
}

export default function ValidPasskey({
  user,
  onValidated,
}: ValidPasskeyProps) {
  const router = useRouter();

  const passkeyCaptchaRef =
    useRef<PasskeyCaptchaHandle>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleVerifyPasskey =
    async () => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (!user?.id) {
          throw new Error(
            "Passkey verification is not available."
          );
        }

        const captchaToken =
          await passkeyCaptchaRef.current?.getToken();

        if (!captchaToken) {
          throw new Error(
            "Unable to complete Passkey security verification."
          );
        }

        const passkeyAuthenticatedUser =
          await authService.validatePasskeyForUser(
            captchaToken,
            user.id
          );

        if (
          passkeyAuthenticatedUser.id !==
          user.id
        ) {
          throw new Error(
            "The Passkey does not belong to the account you are trying to access."
          );
        }

        await onValidated(
          passkeyAuthenticatedUser
        );
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "NotAllowedError"
      ) {
        setError(
          "Your CareVR Passkey could not be used/found on this device. You can create a new Passkey to continue."
        );

        window.setTimeout(() => {
          router.replace(
            "/secure-access?flow=LOGIN"
          );
        }, 1800);

        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to authenticate with your CareVR Passkey."
      );
    } finally {
      setLoading(false);
    }
};

return (
  <main className="valid-passkey-page">

    <PasskeyCaptcha
      ref={passkeyCaptchaRef}
    />

    <div className="valid-passkey-shell">

      {/* ============================
          EXISTING CAREVR HEADER
      ============================ */}

      <header className="valid-passkey-header">

        <button
          type="button"
          className="carevr-brand"
          onClick={() => router.replace("/login")}
          aria-label="CareVR"
        >
          <img
            src="/images/CareVR v1.0.png"
            alt="CareVR"
            className="carevr-logo"
          />
        </button>

        <div className="header-actions">

          <button
            type="button"
            className="home-button"
            onClick={() => router.replace("/login")}
            aria-label="Go to Login"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12h18" />
              <path d="m15 6 6 6-6 6" />
            </svg>

            Login
          </button>

        </div>

      </header>

      {/* ============================
          PASSKEY SECURITY
      ============================ */}

      <main className="valid-passkey-main">

        <section
          className="valid-passkey-card"
          aria-labelledby="valid-passkey-title"
        >

          <div className="passkey-security-icon">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="10"
                rx="2"
              />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <path d="M12 15v2" />
            </svg>
          </div>

          <h1 id="valid-passkey-title">
            Verify Your CareVR Account
          </h1>

          <p className="passkey-subtitle">
            Your CareVR account is securely protected.
          </p>


          {/* ============================
              PASSKEY CARD
          ============================ */}

          <div className="passkey-verification-card">

            <h2>
              Verify with your Passkey
            </h2>

            <p className="passkey-description">
              Use the Passkey you created for this
              CareVR account.
            </p>


            {/* ============================
                DEVICE SECURITY
            ============================ */}

            <div className="device-security">

              <h3>
                Use your device security
              </h3>

              <div className="device-security-list">

                <div className="device-security-item">

                  <div className="device-security-icon">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 9V6a3 3 0 0 1 3-3h3" />
                      <path d="M21 9V6a3 3 0 0 0-3-3h-3" />
                      <path d="M3 15v3a3 3 0 0 0 3 3h3" />
                      <path d="M21 15v3a3 3 0 0 1-3 3h-3" />
                      <circle cx="9" cy="10" r="1" />
                      <circle cx="15" cy="10" r="1" />
                      <path d="M8 15c1.1 1 2.3 1.5 4 1.5s2.9-.5 4-1.5" />
                    </svg>
                  </div>

                  <span>
                    Face ID / facial recognition
                  </span>

                </div>


                <div className="device-security-item">

                  <div className="device-security-icon">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 4c-3.3 0-6 2.7-6 6v1" />
                      <path d="M18 11v-1a6 6 0 0 0-12 0" />
                      <path d="M8 11v-1a4 4 0 0 1 8 0v2" />
                      <path d="M10 12v-2a2 2 0 0 1 4 0v4" />
                      <path d="M6 13v-2" />
                      <path d="M18 13v-2" />
                      <path d="M8 15c.5 3 2 5 4 5s3.5-2 4-5" />
                    </svg>
                  </div>

                  <span>
                    Fingerprint / Touch ID
                  </span>

                </div>


                <div className="device-security-item">

                  <div className="device-security-icon">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      <path d="M12 14v2" />
                    </svg>
                  </div>

                  <span>
                    Device PIN / Windows Hello
                  </span>

                </div>

              </div>

            </div>


            {/* ============================
                PRIVACY
            ============================ */}

            <div className="passkey-privacy">

              <div className="privacy-icon">

                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

              </div>

              <p>
                Your biometric information stays on your device.
                CareVR never sees or stores it.
              </p>

            </div>

          </div>


          {/* ============================
              ERROR
          ============================ */}

          {error && (
            <div
              className="valid-passkey-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}


          {/* ============================
              VERIFY BUTTON
          ============================ */}

          <button
            type="button"
            className="verify-passkey-button"
            onClick={() =>
              void handleVerifyPasskey()
            }
            disabled={loading}
          >

            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="10"
                rx="2"
              />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <path d="M12 15v2" />
            </svg>

            {loading
              ? "Verifying..."
              : "Verify with Passkey"}

          </button>


          <p className="verify-supporting-text">
            You&apos;ll be prompted by your device to complete
            verification using your biometrics or device PIN.
          </p>


          <button
            type="button"
            className="back-to-login"
            onClick={() => router.replace("/login")}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>

            Back to sign in
          </button>

        </section>

      </main>


      {/* ============================
          EXISTING CAREVR FOOTER
      ============================ */}

      <CareVRFooter />

    </div>


    {/* ============================
        PAGE STYLES
    ============================ */}

    <style jsx global>{`

      .valid-passkey-page {
        min-height: 100vh;
        min-height: 100dvh;
        background: #f1eaff;
        color: #15203d;
        overflow-x: hidden;
      }

      .valid-passkey-shell {
        width: 100%;
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        padding: 12px 14px 18px;
      }


      /* ============================
         HEADER
      ============================ */

      .valid-passkey-header {
        width: 100%;
        min-height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .carevr-brand {
        border: 0;
        background: transparent;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      .carevr-logo {
        display: block;
        width: 145px;
        height: 58px;
        object-fit: contain;
        object-position: left center;
      }

      .header-actions {
        display: flex;
        align-items: center;
      }

      .home-button {
        height: 42px;
        padding: 0 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        border: 1px solid #d8cff4;
        border-radius: 12px;
        background: #ffffff;
        color: #6337d2;
        cursor: pointer;
        font-weight: 650;
      }


      /* ============================
         MAIN
      ============================ */

      .valid-passkey-main {
        width: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 18px 0 24px;
      }

      .valid-passkey-card {
        width: min(560px, 100%);
        background: #ffffff;
        border: 1px solid #e5dff8;
        border-radius: 22px;
        padding: 28px 18px 26px;
        text-align: center;
        box-shadow:
          0 18px 50px rgba(32, 14, 88, 0.12);
      }


      /* ============================
         HEADING
      ============================ */

      .passkey-security-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6337d2;
        background: #f0ebff;
      }

      .valid-passkey-card h1 {
        margin: 0;
        color: #24165f;
        font-size: 29px;
        line-height: 1.15;
        font-weight: 750;
      }

      .passkey-subtitle {
        margin: 10px auto 22px;
        color: #59627d;
        font-size: 16px;
        line-height: 1.5;
      }


      /* ============================
         PASSKEY CARD
      ============================ */

      .passkey-verification-card {
        padding: 22px 14px 18px;
        border: 1px solid #e5dff8;
        border-radius: 18px;
        background: #faf9ff;
      }

      .passkey-verification-card h2 {
        margin: 0;
        color: #211758;
        font-size: 22px;
        line-height: 1.3;
        font-weight: 700;
      }

      .passkey-description {
        margin: 8px auto 22px;
        color: #59627d;
        font-size: 15px;
        line-height: 1.5;
      }


      /* ============================
         DEVICE SECURITY
      ============================ */

      .device-security {
        padding: 16px 14px;
        border: 1px solid #e5dff8;
        border-radius: 15px;
        background: #ffffff;
        text-align: left;
      }

      .device-security h3 {
        margin: 0 0 12px;
        color: #211758;
        font-size: 16px;
        line-height: 1.35;
        font-weight: 700;
      }

      .device-security-list {
        display: flex;
        flex-direction: column;
        gap: 13px;
      }

      .device-security-item {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #4d5a84;
        font-size: 14px;
        line-height: 1.4;
      }

      .device-security-icon {
        width: 32px;
        height: 32px;
        flex: 0 0 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6337d2;
      }


      /* ============================
         PRIVACY
      ============================ */

      .passkey-privacy {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e5dff8;
        text-align: left;
      }

      .privacy-icon {
        flex: 0 0 auto;
        color: #6337d2;
        padding-top: 1px;
      }

      .passkey-privacy p {
        margin: 0;
        color: #59627d;
        font-size: 13px;
        line-height: 1.5;
      }


      /* ============================
         ERROR
      ============================ */

      .valid-passkey-error {
        margin-top: 16px;
        padding: 12px 14px;
        border-radius: 12px;
        background: #fff1f2;
        border: 1px solid #fecdd3;
        color: #9f1239;
        font-size: 13px;
        line-height: 1.45;
        text-align: left;
      }


      /* ============================
         VERIFY BUTTON
      ============================ */

      .verify-passkey-button {
        width: 100%;
        min-height: 54px;
        margin-top: 18px;
        border: 0;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background:
          linear-gradient(
            135deg,
            #6337d2,
            #7549df
          );
        color: #ffffff;
        font-size: 17px;
        font-weight: 700;
        cursor: pointer;
        box-shadow:
          0 10px 24px
          rgba(99,55,210,0.22);
      }

      .verify-passkey-button:disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }


      /* ============================
         SUPPORTING TEXT
      ============================ */

      .verify-supporting-text {
        margin: 12px auto 0;
        max-width: 440px;
        color: #7a849e;
        font-size: 13px;
        line-height: 1.5;
      }


      /* ============================
         BACK TO LOGIN
      ============================ */

      .back-to-login {
        margin-top: 20px;
        border: 0;
        background: transparent;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #6337d2;
        font-size: 14px;
        font-weight: 650;
        cursor: pointer;
      }

      .back-to-login:hover {
        text-decoration: underline;
      }


      /* ============================
         MOBILE
      ============================ */

      @media (max-width: 380px) {

        .valid-passkey-shell {
          padding-left: 10px;
          padding-right: 10px;
        }

        .valid-passkey-card {
          padding:
            24px
            14px
            22px;
        }

        .valid-passkey-card h1 {
          font-size: 26px;
        }

        .passkey-verification-card h2 {
          font-size: 20px;
        }

        .home-button {
          width: 42px;
          padding: 0;
          font-size: 0;
        }

      }

    `}</style>
  </main>
);
}
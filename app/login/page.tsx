"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import CareVRFooter from "@/Components/common/CareVRFooter";

import { authService } from "@/lib/auth/authService";
import {
  authSessionService,
} from "@/lib/analytics/authSessionService";
import {
  performanceTracker,
} from "@/lib/performance/performanceTracker";

export default function LoginPage() {
  const router = useRouter();

  const loginPageReadyRef = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] =
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
    setLoading(true);

    performanceTracker.start({
      fromPath: "/login",
      toPath: "/dashboard",
      feature: "LOGIN_TO_DASHBOARD",
    });

    await authService.login(
      email.trim(),
      password
    );

    void authSessionService
      .start()
      .catch(() => {
        // Analytics must never block navigation.
      });

    router.replace("/dashboard");
  } catch (err) {
    performanceTracker.cancel();

    const message =
      err instanceof Error
        ? err.message
        : "Unable to login.";

    setError(message);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      await authService.signInWithGoogle();
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
        background: #ffffff;
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
         LEFT — LOGIN
      ============================== */

      .login-left {
        display: flex;
        flex-direction: column;
        padding: 42px 64px 34px;
        background: #ffffff;
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

      .login-actions {
        display: flex;
        flex-direction: column;
      }

.forgot-password {
  order: 1;
  align-self: center;
  justify-self: start;
  margin: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: #7043f5;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 650;
  white-space: nowrap;
  cursor: pointer;
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
         RIGHT — BRAND IMAGE
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

      /* ==============================
         MOBILE
      ============================== */

/* =========================================================
   MOBILE LOGIN
   ========================================================= */

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
  background-image: url("/images/Mobile%20Login%20Background.png");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
}

  /* Desktop artwork panel is not used on mobile */
  .login-right {
    display: none;
  }

  .login-footer {
    z-index: 4;
    padding: 0 12px 8px;
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
   --------------------------------------------------------- */

/* The mobile background already contains the CareVR logo.
   Do not render a second logo on mobile. */

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

    top: 44%;
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

/* Mobile does not need a second sign-in message.
   The artwork already communicates the product message. */
.login-heading p {
  display: none;
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
    display: grid;

    grid-template-columns: 1fr 1.65fr;

    align-items: center;

    gap: 8px;

    margin-top: 1px;
  }

  .forgot-password {
    order: 1;

    align-self: center;
    justify-self: start;

    margin: 0;

    padding: 2px 0;

    border: 0;

    background: transparent;

    color: #7043f5;

    font-size: 14px;
    font-weight: 650;

    white-space: nowrap;

    cursor: pointer;
  }

  .primary-button {
    order: 2;

    width: 100%;
    height: 41px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 0;
    border-radius: 11px;

    background:
      linear-gradient(
        135deg,
        #7545f5,
        #6432e8
      );

    color: #ffffff;

    font-size: 12.5px;
    font-weight: 700;

    box-shadow:
      0 6px 14px
      rgba(106, 62, 239, 0.17);
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
          top: 30%;
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
          top: 28%;
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
            LEFT — LOGIN
        ============================ */}

        <div className="login-left">

          <div
  className="carevr-logo"
  aria-label="CareVR"
/>

          <div className="login-content">

            <div className="login-heading">
              <h1>Welcome</h1>

              <p>
                Sign in to continue your care journey
              </p>
            </div>

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                {error}
              </div>
            )}

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

            <div className="login-actions">
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
            </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">
                or
              </span>
              <span className="divider-line" />
            </div>

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

<div className="register">
  <span className="registerPrompt">New to CareVR?  </span>{" "}
  <button
    type="button"
    onClick={() =>
      router.replace("/register")
    }
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

<div className="login-right" aria-hidden="true" />
      </section>
    </main>
  </>
);
}
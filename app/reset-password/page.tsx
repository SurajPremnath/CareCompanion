"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MobileHeader from "@/Components/common/MobileHeader";
import CareVRFooter from "@/Components/common/CareVRFooter";

import { authService } from "@/lib/auth/authService";
import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

//------------------------------------------------------------
// Reset Password Page
//------------------------------------------------------------

export default function ResetPasswordPage() {

  const router =
    useRouter();

const [userName, setUserName] = useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [validSession, setValidSession] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  //----------------------------------------------------------
  // Validate Recovery Session
  //----------------------------------------------------------

useEffect(() => {

  let mounted = true;

  const validateSession =
    async () => {

      try {

        const session =
          await authService
            .getCurrentSession();

        if (!mounted) {
          return;
        }

        if (session) {

          setValidSession(true);
          setChecking(false);

        }

      }
      catch (err) {

        console.error(
          "Recovery Session Validation Error:",
          err
        );

      }

    };

  const {
    data: {
      subscription,
    },
  } =
    authService.onAuthStateChange(
      (event, session) => {

        if (!mounted) {
          return;
        }

        if (
          event ===
            "PASSWORD_RECOVERY" &&
          session
        ) {

          setValidSession(true);
          setChecking(false);

        }

      }
    );

  void validateSession();

  const timeout =
    window.setTimeout(
      () => {

        if (!mounted) {
          return;
        }

        setChecking(false);

      },
      3000
    );

  return () => {

    mounted = false;

    window.clearTimeout(
      timeout
    );

    subscription.unsubscribe();

  };

}, []);


useEffect(() => {
    let cancelled = false;

    const loadProfileName = async () => {
        try {
            const profile =
                await profileRepository.getCurrentProfile();

            if (cancelled) {
                return;
            }

            setUserName(profile?.fullName?.trim() || "");
        } catch (error) {
            console.error(
                "Unable to load profile name for Reset Password header.",
                error
            );
        }
    };

    void loadProfileName();

    return () => {
        cancelled = true;
    };
}, []);

  //----------------------------------------------------------
  // Update Password
  //----------------------------------------------------------

  const handleUpdatePassword =
    async () => {

      setError("");
      setSuccess("");

      if (password.length < 6) {

        setError(
          "Password must contain at least 6 characters."
        );

        return;

      }

      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;

      }

      if (!validSession) {

        setError(
          "This password reset link is invalid or has expired."
        );

        return;

      }

try {
  setLoading(true);

const mode =
  new URLSearchParams(window.location.search)
    .get("mode");

if (mode === "expired") {
  const response = await fetch(
    "/api/security/change-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ??
        "Unable to update your password."
    );
  }
} else {
  await authService.updatePassword(password);
}

  setSuccess(
    "Your password has been updated successfully."
  );

  setPassword("");
  setConfirmPassword("");
}
      catch (err) {

        console.error(
          "Password Update Error:",
          err
        );

        setError(
          "Unable to update your password. The reset link may have expired. Please request a new one."
        );

      }
      finally {

        setLoading(false);

      }

    };

  //----------------------------------------------------------
  // Shared CareVR Header
  //----------------------------------------------------------

  const renderHeader = () => (
    <MobileHeader
      careMode="SELF"
      onCareModeChange={() => {}}
      userName={userName}
      showCareModeToggle={false}
      showSelfToggle={false}
      showFamilyToggle={false}
      showHomeButton={true}
      onHomeClick={() => router.replace("/login")}
      accountMenuOpen={false}
      onAccountMenuToggle={() => {}}
      consentGranted={false}
      canAddPatient={false}
      onAddPatient={() => {}}
      onCareVRJourney={() => {}}
      onHelp={() => {}}
      onLogout={async () => {
        await authService.logout();
        router.replace("/login");
      }}
    />
  );

  //----------------------------------------------------------
  // Checking State
  //----------------------------------------------------------

  if (checking) {
    return (
      <main style={pageStyle}>
        {renderHeader()}

        <div style={shellStyle}>
          <div style={cardStyle}>
            <p style={statusStyle}>
              Verifying password reset link...
            </p>
          </div>
        </div>

        <CareVRFooter />
      </main>
    );
  }

  //----------------------------------------------------------
  // Invalid Session State
  //----------------------------------------------------------

  if (!validSession) {
    return (
      <main style={pageStyle}>
        {renderHeader()}

        <div style={shellStyle}>
          <div style={cardStyle}>
            <h1 style={titleStyle}>
              Reset Link Invalid
            </h1>

            <div style={errorStyle}>
              This password reset link is invalid or has expired.
              Please request a new reset link.
            </div>

            <button
              type="button"
              onClick={() => router.replace("/forgot-password")}
              style={primaryButtonStyle}
            >
              Request New Reset Link
            </button>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              style={secondaryButtonStyle}
            >
              Back to Login
            </button>
          </div>
        </div>

        <CareVRFooter />
      </main>
    );
  }

  //----------------------------------------------------------
  // Reset Form / Successful Password Change
  //----------------------------------------------------------

  return (
    <main style={pageStyle}>
      {renderHeader()}

      <div style={shellStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>
            {success ? "Password Updated" : "Reset Password"}
          </h1>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {success ? (
            <>
              <div style={successStyle}>
                {success}
              </div>

              <button
                type="button"
                onClick={() => router.replace("/login")}
                style={primaryButtonStyle}
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              <p style={subtitleStyle}>
                Enter and confirm your new password.
              </p>

              <label style={labelStyle}>
                New Password
              </label>

              <div style={passwordWrapperStyle}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  style={{
                    ...inputStyle,
                    paddingRight: "55px",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={eyeButtonStyle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span aria-hidden="true">
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </button>
              </div>

              <label style={labelStyle}>
                Confirm New Password
              </label>

              <div style={passwordWrapperStyle}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading) {
                      void handleUpdatePassword();
                    }
                  }}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  style={{
                    ...inputStyle,
                    paddingRight: "55px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  disabled={loading}
                  style={eyeButtonStyle}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  <span aria-hidden="true">
                    {showConfirmPassword ? "🙈" : "👁"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => void handleUpdatePassword()}
                disabled={loading}
                style={{
                  ...primaryButtonStyle,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </>
          )}
        </div>
      </div>

      <CareVRFooter />
    </main>
  );

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const cardStyle:
  React.CSSProperties = {

    width: "100%",
    maxWidth: "600px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "36px",
    border:
      "1px solid #d1d5db",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",

  };

const pageStyle: React.CSSProperties = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily: "Inter, Arial, sans-serif",
};

const shellStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    padding: "24px",
};

const titleStyle:
  React.CSSProperties = {

    textAlign: "center",
    marginBottom: "8px",

  };

const subtitleStyle:
  React.CSSProperties = {

    textAlign: "center",
    color: "#6b7280",
    marginBottom: "28px",

  };

const statusStyle:
  React.CSSProperties = {

    textAlign: "center",
    color: "#6b7280",
    marginTop: "24px",

  };

const labelStyle:
  React.CSSProperties = {

    display: "block",
    marginTop: "16px",
    marginBottom: "8px",
    fontWeight: 600,

  };

const passwordWrapperStyle:
  React.CSSProperties = {

    position: "relative",

  };

const inputStyle:
  React.CSSProperties = {

    width: "100%",
    padding: "14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box",

  };

const eyeButtonStyle:
  React.CSSProperties = {

    position: "absolute",
    right: "14px",
    top: "50%",
    transform:
      "translateY(-50%)",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    color: "#6b7280",
    fontSize: "20px",
    lineHeight: 1,

  };

const primaryButtonStyle:
  React.CSSProperties = {

    width: "100%",
    padding: "14px",
    marginTop: "28px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",

  };

const secondaryButtonStyle:
  React.CSSProperties = {

    width: "100%",
    padding: "14px",
    marginTop: "12px",
    background: "#ffffff",
    color: "#2563eb",
    border:
      "1px solid #2563eb",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",

  };

const errorStyle:
  React.CSSProperties = {

    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    border:
      "1px solid #fecaca",

  };

const successStyle:
  React.CSSProperties = {

    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    border:
      "1px solid #bbf7d0",

  };

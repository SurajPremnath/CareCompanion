"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  authService,
} from "@/lib/auth/authService";

import AppBrand from "@/app/components/AppBrand";

//------------------------------------------------------------
// Reset Password Page
//------------------------------------------------------------

export default function ResetPasswordPage() {

  const router =
    useRouter();

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

        await authService
          .updatePassword(
            password
          );

        setSuccess(
          "Your password has been updated successfully."
        );

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {

          router.replace(
            "/login"
          );

        }, 2000);

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
  // Checking State
  //----------------------------------------------------------

  if (checking) {

    return (

      <main style={containerStyle}>

        <div style={cardStyle}>

          <AppBrand />

          <p style={statusStyle}>
            Verifying password reset link...
          </p>

        </div>

      </main>

    );

  }

  //----------------------------------------------------------
  // Invalid Session State
  //----------------------------------------------------------

  if (!validSession) {

    return (

      <main style={containerStyle}>

        <div style={cardStyle}>

          <AppBrand />

          <h1 style={titleStyle}>
            Reset Link Invalid
          </h1>

          <div style={errorStyle}>
            This password reset link is invalid or has expired. Please request a new reset link.
          </div>

          <button
            type="button"
            onClick={() =>
              router.replace(
                "/forgot-password"
              )
            }
            style={primaryButtonStyle}
          >
            Request New Reset Link
          </button>

          <button
            type="button"
            onClick={() =>
              router.replace(
                "/login"
              )
            }
            style={secondaryButtonStyle}
          >
            Back to Login
          </button>

        </div>

      </main>

    );

  }

  //----------------------------------------------------------
  // Reset Form
  //----------------------------------------------------------

  return (

    <main style={containerStyle}>

      <div style={cardStyle}>

        <AppBrand />

        <h1 style={titleStyle}>
          Reset Password
        </h1>

        <p style={subtitleStyle}>
          Enter and confirm your new password.
        </p>

        {error && (

          <div style={errorStyle}>
            {error}
          </div>

        )}

        {success && (

          <div style={successStyle}>
            {success}
          </div>

        )}

        <label style={labelStyle}>
          New Password
        </label>

        <div style={passwordWrapperStyle}>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter new password"
            autoComplete="new-password"
            disabled={
              loading ||
              Boolean(success)
            }
            style={{
              ...inputStyle,
              paddingRight: "55px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            disabled={loading}
            style={eyeButtonStyle}
          >
            {showPassword
              ? "🙈"
              : "👁"}
          </button>

        </div>

        <label style={labelStyle}>
          Confirm New Password
        </label>

        <div style={passwordWrapperStyle}>

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            onKeyDown={(event) => {

              if (
                event.key === "Enter" &&
                !loading &&
                !success
              ) {

                void handleUpdatePassword();

              }

            }}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            disabled={
              loading ||
              Boolean(success)
            }
            style={{
              ...inputStyle,
              paddingRight: "55px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            disabled={loading}
            style={eyeButtonStyle}
          >
            {showConfirmPassword
              ? "🙈"
              : "👁"}
          </button>

        </div>

        <button
          type="button"
          onClick={() =>
            void handleUpdatePassword()
          }
          disabled={
            loading ||
            Boolean(success)
          }
          style={{
            ...primaryButtonStyle,
            opacity:
              loading ||
              success
                ? 0.7
                : 1,
            cursor:
              loading ||
              success
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "Updating Password..."
            : "Update Password"}
        </button>

        <div style={footerStyle}>
          Created by Suraj Premnath
        </div>

      </div>

    </main>

  );

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const containerStyle:
  React.CSSProperties = {

    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    padding: "24px",
    fontFamily:
      "Inter, Arial, sans-serif",

  };

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
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "18px",
    padding: 0,
    color: "#6b7280",

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

const footerStyle:
  React.CSSProperties = {

    marginTop: "28px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "12px",

  };
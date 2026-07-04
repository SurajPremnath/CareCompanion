"use client";

import React, {
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
// Forgot Password Page
//------------------------------------------------------------

export default function ForgotPasswordPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  //----------------------------------------------------------
  // Send Reset Link
  //----------------------------------------------------------

  const handleSubmit =
    async () => {

      setError("");
      setSuccess("");

      const trimmedEmail =
        email.trim();

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          trimmedEmail
        )
      ) {

        setError(
          "Please enter a valid email address."
        );

        return;

      }

      try {

        setLoading(true);

        await authService
          .requestPasswordReset(
            trimmedEmail
          );

        setSuccess(
          "If an account exists for this email address, a password reset link has been sent."
        );

      }
      catch (err) {

        console.error(
          "Password Reset Request Error:",
          err
        );

        setError(
          "Unable to send the password reset email. Please try again."
        );

      }
      finally {

        setLoading(false);

      }

    };

  //----------------------------------------------------------
  // Render
  //----------------------------------------------------------

  return (

    <main style={containerStyle}>

      <div style={cardStyle}>

        <AppBrand />

        <h1 style={titleStyle}>
          Forgot Password
        </h1>

        <p style={subtitleStyle}>
          Enter your registered email address and we will send you a secure password reset link.
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
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key === "Enter" &&
              !loading
            ) {

              void handleSubmit();

            }

          }}
          placeholder="Enter your email"
          style={inputStyle}
          disabled={loading}
          autoComplete="email"
        />

        <button
          type="button"
          onClick={() =>
            void handleSubmit()
          }
          disabled={loading}
          style={{
            ...primaryButtonStyle,

            opacity:
              loading
                ? 0.7
                : 1,

            cursor:
              loading
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.replace(
              "/login"
            )
          }
          disabled={loading}
          style={secondaryButtonStyle}
        >
          Back to Login
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

    lineHeight: 1.5,

  };

const labelStyle:
  React.CSSProperties = {

    display: "block",

    marginTop: "16px",

    marginBottom: "8px",

    fontWeight: 600,

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
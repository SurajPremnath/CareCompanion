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

import CareVRFooter from "@/Components/common/CareVRFooter";

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

    <div style={pageContentStyle}>

      {/* CAREVR BRAND */}
      <div style={brandStyle}>
        <img
          src="/images/CareVR%20v1.0.png"
          alt="CareVR"
          style={logoStyle}
        />
      </div>

      {/* FORGOT PASSWORD CONTENT */}
      <div style={contentStyle}>

        <div style={lockIconStyle}>
          <span style={lockEmojiStyle}>🔒</span>
        </div>

        <h1 style={titleStyle}>
          Forgot Password?
        </h1>

        <p style={subtitleStyle}>
          Enter your registered email address and
          we’ll send you a secure password reset link.
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

        <div style={formStyle}>

          <label style={labelStyle}>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
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
              opacity: loading ? 0.7 : 1,
              cursor: loading
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
              router.replace("/login")
            }
            disabled={loading}
            style={secondaryButtonStyle}
          >
            Back to Login
          </button>

        </div>

      </div>

    </div>

    {/* REUSABLE CAREVR FOOTER */}
    <div style={footerWrapperStyle}>
      <CareVRFooter />
    </div>

  </main>
);

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  background:
    "linear-gradient(180deg, #ffffff 0%, #faf7ff 48%, #f2eaff 100%)",
  fontFamily:
    "Inter, Arial, sans-serif",
  boxSizing: "border-box",
  overflowX: "hidden",
};

const pageContentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "520px",
  margin: "0 auto",
  padding:
    "28px 18px 24px",
  boxSizing: "border-box",
};

const brandSectionStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "12px",
};

const logoStyle: React.CSSProperties = {
  width: "220px",
  maxWidth: "72vw",
  height: "auto",
  display: "block",
  margin: "0 auto",
};

const taglineStyle: React.CSSProperties = {
  marginTop: "-4px",
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: "0.1px",
};

const recordTextStyle: React.CSSProperties = {
  color: "#2D7CFF",
};

const understandTextStyle: React.CSSProperties = {
  color: "#5D3CFF",
};

const manageTextStyle: React.CSSProperties = {
  color: "#743CFF",
};

const shareTextStyle: React.CSSProperties = {
  color: "#FF4D8D",
};

const separatorStyle: React.CSSProperties = {
  color: "#9ca3af",
  margin:
    "0 6px",
};

const introSectionStyle: React.CSSProperties = {
  textAlign: "center",
  padding:
    "8px 4px 22px",
};

const resetIconWrapperStyle: React.CSSProperties = {
  width: "150px",
  height: "150px",
  margin:
    "0 auto 8px",
  borderRadius: "50%",
  background:
    "rgba(116,60,255,0.07)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const resetIconStyle: React.CSSProperties = {
  width: "125px",
  height: "125px",
};

const titleStyle: React.CSSProperties = {
  margin: "0",
  color: "#0D1326",
  fontSize: "34px",
  lineHeight: 1.15,
  fontWeight: 750,
  letterSpacing: "-0.8px",
};

const subtitleStyle: React.CSSProperties = {
  margin:
    "12px auto 0",
  maxWidth: "430px",
  color: "#5f6b85",
  fontSize: "17px",
  lineHeight: 1.55,
  fontWeight: 450,
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background:
    "rgba(255,255,255,0.92)",
  borderRadius: "28px",
  padding:
    "24px 20px 22px",
  border:
    "1px solid rgba(116,60,255,0.08)",
  boxShadow:
    "0 12px 35px rgba(57,32,110,0.08)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "9px",
  color: "#0D1326",
  fontSize: "16px",
  fontWeight: 700,
};

const inputWrapperStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
};

const inputIconStyle: React.CSSProperties = {
  position: "absolute",
  left: "17px",
  top: "50%",
  transform:
    "translateY(-50%)",
  width: "24px",
  height: "24px",
  color: "#7f8ba5",
  pointerEvents: "none",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "58px",
  padding:
    "0 16px 0 54px",
  border:
    "1px solid #d9ddeb",
  borderRadius: "16px",
  background: "#ffffff",
  color: "#0D1326",
  fontSize: "16px",
  boxSizing: "border-box",
  outline: "none",
};

const securityMessageStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginTop: "16px",
  padding:
    "14px 14px",
  borderRadius: "15px",
  background:
    "#f8f4ff",
  border:
    "1px solid #e6dcff",
  color: "#33415c",
  fontSize: "14px",
  lineHeight: 1.45,
};

const securityIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: "26px",
  height: "26px",
  color: "#743CFF",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  height: "58px",
  marginTop: "18px",
  background:
    "linear-gradient(135deg, #743CFF 0%, #5D2FE8 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "16px",
  fontSize: "17px",
  fontWeight: 700,
  boxShadow:
    "0 10px 24px rgba(116,60,255,0.22)",
};

const buttonIconStyle: React.CSSProperties = {
  display: "inline-block",
  marginRight: "10px",
  fontSize: "19px",
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  height: "54px",
  marginTop: "12px",
  background: "#ffffff",
  color: "#743CFF",
  border:
    "1.5px solid #743CFF",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
};

const backIconStyle: React.CSSProperties = {
  display: "inline-block",
  marginRight: "9px",
  fontSize: "21px",
  verticalAlign: "-1px",
};

const errorStyle: React.CSSProperties = {
  background: "#fff1f2",
  color: "#b42318",
  padding: "13px 14px",
  borderRadius: "14px",
  marginBottom: "18px",
  border:
    "1px solid #fecdd3",
  fontSize: "14px",
  lineHeight: 1.45,
};

const successStyle: React.CSSProperties = {
  background: "#effcf6",
  color: "#087443",
  padding: "13px 14px",
  borderRadius: "14px",
  marginBottom: "18px",
  border:
    "1px solid #b7ebd0",
  fontSize: "14px",
  lineHeight: 1.45,
};

const footerWrapperStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "430px",
  display: "flex",
  justifyContent: "center",
};

const brandStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  marginBottom: "10px",
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const lockIconStyle: React.CSSProperties = {
  width: "76px",
  height: "76px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eee7ff",
  marginBottom: "14px",
};

const lockEmojiStyle: React.CSSProperties = {
  fontSize: "30px",
  lineHeight: 1,
};

const formStyle: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(225, 218, 245, 0.85)",
  boxShadow:
    "0 8px 24px rgba(80, 55, 140, 0.07)",
  boxSizing: "border-box",
};
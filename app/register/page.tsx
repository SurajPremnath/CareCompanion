"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";

export default function RegisterPage() {

    const router = useRouter();

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const validateForm = (): boolean => {

        setError("");

        setSuccess("");

        if (!fullName.trim()) {

            setError("Full name is required.");

            return false;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {

            setError("Please enter a valid email address.");

            return false;

        }

        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return false;

        }

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return false;

        }

        return true;

    };

    const handleRegister = async () => {

        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);

            setError("");

            setSuccess("");

            const result =
                await authService.register(
                    fullName.trim(),
                    email.trim(),
                    password
                );

            if (result.session) {

                router.replace("/dashboard");

                return;

            }

            setSuccess(
                "Account created successfully. Please check your email to verify your account before logging in."
            );

            setTimeout(() => {

                router.replace("/login");

            }, 2500);

        } catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to create your account.";

            setError(message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <main style={containerStyle}>

            <div style={cardStyle}>

                <div style={logoStyle}>
                    ❤️ CareCompanion
                </div>

                <h1 style={titleStyle}>
                    Create Your Account
                </h1>

                <p style={subtitleStyle}>
                    Register once to securely manage your family's health records.
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
                    Full Name
                </label>

                <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                        setFullName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    style={inputStyle}
                />

                <label style={labelStyle}>
                    Email Address
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    style={inputStyle}
                />

                <label style={labelStyle}>
                    Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    placeholder="Create a password"
                    style={inputStyle}
                />

                <label style={labelStyle}>
                    Confirm Password
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    placeholder="Re-enter password"
                    style={inputStyle}
                />
                <button
                    onClick={handleRegister}
                    disabled={loading}
                    style={{
                        ...primaryButtonStyle,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
                </button>

                <button
                    onClick={() => router.replace("/login")}
                    disabled={loading}
                    style={secondaryButtonStyle}
                >
                    Already have an account? Login
                </button>

                <div style={footerStyle}>
                    Created by Suraj Premnath
                </div>

            </div>

        </main>

    );

}

const containerStyle: React.CSSProperties = {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "#f8fafc",

    padding: "24px",

    fontFamily: "Inter, Arial, sans-serif"

};

const cardStyle: React.CSSProperties = {

    width: "100%",

    maxWidth: "650px",

    background: "#ffffff",

    borderRadius: "16px",

    padding: "36px",

    border: "1px solid #d1d5db",

    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"

};

const logoStyle: React.CSSProperties = {

    fontSize: "40px",

    fontWeight: "bold",

    marginBottom: "12px",

    textAlign: "center"

};

const titleStyle: React.CSSProperties = {

    textAlign: "center",

    marginBottom: "8px"

};

const subtitleStyle: React.CSSProperties = {

    textAlign: "center",

    color: "#6b7280",

    marginBottom: "28px"

};

const labelStyle: React.CSSProperties = {

    display: "block",

    marginTop: "16px",

    marginBottom: "8px",

    fontWeight: 600

};

const inputStyle: React.CSSProperties = {

    width: "100%",

    padding: "14px",

    borderRadius: "10px",

    border: "1px solid #d1d5db",

    fontSize: "16px",

    boxSizing: "border-box"

};

const primaryButtonStyle: React.CSSProperties = {

    width: "100%",

    padding: "14px",

    marginTop: "28px",

    border: "none",

    borderRadius: "10px",

    background: "#2563eb",

    color: "#ffffff",

    fontWeight: "bold",

    fontSize: "16px"

};

const secondaryButtonStyle: React.CSSProperties = {

    width: "100%",

    padding: "14px",

    marginTop: "12px",

    borderRadius: "10px",

    border: "1px solid #2563eb",

    background: "#ffffff",

    color: "#2563eb",

    fontWeight: "bold",

    fontSize: "16px",

    cursor: "pointer"

};

const errorStyle: React.CSSProperties = {

    background: "#fee2e2",

    color: "#991b1b",

    padding: "12px",

    borderRadius: "10px",

    marginBottom: "20px",

    border: "1px solid #fecaca"

};

const successStyle: React.CSSProperties = {

    background: "#dcfce7",

    color: "#166534",

    padding: "12px",

    borderRadius: "10px",

    marginBottom: "20px",

    border: "1px solid #bbf7d0"

};

const footerStyle: React.CSSProperties = {

    marginTop: "28px",

    textAlign: "center",

    color: "#6b7280",

    fontSize: "12px"

};
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";
import AppBrand from "@/app/components/AppBrand";

import {
    authSessionService,
} from "@/lib/analytics/authSessionService";

import {
    performanceTracker,
} from "@/lib/performance/performanceTracker";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

const [showPassword, setShowPassword] =
    useState(false);

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

        fromPath:
            "/login",

        toPath:
            "/dashboard",

        feature:
            "LOGIN_TO_DASHBOARD",

    });

    await authService.login(
        email.trim(),
        password
    );

await authSessionService.start();

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

    return (

        <main style={containerStyle}>

            <div style={cardStyle}>

 <AppBrand />

<h1 style={titleStyle}>
    Welcome Back
</h1>

<p style={subtitleStyle}>
    Sign in to continue
</p>

                {error && (

                    <div style={errorStyle}>
                        {error}
                    </div>

                )}

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
                    disabled={loading}
                />

                <label style={labelStyle}>
                    Password
                </label>

<div
    style={{
        position: "relative",
    }}
>

    <input
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
        style={{
            ...inputStyle,
            paddingRight: "55px",
        }}
        disabled={loading}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleLogin();
            }
        }}
    />

    <button
        type="button"
        onClick={() =>
            setShowPassword(
                !showPassword
            )
        }
        style={eyeButtonStyle}
    >
        {showPassword ? "🙈" : "👁"}
    </button>

</div>

<button
    type="button"
    onClick={() =>
        router.push("/forgot-password")
    }
    disabled={loading}
    style={forgotPasswordStyle}
>
    Forgot Password?
</button>

<button
    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        ...primaryButtonStyle,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading
                            ? "not-allowed"
                            : "pointer"
                    }}
                >
                    {loading
                        ? "Signing In..."
                        : "Sign In"}
                </button>

                <button
                    onClick={() =>
                        router.replace("/register")
                    }
                    disabled={loading}
                    style={secondaryButtonStyle}
                >
                    Create New Account
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
    maxWidth: "600px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "36px",
    border: "1px solid #d1d5db",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box"
};

const eyeButtonStyle: React.CSSProperties = {

    position: "absolute",

    right: "14px",

    top: "50%",

    transform: "translateY(-50%)",

    border: "none",

    background: "transparent",

    cursor: "pointer",

    fontSize: "18px",

    padding: 0,

    color: "#6b7280",

};

const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    marginTop: "28px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold"
};

const secondaryButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    marginTop: "12px",
    background: "#ffffff",
    color: "#2563eb",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
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

const footerStyle: React.CSSProperties = {
    marginTop: "28px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "12px"
};

const forgotPasswordStyle: React.CSSProperties = {
    display: "block",
    marginLeft: "auto",
    marginTop: "10px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
};
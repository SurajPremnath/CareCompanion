"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";

export default function CreatePin() {
    const router = useRouter();

    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handlePinChange = (
        value: string,
        setter: (value: string) => void
    ) => {
        const digitsOnly =
            value.replace(/\D/g, "").slice(0, 6);

        setter(digitsOnly);
        setError("");
        setSaved(false);
    };

    const handleSave = async () => {
        setError("");

        if (pin.length !== 6) {
            setError("Please enter a 6-digit PIN.");
            return;
        }

        if (confirmPin.length !== 6) {
            setError("Please confirm your 6-digit PIN.");
            return;
        }

        if (pin !== confirmPin) {
            setError("The PINs do not match.");
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                "/api/security/create-pin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pin,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ||
                    "Unable to save your PIN."
                );
            }

            setSaved(true);

            await authService.logout();

            router.replace("/login");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save your PIN."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="carevr-pin-page">

            <div className="background-shape background-shape-one" />
            <div className="background-shape background-shape-two" />

            <div className="page-shell">

                <header className="brand-header">
                    <img
                        src="/images/CareVR v1.0.png"
                        alt="CareVR"
                        className="carevr-logo"
                    />

                    <div className="brand-message">
                        <span>People</span>
                        <span>Health</span>
                        <span>Together</span>
                    </div>
                </header>

                <section
                    className="pin-card"
                    aria-labelledby="create-pin-title"
                >

                    <div className="eyebrow">
                        SECURE ACCESS SETUP
                    </div>

                    <h1 id="create-pin-title">
                        Create Your CareVR PIN
                    </h1>

                    <p className="intro">
                        Create a 6-digit PIN to protect your
                        CareVR account and keep your health
                        information secure across your devices.
                    </p>

                    <div className="fields">

                        <div className="field-group">

                            <label htmlFor="carevr-pin">
                                Create PIN
                            </label>

                            <input
                                id="carevr-pin"
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="new-password"
                                maxLength={6}
                                value={pin}
                                onChange={(event) =>
                                    handlePinChange(
                                        event.target.value,
                                        setPin
                                    )
                                }
                                disabled={
                                    saving ||
                                    saved
                                }
                                aria-label="Create 6-digit CareVR PIN"
                                className="pin-input"
                            />

                            <div
                                className="digit-hint"
                                aria-hidden="true"
                            >
                                {Array.from({
                                    length: 6,
                                }).map((_, index) => (
                                    <span
                                        key={index}
                                        className={
                                            index <
                                            pin.length
                                                ? "digit-dot filled"
                                                : "digit-dot"
                                        }
                                    />
                                ))}
                            </div>

                        </div>

                        <div className="field-group">

                            <label htmlFor="carevr-confirm-pin">
                                Confirm PIN
                            </label>

                            <input
                                id="carevr-confirm-pin"
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="new-password"
                                maxLength={6}
                                value={confirmPin}
                                onChange={(event) =>
                                    handlePinChange(
                                        event.target.value,
                                        setConfirmPin
                                    )
                                }
                                disabled={
                                    saving ||
                                    saved
                                }
                                aria-label="Confirm 6-digit CareVR PIN"
                                className="pin-input"
                            />

                            <div
                                className="digit-hint"
                                aria-hidden="true"
                            >
                                {Array.from({
                                    length: 6,
                                }).map((_, index) => (
                                    <span
                                        key={index}
                                        className={
                                            index <
                                            confirmPin.length
                                                ? "digit-dot filled"
                                                : "digit-dot"
                                        }
                                    />
                                ))}
                            </div>

                        </div>

                    </div>

                    {error && (
                        <div
                            className="message message-error"
                            role="alert"
                        >
                            <span className="message-icon">
                                !
                            </span>

                            <span>{error}</span>
                        </div>
                    )}

                    {saved && (
                        <div
                            className="message message-success"
                            role="status"
                        >
                            <span className="message-icon">
                                ✓
                            </span>

                            <span>
                                Your CareVR PIN has been saved.
                            </span>
                        </div>
                    )}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleSave}
                        disabled={
                            saving ||
                            saved ||
                            pin.length !== 6 ||
                            confirmPin.length !== 6
                        }
                    >
                        <span>
                            {saving
                                ? "Saving..."
                                : saved
                                    ? "PIN Saved"
                                    : "Create PIN"}
                        </span>

                        {!saving && !saved && (
                            <span className="button-arrow">
                                →
                            </span>
                        )}
                    </button>

                    <div className="security-note">

                        <div className="security-icon">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="11"
                                    rx="2"
                                />

                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                                <circle
                                    cx="12"
                                    cy="15.5"
                                    r="1"
                                />
                            </svg>
                        </div>

                        <div>
                            <strong>
                                Your PIN works across your devices.
                            </strong>

                            <p>
                                It is securely protected and
                                never stored as readable text.
                            </p>
                        </div>

                    </div>

                </section>

                <footer className="page-footer">

                    <div className="footer-tagline">
                        Care Today.
                        <br />
                        A Healthier Tomorrow.
                    </div>

                    <div className="footer-center">
                        SIMPLE
                        <span>|</span>
                        SECURE
                        <span>|</span>
                        TOGETHER

                        <div className="footer-line" />
                    </div>

                </footer>

            </div>

            <style jsx>{`

                .carevr-pin-page {
                    position: relative;
                    min-height: 100vh;
                    min-height: 100dvh;
                    overflow: hidden;

                    background:
                        linear-gradient(
                            135deg,
                            #f8faff 0%,
                            #f3f4ff 48%,
                            #eeeaff 100%
                        );

                    color: #10204a;
                }

                .background-shape {
                    position: absolute;
                    pointer-events: none;
                    border-radius: 50%;
                    filter: blur(1px);
                }

                .background-shape-one {
                    width: 520px;
                    height: 520px;
                    top: -300px;
                    right: -180px;

                    background:
                        rgba(102, 74, 220, 0.08);
                }

                .background-shape-two {
                    width: 620px;
                    height: 360px;
                    bottom: -260px;
                    left: -220px;

                    background:
                        rgba(77, 111, 235, 0.08);

                    transform: rotate(-18deg);
                }

                .page-shell {
                    position: relative;
                    z-index: 1;

                    width: 100%;
                    min-height: 100vh;
                    min-height: 100dvh;

                    display: flex;
                    flex-direction: column;

                    padding:
                        22px
                        34px
                        18px;

                    box-sizing: border-box;
                }

                .brand-header {
                    width: 100%;

                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;

                    min-height: 110px;
                }

                .carevr-logo {
                    width: 210px;
                    height: 105px;

                    object-fit: contain;
                    object-position: left center;

                    display: block;
                }

                .brand-message {
                    display: flex;
                    flex-direction: column;

                    padding-top: 10px;

                    color: #50628f;

                    font-size: 14px;
                    line-height: 1.25;
                    font-weight: 600;
                }

                .pin-card {
                    width: 100%;
                    max-width: 570px;

                    margin:
                        18px auto 0;

                    padding:
                        42px
                        44px
                        38px;

                    box-sizing: border-box;

                    background:
                        rgba(255, 255, 255, 0.94);

                    border:
                        1px solid
                        rgba(255, 255, 255, 0.9);

                    border-radius: 28px;

                    box-shadow:
                        0 24px 70px
                        rgba(48, 44, 110, 0.14);

                    text-align: center;

                    backdrop-filter:
                        blur(12px);
                }

                .eyebrow {
                    margin-bottom: 14px;

                    color: #6337d2;

                    font-size: 14px;
                    line-height: 1.2;
                    font-weight: 800;

                    letter-spacing: 1.6px;
                }

                h1 {
                    margin: 0;

                    color: #10204a;

                    font-size: 34px;
                    line-height: 1.16;
                    font-weight: 760;

                    letter-spacing: -0.7px;
                }

                .intro {
                    max-width: 455px;

                    margin:
                        18px auto 32px;

                    color: #52638d;

                    font-size: 17px;
                    line-height: 1.55;
                }

                .fields {
                    display: flex;
                    flex-direction: column;

                    gap: 18px;

                    text-align: left;
                }

                .field-group {
                    position: relative;
                }

                label {
                    display: block;

                    margin-bottom: 8px;

                    color: #17254d;

                    font-size: 16px;
                    font-weight: 700;
                }

                .pin-input {
                    width: 100%;
                    height: 64px;

                    box-sizing: border-box;

                    padding:
                        0
                        22px;

                    border:
                        1px solid
                        #d5dcef;

                    border-radius: 15px;

                    background:
                        #f9faff;

                    color: #152657;

                    font-size: 28px;
                    font-weight: 700;

                    letter-spacing: 10px;

                    text-align: center;

                    outline: none;

                    transition:
                        border-color 0.15s ease,
                        box-shadow 0.15s ease;
                }

                .pin-input:focus {
                    border-color: #6337d2;

                    box-shadow:
                        0 0 0 4px
                        rgba(99, 55, 210, 0.11);
                }

                .pin-input:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .digit-hint {
                    position: absolute;

                    left: 0;
                    right: 0;
                    bottom: 8px;

                    display: flex;
                    justify-content: center;

                    gap: 9px;

                    pointer-events: none;
                }

                .digit-dot {
                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: #c7cde0;
                }

                .digit-dot.filled {
                    background: #5069bd;
                }

                .message {
                    display: flex;
                    align-items: center;

                    gap: 10px;

                    margin-top: 18px;
                    padding: 12px 14px;

                    border-radius: 12px;

                    font-size: 14px;
                    line-height: 1.4;

                    text-align: left;
                }

                .message-error {
                    background: #fff5f5;
                    border: 1px solid #f0d0d0;
                    color: #9c3030;
                }

                .message-success {
                    background: #f1faf4;
                    border: 1px solid #d1ead8;
                    color: #27663c;
                }

                .message-icon {
                    width: 23px;
                    height: 23px;

                    flex: 0 0 23px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    background: currentColor;

                    color: #ffffff;

                    font-size: 13px;
                    font-weight: 800;
                }

                .message-error .message-icon {
                    background: #b33b3b;
                }

                .message-success .message-icon {
                    background: #3b8a58;
                }

                .primary-button {
                    width: 100%;
                    min-height: 60px;

                    margin-top: 24px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 12px;

                    border: 0;
                    border-radius: 16px;

                    background:
                        linear-gradient(
                            135deg,
                            #5834e6,
                            #7b3fe4
                        );

                    color: #ffffff;

                    font-size: 17px;
                    font-weight: 750;

                    cursor: pointer;

                    box-shadow:
                        0 13px 28px
                        rgba(91, 58, 218, 0.22);

                    transition:
                        transform 0.15s ease,
                        box-shadow 0.15s ease,
                        opacity 0.15s ease;
                }

                .primary-button:hover:not(:disabled) {
                    transform: translateY(-1px);

                    box-shadow:
                        0 16px 32px
                        rgba(91, 58, 218, 0.28);
                }

                .primary-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .primary-button:disabled {
                    opacity: 0.48;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .button-arrow {
                    font-size: 25px;
                    line-height: 1;
                }

                .security-note {
                    display: flex;
                    align-items: center;

                    gap: 13px;

                    margin-top: 20px;

                    padding:
                        15px
                        16px;

                    border-radius: 15px;

                    background:
                        #f4f7ff;

                    color: #50618a;

                    text-align: left;
                }

                .security-icon {
                    width: 42px;
                    height: 42px;

                    flex: 0 0 42px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 12px;

                    background:
                        #e6efff;

                    color: #4275d8;
                }

                .security-note strong {
                    display: block;

                    margin-bottom: 2px;

                    color: #263a6b;

                    font-size: 13px;
                }

                .security-note p {
                    margin: 0;

                    font-size: 12px;
                    line-height: 1.45;
                }

                .page-footer {
                    width: 100%;

                    margin-top: auto;
                    padding-top: 25px;

                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                }

                .footer-tagline {
                    color: #7180a5;

                    font-size: 14px;
                    line-height: 1.35;
                    font-style: italic;
                }

                .footer-center {
                    color: #7080a9;

                    font-size: 12px;
                    font-weight: 700;

                    letter-spacing: 1.7px;

                    text-align: center;
                }

                .footer-center span {
                    margin: 0 9px;
                    color: #a1a9c0;
                }

                .footer-line {
                    width: 38px;
                    height: 3px;

                    margin:
                        10px auto 0;

                    border-radius: 5px;

                    background:
                        linear-gradient(
                            90deg,
                            #5936df,
                            #833fe3
                        );
                }

                @media (max-width: 700px) {

                    .page-shell {
                        padding:
                            14px
                            16px
                            16px;
                    }

                    .brand-header {
                        min-height: 82px;
                    }

                    .carevr-logo {
                        width: 160px;
                        height: 78px;
                    }

                    .brand-message {
                        padding-top: 6px;
                        font-size: 10px;
                    }

                    .pin-card {
                        margin-top: 8px;

                        padding:
                            32px
                            20px
                            28px;

                        border-radius: 23px;
                    }

                    h1 {
                        font-size: 28px;
                    }

                    .intro {
                        font-size: 15px;
                        margin-bottom: 26px;
                    }

                    .pin-input {
                        height: 60px;
                        font-size: 25px;
                        letter-spacing: 8px;
                    }

                    .page-footer {
                        padding-top: 18px;
                    }

                    .footer-tagline {
                        font-size: 11px;
                    }

                    .footer-center {
                        font-size: 9px;
                        letter-spacing: 1px;
                    }

                    .footer-center span {
                        margin: 0 4px;
                    }
                }

            `}</style>
        </main>
    );
}
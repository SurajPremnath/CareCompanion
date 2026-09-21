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
            setError(
                "Please enter a 6-digit PIN."
            );
            return;
        }

        if (confirmPin.length !== 6) {
            setError(
                "Please confirm your 6-digit PIN."
            );
            return;
        }

        if (pin !== confirmPin) {
            setError(
                "The PINs do not match."
            );
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
        <section
            className="carevr-create-pin"
            aria-labelledby="create-pin-title"
        >

            <div className="pin-icon" aria-hidden="true">
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect
                        x="3"
                        y="11"
                        width="18"
                        height="10"
                        rx="2"
                    />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" />
                </svg>
            </div>

            <h1 id="create-pin-title">
                Secure Your CareVR Access
            </h1>

            <h2>
                Create your CareVR PIN
            </h2>

            <p className="pin-intro">
                Use a 6-digit PIN to secure your
                CareVR account.
            </p>

            <div className="pin-fields">

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
                    disabled={saving || saved}
                    aria-label="Create 6-digit CareVR PIN"
                />

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
                    disabled={saving || saved}
                    aria-label="Confirm 6-digit CareVR PIN"
                />

            </div>

            <p className="pin-device-message">
                Your CareVR PIN works across your devices.
            </p>

            {error && (
                <div
                    className="pin-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {saved && (
                <div
                    className="pin-success"
                    role="status"
                >
                    Your CareVR PIN has been saved.
                </div>
            )}

            <button
                type="button"
                className="save-pin-button"
                onClick={handleSave}
                disabled={
                    saving ||
                    saved ||
                    pin.length !== 6 ||
                    confirmPin.length !== 6
                }
            >
                {saving
                    ? "Saving..."
                    : saved
                        ? "PIN Saved"
                        : "Save PIN"}
            </button>

            <p className="pin-security-note">
                Your PIN is securely protected and is
                not stored as readable text.
            </p>

            <style jsx>{`

                .carevr-create-pin {
                    width: 100%;
                    max-width: 560px;
                    margin: 0 auto;
                    padding: 38px 34px;
                    background: #ffffff;
                    border-radius: 22px;
                    box-shadow:
                        0 20px 60px
                        rgba(32, 14, 88, 0.22);
                    text-align: center;
                }

                .pin-icon {
                    width: 72px;
                    height: 72px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6337d2;
                    background: #f0ebff;
                }

                h1 {
                    margin: 0;
                    color: #24165f;
                    font-size: 32px;
                    line-height: 1.2;
                    font-weight: 750;
                }

                h2 {
                    margin: 12px 0 12px;
                    color: #6136ce;
                    font-size: 24px;
                    line-height: 1.3;
                    font-weight: 700;
                }

                .pin-intro {
                    margin: 0 auto 28px;
                    color: #59627d;
                    font-size: 16px;
                    line-height: 1.5;
                }

                .pin-fields {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    gap: 8px;
                }

                label {
                    color: #29345b;
                    font-size: 15px;
                    font-weight: 650;
                }

                input {
                    width: 100%;
                    height: 58px;
                    margin-bottom: 12px;
                    padding: 0 18px;
                    border: 1px solid #d9d3ed;
                    border-radius: 12px;
                    background: #faf9ff;
                    color: #211758;
                    font-size: 26px;
                    font-weight: 650;
                    letter-spacing: 8px;
                    text-align: center;
                    outline: none;
                    box-sizing: border-box;
                }

                input:focus {
                    border-color: #6337d2;
                    box-shadow:
                        0 0 0 3px
                        rgba(99, 55, 210, 0.12);
                }

                input:disabled {
                    opacity: 0.7;
                }

                .pin-device-message {
                    margin: 6px 0 18px;
                    color: #59627d;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .pin-error {
                    margin-bottom: 16px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    background: #fff1f1;
                    color: #a12626;
                    font-size: 14px;
                }

                .pin-success {
                    margin-bottom: 16px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    background: #effaf3;
                    color: #23663b;
                    font-size: 14px;
                }

                .save-pin-button {
                    width: 100%;
                    min-height: 56px;
                    border: 0;
                    border-radius: 14px;
                    background:
                        linear-gradient(
                            135deg,
                            #6337d2,
                            #7549df
                        );
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow:
                        0 10px 24px
                        rgba(99, 55, 210, 0.22);
                }

                .save-pin-button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .pin-security-note {
                    margin: 16px 0 0;
                    color: #68708a;
                    font-size: 13px;
                    line-height: 1.45;
                }

                @media (max-width: 600px) {

                    .carevr-create-pin {
                        padding: 28px 18px;
                        border-radius: 20px;
                    }

                    h1 {
                        font-size: 28px;
                    }

                    h2 {
                        font-size: 22px;
                    }

                    input {
                        height: 54px;
                        font-size: 24px;
                    }

                }

            `}</style>

        </section>
    );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";

export default function CreatePin() {

    const router = useRouter();

    const [pin, setPin] =
        useState("");

    const [confirmPin, setConfirmPin] =
        useState("");

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [saved, setSaved] =
        useState(false);


    const handlePinChange = (
        value: string,
        setter: (value: string) => void
    ) => {

        const digitsOnly =
            value
                .replace(/\D/g, "")
                .slice(0, 6);

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

            const response =
                await fetch(
                    "/api/security/create-pin",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            pin,
                        }),
                    }
                );

            const result =
                await response.json();

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
        <main className="carevr-security-page">

            <div className="background-orb orb-one" />
            <div className="background-orb orb-two" />

            <div className="security-shell">

                <header className="security-header">

                    <img
                        src="/images/CareVR v1.0.png"
                        alt="CareVR"
                        className="carevr-logo"
                    />

                    <div className="security-tagline">
                        <span>SIMPLE</span>
                        <span>SECURE</span>
                        <span>TOGETHER</span>
                    </div>

                </header>


                <section
                    className="security-card"
                    aria-labelledby="create-pin-title"
                >

                    <div
                        className="security-icon"
                        aria-hidden="true"
                    >
                        <svg
                            width="38"
                            height="38"
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

                            <circle
                                cx="12"
                                cy="16"
                                r="1"
                            />
                        </svg>
                    </div>


                    <div className="security-eyebrow">
                        SECURE ACCESS SETUP
                    </div>


                    <h1 id="create-pin-title">
                        Create Your CareVR PIN
                    </h1>


                    <p className="security-intro">
                        Create a 6-digit PIN to protect
                        your CareVR account.
                    </p>


                    <div className="pin-fields">

                        <div className="field">

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
                            />

                            <span className="field-hint">
                                6 digits
                            </span>

                        </div>


                        <div className="field">

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
                            />

                            <span className="field-hint">
                                Enter the same PIN
                            </span>

                        </div>

                    </div>


                    {error && (

                        <div
                            className="message message-error"
                            role="alert"
                        >
                            <span className="message-symbol">
                                !
                            </span>

                            <span>
                                {error}
                            </span>
                        </div>

                    )}


                    {saved && (

                        <div
                            className="message message-success"
                            role="status"
                        >
                            <span className="message-symbol">
                                ✓
                            </span>

                            <span>
                                Your CareVR PIN has been
                                saved securely.
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
                                ? "Saving PIN..."
                                : saved
                                    ? "PIN Saved"
                                    : "Create PIN"}
                        </span>

                        {!saving &&
                            !saved && (
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h13" />
                                    <path d="m13 6 6 6-6 6" />
                                </svg>
                            )}

                    </button>


                    <div className="security-note">

                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>

                        <span>
                            Your PIN works across your
                            devices and is not stored as
                            readable text.
                        </span>

                    </div>

                </section>


                <p className="security-footer">
                    Care Today. A Healthier Tomorrow.
                </p>

            </div>


            <style jsx>{`

                .carevr-security-page {
                    min-height: 100vh;
                    min-height: 100dvh;

                    position: relative;
                    overflow: hidden;

                    background:
                        linear-gradient(
                            135deg,
                            #f7f4ff 0%,
                            #eeeaff 48%,
                            #e8e5ff 100%
                        );

                    color: #182344;
                }


                .background-orb {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;

                    background:
                        rgba(
                            99,
                            55,
                            210,
                            0.08
                        );
                }


                .orb-one {
                    width: 380px;
                    height: 380px;

                    top: -200px;
                    right: -100px;
                }


                .orb-two {
                    width: 440px;
                    height: 440px;

                    bottom: -270px;
                    left: -200px;

                    background:
                        rgba(
                            81,
                            107,
                            218,
                            0.07
                        );
                }


                .security-shell {
                    position: relative;
                    z-index: 1;

                    min-height: 100vh;
                    min-height: 100dvh;

                    display: flex;
                    flex-direction: column;

                    padding:
                        22px 34px 20px;
                }


                .security-header {
                    width: 100%;

                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;

                    min-height: 76px;
                }


                .carevr-logo {
                    width: 190px;
                    height: 70px;

                    object-fit: contain;
                    object-position: left center;
                }


                .security-tagline {
                    display: flex;
                    flex-direction: column;

                    padding-top: 6px;

                    color: #6c7390;

                    font-size: 11px;
                    line-height: 1.55;

                    font-weight: 750;

                    letter-spacing: 2px;
                }


                .security-tagline::after {
                    content: "";

                    width: 40px;
                    height: 3px;

                    margin-top: 8px;

                    border-radius: 4px;

                    background:
                        #6337d2;
                }


                .security-card {
                    width: min(
                        590px,
                        calc(100% - 20px)
                    );

                    margin: auto;

                    padding:
                        44px 48px 38px;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.97
                        );

                    border:
                        1px solid
                        rgba(
                            255,
                            255,
                            255,
                            0.95
                        );

                    border-radius: 28px;

                    box-shadow:
                        0 28px 80px
                        rgba(
                            42,
                            28,
                            102,
                            0.17
                        );

                    text-align: center;
                }


                .security-icon {
                    width: 82px;
                    height: 82px;

                    margin:
                        0 auto 20px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    color: #6337d2;

                    background:
                        linear-gradient(
                            145deg,
                            #f3efff,
                            #e9e3ff
                        );
                }


                .security-eyebrow {
                    margin-bottom: 8px;

                    color: #7658ca;

                    font-size: 11px;
                    font-weight: 800;

                    letter-spacing: 2px;
                }


                h1 {
                    margin: 0;

                    color: #1d2a52;

                    font-size: 31px;
                    line-height: 1.2;

                    font-weight: 760;
                }


                .security-intro {
                    max-width: 470px;

                    margin:
                        13px auto 27px;

                    color: #69718b;

                    font-size: 16px;
                    line-height: 1.55;
                }


                .pin-fields {
                    display: flex;
                    flex-direction: column;

                    gap: 17px;

                    text-align: left;
                }


                .field {
                    position: relative;
                }


                label {
                    display: block;

                    margin-bottom: 8px;

                    color: #2b365b;

                    font-size: 14px;
                    font-weight: 720;
                }


                input {
                    width: 100%;
                    height: 59px;

                    box-sizing: border-box;

                    padding:
                        0 18px;

                    border:
                        1.5px solid
                        #d9d3ed;

                    border-radius: 14px;

                    background: #faf9ff;

                    color: #22175a;

                    font-size: 25px;
                    font-weight: 700;

                    letter-spacing: 9px;

                    text-align: center;

                    outline: none;

                    transition:
                        border-color 0.18s ease,
                        box-shadow 0.18s ease,
                        background 0.18s ease;
                }


                input:focus {
                    border-color:
                        #6337d2;

                    background:
                        #ffffff;

                    box-shadow:
                        0 0 0 4px
                        rgba(
                            99,
                            55,
                            210,
                            0.10
                        );
                }


                input:disabled {
                    opacity: 0.6;
                    cursor: wait;
                }


                .field-hint {
                    display: block;

                    margin-top: 6px;

                    color: #8a91a8;

                    font-size: 11px;
                }


                .message {
                    display: flex;
                    align-items: center;

                    gap: 10px;

                    margin-top: 17px;

                    padding:
                        12px 14px;

                    border-radius: 12px;

                    font-size: 13px;

                    text-align: left;
                }


                .message-symbol {
                    width: 24px;
                    height: 24px;

                    flex: 0 0 24px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    font-weight: 800;
                }


                .message-error {
                    background: #fff4f4;
                    color: #9d3030;

                    border:
                        1px solid
                        #f0d4d4;
                }


                .message-error .message-symbol {
                    background: #c94b4b;
                    color: #ffffff;
                }


                .message-success {
                    background: #f0faf4;
                    color: #286640;

                    border:
                        1px solid
                        #d6ecdd;
                }


                .message-success .message-symbol {
                    background: #39885a;
                    color: #ffffff;
                }


                .primary-button {
                    width: 100%;

                    min-height: 58px;

                    margin-top: 21px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 12px;

                    border: 0;
                    border-radius: 15px;

                    background:
                        linear-gradient(
                            135deg,
                            #6337d2,
                            #7549df
                        );

                    color: #ffffff;

                    font-size: 17px;
                    font-weight: 750;

                    cursor: pointer;

                    box-shadow:
                        0 12px 27px
                        rgba(
                            99,
                            55,
                            210,
                            0.24
                        );

                    transition:
                        transform 0.16s ease,
                        box-shadow 0.16s ease,
                        opacity 0.16s ease;
                }


                .primary-button:hover:not(:disabled) {
                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 15px 31px
                        rgba(
                            99,
                            55,
                            210,
                            0.29
                        );
                }


                .primary-button:disabled {
                    opacity: 0.52;
                    cursor: not-allowed;
                    box-shadow: none;
                }


                .security-note {
                    display: flex;
                    align-items: center;

                    gap: 11px;

                    margin-top: 21px;

                    padding:
                        14px 15px;

                    border-radius: 14px;

                    background:
                        #f6f3ff;

                    color: #69718b;

                    font-size: 12px;
                    line-height: 1.5;

                    text-align: left;
                }


                .security-note svg {
                    flex: 0 0 auto;
                    color: #6337d2;
                }


                .security-footer {
                    margin:
                        0 auto;

                    color: #8a90aa;

                    font-size: 12px;
                }


                @media (max-width: 650px) {

                    .security-shell {
                        padding:
                            12px 16px 18px;
                    }


                    .security-header {
                        min-height: 62px;
                    }


                    .carevr-logo {
                        width: 145px;
                        height: 56px;
                    }


                    .security-tagline {
                        font-size: 9px;
                        letter-spacing: 1.5px;
                    }


                    .security-card {
                        width: 100%;

                        padding:
                            32px 20px 28px;

                        border-radius: 22px;
                    }


                    .security-icon {
                        width: 70px;
                        height: 70px;
                    }


                    h1 {
                        font-size: 27px;
                    }


                    .security-intro {
                        font-size: 15px;
                    }


                    input {
                        height: 56px;
                        font-size: 23px;
                        letter-spacing: 7px;
                    }


                    .security-footer {
                        margin-top: 17px;
                    }
                }

            `}</style>

        </main>
    );
}
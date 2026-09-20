"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CareVRFooter from "@/Components/common/CareVRFooter";
import { supabase } from "@/lib/supabase";

export default function SecureAccessPage() {
    const router = useRouter();


    const [creatingPasskey, setCreatingPasskey] =
        useState(false);

    const [passkeyCreated, setPasskeyCreated] =
        useState(false);

    const [error, setError] =
        useState("");

const handleCreatePasskey = async () => {
    console.log("CareVR Secure Access: Create Passkey clicked");

    if (creatingPasskey) {
        return;
    }

    setCreatingPasskey(true);
    setError("");

    try {
        const isLoginFlow =
            new URLSearchParams(window.location.search).get("flow") ===
            "LOGIN";
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

console.log(
    "CareVR Secure Access: authenticated user",
    {
        id: user?.id,
        email: user?.email,
        hasUser: !!user,
        userError,
    }
);

            if (userError) {
                throw new Error(
                    "Unable to verify your CareVR account."
                );
            }

if (!user) {
    router.replace("/login");
    return;
}

const {
    data: aal,
    error: aalError,
} =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

console.log(
    "CareVR Secure Access: AAL",
    {
        currentLevel: aal?.currentLevel,
        nextLevel: aal?.nextLevel,
        currentAuthenticationMethods:
            aal?.currentAuthenticationMethods,
        aalError,
    }
);

const {
    data: factors,
    error: factorsError,
} =
    await supabase.auth.mfa.listFactors();

console.log(
    "CareVR Secure Access: MFA factors",
    JSON.stringify(
        {
            factors,
            factorsError,
        },
        null,
        2
    )
);

const {
    data,
    error: passkeyError,
} = await supabase.auth.registerPasskey();

            if (passkeyError) {
                throw new Error(
                    passkeyError.message ||
                    "Unable to create your CareVR Passkey."
                );
            }

if (!data) {
    throw new Error(
        "Passkey registration did not return a credential."
    );
}

if (isLoginFlow) {
    router.replace("/login?passkey=created");
    return;
}

setPasskeyCreated(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create your CareVR Passkey."
            );
        } finally {
            setCreatingPasskey(false);
        }
    };


    return (
        <div className="secure-access-page">
            <div className="secure-access-shell">

                {/* ============================
                    CAREVR HEADER
                ============================ */}

                <header className="secure-access-header">

                    <button
                        type="button"
                        className="carevr-brand"
                        onClick={() => router.replace("/login")}
                        aria-label="CareVR"
                    >
                        <img
                            src="/images/CareVR v1.0.png"
                            alt="CareVR"
                            className="carevr-logo"
                        />
                    </button>

                    <div className="header-actions">

                        <button
                            type="button"
                            className="home-button"
                            onClick={() => router.replace("/login")}
                            aria-label="Go to Login"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M3 12h18" />
                                <path d="m15 6 6 6-6 6" />
                            </svg>

                            Login
                        </button>

                    </div>

                </header>


                {/* ============================
                    SECURE ACCESS CONTENT
                ============================ */}

                <main className="secure-access-main">

                    <section
                        className="secure-access-card"
                        aria-labelledby="secure-access-title"
                    >

                        <div className="security-icon">
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                <path d="M12 15v2" />
                            </svg>
                        </div>


                        <h1 id="secure-access-title">
                            Secure Your CareVR Access
                        </h1>

                        <h2>
                            Create your CareVR Passkey
                        </h2>

                        <p className="intro-text">
                            Use your device&apos;s built-in security
                            to protect your CareVR account.
                        </p>

                        <p className="intro-supporting-text">
                            Depending on your device, you may be asked
                            to use one of the following:
                        </p>


                        {/* ============================
                            DEVICE OPTIONS
                        ============================ */}

                        <div className="security-options">

                            <div className="security-option">

                                <div className="option-icon">
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M3 9V6a3 3 0 0 1 3-3h3" />
                                        <path d="M21 9V6a3 3 0 0 0-3-3h-3" />
                                        <path d="M3 15v3a3 3 0 0 0 3 3h3" />
                                        <path d="M21 15v3a3 3 0 0 1-3 3h-3" />
                                        <circle cx="9" cy="10" r="1" />
                                        <circle cx="15" cy="10" r="1" />
                                        <path d="M8 15c1.1 1 2.3 1.5 4 1.5s2.9-.5 4-1.5" />
                                    </svg>
                                </div>

                                <strong>Face ID</strong>

                                <span>
                                    Facial recognition
                                </span>

                            </div>


                            <div className="security-option">

                                <div className="option-icon">
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 4c-3.3 0-6 2.7-6 6v1" />
                                        <path d="M18 11v-1a6 6 0 0 0-12 0" />
                                        <path d="M8 11v-1a4 4 0 0 1 8 0v2" />
                                        <path d="M10 12v-2a2 2 0 0 1 4 0v4" />
                                        <path d="M6 13v-2" />
                                        <path d="M18 13v-2" />
                                        <path d="M8 15c.5 3 2 5 4 5s3.5-2 4-5" />
                                    </svg>
                                </div>

                                <strong>Fingerprint</strong>

                                <span>
                                    Touch ID
                                </span>

                            </div>


                            <div className="security-option">

                                <div className="option-icon">
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
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
                                        <path d="M12 14v2" />
                                    </svg>
                                </div>

                                <strong>Device PIN</strong>

                                <span>
                                    Screen lock
                                </span>

                            </div>


                            <div className="security-option">

                                <div className="option-icon">
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                    >
                                        <path d="M3 5h8v7H3z" />
                                        <path d="M13 5h8v7h-8z" />
                                        <path d="M3 14h8v5H3z" />
                                        <path d="M13 14h8v5h-8z" />
                                    </svg>
                                </div>

                                <strong>Windows Hello</strong>

                                <span>
                                    On supported devices
                                </span>

                            </div>

                        </div>


                        {/* ============================
                            PRIVACY MESSAGE
                        ============================ */}

                        <div className="privacy-message">

                            <div className="privacy-icon">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>

                            <div>
                                <strong>
                                    Your biometric information stays with you.
                                </strong>

                                <p>
                                    CareVR never sees or stores your Face ID,
                                    fingerprint, or device PIN.
                                </p>
                            </div>

                        </div>


                        {/* ============================
                            IMPORTANT WARNING
                        ============================ */}

                        <div
                            className="passkey-warning"
                            role="note"
                        >

                            <div className="warning-icon">
                                !
                            </div>

                            <div>

                                <strong>
                                    Please choose wisely
                                </strong>

                                <p>
                                    Set up your Passkey on a device or
                                    account that you will continue to have
                                    access to, such as your personal phone
                                    or computer.
                                </p>

                                <p>
                                    If you lose access to your device and
                                    Passkey, signing in to CareVR may become
                                    difficult.
                                </p>

                            </div>

                        </div>


                        {/* ============================
                            CREATE PASSKEY
                        ============================ */}

                        <button
                            type="button"
                            className="create-passkey-button"
                            onClick={handleCreatePasskey}
                            disabled={creatingPasskey || passkeyCreated}
                            aria-disabled={
                                creatingPasskey || passkeyCreated
                                    ? "true"
                                    : "false"
                            }
                        >
                            <svg
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="7.5" cy="15.5" r="4.5" />
                                <path d="m11 12 8-8" />
                                <path d="m17 4 3 3" />
                                <path d="m14 7 3 3" />
                            </svg>

                            Create Passkey
                        </button>


                        <div className="help-area">

                            <span>
                                Need help?
                            </span>

                            <button
                                type="button"
                                className="learn-more-button"
                            >
                                Learn more about Passkeys
                                <span aria-hidden="true">
                                    ↗
                                </span>
                            </button>

                        </div>

                    </section>

                </main>


                {/* ============================
                    COMMON CAREVR FOOTER
                ============================ */}

                <CareVRFooter />

            </div>


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
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;

                    color: #15203d;
                }

                button {
                    font: inherit;
                }


                /* ============================
                   PAGE
                ============================ */

                .secure-access-page {
                    min-height: 100vh;
                    min-height: 100dvh;

                    background:
                        linear-gradient(
                            135deg,
                            #4f2aa8 0%,
                            #663bd1 48%,
                            #7c55df 100%
                        );

                    position: relative;
                    overflow-x: hidden;
                }


                .secure-access-page::before,
                .secure-access-page::after {
                    content: "";
                    position: fixed;

                    width: 360px;
                    height: 360px;

                    border-radius: 50%;

                    background:
                        rgba(255,255,255,0.06);

                    pointer-events: none;
                }

                .secure-access-page::before {
                    top: -170px;
                    left: -170px;
                }

                .secure-access-page::after {
                    right: -180px;
                    bottom: -170px;
                }


                .secure-access-shell {
                    width: 100%;
                    min-height: 100vh;
                    min-height: 100dvh;

                    display: flex;
                    flex-direction: column;

                    padding:
                        20px
                        28px
                        18px;

                    position: relative;
                    z-index: 1;
                }


                /* ============================
                   HEADER
                ============================ */

                .secure-access-header {
                    width: 100%;
                    min-height: 72px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    gap: 16px;
                }

                .carevr-brand {
                    border: 0;
                    background: transparent;
                    padding: 0;

                    cursor: pointer;

                    display: flex;
                    align-items: center;
                }

                .carevr-logo {
                    display: block;

                    width: 190px;
                    height: 72px;

                    object-fit: contain;
                    object-position: left center;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .home-button {
                    height: 42px;

                    padding: 0 15px;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;

                    gap: 7px;

                    border:
                        1px solid
                        rgba(255,255,255,0.35);

                    border-radius: 12px;

                    background:
                        rgba(255,255,255,0.12);

                    color: #ffffff;

                    cursor: pointer;
                }

                .home-button:hover {
                    background:
                        rgba(255,255,255,0.2);
                }


                /* ============================
                   MAIN
                ============================ */

                .secure-access-main {
                    width: 100%;

                    flex: 1;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding:
                        30px
                        0
                        38px;
                }


                .secure-access-card {
                    width: min(900px, 100%);

                    background:
                        rgba(255,255,255,0.98);

                    border-radius: 24px;

                    padding:
                        42px
                        48px
                        38px;

                    box-shadow:
                        0 24px 70px
                        rgba(32, 14, 88, 0.28);

                    text-align: center;
                }


                /* ============================
                   SECURITY ICON
                ============================ */

                .security-icon {
                    width: 76px;
                    height: 76px;

                    margin: 0 auto 22px;

                    border-radius: 50%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    color: #6337d2;

                    background:
                        #f0ebff;
                }


                .secure-access-card h1 {
                    margin: 0;

                    color: #24165f;

                    font-size: clamp(
                        30px,
                        4vw,
                        44px
                    );

                    line-height: 1.15;
                    font-weight: 750;
                }


                .secure-access-card h2 {
                    margin:
                        12px
                        0
                        18px;

                    color: #6136ce;

                    font-size: clamp(
                        22px,
                        3vw,
                        30px
                    );

                    line-height: 1.25;
                    font-weight: 700;
                }


                .intro-text {
                    max-width: 690px;

                    margin:
                        0
                        auto
                        8px;

                    color: #394568;

                    font-size: 18px;
                    line-height: 1.55;
                }


                .intro-supporting-text {
                    margin:
                        0
                        auto
                        28px;

                    color: #59627d;

                    font-size: 16px;
                    line-height: 1.5;
                }


                /* ============================
                   DEVICE OPTIONS
                ============================ */

                .security-options {
                    display: grid;

                    grid-template-columns:
                        repeat(4, 1fr);

                    gap: 14px;

                    margin-bottom: 26px;
                }


                .security-option {
                    min-width: 0;

                    padding:
                        18px
                        10px
                        16px;

                    border:
                        1px solid
                        #e5dff8;

                    border-radius: 16px;

                    background:
                        #faf9ff;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }


                .option-icon {
                    width: 68px;
                    height: 68px;

                    margin-bottom: 10px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 16px;

                    color: #6337d2;

                    background:
                        #f0ebff;
                }


                .security-option strong {
                    color: #211758;

                    font-size: 15px;
                    line-height: 1.3;
                }


                .security-option span {
                    margin-top: 4px;

                    color: #68708a;

                    font-size: 13px;
                    line-height: 1.35;
                }


                /* ============================
                   PRIVACY
                ============================ */

                .privacy-message {
                    display: flex;
                    align-items: flex-start;

                    gap: 15px;

                    padding:
                        18px
                        20px;

                    margin-bottom: 18px;

                    text-align: left;

                    border-radius: 16px;

                    background:
                        #f5f2ff;

                    color: #29345b;
                }


                .privacy-icon {
                    flex: 0 0 auto;

                    color: #6337d2;

                    padding-top: 2px;
                }


                .privacy-message strong {
                    display: block;

                    margin-bottom: 5px;

                    font-size: 15px;
                }


                .privacy-message p {
                    margin: 0;

                    font-size: 14px;
                    line-height: 1.5;

                    color: #59627d;
                }


                /* ============================
                   WARNING
                ============================ */

                .passkey-warning {
                    display: flex;
                    align-items: flex-start;

                    gap: 14px;

                    padding:
                        17px
                        19px;

                    margin-bottom: 24px;

                    text-align: left;

                    border:
                        1px solid
                        #f0c66d;

                    border-radius: 15px;

                    background:
                        #fff8e8;

                    color: #573d0c;
                }


                .warning-icon {
                    width: 28px;
                    height: 28px;

                    flex: 0 0 28px;

                    border-radius: 50%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background:
                        #f2aa20;

                    color: #ffffff;

                    font-weight: 800;
                }


                .passkey-warning strong {
                    display: block;

                    margin-bottom: 5px;

                    color: #704900;

                    font-size: 16px;
                }


                .passkey-warning p {
                    margin:
                        0 0 5px;

                    color: #67542e;

                    font-size: 14px;
                    line-height: 1.5;
                }


                .passkey-warning p:last-child {
                    margin-bottom: 0;
                }


                /* ============================
                   CREATE BUTTON
                ============================ */

                .create-passkey-button {
                    width: 100%;

                    min-height: 56px;

                    border: 0;
                    border-radius: 14px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 11px;

                    background:
                        linear-gradient(
                            135deg,
                            #6337d2,
                            #7549df
                        );

                    color: #ffffff;

                    font-size: 18px;
                    font-weight: 700;

                    cursor: not-allowed;

                    opacity: 1;

                    box-shadow:
                        0 10px 24px
                        rgba(99,55,210,0.22);
                }


                /* ============================
                   HELP
                ============================ */

                .help-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    gap: 8px;

                    margin-top: 20px;

                    color: #59627d;

                    font-size: 14px;
                }


                .learn-more-button {
                    border: 0;
                    background: transparent;

                    color: #6337d2;

                    font-weight: 650;

                    cursor: pointer;

                    display: inline-flex;
                    align-items: center;

                    gap: 6px;
                }


                .learn-more-button:hover {
                    text-decoration: underline;
                }


                /* ============================
                   MOBILE
                ============================ */

                @media (max-width: 700px) {

                    .secure-access-shell {
                        padding:
                            12px
                            14px
                            12px;
                    }


                    .secure-access-header {
                        min-height: 58px;
                    }


                    .carevr-logo {
                        width: 145px;
                        height: 58px;
                    }


                    .home-button {
                        width: 42px;
                        padding: 0;

                        font-size: 0;
                    }


                    .secure-access-main {
                        padding:
                            18px
                            0
                            24px;

                        align-items: flex-start;
                    }


                    .secure-access-card {
                        padding:
                            28px
                            18px
                            26px;

                        border-radius: 20px;
                    }


                    .security-icon {
                        width: 64px;
                        height: 64px;

                        margin-bottom: 18px;
                    }


                    .secure-access-card h1 {
                        font-size: 29px;
                    }


                    .secure-access-card h2 {
                        font-size: 22px;

                        margin-top: 10px;
                    }


                    .intro-text {
                        font-size: 16px;
                    }


                    .intro-supporting-text {
                        font-size: 14px;

                        margin-bottom: 20px;
                    }


                    .security-options {
                        grid-template-columns:
                            repeat(2, 1fr);

                        gap: 10px;

                        margin-bottom: 18px;
                    }


                    .security-option {
                        padding:
                            14px
                            8px;
                    }


                    .option-icon {
                        width: 56px;
                        height: 56px;
                    }


                    .security-option strong {
                        font-size: 14px;
                    }


                    .security-option span {
                        font-size: 12px;
                    }


                    .privacy-message,
                    .passkey-warning {
                        padding:
                            15px;

                        gap: 11px;
                    }


                    .privacy-message p,
                    .passkey-warning p {
                        font-size: 13px;
                    }


                    .create-passkey-button {
                        min-height: 52px;

                        font-size: 17px;
                    }

                }


                @media (max-width: 380px) {

                    .secure-access-card {
                        padding:
                            24px
                            14px
                            22px;
                    }


                    .secure-access-card h1 {
                        font-size: 26px;
                    }


                    .secure-access-card h2 {
                        font-size: 20px;
                    }

                }

            `}</style>
        </div>
    );
}
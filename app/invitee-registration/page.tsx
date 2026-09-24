"use client";

import {
    Suspense,
    useEffect,
    useState,
} from "react";

import Image from "next/image";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { Turnstile } from "@marsidev/react-turnstile";

import CareVRFooter from "@/Components/common/CareVRFooter";

type Invitation = {
    id: string;
    email: string;
    role: string;
    familyId: string | null;
    governanceId: string | null;
    expiresAt: string;
};

function formatInviteeName(email: string) {
    const localPart =
        email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .trim();

    if (!localPart) {
        return "";
    }

    return localPart
        .split(/\s+/)
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() +
                part.slice(1).toLowerCase()
        )
        .join(" ");
}


function formatRole(role: string) {
    switch (role) {
        case "DOCTOR":
            return "Doctor";

        case "CARETAKER":
            return "Caretaker";

        case "SECONDARY_FAMILY_MEMBER":
            return "Family Member";

        case "PRIMARY":
            return "Primary User";

        default:
            return role
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                );
    }
}

function InviteeRegistrationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [invitation, setInvitation] =
        useState<Invitation | null>(null);

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

const [fullName, setFullName] =
    useState("");

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [captchaToken, setCaptchaToken] =
        useState<string | null>(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [registrationComplete, setRegistrationComplete] =
        useState(false);

const inviteeName =
    invitation
        ? formatInviteeName(invitation.email)
        : "";

useEffect(() => {
    if (invitation) {
        setFullName(inviteeName);
    }
}, [invitation, inviteeName]);

    useEffect(() => {
        let cancelled = false;

        async function validateInvitation() {
            if (!token) {
                if (!cancelled) {
                    setError(
                        "This invitation link is invalid."
                    );
                    setLoading(false);
                }

                return;
            }

            try {
                const response = await fetch(
                    "/api/invitee-registration/validate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            token,
                        }),
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ??
                            "Unable to validate the invitation."
                    );
                }

                if (!result.valid) {
                    throw new Error(
                        result.message ??
                            "This invitation link is invalid."
                    );
                }

                if (!cancelled) {
                    setInvitation(
                        result.invitation
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to validate the invitation."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void validateInvitation();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleCreateAccount = async () => {
        setError("");

        if (!token) {
            setError(
                "This invitation link is invalid."
            );
            return;
        }

        if (!invitation) {
            setError(
                "Invitation information is missing."
            );
            return;
        }

        if (!password) {
            setError(
                "Please enter a password."
            );
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

if (password !== confirmPassword) {
    setError(
        "Passwords do not match."
    );
    return;
}

if (!fullName.trim()) {
    setError(
        "Please enter your full name."
    );
    return;
}

        if (!captchaToken) {
            setError(
                "Please complete the security verification."
            );
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                "/api/invitee-registration/create-account",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password,
                        confirmPassword,
                        fullName,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                        "Unable to create the account."
                );
            }

            if (!result.success) {
                throw new Error(
                    result.message ??
                        "Unable to create the account."
                );
            }

            setPassword("");
            setConfirmPassword("");

            setRegistrationComplete(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create the account."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogin = () => {
        router.replace("/login");
    };

    if (loading) {
        return (
            <main className="invitee-page">
                <div className="loading-screen">
                    <div className="loading-card">
                        <div className="carevr-logo">
                            <span className="care">
                                Care
                            </span>
                            <span className="vr">
                                VR
                            </span>
                        </div>

                        <div className="loading-spinner" />

                        <h1>
                            Validating your invitation
                        </h1>

                        <p>
                            Please wait while we
                            securely verify your
                            invitation.
                        </p>
                    </div>
                </div>

                <style jsx global>
                    {styles}
                </style>
            </main>
        );
    }

    if (error && !invitation) {
        return (
            <main className="invitee-page">
                <div className="page-shell">

                    <header className="mobile-header">
<button
    type="button"
    className="logo-button"
    onClick={handleLogin}
    aria-label="CareVR"
>
    <Image
        src="/images/CareVR v1.0.png"
        alt="CareVR"
        width={160}
        height={48}
        className="carevr-header-logo"
        priority
    />
</button>

                        <button
                            type="button"
                            className="login-link"
                            onClick={handleLogin}
                        >
                            Back to Login
                        </button>
                    </header>

                    <section className="message-card">
                        <div className="message-icon error">
                            !
                        </div>

                        <h1>
                            Invitation unavailable
                        </h1>

                        <p role="alert">
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleLogin}
                        >
                            Back to Login
                        </button>
                    </section>

                    <CareVRFooter />

                </div>

                <style jsx global>
                    {styles}
                </style>
            </main>
        );
    }

    if (!invitation) {
        return null;
    }

    if (registrationComplete) {
        return (
            <main className="invitee-page">
                <div className="page-shell">

                    <header className="mobile-header">
                        <button
                            type="button"
                            className="logo-button"
                            onClick={handleLogin}
                        >
                            <span className="care">
                                Care
                            </span>
                            <span className="vr">
                                VR
                            </span>
                        </button>


                    </header>

                    <section className="success-card">

                        <div className="success-icon">
                            ✓
                        </div>

                        <div className="success-eyebrow">
                            REGISTRATION COMPLETE
                        </div>

                        <h1>
                            Welcome to CareVR 🎉
                        </h1>

                        <p className="success-intro">
                            Your CareVR account has
                            been successfully created.
                        </p>

                        <div className="registered-role">

                            <span>
                                You are now registered
                                as
                            </span>

                            <strong>
                                {formatRole(
                                    invitation.role
                                )}
                            </strong>

                        </div>

                        <div className="responsibility-note">
                            <div className="note-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Please use your
                                    CareVR access
                                    responsibly.
                                </strong>

                                <p>
                                    Your access is based
                                    on the role assigned
                                    to you through your
                                    invitation.
                                </p>
                            </div>
                        </div>

                        <div className="next-step">

                            <span className="next-step-label">
                                NEXT STEP
                            </span>

                            <p>
                                Continue to Login.
                                CareVR will guide you
                                through your security,
                                consent and authorization
                                steps.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleLogin}
                        >
                            Continue to Login
                            <span className="button-arrow">
                                →
                            </span>
                        </button>

                    </section>

                    <CareVRFooter />

                </div>

                <style jsx global>
                    {styles}
                </style>
            </main>
        );
    }

    return (
        <main className="invitee-page">
            <div className="page-shell">

<header className="mobile-header">

    <div
        className="logo-button"
        aria-label="CareVR"
    >
        <Image
            src="/images/CareVR v1.0.png"
            alt="CareVR"
            width={160}
            height={48}
            className="carevr-header-logo"
            priority
        />
    </div>

</header>

                <section className="content">

                    <div className="welcome">

                        <div className="secure-badge">
                            <span>✓</span>
                            Secure Invitation
                        </div>

                        <h1>
                            Welcome to CareVR
                        </h1>

                        <p>
                            Your invitation has been
                            verified. Create your secure
                            account to get started.
                        </p>

                    </div>

                    <div className="registration-card">

                        <div className="card-header">

                            <div className="card-icon">
                                +
                            </div>

                            <div>
                                <h2>
                                    Create your account
                                </h2>

                                <p>
                                    Your CareVR role has
                                    already been assigned
                                    to you.
                                </p>
                            </div>

                        </div>

                        <div className="invitation-details">

                            <div className="detail-row">
                                <div>
                                    <span className="detail-label">
                                        Email
                                    </span>

                                    <strong>
                                        {invitation.email}
                                    </strong>
                                </div>

<div>
    <label
        htmlFor="fullName"
        className="detail-label"
    >
    Name*{" "}
    <span className="name-correction-note">
        (Please correct if incorrect)
    </span>
    </label>

    <input
        id="fullName"
        type="text"
        value={fullName}
        onChange={(event) =>
            setFullName(
                event.target.value
            )
        }
        disabled={submitting}
        className="form-input"
        placeholder="Enter your full name"
        autoComplete="name"
    />
</div>


                            </div>

                            <div className="detail-divider" />

                            <div className="detail-row">
                                <div>
                                    <span className="detail-label">
                                        Registered as
                                    </span>

                                    <span className="role-badge">
                                        {formatRole(
                                            invitation.role
                                        )}
                                    </span>
                                </div>
                            </div>

                        </div>

                        {error && (
                            <div
                                className="error-message"
                                role="alert"
                            >
                                <span className="error-circle">
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        <div className="form">

                            <label
                                htmlFor="password"
                                className="field-label"
                            >
                                Password
                            </label>

                            <div className="password-field">

                                <input
                                    id="password"
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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    className="form-input"
                                />

                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    disabled={submitting}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                                            <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.5 4 9.5 6-.4.8-1.2 2-2.5 3.2" />
                                            <path d="M6.2 6.2C4.6 7.4 3.5 8.8 2.5 10c1 2 4.3 6 9.5 6 1 0 1.9-.2 2.7-.5" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.5"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>

                            <p className="field-hint">
                                Minimum 8 characters.
                            </p>

                            <label
                                htmlFor="confirm-password"
                                className="field-label"
                            >
                                Confirm Password
                            </label>

                            <div className="password-field">

                                <input
                                    id="confirm-password"
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
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    className="form-input"
                                />

                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    disabled={submitting}
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                                            <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.5 4 9.5 6-.4.8-1.2 2-2.5 3.2" />
                                            <path d="M6.2 6.2C4.6 7.4 3.5 8.8 2.5 10c1 2 4.3 6 9.5 6 1 0 1.9-.2 2.7-.5" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.5"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>

                            <div className="captcha-section">

                                <div className="field-label">
                                    Security verification
                                </div>

                                <div className="captcha-box">
                                    <Turnstile
                                        siteKey={
                                            process.env
                                                .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
                                        }
                                        onSuccess={(value) =>
                                            setCaptchaToken(
                                                value
                                            )
                                        }
                                        onExpire={() =>
                                            setCaptchaToken(
                                                null
                                            )
                                        }
                                        onError={() =>
                                            setCaptchaToken(
                                                null
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            <button
                                type="button"
                                className="primary-button create-button"
                                onClick={() =>
                                    void handleCreateAccount()
                                }
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="button-spinner" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <span className="button-arrow">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </section>

                <CareVRFooter />

            </div>

            <style jsx global>
                {styles}
            </style>
        </main>
    );
}

const styles = `
    * {
        box-sizing: border-box;
    }

    html,
    body {
        margin: 0;
        padding: 0;
    }

    body {
        font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        color: #17213d;
    }

    button,
    input {
        font: inherit;
    }

.invitee-page {
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    overflow-x: hidden;
        background:
            radial-gradient(
                circle at 10% 10%,
                rgba(124, 82, 242, 0.20),
                transparent 30%
            ),
            radial-gradient(
                circle at 90% 20%,
                rgba(108, 67, 232, 0.14),
                transparent 30%
            ),
            linear-gradient(
                135deg,
                #f8f5ff 0%,
                #f1ebff 50%,
                #ece6ff 100%
            );
    }

    .page-shell {
        width: 100%;
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        padding: 16px 28px 14px;
    }

    .mobile-header {
        width: 100%;
        min-height: 62px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo-button {
        border: 0;
        background: transparent;
        padding: 0;
        cursor: pointer;
        letter-spacing: -1.5px;
        line-height: 1;
    }

    .carevr-header-logo {
        display: block;
        width: 160px;
        height: auto;
    }

.name-correction-note {
    color: #dc2626;
    font-weight: 700;
}

    .carevr-logo {
        margin-bottom: 28px;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -1.5px;
    }

    .care {
        color: #26314e;
    }

    .vr {
        color: #7043f5;
    }

    .logo-button .care,
    .logo-button .vr {
        font-size: 29px;
        font-weight: 800;
    }

    .login-link {
        min-height: 40px;
        padding: 0 14px;
        border: 1px solid #d8d0ef;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.78);
        color: #62429f;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition:
            background 160ms ease,
            border-color 160ms ease;
    }

    .login-link:hover {
        background: #ffffff;
        border-color: #bca9eb;
    }

    .content {
        width: min(610px, 100%);
        margin: 15px auto 26px;
        flex: 1;
    }

    .welcome {
        text-align: center;
        margin-bottom: 20px;
    }

    .secure-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 6px 11px;
        margin-bottom: 10px;
        border: 1px solid #ddd4fa;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.75);
        color: #6845bc;
        font-size: 11px;
        font-weight: 750;
    }

    .secure-badge span {
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #7043f5;
        color: white;
        font-size: 10px;
    }

    .welcome h1 {
        margin: 0;
        color: #17213d;
        font-size: 34px;
        line-height: 1.15;
        letter-spacing: -1px;
        font-weight: 800;
    }

    .welcome p {
        max-width: 480px;
        margin: 8px auto 0;
        color: #707990;
        font-size: 13.5px;
        line-height: 1.5;
    }

    .registration-card,
    .success-card,
    .message-card {
        border: 1px solid #ded8ed;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow:
            0 22px 55px rgba(61, 42, 119, 0.10),
            0 5px 16px rgba(61, 42, 119, 0.05);
    }

    .registration-card {
        padding: 25px;
    }

    .card-header {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 18px;
    }

    .card-icon {
        width: 40px;
        height: 40px;
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        background: #eee8ff;
        color: #7043f5;
        font-size: 24px;
    }

    .card-header h2 {
        margin: 0;
        color: #17213d;
        font-size: 20px;
        line-height: 1.25;
        font-weight: 780;
    }

    .card-header p {
        margin: 4px 0 0;
        color: #777f94;
        font-size: 12px;
        line-height: 1.45;
    }

    .invitation-details {
        padding: 14px 15px;
        margin-bottom: 18px;
        border: 1px solid #e4def1;
        border-radius: 12px;
        background: #faf9ff;
    }

    .detail-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .detail-row > div {
        width: 100%;
    }

    .detail-label {
        display: block;
        margin-bottom: 4px;
        color: #7b8297;
        font-size: 11px;
        font-weight: 650;
    }

    .detail-row strong {
        display: block;
        color: #25304d;
        font-size: 13px;
        font-weight: 750;
        overflow-wrap: anywhere;
    }

    .detail-divider {
        height: 1px;
        margin: 10px 0;
        background: #e8e3f1;
    }

    .role-badge {
        display: inline-flex;
        padding: 5px 9px;
        border-radius: 7px;
        background: #eee8ff;
        color: #6541bc;
        font-size: 11px;
        font-weight: 800;
    }

    .error-message {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 10px 12px;
        margin-bottom: 14px;
        border: 1px solid #ffd0d0;
        border-radius: 9px;
        background: #fff5f5;
        color: #b42318;
        font-size: 12.5px;
        line-height: 1.4;
    }

    .error-circle {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f04438;
        color: white;
        font-size: 10px;
        font-weight: 800;
    }

    .field-label {
        display: block;
        margin: 13px 0 7px;
        color: #29334e;
        font-size: 12.5px;
        font-weight: 700;
    }

    .password-field {
        position: relative;
    }

    .form-input {
        width: 100%;
        height: 48px;
        padding: 0 50px 0 13px;
        border: 1px solid #d8dbe5;
        border-radius: 10px;
        outline: none;
        background: #ffffff;
        color: #17213d;
        font-size: 14px;
        transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
    }


    .form-input:focus {
        border-color: #7043f5;
        box-shadow:
            0 0 0 3px
            rgba(112, 67, 245, 0.10);
        scroll-margin: 0;
    }

    .form-input:disabled {
        background: #f7f7fa;
        cursor: not-allowed;
    }

    .eye-button {
        position: absolute;
        top: 50%;
        right: 5px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-50%);
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #7d8498;
        cursor: pointer;
    }

    .eye-button:hover {
        background: #f3f0fc;
        color: #6240aa;
    }

    .field-hint {
        margin: 5px 0 0;
        color: #858ca0;
        font-size: 10.5px;
    }

    .captcha-section {
        margin-top: 18px;
    }

    .captcha-box {
        min-height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        border: 1px solid #e2dced;
        border-radius: 10px;
        background: #faf9ff;
        overflow: hidden;
    }

    .primary-button {
        width: 100%;
        min-height: 49px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        border: 0;
        border-radius: 11px;
        background:
            linear-gradient(
                135deg,
                #7747f6,
                #6331e5
            );
        color: #ffffff;
        font-size: 14px;
        font-weight: 760;
        cursor: pointer;
        box-shadow:
            0 9px 20px
            rgba(106, 62, 239, 0.20);
        transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            opacity 160ms ease;
    }

    .primary-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow:
            0 12px 24px
            rgba(106, 62, 239, 0.25);
    }

    .primary-button:disabled {
        opacity: 0.62;
        cursor: not-allowed;
    }

    .create-button {
        margin-top: 21px;
    }

    .button-arrow {
        font-size: 19px;
        line-height: 1;
    }

    .button-spinner {
        width: 17px;
        height: 17px;
        border: 2px solid rgba(255,255,255,0.42);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 700ms linear infinite;
    }

    .security-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin-top: 17px;
        padding-top: 14px;
        border-top: 1px solid #ebe7f2;
        color: #7b8398;
        font-size: 10.5px;
        line-height: 1.4;
        text-align: center;
    }

    .lock {
        display: inline-flex;
        color: #7043f5;
    }

    .success-card,
    .message-card {
        width: min(550px, 100%);
        margin: auto;
        padding: 34px 30px;
        text-align: center;
    }

    .success-icon,
    .message-icon {
        width: 62px;
        height: 62px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 28px;
        font-weight: 800;
    }

    .success-icon {
        background: #eee9ff;
        color: #7043f5;
    }

    .message-icon.error {
        background: #fff0f0;
        color: #c52b22;
    }

    .success-eyebrow {
        color: #7043f5;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.2px;
    }

    .success-card h1 {
        margin: 7px 0 8px;
        color: #17213d;
        font-size: 29px;
        letter-spacing: -0.7px;
    }

    .success-intro {
        margin: 0;
        color: #707990;
        font-size: 14px;
        line-height: 1.5;
    }

    .registered-role {
        margin: 21px 0 14px;
        padding: 16px;
        border: 1px solid #e1daf2;
        border-radius: 12px;
        background: #faf9ff;
    }

    .registered-role span {
        display: block;
        margin-bottom: 7px;
        color: #777f94;
        font-size: 12px;
    }

    .registered-role strong {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 8px;
        background: #eee8ff;
        color: #6340b7;
        font-size: 15px;
    }

    .responsibility-note {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 14px;
        border: 1px solid #e4def1;
        border-radius: 11px;
        background: #f8f6ff;
        text-align: left;
    }

    .note-icon {
        width: 22px;
        height: 22px;
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #7043f5;
        color: white;
        font-size: 11px;
        font-weight: 800;
    }

    .responsibility-note strong {
        color: #303a55;
        font-size: 12.5px;
    }

    .responsibility-note p {
        margin: 3px 0 0;
        color: #747c91;
        font-size: 11.5px;
        line-height: 1.45;
    }

    .next-step {
        margin: 18px 0;
        text-align: left;
    }

    .next-step-label {
        color: #7043f5;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1px;
    }

    .next-step p {
        margin: 4px 0 0;
        color: #687189;
        font-size: 12px;
        line-height: 1.5;
    }

    .message-card h1 {
        margin: 0 0 8px;
        color: #17213d;
        font-size: 24px;
    }

    .message-card p {
        margin: 0 auto 22px;
        color: #687189;
        font-size: 13px;
        line-height: 1.5;
    }

    .loading-screen {
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .loading-card {
        width: min(420px, 100%);
        padding: 38px 28px;
        border: 1px solid #ded8ed;
        border-radius: 20px;
        background: rgba(255,255,255,0.96);
        box-shadow:
            0 20px 50px
            rgba(63,44,120,0.10);
        text-align: center;
    }

    .loading-card h1 {
        margin: 0 0 8px;
        color: #17213d;
        font-size: 20px;
    }

    .loading-card p {
        margin: 0;
        color: #737b91;
        font-size: 13px;
        line-height: 1.5;
    }

    .loading-spinner {
        width: 34px;
        height: 34px;
        margin: 0 auto 20px;
        border: 3px solid #ddd4fa;
        border-top-color: #7043f5;
        border-radius: 50%;
        animation: spin 700ms linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 600px) {
        .page-shell {
            padding:
                10px
                14px
                12px;
            min-height: 100dvh;
            box-sizing: border-box;
        }

        .carevr-header-logo {
            width: 130px;
            height: auto;
        }

        .mobile-header {
            min-height: 54px;
        }

        .logo-button .care,
        .logo-button .vr {
            font-size: 26px;
        }

        .login-link {
            min-height: 38px;
            padding: 0 11px;
            font-size: 12px;
        }

        .content {
            margin-top: 12px;
            margin-bottom: 18px;
        }

        .welcome {
            margin-bottom: 15px;
        }

        .welcome h1 {
            font-size: 28px;
        }

        .welcome p {
            font-size: 12.5px;
        }

        .registration-card {
            padding: 18px;
            border-radius: 16px;
        }

        .card-header h2 {
            font-size: 18px;
        }

        .success-card,
        .message-card {
            padding: 28px 19px;
        }

        .success-card h1 {
            font-size: 26px;
        }

        .captcha-box {
            overflow-x: auto;
        }

        .invitee-page :global(.carevr-footer) {
            margin-top: 12px !important;
        }
    }

    @media (max-width: 380px) {
        .login-link {
            padding: 0 9px;
        }

        .registration-card {
            padding: 15px;
        }

        .welcome h1 {
            font-size: 26px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            transition: none !important;
        }
    }
`;

export default function InviteeRegistrationPage() {
    return (
        <Suspense
            fallback={
                <main className="invitee-page">
                    <div className="loading-screen">
                        <div className="loading-card">
                            <div className="carevr-logo">
                                <span className="care">
                                    Care
                                </span>
                                <span className="vr">
                                    VR
                                </span>
                            </div>

                            <div className="loading-spinner" />

                            <h1>
                                Loading invitation
                            </h1>

                            <p>
                                Please wait...
                            </p>
                        </div>
                    </div>

                    <style jsx global>
                        {styles}
                    </style>
                </main>
            }
        >
            <InviteeRegistrationContent />
        </Suspense>
    );
}
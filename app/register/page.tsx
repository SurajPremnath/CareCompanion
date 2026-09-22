"use client";

import React, {
    useRef,
    useState
} from "react";

import {
    Turnstile,
    type TurnstileInstance
} from "@marsidev/react-turnstile";
import {
    useRouter,
    useSearchParams,
} from "next/navigation"

import CareVRFooter from "@/Components/common/CareVRFooter";
import { authService } from "@/lib/auth/authService";
import { inviteeToPrimaryHandoff } from "@/lib/authorization/inviteeToPrimaryHandoff";
import { provisionPrimaryAccess } from "@/lib/authorization/provisionPrimaryAccess";

import { carevrMessages } from "@/lib/messages/carevrMessages";

import { authSecurity } from "@/lib/auth/authSecurity";

function RegisterPageContent() {

const router = useRouter();
const searchParams = useSearchParams();

const productInvitationToken =
    searchParams.get(
        "productInvitationToken"
    );

const inviteePrimaryHandoff = inviteeToPrimaryHandoff.get();
const isInviteeToPrimary = inviteePrimaryHandoff !== null;

    /*
     * Primary Family Member declaration is the first registration-flow gate.
     *
     * null  = user has not answered yet
     * true  = user declared they are the Primary Family Member
     * false = user selected that they are not the Primary Family Member
     *
     * This is a UI flow decision only at this stage. It does not establish
     * authoritative Primary status in the database or authorization layer.
     */
    const [isPrimaryFamilyMember, setIsPrimaryFamilyMember] =
        useState<boolean | null>(null);

const [inviteePrimaryConfirmed, setInviteePrimaryConfirmed] =
    useState(false);

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

const turnstileRef =
    useRef<TurnstileInstance>(null);

const [registrationCompleted, setRegistrationCompleted] =
    useState(false);


const [registrationResumeRequired, setRegistrationResumeRequired] =
    useState(false);

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

    const verifiedCaptchaToken =
        authSecurity.requireCaptchaToken(captchaToken);

    try {

        setLoading(true);

        setError("");

        setSuccess("");

        /*
         * A CareVR account may only be created when the
         * registration email has a valid, unexpired
         * PENDING CareVR product invitation.
         */
        const invitationResponse =
            await fetch(
                "/api/access-management/access-to-carevr/validation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

        const invitationResult =
            await invitationResponse.json();

        if (!invitationResponse.ok) {
            throw new Error(
                invitationResult.message ??
                "Unable to validate the CareVR invitation."
            );
        }

        if (
            invitationResult.status !==
            "PENDING"
        ) {
            throw new Error(
                "A valid CareVR invitation is required to register."
            );
        }

        /*
         * Existing registration service remains unchanged.
         * No Primary/family/database logic is added in this UI step.
         */
if (registrationResumeRequired) {

    await authService.resumeRegistration(
        email.trim(),
        password,
        verifiedCaptchaToken
    );

} else {

    try {

        const result =
            await authService.register(
                fullName.trim(),
                email.trim(),
                password,
                "PRIMARY",
                verifiedCaptchaToken
            );

        if (!result.session) {
            throw new Error(
                "Account created, but an authenticated session was not established. Please try again."
            );
        }

    } catch (registrationError) {

        const registrationMessage =
            registrationError instanceof Error
                ? registrationError.message
                : "";

        if (
            registrationMessage !==
            "User already registered"
        ) {
            throw registrationError;
        }

        /*
         * The Auth identity already exists, but the
         * CareVR invitation is still PENDING.
         *
         * The CAPTCHA token used for the first request
         * has already been consumed. Reset Turnstile so
         * the next attempt receives a fresh token.
         */
        setRegistrationResumeRequired(true);
        setCaptchaToken(null);
        turnstileRef.current?.reset();

        setError(
            "Your CareVR registration was started earlier. Please complete the security verification again to continue."
        );

        return;
    }
}

/*
 * Account creation or registration resumption
 * is complete.
 *
 * Move the user to the dedicated CareVR
 * Passkey security page.
 *
 * Passkey creation itself is intentionally
 * not performed in this step.
 */
const secureAccessUrl =
    productInvitationToken
        ? `/secure-access/create-pin?productInvitationToken=${encodeURIComponent(productInvitationToken)}`
        : "/secure-access/create-pin";

router.replace(secureAccessUrl);

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


    /*
     * The initials shown in the public registration header are derived only
     * from the name entered by the user. Until a name is entered, a neutral
     * placeholder is shown rather than implying an authenticated identity.
     */
    const getInitials = (name: string): string => {

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length === 0) {
            return "?";
        }

        if (parts.length === 1) {
            return parts[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    };

    return (

        <main className="register-page">

            <div className="register-shell">

                {/* ============================
                    CAREVR PUBLIC HEADER
                ============================ */}

                <header className="register-header">

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
                            aria-label="Go to Home"
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
                                <path d="M3 10.5L12 3l9 7.5" />
                                <path d="M5.5 9.5V20h13V9.5" />
                                <path d="M9.5 20v-6h5v6" />
                            </svg>

                            <span>Home</span>
                        </button>

                        <button
                            type="button"
                            className="initials-button"
                            aria-label="Account"
                            title="Account"
                        >
                            {getInitials(fullName)}
                        </button>

                    </div>

                </header>

                {/* ============================
                    REGISTRATION CONTENT
                ============================ */}

                <section className="register-content">

                    <div className="welcome-block">

                        <h1>
                            Welcome to CareVR
                        </h1>

                    </div>

                    <div className="primary-definition">

                        <div className="important-label">
                            Important
                        </div>

                        <p>
                            Primary Family Member is the person who
                            establishes a CareVR family and assumes
                            primary responsibility for managing that
                            family's CareVR access.
                        </p>

                    </div>

                    <div className="primary-question">

                        <div className="question-row">

                            <h2>
                                Are you the Primary Family Member?
                            </h2>


                        </div>


                        <div className="primary-options">

<button
    type="button"
    className={`primary-option ${
        isPrimaryFamilyMember === true
            ? "primary-option-selected"
            : ""
    }`}
    onClick={() => {
        setIsPrimaryFamilyMember(true);

        if (isInviteeToPrimary) {
            setInviteePrimaryConfirmed(false);
        }
    }}
    disabled={
    registrationCompleted ||
    inviteePrimaryConfirmed
}
>
    <span className="radio-circle">
        {isPrimaryFamilyMember === true && (
            <span className="radio-dot" />
        )}
    </span>

    <span>
        Yes
    </span>
</button>

<button
    type="button"
    className={`primary-option ${
        isPrimaryFamilyMember === false
            ? "primary-option-selected"
            : ""
    }`}
    onClick={() => {
        setIsPrimaryFamilyMember(false);

        if (isInviteeToPrimary) {
            inviteeToPrimaryHandoff.clear();
        }

        router.replace("/login");
    }}
    disabled={
    registrationCompleted ||
    inviteePrimaryConfirmed
}
>
                                <span className="radio-circle">
                                    {isPrimaryFamilyMember === false && (
                                        <span className="radio-dot" />
                                    )}
                                </span>

                                <span>
                                    No
                                </span>

                            </button>

                        </div>

                    </div>

                    {/* ============================
                        EXISTING REGISTRATION FORM
                        ============================ */}

{isPrimaryFamilyMember === true &&
    !isInviteeToPrimary &&
    !inviteePrimaryConfirmed && (

    <div className="registration-panel">

{!registrationCompleted ? (

        <>
            <div className="registration-panel-heading">

                <h2>
                    Create Your Account
                </h2>

                <p>
                    Register once to securely manage
                    your family's health records.
                </p>

            </div>

            {error && (

                <div
                    className="error-message"
                    role="alert"
                >
                    {error}
                </div>

            )}

            <label
                className="field-label"
                htmlFor="fullName"
            >
                Full Name
            </label>

            <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) =>
                    setFullName(e.target.value)
                }
                placeholder="Enter your full name"
                className="form-input"
                disabled={loading}
                autoComplete="name"
            />

            <label
                className="field-label"
                htmlFor="email"
            >
                Email Address
            </label>

            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="form-input"
                disabled={loading}
                autoComplete="email"
            />

            <label
                className="field-label"
                htmlFor="password"
            >
                Password
            </label>

            <div className="password-wrap">

                <input
                    id="password"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    placeholder="Create a password"
                    className="form-input password-input"
                    disabled={loading}
                    autoComplete="new-password"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(
                            !showPassword
                        )
                    }
                    className="password-toggle"
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showPassword ? "🙈" : "👁"}
                </button>

            </div>

            <label
                className="field-label"
                htmlFor="confirmPassword"
            >
                Confirm Password
            </label>

            <div className="password-wrap">

                <input
                    id="confirmPassword"
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                    placeholder="Re-enter your password"
                    className="form-input password-input"
                    disabled={loading}
                    autoComplete="new-password"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowConfirmPassword(
                            !showConfirmPassword
                        )
                    }
                    className="password-toggle"
                    aria-label={
                        showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showConfirmPassword ? "🙈" : "👁"}
                </button>

            </div>

            <div className="captcha-container">
<Turnstile
    ref={turnstileRef}
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
    onSuccess={(token) => setCaptchaToken(token)}
    onExpire={() => setCaptchaToken(null)}
    onError={() => setCaptchaToken(null)}
/>
            </div>

            <button
                type="button"
                onClick={() =>
                    void handleRegister()
                }
                disabled={loading}
                className="create-account-button"
            >
                {loading
                    ? "Creating Account..."
                    : "Create Account"}
            </button>

            <button
                type="button"
                onClick={() =>
                    router.replace("/login")
                }
                disabled={loading}
                className="login-link-button"
            >
                Already have an account? Login
            </button>

        </>


) : (

    <div
        className="registration-success-panel"
        role="status"
    >

        <div className="registration-success-icon">
            💙
        </div>

        <h2>
            {carevrMessages.registration.primaryCompleted.title}
        </h2>

        <p>
            {carevrMessages.registration.primaryCompleted.message}
        </p>

        <p>
            {carevrMessages.registration.primaryCompleted.footer}
        </p>

        <button
            type="button"
            className="create-account-button"
            onClick={() =>
                router.replace("/login")
            }
        >
            Continue to Login
        </button>

    </div>

)}

    </div>

)}

{isPrimaryFamilyMember === true &&
    (isInviteeToPrimary || inviteePrimaryConfirmed) && (
    <div className="registration-panel">
        <div className="registration-panel-heading">
            <h2>
                Confirm Primary Registration
            </h2>

            <p>
                Please confirm for registration of Primary role.
            </p>
        </div>

        {error && (
            <div
                className="error-message"
                role="alert"
            >
                {error}
            </div>
        )}

        <div className="invitee-primary-confirmation">
            {!inviteePrimaryConfirmed ? (
                <>
                    <p>
                        You are about to take on additional responsibility as a{" "}
Primary Family Member.
                    </p>

                    <div className="confirmation-actions">
                        <button
                            type="button"
                            className="create-account-button"
                            onClick={async () => {
                                if (!inviteePrimaryHandoff) {
                                    setError(
                                        "Primary registration handoff is no longer available."
                                    );
                                    return;
                                }

                                try {
                                    setLoading(true);
                                    setError("");
                                    setSuccess("");

                                    const user =
                                        await authService.getCurrentUser();

                                    if (!user) {
                                        throw new Error(
                                            "Authenticated user could not be found."
                                        );
                                    }

                                    if (
                                        user.id !==
                                        inviteePrimaryHandoff.userId
                                    ) {
                                        throw new Error(
                                            "Primary registration handoff does not belong to the current user."
                                        );
                                    }

                                    /*
                                     * The user already has a Supabase Auth account.
                                     * This provisions an additional PRIMARY CareVR
                                     * access context for the existing user.
                                     * It does not create another Auth account.
                                     */
                                    await provisionPrimaryAccess(user.id);

                                    /*
                                     * The additional PRIMARY profile has been
                                     * created successfully.
                                     */
                                    setSuccess(
                                        "Your Additional profile of Primary has been created successfully. Please be responsible and accountable in adhering to CareVR’s Terms of Use, privacy requirements, and the responsibilities associated with the Primary Family Member role."
                                    );

                                    /*
                                     * Keep the confirmation panel visible so the
                                     * success message can be displayed even after
                                     * the handoff is consumed.
                                     */
setInviteePrimaryConfirmed(true);

/*
 * The handoff has now been consumed successfully.
 */
inviteeToPrimaryHandoff.clear();

                                } catch (err) {
                                    const message =
                                        err instanceof Error
                                            ? err.message
                                            : "Unable to register Primary Family Member access.";

                                    setError(message);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                        >
                            {loading
                                ? "Confirming..."
                                : "Confirm"}
                        </button>

                        <button
                            type="button"
                            className="login-link-button"
                            onClick={() => {
                                setIsPrimaryFamilyMember(null);
                                setInviteePrimaryConfirmed(false);
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="success-message"
                    role="status"
                >
                    <p>
                        {success}
                    </p>

                    <button
                        type="button"
                        className="login-link-button"
onClick={async () => {
    await authService.logout();
    router.replace("/login");
}}
                    >
                        Click Back to Login
                    </button>
                </div>
            )}
        </div>
    </div>
)}

                </section>

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

                button,
                input {
                    font: inherit;
                }

                .register-page {
                    min-height: 100vh;
                    min-height: 100dvh;
                    padding: 0;
                    background:
                        linear-gradient(
                            135deg,
                            #f7f3ff 0%,
                            #f1eaff 50%,
                            #eee8ff 100%
                        );
                }

                .register-shell {
                    width: 100%;
                    min-height: 100vh;
                    min-height: 100dvh;
                    display: flex;
                    flex-direction: column;
                    padding: 20px 28px 18px;
                }

                /* ============================
                   HEADER
                ============================ */

                .register-header {
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
                    border: 1px solid #d8d0ef;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.72);
                    color: #4b3b79;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition:
                        background 160ms ease,
                        border-color 160ms ease;
                }

                .home-button:hover {
                    background: #ffffff;
                    border-color: #b9a7e8;
                }

                /*
                 * Public registration has no authenticated account yet.
                 * The avatar therefore reflects the name being entered rather
                 * than implying that an authenticated CareVR session exists.
                 */
                .initials-button {
                    width: 42px;
                    height: 42px;
                    border: 0;
                    border-radius: 50%;
                    background:
                        linear-gradient(
                            135deg,
                            #7545f5,
                            #6432e8
                        );
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 800;
                    cursor: default;
                    box-shadow:
                        0 5px 14px
                        rgba(106, 62, 239, 0.18);
                }

                /* ============================
                   MAIN CONTENT
                ============================ */

                .register-content {
                    width: min(620px, 100%);
                    margin: 30px auto 0;
                    flex: 1 1 auto;
                }

                .welcome-block {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .welcome-block h1 {
                    margin: 0;
                    color: #15203d;
                    font-size: 38px;
                    line-height: 1.12;
                    letter-spacing: -1px;
                    font-weight: 750;
                }

                .primary-definition {
                    padding: 16px 18px;
                    border: 1px solid #ded6f3;
                    border-radius: 15px;
                    background: rgba(255, 255, 255, 0.72);
                    box-shadow:
                        0 8px 24px
                        rgba(63, 44, 120, 0.05);
                }

                .important-label {
                    margin-bottom: 5px;
                    color: #5e42a0;
                    font-size: 13px;
                    line-height: 1.3;
                    font-weight: 800;
                }

                .primary-definition p {
                    margin: 0;
                    color: #59627a;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .primary-question {
                    margin-top: 20px;
                    padding: 18px;
                    border-radius: 15px;
                    background: rgba(255, 255, 255, 0.88);
                    border: 1px solid #ded8ed;
                    box-shadow:
                        0 10px 28px
                        rgba(63, 44, 120, 0.06);
                }

                .question-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .question-row h2 {
                    margin: 0;
                    color: #25304d;
                    font-size: 17px;
                    line-height: 1.35;
                    font-weight: 750;
                }

                .info-button {
                    flex: 0 0 auto;
                    width: 30px;
                    height: 30px;
                    border: 0;
                    border-radius: 50%;
                    background: #f0eaff;
                    color: #7043f5;
                    font-size: 18px;
                    cursor: pointer;
                }

                .primary-info {
                    margin-top: 12px;
                    padding: 13px 14px;
                    border-radius: 11px;
                    background: #f8f6ff;
                    border: 1px solid #e1daf5;
                    color: #59627a;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .primary-info strong {
                    color: #403363;
                }

                .primary-info p {
                    margin: 5px 0 0;
                }

                .primary-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-top: 16px;
                }

                .primary-option {
                    min-height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    border: 1px solid #d9dce6;
                    border-radius: 12px;
                    background: #ffffff;
                    color: #25304d;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    transition:
                        border-color 160ms ease,
                        background 160ms ease,
                        box-shadow 160ms ease;
                }

                .primary-option:hover {
                    border-color: #b9a7e8;
                    background: #faf8ff;
                }

                .primary-option-selected {
                    border: 2px solid #7043f5;
                    background: #f7f3ff;
                    box-shadow:
                        0 0 0 2px
                        rgba(112, 67, 245, 0.08);
                }

                .radio-circle {
                    width: 18px;
                    height: 18px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #8991a5;
                    border-radius: 50%;
                }

                .primary-option-selected .radio-circle {
                    border-color: #7043f5;
                }

                .radio-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #7043f5;
                }

                /* ============================
                   REGISTRATION PANEL
                ============================ */

                .registration-panel {
                    margin-top: 20px;
                    padding: 22px;
                    border: 1px solid #ded8ed;
                    border-radius: 15px;
                    background: rgba(255, 255, 255, 0.94);
                    box-shadow:
                        0 12px 30px
                        rgba(63, 44, 120, 0.07);
                }

                .registration-panel-heading {
                    margin-bottom: 18px;
                }

                .registration-panel-heading h2 {
                    margin: 0;
                    color: #15203d;
                    font-size: 22px;
                    line-height: 1.2;
                    font-weight: 750;
                }

                .registration-panel-heading p {
                    margin: 6px 0 0;
                    color: #737b91;
                    font-size: 13px;
                    line-height: 1.45;
                }

                .field-label {
                    display: block;
                    margin: 14px 0 7px;
                    color: #25304d;
                    font-size: 13px;
                    font-weight: 700;
                }

                .form-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 14px;
                    border: 1px solid #d9dce6;
                    border-radius: 11px;
                    outline: none;
                    background: #ffffff;
                    color: #15203d;
                    font-size: 15px;
                }

                .form-input:focus {
                    border-color: #7043f5;
                    box-shadow:
                        0 0 0 3px
                        rgba(112, 67, 245, 0.09);
                }

                .password-wrap {
                    position: relative;
                }

                .password-input {
                    padding-right: 48px;
                }

                .password-toggle {
                    position: absolute;
                    right: 5px;
                    top: 50%;
                    width: 36px;
                    height: 36px;
                    display: grid;
                    place-items: center;
                    transform: translateY(-50%);
                    border: 0;
                    border-radius: 9px;
                    background: transparent;
                    color: #7f879d;
                    cursor: pointer;
                }

.captcha-container {
    margin-top: 18px;
    display: flex;
    justify-content: center;
    width: 100%;
}

                .create-account-button {
                    width: 100%;
                    height: 48px;
                    margin-top: 22px;
                    border: 0;
                    border-radius: 12px;
                    background:
                        linear-gradient(
                            135deg,
                            #7545f5,
                            #6432e8
                        );
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 750;
                    cursor: pointer;
                    box-shadow:
                        0 8px 18px
                        rgba(106, 62, 239, 0.18);
                }

                .create-account-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .login-link-button {
                    width: 100%;
                    margin-top: 10px;
                    padding: 8px;
                    border: 0;
                    background: transparent;
                    color: #7043f5;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .error-message,
                .success-message {
                    padding: 11px 13px;
                    border-radius: 10px;
                    margin-bottom: 12px;
                    font-size: 13px;
                    line-height: 1.4;
                }


                .registration-success-panel {
                    text-align: center;
                    padding: 18px 8px 8px;
                }

                .registration-success-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #f0fff5;
                    border: 1px solid #c7efd5;
                    font-size: 30px;
                }

                .registration-success-panel h2 {
                    margin: 0 0 14px;
                    color: #15203d;
                    font-size: 25px;
                    line-height: 1.25;
                    font-weight: 750;
                }

                .registration-success-panel p {
                    margin: 0 auto 12px;
                    max-width: 500px;
                    color: #59627a;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .registration-success-panel .create-account-button {
                    margin-top: 18px;
                }

                .error-message {
                    border: 1px solid #ffd0d0;
                    background: #fff5f5;
                    color: #b42318;
                }

                .success-message {
                    border: 1px solid #c7efd5;
                    background: #f0fff5;
                    color: #176b37;
                }

                /* ============================
                   MOBILE
                ============================ */

                @media (max-width: 600px) {

                    .register-shell {
                        min-height: 100dvh;
                        padding:
                            10px
                            14px
                            12px;
                    }

                    .register-header {
                        min-height: 58px;
                    }

                    .carevr-logo {
                        width: 145px;
                        height: 55px;
                    }

                    .header-actions {
                        gap: 7px;
                    }

                    .home-button {
                        width: 42px;
                        height: 42px;
                        padding: 0;
                    }

                    .home-button span {
                        display: none;
                    }

                    .initials-button {
                        width: 42px;
                        height: 42px;
                    }

                    .register-content {
                        margin-top: 18px;
                    }

                    .welcome-block {
                        margin-bottom: 17px;
                    }

                    .welcome-block h1 {
                        font-size: 29px;
                        letter-spacing: -0.6px;
                    }

                    .primary-definition {
                        padding: 13px 14px;
                        border-radius: 13px;
                    }

                    .important-label {
                        font-size: 12px;
                    }

                    .primary-definition p {
                        font-size: 12.5px;
                        line-height: 1.45;
                    }

                    .primary-question {
                        margin-top: 14px;
                        padding: 14px;
                        border-radius: 13px;
                    }

                    .question-row h2 {
                        font-size: 15px;
                    }

                    .primary-options {
                        gap: 8px;
                        margin-top: 13px;
                    }

                    .primary-option {
                        min-height: 46px;
                        font-size: 14px;
                    }

                    .registration-panel {
                        margin-top: 14px;
                        padding: 16px;
                        border-radius: 13px;
                    }

                    .registration-panel-heading h2 {
                        font-size: 20px;
                    }

                    .registration-panel-heading p {
                        font-size: 12px;
                    }

                    .field-label {
                        font-size: 12px;
                    }

                    .form-input {
                        height: 45px;
                        font-size: 16px;
                    }

                    .create-account-button {
                        height: 46px;
                    }

                    .carevr-footer {
                        margin-top: 14px !important;
                        padding-top: 12px !important;
                    }

                    .carevr-footer-title {
                        font-size: 11px !important;
                    }

                    .carevr-footer-text {
                        font-size: 10px !important;
                    }

                }

                @media (max-width: 380px) {

                    .register-shell {
                        padding-left: 10px;
                        padding-right: 10px;
                    }

                    .carevr-logo {
                        width: 130px;
                        height: auto;
                    }

                    .welcome-block h1 {
                        font-size: 26px;
                    }

                    .primary-definition p {
                        font-size: 12px;
                    }

                    .question-row h2 {
                        font-size: 14px;
                    }

                }

                @media (prefers-reduced-motion: reduce) {

                    *,
                    *::before,
                    *::after {
                        transition: none !important;
                    }

                }

            `}</style>

        </main>

    );
}

export default function RegisterPage() {

    return (
        <React.Suspense fallback={null}>
            <RegisterPageContent />
        </React.Suspense>
    );
}
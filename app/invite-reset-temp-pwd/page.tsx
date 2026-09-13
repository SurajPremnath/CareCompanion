"use client";

import {
    FormEvent,
    Suspense,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import MobileHeader from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";

import { Turnstile } from "@marsidev/react-turnstile";

import { authService } from "@/lib/auth/authService";

import { authSecurity } from "@/lib/auth/authSecurity";

import { acceptInvitation } from "./acceptInvitation";

export interface InviteResetTempPwdProps {
    roleName?: string;
    familyName?: string;
    userName?: string;
}

function InviteResetTempPwdContent({
    roleName = "Caretaker",
    familyName = "My Family",
    userName = "User",
}: InviteResetTempPwdProps) {
    const router =
        useRouter();

    const searchParams =
        useSearchParams();

    const invitationId =
        searchParams.get(
            "invitationId"
        );

    const [
        oldPassword,
        setOldPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        showOldPassword,
        setShowOldPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        accountMenuOpen,
        setAccountMenuOpen,
    ] = useState(false);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

const [
    captchaToken,
    setCaptchaToken,
] = useState<string | null>(null);

    const passwordRequirements = [
        {
            label: "At least 8 characters",
            valid: newPassword.length >= 8,
        },
        {
            label: "At least one uppercase letter",
            valid: /[A-Z]/.test(newPassword),
        },
        {
            label: "At least one lowercase letter",
            valid: /[a-z]/.test(newPassword),
        },
        {
            label: "At least one number",
            valid: /\d/.test(newPassword),
        },
        {
            label: "At least one special character",
            valid: /[^A-Za-z0-9]/.test(newPassword),
        },
    ];

    const passwordsMatch =
        confirmPassword.length > 0 &&
        newPassword === confirmPassword;

    const canSubmit =
        !submitting &&
        oldPassword.length > 0 &&
        passwordRequirements.every(
            (requirement) =>
                requirement.valid
        ) &&
        passwordsMatch;

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        setErrorMessage("");

        if (!invitationId) {
            setErrorMessage(
                "Invitation information is missing. Please return to the login page and try again."
            );

            return;
        }

setSubmitting(true);

try {
    const verifiedCaptchaToken =
        authSecurity.requireCaptchaToken(
            captchaToken
        );

    const currentUser =
        await authService.getCurrentUser();

            if (!currentUser) {
                throw new Error(
                    "Your login session has expired. Please sign in again."
                );
            }

            const email =
                currentUser.email?.trim();

            if (!email) {
                throw new Error(
                    "Your account email could not be determined."
                );
            }

            /*
             * Verify the temporary password supplied
             * in the Old Password field.
             */
await authService.login(
    email,
    oldPassword,
    verifiedCaptchaToken
);

            /*
             * Replace the temporary password with
             * the permanent password.
             */
            await authService.updatePassword(
                newPassword
            );

            /*
             * Complete the invitation lifecycle.
             * This accepts the invitation but does not
             * provision CareVR authorization.
             */
            await acceptInvitation(
                invitationId
            );

            /*
             * Password change and invitation acceptance
             * completed successfully.
             *
             * Keep the user on this page so the
             * confirmation message and Back to Login
             * action can be displayed.
             */
            setErrorMessage("");

            setSuccessMessage(
                "Your password has been changed successfully."
            );

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error(
                "Unable to complete invited-user password change.",
                error
            );

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to change your password. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="invite-reset-page">
            <MobileHeader
                careMode="FAMILY"
                onCareModeChange={() => {}}
                userName={userName}
                showHomeButton={true}
                onHomeClick={() =>
                    router.replace(
                        "/dashboard"
                    )
                }
                accountMenuOpen={accountMenuOpen}
                onAccountMenuToggle={() =>
                    setAccountMenuOpen(
                        (current) =>
                            !current
                    )
                }
                consentGranted={false}
                onAddPatient={() => {}}
                onCareVRJourney={() => {}}
                onHelp={() => {}}
                onLogout={() => {}}
            />

            <main className="invite-reset-main">
                <section
                    className="invite-reset-card"
                    aria-labelledby="invite-reset-title"
                >
                    <div className="invite-reset-icon">
                        <span aria-hidden="true">
                            🔐
                        </span>
                    </div>

                    <div className="invite-reset-heading">
                        <h1 id="invite-reset-title">
                            Set Your Password
                        </h1>

                        <p>
                            Your temporary password must be
                            changed before you can continue
                            with CareVR.
                        </p>
                    </div>

                    <div className="invite-context">
                        <div className="invite-context-item">
                            <span className="invite-context-label">
                                Role
                            </span>

                            <span className="invite-context-value">
                                {roleName}
                            </span>
                        </div>

                        <div className="invite-context-item">
                            <span className="invite-context-label">
                                Family Name
                            </span>

                            <span className="invite-context-value">
                                {familyName}
                            </span>
                        </div>
                    </div>

                    <form
                        className="invite-reset-form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="invite-reset-field">
                            <label htmlFor="old-password">
                                Old Password
                                <span>
                                    {" "}
                                    (Temporary Password)
                                </span>
                            </label>

                            <div className="invite-password-input">
                                <input
                                    id="old-password"
                                    type={
                                        showOldPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={oldPassword}
                                    onChange={(event) =>
                                        setOldPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your temporary password"
                                    autoComplete="current-password"
                                    disabled={
                                        submitting
                                    }
                                />

                                <button
                                    type="button"
                                    className="invite-password-toggle"
                                    aria-label={
                                        showOldPassword
                                            ? "Hide old password"
                                            : "Show old password"
                                    }
                                    onClick={() =>
                                        setShowOldPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    {showOldPassword
                                        ? "◉"
                                        : "◌"}
                                </button>
                            </div>
                        </div>

                        <div className="invite-reset-field">
                            <label htmlFor="new-password">
                                New Password
                            </label>

                            <div className="invite-password-input">
                                <input
                                    id="new-password"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                    disabled={
                                        submitting
                                    }
                                />

                                <button
                                    type="button"
                                    className="invite-password-toggle"
                                    aria-label={
                                        showNewPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                    onClick={() =>
                                        setShowNewPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    {showNewPassword
                                        ? "◉"
                                        : "◌"}
                                </button>
                            </div>
                        </div>

                        <div className="invite-reset-field">
                            <label htmlFor="confirm-password">
                                Confirm New Password
                            </label>

                            <div className="invite-password-input">
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
                                    placeholder="Confirm your new password"
                                    autoComplete="new-password"
                                    disabled={
                                        submitting
                                    }
                                />

                                <button
                                    type="button"
                                    className="invite-password-toggle"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirmed password"
                                            : "Show confirmed password"
                                    }
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    {showConfirmPassword
                                        ? "◉"
                                        : "◌"}
                                </button>
                            </div>

                            {confirmPassword.length > 0 &&
                                !passwordsMatch && (
                                    <p className="invite-field-error">
                                        Passwords do not match.
                                    </p>
                                )}
                        </div>

                        <div className="invite-password-requirements">
                            <div className="invite-requirements-title">
                                <span aria-hidden="true">
                                    ℹ
                                </span>

                                <span>
                                    Password Requirements
                                </span>
                            </div>

                            <ul>
                                {passwordRequirements.map(
                                    (requirement) => (
                                        <li
                                            key={
                                                requirement.label
                                            }
                                            className={
                                                requirement.valid
                                                    ? "valid"
                                                    : ""
                                            }
                                        >
                                            <span aria-hidden="true">
                                                {requirement.valid
                                                    ? "✓"
                                                    : "•"}
                                            </span>

                                            <span>
                                                {
                                                    requirement.label
                                                }
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Turnstile
                                siteKey={
                                    process.env
                                        .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
                                }
                                onSuccess={(token) =>
                                    setCaptchaToken(token)
                                }
                                onExpire={() =>
                                    setCaptchaToken(null)
                                }
                                onError={() =>
                                    setCaptchaToken(null)
                                }
                            />
                        </div>

                        {errorMessage && (
                            <p
                                className="invite-submit-error"
                                role="alert"
                            >
                                {errorMessage}
                            </p>
                        )}

                        {successMessage && (
                            <div
                                className="invite-submit-success"
                                role="status"
                            >
                                <p>
                                    {successMessage}
                                </p>

                                <button
                                    type="button"
                                    className="invite-submit-button"
                                    onClick={async () => {
                                        await authService.logout();

                                        router.replace(
                                            "/login"
                                        );
                                    }}
                                >
                                    Click Back to Login
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="invite-reset-submit"
                            disabled={!canSubmit}
                        >
                            {submitting
                                ? "Changing Password..."
                                : "Change Password"}
                        </button>
                    </form>
                </section>
            </main>

            <CareVRFooter />

            <style jsx>{`
                /*
                 * The invitation already establishes the user's
                 * Care Family context. The Family/Self selector
                 * is not applicable on this page.
                 *
                 * Scope this change to this page only so the
                 * shared MobileHeader remains unchanged.
                 */
                .invite-reset-page
                    :global(.carevr-mobile-mode-toggle) {
                    display: none;
                }

                .invite-reset-page {
                    min-height: 100dvh;
                    display: flex;
                    flex-direction: column;
                    background: #f4f8fc;
                }

                .invite-reset-main {
                    flex: 1;
                    width: 100%;
                    padding: 48px 20px 56px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }

                .invite-reset-card {
                    width: 100%;
                    max-width: 620px;
                    padding: 40px 44px 42px;
                    background: #ffffff;
                    border: 1px solid #e3eaf2;
                    border-radius: 16px;
                    box-shadow:
                        0 12px 32px rgba(
                            22,
                            57,
                            91,
                            0.08
                        );
                }

                .invite-reset-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #eaf4ff;
                    font-size: 28px;
                }

                .invite-reset-heading {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .invite-reset-heading h1 {
                    margin: 0 0 10px;
                    color: #17345f;
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 700;
                }

                .invite-reset-heading p {
                    max-width: 500px;
                    margin: 0 auto;
                    color: #5d6d82;
                    font-size: 15px;
                    line-height: 1.55;
                }

                .invite-context {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                    margin-bottom: 28px;
                }

                .invite-context-item {
                    padding: 15px 16px;
                    border: 1px solid #dce5ee;
                    border-radius: 9px;
                    background: #f7fafc;
                }

                .invite-context-label {
                    display: block;
                    margin-bottom: 5px;
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 600;
                }

                .invite-context-value {
                    display: block;
                    color: #17345f;
                    font-size: 15px;
                    font-weight: 700;
                }

                .invite-reset-form {
                    display: flex;
                    flex-direction: column;
                    gap: 21px;
                }

                .invite-reset-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .invite-reset-field label {
                    color: #203a5d;
                    font-size: 14px;
                    font-weight: 650;
                }

                .invite-reset-field label span {
                    color: #718096;
                    font-weight: 500;
                }

                .invite-password-input {
                    position: relative;
                }

                .invite-password-input input {
                    width: 100%;
                    height: 48px;
                    padding: 0 48px 0 14px;
                    border: 1px solid #ccd8e5;
                    border-radius: 8px;
                    outline: none;
                    background: #ffffff;
                    color: #203a5d;
                    font-size: 15px;
                    box-sizing: border-box;
                    transition:
                        border-color 0.15s ease,
                        box-shadow 0.15s ease;
                }

                .invite-password-input input::placeholder {
                    color: #98a6b8;
                }

                .invite-password-input input:focus {
                    border-color: #2477d4;
                    box-shadow:
                        0 0 0 3px rgba(
                            36,
                            119,
                            212,
                            0.12
                        );
                }

                .invite-password-toggle {
                    position: absolute;
                    top: 50%;
                    right: 12px;
                    width: 30px;
                    height: 30px;
                    transform: translateY(-50%);
                    border: 0;
                    background: transparent;
                    color: #60738b;
                    cursor: pointer;
                    font-size: 18px;
                }

                .invite-password-toggle:disabled {
                    cursor: not-allowed;
                    opacity: 0.5;
                }

                .invite-field-error {
                    margin: -2px 0 0;
                    color: #c43d3d;
                    font-size: 12px;
                }

                .invite-submit-error {
                    margin: -4px 0 0;
                    padding: 11px 13px;
                    border: 1px solid #f0caca;
                    border-radius: 8px;
                    background: #fff5f5;
                    color: #b73535;
                    font-size: 13px;
                    line-height: 1.45;
                }

                .invite-password-requirements {
                    padding: 17px 18px;
                    border-radius: 9px;
                    background: #edf6ff;
                    border: 1px solid #d7eaff;
                }

                .invite-requirements-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 9px;
                    color: #215e9f;
                    font-size: 14px;
                    font-weight: 700;
                }

                .invite-requirements-title > span:first-child {
                    width: 19px;
                    height: 19px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #2477d4;
                    color: #ffffff;
                    font-size: 12px;
                    font-weight: 700;
                }

                .invite-password-requirements ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: grid;
                    gap: 5px;
                }

                .invite-password-requirements li {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #60738b;
                    font-size: 13px;
                }

                .invite-password-requirements li.valid {
                    color: #286d4b;
                }

                .invite-password-requirements li span:first-child {
                    width: 14px;
                    text-align: center;
                    font-weight: 700;
                }

                .invite-reset-submit {
                    width: 100%;
                    min-height: 48px;
                    border: 0;
                    border-radius: 8px;
                    background: #2377d4;
                    color: #ffffff;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    transition:
                        opacity 0.15s ease,
                        transform 0.15s ease;
                }

                .invite-reset-submit:not(:disabled):hover {
                    opacity: 0.93;
                }

                .invite-reset-submit:not(:disabled):active {
                    transform: translateY(1px);
                }

                .invite-reset-submit:disabled {
                    opacity: 0.48;
                    cursor: not-allowed;
                }

                @media (max-width: 700px) {
                    .invite-reset-main {
                        padding: 28px 14px 36px;
                    }

                    .invite-reset-card {
                        padding: 30px 20px 28px;
                        border-radius: 14px;
                    }

                    .invite-reset-heading h1 {
                        font-size: 25px;
                    }

                    .invite-context {
                        grid-template-columns: 1fr;
                        gap: 10px;
                    }
                }

                @media (max-width: 420px) {
                    .invite-reset-main {
                        padding: 18px 10px 28px;
                    }

                    .invite-reset-card {
                        padding: 25px 15px 24px;
                        border-radius: 12px;
                    }

                    .invite-reset-heading {
                        margin-bottom: 24px;
                    }

                    .invite-reset-heading h1 {
                        font-size: 23px;
                    }

                    .invite-reset-heading p {
                        font-size: 14px;
                    }

                    .invite-reset-form {
                        gap: 18px;
                    }

                    .invite-password-requirements {
                        padding: 15px;
                    }
                }
            `}</style>
        </div>
    );
}

export default function InviteResetTempPwd(
    props: InviteResetTempPwdProps
) {
    return (
        <Suspense
            fallback={
                <div className="invite-reset-page">
                    <main className="invite-reset-main">
                        <section className="invite-reset-card">
                            <div className="invite-reset-heading">
                                <h1>
                                    Set Your Password
                                </h1>

                                <p>
                                    Loading...
                                </p>
                            </div>
                        </section>
                    </main>
                </div>
            }
        >
            <InviteResetTempPwdContent
                {...props}
            />
        </Suspense>
    );
}
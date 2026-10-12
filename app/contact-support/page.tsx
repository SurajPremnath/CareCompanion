
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";
import CareVRFooter from "@/Components/common/CareVRFooter";
import LanguageSelector from "@/Components/language/LanguageSelector";

import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";
import { consentStorage } from "@/lib/consent/storage/consentStorage";

type SupportProfile = {
    fullName: string;
    email: string;
};

const categories = [
    "Account and Login",
    "PIN and Security",
    "Family and Patient Profiles",
    "Health Records and Reports",
    "Invitations and Access",
    "Technical Issue",
    "Other",
];

export default function ContactSupportPage() {
    const router = useRouter();

    const [user, setUser] = useState<SupportProfile | null>(null);
    const [consentGranted, setConsentGranted] = useState(false);
    const [careMode, setCareMode] = useState<MobileCareMode>("FAMILY");
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [category, setCategory] = useState(categories[0]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadUser() {
            try {
                const authUser = await authService.getCurrentUser();

                if (!authUser) {
                    router.replace("/login");
                    return;
                }

                const profile = await profileRepository.getCurrentProfile();
                const consent = await consentStorage.hasAcceptedCurrentConsent();

                if (!profile) {
                    await authService.logout();
                    router.replace("/login");
                    return;
                }

                if (!cancelled) {
                    setUser({
                        fullName: profile.fullName || "CareVR User",
                        email: profile.email || authUser.email || "",
                    });
                    setConsentGranted(consent);
                }
            } catch {
                if (!cancelled) {
                    router.replace("/login");
                }
            }
        }

        void loadUser();

        return () => {
            cancelled = true;
        };
    }, [router]);

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);
        setAccountMenuOpen(false);

        try {
            await authService.logout();
            router.replace("/login");
        } catch {
            setError("Unable to log out. Please try again.");
            setLoggingOut(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submitting || !user) return;

        setError("");
        setSuccess(false);
        setSubmitting(true);

        try {
            const response = await fetch("/api/contact-support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category,
                    subject: subject.trim(),
                    message: message.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Unable to submit your request."
                );
            }

            setSuccess(true);
            setSubject("");
            setMessage("");
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to submit your request. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    const handleAddPatient = () => {
        setAccountMenuOpen(false);
        router.push("/add-patient");
    };

    const handleCareVRJourney = () => {
        setAccountMenuOpen(false);
        router.push("/dashboard");
    };

    const handleHelp = () => {
        setAccountMenuOpen(false);
        router.push("/help");
    };

    return (
        <main className="support-page">
            <div className="support-shell">
                <MobileHeader
                    careMode={careMode}
                    onCareModeChange={setCareMode}
                    userName={user.fullName}
                    pageTitle="Contact Support"
                    pageSubtitle="We're here to help"
                    showCareModeToggle={false}
                    showHomeButton
                    onHomeClick={() => router.push("/dashboard")}
                    accountMenuOpen={accountMenuOpen}
                    onAccountMenuToggle={() =>
                        setAccountMenuOpen((value) => !value)
                    }
                    consentGranted={consentGranted}
                    canAddPatient={false}
                    onAddPatient={handleAddPatient}
                    onCareVRJourney={handleCareVRJourney}
                    onHelp={handleHelp}
                    languageSelector={<LanguageSelector />}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                />

                <section className="support-hero">
                    <div className="support-eyebrow">
                        CAREVR CUSTOMER SUPPORT
                    </div>
                    <h1>How can we help you?</h1>
                    <p>
                        Tell us what you need help with. Our support team will
                        review your request and respond by email.
                    </p>
                    <div className="support-trust">
                        <span aria-hidden="true">â™¢</span>
                        Your privacy and security matter to us.
                    </div>
                </section>

                <section className="support-card">
                    <div className="support-card-heading">
                        <h2>Send us a message</h2>
                        <p>Fields marked * are required.</p>
                    </div>

                    {success && (
                        <div className="support-success" role="status">
                            <strong>Request submitted successfully.</strong>
                            <span>
                                Thank you for contacting CareVR. Your message
                                has been sent to our support team.
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="support-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="support-field">
                            <label htmlFor="support-name">Your name</label>
                            <input
                                id="support-name"
                                value={user.fullName}
                                readOnly
                            />
                        </div>

                        <div className="support-field">
                            <label htmlFor="support-email">Email address</label>
                            <input
                                id="support-email"
                                type="email"
                                value={user.email}
                                readOnly
                            />
                            <small>We'll use your registered email for replies.</small>
                        </div>

                        <div className="support-field">
                            <label htmlFor="support-category">
                                Support category *
                            </label>
                            <select
                                id="support-category"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                required
                            >
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="support-field">
                            <label htmlFor="support-subject">Subject *</label>
                            <input
                                id="support-subject"
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                                maxLength={120}
                                placeholder="Briefly describe your issue"
                                required
                            />
                        </div>

                        <div className="support-field">
                            <label htmlFor="support-message">How can we help? *</label>
                            <textarea
                                id="support-message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                maxLength={5000}
                                rows={7}
                                placeholder="Describe the issue and what you were trying to do..."
                                required
                            />
                            <small>{message.length}/5000 characters</small>
                        </div>

                        <div className="support-privacy">
                            <strong>ðŸ”’ Protect your personal information</strong>
                            <p>
                                Never include your password, PIN or OTP.
                                Please avoid sharing unnecessary sensitive
                                medical information in this message.
                            </p>
                        </div>

                        <button
                            className="support-submit"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting request..." : "Submit Support Request"}
                        </button>
                    </form>
                </section>

                <div className="support-alternative">
                    If you cannot submit this form, please try again later.
                </div>

                <CareVRFooter />
            </div>

            <style jsx>{`
                .support-page {
                    min-height: 100vh;
                    background: #f5f7fb;
                    color: #172b4d;
                }

                .support-shell {
                    width: min(100% - 32px, 820px);
                    margin: 0 auto;
                    padding: 16px 0 28px;
                }

                .support-hero {
                    padding: 42px 8px 28px;
                }

                .support-eyebrow {
                    color: #2874a6;
                    font-size: 12px;
                    font-weight: 750;
                    letter-spacing: 1.5px;
                }

                .support-hero h1 {
                    margin: 12px 0;
                    color: #173c5a;
                    font-size: clamp(30px, 5vw, 42px);
                    line-height: 1.15;
                    letter-spacing: -1px;
                }

                .support-hero > p {
                    max-width: 620px;
                    color: #63748a;
                    font-size: 16px;
                    line-height: 1.75;
                }

                .support-trust {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-top: 20px;
                    color: #41647e;
                    font-size: 13px;
                    font-weight: 600;
                }

                .support-card {
                    padding: clamp(20px, 4vw, 34px);
                    background: #fff;
                    border: 1px solid #e3e9f0;
                    border-radius: 18px;
                    box-shadow: 0 8px 32px rgba(25, 55, 85, 0.055);
                }

                .support-card-heading {
                    margin-bottom: 26px;
                }

                .support-card-heading h2 {
                    margin: 0 0 8px;
                    color: #193d5b;
                    font-size: 23px;
                }

                .support-card-heading p,
                .support-field small {
                    color: #77869a;
                    font-size: 12px;
                }

                .support-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 21px;
                }

                .support-field label {
                    color: #30465e;
                    font-size: 14px;
                    font-weight: 650;
                }

                .support-field input,
                .support-field select,
                .support-field textarea {
                    width: 100%;
                    min-height: 48px;
                    padding: 12px 14px;
                    border: 1px solid #d7e0e9;
                    border-radius: 9px;
                    background: #fff;
                    color: #243b53;
                    font: inherit;
                    font-size: 14px;
                }

                .support-field textarea {
                    min-height: 150px;
                    resize: vertical;
                    line-height: 1.6;
                }

                .support-field input:focus,
                .support-field select:focus,
                .support-field textarea:focus {
                    outline: 3px solid rgba(43, 121, 171, 0.14);
                    border-color: #397eaa;
                }

                .support-field input[readonly] {
                    background: #f7f9fc;
                    color: #596c80;
                }

                .support-privacy {
                    padding: 16px;
                    border: 1px solid #dce9f2;
                    border-radius: 10px;
                    background: #f2f7fb;
                    color: #34536c;
                    font-size: 13px;
                    line-height: 1.6;
                }

                .support-privacy p {
                    margin: 6px 0 0;
                    color: #5d7286;
                }

                .support-submit {
                    width: 100%;
                    min-height: 50px;
                    margin-top: 22px;
                    padding: 13px 18px;
                    border: 0;
                    border-radius: 10px;
                    background: #205f8b;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .support-submit:hover:not(:disabled) {
                    background: #174c72;
                }

                .support-submit:disabled {
                    cursor: wait;
                    opacity: 0.7;
                }

                .support-success,
                .support-error {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 22px;
                    padding: 15px;
                    border-radius: 9px;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .support-success {
                    border: 1px solid #b8e1ca;
                    background: #effaf3;
                    color: #21613a;
                }

                .support-error {
                    border: 1px solid #f0c6c6;
                    background: #fff4f4;
                    color: #a32929;
                }

                .support-alternative {
                    padding: 20px 8px 0;
                    color: #77869a;
                    font-size: 12px;
                    text-align: center;
                }

                @media (max-width: 520px) {
                    .support-shell {
                        width: min(100% - 20px, 820px);
                        padding-top: 8px;
                    }

                    .support-hero {
                        padding: 30px 4px 22px;
                    }

                    .support-hero > p {
                        font-size: 14px;
                    }

                    .support-card {
                        border-radius: 13px;
                    }
                }
            `}</style>
        </main>
    );
}


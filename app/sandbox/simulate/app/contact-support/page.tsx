
"use client";

import { useEffect, useRef, useState } from "react";
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

const MAX_ATTACHMENT_SIZE = 500 * 1024;

async function prepareSupportImage(file: File): Promise<File> {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
        throw new Error("Please choose a JPEG, PNG, or WebP image.");
    }

    if (file.size <= MAX_ATTACHMENT_SIZE) return file;

    const imageUrl = URL.createObjectURL(file);

    try {
        const image = new Image();

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Unable to read this image."));
            image.src = imageUrl;
        });

        const canvas = document.createElement("canvas");
        const maxDimension = 1800;
        const scale = Math.min(
            1,
            maxDimension / Math.max(image.naturalWidth, image.naturalHeight)
        );

        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to compress this image on your device.");
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // JPEG is broadly supported and usually suitable for screenshots.
        // Try progressively lower quality until the file is within the limit.
        for (const quality of [0.82, 0.7, 0.58, 0.45, 0.32]) {
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/jpeg", quality)
            );

            if (blob && blob.size <= MAX_ATTACHMENT_SIZE) {
                const baseName = file.name.replace(/\.[^.]+$/, "") || "screenshot";

                return new File([blob], `${baseName}.jpg`, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                });
            }
        }

        throw new Error(
            "This image is still larger than 500 KB after compression. Please choose a smaller image."
        );
    } finally {
        URL.revokeObjectURL(imageUrl);
    }
}


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

const fileInputRef = useRef<HTMLInputElement>(null);
const [attachment, setAttachment] = useState<File | null>(null);
const [ticketNumber, setTicketNumber] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadUser() {
            try {
                const authUser = await authService.getCurrentUser();

                if (!authUser) {
                    router.replace("/sandbox/simulate/app/dashboard");
                    return;
                }

                const profile = await profileRepository.getCurrentProfile();
                const consent = await consentStorage.hasAcceptedCurrentConsent();

                if (!profile) {
                    await authService.logout();
                    router.replace("/sandbox/simulate/app/dashboard");
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
                    router.replace("/sandbox/simulate/app/dashboard");
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
            router.replace("/sandbox/simulate/app/dashboard");
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
    setTicketNumber("");
    setSubmitting(true);

    try {
        const formData = new FormData();
        formData.append("category", category);
        formData.append("subject", subject.trim());
        formData.append("message", message.trim());

        if (attachment) {
            if (attachment.size > MAX_ATTACHMENT_SIZE) {
                throw new Error("The attachment must be no larger than 500 KB.");
            }

            formData.append("attachment", attachment);
        }

        const response = await fetch("/api/contact-support", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Unable to submit your request.");
        }

setTicketNumber(result.ticketNumber);
setSuccess(true);

window.alert(
    `Thank you for submitting the Support Request. Your Ticket number is #${result.ticketNumber.replace(/^#/, "")}`
);

setSubject("");
setMessage("");
setAttachment(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
                    pageTitle=""
                    pageSubtitle=""
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
                        <span aria-hidden="true"></span>
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
                            <strong>Support request submitted successfully.</strong>

                            <span>
                                Your reference number is{" "}
                                <strong>{ticketNumber}</strong>.
                            </span>

                            <span>
                                Our team is investigating your request and aims
                                to respond within 24 hours. An acknowledgement
                                has been sent to your registered email address.
                            </span>

                            <small>
                                This is a temporary reference. Persistent ticket
                                tracking will be designed as part of the
                                incident-management work.
                            </small>
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

                        <div className="support-field">
                            <label htmlFor="support-attachment">
                                Screenshot attachment (optional)
                            </label>

                            <input
                                ref={fileInputRef}
                                id="support-attachment"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={submitting}
                                onChange={async (event) => {
                                    const selectedFile = event.target.files?.[0];

                                    if (!selectedFile) {
                                        setAttachment(null);
                                        return;
                                    }

                                    setError("");

                                    try {
                                        const preparedFile =
                                            await prepareSupportImage(selectedFile);

                                        setAttachment(preparedFile);

                                        if (preparedFile.size < selectedFile.size) {
                                            window.alert(
                                                `Image compressed to ${(preparedFile.size / 1024).toFixed(0)} KB.`
                                            );
                                        }
                                    } catch (fileError) {
                                        setAttachment(null);
                                        event.target.value = "";

                                        window.alert(
                                            fileError instanceof Error
                                                ? fileError.message
                                                : "Unable to prepare this image."
                                        );
                                    }
                                }}
                            />

                            <small>
                                JPEG, PNG or WebP. Maximum 500 KB. Larger images
                                will be compressed where possible.
                            </small>

                            {attachment && (
                                <small>
                                    Selected: {attachment.name} ·{" "}
                                    {(attachment.size / 1024).toFixed(0)} KB

                                    <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => {
                                            setAttachment(null);

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        style={{
                                            marginLeft: 10,
                                            border: 0,
                                            background: "transparent",
                                            color: "#205f8b",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Remove
                                    </button>
                                </small>
                            )}
                        </div>

                        <div className="support-privacy">
                            <strong>Protect your personal information</strong>
                            <p>
                                Never include your password, PIN or OTP.
                                Please avoid sharing unnecessary sensitive
                                medical information in this message.
                            </p>
                        </div>


<button
    className="support-submit"
    type="submit"
    disabled={submitting || !message.trim()}
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
    .support-page {
        width: 100%;
        min-width: 0;
        overflow-x: clip;
    }

    .support-shell {
        width: calc(100% - 24px);
        max-width: 820px;
        margin-inline: auto;
        padding: 8px 0 20px;
    }

    .support-hero {
        padding: 22px 4px 18px;
    }

    .support-eyebrow {
        font-size: 11px;
        letter-spacing: 1.1px;
    }

    .support-hero h1 {
        margin: 10px 0;
        font-size: clamp(27px, 7vw, 34px);
        line-height: 1.18;
        letter-spacing: -0.6px;
        overflow-wrap: anywhere;
    }

    .support-hero > p {
        margin: 0;
        font-size: 15px;
        line-height: 1.6;
    }

    .support-trust {
        align-items: flex-start;
        margin-top: 14px;
        font-size: 12px;
        line-height: 1.5;
    }

    .support-card {
        min-width: 0;
        padding: 18px 16px 20px;
        border-radius: 14px;
    }

    .support-card-heading {
        margin-bottom: 22px;
    }

    .support-card-heading h2 {
        font-size: 21px;
        line-height: 1.3;
    }

    .support-card-heading p {
        margin-bottom: 0;
        line-height: 1.5;
    }

    .support-field {
        min-width: 0;
        gap: 7px;
        margin-bottom: 18px;
    }

    .support-field label {
        font-size: 14px;
        line-height: 1.5;
    }

    .support-field input,
    .support-field select,
    .support-field textarea {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        min-height: 50px;
        padding: 13px 12px;
        border-radius: 9px;
        font-size: 16px;
    }

    .support-field textarea {
        min-height: 150px;
        line-height: 1.6;
    }

    .support-field small {
        font-size: 12px;
        line-height: 1.5;
        overflow-wrap: anywhere;
    }

    .support-privacy {
        padding: 13px;
        font-size: 13px;
        line-height: 1.6;
        overflow-wrap: anywhere;
    }

    .support-submit {
        min-height: 52px;
        margin-top: 18px;
        padding: 14px 12px;
        font-size: 15px;
        line-height: 1.4;
        overflow-wrap: anywhere;
    }

    .support-success,
    .support-error {
        padding: 13px;
        font-size: 14px;
        overflow-wrap: anywhere;
    }

    .support-alternative {
        padding: 18px 4px 0;
        font-size: 12px;
        line-height: 1.6;
    }
}

@media (max-width: 360px) {
    .support-shell {
        width: calc(100% - 20px);
    }

    .support-card {
        padding: 16px 12px 18px;
    }

    .support-hero h1 {
        font-size: 27px;
    }

    .support-card-heading h2 {
        font-size: 19px;
    }
}
            `}</style>
        </main>
    );
}


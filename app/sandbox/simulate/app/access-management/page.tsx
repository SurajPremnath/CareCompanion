"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CareVRFooter from "@/app/sandbox/simulate/Components/common/CareVRFooter";
import SandboxMobileHeader from "@/app/sandbox/simulate/app/components/SandboxMobileHeader";

import {
    inviteeSecondaryFamilyMemberInvitationTemplate,
} from "@/app/sandbox/simulate/lib/invitations/templates/inviteeSecondaryFamilyMemberInvitation";

import {
    inviteeCaretakerInvitationTemplate,
} from "@/app/sandbox/simulate/lib/invitations/templates/inviteeCaretakerInvitation";

import {
    inviteeDoctorInvitationTemplate,
} from "@/app/sandbox/simulate/lib/invitations/templates/inviteeDoctorInvitation";

type InviteRole =
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";

const roleLabels: Record<InviteRole, string> = {
    SECONDARY_FAMILY_MEMBER: "Secondary Family Member",
    CARETAKER: "Caretaker",
    DOCTOR: "Doctor",
};

export default function SandboxAccessManagementPage() {
    const router = useRouter();

    const [inviteeName, setInviteeName] = useState("");
    const [inviteeEmail, setInviteeEmail] = useState("");
    const [role, setRole] = useState<InviteRole>(
        "SECONDARY_FAMILY_MEMBER"
    );

const [previewVisible, setPreviewVisible] = useState(false);
const [simulatedToken, setSimulatedToken] = useState<string | null>(null);
const [simulatedExpiry, setSimulatedExpiry] = useState<string | null>(null);

    const emailIsValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteeEmail.trim());

const canPreview =
    inviteeName.trim().length > 0 && emailIsValid;

// Select the same email template used by production CareVR.
const invitationTemplate =
    role === "CARETAKER"
        ? inviteeCaretakerInvitationTemplate
        : role === "DOCTOR"
            ? inviteeDoctorInvitationTemplate
            : inviteeSecondaryFamilyMemberInvitationTemplate;

// Render the email locally using the simulated URL.
// This does not create or send an actual invitation.
const simulatedInvitationLink = simulatedToken
    ? `https://carevr.in/invitee-registration?token=DEMO_ONLY_${simulatedToken}`
    : "";

const simulatedEmailBody = invitationTemplate.body
    .replace(
        "{{invitee_registration_url}}",
        simulatedInvitationLink
    )
    .replace(
        "{{permitted_access}}",
        "Access permissions are determined through CareVR's authorization and consent process."
    );



function handlePreview() {
    if (!canPreview) return;

    // Generate a random-looking, browser-only demonstration value.
    // This is NOT a production invitation token.
    const bytes = new Uint8Array(24);
    window.crypto.getRandomValues(bytes);

    const demoToken = Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");

    setSimulatedToken(demoToken);

    setSimulatedExpiry(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
            })
    );

    setPreviewVisible(true);
}

    return (
        <main className="sandbox-access-page">
            <div className="sandbox-access-shell">
<SandboxMobileHeader
    onHomeClick={() =>
        router.push("/sandbox/simulate/app/dashboard")
    }
/>

                <section className="sandbox-access-content">
                    <div className="page-icon" aria-hidden="true">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 3 20 6V11C20 16 16.8 19.5 12 21 7.2 19.5 4 16 4 11V6L12 3Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 8V15M8.5 11.5H15.5"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <p className="eyebrow">ACCESS MANAGEMENT</p>

                    <h1>Invite someone to your CareVR family</h1>

                    <p className="intro">
                        Explore how a Primary user prepares an invitation
                        for someone who will participate in their care journey.
                    </p>

                    <div className="demo-notice" role="note">
                        <strong>Sandbox demonstration only</strong>
                        <p>
                            This screen demonstrates the invitation experience.
                            No invitation is created, saved, or sent, and no
                            production account or access permission is changed.
                        </p>
                    </div>

                    <section className="invite-card">
                        <div className="section-heading">
                            <span className="step-number">1</span>
                            <div>
                                <h2>Invitee details</h2>
                                <p>Choose who you would like to invite.</p>
                            </div>
                        </div>

                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                handlePreview();
                            }}
                        >
                            <label htmlFor="invitee-name">
                                Invitee name
                            </label>
                            <input
                                id="invitee-name"
                                type="text"
                                autoComplete="off"
                                placeholder="Enter their name"
                                value={inviteeName}
                                onChange={(event) => {
                                    setInviteeName(event.target.value);
                                    setPreviewVisible(false);
                                    setSimulatedToken(null);
                                    setSimulatedExpiry(null);
                                }}
                                required
                            />

                            <label htmlFor="invitee-email">
                                Email address
                            </label>
                            <input
                                id="invitee-email"
                                type="email"
                                autoComplete="off"
                                placeholder="name@example.com"
                                value={inviteeEmail}
                                onChange={(event) => {
                                    setInviteeEmail(event.target.value);
                                    setPreviewVisible(false);
                                    setSimulatedToken(null);
                                    setSimulatedExpiry(null);
                                }}
                                required
                            />

                            <label htmlFor="invitee-role">
                                Role
                            </label>
                            <select
                                id="invitee-role"
                                value={role}
                                onChange={(event) => {
                                    setRole(event.target.value as InviteRole);
                                    setPreviewVisible(false);
                                    setSimulatedToken(null);
                                    setSimulatedExpiry(null);
                                }}
                            >
                                <option value="SECONDARY_FAMILY_MEMBER">
                                    Secondary Family Member
                                </option>
                                <option value="CARETAKER">
                                    Caretaker
                                </option>
                                <option value="DOCTOR">
                                    Doctor
                                </option>
                            </select>

                            <div className="role-explanation">
                                <strong>Access is role-specific</strong>
                                <p>
                                    In the actual product, a role does not
                                    automatically grant access. CareVR's
                                    authorization and consent rules govern
                                    what the invited person can access.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="preview-button"
                                disabled={!canPreview}
                            >
                                Preview invitation
                                <span aria-hidden="true"> →</span>
                            </button>
                        </form>
                    </section>

                    {previewVisible && (
                        <section
                            className="invite-card preview-card"
                            aria-live="polite"
                        >
                            <div className="section-heading">
                                <span className="step-number">2</span>
                                <div>
                                    <h2>Invitation preview</h2>
                                    <p>
                                        Example of the details prepared for
                                        an invitation.
                                    </p>
                                </div>
                            </div>

                            <div className="preview-status">
                                DEMO PREVIEW · NOT AN ACTIVE INVITATION
                            </div>

                            <dl className="preview-details">
                                <div>
                                    <dt>Invitee</dt>
                                    <dd>{inviteeName.trim()}</dd>
                                </div>
                                <div>
                                    <dt>Email</dt>
                                    <dd>{inviteeEmail.trim()}</dd>
                                </div>
                                <div>
                                    <dt>Proposed role</dt>
                                    <dd>{roleLabels[role]}</dd>
                                </div>
                                <div>
                                    <dt>Status</dt>
                                    <dd>Preview only — not sent</dd>
                                </div>
                            </dl>


<div className="simulated-email-card">
    <div className="simulated-email-heading">
        <span aria-hidden="true">✉️</span>
        <div>
            <strong>CareVR invitation email</strong>
            <p>Production template · Sandbox preview only</p>
        </div>
    </div>

    <div className="simulated-email-field">
        <span>To</span>
        <strong>{inviteeEmail.trim()}</strong>
    </div>

    <div className="simulated-email-field">
        <span>Subject</span>
        <strong>{invitationTemplate.subject}</strong>
    </div>

    <div className="simulated-email-body">
        <pre>{simulatedEmailBody}</pre>
    </div>

    <div className="simulated-link-status">
        <span className="status-dot" />
        SIMULATED · NOT SENT · LINK NOT VALID
    </div>

    <div className="simulated-link-expiry">
        <span>Illustrative expiry</span>
        <strong>{simulatedExpiry}</strong>
    </div>
</div>


                            <p className="preview-disclaimer">
                                In actual CareVR, invitation creation follows
                                the product's invitation and access-control
                                workflow. This preview has no effect on any
                                account or family.
                            </p>

                            <button
                                type="button"
                                className="edit-button"
                                onClick={() => setPreviewVisible(false)}
                            >
                                Edit invitee details
                            </button>
                        </section>
                    )}

                    <section className="process-card">
                        <h2>How it works in actual CareVR</h2>
                        <ol>
                            <li>Choose an eligible invitee and role.</li>
                            <li>CareVR processes the invitation through its established workflow.</li>
                            <li>Access remains governed by CareVR's authorization and consent controls.</li>
                        </ol>
                        <p>
                            This Sandbox illustrates the experience; it does
                            not perform these production operations.
                        </p>
                    </section>
                </section>

                <CareVRFooter />
            </div>

            <style jsx>{`
                .sandbox-access-page {
                    min-height: 100vh;
                    min-height: 100dvh;
                    padding: 0 16px;
                    color: #15203d;
                    background: linear-gradient(
                        180deg,
                        #f4f8ff 0%,
                        #ffffff 48%,
                        #f6f9ff 100%
                    );
                    font-family: Inter, -apple-system, BlinkMacSystemFont,
                        "Segoe UI", sans-serif;
                }

                .sandbox-access-shell {
                    width: 100%;
                    max-width: 760px;
                    min-height: 100vh;
                    min-height: 100dvh;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                }

                .sandbox-access-header {
                    min-height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-bottom: 1px solid #e7edf7;
                }

                .sandbox-brand {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    color: #172c60;
                    font-size: 20px;
                    font-weight: 800;
                }

                .sandbox-brand-mark {
                    width: 34px;
                    height: 34px;
                    display: grid;
                    place-items: center;
                    border-radius: 11px;
                    color: white;
                    background: #2859bd;
                }

                .sandbox-badge {
                    padding: 4px 7px;
                    border-radius: 6px;
                    color: #80530b;
                    background: #fff2cf;
                    font-size: 9px;
                    letter-spacing: 0.6px;
                }

.simulated-link-card {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid #d7e4f7;
    border-radius: 13px;
    background: #f7faff;
}

.simulated-link-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 13px;
}

.simulated-link-heading > span {
    font-size: 23px;
}

.simulated-link-heading strong {
    display: block;
    color: #19396e;
    font-size: 14px;
}

.simulated-link-heading p {
    margin: 3px 0 0;
    color: #71819a;
    font-size: 12px;
}

.simulated-link {
    display: block;
    padding: 12px;
    overflow-wrap: anywhere;
    border: 1px solid #dce5f2;
    border-radius: 9px;
    background: #fff;
    color: #2859a8;
    font-size: 12px;
    line-height: 1.7;
    user-select: text;
}

.simulated-link-status {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 12px;
    color: #8a5b0a;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.3px;
}

.status-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: #e5a323;
}

.simulated-link-expiry {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    margin-top: 13px;
    padding-top: 12px;
    border-top: 1px solid #e5ebf5;
    font-size: 12px;
}

.simulated-link-expiry span {
    color: #64748b;
}

.simulated-link-expiry strong {
    color: #304464;
}

.simulated-email-card {
    margin: 16px 0;
    padding: 18px;
    border: 1px solid #d7e4f7;
    border-radius: 13px;
    background: #f7faff;
}

.simulated-email-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
}

.simulated-email-heading > span {
    font-size: 24px;
}

.simulated-email-heading strong {
    display: block;
    color: #19396e;
    font-size: 15px;
}

.simulated-email-heading p {
    margin: 4px 0 0;
    color: #71819a;
    font-size: 12px;
}

.simulated-email-field {
    display: grid;
    grid-template-columns: 75px minmax(0, 1fr);
    gap: 12px;
    padding: 12px 0;
    border-top: 1px solid #e1e9f5;
    font-size: 13px;
}

.simulated-email-field > span {
    color: #64748b;
}

.simulated-email-field > strong {
    color: #23395f;
    overflow-wrap: anywhere;
}

.simulated-email-body {
    margin-top: 8px;
    padding: 16px;
    border: 1px solid #e1e9f5;
    border-radius: 10px;
    background: #fff;
}

.simulated-email-body pre {
    margin: 0;
    color: #334155;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

@media (max-width: 520px) {
    .simulated-email-card {
        padding: 13px;
    }

    .simulated-email-body {
        padding: 12px;
    }

    .simulated-email-field {
        grid-template-columns: 1fr;
        gap: 5px;
    }
}

.sandbox-mobile-header {
    position: relative;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
}

                .home-button,
                .edit-button {
                    padding: 9px 12px;
                    border: 1px solid #dce5f3;
                    border-radius: 10px;
                    background: white;
                    color: #25477f;
                    font-size: 13px;
                    font-weight: 650;
                    cursor: pointer;
                }

                .sandbox-access-content {
                    flex: 1;
                    padding: 32px 0 24px;
                }

                .page-icon {
                    width: 62px;
                    height: 62px;
                    display: grid;
                    place-items: center;
                    margin-bottom: 18px;
                    border-radius: 19px;
                    color: #2859bd;
                    background: #e8f0ff;
                }

                .eyebrow {
                    margin: 0 0 8px;
                    color: #3766b7;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1.3px;
                }

                h1 {
                    max-width: 620px;
                    margin: 0;
                    color: #152a59;
                    font-size: clamp(27px, 5vw, 36px);
                    font-weight: 800;
                    line-height: 1.18;
                    letter-spacing: -0.7px;
                }

                .intro {
                    max-width: 610px;
                    margin: 13px 0 22px;
                    color: #5a6b88;
                    font-size: 15px;
                    line-height: 1.65;
                }

                .demo-notice {
                    padding: 15px 17px;
                    border: 1px solid #c9dcff;
                    border-radius: 14px;
                    background: #eff5ff;
                }

                .demo-notice strong {
                    color: #214b96;
                    font-size: 14px;
                }

                .demo-notice p,
                .role-explanation p,
                .section-heading p {
                    margin: 5px 0 0;
                    color: #5a6b88;
                    font-size: 13px;
                    line-height: 1.55;
                }

                .invite-card,
                .process-card {
                    margin-top: 20px;
                    padding: 22px;
                    border: 1px solid #e2e9f4;
                    border-radius: 18px;
                    background: #fff;
                    box-shadow: 0 8px 28px rgba(29, 54, 100, 0.045);
                }

                .section-heading {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 22px;
                }

                .step-number {
                    flex: 0 0 34px;
                    width: 34px;
                    height: 34px;
                    display: grid;
                    place-items: center;
                    border-radius: 11px;
                    color: #2859bd;
                    background: #eaf1ff;
                    font-weight: 800;
                }

                h2 {
                    margin: 0;
                    color: #192f5d;
                    font-size: 19px;
                    font-weight: 800;
                    line-height: 1.35;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                }

                label {
                    margin-top: 8px;
                    color: #304464;
                    font-size: 13px;
                    font-weight: 700;
                }

                input,
                select {
                    width: 100%;
                    min-height: 47px;
                    padding: 12px 13px;
                    border: 1px solid #d8e1ef;
                    border-radius: 10px;
                    background: #fff;
                    color: #192f5d;
                    font: inherit;
                    font-size: 14px;
                }

                input:focus,
                select:focus {
                    outline: 2px solid #9dbbff;
                    outline-offset: 1px;
                    border-color: #5682df;
                }

                .role-explanation {
                    margin-top: 8px;
                    padding: 13px;
                    border-radius: 10px;
                    background: #f6f8fc;
                }

                .role-explanation strong {
                    color: #304464;
                    font-size: 13px;
                }

                .preview-button {
                    min-height: 48px;
                    margin-top: 10px;
                    padding: 12px 16px;
                    border: 0;
                    border-radius: 11px;
                    color: white;
                    background: #2859bd;
                    font-size: 14px;
                    font-weight: 750;
                    cursor: pointer;
                }

                .preview-button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }

                .preview-status {
                    padding: 10px 12px;
                    border: 1px solid #f1d8a1;
                    border-radius: 9px;
                    color: #80530b;
                    background: #fff8e8;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.35px;
                }

                .preview-details {
                    margin: 16px 0;
                }

                .preview-details div {
                    display: grid;
                    grid-template-columns: minmax(100px, 0.7fr) minmax(0, 1.3fr);
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid #edf1f7;
                }

                .preview-details dt {
                    color: #64748b;
                    font-size: 13px;
                }

                .preview-details dd {
                    margin: 0;
                    overflow-wrap: anywhere;
                    color: #23395f;
                    font-size: 13px;
                    font-weight: 700;
                }

                .preview-disclaimer,
                .process-card > p {
                    color: #65748b;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .process-card ol {
                    padding-left: 20px;
                    color: #475b79;
                    font-size: 13px;
                    line-height: 1.8;
                }

                .edit-button {
                    margin-top: 5px;
                }

                @media (max-width: 480px) {
                    .sandbox-access-page {
                        padding: 0 12px;
                    }

                    .sandbox-access-header {
                        min-height: 62px;
                    }

                    .sandbox-brand {
                        gap: 6px;
                        font-size: 17px;
                    }

                    .sandbox-brand-mark {
                        width: 30px;
                        height: 30px;
                    }

                    .sandbox-badge {
                        font-size: 8px;
                    }

                    .home-button {
                        padding: 8px 9px;
                        font-size: 12px;
                    }

                    .sandbox-access-content {
                        padding-top: 25px;
                    }

                    .invite-card,
                    .process-card {
                        padding: 17px;
                    }

                    .preview-details div {
                        grid-template-columns: 1fr;
                        gap: 5px;
                    }
                }
            `}</style>
        </main>
    );
}
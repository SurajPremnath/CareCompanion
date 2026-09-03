"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth/authService";

import {
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

export default function ConsentPage() {

    const router = useRouter();

    const [selectedTab, setSelectedTab] =
        useState("privacy");

    const [reviewedTabs, setReviewedTabs] =
        useState(
            new Set(["privacy"])
        );

    const [readConfirmed, setReadConfirmed] =
        useState(false);

    const [agreementAccepted, setAgreementAccepted] =
        useState(false);

    const [privacyPolicyAcknowledged, setPrivacyPolicyAcknowledged] =
        useState(false);

const [userName, setUserName] =
    useState("");

useEffect(() => {

    const loadUserName = async () => {

        try {

            const user =
                await authService.requireAuthenticatedUser();

            setUserName(
                user.user_metadata?.full_name || ""
            );

        } catch (error) {

            console.error(
                "Unable to load authenticated user.",
                error
            );

        }

    };

    loadUserName();

}, []);


    const tabContent = useMemo(() => ({

        privacy: {
            title: "🔒 Privacy",
            content:
                "Your health information belongs to you. CareVR helps you securely capture, organize and manage your health information. You remain in control of the information you choose to provide and share."
        },

        family: {
            title: "👨‍👩‍👧 Family",
            content:
                "CareVR supports individuals, families and trusted caregivers in managing health information. When you provide or share information about another person, you should have the appropriate authority or permission to do so. Access to another person's information is managed through CareVR's access and permission controls."
        },

        tracking: {
            title: "🩺 Tracking",
            content:
                "CareVR helps you record, organize and track health information so that it is easier to maintain and carry to healthcare consultations. Information is processed for the purposes described to you and in accordance with your consent and applicable requirements."
        },

        security: {
            title: "🔐 Security",
            content:
                "CareVR uses authentication, access controls and other security measures designed to protect your account and health information. No digital system can guarantee absolute security, but CareVR is designed to reduce the risk of unauthorized access, loss or misuse."
        },

        medical: {
            title: "⚕️ Medical",
            content:
                "CareVR helps patients understand, organize and carry their health information to their doctor. CareVR does not tell patients what their health information means medically or what they should do about it. Clinical interpretation, diagnosis, treatment and clinical judgment remain the responsibility of the treating doctor or other qualified healthcare professional."
        },

        legal: {
            title: "⚖️ Legal & Data Protection",
            content:
                "Your information is processed in accordance with applicable data-protection requirements and the CareVR Privacy Policy. We explain what information is collected, why it is used, how it may be accessed or shared, and how you can exercise your applicable rights, including withdrawal of consent where applicable. You may raise a concern or grievance through the designated CareVR grievance mechanism. Your consent applies to the purposes and information described to you."
        },

storage: {
    title: "💾 Storage & Processing",
    content: (
        <>
            <p style={styles.contentParagraph}>
                CareVR stores your account and health information securely
                to provide, maintain, and manage our services.
            </p>

            <p style={styles.contentParagraph}>
                Documents you upload are processed using automated transcription and 
                extraction technologies, including third-party providers like <strong>OpenAI APIs</strong>. 
                Depending on service configurations, this processing may securely occur 
                <strong> outside India</strong>.
            </p>
        </>
    ),
},

retention: {
    title: "🗄️ Retention & Deletion",
    content: (
        <>
            <p style={styles.contentParagraph}>
                Uploaded source documents are used solely for extraction. They are not 
                retained in your permanent record and are <strong>permanently and 
                immediately deleted</strong> from CareVR’s infrastructure and third-party 
                environments once extraction finishes, subject only to Indian legal obligations.
            </p>

            <p style={styles.contentParagraph}>
                We collect and retain only the information necessary for specified purposes, 
                keeping it only for as long as required by law or the purpose itself.
            </p>

            <p style={styles.contentParagraph}>
                Support and grievance communications are processed and stored only as necessary 
                to resolve your request, subject to mandatory record-keeping requirements.
            </p>
        </>
    ),
},
    }), []);


const INFORMATION_SECTION_COUNT =
    Object.keys(tabContent).length;


    const handleTabChange = (
        tab: string
    ) => {

        setSelectedTab(tab);

        setReviewedTabs(previous => {

            const updated =
                new Set(previous);

            updated.add(tab);

            return updated;

        });

    };

    const allSectionsReviewed =
        reviewedTabs.size === INFORMATION_SECTION_COUNT;

    const canContinue =
        allSectionsReviewed &&
        readConfirmed &&
        agreementAccepted &&
        privacyPolicyAcknowledged;

    const handleDecline = async () => {

        try {

            await authService.logout();

            router.replace("/login");

        } catch (error) {

            console.error(
                "Unable to sign out.",
                error
            );

        }

    };

    const handleAccept = async () => {

        try {

            await consentStorage.acceptConsent();

            router.replace("/dashboard");

        } catch (error) {

            console.error(
                "Unable to save consent.",
                error
            );

        }

    };

    return (

        <main style={styles.container}>

            <div style={styles.card}>

                <div style={styles.header}>

                    <h1 style={styles.title}>
                        Welcome to CareVR
                    </h1>

                    <div style={styles.userBadge}>
                        👤 Hi, {userName}!
                    </div>

                </div>

                <p style={styles.tagline}>
                    Your Trusted Digital Health Companion
                </p>

                <p style={styles.motto}>
                    Your Health. Your Story. Your Control.
                </p>

                <p style={styles.introduction}>
                    Please review the following information before
                    continuing. These sections explain how CareVR
                    handles and protects your information, supports
                    your healthcare journey, and the responsibilities
                    associated with using the application.
                </p>

                <div style={styles.tabs}>

                    {[
                        ["privacy", "🔒 Privacy"],
                        ["family", "👨‍👩‍👧 Family"],
                        ["tracking", "🩺 Tracking"],
                        ["security", "🔐 Security"],
                        ["medical", "⚕️ Medical"],
                        ["legal", "⚖️ Legal & Data Protection"],
                        ["storage", "💾 Storage"],
                        ["retention", "🗄️ Retention"],
                    ].map(([key, label]) => (

                        <button
                            key={key}
                            type="button"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0px)";
                            }}
                            onClick={() =>
                                handleTabChange(key)
                            }
                            style={{
                                ...styles.tab,
                                ...(selectedTab === key
                                    ? styles.activeTab
                                    : {}),
                            }}
                        >
                            <>
                                {label}
                                {reviewedTabs.has(key) && " ✓"}
                            </>
                        </button>

                    ))}

                </div>

                <div style={styles.progressContainer}>

                    <span
                        style={{
                            ...styles.progressBadge,
                            ...(allSectionsReviewed
                                ? styles.progressBadgeComplete
                                : {}),
                        }}
                    >

                        {
                            allSectionsReviewed
                                ? `✅ All ${INFORMATION_SECTION_COUNT} Information Sections Reviewed`
                                : `📘 Reviewed ${reviewedTabs.size} of ${INFORMATION_SECTION_COUNT} Information Sections`
                        }

                    </span>

                </div>

                <div style={styles.contentCard}>

                    <h2 style={styles.contentTitle}>

                        {
                            tabContent[
                                selectedTab as keyof typeof tabContent
                            ].title
                        }

                    </h2>

                    <p style={styles.contentText}>

                        {
                            tabContent[
                                selectedTab as keyof typeof tabContent
                            ].content
                        }

                    </p>

                </div>

                <p
                    style={{
                        color:
                            allSectionsReviewed
                                ? "#15803d"
                                : "#dc2626",

                        fontWeight: 700,

                        marginBottom: "18px",
                    }}
                >

                    {
                        allSectionsReviewed
                            ? "✓ Thank you for reviewing all sections. Please complete all three confirmations before continuing."
                            : "Please review all 8 information sections before continuing."
                    }

                </p>

                <div style={styles.checkboxSection}>

                    {/* Confirmation 1: voluntary provision and data-processing consent */}
                    <label style={styles.checkboxLabel}>

                        <input
                            type="checkbox"
                            disabled={!allSectionsReviewed}
                            checked={readConfirmed}
                            onChange={(e) =>
                                setReadConfirmed(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            I confirm that the information I provide
                            to CareVR is provided voluntarily. Where I
                            provide information about another person,
                            I confirm that I have the appropriate
                            authority or permission to do so. I consent
                            to CareVR processing my personal and health
                            information for the purposes described above
                            and understand that I may withdraw my consent
                            as permitted by law.
                        </span>

                    </label>

                    {/* Confirmation 2: Terms of Use and Medical Disclaimer */}
                    <label style={styles.checkboxLabel}>

                        <input
                            type="checkbox"
                            disabled={!allSectionsReviewed}
                            checked={agreementAccepted}
                            onChange={(e) =>
                                setAgreementAccepted(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            I accept the CareVR Terms of Use and Medical
                            Disclaimer. I understand that CareVR helps
                            me organize and carry my health information
                            to my doctor, but does not provide medical
                            interpretation, diagnosis, treatment or
                            clinical advice.
                        </span>

                    </label>

                    {/* Confirmation 3: Privacy Policy acknowledgement */}
                    <label style={styles.checkboxLabel}>

                        <input
                            type="checkbox"
                            disabled={!allSectionsReviewed}
                            checked={privacyPolicyAcknowledged}
                            onChange={(e) =>
                                setPrivacyPolicyAcknowledged(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            I acknowledge that I have read and understood
                            the CareVR Privacy Policy, which explains how
                            my information is processed, my applicable
                            data-protection rights, how I may withdraw
                            consent, and how I may raise a grievance or
                            contact the designated CareVR contact.
                        </span>

                    </label>

                </div>

                <div style={styles.buttonContainer}>

                    <button
                        type="button"
                        onClick={handleAccept}
                        disabled={!canContinue}
                        style={{
                            ...styles.primaryButton,

                            opacity:
                                canContinue
                                    ? 1
                                    : 0.5,

                            cursor:
                                canContinue
                                    ? "pointer"
                                    : "not-allowed",
                        }}
                    >
                        Accept & Continue
                    </button>

                    <button
                        type="button"
                        onClick={handleDecline}
                        style={
                            styles.secondaryButton
                        }
                    >
                        Decline & Sign Out
                    </button>

                </div>

            </div>

        </main>

    );

}

const styles: Record<string, React.CSSProperties> = {

    container: {

        minHeight: "100vh",

        background: "#f8fafc",

        display: "flex",

        justifyContent: "center",

        alignItems: "flex-start",

        padding: "8px 20px 20px",

        fontFamily: "Inter, Arial, sans-serif",

    },

    card: {

        width: "100%",

        maxWidth: "950px",

        background: "#ffffff",

        borderRadius: "16px",

        padding: "28px",

        border: "1px solid #d1d5db",

        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",

    },

    header: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "flex-start",

        flexWrap: "wrap",

        gap: "20px",

    },

    userBadge: {

        background: "#eff6ff",

        color: "#2563eb",

        padding: "10px 16px",

        borderRadius: "999px",

        fontWeight: 600,

        border: "1px solid #bfdbfe",

        whiteSpace: "nowrap",

    },

    title: {

        marginTop: "0",

        marginBottom: "6px",

        fontSize: "28px",

    },

    tagline: {

        color: "#374151",

        fontWeight: 600,

        marginBottom: "6px",

        marginTop: "8px",

    },

    motto: {

        color: "#4b5563",

        fontWeight: 600,

        fontSize: "18px",

        marginBottom: "16px",

    },

    introduction: {

        lineHeight: 1.7,

        color: "#374151",

        marginBottom: "18px",

    },

tabs: {

    display: "grid",

    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

    gap: "12px",

    marginBottom: "26px",

    alignItems: "stretch",

},

tab: {

    width: "100%",

    padding: "10px 14px",

    borderRadius: "999px",

    border: "1px solid #2563eb",

    background: "#ffffff",

    color: "#2563eb",

    cursor: "pointer",

    fontWeight: 600,

    fontSize: "15px",

    transition:
        "all 0.20s ease",

},

    activeTab: {

        background: "#2563eb",

        color: "#ffffff",

        boxShadow:
            "0 6px 18px rgba(37,99,235,.30)",

    },

fullWidthTab: {

    gridColumn: "1 / -1",

},

    contentCard: {

        background: "#f8fafc",

        border: "1px solid #d1d5db",

        borderRadius: "12px",

        padding: "24px",

        marginTop: "8px",

        marginBottom: "20px",

        transition:
            "all .25s ease",

    },

    contentTitle: {

        margin: "0 0 10px 0",

        fontSize: "22px",

    },

    contentText: {

        lineHeight: 1.6,

        margin: 0,

        color: "#374151",

    },

    progressContainer: {

        marginBottom: "20px",

        color: "#374151",

        fontWeight: 600,

    },

    progressBadge: {

        display: "inline-flex",

        alignItems: "center",

        padding: "8px 16px",

        borderRadius: "999px",

        background: "#eff6ff",

        border: "1px solid #bfdbfe",

        color: "#1d4ed8",

        fontWeight: 600,

        fontSize: "15px",

    },

    progressBadgeComplete: {

        background: "#ecfdf5",

        border: "1px solid #86efac",

        color: "#15803d",

    },

    checkboxSection: {

        display: "flex",

        flexDirection: "column",

        gap: "18px",

        padding: "18px",

        background: "#fafafa",

        borderRadius: "12px",

        border: "1px solid #e5e7eb",

        marginBottom: "24px",

    },

    checkboxLabel: {

        display: "flex",

        gap: "12px",

        alignItems: "flex-start",

        lineHeight: 1.6,

        cursor: "pointer",

    },

    buttonContainer: {

        display: "flex",

        gap: "16px",

        marginTop: "10px",

    },

    primaryButton: {

        flex: 1,

        padding: "13px",

        border: "none",

        borderRadius: "10px",

        background: "#2563eb",

        color: "#ffffff",

        fontWeight: 700,

        fontSize: "16px",

    },

    secondaryButton: {

        flex: 1,

        padding: "13px",

        borderRadius: "10px",

        background: "#ffffff",

        color: "#2563eb",

        border: "1px solid #2563eb",

        fontWeight: 700,

        fontSize: "16px",

        cursor: "pointer",

    },

};
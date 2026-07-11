"use client";

import React, {
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

    // Temporary placeholder.
    // Later this will come from the authenticated profile.
    const userName = "Suraj";

    const tabContent = useMemo(() => ({

        privacy: {
            title: "🔒 Privacy",
            content:
                "Your health information belongs to you. CareVR helps you securely capture, organize and manage your health records. You remain in control of what information you choose to share."
        },

        family: {
            title: "👨‍👩‍👧 Family",
            content:
                "CareVR supports both individuals and caregivers by keeping health information organized in one secure place, making it easier to care for yourself and your loved ones."
        },

        tracking: {
            title: "🩺 Assisted Digital Health Tracking",
            content:
                "CareVR helps capture, organize and track your health information, making it easier to maintain accurate records and support healthcare consultations."
        },

        security: {
            title: "🔐 Security",
            content:
                "Secure authentication and privacy-focused design help protect your account and personal health information."
        },

        medical: {
            title: "⚕️ Medical Disclaimer",
            content:
                "CareVR assists with managing health information. It is not a substitute for professional medical advice, diagnosis, treatment or emergency medical care."
        }


    }), []);


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
    reviewedTabs.size === 5;

const canContinue =
    allSectionsReviewed &&
    readConfirmed &&
    agreementAccepted;

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

                    Please review the following information before continuing.
These sections explain how CareVR protects your
information and the responsibilities associated with
using the application.

                </p>

                <div style={styles.tabs}>

                    {[
                        ["privacy", "🔒 Privacy"],
                        ["family", "👨‍👩‍👧 Family"],
                        ["tracking", "🩺 Tracking"],
                        ["security", "🔐 Security"],
                        ["medical", "⚕️ Medical"],
                        ].map(([key, label]) => (

                        <button
onMouseEnter={(e)=>{

e.currentTarget.style.transform="translateY(-2px)";

}}

onMouseLeave={(e)=>{

e.currentTarget.style.transform="translateY(0px)";

}}
                            key={key}
                            type="button"
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

                ?

                "✅ All 5 Information Sections Reviewed"

                :

                `📘 Reviewed ${reviewedTabs.size} of 5 Information Sections`

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

            ?

            "✓ Thank you for reviewing all sections. Please proceed by agreeing to the CareVR Privacy Policy, Terms of Use and Medical Disclaimer."

            :

            "Please review all five information sections before continuing."

    }

</p>

                <div style={styles.checkboxSection}>

                    <label style={styles.checkboxLabel}>

                        <input
    type="checkbox"
disabled={
        !allSectionsReviewed
    }
                            checked={readConfirmed}
                            onChange={(e) =>
                                setReadConfirmed(
                                    e.target.checked
                                )
                            }
                        />

                        <span>

                            I have read and understood
                            the information above.

                        </span>

                    </label>



    
                    <label style={styles.checkboxLabel}>

                        <input
                            type="checkbox"
disabled={
        !allSectionsReviewed
    }



                            checked={
                                agreementAccepted
                            }
                            onChange={(e) =>
                                setAgreementAccepted(
                                    e.target.checked
                                )
                            }
                        />

                        <span>

                            I agree to the CareVR
                            Privacy Policy,
                            Terms of Use and
                            Medical Disclaimer.

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

    display: "flex",

    flexWrap: "wrap",

    gap: "16px",

    marginBottom: "26px",

    alignItems: "center",

},

tab: {

    padding: "10px 22px",

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

    background:"#2563eb",

    color:"#ffffff",

    boxShadow:
        "0 6px 18px rgba(37,99,235,.30)",

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
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearAssessmentData } from "@/lib/assessmentStorage";
import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";
import AppHeader from "@/app/components/AppHeader";

import LanguageSelector from "@/Components/language/LanguageSelector";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

type DashboardUser = {
    id: string;
    fullName: string;
    email: string;
};

export default function DashboardPage() {

    const router = useRouter();

const {
        t,
    } = useLanguage();

    const [user, setUser] =
        useState<DashboardUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const authUser =
                    await authService.getCurrentUser();

                if (!authUser) {

                    router.replace("/login");

                    return;

                }

                const profile =
                    await profileRepository.getCurrentProfile();

                if (!profile) {

                    await authService.logout();

                    router.replace("/login");

                    return;

                }

                setUser({

                    id: profile.id,

                    fullName: profile.fullName,

                    email: profile.email

                });

            } catch (error) {

                console.error(
                    "Unable to load dashboard.",
                    error
                );

                try {

                    await authService.logout();

                } catch {

                    // Ignore logout failure

                }

                router.replace("/login");

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, [router]);

    const logout = async () => {

        try {

            await authService.logout();

        } finally {

            router.replace("/login");

        }

    };

    const startSelfAssessment = () => {

        if (!user) {
            return;
        }

        clearAssessmentData();

        localStorage.setItem(
            "assessmentType",
            "self"
        );

        localStorage.setItem(
            "patientName",
            user.fullName
        );

        localStorage.setItem(
            "patientAge",
            ""
        );

        localStorage.setItem(
            "observerName",
            user.fullName
        );

        localStorage.setItem(
            "observerRelationship",
            "Self"
        );

        localStorage.setItem(
            "assessmentDate",
            new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            )
        );

        router.push("/self/page2");

    };

    const startFamilyAssessment = () => {

        router.push("/family");

    };

const openHelpCentre = () => {

    router.push("/help");

};

const openDailyCare = () => {

    router.push("/daily-care");

};

    if (loading) {

        return (

            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f8fafc",
                    fontFamily:
                        "Inter, Arial, sans-serif",
                }}
            >

                {t("dashboard.loading")}

            </main>

        );

    }

    if (!user) {
        return null;
    }

    return (

        <main
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                padding: "20px",
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >

            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid #d1d5db",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.05)",
                }}
            >

<AppHeader
    pageTitle={t("dashboard.title")}
    pageIcon="🏠"
    currentUserName={user.fullName}
/>

<div
    style={{
        marginTop: "20px",
        marginBottom: "24px",
        padding: "16px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
    }}
>
    <LanguageSelector />
</div>

<h3
    style={{
        marginTop: "20px",
        marginBottom: "16px",
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
    }}
>
    🌡 {t("dashboard.dailyCare")}
</h3>

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "20px",
    }}
>

    <button
        onClick={openDailyCare}
        style={actionButton}
    >
        ❤️
        <br />
        {t("dashboard.dailyCare")}
    </button>

    <button
        onClick={openHelpCentre}
        style={actionButton}
    >
        ❓
        <br />
        {t("dashboard.helpCentre")}
    </button>

</div>

<h3
    style={{
        marginBottom: "16px",
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
    }}
>
    🩺 {t("dashboard.assessmentSection")}
</h3>

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "30px",
    }}
>

    <button
        onClick={startFamilyAssessment}
        style={actionButton}
    >
        👨‍👩‍👧
        <br />
        {t("dashboard.familyAssessment")}
    </button>

    <button
        onClick={startSelfAssessment}
        style={actionButton}
    >
        🧍
        <br />
        {t("dashboard.selfAssessment")}
    </button>

</div>

<h3
    style={{
        marginTop: "8px",
        marginBottom: "16px",
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
    }}
>
    📁 {t("dashboard.patientManagement")}
</h3>

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "24px",
    }}
>

    <button
        onClick={() =>
            router.push("/add-patient")
        }
        style={actionButton}
    >
        ➕
        <br />
        {t("dashboard.addPatient")}
    </button>

    <button
        onClick={() =>
            router.push("/reports")
        }
        style={actionButton}
    >
        📄
        <br />
        {t("dashboard.reports")}
    </button>

</div>

                <button
                    onClick={logout}
                    style={logoutButton}
                >
                    🚪 Logout
                </button>

                <div
                    style={{
                        marginTop: "22px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6b7280",
                    }}
                >
                    {t("dashboard.createdBy")}
                </div>

            </div>

        </main>

    );

}

const actionButton: React.CSSProperties = {

    padding: "22px",

    background: "#ffffff",

    border: "1px solid #d1d5db",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "16px",

    minHeight: "110px",

    transition: "0.2s"

};

const logoutButton: React.CSSProperties = {

    width: "100%",

    padding: "14px",

    background: "#dc2626",

    color: "#ffffff",

    border: "none",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "16px",

    marginTop: "10px"

};
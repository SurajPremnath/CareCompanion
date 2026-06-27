"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearAssessmentData } from "@/lib/assessmentStorage";
import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";

type DashboardUser = {
    id: string;
    fullName: string;
    email: string;
};

export default function DashboardPage() {

    const router = useRouter();

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

                Loading Dashboard...

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

                <h1
                    style={{
                        fontSize: "42px",
                        marginBottom: "10px",
                    }}
                >
                    ❤️ CareCompanion
                </h1>

                <h2>

                    Welcome {user.fullName}

                </h2>

                <p
                    style={{
                        color: "#555",
                        marginBottom: "30px",
                    }}
                >
                    Choose an assessment option
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "16px",
                        marginBottom: "16px",
                    }}
                >

                    <button
                        onClick={
                            startFamilyAssessment
                        }
                        style={actionButton}
                    >
                        👨‍👩‍👧
                        <br />
                        Family Assessment
                    </button>

                    <button
                        onClick={
                            startSelfAssessment
                        }
                        style={actionButton}
                    >
                        🧍
                        <br />
                        Self Assessment
                    </button>

                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        marginBottom: "30px",
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
                        Add Patient
                    </button>

                    <button
                        onClick={() =>
                            router.push("/reports")
                        }
                        style={actionButton}
                    >
                        📄
                        <br />
                        Reports
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
                        marginTop: "30px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6b7280",
                    }}
                >
                    Created by Suraj Premnath
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
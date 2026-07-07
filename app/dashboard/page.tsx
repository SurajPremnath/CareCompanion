"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { clearAssessmentData } from "@/lib/assessmentStorage";
import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";
import AppHeader from "@/app/components/AppHeader";

import {
    analyticsService,
} from "@/lib/analytics/analyticsService";

import {
    ANALYTICS_MODULES,
    ANALYTICS_EVENTS,
    ANALYTICS_CONTEXTS,
} from "@/lib/analytics/analyticsEvents";

import LanguageSelector from "@/Components/language/LanguageSelector";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

import {
    authSessionService,
} from "@/lib/analytics/authSessionService";

import {
    performanceTracker,
} from "@/lib/performance/performanceTracker";

type DashboardUser = {
    id: string;
    fullName: string;
    email: string;
    role: string;
};

export default function DashboardPage() {

    const router = useRouter();

const dashboardLoadStartedRef =
    useRef(false);

const {
        t,
    } = useLanguage();

    const [user, setUser] =
        useState<DashboardUser | null>(null);

    const [loading, setLoading] =
        useState(true);

const [loggingOut, setLoggingOut] =
    useState(false);

useEffect(() => {

    if (dashboardLoadStartedRef.current) {
        return;
    }

    dashboardLoadStartedRef.current = true;

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

    email: profile.email,

    role: profile.role,
});

void analyticsService
    .track({

        module:
            ANALYTICS_MODULES.DASHBOARD,

        eventName:
            ANALYTICS_EVENTS.PAGE_VIEWED,

        pagePath:
            "/dashboard",

    })
    .catch(() => {
        // Analytics must not block dashboard rendering
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


useEffect(() => {

    if (
        loading ||
        !user
    ) {

        return;

    }

    void performanceTracker.complete({

        toPath:
            "/dashboard",

    });

}, [
    loading,
    user,
]);

const logout = async () => {

    if (loggingOut) {
        return;
    }

    setLoggingOut(true);

    try {

        await authSessionService.end();

    } catch (error) {

        console.error(
            "Unable to close analytics auth session.",
            error
        );

    }

    try {

        await authService.logout();

        router.replace("/login");

    } catch (error) {

        console.error(
            "Unable to complete logout.",
            error
        );

        setLoggingOut(false);

    }

};
const trackDashboardFeatureClick =
    async (
        feature:
            | "DAILY_CARE"
            | "HELP"
            | "FAMILY_ASSESSMENT"
            | "SELF_ASSESSMENT"
            | "ADD_PATIENT"
            | "REPORTS"
    ) => {

        await analyticsService.track({

            module:
                ANALYTICS_MODULES.DASHBOARD,

            eventName:
                ANALYTICS_EVENTS.FEATURE_CLICKED,

            pagePath:
                "/dashboard",

            metadata: {

                feature,

            },

        });

    };

    const startSelfAssessment = async () => {

        if (!user) {
            return;
        }

await trackDashboardFeatureClick(
    "SELF_ASSESSMENT"
);

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

await analyticsService.track({

    module:
        ANALYTICS_MODULES.ASSESSMENT,

    eventName:
        ANALYTICS_EVENTS.STARTED,

    context:
        ANALYTICS_CONTEXTS.SELF,

    pagePath:
        "/self/page2",

});

router.push("/self/page2");

    };

const startFamilyAssessment = async () => {

    await trackDashboardFeatureClick(
        "FAMILY_ASSESSMENT"
    );

    router.push("/family");

};

const openHelpCentre = async () => {

    await trackDashboardFeatureClick(
        "HELP"
    );

    router.push("/help");

};

const openDailyCare = async () => {

    await trackDashboardFeatureClick(
        "DAILY_CARE"
    );



    router.push("/daily-care");

};

const openAddPatient = async () => {

    await trackDashboardFeatureClick(
        "ADD_PATIENT"
    );

    router.push("/add-patient");

};


const openReports = async () => {

    await trackDashboardFeatureClick(
        "REPORTS"
    );

    router.push("/reports");

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
    🌡 {t("dashboard.dailyCareSection")}
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
        onClick={openAddPatient}
        style={actionButton}
    >
        ➕
        <br />
        {t("dashboard.addPatient")}
    </button>

    <button
        onClick={openReports}
        style={actionButton}
    >
        📄
        <br />
        {t("dashboard.reports")}
    </button>

</div>


{user.role === "ADMIN" && (

    <button
        type="button"
        onClick={() =>
            router.push(
                "/admin/performance"
            )
        }
        style={{
            width: "100%",
            padding: "16px",
            marginBottom: "14px",
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
        }}
    >
        📊 Performance Diagnostics
    </button>

)}


<button
    onClick={logout}
    disabled={loggingOut}
    style={{
        ...logoutButton,
        opacity:
            loggingOut
                ? 0.7
                : 1,
        cursor:
            loggingOut
                ? "not-allowed"
                : "pointer",
    }}
>
    {loggingOut
        ? "Logging out…"
        : `🚪 ${t("dashboard.logout")}`}
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
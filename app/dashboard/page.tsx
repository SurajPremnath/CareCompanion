"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    authService,
} from "@/lib/auth/authService";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import AppHeader from "@/app/components/AppHeader";

import LanguageSelector from "@/Components/language/LanguageSelector";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

import {
    analyticsService,
} from "@/lib/analytics/analyticsService";

import {
    ANALYTICS_MODULES,
    ANALYTICS_EVENTS,
} from "@/lib/analytics/analyticsEvents";

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


type HomeFeature =
    | "RECORD_HEALTH"
    | "VIEW_HEALTH"
    | "HELP";


export default function DashboardPage() {

    const router =
        useRouter();

    const dashboardLoadStartedRef =
        useRef(false);

    const {
        t,
    } = useLanguage();


    const [
        user,
        setUser,
    ] =
        useState<DashboardUser | null>(
            null
        );


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        loggingOut,
        setLoggingOut,
    ] =
        useState(false);


    //------------------------------------------------------------
    // Load User
    //------------------------------------------------------------

    useEffect(() => {

        if (
            dashboardLoadStartedRef.current
        ) {

            return;

        }

        dashboardLoadStartedRef.current =
            true;


        async function loadDashboard() {

            try {

                const authUser =
                    await authService
                        .getCurrentUser();


                if (!authUser) {

                    router.replace(
                        "/login"
                    );

                    return;

                }


                const profile =
                    await profileRepository
                        .getCurrentProfile();


                if (!profile) {

                    await authService.logout();

                    router.replace(
                        "/login"
                    );

                    return;

                }


                setUser({

                    id:
                        profile.id,

                    fullName:
                        profile.fullName,

                    email:
                        profile.email,

                    role:
                        profile.role,

                });


                void analyticsService
                    .track({

                        module:
                            ANALYTICS_MODULES
                                .DASHBOARD,

                        eventName:
                            ANALYTICS_EVENTS
                                .PAGE_VIEWED,

                        pagePath:
                            "/dashboard",

                    })
                    .catch(() => {

                        // Analytics must not block rendering

                    });

            }
            catch (error) {

                console.error(
                    "Unable to load home page.",
                    error
                );


                try {

                    await authService.logout();

                }
                catch {

                    // Ignore logout failure

                }


                router.replace(
                    "/login"
                );

            }
            finally {

                setLoading(false);

            }

        }


        void loadDashboard();

    }, [router]);


    //------------------------------------------------------------
    // Performance Completion
    //------------------------------------------------------------

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


    //------------------------------------------------------------
    // Analytics
    //------------------------------------------------------------

    const trackFeatureClick =
        (
            feature: HomeFeature
        ): void => {

            void analyticsService
                .track({

                    module:
                        ANALYTICS_MODULES
                            .DASHBOARD,

                    eventName:
                        ANALYTICS_EVENTS
                            .FEATURE_CLICKED,

                    pagePath:
                        "/dashboard",

                    metadata: {

                        feature,

                    },

                })
                .catch(() => {

                    // Analytics must not block navigation

                });

        };


    //------------------------------------------------------------
    // Navigation
    //------------------------------------------------------------

    const openRecordHealth = () => {

        trackFeatureClick(
            "RECORD_HEALTH"
        );


        performanceTracker.start({

            fromPath:
                "/dashboard",

            toPath:
                "/care",

            feature:
                "DASHBOARD_TO_CARE",

        });


        router.push(
            "/care"
        );

    };


    const openViewHealth = () => {

        trackFeatureClick(
            "VIEW_HEALTH"
        );


        performanceTracker.start({

            fromPath:
                "/dashboard",

            toPath:
                "/reports",

            feature:
                "DASHBOARD_TO_REPORTS",

        });


        router.push(
            "/reports"
        );

    };


    const openHelp = () => {

        trackFeatureClick(
            "HELP"
        );


        router.push(
            "/help"
        );

    };


    //------------------------------------------------------------
    // Logout
    //------------------------------------------------------------

    const logout = async () => {

        if (loggingOut) {

            return;

        }


        setLoggingOut(true);


        performanceTracker.start({

            fromPath:
                "/dashboard",

            toPath:
                "/login",

            feature:
                "LOGOUT_TO_LOGIN",

        });


        void authSessionService
            .end()
            .catch((error) => {

                console.error(
                    "Unable to close analytics auth session.",
                    error
                );

            });


        try {

            await authService.logout();


            router.replace(
                "/login"
            );

        }
        catch (error) {

            console.error(
                "Unable to complete logout.",
                error
            );


            performanceTracker.cancel();


            setLoggingOut(false);

        }

    };


    //------------------------------------------------------------
    // Loading
    //------------------------------------------------------------

    if (loading) {

        return (

            <main style={loadingContainer}>

                {t("dashboard.loading")}

            </main>

        );

    }


    if (!user) {

        return null;

    }


    //------------------------------------------------------------
    // UI
    //------------------------------------------------------------

    return (

        <main style={pageContainer}>

            <div style={pageCard}>

                <AppHeader
                    pageTitle={t("dashboard.home")}
                    pageIcon="🏠"
                    currentUserName={
                        user.fullName
                    }
                />


                <div style={languageBox}>

                    <LanguageSelector />

                </div>


                <section style={homeSection}>

                    <h2 style={questionTitle}>
                        {t("dashboard.whatWouldYouLikeToDo")}
                    </h2>


                    <div style={actionGrid}>

                        <button
                            type="button"
                            onClick={
                                openRecordHealth
                            }
                            style={actionButton}
                        >

                            <span style={actionIcon}>
                                ❤️
                            </span>

                            <span style={actionTitle}>
                                {t("dashboard.recordHealth")}
                            </span>

                            <span style={actionDescription}>
                                {t("dashboard.recordHealthDescription")}
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={
                                openViewHealth
                            }
                            style={actionButton}
                        >

                            <span style={actionIcon}>
                                📊
                            </span>

                            <span style={actionTitle}>
                                {t("dashboard.viewHealth")}
                            </span>

                            <span style={actionDescription}>
                                {t("dashboard.viewHealthDescription")}
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={
                                openHelp
                            }
                            style={actionButton}
                        >

                            <span style={actionIcon}>
                                ❓
                            </span>

                            <span style={actionTitle}>
                                {t("dashboard.helpAndFaqs")}
                            </span>

                            <span style={actionDescription}>
                                {t("dashboard.helpAndFaqsDescription")}
                            </span>

                        </button>

                    </div>

                </section>


                {user.role === "ADMIN" && (

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/performance"
                            )
                        }
                        style={adminButton}
                    >
                        📊 Performance Diagnostics
                    </button>

                )}


                <button
                    type="button"
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

                    {
                        loggingOut
                            ? "Logging out…"
                            : `🚪 ${t(
                                "dashboard.logout"
                            )}`
                    }

                </button>


                <div style={footerStyle}>

                    {t(
                        "dashboard.createdBy"
                    )}

                </div>

            </div>

        </main>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const pageContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        background:
            "#f8fafc",

        padding:
            "20px",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const pageCard:
    React.CSSProperties = {

        maxWidth:
            "900px",

        margin:
            "0 auto",

        background:
            "#ffffff",

        padding:
            "32px",

        borderRadius:
            "16px",

        border:
            "1px solid #d1d5db",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",

    };


const loadingContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        display:
            "flex",

        justifyContent:
            "center",

        alignItems:
            "center",

        background:
            "#f8fafc",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const languageBox:
    React.CSSProperties = {

        marginTop:
            "20px",

        marginBottom:
            "24px",

        padding:
            "16px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };


const homeSection:
    React.CSSProperties = {

        marginTop:
            "8px",

        marginBottom:
            "24px",

    };


const questionTitle:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "20px",

        fontSize:
            "24px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const actionGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap:
            "16px",

    };


const actionButton:
    React.CSSProperties = {

        minHeight:
            "180px",

        padding:
            "24px",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "10px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "14px",

        cursor:
            "pointer",

        textAlign:
            "center",

    };


const actionIcon:
    React.CSSProperties = {

        fontSize:
            "34px",

    };


const actionTitle:
    React.CSSProperties = {

        fontSize:
            "19px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const actionDescription:
    React.CSSProperties = {

        fontSize:
            "14px",

        lineHeight:
            1.5,

        color:
            "#6b7280",

    };


const adminButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "16px",

        marginBottom:
            "14px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const logoutButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "14px",

        background:
            "#dc2626",

        color:
            "#ffffff",

        border:
            "none",

        borderRadius:
            "10px",

        fontWeight:
            "bold",

        fontSize:
            "16px",

        marginTop:
            "10px",

    };


const footerStyle:
    React.CSSProperties = {

        marginTop:
            "22px",

        textAlign:
            "center",

        fontSize:
            "12px",

        color:
            "#6b7280",

    };
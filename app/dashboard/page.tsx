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


import HelpWorkspace from "@/app/components/dashboard/HelpWorkspace";

import ManualCareWorkspace
    from "@/Components/dashboard/ManualCareWorkspace";

import PersonSelector, {
    type PersonSelection,
} from "@/Components/patient/PersonSelector";

import ActionOptions, {
type ActionOption,
    type MedicationDetailOption,
} from "@/Components/dashboard/ActionOptions";

import PrescriptionWorkspace
    from "@/Components/dashboard/PrescriptionWorkspace";

import PrescriptionHistoryWorkspace
    from "@/Components/dashboard/PrescriptionHistoryWorkspace";

import ConsultationWorkspace
    from "@/Components/dashboard/ConsultationWorkspace";

import VoiceCareWorkspace
    from "@/Components/dashboard/VoiceCareWorkspace";

import UploadCareWorkspace
    from "@/Components/dashboard/UploadCareWorkspace";

import {
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

type DashboardUser = {

    id: string;

    fullName: string;

    email: string;

    role: string;

};


type HomeFeature =
    | "RECORD_HEALTH"
    | "MEDICATION_MANAGEMENT"
    | "ASSESSMENT"
    | "VIEW_HEALTH"
    | "HELP";


export default function DashboardPage() {

    const router =
        useRouter();

const SHOW_PERFORMANCE_DIAGNOSTICS =
    false;

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
    consentGranted,
    setConsentGranted,
] =
    useState(false);

    const [
        loggingOut,
        setLoggingOut,
    ] =
        useState(false);

const [
    selectedAction,
    setSelectedAction,
] =
    useState<HomeFeature | "">(
        ""
    );

const [
    medicationDetail,
    setMedicationDetail,
] =
    useState<MedicationDetailOption>(
        ""
    );

const [
    recordHealthOption,
    setRecordHealthOption,
] =
    useState<ActionOption>(
        ""
    );

const [
    medicationOption,
    setMedicationOption,
] =
    useState<ActionOption>(
        ""
    );

const [
    personSelection,
    setPersonSelection,
] =
    useState<PersonSelection>({

        mode: "SELF",

        patientId: null,

        patientName: null,

    });

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


const consentGranted =
    await consentStorage
        .hasAcceptedCurrentConsent();

setConsentGranted(
    consentGranted
);

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


const openMedicationManagement = () => {

    trackFeatureClick(
        "MEDICATION_MANAGEMENT"
    );


    performanceTracker.start({

        fromPath:
            "/dashboard",

        toPath:
            "/medications",

        feature:
            "DASHBOARD_TO_MEDICATIONS",

    });


    router.push(
        "/medications"
    );

};

//------------------------------------------------------------
// Start Assessment
//------------------------------------------------------------

const handleStartAssessment = () => {

    if (
        personSelection.mode === "SELF"
    ) {

        router.push(
            "/self/page2"
        );

        return;

    }


    if (
        personSelection.mode === "FAMILY" &&
        personSelection.patientId
    ) {

        router.push(
            "/family/page2"
        );

    }

};

const handleActionOption = (
    option: ActionOption
) => {

    if (
        selectedAction ===
        "RECORD_HEALTH"
    ) {

        setRecordHealthOption(
            option
        );

        return;

    }

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

const showPersonSelector =

    selectedAction === "RECORD_HEALTH" ||

    selectedAction === "MEDICATION_MANAGEMENT" ||

    selectedAction === "ASSESSMENT" ||

    selectedAction === "VIEW_HEALTH";


const isPersonSelectionComplete =

    personSelection.mode === "SELF" ||

    (
        personSelection.mode === "FAMILY" &&
        personSelection.patientId !== null
    );

    //------------------------------------------------------------
    // UI
    //------------------------------------------------------------

    return (

        <main style={pageContainer}>

            <div style={pageCard}>

<AppHeader
    pageTitle={t("dashboard.title")}
    pageIcon="🏠"
    currentUserName={user.fullName}
    compact
    helpLabel={t("dashboard.helpAndFaqs")}
    onHelpClick={openHelp}
/>

{!consentGranted && (

    <div
        style={{

            background: "#fef3c7",

            border: "1px solid #fcd34d",

            borderRadius: "12px",

            padding: "18px",

            marginTop: "18px",

            marginBottom: "18px",

        }}
    >

        <h3
            style={{
                marginTop: 0,
            }}
        >
            ⚠ Consent Required
        </h3>

        <p>

            Before using CareVR, please review and
            accept the Privacy Policy, Terms of Use
            and Medical Disclaimer.

        </p>

        <button
            type="button"
            onClick={() =>
                router.push("/consent")
            }
            style={{

                background: "#2563eb",

                color: "#fff",

                border: "none",

                borderRadius: "8px",

                padding: "10px 18px",

                cursor: "pointer",

            }}
        >

            Review & Accept

        </button>

<p
    style={{
        marginTop: "16px",
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "6px",
    }}
>
    🔒 Health features will be unlocked after you review and accept the CareVR consent.
</p>

    </div>

)}

                <div style={languageBox}>

                    <LanguageSelector />

                </div>


<section style={homeSection}>

    <div style={personSelectorWrapper}>

        <PersonSelector
            value={
                personSelection
            }
disabled={!consentGranted}
onChange={(selection) => {
if (!consentGranted) {

            return;

        }
    setPersonSelection(
        selection
    );

    setSelectedAction(
        ""
    );

    setRecordHealthOption(
        ""
    );

}}
            question={t("medication.whoIsThisFor")}
        />

    </div>

{isPersonSelectionComplete && (

    <div style={mainActionWrapper}>

    <h2 style={questionTitle}>
        {t("dashboard.whatWouldYouLikeToDo")}
    </h2>

<div
    className="main-action-grid"
    style={mainActionGrid}
>

<button
    type="button"
disabled={!consentGranted}
    onClick={() => {

        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "RECORD_HEALTH"
        );

        setRecordHealthOption(
            ""
        );

    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

<span
    style={{
        ...mainActionCircle,

        ...(selectedAction ===
        "RECORD_HEALTH"
            ? selectedActionCircle
            : {}),
    }}
>
    ❤️
</span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "RECORD_HEALTH"
            ? selectedActionLabel
            : {}),
    }}
>
    {t("dashboard.recordHealth")}
</span>

    </button>


<button
    type="button"
disabled={!consentGranted}
    onClick={() => {
        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "MEDICATION_MANAGEMENT"
        );

        setRecordHealthOption(
            ""
        );

    setMedicationDetail(
        ""
    );

    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

        <span
            style={{
                ...mainActionCircle,

                ...(selectedAction ===
                "MEDICATION_MANAGEMENT"
                    ? selectedActionCircle
                    : {}),
            }}
        >
            💊
        </span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "MEDICATION_MANAGEMENT"
            ? selectedActionLabel
            : {}),
    }}
>
{t("dashboard.medicationManagement")}    
</span>

    </button>


<button
    type="button"
disabled={!consentGranted}
    onClick={() => {
        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "ASSESSMENT"
        );

        setRecordHealthOption(
            ""
        );

    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

        <span
            style={{
                ...mainActionCircle,

                ...(selectedAction ===
                "ASSESSMENT"
                    ? selectedActionCircle
                    : {}),
            }}
        >
            🩺
        </span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "ASSESSMENT"
            ? selectedActionLabel
            : {}),
    }}
>
{t("dashboard.healthCheckAssessment")}    
</span>

    </button>


<button
    type="button"
disabled={!consentGranted}
    onClick={() => {
        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "VIEW_HEALTH"
        );

        setRecordHealthOption(
            ""
        );

    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

        <span
            style={{
                ...mainActionCircle,

                ...(selectedAction ===
                "VIEW_HEALTH"
                    ? selectedActionCircle
                    : {}),
            }}
        >
            📊
        </span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "VIEW_HEALTH"
            ? selectedActionLabel
            : {}),
    }}
>
{t("dashboard.healthHistory")}
</span>

    </button>

</div>

    </div>

)}


{isPersonSelectionComplete &&
    selectedAction !== "" &&
    selectedAction !== "HELP" && (

    <div style={actionOptionsWrapper}>

<ActionOptions
    selectedAction={
        selectedAction
    }
    onStartAssessment={
        handleStartAssessment
    }
onOptionChange={
    handleActionOption
}
    onMedicationDetailChange={
        setMedicationDetail
    }
selectedMedicationDetail={
    medicationDetail
}
/>
    </div>

)}

{selectedAction === "RECORD_HEALTH" &&
    recordHealthOption === "VOICE" && (

    <div style={workspaceContainer}>

        <VoiceCareWorkspace
            mode={
                personSelection.mode === "SELF"
                    ? "self"
                    : "family"
            }
            patientId={
                personSelection.patientId ??
                undefined
            }
            currentUserName={
                user.fullName
            }
        />

    </div>

)}

{selectedAction === "RECORD_HEALTH" &&
    recordHealthOption === "MANUAL" && (

    <div style={workspaceContainer}>

        <ManualCareWorkspace
            mode={
                personSelection.mode === "SELF"
                    ? "self"
                    : "family"
            }
            patientId={
                personSelection.patientId ??
                undefined
            }
            currentUserName={
                user.fullName
            }
        />

    </div>

)}

{selectedAction === "RECORD_HEALTH" &&
    recordHealthOption === "UPLOAD" && (

    <div style={workspaceContainer}>

        <UploadCareWorkspace
            mode={
                personSelection.mode === "SELF"
                    ? "self"
                    : "family"
            }
            patientId={
                personSelection.patientId ??
                undefined
            }
            currentUserName={
                user.fullName
            }
        />

    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    (
        medicationDetail === "TAKE_PHOTO" ||
        medicationDetail === "CHOOSE_PHOTOS" ||
        medicationDetail === "UPLOAD_PDF"
    ) && (

    <PrescriptionWorkspace
    method={
        medicationDetail
    }

    userId={
        user.id
    }

    recordContext={
    personSelection.mode === "FAMILY"
        ? "FAMILY"
        : "SELF"
}

    patientId={
        personSelection.patientId
    }

patientName={
    personSelection.mode === "SELF"
        ? user.fullName
        : personSelection.patientName ?? ""
}


    familyId={
        null
    }

onCancelReview={() => {

    setMedicationDetail(
        ""
    );

}}

/>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    medicationDetail === "VIEW_PRESCRIPTIONS" && (

    <div style={workspaceContainer}>

        <PrescriptionHistoryWorkspace
            userId={user.id}
            recordContext={
                personSelection.mode === "FAMILY"
                    ? "FAMILY"
                    : "SELF"
            }
            patientId={personSelection.patientId}
            patientName={
                personSelection.mode === "SELF"
                    ? user.fullName
                    : personSelection.patientName ?? ""
            }
        />

    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    (
        medicationDetail === "IN_PERSON" ||
        medicationDetail === "VIDEO" ||
        medicationDetail === "PHONE" ||
        medicationDetail === "HOME_VISIT" ||
        medicationDetail === "OTHER"
    ) && (

    <ConsultationWorkspace
        mode={
            medicationDetail
        }
    />

)}

{selectedAction === "HELP" && (

    <div style={workspaceContainer}>

        <HelpWorkspace />

    </div>

)}




                </section>


                {user.role === "ADMIN" && 
		 SHOW_PERFORMANCE_DIAGNOSTICS && (
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

<style jsx>{`
    @media (max-width: 640px) {

        .main-action-grid {
            grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;

            gap: 18px 12px !important;

            padding: 18px 12px !important;
        }

    }
`}</style>

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
    "12px",

marginBottom:
    "20px",

padding:
    "14px 16px",

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
            "16px",

        fontSize:
            "16px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const actionSelect:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "16px",

        marginBottom:
            "24px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "17px",

        fontWeight:
            600,

        cursor:
            "pointer",

        boxSizing:
            "border-box",

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

const workspaceContainer:
    React.CSSProperties = {

        marginTop:
            "8px",

        padding:
            "24px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };


const workspaceTitle:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "8px",

        fontSize:
            "22px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const workspaceText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#6b7280",

        lineHeight:
            1.6,

    };

const personSelectorWrapper:
    React.CSSProperties = {


width:
            "100%",

        marginTop:
            "24px",


    };

const mainActionWrapper:
    React.CSSProperties = {

        marginTop:
            "24px",

    };

const actionOptionsWrapper:
    React.CSSProperties = {

        marginTop:
            "20px",

        padding:
            "20px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };

const mainActionGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",

        gap:
            "16px",

        width:
            "100%",

        padding:
            "20px 24px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

        boxSizing:
            "border-box",

    };


const mainActionButton:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "flex-start",

        gap:
            "8px",

        padding:
            "8px 4px",

        background:
            "transparent",

        border:
            "none",

        cursor:
            "pointer",

        fontFamily:
            "inherit",

    };


const mainActionCircle:
    React.CSSProperties = {

        width:
            "58px",

        height:
            "58px",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "50%",

        fontSize:
            "25px",

        boxSizing:
            "border-box",

    };


const selectedActionCircle:
    React.CSSProperties = {

        background:
            "#dbeafe",

        border:
            "3px solid #2563eb",

        boxShadow:
            "0 0 0 4px rgba(37, 99, 235, 0.12)",

    };


const mainActionLabel:
    React.CSSProperties = {

        fontSize:
            "14px",

        fontWeight:
            700,

        lineHeight:
            1.3,

        textAlign:
            "center",

color:
    "#374151",

        maxWidth:
            "130px",

    };

const selectedActionLabel:
    React.CSSProperties = {

        color:
            "#1d4ed8",

        fontWeight:
            800,

    };
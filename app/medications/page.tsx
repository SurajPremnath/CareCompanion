"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import AppHeader from "@/app/components/AppHeader";

import {
    authService,
} from "@/lib/auth/authService";


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";


export default function MedicationManagementPage() {

const {
    t,
} = useLanguage();

    const router =
        useRouter();


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        currentUserName,
        setCurrentUserName,
    ] =
        useState("");


    //------------------------------------------------------------
    // Authentication
    //------------------------------------------------------------

    useEffect(() => {

        async function loadUser() {

            try {

                const user =
                    await authService
                        .getCurrentUser();


                if (!user) {

                    router.replace(
                        "/login"
                    );

                    return;

                }


                setCurrentUserName(

                    user.user_metadata
                        ?.full_name ??

                    user.email ??

                    "User"

                );

            }
            catch {

                router.replace(
                    "/login"
                );

                return;

            }
            finally {

                setLoading(false);

            }

        }


        void loadUser();

    }, [router]);


    //------------------------------------------------------------
    // Navigation
    //------------------------------------------------------------

    function openAddPrescription() {

        router.push(
            "/medications/prescription"
        );

    }


    function openConsultationMode() {

        router.push(
            "/medications/consultation-mode"
        );

    }


    //------------------------------------------------------------
    // Loading
    //------------------------------------------------------------

    if (loading) {

        return (

            <main style={loadingContainer}>

                <h2>
                    {t("addPatient.loading")}
                </h2>

            </main>

        );

    }


    //------------------------------------------------------------
    // Page
    //------------------------------------------------------------

    return (

        <main style={pageContainer}>

            <div style={pageCard}>

                <AppHeader
                    pageTitle={t("medication.title")}
                    pageIcon="💊"
                    currentUserName={
                        currentUserName
                    }
                />


                <section style={contentSection}>

                    <h2 style={questionTitle}>
                        {t("medication.whatWouldYouLikeToDo")}
                    </h2>


                    <div style={actionGrid}>

                        <button
                            type="button"
                            onClick={
                                openAddPrescription
                            }
                            style={actionButton}
                        >

                            <span style={actionIcon}>
                                📄
                            </span>

                            <span style={actionTitle}>
                                {t("medication.addPrescription")}
                            </span>

                            <span style={actionDescription}>
                                Add a new doctor&apos;s prescription
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={
                                openConsultationMode
                            }
                            style={actionButton}
                        >

                            <span style={actionIcon}>
                                🩺
                            </span>

                            <span style={actionTitle}>
                                {t("medication.modeOfConsultation")}
                            </span>

                            <span style={actionDescription}>
                                {t("medication.howWasConsultationConducted")}
                            </span>

                        </button>

                    </div>

                </section>


                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/care"
                        )
                    }
                    style={backButton}
                >
                    ← Back to Record Health
                </button>

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


const contentSection:
    React.CSSProperties = {

        marginTop:
            "24px",

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
            "repeat(auto-fit, minmax(240px, 1fr))",

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
            "36px",

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


const backButton:
    React.CSSProperties = {

        width:
            "100%",

        marginTop:
            "24px",

        padding:
            "15px",

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
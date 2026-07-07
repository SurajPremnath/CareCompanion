"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";
import { selfProfileStorage } from "@/lib/storage/SelfProfileStorage";
import { AppAlert } from "@/lib/utils/appAlert";

import DailyCareForm from "./components/DailyCareForm";

import AppHeader from "@/app/components/AppHeader";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

import {
  ANALYTICS_MODULES,
  ANALYTICS_EVENTS,
  ANALYTICS_CONTEXTS,
} from "@/lib/analytics/analyticsEvents";

import {
  performanceTracker,
} from "@/lib/performance/performanceTracker";

export default function DailyCarePage() {

  const router = useRouter();

const {
    t,
  } = useLanguage();

  //------------------------------------------------------------
  // Page State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [currentUserName, setCurrentUserName] =
    useState("");

const [careMode, setCareMode] =
  useState<"self" | "family" | null>(null);

//------------------------------------------------------------
// Self Daily Care
//------------------------------------------------------------

const handleSelfCare = async () => {

  try {

    const profileExists =
      await selfProfileStorage.profileExists();

    if (!profileExists) {

      router.push("/self-profile");

      return;

    }

setCareMode("self");

  }
  catch {

    AppAlert.error(
      "Unable to load your Personal Health Profile."
    );

  }

};

//------------------------------------------------------------
// Family Daily Care
//------------------------------------------------------------

const handleFamilyCare = async () => {

setCareMode("family");

await analyticsService.track({

  module:
    ANALYTICS_MODULES.DAILY_CARE,

  eventName:
    ANALYTICS_EVENTS.STARTED,

  context:
    ANALYTICS_CONTEXTS.FAMILY,

  pagePath:
    "/daily-care",

});

setCareMode("family");

};

//------------------------------------------------------------
// Back To Dashboard
//------------------------------------------------------------

const handleBackToDashboard = () => {

  performanceTracker.start({

    fromPath:
      "/daily-care",

    toPath:
      "/dashboard",

    feature:
      "DAILY_CARE_TO_DASHBOARD",

  });

  router.push(
    "/dashboard"
  );

};

  //------------------------------------------------------------
  // Authentication
  //------------------------------------------------------------

  useEffect(() => {

    const loadUser = async () => {

      try {

        const user =
          await authService.getCurrentUser();

        if (!user) {

          router.replace("/login");

          return;

        }

        setCurrentUserName(

          user.user_metadata?.full_name ??

          user.email ??

          "User"

        );

      }
      catch {

        router.replace("/login");

        return;

      }
      finally {

        setLoading(false);

      }

    };

    loadUser();

  }, [router]);

  //------------------------------------------------------------
  // Loading Screen
  //------------------------------------------------------------

  if (loading) {

    return (

      <main style={loadingContainer}>

        <h2>

          Loading...

        </h2>

      </main>

    );

  }

  //------------------------------------------------------------
  // Page
  //------------------------------------------------------------

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >

<AppHeader
  pageTitle={t("dailyCare.title")}
  pageIcon="🩺"
  currentUserName={currentUserName}
/>

{careMode === null ? (

  <div
    style={{
      marginTop: "32px",
    }}
  >

    <h2
      style={{
        marginBottom: "12px",
      }}
    >
      {t("dailyCare.recordingFor")}
    </h2>

    <p
      style={{
        color: "#6b7280",
        marginBottom: "28px",
      }}
    >
      {t("dailyCare.chooseOneOption")}
    </p>

    <button
      style={primaryButton}
      onClick={handleSelfCare}
    >
      👤 {t("dailyCare.myself")}
    </button>

    <button
      style={secondaryButton}
      onClick={handleFamilyCare}
    >
      👨‍👩‍👧 {t("dailyCare.familyMember")}
    </button>

<button
  onClick={handleBackToDashboard}
  style={backButton}
>
  ← {t("dailyCare.backToDashboard")}
</button>

  </div>

) : (

  <DailyCareForm
  mode={careMode}
  currentUserName={currentUserName}
/>

)}

      </div>

    </main>

  );

}

const loadingContainer: React.CSSProperties = {

  minHeight: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  background: "#f8fafc",

  fontFamily: "Inter, Arial, sans-serif",

};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "16px",
  marginTop: "20px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "16px",
  marginTop: "12px",
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const backButton: React.CSSProperties = {

  width: "100%",

  padding: "16px",

  marginTop: "24px",

  background: "#ffffff",

  color: "#111827",

  border: "1px solid #d1d5db",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: "bold",

  cursor: "pointer",

};
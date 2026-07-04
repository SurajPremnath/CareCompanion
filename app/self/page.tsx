"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  clearAssessmentData,
} from "@/lib/assessmentStorage";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

import {
  ANALYTICS_MODULES,
  ANALYTICS_EVENTS,
  ANALYTICS_CONTEXTS,
} from "@/lib/analytics/analyticsEvents";

export default function SelfPage() {
  const router = useRouter();

const {
  t,
} = useLanguage();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const startAssessment = async () => {
    if (!name || !age) {
      alert(t("assessment.alertNameAndAge"));
      return;
    }

    clearAssessmentData();

await analyticsService.track({

  module:
    ANALYTICS_MODULES.ASSESSMENT,

  eventName:
    ANALYTICS_EVENTS.STARTED,

  context:
    ANALYTICS_CONTEXTS.SELF,

  pagePath:
    "/self",

});


    localStorage.setItem("patientName", name);
    localStorage.setItem("patientAge", age);
    localStorage.setItem("assessmentType", "self");

    router.push("/self/page2");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* ONLY APP NAME */}

<AppHeader
  pageTitle={t("assessment.selfAssessment")}
  pageIcon="👤"
/>

        {/* FORM CARD */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            {t("assessment.assessmentDetails")}
          </h2>

          <label>{t("assessment.yourName")}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("assessment.enterYourName")}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <label>{t("assessment.yourAge")}</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={t("assessment.enterYourAge")}
            type="number"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
            }}
          />

          <button
            onClick={startAssessment}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            {t("assessment.startAssessment")} →
          </button>
        </div>
      </div>
    </main>
  );
}
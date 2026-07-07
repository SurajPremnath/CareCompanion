"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

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

export default function FamilyPage2() {
  const router = useRouter();

 const {
    t,
  } = useLanguage();

  const [breathing, setBreathing] = useState("");
  const [cough, setCough] = useState("");
  const [bloodInCough, setBloodInCough] = useState("");

  const optionStyle = (selected: boolean) => ({
    width: "100%",
    padding: "10px 14px",
    marginBottom: "8px",
    borderRadius: "10px",
    border: selected ? "2px solid #2563eb" : "1px solid #d1d5db",
    backgroundColor: selected ? "#eff6ff" : "white",
    cursor: "pointer",
    textAlign: "left" as const,
    fontSize: "15px",
  });

  const handleNext = () => {
    if (!breathing || !cough) {
  alert(
    t("assessment.alertAllQuestions")
  );

  return;
}

if (
  cough !== "no" &&
  !bloodInCough
) {
  alert(
    t("assessment.alertBloodInCough")
  );

  return;
}

    localStorage.setItem("breathing", breathing);
    localStorage.setItem("cough", cough);
    localStorage.setItem("bloodInCough", bloodInCough);

void analyticsService
  .track({

    module:
      ANALYTICS_MODULES.ASSESSMENT,

    eventName:
      ANALYTICS_EVENTS.PAGE_REACHED,

    context:
      ANALYTICS_CONTEXTS.FAMILY,

    pagePath:
      "/family/page3",

    metadata: {
      page: 3,
    },

  })
  .catch(() => {
    // Analytics must not block assessment navigation
  });

router.push(
  "/family/page3"
);
  };

  return (
    <AssessmentLayout currentPage={2} assessmentType="family">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          padding: "20px",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>
           {t(
            "assessment.healthCheckToday"
          )}
        </h2>

        <hr />

        <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
          🫁 {t(
            "assessment.breathingToday"
          )}
        </h3>

        <button style={optionStyle(breathing === "normal")} onClick={() => setBreathing("normal")}>
          😊 {t(
            "assessment.breathingNormal"
          )}
        </button>

        <button style={optionStyle(breathing === "slightly")} onClick={() => setBreathing("slightly")}>
          😐 {t(
            "assessment.breathingSlightlyDifficult"
          )}
        </button>

        <button style={optionStyle(breathing === "difficult")} onClick={() => setBreathing("difficult")}>
          😟 {t(
            "assessment.breathingVeryDifficult"
          )}
        </button>

        <div style={{ height: "12px" }} />

        <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
          🤧 {t(
            "assessment.coughingToday"
          )}
        </h3>

        <button style={optionStyle(cough === "no")} onClick={() => setCough("no")}>
          😊 {t("common.no")}
        </button>

        <button style={optionStyle(cough === "sometimes")} onClick={() => setCough("sometimes")}>
          😐 {t(
            "assessment.coughSometimes"
          )}
        </button>

        <button style={optionStyle(cough === "frequent")} onClick={() => setCough("frequent")}>
          😟 {t(
            "assessment.coughFrequently"
          )}
        </button>

        {cough !== "no" && cough !== "" && (
          <>
            <div style={{ height: "12px" }} />

            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
              🩸 {t(
                  "assessment.bloodWhileCoughing"
                )}
            </h3>

            <button style={optionStyle(bloodInCough === "no")} onClick={() => setBloodInCough("no")}>
              😊 {t("common.no")}
            </button>

            <button style={optionStyle(bloodInCough === "yes")} onClick={() => setBloodInCough("yes")}>
              😟 {t("common.yes")}
            </button>
          </>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
          <button
            onClick={() => router.push("/family")}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#e5e7eb",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← {t(
              "assessment.previous"
            )}
          </button>

          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {t("assessment.next")} →
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}
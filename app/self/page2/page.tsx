"use client";
import { clearAssessmentData } from "@/lib/assessmentStorage";
import { useState, useEffect } from "react";
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

import {
  performanceTracker,
} from "@/lib/performance/performanceTracker";

export default function SelfPage2() {
  const router = useRouter();

const {
  t,
} = useLanguage();

  const [fever, setFever] = useState("");
  const [temperatureChecked, setTemperatureChecked] = useState("");
  const [temperatureReading, setTemperatureReading] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("F");
  const [energy, setEnergy] = useState("");

  useEffect(() => {
    setFever(localStorage.getItem("fever") || "");
    setTemperatureChecked(localStorage.getItem("temperatureChecked") || "");
    setTemperatureReading(localStorage.getItem("temperatureReading") || "");
    setTemperatureUnit(localStorage.getItem("temperatureUnit") || "F");
    setEnergy(localStorage.getItem("energy") || "");
  }, []);

//------------------------------------------------------------
// Back To Dashboard
//------------------------------------------------------------

const handleBackToDashboard = () => {

  performanceTracker.start({

    fromPath:
      "/self/page2",

    toPath:
      "/dashboard",

    feature:
      "SELF_ASSESSMENT_TO_DASHBOARD",

    context:
      "SELF",

  });

  router.push(
    "/dashboard"
  );

};

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

  const handleNext = async () => {
    if (!fever) {
      alert(t("assessment.alertFever"));
      return;
    }

    if (fever === "yes" && !temperatureChecked) {
      alert(t("assessment.alertTemperatureTaken"));
      return;
    }

    if (
      fever === "yes" &&
      temperatureChecked === "yes" &&
      !temperatureReading
    ) {
      alert(t("assessment.alertTemperatureReading"));
      return;
    }

    if (!energy) {
      alert(t("assessment.alertEnergy"));
      return;
    }

    localStorage.setItem("fever", fever);
    localStorage.setItem("temperatureChecked", temperatureChecked);
    localStorage.setItem("temperatureReading", temperatureReading);
    localStorage.setItem("temperatureUnit", temperatureUnit);
    localStorage.setItem("energy", energy);


await analyticsService.track({

  module:
    ANALYTICS_MODULES.ASSESSMENT,

  eventName:
    ANALYTICS_EVENTS.PAGE_REACHED,

  context:
    ANALYTICS_CONTEXTS.SELF,

  pagePath:
    "/self/page3",

  metadata: {
    page: 3,
  },

});

    router.push("/self/page3");
  };

  return (
    <AssessmentLayout currentPage={2} assessmentType="self">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          padding: "18px",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
          {t("assessment.healthCheckToday")}
        </h2>

        <hr />

        <h3>🤒 {t("assessment.feelFeverish")}</h3>

        <button
          style={optionStyle(fever === "no")}
          onClick={() => {
            setFever("no");
            setTemperatureChecked("");
            setTemperatureReading("");
          }}
        >
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(fever === "yes")}
          onClick={() => setFever("yes")}
        >
          😟 {t("common.yes")}
        </button>

        {fever === "yes" && (
          <>
            <h3>🌡 {t("assessment.temperatureTaken")}</h3>

            <button
              style={optionStyle(temperatureChecked === "yes")}
              onClick={() => setTemperatureChecked("yes")}
            >
              😊 {t("common.yes")}
            </button>

            <button
              style={optionStyle(temperatureChecked === "no")}
              onClick={() => {
                setTemperatureChecked("no");
                setTemperatureReading("");
              }}
            >
              😐 {t("common.no")}
            </button>

            {temperatureChecked === "yes" && (
              <>
                <label>{t("assessment.latestTemperature")}</label>

                <input
                  type="number"
                  step="0.1"
                  value={temperatureReading}
                  onChange={(e) => setTemperatureReading(e.target.value)}
                  placeholder={t("assessment.temperaturePlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                  }}
                />

                <select
                  value={temperatureUnit}
                  onChange={(e) => setTemperatureUnit(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="F">°F</option>
                  <option value="C">°C</option>
                </select>
              </>
            )}
          </>
        )}

        <h3>⚡ {t("assessment.energyToday")}</h3>

        {fever !== "yes" && (
          <button
            style={optionStyle(energy === "good")}
            onClick={() => setEnergy("good")}
          >
            😊 {t("assessment.good")}
          </button>
        )}

        <button
          style={optionStyle(energy === "tired")}
          onClick={() => setEnergy("tired")}
        >
          😐 {t("assessment.tired")}
        </button>

        <button
          style={optionStyle(energy === "veryTired")}
          onClick={() => setEnergy("veryTired")}
        >
          😟 {t("assessment.veryTired")}
        </button>

        <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
  onClick={handleBackToDashboard}
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
    ← {t("assessment.previous")}
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
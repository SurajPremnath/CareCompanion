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

export default function FamilyPage4() {
  const router = useRouter();
  const { t } = useLanguage();

  const [appetite, setAppetite] =
    useState("");

  const [water, setWater] =
    useState("");

  const [
    waterGlasses,
    setWaterGlasses,
  ] = useState("");

  const optionStyle = (
    selected: boolean
  ) => ({
    width: "100%",
    padding: "10px 14px",
    marginBottom: "8px",
    borderRadius: "10px",
    border: selected
      ? "2px solid #2563eb"
      : "1px solid #d1d5db",
    backgroundColor: selected
      ? "#eff6ff"
      : "white",
    cursor: "pointer",
    textAlign: "left" as const,
    fontSize: "15px",
  });

  const handleNext = () => {
    if (!appetite || !water) {
      alert(
        t("assessment.alertAllQuestions")
      );
      return;
    }

    if (
      water === "yes" &&
      !waterGlasses
    ) {
      alert(
        t("assessment.alertWaterIntake")
      );
      return;
    }

    localStorage.setItem(
      "appetite",
      appetite
    );

    localStorage.setItem(
      "water",
      water
    );

    localStorage.setItem(
      "waterGlasses",
      waterGlasses
    );

void analyticsService
  .track({

    module:
      ANALYTICS_MODULES.ASSESSMENT,

    eventName:
      ANALYTICS_EVENTS.PAGE_REACHED,

    context:
      ANALYTICS_CONTEXTS.FAMILY,

    pagePath:
      "/family/page5",

    metadata: {
      page: 5,
    },

  })
  .catch(() => {
    // Analytics must not block assessment navigation
  });

router.push(
  "/family/page5"
);
  };

  return (
    <AssessmentLayout currentPage={4} assessmentType="family">      
     <div
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          padding: "20px",
          border: "1px solid #ddd",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "12px",
          }}
        >
          {t("assessment.healthCheckToday")}
        </h2>

        <hr />

        <h3
          style={{
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          🍽️ {t(
  "assessment.patientEatingToday"
)}
        </h3>

        <button
          style={optionStyle(
            appetite === "normal"
          )}
          onClick={() =>
            setAppetite("normal")
          }
        >
          😊 {t("assessment.appetiteNormal")}
        </button>

        <button
          style={optionStyle(
            appetite === "less"
          )}
          onClick={() =>
            setAppetite("less")
          }
        >
          😐 {t("assessment.appetiteLess")}
        </button>

        <button
          style={optionStyle(
            appetite === "hardly"
          )}
          onClick={() =>
            setAppetite("hardly")
          }
        >
          😟 {t("assessment.appetitePoor")}
        </button>

        <div
          style={{
            height: "12px",
          }}
        />

        <h3
          style={{
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          💧 {t(
  "assessment.patientDrinkingEnoughWater"
)}
        </h3>

        <button
          style={optionStyle(
            water === "yes"
          )}
          onClick={() => {
            setWater("yes");
          }}
        >
          😊 {t("common.yes")}
        </button>

        <button
          style={optionStyle(
            water === "notsure"
          )}
          onClick={() => {
            setWater("notsure");
            setWaterGlasses("");
          }}
        >
          😐 {t("assessment.notSure")}
        </button>

        <button
          style={optionStyle(
            water === "no"
          )}
          onClick={() => {
            setWater("no");
            setWaterGlasses("");
          }}
        >
          😟 {t("common.no")}
        </button>

        {water === "yes" && (
          <>
            <div
              style={{
                height: "12px",
              }}
            />

            <h3
              style={{
                fontSize: "18px",
                marginBottom: "6px",
              }}
            >
              🥤 {t("assessment.waterIntake")}
            </h3>

            <button
              style={optionStyle(
                waterGlasses === "1"
              )}
              onClick={() =>
                setWaterGlasses("1")
              }
            >
              1
            </button>

            <button
              style={optionStyle(
                waterGlasses === "2"
              )}
              onClick={() =>
                setWaterGlasses("2")
              }
            >
              2
            </button>

            <button
              style={optionStyle(
                waterGlasses === "3"
              )}
              onClick={() =>
                setWaterGlasses("3")
              }
            >
              3
            </button>

            <button
              style={optionStyle(
                waterGlasses === "4"
              )}
              onClick={() =>
                setWaterGlasses("4")
              }
            >
              4
            </button>

            <button
              style={optionStyle(
                waterGlasses === "5+"
              )}
              onClick={() =>
                setWaterGlasses("5+")
              }
            >
              5+
            </button>
          </>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              router.push(
                "/family/page3"
              )
            }
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor:
                "#e5e7eb",
              border: "none",
              borderRadius:
                "10px",
              fontSize: "18px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            ← {t("assessment.previous")}
          </button>

          <button
            onClick={
              handleNext
            }
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor:
                "#2563eb",
              color: "white",
              border: "none",
              borderRadius:
                "10px",
              fontSize: "18px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            {t("assessment.next")} →
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}

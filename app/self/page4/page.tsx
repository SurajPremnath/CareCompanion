"use client";

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

export default function Page4() {
  const router = useRouter();

const {
  t,
} = useLanguage();

  const [discomfort, setDiscomfort] = useState("");

const discomfortAreaOptions = [
  { value: "Head", labelKey: "assessment.areaHead" },
  { value: "Eyes", labelKey: "assessment.areaEyes" },
  { value: "Ears", labelKey: "assessment.areaEars" },
  { value: "Neck", labelKey: "assessment.areaNeck" },
  { value: "Chest", labelKey: "assessment.areaChest" },
  { value: "Back", labelKey: "assessment.areaBack" },
  { value: "Stomach", labelKey: "assessment.areaStomach" },
  { value: "Arms / Hands", labelKey: "assessment.areaArmsHands" },
  { value: "Legs / Feet", labelKey: "assessment.areaLegsFeet" },
  { value: "Joints", labelKey: "assessment.areaJoints" },
  { value: "Other", labelKey: "assessment.areaOther" },
];

  const [discomfortAreas, setDiscomfortAreas] = useState<string[]>([]);
  const [otherDiscomfort, setOtherDiscomfort] = useState("");

  useEffect(() => {
    setDiscomfort(localStorage.getItem("discomfort") || "");

    setDiscomfortAreas(
      JSON.parse(localStorage.getItem("discomfortAreas") || "[]")
    );

    setOtherDiscomfort(localStorage.getItem("otherDiscomfort") || "");
  }, []);

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

  const toggleArea = (area: string) => {
    if (discomfortAreas.includes(area)) {
      setDiscomfortAreas(discomfortAreas.filter((i) => i !== area));
    } else {
      setDiscomfortAreas([...discomfortAreas, area]);
    }
  };

  const handleNext = async () => {
    if (!discomfort) {
      alert(t("assessment.alertQuestion"));
      return;
    }

    if (discomfort === "yes" && discomfortAreas.length === 0) {
      alert(t("assessment.alertDiscomfortAreas"));
      return;
    }

    if (discomfortAreas.includes("Other") && !otherDiscomfort.trim()) {
      alert(t("assessment.alertSpecifyDiscomfort"));
      return;
    }

    localStorage.setItem("discomfort", discomfort);
    localStorage.setItem("discomfortAreas", JSON.stringify(discomfortAreas));
    localStorage.setItem("otherDiscomfort", otherDiscomfort);

await analyticsService.track({

  module:
    ANALYTICS_MODULES.ASSESSMENT,

  eventName:
    ANALYTICS_EVENTS.PAGE_REACHED,

  context:
    ANALYTICS_CONTEXTS.SELF,

  pagePath:
    "/self/page5",

  metadata: {
    page: 5,
  },

});

    router.push("/self/page5");
  };

  return (
    <AssessmentLayout currentPage={4} assessmentType="self">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          padding: "18px",
          border: "1px solid #ddd",
        }}
      >
        <h2>{t("assessment.healthCheckToday")}</h2>

        <hr />

        <h3>🤕 {t("assessment.discomfortToday")}</h3>

        <button
          style={optionStyle(discomfort === "no")}
          onClick={() => {
            setDiscomfort("no");
            setDiscomfortAreas([]);
            setOtherDiscomfort("");
          }}
        >
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(discomfort === "yes")}
          onClick={() => setDiscomfort("yes")}
        >
          😟 {t("common.yes")}
        </button>

        {discomfort === "yes" && (
          <>
<h3>📍 {t("assessment.discomfortWhere")}</h3>

{discomfortAreaOptions.map((area) => (
  <label
    key={area.value}
    style={{
      display: "block",
      marginBottom: "10px",
    }}
  >
    <input
      type="checkbox"
      checked={discomfortAreas.includes(area.value)}
      onChange={() => toggleArea(area.value)}
    />
    {" "}
    {t(area.labelKey)}
  </label>
))}

            {discomfortAreas.includes("Other") && (
              <input
                value={otherDiscomfort}
                onChange={(e) => setOtherDiscomfort(e.target.value)}
                placeholder={t("assessment.describeDiscomfort")}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "10px",
                }}
              />
            )}
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
    onClick={() => router.push("/self/page3")}
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
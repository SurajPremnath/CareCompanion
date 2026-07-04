"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

export default function Page3() {
  const router = useRouter();

const {
  t,
} = useLanguage();

  const [appetite, setAppetite] = useState("");
  const [water, setWater] = useState("");
  const [waterGlasses, setWaterGlasses] = useState("");

  useEffect(() => {
    setAppetite(localStorage.getItem("appetite") || "");
    setWater(localStorage.getItem("water") || "");
    setWaterGlasses(localStorage.getItem("waterGlasses") || "");
  }, []);

  const optionStyle = (selected: boolean) => ({
    width: "100%",
    padding: "10px 14px",
    marginBottom: "6px",
    borderRadius: "10px",
    border: selected ? "2px solid #2563eb" : "1px solid #d1d5db",
    backgroundColor: selected ? "#eff6ff" : "white",
    cursor: "pointer",
    textAlign: "left" as const,
    fontSize: "15px",
  });

  const handleNext = () => {
    if (!appetite || !water) {
      alert(t("assessment.alertAllQuestions"));
      return;
    }

    if (water === "yes" && !waterGlasses) {
      alert(t("assessment.alertWaterIntake"));
      return;
    }

    localStorage.setItem("appetite", appetite);
    localStorage.setItem("water", water);
    localStorage.setItem("waterGlasses", waterGlasses);

    router.push("/self/page4");
  };

  return (
    <AssessmentLayout currentPage={3} assessmentType="self">
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

        <h3>🍽 {t("assessment.appetiteToday")}</h3>

        <button
          style={optionStyle(appetite === "normal")}
          onClick={() => setAppetite("normal")}
        >
          😊 {t("assessment.appetiteNormal")}
        </button>

        <button
          style={optionStyle(appetite === "less")}
          onClick={() => setAppetite("less")}
        >
          😐 {t("assessment.appetiteLess")}
        </button>

        <button
          style={optionStyle(appetite === "poor")}
          onClick={() => setAppetite("poor")}
        >
          😟 {t("assessment.appetitePoor")}
        </button>

        <h3>💧 {t("assessment.drinkingEnoughWater")}</h3>

        <button
          style={optionStyle(water === "yes")}
          onClick={() => setWater("yes")}
        >
          😊 {t("common.yes")}
        </button>

        <button
          style={optionStyle(water === "notsure")}
          onClick={() => {
            setWater("notsure");
            setWaterGlasses("");
          }}
        >
          😐 {t("assessment.notSure")}
        </button>

        <button
          style={optionStyle(water === "no")}
          onClick={() => {
            setWater("no");
            setWaterGlasses("");
          }}
        >
          😟 {t("common.no")}
        </button>

        {water === "yes" && (
          <>
            <h3>🥛 {t("assessment.waterIntake")}</h3>

{["1", "2", "3", "4", "5+", "Not Sure"].map((glass) => (
  <button
    key={glass}
    style={optionStyle(waterGlasses === glass)}
    onClick={() => setWaterGlasses(glass)}
  >
    {glass === "Not Sure"
      ? t("assessment.notSure")
      : glass}
  </button>
))}
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
    onClick={() => router.push("/self/page2")}
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
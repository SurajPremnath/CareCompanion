"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

export default function Page5() {
  const router = useRouter();

const {
  t,
} = useLanguage();

  const [walking, setWalking] = useState("");
  const [walkingHelp, setWalkingHelp] = useState("");
  const [looseMotions, setLooseMotions] = useState("");
  const [looseMotionType, setLooseMotionType] = useState("");

  useEffect(() => {
    setWalking(localStorage.getItem("walking") || "");
    setWalkingHelp(localStorage.getItem("walkingHelp") || "");
    setLooseMotions(localStorage.getItem("looseMotions") || "");
    setLooseMotionType(localStorage.getItem("looseMotionType") || "");
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

  const showWalkingHelp =
    walking === "some" || walking === "difficult";

  const showLooseMotionType = looseMotions === "yes";

  const handleFinish = () => {
    if (!walking || !looseMotions) {
      alert(t("assessment.alertAllQuestions"));
      return;
    }

    if (showWalkingHelp && !walkingHelp) {
      alert(t("assessment.alertWalkingHelp"));
      return;
    }

    if (showLooseMotionType && !looseMotionType) {
      alert(t("assessment.alertLooseMotionType"));
      return;
    }

    localStorage.setItem("walking", walking);
    localStorage.setItem("walkingHelp", walkingHelp);
    localStorage.setItem("looseMotions", looseMotions);
    localStorage.setItem("looseMotionType", looseMotionType);

    router.push("/report");
  };

  return (
    <AssessmentLayout currentPage={5} assessmentType="self">
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

        <h3>🚶 {t("assessment.walkingToday")}</h3>

        <button
          style={optionStyle(walking === "easy")}
          onClick={() => {
            setWalking("easy");
            setWalkingHelp("");
          }}
        >
          😊 {t("assessment.walkingEasily")}
        </button>

        <button
          style={optionStyle(walking === "some")}
          onClick={() => setWalking("some")}
        >
          😐 {t("assessment.walkingSomeDifficulty")}
        </button>

        <button
          style={optionStyle(walking === "difficult")}
          onClick={() => setWalking("difficult")}
        >
          😟 {t("assessment.walkingVeryDifficult")}
        </button>

        {showWalkingHelp && (
          <>
            <h3>🧍 {t("assessment.needHelpWalking")}</h3>

            <button
              style={optionStyle(walkingHelp === "no")}
              onClick={() => setWalkingHelp("no")}
            >
              😊 {t("common.no")}
            </button>

            <button
              style={optionStyle(walkingHelp === "yes")}
              onClick={() => setWalkingHelp("yes")}
            >
              😟 {t("common.yes")}
            </button>
          </>
        )}

        <h3>🚽 {t("assessment.looseMotionsToday")}</h3>

        <button
          style={optionStyle(looseMotions === "no")}
          onClick={() => {
            setLooseMotions("no");
            setLooseMotionType("");
          }}
        >
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(looseMotions === "yes")}
          onClick={() => setLooseMotions("yes")}
        >
          😟 {t("common.yes")}
        </button>

        {showLooseMotionType && (
          <>
            <h3>{t("assessment.looseMotionType")}</h3>

            <button
              style={optionStyle(looseMotionType === "watery")}
              onClick={() => setLooseMotionType("watery")}
            >
              💧 {t("assessment.looseMotionWatery")}
            </button>

            <button
              style={optionStyle(looseMotionType === "sticky")}
              onClick={() => setLooseMotionType("sticky")}
            >
              😐 {t("assessment.looseMotionSticky")}
            </button>

            <button
              style={optionStyle(looseMotionType === "notsure")}
              onClick={() => setLooseMotionType("notsure")}
            >
              🤔 {t("assessment.notSure")}
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
    onClick={() => router.push("/self/page4")}
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
            onClick={handleFinish}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              flex: 1,
            }}
          >
            {t("assessment.finishAssessment")} ✓
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}
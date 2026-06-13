"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

export default function Page5() {
  const router = useRouter();

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
      alert("Please answer all questions.");
      return;
    }

    if (showWalkingHelp && !walkingHelp) {
      alert("Please answer walking help.");
      return;
    }

    if (showLooseMotionType && !looseMotionType) {
      alert("Please select loose motion type.");
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
        <h2>Health Check For Today</h2>

        <hr />

        <h3>🚶 Are you able to walk today?</h3>

        <button
          style={optionStyle(walking === "easy")}
          onClick={() => {
            setWalking("easy");
            setWalkingHelp("");
          }}
        >
          😊 Easily
        </button>

        <button
          style={optionStyle(walking === "some")}
          onClick={() => setWalking("some")}
        >
          😐 Some Difficulty
        </button>

        <button
          style={optionStyle(walking === "difficult")}
          onClick={() => setWalking("difficult")}
        >
          😟 Very Difficult
        </button>

        {showWalkingHelp && (
          <>
            <h3>🧍 Need help walking?</h3>

            <button
              style={optionStyle(walkingHelp === "no")}
              onClick={() => setWalkingHelp("no")}
            >
              😊 No
            </button>

            <button
              style={optionStyle(walkingHelp === "yes")}
              onClick={() => setWalkingHelp("yes")}
            >
              😟 Yes
            </button>
          </>
        )}

        <h3>🚽 Loose motions today?</h3>

        <button
          style={optionStyle(looseMotions === "no")}
          onClick={() => {
            setLooseMotions("no");
            setLooseMotionType("");
          }}
        >
          😊 No
        </button>

        <button
          style={optionStyle(looseMotions === "yes")}
          onClick={() => setLooseMotions("yes")}
        >
          😟 Yes
        </button>

        {showLooseMotionType && (
          <>
            <h3>Type?</h3>

            <button
              style={optionStyle(looseMotionType === "watery")}
              onClick={() => setLooseMotionType("watery")}
            >
              💧 Watery
            </button>

            <button
              style={optionStyle(looseMotionType === "sticky")}
              onClick={() => setLooseMotionType("sticky")}
            >
              😐 Sticky
            </button>

            <button
              style={optionStyle(looseMotionType === "notsure")}
              onClick={() => setLooseMotionType("notsure")}
            >
              🤔 Not Sure
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
    onClick={() => router.push("/self")}
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
    ← Previous
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
            Finish Assessment ✓
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}
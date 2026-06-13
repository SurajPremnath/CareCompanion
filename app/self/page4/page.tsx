"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

export default function Page4() {
  const router = useRouter();

  const [discomfort, setDiscomfort] = useState("");
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

  const handleNext = () => {
    if (!discomfort) {
      alert("Please answer the question.");
      return;
    }

    if (discomfort === "yes" && discomfortAreas.length === 0) {
      alert("Please select discomfort areas.");
      return;
    }

    if (discomfortAreas.includes("Other") && !otherDiscomfort.trim()) {
      alert("Please specify discomfort.");
      return;
    }

    localStorage.setItem("discomfort", discomfort);
    localStorage.setItem("discomfortAreas", JSON.stringify(discomfortAreas));
    localStorage.setItem("otherDiscomfort", otherDiscomfort);

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
        <h2>Health Check For Today</h2>

        <hr />

        <h3>🤕 Did you feel any discomfort today?</h3>

        <button
          style={optionStyle(discomfort === "no")}
          onClick={() => {
            setDiscomfort("no");
            setDiscomfortAreas([]);
            setOtherDiscomfort("");
          }}
        >
          😊 No
        </button>

        <button
          style={optionStyle(discomfort === "yes")}
          onClick={() => setDiscomfort("yes")}
        >
          😟 Yes
        </button>

        {discomfort === "yes" && (
          <>
            <h3>📍 Where did you feel discomfort?</h3>

            {[
              "Head",
              "Eyes",
              "Ears",
              "Neck",
              "Chest",
              "Back",
              "Stomach",
              "Arms / Hands",
              "Legs / Feet",
              "Joints",
              "Other",
            ].map((area) => (
              <label
                key={area}
                style={{ display: "block", marginBottom: "10px" }}
              >
                <input
                  type="checkbox"
                  checked={discomfortAreas.includes(area)}
                  onChange={() => toggleArea(area)}
                />
                {" "}{area}
              </label>
            ))}

            {discomfortAreas.includes("Other") && (
              <input
                value={otherDiscomfort}
                onChange={(e) => setOtherDiscomfort(e.target.value)}
                placeholder="Describe discomfort"
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
    Next →
  </button>
</div>
      </div>
    </AssessmentLayout>
  );
}
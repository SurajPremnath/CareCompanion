"use client";

import { useEffect, useState } from "react";

export default function Header({
  assessmentType,
}: {
  assessmentType: "self" | "family";
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [time, setTime] = useState("");

  // 🔥 FIX: refresh on every route change
  useEffect(() => {
    const update = () => {
      setName(localStorage.getItem("patientName") || "");
      setAge(localStorage.getItem("patientAge") || "");

      setTime(
        new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();

    // update again when page changes (important fix)
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      
      {/* APP NAME ALWAYS FIXED */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "6px",
        }}
      >
        ❤️ CareCompanion
      </h1>

      <p
        style={{
          fontSize: "13px",
          color: "#555",
          marginBottom: "6px",
        }}
      >
        A simple daily health companion for your family
      </p>

      {/* FIXED LABEL */}
      <p
        style={{
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "6px",
        }}
      >
        {assessmentType === "self"
          ? "Self Assessment"
          : "Family Assessment"}
      </p>

      {/* ONLY TIME (NO NAME/AGE IN HEADER NOW IF YOU WANT CLEAN UI) */}
      <p
        style={{
          fontSize: "12px",
          color: "#666",
        }}
      >
        🕒 {time}
      </p>
    </div>
  );
}
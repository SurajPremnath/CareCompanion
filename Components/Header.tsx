"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [time, setTime] = useState("");
  const [assessmentType, setAssessmentType] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");
    setAge(localStorage.getItem("patientAge") || "");

    setAssessmentType(
      localStorage.getItem("assessmentType") || ""
    );

    setTime(
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
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

      <p
        style={{
          fontSize: "12px",
          color: "#666",
        }}
      >
        👤 {name} | 🎂 {age} | 🕒 {time}
      </p>
    </div>
  );
}
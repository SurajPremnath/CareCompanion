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
    fontSize: "42px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "12px",
    lineHeight: 1.2,
  }}
>
  ❤️ CareVR
</h1>

<p
  style={{
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: 1.6,
    marginBottom: "18px",
    whiteSpace: "pre-line",
  }}
>
  Simple daily care.
  {"\n"}
  Better clinical conversations.
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
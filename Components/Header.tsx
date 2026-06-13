"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  currentPage?: number;
};

export default function Header({ currentPage = 0 }: HeaderProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");
    setAge(localStorage.getItem("patientAge") || "");

    const savedDate = localStorage.getItem("assessmentDate");

    if (savedDate) {
      setDate(savedDate);
    } else {
      setDate(
        new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    }
  }, []);

  const progress = currentPage > 0 ? (currentPage / 5) * 100 : 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* BRANDING */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "4px",
        }}
      >
        ❤️ CareCompanion
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#374151",
          marginBottom: "10px",
        }}
      >
        A simple daily health companion for your family
      </p>

      {/* USER INFO */}
      {name && (
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          👤 {name} &nbsp;|&nbsp; 🎂 {age} &nbsp;|&nbsp; 📅 {date}
        </div>
      )}

      {/* PROGRESS BAR */}
      {currentPage > 0 && (
        <>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#2563eb",
              }}
            />
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#666",
              marginBottom: "10px",
            }}
          >
            Page {currentPage} of 5
          </div>
        </>
      )}

      {/* COMPLIANCE FOOTER (INSIDE HEADER SYSTEM) */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#6b7280",
          marginTop: "10px",
          lineHeight: "1.4",
        }}
      >
        ⚠ Wellness tracking only — not medical advice
        <br />
        © 2026 Suraj Premnath • v1.0.1
      </div>
    </div>
  );
}
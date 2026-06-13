"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  currentPage?: number;
};

export default function Header({ currentPage = 0 }: HeaderProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");
    setAge(localStorage.getItem("patientAge") || "");

    const savedDate = localStorage.getItem("assessmentDate");

    const now = new Date();

    const formatted =
      savedDate
        ? `${savedDate} • ${now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : now.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

    setDateTime(formatted);
  }, []);

  const progress = currentPage > 0 ? (currentPage / 5) * 100 : 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* APP TITLE */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "6px",
        }}
      >
        ❤️ CareCompanion
      </h1>

      {/* TAGLINE */}
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
      {(name || age || dateTime) && (
        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          👤 {name || "—"} &nbsp;|&nbsp; 🎂 {age || "—"} &nbsp;|&nbsp; 📅{" "}
          {dateTime || "—"}
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
              fontSize: "12px",
              color: "#666",
              marginBottom: "10px",
            }}
          >
            Page {currentPage} of 5
          </div>
        </>
      )}

      {/* DISCLAIMER (NEW - REQUIRED) */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#6b7280",
          marginTop: "10px",
          lineHeight: "1.4",
          padding: "0 10px",
        }}
      >
        ⚠ CareCompanion is a wellness tracking tool and is not intended to
        provide medical advice, diagnosis, or treatment. Always consult a
        qualified healthcare professional for medical concerns.
      </div>

      {/* FOOTER IDENTITY */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#9ca3af",
          marginTop: "8px",
        }}
      >
        © 2026 Suraj Premnath • v1.0.1
      </div>
    </div>
  );
}
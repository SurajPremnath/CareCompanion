"use client";

import { useEffect, useState } from "react";

type Props = {
  currentPage: number;
  children: React.ReactNode;
};

export default function AssessmentLayout({
  currentPage,
  children,
}: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");
    setAge(localStorage.getItem("patientAge") || "");
    setDate(localStorage.getItem("assessmentDate") || "");
  }, []);

  const progress = (currentPage / 5) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "15px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* BRAND HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "4px",
              color: "#111827",
            }}
          >
            ❤️ CareCompanion
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#374151",
              marginBottom: "10px",
            }}
          >
            A simple daily health companion for your family
          </p>

          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "12px",
            }}
          >
            👤 {name || "—"} {"  |  "}
            🎂 {age || "—"} {"  |  "}
            📅 {date || "—"}
          </div>

          {/* PROGRESS BAR */}
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#e5e7eb",
              borderRadius: "999px",
              overflow: "hidden",
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
              marginTop: "6px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            Page {currentPage} of 5
          </div>
        </div>

        {/* PAGE CONTENT */}
        {children}

        {/* DISCLAIMER (GLOBAL - FINAL FIX) */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "12px",
            borderTop: "1px solid #e5e7eb",
            fontSize: "11px",
            color: "#6b7280",
            lineHeight: "1.4",
          }}
        >
          ⚠ CareCompanion is a wellness tracking tool and is not intended to
          provide medical advice, diagnosis, or treatment. Please consult a
          qualified healthcare professional for medical concerns.
          <br />
          <br />
          📊 Data may be stored locally or in secure systems to track health
          trends within your family.
        </div>

        {/* FOOTER BRANDING */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "11px",
            color: "#9ca3af",
          }}
        >
          © 2026 Suraj Premnath • CareCompanion v1.0.1
        </div>
      </div>
    </main>
  );
}
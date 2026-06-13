"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");

    const now = new Date();

    setDateTime(
      now.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700" }}>
            ❤️ CareCompanion
          </h1>

          <p style={{ fontSize: "14px", color: "#374151" }}>
            A simple daily health companion for the people you love.
          </p>

          <p style={{ marginTop: "8px" }}>
            Let&apos;s spend one minute checking your health.
          </p>

          <div style={{ marginTop: "10px", fontSize: "13px", color: "#555" }}>
            📅 {dateTime || "—"}
          </div>
        </div>

        {/* BRAND IDENTITY (NEW CHANGE YOU ASKED FOR) */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "20px",
            marginTop: "18px",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Created by Suraj Premnath
        </h2>

        {/* CARD */}
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid #ddd",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            Who is completing today&apos;s health check?
          </h3>

          <button
            onClick={() => router.push("/self")}
            style={{
              width: "100%",
              padding: "18px",
              marginBottom: "12px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              textAlign: "left",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            👤 <b>Myself</b>
            <div style={{ fontSize: "13px", color: "#666" }}>
              Answer questions about how I feel today.
            </div>
          </button>

          <button
            onClick={() => router.push("/family")}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              textAlign: "left",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            👨‍👩‍👧‍👦 <b>Family Member</b>
            <div style={{ fontSize: "13px", color: "#666" }}>
              Answer questions based on what I observed today.
            </div>
          </button>
        </div>

        {/* DISCLAIMER */}
        <div
          style={{
            marginTop: "25px",
            fontSize: "11px",
            color: "#6b7280",
            textAlign: "center",
            lineHeight: "1.4",
          }}
        >
          ⚠ CareCompanion is a wellness tracking tool and is not intended to
          provide medical advice, diagnosis, or treatment. Always consult a
          qualified healthcare professional for medical concerns.
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#9ca3af",
            marginTop: "10px",
          }}
        >
          © 2026 Suraj Premnath • v1.0.1
        </div>
      </div>
    </main>
  );
}
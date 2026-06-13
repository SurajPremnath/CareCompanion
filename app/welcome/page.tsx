"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function WelcomePage() {
  const router = useRouter();

  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");
  }, []);

  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Header />

        {/* BRANDING BLOCK */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "15px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "5px",
            }}
          >
            ❤️ CareCompanion
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            A simple daily health companion for your family
          </p>

          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            Created by Suraj Premnath • v1.0.1
          </p>
        </div>

        {/* GREETING */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "26px",
            marginBottom: "15px",
            fontWeight: "700",
          }}
        >
          {greeting} {name} 👋
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: "#374151",
            marginBottom: "30px",
          }}
        >
          Let's spend one minute checking how you're feeling today.
        </p>

        <h3
          style={{
            textAlign: "center",
            fontSize: "20px",
            marginBottom: "25px",
            fontWeight: "600",
          }}
        >
          Who is completing today's health check?
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <button
            onClick={() => router.push("/self")}
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "18px",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            👤 Myself

            <div
              style={{
                marginTop: "6px",
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Answer questions about how I feel today.
            </div>
          </button>

          <button
            onClick={() => router.push("/family")}
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "18px",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            👨‍👩‍👧‍👦 Family Member

            <div
              style={{
                marginTop: "6px",
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
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
            lineHeight: "1.4",
            textAlign: "center",
          }}
        >
          ⚠ CareCompanion is a wellness tracking tool and is not intended to
          provide medical advice, diagnosis, or treatment. Please consult a
          qualified healthcare professional for medical concerns.
        </div>
      </div>
    </main>
  );
}
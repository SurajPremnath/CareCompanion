"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function WelcomePage() {
  const router = useRouter();

  const [name, setName] = useState("");

  useEffect(() => {
    setName(
      localStorage.getItem("patientName") || ""
    );
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
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Header />

        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            marginBottom: "15px",
          }}
        >
          {greeting} {name} 👋
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          Let's spend one minute checking how
          you're feeling today.
        </p>

        <h3
          style={{
            textAlign: "center",
            fontSize: "22px",
            marginBottom: "25px",
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
            onClick={() =>
              router.push("/self")
            }
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "18px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <strong>👤 Myself</strong>

            <div
              style={{
                marginTop: "6px",
                color: "#666",
              }}
            >
              Answer questions about how I feel
              today.
            </div>
          </button>

          <button
            onClick={() =>
              router.push("/family")
            }
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "18px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <strong>
              👨‍👩‍👧‍👦 Family Member
            </strong>

            <div
              style={{
                marginTop: "6px",
                color: "#666",
              }}
            >
              Answer questions based on what I
              observed today.
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";


export default function SelfPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const startAssessment = () => {
    if (!name || !age) {
      alert("Please enter name and age");
      return;
    }

    localStorage.clear();
    localStorage.setItem("patientName", name);
    localStorage.setItem("patientAge", age);
    localStorage.setItem("assessmentType", "self");

    router.push("/self/page2");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* ONLY APP NAME */}

<AppHeader
  pageTitle="Self Assessment"
  pageIcon="👤"
/>

        {/* FORM CARD */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Assessment Details
          </h2>

          <label>Your Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <label>Your Age</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            type="number"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
            }}
          />

          <button
            onClick={startAssessment}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            Start Assessment →
          </button>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelfPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const startAssessment = () => {
    if (!name || !age) {
      alert("Please enter name and age");
      return;
    }

    // ✅ RESET OLD SESSION (important fix you requested earlier)
    localStorage.clear();

    // Save fresh patient data
    localStorage.setItem("patientName", name);
    localStorage.setItem("patientAge", age);
    localStorage.setItem("assessmentType", "self");

    // Initialize empty assessment state (prevents stale values)
    localStorage.setItem("breathing", "");
    localStorage.setItem("cough", "");
    localStorage.setItem("bloodInCough", "");
    localStorage.setItem("energy", "");
    localStorage.setItem("water", "");
    localStorage.setItem("appetite", "");
    localStorage.setItem("pain", "");
    localStorage.setItem("walking", "");

    // ✅ CORRECT ROUTE (FIXED)
    router.push("/self/page2");
  };

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
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Self Assessment Details
        </h2>

        {/* NAME */}
        <label style={{ fontSize: "14px", fontWeight: 600 }}>
          Your Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {/* AGE */}
        <label style={{ fontSize: "14px", fontWeight: 600 }}>
          Your Age
        </label>
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
          type="number"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {/* START BUTTON */}
        <button
          onClick={startAssessment}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Start Assessment →
        </button>
      </div>
    </main>
  );
}
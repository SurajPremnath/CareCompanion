"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  currentPage?: number;
};

export default function Header({
  currentPage = 0,
}: HeaderProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("patientName") || "");
    setAge(localStorage.getItem("patientAge") || "");

    const savedDate =
      localStorage.getItem("assessmentDate");

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

  const progress =
    currentPage > 0
      ? (currentPage / 5) * 100
      : 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "30px",
          marginBottom: "10px",
        }}
      >
        ❤️ CareCompanion
      </h1>

      {name && (
        <div
          style={{
            textAlign: "center",
            fontSize: "15px",
            color: "#555",
            marginBottom: "12px",
          }}
        >
          👤 {name}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          🎂 {age}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          📅 {date}
        </div>
      )}

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
              fontSize: "14px",
              color: "#666",
            }}
          >
            Page {currentPage} of 5
          </div>
        </>
      )}
    </div>
  );
}

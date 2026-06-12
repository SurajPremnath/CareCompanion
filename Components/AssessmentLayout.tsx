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
  const [name, setName] =
    useState("");

  const [age, setAge] =
    useState("");

  const [date, setDate] =
    useState("");

  useEffect(() => {
    setName(
      localStorage.getItem(
        "patientName"
      ) || ""
    );

    setAge(
      localStorage.getItem(
        "patientAge"
      ) || ""
    );

    setDate(
      localStorage.getItem(
        "assessmentDate"
      ) || ""
    );
  }, []);

  const progress =
    (currentPage / 5) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#f8fafc",
        padding: "15px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "8px",
            }}
          >
            ❤️ CareCompanion
          </h1>

          <div
            style={{
              fontSize: "16px",
              color: "#444",
              marginBottom: "12px",
            }}
          >
            👤 {name}
            {"  |  "}
            🎂 {age}
            {"  |  "}
            📅 {date}
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor:
                "#e5e7eb",
              borderRadius:
                "999px",
              overflow:
                "hidden",
            }}
          >
            <div
              style={{
                width:
                  `${progress}%`,
                height: "100%",
                backgroundColor:
                  "#2563eb",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "15px",
              color: "#555",
            }}
          >
            Page {currentPage} of 5
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
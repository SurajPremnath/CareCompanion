"use client";

import { clearAssessmentData } from "@/lib/assessmentStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LoggedInUser = {
  id: string;
  name: string;
  age: number;
  username: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<LoggedInUser | null>(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser) {
      router.push("/login");
      return;
    }

    setUser(loggedInUser);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  const startSelfAssessment = () => {
    if (!user) return;

    // Clear previous assessment answers
    clearAssessmentData();

    // Set fresh assessment metadata
    localStorage.setItem(
      "assessmentType",
      "self"
    );

    localStorage.setItem(
      "patientName",
      user.name
    );

    localStorage.setItem(
      "patientAge",
      String(user.age)
    );

    localStorage.setItem(
      "observerName",
      user.name
    );

    localStorage.setItem(
      "observerRelationship",
      "Self"
    );

    localStorage.setItem(
      "assessmentDate",
      new Date().toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    );

    router.push("/self/page2");
  };

  const startFamilyAssessment = () => {
    router.push("/family");
  };

  if (!user) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #d1d5db",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          ❤️ CareCompanion
        </h1>

        <h2>
          Welcome {user.name}
        </h2>

        <p
          style={{
            color: "#555",
            marginBottom: "30px",
          }}
        >
          Choose an assessment option
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={
              startFamilyAssessment
            }
            style={actionButton}
          >
            👨‍👩‍👧
            <br />
            Family Assessment
          </button>

          <button
            onClick={
              startSelfAssessment
            }
            style={actionButton}
          >
            🧍
            <br />
            Self Assessment
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "16px",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() =>
              router.push(
                "/add-patient"
              )
            }
            style={actionButton}
          >
            ➕
            <br />
            Add Patient
          </button>

          <button
            onClick={() =>
              alert(
                "Reports module will be available in Phase 3."
              )
            }
            style={actionButton}
          >
            📄
            <br />
            Reports
          </button>
        </div>

        <button
          onClick={logout}
          style={logoutButton}
        >
          🚪 Logout
        </button>

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          Created by Suraj Premnath
        </div>
      </div>
    </main>
  );
}

const actionButton: React.CSSProperties =
{
  padding: "22px",
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  minHeight: "110px",
};

const logoutButton: React.CSSProperties =
{
  width: "100%",
  padding: "14px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};
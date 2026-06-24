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

type Patient = {
  id: string;
  ownerUserId: string;
  name: string;
  age: number;
  gender: string;
  relationship: string;
  createdAt: string;
};

export default function FamilyPage() {
  const router = useRouter();

  const [loggedInUser, setLoggedInUser] =
    useState<LoggedInUser | null>(null);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );

    if (!user) {
      router.push("/login");
      return;
    }

    setLoggedInUser(user);

    const allPatients: Patient[] = JSON.parse(
      localStorage.getItem("patients") || "[]"
    );

    const myPatients = allPatients.filter(
      (patient) => patient.ownerUserId === user.id
    );

    setPatients(myPatients);
  }, [router]);

  const selectedPatient =
    patients.find(
      (patient) =>
        patient.id === selectedPatientId
    ) || null;

  const startAssessment = () => {
    if (!loggedInUser) return;
    if (!selectedPatient) return;

    localStorage.setItem(
      "assessmentType",
      "family"
    );

    localStorage.setItem(
      "patientName",
      selectedPatient.name
    );

    localStorage.setItem(
      "patientAge",
      String(selectedPatient.age)
    );

    localStorage.setItem(
      "observerName",
      loggedInUser.name
    );

    localStorage.setItem(
      "observerRelationship",
      selectedPatient.relationship
    );

    localStorage.setItem(
      "assessmentDate",
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );

    router.push("/family/page2");
  };

  if (!loggedInUser) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "16px",
            padding: "32px",
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

          <h2>Family Assessment</h2>

          <p
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Welcome, {loggedInUser.name}
          </p>

          <p
            style={{
              color: "#555",
              marginBottom: "25px",
            }}
          >
            Select a patient to begin assessment.
          </p>

          {patients.length === 0 ? (
            <>
              <div
                style={{
                  background: "#fef3c7",
                  border: "1px solid #fcd34d",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                No patients found.
                Please add a patient first.
              </div>

              <button
                onClick={() =>
                  router.push("/add-patient")
                }
                style={primaryButton}
              >
                ➕ Add Patient
              </button>
            </>
          ) : (
            <>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Select Patient
              </label>

              <select
                value={selectedPatientId}
                onChange={(e) =>
                  setSelectedPatientId(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  marginBottom: "20px",
                  fontSize: "16px",
                }}
              >
                <option value="">
                  Select Patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name}
                  </option>
                ))}
              </select>

              {selectedPatient && (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <strong>Name:</strong>{" "}
                    {selectedPatient.name}
                  </div>

                  <div>
                    <strong>Age:</strong>{" "}
                    {selectedPatient.age}
                  </div>

                  <div>
                    <strong>Gender:</strong>{" "}
                    {selectedPatient.gender}
                  </div>

                  <div>
                    <strong>Relationship:</strong>{" "}
                    {selectedPatient.relationship}
                  </div>
                </div>
              )}

              <button
                onClick={startAssessment}
                disabled={!selectedPatient}
                style={{
                  ...primaryButton,
                  opacity: selectedPatient
                    ? 1
                    : 0.5,
                  cursor: selectedPatient
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                Start Assessment →
              </button>
            </>
          )}

          <button
            onClick={() =>
              router.push("/add-patient")
            }
            style={secondaryButton}
          >
            ➕ Add New Patient
          </button>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            style={secondaryButton}
          >
            ← Back To Dashboard
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
      </div>
    </main>
  );
}

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "12px",
  fontSize: "16px",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "12px",
  fontSize: "16px",
};
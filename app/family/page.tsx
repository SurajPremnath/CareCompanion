"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { clearAssessmentData } from "@/lib/assessmentStorage";

import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";
import { patientStorage } from "@/lib/storage/patientStorage";

import type { Patient } from "@/lib/types/patient";

type UserProfile = {
  id: string;
  fullName: string;
};

export default function FamilyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] =
    useState<UserProfile | null>(null);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const user =
          await authService.getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const profile =
          await profileRepository.getCurrentProfile();

        if (!mounted) return;

        if (!profile) {
          setError(
            "Unable to load your profile. Please sign in again."
          );
          return;
        }

        setCurrentUser({
          id: profile.id,
          fullName: profile.fullName,
        });

        const result =
          await patientStorage.getPatients();

        if (!mounted) return;

if (!result.success) {
  setError(
    result.error ??
      "Unable to load patients. Please try again."
  );
  return;
}


        const loadedPatients =
          result.data ?? [];

        setPatients(loadedPatients);

        if (loadedPatients.length > 0) {
          setSelectedPatientId(
            loadedPatients[0].id
          );
        }
      } catch (err) {
        console.error(err);

        if (!mounted) return;

        setError(
          "Something went wrong while loading this page. Please refresh and try again."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      mounted = false;
    };
  }, [router]);

  const selectedPatient = useMemo(() => {
    return (
      patients.find(
        (patient) =>
          patient.id === selectedPatientId
      ) ?? null
    );
  }, [patients, selectedPatientId]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Loading...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          padding: "20px",
          fontFamily:
            "Inter, Arial, sans-serif",
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
              border: "1px solid #fecaca",
              borderRadius: "16px",
              padding: "32px",
            }}
          >
            <h2
              style={{
                marginBottom: "16px",
              }}
            >
              Unable to Continue
            </h2>

            <p
              style={{
                marginBottom: "24px",
              }}
            >
              {error}
            </p>

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              style={secondaryButton}
            >
              ← Back To Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return null;
  }

  const startAssessment = () => {
    if (!currentUser || !selectedPatient) {
      return;
    }

    clearAssessmentData();

    localStorage.setItem(
      "assessmentType",
      "family"
    );

localStorage.setItem(
  "patientId",
  selectedPatient.id
);

    localStorage.setItem(
      "patientName",
      selectedPatient.fullName
    );

    const patientAge =
      selectedPatient.dateOfBirth
        ? String(
            calculateAge(
              selectedPatient.dateOfBirth
            )
          )
        : "";

    localStorage.setItem(
      "patientAge",
      patientAge
    );

    localStorage.setItem(
      "observerName",
      currentUser.fullName
    );

    localStorage.setItem(
      "observerRelationship",
      selectedPatient.relationship ?? ""
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
            Welcome, {currentUser.fullName}
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
                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.fullName}
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
                    {selectedPatient.fullName}
                  </div>

                  <div>
                    <strong>Age:</strong>{" "}
                    {selectedPatient.dateOfBirth
                      ? calculateAge(
                          selectedPatient.dateOfBirth
                        )
                      : "-"}
                  </div>

                  <div>
                    <strong>Gender:</strong>{" "}
                    {selectedPatient.gender ??
                      "-"}
                  </div>

                  <div>
                    <strong>Relationship:</strong>{" "}
                    {selectedPatient.relationship ??
                      "-"}
                  </div>
                </div>
              )}

              <button
                onClick={startAssessment}
                style={primaryButton}
              >
                Start Assessment →
              </button>

              <button
                onClick={() =>
                  router.push("/add-patient")
                }
                style={secondaryButton}
              >
                ➕ Add New Patient
              </button>
            </>
          )}

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

  function calculateAge(
    dateOfBirth: string
  ): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age =
      today.getFullYear() -
      dob.getFullYear();

    const monthDifference =
      today.getMonth() -
      dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() <
          dob.getDate())
    ) {
      age--;
    }

    return age;
  }

}

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "#ffffff",
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
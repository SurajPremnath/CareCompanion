"use client";

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

export default function AddPatientPage() {
  const router = useRouter();

  const [loggedInUser, setLoggedInUser] =
    useState<LoggedInUser | null>(null);

  const [patientName, setPatientName] =
    useState("");

  const [patientAge, setPatientAge] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [relationship, setRelationship] =
    useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("loggedInUser") ||
        "null"
    );

    if (!user) {
      router.push("/login");
      return;
    }

    setLoggedInUser(user);
  }, [router]);

  const savePatient = () => {
    if (
      !patientName.trim() ||
      !patientAge.trim() ||
      !gender ||
      !relationship
    ) {
      alert(
        "Please complete all patient details."
      );
      return;
    }

    const patients: Patient[] =
      JSON.parse(
        localStorage.getItem("patients") ||
          "[]"
      );

    const duplicatePatient =
      patients.find(
        (patient) =>
          patient.ownerUserId ===
            loggedInUser?.id &&
          patient.name
            .trim()
            .toLowerCase() ===
            patientName
              .trim()
              .toLowerCase()
      );

    if (duplicatePatient) {
      alert(
        "A patient with this name already exists."
      );
      return;
    }

    const newPatient: Patient = {
      id: crypto.randomUUID(),
      ownerUserId:
        loggedInUser?.id || "",
      name: patientName.trim(),
      age: Number(patientAge),
      gender,
      relationship,
      createdAt:
        new Date().toISOString(),
    };

    patients.push(newPatient);

    localStorage.setItem(
      "patients",
      JSON.stringify(patients)
    );

    alert(
      "Patient added successfully."
    );

    router.push("/dashboard");
  };

  if (!loggedInUser) return null;

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
          maxWidth: "800px",
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

        <h2>Add New Patient</h2>

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
            marginBottom: "24px",
          }}
        >
          Add a patient that you
          regularly monitor and assess.
        </p>

        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) =>
            setPatientName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Age"
          value={patientAge}
          onChange={(e) =>
            setPatientAge(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={gender}
          onChange={(e) =>
            setGender(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <select
          value={relationship}
          onChange={(e) =>
            setRelationship(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="">
            Select Relationship
          </option>

          <option value="Father">
            Father
          </option>

          <option value="Mother">
            Mother
          </option>

          <option value="Spouse">
            Spouse
          </option>

          <option value="Brother">
            Brother
          </option>

          <option value="Sister">
            Sister
          </option>

          <option value="Son">
            Son
          </option>

          <option value="Daughter">
            Daughter
          </option>

          <option value="Grandfather">
            Grandfather
          </option>

          <option value="Grandmother">
            Grandmother
          </option>

          <option value="Uncle">
            Uncle
          </option>

          <option value="Aunt">
            Aunt
          </option>

          <option value="Friend">
            Friend
          </option>

          <option value="Neighbour">
            Neighbour
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <button
          onClick={savePatient}
          style={primaryButton}
        >
          💾 Save Patient
        </button>

        <button
          onClick={() =>
            router.push(
              "/dashboard"
            )
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
    </main>
  );
}

const inputStyle: React.CSSProperties =
  {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box",
  };

const primaryButton: React.CSSProperties =
  {
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

const secondaryButton: React.CSSProperties =
  {
    width: "100%",
    padding: "14px",
    background: "#ffffff",
    color: "#111827",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  };
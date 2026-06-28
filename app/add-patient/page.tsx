"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";
import { patientStorage } from "@/lib/storage/patientStorage";
import AppHeader from "@/app/components/AppHeader";

export default function AddPatientPage() {

  const router = useRouter();

  //------------------------------------------------------------
  // Page State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [currentUserName, setCurrentUserName] =
    useState("");

  //------------------------------------------------------------
  // Patient Details
  //------------------------------------------------------------

  const [fullName, setFullName] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [relationship, setRelationship] =
    useState("");

  //------------------------------------------------------------
  // Authentication
  //------------------------------------------------------------

  useEffect(() => {

    const loadUser = async () => {

console.log("Loading user....");


      try {

        const user =
          await authService.getCurrentUser();

console.log("Supabase User:", user);

        if (!user) {

console.log("No authenticated user");

          router.replace("/login");

          return;

        }

console.log("Authenticated");

        setCurrentUserName(
          user.user_metadata?.full_name ??
          user.email ??
          "User"
        );

      }
      catch (error) {

console.error("Load user failed:", error);

        router.replace("/login");

        return;

      }
      finally {

        setLoading(false);

      }

    };

    loadUser();

  }, [router]);

  //------------------------------------------------------------
  // Age Calculation
  //------------------------------------------------------------

  const calculatedAge =
    useMemo(() => {

      if (!dateOfBirth) {

        return "";

      }

      const dob =
        new Date(dateOfBirth);

      const today =
        new Date();

      let age =
        today.getFullYear() -
        dob.getFullYear();

      const monthDifference =
        today.getMonth() -
        dob.getMonth();

      if (
        monthDifference < 0 ||
        (
          monthDifference === 0 &&
          today.getDate() < dob.getDate()
        )
      ) {

        age--;

      }

      return age >= 0
        ? `${age} Years`
        : "";

    }, [dateOfBirth]);

  //------------------------------------------------------------
  // Save Patient
  //------------------------------------------------------------

  const handleSavePatient =
    async () => {

      if (saving) {

        return;

      }

      setSaving(true);

      try {

        const result =
          await patientStorage.savePatient({

            fullName:
              fullName.trim(),

            dateOfBirth,

            gender:
              gender as
                | "Male"
                | "Female"
                | "Other"
                | "Prefer not to say",

            relationship,

            status: "ACTIVE"

          });

 if (!result.success) {

  alert(
    result.error ??
    "Unable to save patient."
  );

  return;

}

alert(
  "Patient added successfully."
);

        router.push("/dashboard");

      }
      catch {

        alert(
          "Something went wrong while saving the patient."
        );

      }
      finally {

        setSaving(false);

      }

    };

  //------------------------------------------------------------
  // Loading Screen
  //------------------------------------------------------------

  if (loading) {

    return (

      <main
        style={loadingContainer}
      >

        <h2>

          Loading...

        </h2>

      </main>

    );

  }

  //------------------------------------------------------------
  // JSX Continues In Part 2
  //------------------------------------------------------------
    return (

    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >

<AppHeader
  pageTitle="Reports"
  pageIcon="📊"
/>

        <label style={labelStyle}>
          Full Name *
        </label>

        <input
          type="text"
          placeholder="Enter patient's full name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          style={inputStyle}
        />

        <label style={labelStyle}>
          Date of Birth *
        </label>

        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) =>
            setDateOfBirth(e.target.value)
          }
          style={inputStyle}
        />

        {dateOfBirth && (
          <div
            style={{
              marginTop: "-8px",
              marginBottom: "20px",
              color: "#2563eb",
              fontWeight: 600,
            }}
          >
            Age : {calculatedAge}
          </div>
        )}

        <label style={labelStyle}>
          Gender *
        </label>

        <select
          value={gender}
          onChange={(e) =>
            setGender(e.target.value)
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

          <option value="Prefer not to say">
            Prefer not to say
          </option>
        </select>

        <label style={labelStyle}>
          Relationship *
        </label>

        <select
          value={relationship}
          onChange={(e) =>
            setRelationship(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Select Relationship
          </option>

          <option>Father</option>

          <option>Mother</option>

          <option>Spouse</option>

          <option>Brother</option>

          <option>Sister</option>

          <option>Son</option>

          <option>Daughter</option>

          <option>Grandfather</option>

          <option>Grandmother</option>

          <option>Uncle</option>

          <option>Aunt</option>

          <option>Friend</option>

          <option>Neighbour</option>

          <option>Other</option>

        </select>

        <button
          onClick={handleSavePatient}
          disabled={saving}
          style={{
            ...primaryButton,

            opacity: saving ? 0.7 : 1,

            cursor: saving
              ? "not-allowed"
              : "pointer",
          }}
        >
          {saving
            ? "Saving Patient..."
            : "💾 Save Patient"}
        </button>

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          disabled={saving}
          style={secondaryButton}
        >
          ← Back To Dashboard
        </button>

        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "12px",
          }}
        >
          Created by Suraj Premnath
        </div>

    </div>

    </main>

  );
}

const loadingContainer: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8fafc",
  fontFamily: "Inter, Arial, sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  marginTop: "18px",
  fontWeight: 600,
  color: "#111827",
  fontSize: "15px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  boxSizing: "border-box",
  marginBottom: "8px",
  background: "#ffffff",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "30px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "0.2s",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};
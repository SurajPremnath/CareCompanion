"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";
import { patientStorage } from "@/lib/storage/patientStorage";
import AppHeader from "@/app/components/AppHeader";
import { AppAlert } from "@/lib/utils/appAlert";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  performanceTracker,
} from "@/lib/performance/performanceTracker";

export default function AddPatientPage() {

  const router = useRouter();

const {
  t,
} = useLanguage();
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

      try {

        const user =
          await authService.getCurrentUser();

        if (!user) {

          router.replace("/login");

          return;

        }

        setCurrentUserName(
          user.user_metadata?.full_name ??
          user.email ??
          "User"
        );

      }
      catch (error) {

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
        ? `${age} ${t("addPatient.years")}`
        : "";

    }, [dateOfBirth, t]);

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

  AppAlert.error(

  result.error ??

  t("addPatient.saveFailed")

);

  return;

}

AppAlert.success(
  t("addPatient.saveSuccess")
);

        router.push("/dashboard");

      }
      catch {

        AppAlert.error(

  t("addPatient.unexpectedError")

);

      }
      finally {

        setSaving(false);

      }

    };

//------------------------------------------------------------
// Back To Dashboard
//------------------------------------------------------------

const handleBackToDashboard = () => {

  performanceTracker.start({

    fromPath:
      "/add-patient",

    toPath:
      "/dashboard",

    feature:
      "ADD_PATIENT_TO_DASHBOARD",

  });

  router.push(
    "/dashboard"
  );

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

          {t("addPatient.loading")}

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
  pageTitle={t("addPatient.title")}
  pageIcon="➕"
  currentUserName={currentUserName}
/>

        <label style={labelStyle}>
          {t("addPatient.fullName")} *
        </label>

        <input
          type="text"
          placeholder={t("addPatient.fullNamePlaceholder")}
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          style={inputStyle}
        />

        <label style={labelStyle}>
          {t("addPatient.dateOfBirth")} *
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
            {t("addPatient.age")} : {calculatedAge}
          </div>
        )}

        <label style={labelStyle}>
          {t("addPatient.gender")} *
        </label>

        <select
          value={gender}
          onChange={(e) =>
            setGender(e.target.value)
          }
          style={inputStyle}
        >
<option value="">
  {t("addPatient.selectGender")}
</option>

<option value="Male">
  {t("addPatient.male")}
</option>

<option value="Female">
  {t("addPatient.female")}
</option>

<option value="Other">
  {t("addPatient.other")}
</option>

<option value="Prefer not to say">
  {t("addPatient.preferNotToSay")}
</option>

</select>

        <label style={labelStyle}>
          {t("addPatient.relationship")} *
        </label>

        <select
          value={relationship}
          onChange={(e) =>
            setRelationship(e.target.value)
          }
          style={inputStyle}
        >
<option value="">
  {t("addPatient.selectRelationship")}
</option>

<option value="Father">
  {t("addPatient.father")}
</option>

<option value="Mother">
  {t("addPatient.mother")}
</option>

<option value="Spouse">
  {t("addPatient.spouse")}
</option>

<option value="Brother">
  {t("addPatient.brother")}
</option>

<option value="Sister">
  {t("addPatient.sister")}
</option>

<option value="Son">
  {t("addPatient.son")}
</option>

<option value="Daughter">
  {t("addPatient.daughter")}
</option>

<option value="Grandfather">
  {t("addPatient.grandfather")}
</option>

<option value="Grandmother">
  {t("addPatient.grandmother")}
</option>

<option value="Uncle">
  {t("addPatient.uncle")}
</option>

<option value="Aunt">
  {t("addPatient.aunt")}
</option>

<option value="Friend">
  {t("addPatient.friend")}
</option>

<option value="Neighbour">
  {t("addPatient.neighbour")}
</option>

<option value="Other">
  {t("addPatient.other")}
</option>

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
  ? t("addPatient.savingPatient")
  : `💾 ${t("addPatient.savePatient")}`}
        </button>

        <button
  onClick={handleBackToDashboard}
  disabled={saving}
  style={secondaryButton}
>
  ← {t("addPatient.backToDashboard")}
</button>

        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "12px",
          }}
        >
          {t("addPatient.createdBy")}
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
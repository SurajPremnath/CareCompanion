"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";
import { patientStorage } from "@/lib/storage/patientStorage";
import { AppAlert } from "@/lib/utils/appAlert";

import MobileHeader from "@/Components/common/MobileHeader";
import CareVRFooter from "@/Components/common/CareVRFooter";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import LanguageSelector from "@/Components/language/LanguageSelector";

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

const [accountMenuOpen, setAccountMenuOpen] =
  useState(false);

const [loggingOut, setLoggingOut] =
  useState(false);

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
// Header Actions
//------------------------------------------------------------

const handleAccountMenuToggle = () => {

  setAccountMenuOpen(
    (current) => !current
  );

};


const handleAddPatient = () => {

  setAccountMenuOpen(false);

};


const handleCareVRJourney = () => {

  setAccountMenuOpen(false);

  router.push(
    "/dashboard"
  );

};


const handleHelp = () => {

  setAccountMenuOpen(false);

  router.push(
    "/help"
  );

};


const handleLogout = async () => {

  if (loggingOut) {
    return;
  }

  setLoggingOut(true);

  try {

    await authService.logout();

    router.replace(
      "/login"
    );

  }
  catch (error) {

    console.error(
      "Unable to log out.",
      error
    );

    setLoggingOut(false);

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
    background: "#F7F3FF",
    padding: "12px",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#101D45",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "980px",
      margin: "0 auto",
      boxSizing: "border-box",
    }}
  >

<MobileHeader

  careMode="FAMILY"

  onCareModeChange={() => {
    // Add Patient is always a Family workflow.
  }}

  userName={
    currentUserName
  }

  showCareModeToggle={false}

  showHomeButton={true}

  onHomeClick={
    handleBackToDashboard
  }

  accountMenuOpen={
    accountMenuOpen
  }

  onAccountMenuToggle={
    handleAccountMenuToggle
  }

  consentGranted={true}

  onAddPatient={
    handleAddPatient
  }

  onCareVRJourney={
    handleCareVRJourney
  }

  onHelp={
    handleHelp
  }

  languageSelector={
    <LanguageSelector />
  }

  onLogout={
    handleLogout
  }

  loggingOut={
    loggingOut
  }

/>

<section
  className="carevr-add-patient-hero"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "16px 4px 10px",
  }}
>

  <div
    style={{
      flex: "1 1 auto",
      minWidth: 0,
    }}
  >

    <p
      style={{
        margin: "0 0 8px",
        color: "#101D45",
        fontSize: "16px",
        lineHeight: 1.4,
        fontWeight: 600,
      }}
    >
      Good morning{" "}
      {currentUserName
        ? currentUserName
            .trim()
            .split(/\s+/)[0]
        : "there"}
      .
    </p>

<h1
  className="carevr-add-patient-title"
  style={{
    margin: 0,
    color: "#101D45",
    fontSize: "20px",
    lineHeight: 1.15,
    fontWeight: 800,
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  {t("addPatient.title")}

  <span
    style={{
      position: "relative",
      width: "38px",
      height: "38px",
      flex: "0 0 46px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "#EEE7FF",
    }}
    aria-hidden="true"
  >
    <svg
      width="34"
      height="34"
      viewBox="0 0 88 88"
      fill="none"
    >
      <circle
        cx="44"
        cy="29"
        r="9"
        fill="#6531DD"
      />

      <path
        d="M27 64C27 52.954 34.611 44 44 44C53.389 44 61 52.954 61 64"
        fill="#6531DD"
      />

      <circle
        cx="22"
        cy="39"
        r="7"
        fill="#8B63E8"
      />

      <circle
        cx="66"
        cy="39"
        r="7"
        fill="#8B63E8"
      />
    </svg>

    <span
      style={{
        position: "absolute",
        right: "-3px",
        bottom: "-2px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#6531DD",
        color: "#FFFFFF",
        fontSize: "14px",
        lineHeight: 1,
        fontWeight: 500,
      }}
    >
      +
    </span>
  </span>
</h1>

<p
  className="carevr-add-patient-subtitle"
  style={{
    margin: "12px 0 0",
    maxWidth: "520px",
    color: "#687390",
    fontSize: "17px",
    lineHeight: 1.5,
  }}
>
      Add someone you care for to manage
      their health journey.
    </p>

  </div>

</section>


<section
  className="carevr-add-patient-card"
  style={{
    background: "#FFFFFF",
    border: "1px solid #E7E0F7",
    borderRadius: "18px",
    padding: "16px 18px",
    boxShadow:
      "0 6px 18px rgba(70,45,120,0.05)",
  }}
>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingBottom: "10px",
    borderBottom:
      "1px solid #EEEAF6",
  }}
>

<div
  style={{
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F0EAFF",
    color: "#6531DD",
    fontSize: "16px",
  }}
>
      👤
    </div>

    <h2
      style={{
        margin: 0,
        color: "#101D45",
        fontSize: "20px",
        fontWeight: 800,
      }}
    >
      Patient Information
    </h2>

  </div>

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
              color: "#6531DD",
fontWeight: 700,
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

</section>

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
  : t("addPatient.savePatient")}
        </button>


<div
  style={{
    marginTop: "18px",
    padding: "18px 4px 8px",
    borderTop: "1px solid #ECEEF4",
  }}
>

<div
  style={{
    marginTop: "0px",
  }}
>
  <CareVRFooter />
</div>


        </div>

      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .carevr-add-patient-hero {
            flex-direction: column;
            align-items: flex-start;
            padding: 18px 4px 22px;
          }

          .carevr-add-patient-hero-illustration {
            align-self: center;
            width: 112px !important;
            height: 112px !important;
            margin-top: -4px;
          }

          .carevr-add-patient-title {
            font-size: 32px !important;
          }

          .carevr-add-patient-subtitle {
            font-size: 15px !important;
          }

          .carevr-add-patient-card {
            padding: 18px !important;
            border-radius: 18px !important;
          }
        }

        @media (max-width: 420px) {
          .carevr-add-patient-title {
            font-size: 29px !important;
          }

          .carevr-add-patient-subtitle {
            font-size: 14px !important;
          }

          .carevr-add-patient-card {
            padding: 16px !important;
          }
        }
      `}</style>

    </main>

  );
}

const loadingContainer: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F7F3FF",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#101D45",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "6px",
  marginTop: "12px",
  fontWeight: 700,
  color: "#101D45",
  fontSize: "13px",
  lineHeight: 1.3,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "48px",
  padding: "0 13px",
  border: "1px solid #DDD6EF",
  borderRadius: "14px",
  fontSize: "16px",
  lineHeight: 1.4,
  boxSizing: "border-box",
  marginBottom: "8px",
  background: "#FFFFFF",
  color: "#101D45",
  outline: "none",
  fontFamily: "inherit",
};

const primaryButton: CSSProperties = {
  width: "100%",
  minHeight: "58px",
  padding: "0 20px",
  marginTop: "22px",
  background: "#6531DD",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 800,
  fontFamily: "inherit",
  transition: "0.2s",
  boxShadow:
    "0 7px 16px rgba(101,49,221,0.20)",
};

const secondaryButton: CSSProperties = {
  width: "100%",
  minHeight: "46px",
  padding: "0 16px",
  marginTop: "8px",
  background: "transparent",
  color: "#687390",
  border: "none",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
};
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";
import { AppAlert } from "@/lib/utils/appAlert";

import { trendDraftStorage } from "@/lib/storage/trendDraftStorage";

import {
  TrendRequest,
  TrendPeriod,
} from "@/lib/trends/trendRequest";


//------------------------------------------------------------
// Patient Storage
//------------------------------------------------------------

import { patientStorage } from "@/lib/storage/patientStorage";
import { Patient } from "@/lib/types/patient";

export default function ClinicalTrendsPage() {

console.log("ClinicalTrendsPage rendered");

  const router = useRouter();

  //------------------------------------------------------------
  // UI State
  //------------------------------------------------------------

//------------------------------------------------------------
// Patient State
//------------------------------------------------------------

const [patients, setPatients] =
  useState<Patient[]>([]);

const [selectedPatientId, setSelectedPatientId] =
  useState("");


//------------------------------------------------------------
// Selected Time Period
//------------------------------------------------------------

const [period, setPeriod] =
  useState<TrendPeriod>(7);


  const [showTemperature, setShowTemperature] =
    useState(true);

  const [showBloodPressure, setShowBloodPressure] =
    useState(true);

  const [showPulse, setShowPulse] =
    useState(true);

  const [showSpo2, setShowSpo2] =
    useState(true);

//------------------------------------------------------------
// Load Patients
//------------------------------------------------------------

useEffect(() => {

  async function loadPatients() {


    try {

      const result =
        await patientStorage.getPatients();


      if (!result.success) {

        return;

      }


const patients = result.data ?? [];

setPatients(patients);

if (patients.length > 0) {

  setSelectedPatientId(
    patients[0].id
  );

}

    }
    catch (error) {

      console.error(error);

    }

  }

  loadPatients();

}, []);

//------------------------------------------------------------
// Generate Trends
//------------------------------------------------------------

const handleGenerate = () => {

  //----------------------------------------------------------
  // Validate parameter selection
  //----------------------------------------------------------

  if (
    !showTemperature &&
    !showBloodPressure &&
    !showPulse &&
    !showSpo2
  ) {

    AppAlert.warning(
      "Please select at least one parameter."
    );

    return;

  }

  //----------------------------------------------------------
  // Get selected patient
  //----------------------------------------------------------

  const selectedPatient =
    patients.find(
      (patient) =>
        patient.id === selectedPatientId
    );

  if (!selectedPatient) {

    AppAlert.warning(
      "Please select a patient."
    );

    return;

  }

  //----------------------------------------------------------
  // Create Trend Request
  //----------------------------------------------------------

const trendRequest: TrendRequest = {

  //----------------------------------------------------------
  // Patient Information
  //----------------------------------------------------------

  patientId: selectedPatient.id,

  patientName: selectedPatient.fullName,

period,
  //----------------------------------------------------------
  // Selected Parameters
  //----------------------------------------------------------

  parameters: {

    temperature: showTemperature,

    bloodPressure: showBloodPressure,

    pulse: showPulse,

    spo2: showSpo2,

  },

};

  //----------------------------------------------------------
  // Save Trend Request
  //----------------------------------------------------------

  trendDraftStorage.save(
    trendRequest
  );

  //----------------------------------------------------------
  // Navigate to Results
  //----------------------------------------------------------

  router.push(
    "/reports/trends/results"
  );

};

  //------------------------------------------------------------
  // Render
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
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >

        <AppHeader
          pageTitle="Clinical Trends"
          pageIcon="📈"
        />

        <p
          style={{
            color: "#6b7280",
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          Choose how you would like to analyse your
          patient's health trends.
        </p>

        {/*------------------------------------------------*/}
        {/* Patient Selection */}
        {/*------------------------------------------------*/}

        <section style={cardStyle}>

          <h2>👤 Patient</h2>

<select
  value={selectedPatientId}
  onChange={(event) =>
    setSelectedPatientId(event.target.value)
  }
  style={selectStyle}
>

  {patients.length === 0 ? (

    <option value="">
      No patients found
    </option>

  ) : (

    patients.map((patient) => (

      <option
        key={patient.id}
        value={patient.id}
      >
        {patient.fullName}
      </option>

    ))

  )}

</select>

        </section>


{/*------------------------------------------------*/}
{/* Time Period */}
{/*------------------------------------------------*/}

<section style={cardStyle}>

  <h2>📅 Time Period</h2>

  <p
    style={{
      color: "#6b7280",
      marginTop: "8px",
      marginBottom: "20px",
    }}
  >
    Select the time period for trend analysis.
  </p>

  <div style={chipContainer}>

    <button
      style={
        period === 1
          ? selectedChip
          : chip
      }
      onClick={() =>
        setPeriod(1)
      }
    >
      Today
    </button>

    <button
      style={
        period === 7
          ? selectedChip
          : chip
      }
      onClick={() =>
        setPeriod(7)
      }
    >
      Last 7 Days
    </button>

    <button
      style={
        period === 30
          ? selectedChip
          : chip
      }
      onClick={() =>
        setPeriod(30)
      }
    >
      Last 30 Days
    </button>

    <button
      style={
        period === -1
          ? selectedChip
          : chip
      }
      onClick={() =>
        setPeriod(-1)
      }
    >
      All Records
    </button>

  </div>

</section>

{/*------------------------------------------------*/}
{/* Parameter Selection */}
{/*------------------------------------------------*/}

<section style={cardStyle}>

  <h2>🩺 Parameters</h2>

  <p
    style={{
      color: "#6b7280",
      marginTop: "8px",
      marginBottom: "20px",
    }}
  >
    Select the health parameters you would like
    to include in the clinical trend analysis.
  </p>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    alignItems: "stretch",
  }}
>

{/*-----------------------------------------------*/}
{/* Temperature Parameter Card */}
{/*-----------------------------------------------*/}

<div
  onClick={() =>
    setShowTemperature(!showTemperature)
  }
  style={{
    border: showTemperature
      ? "2px solid #2563eb"
      : "1px solid #d1d5db",

    background: showTemperature
      ? "#eff6ff"
      : "#ffffff",

    borderRadius: "16px",

    padding: "18px",

    cursor: "pointer",

    transition: "all 0.2s ease",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "16px",
  }}
>

  <div>

    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      🌡 Temperature
    </div>

  </div>

  <div
    style={{
      fontSize: "14px",
      fontWeight: 600,
      color: showTemperature
        ? "#2563eb"
        : "#9ca3af",
    }}
  >
    {showTemperature
      ? "✓ Selected"
      : "Select"}
  </div>

</div>

{/*-----------------------------------------------*/}
{/* Blood Pressure Parameter Card */}
{/*-----------------------------------------------*/}

<div
  onClick={() =>
    setShowBloodPressure(!showBloodPressure)
  }
  style={{
    border: showBloodPressure
      ? "2px solid #2563eb"
      : "1px solid #d1d5db",

    background: showBloodPressure
      ? "#eff6ff"
      : "#ffffff",

    borderRadius: "16px",
    padding: "18px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  }}
>

  <div>

    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      ❤️ Blood Pressure
    </div>

  </div>

  <div
    style={{
      fontSize: "14px",
      fontWeight: 600,
      color: showBloodPressure
        ? "#2563eb"
        : "#9ca3af",
    }}
  >
    {showBloodPressure
      ? "✓ Selected"
      : "Select"}
  </div>

</div>


{/*-----------------------------------------------*/}
{/* Pulse Parameter Card */}
{/*-----------------------------------------------*/}

<div
  onClick={() =>
    setShowPulse(!showPulse)
  }
  style={{
    border: showPulse
      ? "2px solid #2563eb"
      : "1px solid #d1d5db",

    background: showPulse
      ? "#eff6ff"
      : "#ffffff",

    borderRadius: "16px",
    padding: "18px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  }}
>

  <div>

    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      💓 Pulse
    </div>

  </div>

  <div
    style={{
      fontSize: "14px",
      fontWeight: 600,
      color: showPulse
        ? "#2563eb"
        : "#9ca3af",
    }}
  >
    {showPulse
      ? "✓ Selected"
      : "Select"}
  </div>

</div>

{/*-----------------------------------------------*/}
{/* SpO₂ Parameter Card */}
{/*-----------------------------------------------*/}

<div
  onClick={() =>
    setShowSpo2(!showSpo2)
  }
  style={{
    border: showSpo2
      ? "2px solid #2563eb"
      : "1px solid #d1d5db",

    background: showSpo2
      ? "#eff6ff"
      : "#ffffff",

    borderRadius: "16px",
    padding: "18px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  }}
>

  <div>

    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      🫁 SpO₂
    </div>

  </div>

  <div
    style={{
      fontSize: "14px",
      fontWeight: 600,
      color: showSpo2
        ? "#2563eb"
        : "#9ca3af",
    }}
  >
    {showSpo2
      ? "✓ Selected"
      : "Select"}
  </div>

</div>
</div>
        </section>

        {/*------------------------------------------------*/}
        {/* Actions */}
        {/*------------------------------------------------*/}

        <button
          onClick={handleGenerate}
          style={primaryButton}
        >
          Generate Trends
        </button>

        <button
          onClick={() =>
            router.push("/reports")
          }
          style={secondaryButton}
        >
          ← Back to Reports
        </button>

      </div>

    </main>

  );

}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  marginTop: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: "16px",
};

const chipContainer: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "16px",
};

const chip: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};

const selectedChip: React.CSSProperties = {
  ...chip,
  background: "#2563eb",
  color: "#ffffff",
  border: "1px solid #2563eb",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "16px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};
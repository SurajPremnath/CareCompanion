"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { dailyCareStorage } from "@/lib/storage/DailyCareStorage";
import type { DailyCare } from "@/lib/types/dailyCare";
import { patientStorage } from "@/lib/storage/patientStorage";

import AppHeader from "@/app/components/AppHeader";
import { formatDisplayList } from "@/lib/utils/displayFormatter";


export default function DailyCareReportPage() {

  const params = useParams();

const router = useRouter();

  const id = params.id as string;

const [loading, setLoading] =
  useState(true);

const [record, setRecord] =
  useState<DailyCare | null>(null);

const [patientName, setPatientName] =
    useState("");

const [error, setError] =
  useState("");

useEffect(() => {

  const loadReport = async () => {

    const result =
      await dailyCareStorage.getById(id);

    if (!result.success) {

      setError(
        result.error ??
        "Unable to load report."
      );

      setLoading(false);

      return;

    }

    if (!result.data) {

      setError(
        "Report not found."
      );

      setLoading(false);

      return;

    }

const dailyCare = result.data;

setRecord(dailyCare);

const patientResult =
    await patientStorage.getPatient(
        dailyCare.patientId
    );

if (
    patientResult.success &&
    patientResult.data
) {

    setPatientName(
        patientResult.data.fullName
    );

}

setLoading(false);

  };

  loadReport();

}, [id]);

//------------------------------------------------------------
// Loading
//------------------------------------------------------------

if (loading) {

  return (

    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <h2>

        Loading report...

      </h2>

    </main>

  );

}

//------------------------------------------------------------
// Error
//------------------------------------------------------------

if (error) {

  return (

    <main
      style={{
        padding: "32px",
      }}
    >

      <h2>

        Daily Care Report

      </h2>

      <p
        style={{
          color: "red",
        }}
      >

        {error}

      </p>

    </main>

  );

}

//------------------------------------------------------------
// Safety
//------------------------------------------------------------

if (!record) {

  return null;

}

return (

  <main
    style={{
      minHeight: "100vh",
      background: "#f8fafc",
      padding: "32px",
      fontFamily: "Inter, Arial, sans-serif",
    }}
  >

    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid #e5e7eb",
      }}
    >

<AppHeader
  pageTitle="Daily Care Report"
  pageIcon="📄"
/>

<>
  {/*------------------------------------------------*/}
  {/* Patient Summary */}
  {/*------------------------------------------------*/}

  <section style={cardStyle}>

    <h2 style={cardTitle}>
      Patient Summary
    </h2>

    <div style={summaryGrid}>

      <div>

        <strong>Patient</strong>

        <div>
          {patientName || "Unknown Patient"}
        </div>

      </div>

      <div>

        <strong>Recorded On</strong>

        <div>
          {new Date(
            record.recordedAt
          ).toLocaleString()}
        </div>

      </div>

    </div>

  </section>

  {/*------------------------------------------------*/}
  {/* Vital Signs */}
  {/*------------------------------------------------*/}

  <section style={cardStyle}>

    <h2 style={cardTitle}>
      Vital Signs
    </h2>

    <div style={summaryGrid}>

      <div>

        <strong>Temperature</strong>

        <div>
          {record.temperature != null
      ? `${record.temperature}°${record.temperatureUnit}`
      : "Not Recorded"}

        </div>

      </div>

      <div>

        <strong>Blood Pressure</strong>

        <div>

          {record.systolic &&
          record.diastolic
            ? `${record.systolic}/${record.diastolic}`
            : "Not Recorded"}

        </div>

      </div>

      <div>

        <strong>Pulse</strong>

        <div>

          {record.pulse
            ? `${record.pulse} bpm`
            : "Not Recorded"}

        </div>

      </div>

      <div>

        <strong>SpO₂</strong>

        <div>

          {record.spo2
            ? `${record.spo2}%`
            : "Not Recorded"}

        </div>

      </div>

    </div>

  </section>

  {/*------------------------------------------------*/}
  {/* Symptoms & Pain */}
  {/*------------------------------------------------*/}

  <section style={cardStyle}>

    <h2 style={cardTitle}>
      Symptoms & Pain
    </h2>

    <div style={summaryGrid}>

      <div>

        <strong>Symptoms</strong>

        <div>

{
 formatDisplayList(
    record.symptoms.map(symptom =>
      symptom === "OTHER"
        ? record.otherSymptom || "Other"
        : symptom
    )
  )
}

        </div>

      </div>

      <div>

        <strong>Pain Locations</strong>

        <div>

{
  formatDisplayList(
    record.painLocations.map(location =>
      location === "OTHER"
        ? record.otherPainLocation || "Other"
        : location
    )
  )
}

        </div>

      </div>

    </div>

  </section>

  {/*------------------------------------------------*/}
  {/* Clinical Notes */}
  {/*------------------------------------------------*/}

  <section style={cardStyle}>

    <h2 style={cardTitle}>
      Clinical Notes
    </h2>

    <p>

      {record.notes?.trim()
        ? record.notes
        : "No notes recorded"}

    </p>

  </section>

</>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "12px",
        }}
      >

        <button
          onClick={() =>
            router.push(
              "/reports/daily-care"
            )
          }
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            background: "#ffffff",
          }}
        >
          ← Back to History
        </button>

      </div>

    </div>

  </main>

);
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
  marginTop: "24px",
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  marginBottom: "20px",
  fontSize: "24px",
  fontWeight: 700,
  color: "#111827",
};

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "24px",
};
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { dailyCareStorage } from "@/lib/storage/DailyCareStorage";
import type { DailyCare } from "@/lib/types/dailyCare";
import { patientStorage } from "@/lib/storage/patientStorage";
import AppHeader from "@/app/components/AppHeader";

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          rowGap: "16px",
          columnGap: "24px",
        }}
      >

<strong>

Patient

</strong>

<span>

{patientName || "Unknown Patient"}

</span>

        <strong>Recorded On</strong>

        <span>
          {new Date(
            record.recordedAt
          ).toLocaleString()}
        </span>

        <strong>Temperature</strong>

        <span>
          {record.temperature}°
          {record.temperatureUnit}
        </span>

        <strong>Blood Pressure</strong>

        <span>
          {record.systolic &&
          record.diastolic
            ? `${record.systolic}/${record.diastolic}`
            : "Not Recorded"}
        </span>

        <strong>Pulse</strong>

        <span>
          {record.pulse
            ? `${record.pulse} bpm`
            : "Not Recorded"}
        </span>

        <strong>SpO₂</strong>

        <span>
          {record.spo2
            ? `${record.spo2}%`
            : "Not Recorded"}
        </span>

        <strong>Symptoms</strong>

        <span>
          {record.symptoms.length > 0
            ? record.symptoms.join(", ")
            : "None"}
        </span>

        <strong>Pain Locations</strong>

        <span>
          {record.painLocations.length > 0
            ? record.painLocations.join(", ")
            : "None"}
        </span>

        <strong>Notes</strong>

        <span>
          {record.notes?.trim()
            ? record.notes
            : "No notes recorded"}
        </span>

      </div>

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
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { dailyCareStorage } from "@/lib/storage/DailyCareStorage";
import type { DailyCare } from "@/lib/types/dailyCare";
import { patientStorage } from "@/lib/storage/patientStorage";

import AppHeader from "@/app/components/AppHeader";

import {
  formatDisplayList,
  formatRecordedDate,
} from "@/lib/utils/displayFormatter";

import { ClinicalSummaryEngine }
from "@/lib/clinical-summary/ClinicalSummaryEngine";

import ClinicalSummaryCard
from "@/app/components/common/ClinicalSummaryCard";

import { DailyCarePdfGenerator } from "@/lib/pdf/DailyCarePdfGenerator";
import type { DailyCarePdfRequest } from "@/lib/pdf/PdfModels";

import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";


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

const [age, setAge] =
    useState<number | null>(null);

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

void analyticsService.track({

  module:
    ANALYTICS_MODULES.REPORTS,

  eventName:
    ANALYTICS_EVENTS.VIEWED,

  context:
    ANALYTICS_CONTEXTS.FAMILY,

  pagePath:
    "/reports/daily-care/[id]",

  metadata: {

    reportCategory:
      "DAILY_CARE",

    viewType:
      "DETAIL",

    recordId:
      dailyCare.id,

    patientId:
      dailyCare.patientId,

  },

});

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

if (patientResult.data.dateOfBirth) {

    const dob =
        new Date(patientResult.data.dateOfBirth);

    const today =
        new Date();

    let calculatedAge =
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

        calculatedAge--;

    }

    setAge(calculatedAge);

}

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

const clinicalSummary =
  ClinicalSummaryEngine.generate(record);

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
    {formatRecordedDate(record.recordedAt)}
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
{/* Observation Summary */}
{/*------------------------------------------------*/}

<ClinicalSummaryCard
  summary={clinicalSummary}
  recordedAt={record.recordedAt}
/>


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
    flexWrap: "wrap",
  }}
>

<button
onClick={async () => {

  const request: DailyCarePdfRequest = {

    reportType: "family",

    title: "Family Daily Care Report",

    patientName,

    age,

    caregiverName: null,

    relationship: null,

    record,

    observationSummary: clinicalSummary,

  };

  void analyticsService.track({

    module:
      ANALYTICS_MODULES.REPORTS,

    eventName:
      ANALYTICS_EVENTS.DOWNLOAD_STARTED,

    context:
      ANALYTICS_CONTEXTS.FAMILY,

    pagePath:
      "/reports/daily-care/[id]",

    metadata: {

      reportCategory:
        "DAILY_CARE",

      recordId:
        record.id,

      patientId:
        record.patientId,

    },

  });

  try {

    await DailyCarePdfGenerator.download(

      request,

      "CareVR_Family_Daily_Care_Report.pdf"

    );

    void analyticsService.track({

      module:
        ANALYTICS_MODULES.REPORTS,

      eventName:
        ANALYTICS_EVENTS.DOWNLOAD_COMPLETED,

      context:
        ANALYTICS_CONTEXTS.FAMILY,

      pagePath:
        "/reports/daily-care/[id]",

      metadata: {

        reportCategory:
          "DAILY_CARE",

        recordId:
          record.id,

        patientId:
          record.patientId,

      },

    });

  }
  catch (error) {

    void analyticsService.track({

      module:
        ANALYTICS_MODULES.REPORTS,

      eventName:
        ANALYTICS_EVENTS.DOWNLOAD_FAILED,

      context:
        ANALYTICS_CONTEXTS.FAMILY,

      pagePath:
        "/reports/daily-care/[id]",

      metadata: {

        reportCategory:
          "DAILY_CARE",

        recordId:
          record.id,

        patientId:
          record.patientId,

        reason:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR",

      },

    });

  }

}}

  style={{
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
  }}
>
  📄 Generate PDF Report
</button>

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
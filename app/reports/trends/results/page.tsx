"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";
import { AppAlert } from "@/lib/utils/appAlert";

import {
  TrendRequest,
} from "@/lib/trends/trendRequest";

import type {
  TrendResult,
} from "@/lib/trends/trendResult";

import {
  trendDraftStorage,
} from "@/lib/storage/trendDraftStorage";

import {
  trendStorage,
} from "@/lib/storage/TrendStorage";

import {
  trendBuilder,
} from "@/lib/builders/TrendBuilder";

import TrendChart
  from "@/app/components/TrendChart";

export default function ClinicalTrendResultsPage() {

  const router = useRouter();

//------------------------------------------------------------
// Trend Request
//------------------------------------------------------------

const [trendRequest, setTrendRequest] =
  useState<TrendRequest | null>(null);

const [trendResult, setTrendResult] =
  useState<TrendResult | null>(null);

const [loading, setLoading] =
  useState(true);

//------------------------------------------------------------
// Load Trend Request
//------------------------------------------------------------

useEffect(() => {

  async function loadTrend() {

const loadedRequest =
  trendDraftStorage.load();

if (!loadedRequest) {

  AppAlert.warning(
    "Please generate a trend report first."
  );

  router.push(
    "/reports/trends"
  );

  return;

}

setTrendRequest(
  loadedRequest
);

const historyResult =
  await trendStorage.getTrendHistory(
    loadedRequest.patientId,
    loadedRequest.period
  );

if (!historyResult.success) {

  AppAlert.error(

    historyResult.error ??

    "Unable to load clinical trends."

  );

  setLoading(false);

  return;

}

const result =
  trendBuilder.build(
    loadedRequest,
    historyResult.data ?? []
  );

    setTrendResult(result);

    setLoading(false);

  }

  loadTrend();

}, [router]);

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

      Loading clinical trends...

    </main>

  );

}

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
          maxWidth: "1000px",
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
            marginBottom: "32px",
          }}
        >
          View patient health trends and
          clinical summaries.
        </p>

{/*------------------------------------------------*/}
{/* Selected Trend Options */}
{/*------------------------------------------------*/}

<section style={cardStyle}>

  <h2>
    📋 Selected Trend Options
  </h2>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    }}
  >

    <tbody>

      <tr>

        <td
          style={{
            fontWeight: 600,
            padding: "12px 0",
            width: "220px",
          }}
        >
          Patient
        </td>

        <td>
          {trendRequest?.patientName ??
            "Not Selected"}
        </td>

      </tr>

<tr>

  <td
    style={{
      fontWeight: 600,
      padding: "12px 0",
    }}
  >
    Time Period
  </td>

  <td>

    {trendRequest?.period === 1
      ? "Today"
      : trendRequest?.period === 7
      ? "Last 7 Days"
      : trendRequest?.period === 30
      ? "Last 30 Days"
      : "All Records"}

  </td>

</tr>

<tr>

  <td
    style={{
      fontWeight: 600,
      padding: "12px 0",
      verticalAlign: "top",
    }}
  >
    Parameters Selected
  </td>

  <td>

    {[
      trendRequest?.parameters.temperature && "Temperature",
      trendRequest?.parameters.bloodPressure && "Blood Pressure",
      trendRequest?.parameters.pulse && "Pulse",
      trendRequest?.parameters.spo2 && "SpO₂",
    ]
      .filter(Boolean)
      .join(" • ")}

  </td>

</tr>

    </tbody>

  </table>

</section>

        {/*------------------------------------------------*/}
        {/* Trend Summary */}
        {/*------------------------------------------------*/}

<section style={cardStyle}>

  <h2>📊 Trend Summary</h2>

  {trendResult ? (

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
      }}
    >

      <tbody>


        <tr>

          <td style={summaryLabel}>
            Earliest Record
          </td>

          <td>
            {trendResult.summary.earliestRecord ??
              "-"}
          </td>

        </tr>

        <tr>

          <td style={summaryLabel}>
            Latest Record
          </td>

          <td>
            {trendResult.summary.latestRecord ??
              "-"}
          </td>

        </tr>

      </tbody>

    </table>

  ) : (

    <p
      style={{
        color: "#6b7280",
      }}
    >
      No trend data available.
    </p>

  )}

</section>

        {/*------------------------------------------------*/}
        {/* Trend Charts */}
        {/*------------------------------------------------*/}

<section style={cardStyle}>

  <h2>📈 Trend Charts</h2>

  {trendResult ? (

    trendResult.parameters.map((parameter) => (

      <TrendChart

        key={parameter.parameter}

        trend={parameter}

      />

    ))

  ) : (

    <p
      style={{
        color: "#6b7280",
      }}
    >

      No trend data available.

    </p>

  )}

</section>

        {/*------------------------------------------------*/}
        {/* Clinical Summary */}
        {/*------------------------------------------------*/}

        <section style={cardStyle}>

          <h2>🩺 Clinical Summary</h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Clinical insights will appear here.
          </p>

        </section>

        {/*------------------------------------------------*/}
        {/* Navigation */}
        {/*------------------------------------------------*/}

        <button
          onClick={() =>
            router.push("/reports/trends")
          }
          style={secondaryButton}
        >
          ← Back to Trend Options
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

const summaryLabel: React.CSSProperties = {

  width: "220px",

  padding: "12px 0",

  fontWeight: 600,

  verticalAlign: "top",

};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};
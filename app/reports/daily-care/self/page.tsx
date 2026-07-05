"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { selfDailyCareStorage } from "@/lib/storage/SelfDailyCareStorage";
import type { SelfDailyCare } from "@/lib/types/selfDailyCare";

import { authService } from "@/lib/auth/authService";

import {
  formatRecordedDate,
} from "@/lib/utils/displayFormatter";

import ReportNavigation from "@/app/components/common/ReportNavigation";

import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

export default function DailyCareHistoryPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

const [history, setHistory] =
  useState<SelfDailyCare[]>([]);

const [latestRecord, setLatestRecord] =
  useState<SelfDailyCare | null>(null);

const [historyRecords, setHistoryRecords] =
  useState<SelfDailyCare[]>([]);

const [profileName, setProfileName] =
  useState("");

const [error, setError] =
  useState("");

//------------------------------------------------------------
// Load History
//------------------------------------------------------------

useEffect(() => {

  const loadHistory = async () => {

    try {

      setLoading(true);

const user =
  await authService.getCurrentUser();

setProfileName(
  user?.user_metadata?.full_name ??
  "User"
);


const result =
  await selfDailyCareStorage.getUserHistory();

      if (!result.success) {

        setError(
          result.error ??
          "Unable to load Daily Care history."
        );

        return;

      }

      const records =
        result.data ?? [];

void analyticsService.track({

  module:
    ANALYTICS_MODULES.REPORTS,

  eventName:
    ANALYTICS_EVENTS.VIEWED,

  context:
    ANALYTICS_CONTEXTS.SELF,

  pagePath:
    "/reports/daily-care/self",

  metadata: {

    reportCategory:
      "DAILY_CARE",

    viewType:
      "HISTORY",

    recordCount:
      records.length,

  },

});

      setHistory(records);

      if (records.length > 0) {

        setLatestRecord(
          records[0]
        );

        setHistoryRecords(
          records.slice(1)
        );

      } else {

        setLatestRecord(null);

        setHistoryRecords([]);

      }

    }
    finally {

      setLoading(false);

    }

  };

  loadHistory();

}, []);

  //------------------------------------------------------------
  // Loading
  //------------------------------------------------------------

  if (loading) {

    return (

      <main style={loadingStyle}>

        <h2>

          Loading...

        </h2>

      </main>

    );

  }

  //------------------------------------------------------------
  // Page
  //------------------------------------------------------------

  return (

    <main style={pageStyle}>

      <div style={containerStyle}>

        <h1>

          📋 Daily Care History

        </h1>

<div
  style={{
    marginBottom: "24px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#fafafa",
  }}
>
  <div
    style={{
      fontWeight: 600,
      marginBottom: "10px",
    }}
  >
    Patient
  </div>

  <div
    style={{
      fontSize: "16px",
      color: "#111827",
    }}
  >
    👤 {profileName || "Loading..."}
  </div>

</div>

        <p
          style={{
            color:"#6b7280",
            marginBottom:"24px"
          }}
        >
          Latest entries are shown first.
        </p>

        {error && (

          <div style={errorStyle}>

            {error}

          </div>

        )}

        {!error &&
         history.length === 0 && (

          <div style={emptyStyle}>

            No Daily Care records found.

          </div>

        )}

{latestRecord && (

  <div
    style={{
      marginBottom: "32px",
      padding: "24px",
      border: "2px solid #16a34a",
      borderRadius: "16px",
      background: "#f0fdf4",
    }}
  >

    <h2
      style={{
        marginTop: 0,
        marginBottom: "20px",
      }}
    >
      🟢 Latest Daily Care
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        rowGap: "14px",
        columnGap: "30px",
      }}
    >

      <div>
        <strong>Date</strong><br />
{latestRecord
  ? formatRecordedDate(latestRecord.recordedAt)
  : ""}

      </div>

      <div>
<strong>Temperature</strong><br />
{latestRecord.temperature != null
  ? `${latestRecord.temperature}°${latestRecord.temperatureUnit}`
  : "Not Recorded"}
      </div>

      <div>
        <strong>Blood Pressure</strong><br />
        {latestRecord.systolic &&
        latestRecord.diastolic
          ? `${latestRecord.systolic}/${latestRecord.diastolic}`
          : "Not Recorded"}
      </div>

      <div>
        <strong>Pulse</strong><br />
        {latestRecord.pulse ?? "Not Recorded"}
      </div>

      <div>
        <strong>SpO₂</strong><br />
        {latestRecord.spo2
          ? `${latestRecord.spo2}%`
          : "Not Recorded"}
      </div>

    </div>

    <button
      style={{
        marginTop: "24px",
      }}
      onClick={() =>
        router.push(
`/reports/daily-care/self/${latestRecord.id}`
)
      }
    >
      View Details
    </button>

  </div>

)}

        {historyRecords.length > 0 && (

  <>

    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      📚 History
    </h2>

<div style={tableContainerStyle}>

  <table style={tableStyle}>

            <thead>

 <tr style={tableHeaderRowStyle}>

  <th style={headerCellStyle}>
    Date
  </th>

  <th style={headerCellStyle}>
    Temp
  </th>

  <th style={headerCellStyle}>
    BP
  </th>

  <th style={headerCellStyle}>
    Pulse
  </th>

  <th style={headerCellStyle}>
    SpO₂
  </th>

  <th style={headerCellStyle}>
    Action
  </th>

</tr>

            </thead>

            <tbody>

              {historyRecords.map(record => (

<tr
  key={record.id}
  style={tableRowStyle}
>

<td style={tableCellStyle}>

{formatRecordedDate(record.recordedAt)}

                  </td>

<td style={tableCellStyle}>

{record.temperature != null
  ? `${record.temperature}°${record.temperatureUnit}`
  : "-"}

                  </td>

<td style={tableCellStyle}>

                    {record.systolic &&
                     record.diastolic
                      ? `${record.systolic}/${record.diastolic}`
                      : "-"}

                  </td>

<td style={tableCellStyle}>

                    {record.pulse ?? "-"}

                  </td>

<td style={tableCellStyle}>

                    {record.spo2
                      ? `${record.spo2}%`
                      : "-"}

                  </td>

<td style={tableCellStyle}>

                    <button
                      style={viewButtonStyle}
                      onClick={() =>
                        router.push(
`/reports/daily-care/self/${record.id}`
)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

</table>

</div>

  </>

)}

<ReportNavigation
  backLabel="Back to Reports"
  backHref="/reports"
  showReportsButton={true}
  showDashboardButton={true}
/>

      </div>

    </main>

  );

}

const loadingStyle: React.CSSProperties = {
  minHeight:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#f8fafc",
};

const pageStyle: React.CSSProperties = {
  minHeight:"100vh",
  background:"#f8fafc",
  padding:"24px",
  fontFamily:"Inter, Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth:"1200px",
  margin:"0 auto",
  background:"#fff",
  borderRadius:"16px",
  padding:"32px",
  border:"1px solid #e5e7eb",
};

const errorStyle: React.CSSProperties = {
  padding:"16px",
  borderRadius:"8px",
  background:"#fef2f2",
  color:"#991b1b",
};

const emptyStyle: React.CSSProperties = {
  padding:"40px",
  textAlign:"center",
  color:"#6b7280",
};

const tableStyle: React.CSSProperties = {

  width:"100%",

  minWidth:"720px",

  borderCollapse:"collapse",

};

const tableContainerStyle: React.CSSProperties = {

  border: "1px solid #e5e7eb",

  borderRadius: "12px",

  overflowX: "auto",

  overflowY: "hidden",

  WebkitOverflowScrolling: "touch",

  background: "#ffffff",

};

const tableHeaderRowStyle: React.CSSProperties = {
  background: "#f8fafc",
};

const headerCellStyle: React.CSSProperties = {
  padding: "16px",
  textAlign: "left",
  fontWeight: 700,
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #f1f5f9",
};

const tableCellStyle: React.CSSProperties = {
  padding: "16px",
  verticalAlign: "middle",
};

const viewButtonStyle: React.CSSProperties = {
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 18px",
  cursor: "pointer",
  fontWeight: 600,
};
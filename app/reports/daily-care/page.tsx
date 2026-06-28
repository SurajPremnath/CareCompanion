"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { dailyCareStorage } from "@/lib/storage/DailyCareStorage";
import type { DailyCare } from "@/lib/types/dailyCare";

import { patientStorage } from "@/lib/storage/patientStorage";
import type { Patient } from "@/lib/types/patient";

export default function DailyCareHistoryPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [history, setHistory] =
    useState<DailyCare[]>([]);

  const [latestRecord, setLatestRecord] =
    useState<DailyCare | null>(null);

  const [historyRecords, setHistoryRecords] =
    useState<DailyCare[]>([]);

  const [error, setError] =
    useState("");

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

//------------------------------------------------------------
// Load Patients
//------------------------------------------------------------

useEffect(() => {

  const loadPatients = async () => {

    try {

      const result =
        await patientStorage.getPatients();

      if (!result.success) {

        setError(
          result.error ??
          "Unable to load patients."
        );

        setLoading(false);

        return;

      }

      const loadedPatients =
        result.data ?? [];

      setPatients(
        loadedPatients
      );

      if (loadedPatients.length > 0) {

        setSelectedPatientId(
          loadedPatients[0].id
        );

      } else {

        setLoading(false);

      }

    }
    catch {

      setError(
        "Unable to load patients."
      );

      setLoading(false);

    }

  };

  loadPatients();

}, []);


//------------------------------------------------------------
// Load History
//------------------------------------------------------------

useEffect(() => {

  if (!selectedPatientId) {

    return;

  }

  const loadHistory = async () => {

    try {

      setLoading(true);

      const result =
        await dailyCareStorage.getPatientHistory(
          selectedPatientId
        );

      if (!result.success) {

        setError(
          result.error ??
          "Unable to load Daily Care history."
        );

        return;

      }

      const records =
        result.data ?? [];

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

}, [selectedPatientId]);

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

  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: "10px",
    }}
  >
    Patient
  </label>

  <select
    value={selectedPatientId}
    onChange={(e) =>
      setSelectedPatientId(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "15px",
    }}
  >
    {patients.map((patient) => (
      <option
        key={patient.id}
        value={patient.id}
      >
        {patient.fullName}
      </option>
    ))}
  </select>

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
        {new Date(
          latestRecord.recordedAt
        ).toLocaleString()}
      </div>

      <div>
        <strong>Temperature</strong><br />
        {latestRecord.temperature}°
        {latestRecord.temperatureUnit}
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
          `/reports/daily-care/${latestRecord.id}`
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

          <table style={tableStyle}>

            <thead>

              <tr>

                <th>Date</th>

                <th>Temp</th>

                <th>BP</th>

                <th>Pulse</th>

                <th>SpO₂</th>

                <th></th>

              </tr>

            </thead>

            <tbody>

              {historyRecords.map(record => (

                <tr key={record.id}>

                  <td>

                    {new Date(
                      record.recordedAt
                    ).toLocaleString()}

                  </td>

                  <td>

                    {record.temperature}°
                    {record.temperatureUnit}

                  </td>

                  <td>

                    {record.systolic &&
                     record.diastolic
                      ? `${record.systolic}/${record.diastolic}`
                      : "-"}

                  </td>

                  <td>

                    {record.pulse ?? "-"}

                  </td>

                  <td>

                    {record.spo2
                      ? `${record.spo2}%`
                      : "-"}

                  </td>

                  <td>

                    <button
                      onClick={() =>
                        router.push(
                          `/reports/daily-care/${record.id}`
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

  </>

)}

        <button
          style={backButtonStyle}
          onClick={() =>
            router.push("/reports")
          }
        >
          ← Back to Reports
        </button>

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
  borderCollapse:"collapse",
};

const backButtonStyle: React.CSSProperties = {
  marginTop:"24px",
  width:"100%",
  padding:"14px",
  borderRadius:"10px",
  border:"1px solid #d1d5db",
  cursor:"pointer",
};
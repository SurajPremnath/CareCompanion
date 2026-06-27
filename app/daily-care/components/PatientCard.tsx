"use client";

import type { Patient } from "@/lib/types/patient";

import {
  cardStyle,
  inputStyle,
  labelStyle,
  sectionTitle,
  twoColumnGrid
} from "../styles";

interface PatientCardProps {

  patients: Patient[];

  loading: boolean;

  disabled?: boolean;

  patientId: string;

  date: string;

  time: string;

  onPatientChange: (value: string) => void;

  onDateChange: (value: string) => void;

  onTimeChange: (value: string) => void;

}

export default function PatientCard({

  patients,

  loading,

  disabled = false,

  patientId,

  date,

  time,

  onPatientChange,

  onDateChange,

  onTimeChange

}: PatientCardProps) {

  return (

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        👤 Patient Information
      </h3>

      <label style={labelStyle}>
        Patient *
      </label>

      <select
        value={patientId}
        disabled={loading || disabled}
        onChange={(e) =>
          onPatientChange(e.target.value)
        }
        style={inputStyle}
      >

        <option value="">
          Select Patient
        </option>

        {patients.map((patient) => (

          <option
            key={patient.id}
            value={patient.id}
          >
            {patient.fullName}
          </option>

        ))}

      </select>

 <div
  style={{
    ...twoColumnGrid,
    marginTop: "20px"
  }}
>

        <div>

          <label style={labelStyle}>
            Date *
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              onDateChange(e.target.value)
            }
            style={inputStyle}
          />

        </div>

        <div>

          <label style={labelStyle}>
            Time *
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              onTimeChange(e.target.value)
            }
            style={inputStyle}
          />

        </div>

      </div>

    </section>

  );

}


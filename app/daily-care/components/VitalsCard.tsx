"use client";

import {
  cardStyle,
  collapseButton,
  fourColumnGrid,
  inputStyle,
  labelStyle
} from "../styles";

interface VitalsCardProps {

  expanded: boolean;

  disabled?: boolean;

  systolic: string;

  diastolic: string;

  pulse: string;

  spo2: string;

  onToggle: () => void;

  onSystolicChange: (value: string) => void;

  onDiastolicChange: (value: string) => void;

  onPulseChange: (value: string) => void;

  onSpo2Change: (value: string) => void;

}

export default function VitalsCard({

  expanded,

  disabled = false,

  systolic,

  diastolic,

  pulse,

  spo2,

  onToggle,

  onSystolicChange,

  onDiastolicChange,

  onPulseChange,

  onSpo2Change

}: VitalsCardProps) {

  return (

    <section style={cardStyle}>

      <button
        type="button"
        onClick={onToggle}
        style={collapseButton}
      >

        {expanded ? "▼" : "▶"} Additional Vitals

      </button>

      {expanded && (

<>
    <h3
      style={{
        marginTop: "20px",
        marginBottom: "16px",
        fontSize: "18px",
        fontWeight: 600,
        color: "#1f2937",
      }}
    >
      🩺 Blood Pressure
    </h3>

        <div
          style={{
            ...fourColumnGrid
          }}
        >

          <div>

            <label style={labelStyle}>
    minHeight: "48px",
    display: "block",
              Upper (Systolic)
            </label>

            <input
              type="number"
              value={systolic}
              disabled={disabled}
              onChange={(e) =>
                onSystolicChange(
                  e.target.value
                )
              }
              style={inputStyle}
            />

          </div>

          <div>

            <label style={labelStyle}>
    minHeight: "48px",
    display: "block",
              Lower (Diastolic)
            </label>

            <input
              type="number"
              value={diastolic}
              disabled={disabled}
              onChange={(e) =>
                onDiastolicChange(
                  e.target.value
                )
              }
              style={inputStyle}
            />

          </div>

          <div>

            <label style={labelStyle}>
    minHeight: "48px",
    display: "block",
              Pulse Rate
            </label>

            <input
              type="number"
              value={pulse}
              disabled={disabled}
              onChange={(e) =>
                onPulseChange(
                  e.target.value
                )
              }
              style={inputStyle}
            />

          </div>

          <div>

            <label style={labelStyle}>
    minHeight: "48px",
    display: "block",
              SpO₂
            </label>

            <input
              type="number"
              value={spo2}
              disabled={disabled}
              onChange={(e) =>
                onSpo2Change(
                  e.target.value
                )
              }
              style={inputStyle}
            />

          </div>

        </div>

</>

      )}

    </section>

  );

}
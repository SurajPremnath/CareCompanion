"use client";

import {
  cardStyle,
  collapseButton,
  fourColumnGrid,
  inputStyle,
  labelStyle
} from "../styles";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

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

  const {
    t,
  } = useLanguage();

  return (

    <section
    className="vitals-card"
    style={cardStyle}
>

<button
    type="button"
    className="vitals-collapse-button"
    onClick={onToggle}
    style={collapseButton}
>
    {expanded ? "▼" : "▶"} {t("dailyCare.additionalVitals")}
</button>

      {expanded && (

<>
<h3
    className="vitals-section-title"
    style={{
        marginTop: "20px",
        marginBottom: "16px",
        fontSize: "18px",
        fontWeight: 600,
        color: "#1f2937",
    }}
>
    🩺 {t("dailyCare.bloodPressure")}
</h3>

        <div
className="vitals-grid"
          style={{
            ...fourColumnGrid
          }}
        >

<div className="vital-field">
    <label
        className="vital-label"
        style={labelStyle}
    >
        {t("dailyCare.systolic")}
    </label>

    <input
        className="vital-input"
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

<div className="vital-field">
    <label
        className="vital-label"
        style={labelStyle}
    >
        {t("dailyCare.diastolic")}
    </label>

    <input
        className="vital-input"
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

<div className="vital-field">
    <label
        className="vital-label"
        style={labelStyle}
    >
        {t("dailyCare.pulseRate")}
    </label>

    <input
        className="vital-input"
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

<div className="vital-field">
    <label
        className="vital-label"
        style={labelStyle}
    >
        {t("dailyCare.spo2")}
    </label>

    <input
        className="vital-input"
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

      <style jsx>{`
@media (max-width: 640px) {

    .vitals-card {
        padding: 10px !important;
        margin-bottom: 8px !important;
    }

    .vitals-collapse-button {
        font-size: 14px !important;
        line-height: 1.2 !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .vitals-section-title {
        margin-top: 2px !important;
        margin-bottom: 6px !important;
        font-size: 14px !important;
        line-height: 1.2 !important;
    }

    .vitals-grid {
        grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr) !important;

        gap: 7px !important;
    }

    .vital-field {
        min-width: 0 !important;
    }

    .vital-label {
        display: block !important;
        font-size: 11px !important;
        line-height: 1.2 !important;
        margin-bottom: 3px !important;
    }

    .vital-input {
        width: 100% !important;
        min-width: 0 !important;
        height: 36px !important;
        box-sizing: border-box !important;
        padding: 6px 8px !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
    }
}
      `}</style>

    </section>

  );

}
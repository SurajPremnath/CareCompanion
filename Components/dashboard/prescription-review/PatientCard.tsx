/* PatientCard.tsx — complete responsive revamp */

"use client";

import { useState } from "react";
import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
  ExtractedPrescription,
  ConsultationMode,
} from "@/lib/prescription-image/prescriptionImageTypes";

export type PrescriptionDisplayMode =
  | "PRESCRIPTION"
  | "DOCTOR_NOTES";

interface PatientCardProps {
  prescription: ExtractedPrescription;
  patientName: string;
  consultationMode: ConsultationMode;
  readOnly: boolean;
  mode?: PrescriptionDisplayMode;
  onConsultationModeChange: (value: ConsultationMode) => void;
  onConsultationDateChange: (value: string) => void;
}

const CONSULTATION_OPTIONS = [
  "IN_PERSON",
  "VIDEO",
  "PHONE",
  "WHATSAPP",
  "EMAIL",
  "HOME_VISIT",
  "HOSPITAL_ADMISSION",
  "HOSPITAL_DISCHARGE",
  "OTHER",
] as const;

type PatientPanelTab = "PRIMARY" | "SECONDARY" | "HIDDEN";

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("-");
}

function toTitleCase(value?: string | null) {
  if (!value) return "-";

  return value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatConsultationMode(value?: string | null) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function InformationItem({
  label,
  value,
  unavailable = false,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  unavailable?: boolean;
  className?: string;
}) {
  return (
    <div className={`patient-info-item ${className}`}>
      <div className="patient-info-label">{label}</div>
      <div
        className={
          unavailable
            ? "patient-info-value patient-info-value-unavailable"
            : "patient-info-value"
        }
      >
        {value}
      </div>
    </div>
  );
}

const styles = `
.patient-information-panels {
  width: 100%;
  box-sizing: border-box;
}

.patient-panel-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  width: 100%;
  margin-bottom: 16px;
  padding: 5px;
  box-sizing: border-box;
  background: #f1f5f9;
  border-radius: 12px;
}

.patient-panel-tab {
  min-width: 0;
  border: 1px solid transparent;
  background: transparent;
  color: #475569;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.patient-panel-tab.active {
  border-color: #2563eb;
  background: #ffffff;
  color: #1d4ed8;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.10);
}

.patient-information-panel {
  width: 100%;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
}

.patient-primary-panel {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.patient-secondary-panel {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.patient-hidden-panel {
  background: #faf5ff;
  border: 1px solid #ddd6fe;
}

.patient-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.patient-panel-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.patient-panel-icon {
  flex: 0 0 auto;
  font-size: 22px;
}

.patient-panel-title {
  margin: 0;
  color: #0f172a;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
}

.patient-panel-subtitle {
  margin: 3px 0 0;
  color: #64748b;
  font-size: 12px;
}

.patient-panel-badge {
  flex: 0 0 auto;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.patient-primary-badge {
  background: #dcfce7;
  color: #15803d;
}

.patient-secondary-badge {
  background: #dbeafe;
  color: #1d4ed8;
}

.patient-hidden-badge {
  background: #ede9fe;
  color: #7c3aed;
}

/* Primary layout: 6 columns on desktop */
.patient-primary-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

.patient-primary-name {
  grid-column: span 4;
}

.patient-primary-age,
.patient-primary-sex {
  grid-column: span 1;
}

.patient-primary-half {
  grid-column: span 3;
}

.patient-primary-full {
  grid-column: 1 / -1;
}

/* Secondary / hidden layout */
.patient-secondary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

.patient-secondary-full {
  grid-column: 1 / -1;
}

.patient-info-item {
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  padding: 10px 12px;
  box-sizing: border-box;
}

.patient-info-label {
  margin-bottom: 4px;
  color: #64748b;
  font-size: 11px;
  line-height: 1.3;
  font-weight: 700;
}

.patient-info-value {
  color: #0f172a;
  font-size: 14px;
  line-height: 1.35;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.patient-info-value-unavailable {
  color: #94a3b8;
  font-weight: 500;
}

.patient-date-editor {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
  max-width: 300px;
}

.patient-date-editor input,
.patient-mode-select {
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
}

.patient-date-helper {
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
}

.patient-date-warning {
  color: #b45309;
  font-size: 11px;
  line-height: 1.35;
}

@media (max-width: 700px) {
  .patient-information-panel {
    padding: 14px;
    border-radius: 14px;
    overflow: hidden;
  }

  .patient-panel-tabs {
    gap: 4px;
    padding: 4px;
  }

  .patient-panel-tab {
    padding: 9px 5px;
    font-size: 13px;
  }

  .patient-panel-header {
    align-items: flex-start;
  }

  .patient-panel-title {
    font-size: 17px;
    overflow-wrap: anywhere;
  }

  .patient-panel-badge {
    font-size: 10px;
  }

  /* Mobile: 2 columns */
  .patient-primary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .patient-primary-name,
  .patient-primary-full {
    grid-column: 1 / -1;
  }

  .patient-primary-age,
  .patient-primary-sex,
  .patient-primary-half {
    grid-column: span 1;
  }

  .patient-secondary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .patient-info-item {
    padding: 9px 10px;
  }

  .patient-info-label {
    font-size: 10px;
  }

  .patient-info-value {
    font-size: 13px;
  }

  .patient-date-editor,
  .patient-date-editor input,
  .patient-mode-select {
    max-width: 100%;
  }
}
`;

export default function PatientCard({
  prescription,
  patientName,
  consultationMode,
  readOnly,
  onConsultationModeChange,
  onConsultationDateChange,
}: PatientCardProps) {
  const [activePatientPanel, setActivePatientPanel] =
    useState<PatientPanelTab>("PRIMARY");

  const hospitalName = expandMedicalText(
    toTitleCase(prescription.encounterIdentity.hospitalOrClinic)
  );

  const extractedConsultationMode =
    prescription.encounterIdentity.consultationMode ??
    consultationMode;

  const patientDisplayName =
    prescription.patientIdentity.patientName ||
    patientName ||
    "-";

  const doctorName =
    prescription.encounterIdentity.doctorName || "-";

  const doctorType =
    prescription.encounterIdentity.doctorType;

  const consultationDate =
    prescription.encounterIdentity.consultationDate;

  return (
    <section className="patient-information-panels">
      <style>{styles}</style>

      {/* ======================================================
          PANEL NAVIGATION
          ====================================================== */}

      <div className="patient-panel-tabs">
        {[
          { key: "PRIMARY" as const, label: "Primary", icon: "👤" },
          { key: "SECONDARY" as const, label: "Secondary", icon: "ℹ️" },
          { key: "HIDDEN" as const, label: "Hidden", icon: "🔒" },
        ].map((tab) => {
          const isActive = activePatientPanel === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              className={`patient-panel-tab${isActive ? " active" : ""}`}
              onClick={() => setActivePatientPanel(tab.key)}
            >
              <span style={{ marginRight: "6px" }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ======================================================
          PRIMARY INFORMATION
          ====================================================== */}

      {activePatientPanel === "PRIMARY" && (
        <section className="patient-information-panel patient-primary-panel">
          <div className="patient-panel-header">
            <div className="patient-panel-heading">
              <span className="patient-panel-icon">👤</span>
              <div>
                <h3 className="patient-panel-title">
                  Primary Information
                </h3>
                <p className="patient-panel-subtitle">
                  Essential information at a glance
                </p>
              </div>
            </div>

          </div>

          <div className="patient-primary-grid">
            <InformationItem
              className="patient-primary-name"
              label="Patient Name"
              value={patientDisplayName}
            />

<InformationItem
  className="patient-primary-age"
  label="Age*"
  value={
    prescription.patientIdentity.patientAge ||
    "-"
  }
  unavailable={
    !prescription.patientIdentity.patientAge
  }
/>

<InformationItem
  className="patient-primary-sex"
  label="Sex*"
  value={
    prescription.patientIdentity.patientGender ||
    "-"
  }
  unavailable={
    !prescription.patientIdentity.patientGender
  }
/>

<div
  className="patient-primary-full"
  style={{
    fontSize: "11px",
    lineHeight: 1.4,
    color: "#64748b",
    marginTop: "-2px",
  }}
>
  * AI may not always read handwritten details correctly.
  Please verify and correct if required.
</div>

<InformationItem
  className="patient-primary-half"
  label="Hospital"
  value={hospitalName}
/>

<InformationItem
  className="patient-primary-half"
  label="UHID"
  value={
    prescription.patientIdentity.patientUHID ||
    "-"
  }
  unavailable={
    !prescription.patientIdentity.patientUHID
  }
/>

            <InformationItem
              className="patient-primary-half"
              label="Doctor"
              value={doctorName}
            />

            <InformationItem
              className="patient-primary-half"
              label="Doctor Type / Specialty"
              value={doctorType || "-"}
              unavailable={!doctorType}
            />

<div className="patient-info-item patient-primary-full">
  <div className="patient-info-label">
    Consultation Date*
  </div>

  {readOnly ? (
    <div className="patient-info-value">
      {formatDate(consultationDate)}
    </div>
  ) : (
    <div className="patient-date-editor">
      <input
        type="date"
        value={
          consultationDate
            ? new Date(consultationDate)
                .toISOString()
                .split("T")[0]
            : ""
        }
        onChange={(event) =>
          onConsultationDateChange(event.target.value)
        }
      />

      <div className="patient-date-warning">
        * AI may not always read handwritten details correctly.
        Please verify and correct if required.
      </div>
    </div>
  )}
</div>
          </div>
        </section>
      )}

      {/* ======================================================
          SECONDARY INFORMATION
          ====================================================== */}

      {activePatientPanel === "SECONDARY" && (
        <section className="patient-information-panel patient-secondary-panel">
          <div className="patient-panel-header">
            <div className="patient-panel-heading">
              <span className="patient-panel-icon">ℹ️</span>
              <div>
                <h3 className="patient-panel-title">
                  Secondary Information
                </h3>
                <p className="patient-panel-subtitle">
                  Additional patient and encounter details
                </p>
              </div>
            </div>

            <span className="patient-panel-badge patient-secondary-badge">
              Expandable
            </span>
          </div>

          <div className="patient-secondary-grid">
            {prescription.patientIdentity.patientDateOfBirth && (
              <InformationItem
                label="Date of Birth"
                value={formatDate(
                  prescription.patientIdentity.patientDateOfBirth
                )}
              />
            )}

            {prescription.patientIdentity.patientNameVariations.length > 0 && (
              <InformationItem
                label="Name Variations / Aliases"
                value={prescription.patientIdentity.patientNameVariations.join(", ")}
              />
            )}

            {prescription.encounterIdentity.hospitalNameVariations.length > 0 && (
              <InformationItem
                className="patient-secondary-full"
                label="Hospital Name Variations"
                value={prescription.encounterIdentity.hospitalNameVariations.join(", ")}
              />
            )}

            <div className="patient-info-item patient-secondary-full">
              <div className="patient-info-label">
                Consultation Mode
              </div>

              {readOnly ? (
                <div className="patient-info-value">
                  {formatConsultationMode(extractedConsultationMode)}
                </div>
              ) : (
                <select
                  className="patient-mode-select"
                  value={extractedConsultationMode}
                  onChange={(event) =>
                    onConsultationModeChange(
                      event.target.value as ConsultationMode
                    )
                  }
                >
                  {CONSULTATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {formatConsultationMode(option)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          HIDDEN / STORAGE INFORMATION
          ====================================================== */}

      {activePatientPanel === "HIDDEN" && (
        <section className="patient-information-panel patient-hidden-panel">
          <div className="patient-panel-header">
            <div className="patient-panel-heading">
              <span className="patient-panel-icon">🔒</span>
              <div>
                <h3 className="patient-panel-title">
                  Hidden / Storage Information
                </h3>

                <p className="patient-panel-subtitle">
                  Temporarily visible for testing. These fields will eventually
                  be stored without being displayed.
                </p>
              </div>
            </div>

            <span className="patient-panel-badge patient-hidden-badge">
              Stored Only
            </span>
          </div>

          <div className="patient-secondary-grid">

            {/* ==================================================
                DEMOGRAPHIC EXTRACTION / FALLBACK
                ================================================== */}

            <InformationItem
              label="Age Flag"
              value={
                prescription.patientIdentity.ageFlag
                  ? "TRUE"
                  : "FALSE"
              }
            />

            <InformationItem
              label="Age Source"
              value={
                prescription.patientIdentity.ageSource ||
                "-"
              }
            />

            <InformationItem
              label="Resolved Age"
              value={
                prescription.patientIdentity.patientAge ||
                "-"
              }
              unavailable={
                !prescription.patientIdentity.patientAge
              }
            />

            <InformationItem
              label="Sex Flag"
              value={
                prescription.patientIdentity.sexFlag
                  ? "TRUE"
                  : "FALSE"
              }
            />

            <InformationItem
              label="Sex Source"
              value={
                prescription.patientIdentity.sexSource ||
                "-"
              }
            />

            <InformationItem
              label="Resolved Sex"
              value={
                prescription.patientIdentity.patientGender ||
                "-"
              }
              unavailable={
                !prescription.patientIdentity.patientGender
              }
            />

            {/* ==================================================
                DOCUMENT METADATA
                ================================================== */}

            {prescription.documentMetadata.studyDateTime && (
              <InformationItem
                label="Report Study Date & Time"
                value={
                  prescription.documentMetadata.studyDateTime
                }
              />
            )}

            {prescription.documentMetadata.reportDateTime && (
              <InformationItem
                label="Report Date & Time"
                value={
                  prescription.documentMetadata.reportDateTime
                }
              />
            )}

            {prescription.documentMetadata.originalPatientName && (
              <InformationItem
                label="Original Patient Name"
                value={
                  prescription.documentMetadata.originalPatientName
                }
              />
            )}

            {prescription.documentMetadata.originalHospitalName && (
              <InformationItem
                label="Original Hospital Name"
                value={
                  prescription.documentMetadata.originalHospitalName
                }
              />
            )}

            <InformationItem
              className="patient-secondary-full"
              label="Source Document Type"
              value={
                prescription.documentMetadata.documentType
              }
            />

          </div>
        </section>
      )}
    </section>
  );
}

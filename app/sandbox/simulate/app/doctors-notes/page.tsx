"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import SandboxMobileHeader, {
  type SandboxCareMode,
  type SandboxRole,
} from "@/app/sandbox/simulate/Components/common/SandboxMobileHeader";

import CareVRFooter from "@/app/sandbox/simulate/Components/common/CareVRFooter";

interface DoctorsNoteDoctorOption {
  providerId: string;
  doctorName: string;
  specialisation: string | null;
  facilityId: string | null;
  facilityName: string | null;
}

export default function DoctorsNotesPage() {
  const router = useRouter();

const [userName] = useState("Sandbox User");

const [careMode, setCareMode] =
  useState<SandboxCareMode>("FAMILY");

const [role, setRole] =
  useState<SandboxRole>("PRIMARY");

const [selectedPatient, setSelectedPatient] =
  useState<string>("");

const [patients, setPatients] =
  useState<
    Array<{
      id: string;
      name: string;
      dateOfBirth: string | null;
      sex: string | null;
    }>
  >([]);

const [doctorOptions, setDoctorOptions] =
  useState<DoctorsNoteDoctorOption[]>([]);

const [doctorSuggestions, setDoctorSuggestions] =
  useState<DoctorsNoteDoctorOption[]>([]);

const [hospitalSuggestions, setHospitalSuggestions] =
  useState<string[]>([]);

const [specialitySuggestions, setSpecialitySuggestions] =
  useState<string[]>([]);

const [selectedDoctorId, setSelectedDoctorId] =
  useState("");

const [doctorName, setDoctorName] =
  useState("");

const [facilityName, setFacilityName] =
  useState("");

const [specialisation, setSpecialisation] =
  useState("");

const [note, setNote] =
  useState("");

const [treatments, setTreatments] = useState<
  Array<{
    id: number;
    medication: string;
    dosage: string;
    duration: string;
  }>
>([
  {
    id: 1,
    medication: "",
    dosage: "",
    duration: "",
  },
]);

const [nextTreatmentId, setNextTreatmentId] = useState(2);
const [showTreatmentHelp, setShowTreatmentHelp] = useState(false);

const [saving, setSaving] =
  useState(false);

const [saveError, setSaveError] =
  useState("");

const [saveSuccess, setSaveSuccess] =
  useState("");

const [previewData, setPreviewData] = useState<{
  doctorName: string;
  hospital: string;
  speciality: string;
  date: string;
  time: string;
  note: string;
  treatments: Array<{
    medication: string;
    dosage: string;
    duration: string;
  }>;
} | null>(null);

const selectedDoctor = useMemo(
  () =>
    doctorOptions.find(
      (doctor) =>
        doctor.providerId === selectedDoctorId
    ) ?? null,
  [doctorOptions, selectedDoctorId],
);

const calculateAge = (dateOfBirth: string | null) => {
  if (!dateOfBirth) {
    return "—";
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} yrs`;
};

useEffect(() => {
  if (!selectedPatient) {
    setDoctorName("");
    setFacilityName("");
    setSpecialisation("");
  }
}, [selectedPatient]);

useEffect(() => {
  const samplePatients = [
    {
      id: "sandbox-patient-1",
      name: "Alex Morgan",
      dateOfBirth: "1960-05-12",
      sex: "Male",
    },
    {
      id: "sandbox-patient-2",
      name: "Jamie Morgan",
      dateOfBirth: "1964-09-23",
      sex: "Female",
    },
  ];

  setPatients(samplePatients);
  setSelectedPatient(samplePatients[0].id);

  setDoctorOptions([]);
  setDoctorSuggestions([]);
  setHospitalSuggestions([]);
  setSpecialitySuggestions([]);
  setSelectedDoctorId("");
}, []);

/*
const patients =
  dashboardHandoff?.patients ?? [];
*/
// Removed.
// Patients now come from DHP.



const handleTreatmentChange = (
  id: number,
  field: "medication" | "dosage" | "duration",
  value: string
) => {
  setTreatments((current) =>
    current.map((treatment) =>
      treatment.id === id
        ? { ...treatment, [field]: value }
        : treatment
    )
  );
};

const handleAddTreatment = () => {
  setTreatments((current) => [
    ...current,
    {
      id: nextTreatmentId,
      medication: "",
      dosage: "",
      duration: "",
    },
  ]);
  setNextTreatmentId((current) => current + 1);
};

const handleRemoveTreatment = (id: number) => {
  setTreatments((current) =>
    current.filter((treatment) => treatment.id !== id)
  );
};

const now = new Date();

const [selectedDate, setSelectedDate] = useState(
  now.toISOString().slice(0, 10)
);

const [selectedTime, setSelectedTime] = useState(
  now.toTimeString().slice(0, 5)
);

const handleSave = () => {
  setSaveError("");
  setSaveSuccess("");
  setPreviewData(null);

  const completedTreatments = treatments
    .filter((treatment) => treatment.medication.trim())
    .map((treatment) => ({
      medication: treatment.medication.trim(),
      dosage: treatment.dosage.trim(),
      duration: treatment.duration.trim(),
    }));

  if (!doctorName.trim()) {
    setSaveError("Please enter the doctor's name.");
    return;
  }

  if (!selectedDate || !selectedTime) {
    setSaveError("Please select the date and time.");
    return;
  }

  if (!note.trim() && completedTreatments.length === 0) {
    setSaveError(
      "Please enter treatment details or clinical notes."
    );
    return;
  }

  const noteDateTime = new Date(
    `${selectedDate}T${selectedTime}`
  );

  if (Number.isNaN(noteDateTime.getTime())) {
    setSaveError("The selected date and time are invalid.");
    return;
  }

  setPreviewData({
    doctorName: doctorName.trim(),
    hospital: facilityName.trim(),
    speciality: specialisation.trim(),
    date: selectedDate,
    time: selectedTime,
    note: note.trim(),
    treatments: completedTreatments,
  });
};

return (
    <main className="doctors-notes-page">

<SandboxMobileHeader
  careMode={careMode}
  onCareModeChange={setCareMode}
  userName={userName}
  role={role}
  onRoleChange={setRole}
/>

<section className="page-content">
    <section className="card patient-section">
          <div className="section-heading">
            <div>
              <h2>Select Patient</h2>
              <p>Choose the patient this note belongs to.</p>
            </div>
          </div>

          <div className="patient-grid">
            {patients.map((patient) => {
              const isSelected = selectedPatient === patient.id;

              return (
                <button
                  key={patient.id}
                  type="button"
                  className={`patient-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedPatient(patient.id)}
                >


<span className="patient-details">
  <strong>{patient.name}</strong>
  <small>
    {calculateAge(patient.dateOfBirth)}
    {" · "}
    {patient.sex ?? "—"}
  </small>
</span>


                  <span className={`selection-dot ${isSelected ? "checked" : ""}`}>
                    {isSelected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card doctor-section">
          <div className="section-heading">
            <div>
              <h2>Doctor Information</h2>
<p>
  {role === "DOCTOR"
    ? "Your professional details will be attached to this note."
    : "Select the doctor associated with this note."}
</p>
            </div>
          </div>

          {role === "DOCTOR" ? (
            <div className="doctor-profile">
              <div className="doctor-avatar">
  {selectedDoctor?.doctorName
    ?.replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "DR"}
</div>

              <div className="doctor-profile-details">
<strong>
  {selectedDoctor?.doctorName ??
    "No doctor associated"}
</strong>

<div className="doctor-meta">
  <span>
    {selectedDoctor?.facilityName ??
      "No hospital associated"}
  </span>

  <span>
    {selectedDoctor?.specialisation ??
      "No specialisation available"}
  </span>
</div>
              </div>
            </div>
          ) : (
<div className="selection-fields">
  <label>
    <span>Doctor</span>
    <input
      type="text"
      list="doctors-note-doctor-suggestions"
      value={doctorName}
      onChange={(event) => {
        const value = event.target.value;
        setDoctorName(value);

        const matchedDoctor = doctorSuggestions.find(
          (doctor) =>
            doctor.doctorName.trim().toLowerCase() ===
            value.trim().toLowerCase(),
        );

        if (matchedDoctor) {
          setSelectedDoctorId(matchedDoctor.providerId);

          if (matchedDoctor.facilityName) {
            setFacilityName(matchedDoctor.facilityName);
          }

          if (matchedDoctor.specialisation) {
            setSpecialisation(matchedDoctor.specialisation);
          }
        } else {
          setSelectedDoctorId("");
        }
      }}
      placeholder="Search or enter doctor name"
      autoComplete="off"
    />
    <datalist id="doctors-note-doctor-suggestions">
      {doctorSuggestions.map((doctor) => (
        <option
          key={doctor.providerId}
          value={doctor.doctorName}
        />
      ))}
    </datalist>
  </label>

  <label>
    <span>Hospital</span>
    <input
      type="text"
      list="doctors-note-hospital-suggestions"
      value={facilityName}
      onChange={(event) =>
        setFacilityName(event.target.value)
      }
      placeholder="Search or enter hospital name"
      autoComplete="off"
    />
    <datalist id="doctors-note-hospital-suggestions">
      {hospitalSuggestions.map((hospital) => (
        <option key={hospital} value={hospital} />
      ))}
    </datalist>
  </label>

  <label>
    <span>Specialisation</span>
    <input
      type="text"
      list="doctors-note-speciality-suggestions"
      value={specialisation}
      onChange={(event) =>
        setSpecialisation(event.target.value)
      }
      placeholder="Search or enter speciality"
      autoComplete="off"
    />
    <datalist id="doctors-note-speciality-suggestions">
      {specialitySuggestions.map((speciality) => (
        <option key={speciality} value={speciality} />
      ))}
    </datalist>
  </label>
</div>
          )}
        </section>

<section className="date-time-grid">
  <div className="card compact-field">
    <label htmlFor="note-date" className="field-label">
      Date
    </label>

    <input
      id="note-date"
      type="date"
      value={selectedDate}
      onChange={(event) => setSelectedDate(event.target.value)}
    />
  </div>

  <div className="card compact-field">
    <label htmlFor="note-time" className="field-label">
      Time
    </label>

    <input
      id="note-time"
      type="time"
      value={selectedTime}
      onChange={(event) => setSelectedTime(event.target.value)}
    />
  </div>
</section>


<section className="card treatment-section">
  <div className="section-heading treatment-heading">
    <div>
      <h2>Treatment Information</h2>
      <p>
        Record the treatment or medication as prescribed.
      </p>
    </div>

    <button
      type="button"
      className="treatment-help-button"
      onClick={() => setShowTreatmentHelp(true)}
      aria-haspopup="dialog"
    >
      <span aria-hidden="true">ⓘ</span> Help &amp; Example
    </button>
  </div>

  <div className="treatment-column-headings">
    <span>Treatment / Medication</span>
    <span>Dosage</span>
    <span>Duration</span>
    <span aria-hidden="true" />
  </div>

  <div className="treatment-rows">
    {treatments.map((treatment, index) => (
      <div className="treatment-row" key={treatment.id}>
        <label>
          <span className="mobile-field-label">
            Treatment / Medication
          </span>
          <input
            type="text"
            value={treatment.medication}
            onChange={(event) =>
              handleTreatmentChange(
                treatment.id,
                "medication",
                event.target.value
              )
            }
            maxLength={150}
            placeholder="Enter name"
            aria-label={`Treatment or medication ${index + 1}`}
          />
        </label>

        <label>
          <span className="mobile-field-label">Dosage</span>
          <input
            type="text"
            value={treatment.dosage}
            onChange={(event) =>
              handleTreatmentChange(
                treatment.id,
                "dosage",
                event.target.value
              )
            }
            maxLength={100}
            placeholder="Enter dosage"
            aria-label={`Dosage ${index + 1}`}
          />
        </label>

        <label>
          <span className="mobile-field-label">Duration</span>
          <input
            type="text"
            value={treatment.duration}
            onChange={(event) =>
              handleTreatmentChange(
                treatment.id,
                "duration",
                event.target.value
              )
            }
            maxLength={100}
            placeholder="Enter duration"
            aria-label={`Duration ${index + 1}`}
          />
        </label>

        <button
          type="button"
          className="remove-treatment-button"
          onClick={() => handleRemoveTreatment(treatment.id)}
          disabled={treatments.length === 1}
          aria-label={`Remove treatment ${index + 1}`}
          title="Remove treatment"
        >
          ×
        </button>
      </div>
    ))}
  </div>

  <button
    type="button"
    className="add-treatment-button"
    onClick={handleAddTreatment}
    disabled={treatments.length >= 20}
  >
    + Add another treatment
  </button>

  {showTreatmentHelp && (
    <div
      className="treatment-help-overlay"
      onClick={() => setShowTreatmentHelp(false)}
    >
      <section
        className="treatment-help-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="treatment-help-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="treatment-help-title-row">
          <h3 id="treatment-help-title">Help &amp; Example</h3>
          <button
            type="button"
            className="treatment-help-close"
            onClick={() => setShowTreatmentHelp(false)}
            aria-label="Close help"
          >
            ×
          </button>
        </div>

        <p>
          Enter the information provided by the treating doctor.
          Add each medication or treatment on a separate row.
        </p>

        <div className="treatment-example">
          <div>
            <strong>Treatment / Medication</strong>
            <span>Enter the name as prescribed.</span>
          </div>
          <div>
            <strong>Dosage</strong>
            <span>Enter the prescribed amount and frequency, if known.</span>
          </div>
          <div>
            <strong>Duration</strong>
            <span>Enter the prescribed period or ongoing duration.</span>
          </div>
        </div>

        <p className="treatment-help-note">
          Example format only — not medical advice. Do not guess
          a medicine, dosage, or duration. Leave unknown details blank.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowTreatmentHelp(false)}
        >
          Got it
        </button>
      </section>
    </div>
  )}
</section>


        <section className="card note-section">
          <div className="section-heading note-heading">
            <div>
              <h2>Doctor&apos;s Note</h2>
              <p>Write your observations, assessment or recommendations.</p>
            </div>

            <span className="character-count">{note.length} / 2000</span>
          </div>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, 2000))}
            maxLength={2000}
            placeholder="Start writing the doctor&apos;s note..."
            rows={8}
          />
        </section>

<div className="actions">
  <button
    type="button"
    className="secondary-button"
    onClick={() =>
      router.push("/sandbox/simulate/app/dashboard")
    }
  >
    Cancel
  </button>

  <button
    type="button"
    className="primary-button"
    onClick={handleSave}
    disabled={
      !doctorName.trim() ||
      !selectedDate ||
      !selectedTime ||
      (
        !note.trim() &&
        !treatments.some(
          (treatment) =>
            treatment.medication.trim().length > 0
        )
      )
    }
  >
    Preview Executive Summary
  </button>
</div>

{previewData && (
  <section
    className="executive-summary-preview"
    aria-live="polite"
    style={{
      marginTop: "16px",
      padding: "16px",
      border: "1px solid #dbe4f0",
      borderRadius: "14px",
      background: "#ffffff",
      color: "#172554",
    }}
  >
    <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>
      Executive Summary Preview
    </h2>

    <p
      style={{
        margin: "0 0 20px",
        color: "#64748b",
        fontSize: "13px",
      }}
    >
      Simulation only — nothing has been saved.
    </p>

    <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
      Treatment
    </h3>

    <p>
      <strong>Doctor:</strong> {previewData.doctorName}
    </p>

    {previewData.hospital && (
      <p>
        <strong>Hospital:</strong> {previewData.hospital}
      </p>
    )}

    {previewData.speciality && (
      <p>
        <strong>Speciality:</strong> {previewData.speciality}
      </p>
    )}

    <p>
      <strong>Date and time:</strong>{" "}
      {previewData.date} at {previewData.time}
    </p>

    {previewData.treatments.length > 0 ? (
      <ul>
        {previewData.treatments.map((treatment, index) => (
          <li key={`${treatment.medication}-${index}`}>
            <strong>{treatment.medication}</strong>
            {treatment.dosage && ` — ${treatment.dosage}`}
            {treatment.duration && ` — ${treatment.duration}`}
          </li>
        ))}
      </ul>
    ) : (
      <p>No treatment details entered.</p>
    )}

    <div
      style={{
        height: "1px",
        background: "#e2e8f0",
        margin: "20px 0",
      }}
    />

    <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
      Clinical Notes
    </h3>

    {previewData.note ? (
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {previewData.note}
      </p>
    ) : (
      <p>No clinical notes entered.</p>
    )}
  </section>
)}

{saveError && (
  <p
    style={{
      margin: "12px 0 0",
      color: "#b42318",
      fontSize: "13px",
      textAlign: "right",
    }}
  >
    {saveError}
  </p>
)}

{saveSuccess && (
  <p
    style={{
      margin: "12px 0 0",
      color: "#16794c",
      fontSize: "13px",
      textAlign: "right",
    }}
  >
    {saveSuccess}
  </p>
)}
      </section>

      <CareVRFooter />

      <style jsx>{`
        .doctors-notes-page {
          min-height: 100vh;
          color: #172554;
          background:
            radial-gradient(circle at 88% 8%, rgba(196, 181, 253, 0.38), transparent 22%),
            radial-gradient(circle at 8% 38%, rgba(221, 214, 254, 0.42), transparent 25%),
            linear-gradient(145deg, #f1ebff 0%, #eee7fc 48%, #e8e0fb 100%);
        }

        .page-content {
          width: min(940px, calc(100% - 32px));
          margin: 0 auto;
          padding: 46px 0 54px;
        }

        .page-heading {
          text-align: center;
          margin-bottom: 26px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          color: #14265b;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.12;
          letter-spacing: -1.3px;
        }

        .subtitle {
          margin: 9px 0 0;
          color: #5b647d;
          font-size: 16px;
        }

        .demo-role-switch {
          width: fit-content;
          margin: 0 auto 22px;
          padding: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(109, 40, 217, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.62);
        }

        .demo-role-switch > span {
          padding: 0 8px 0 10px;
          color: #69718a;
          font-size: 12px;
          font-weight: 700;
        }

        .demo-role-switch button {
          padding: 8px 13px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #5b647d;
          font-size: 13px;
          font-weight: 700;
        }

        .demo-role-switch button.active {
          color: #fff;
          background: #5b35d5;
          box-shadow: 0 3px 9px rgba(91, 53, 213, 0.2);
        }

        .card {
          border: 1px solid rgba(109, 40, 217, 0.1);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 12px 32px rgba(76, 29, 149, 0.07);
        }

        .patient-section,
        .doctor-section,
        .note-section {
          padding: clamp(20px, 3vw, 28px);
        }

        .doctor-section,
        .note-section {
          margin-top: 18px;
        }

        .executive-summary-preview {
          max-height: 420px;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 700px) {
          .executive-summary-preview {
            max-height: 38vh;
            padding: 12px !important;
            margin-top: 12px !important;
            border-radius: 12px;
          }

          .executive-summary-preview h2 {
            font-size: 17px !important;
          }

          .executive-summary-preview h3 {
            font-size: 14px !important;
          }

          .executive-summary-preview p,
          .executive-summary-preview li {
            font-size: 13px;
            line-height: 1.45;
            overflow-wrap: anywhere;
          }

          .executive-summary-preview ul {
            padding-left: 18px;
          }
        }


        .section-heading {
          margin-bottom: 18px;
        }

        .section-heading h2 {
          margin: 0;
          color: #1d2d62;
          font-size: 19px;
          letter-spacing: -0.25px;
        }

        .section-heading p {
          margin: 5px 0 0;
          color: #727a91;
          font-size: 13px;
          line-height: 1.45;
        }

        .patient-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .patient-card {
          min-width: 0;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 13px;
          text-align: left;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          background: #fff;
          color: #172554;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .patient-card:hover {
          transform: translateY(-1px);
          border-color: rgba(109, 40, 217, 0.3);
        }

        .patient-card.selected {
          border-color: #7552df;
          box-shadow: 0 5px 16px rgba(109, 40, 217, 0.12);
          background: #faf8ff;
        }

        .patient-avatar,
        .doctor-avatar {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(135deg, #6475e9, #7136c8);
          font-weight: 800;
        }

        .patient-avatar {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          font-size: 13px;
        }

        .patient-details {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 3px;
        }

        .patient-details strong {
          overflow: hidden;
          color: #243260;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .patient-details small {
          color: #7a8298;
          font-size: 12px;
        }

        .selection-dot {
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1.5px solid #c9cdd8;
          border-radius: 50%;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
        }

        .selection-dot.checked {
          border-color: #6845d6;
          background: #6845d6;
        }

        .doctor-profile {
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e8e5f2;
          border-radius: 16px;
          background: #fbfaff;
        }

        .doctor-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          font-size: 15px;
        }

        .doctor-profile-details {
          min-width: 0;
        }

        .doctor-profile-details strong {
          color: #1d2d62;
          font-size: 17px;
        }

        .doctor-meta {
          margin-top: 5px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px 20px;
          color: #69718a;
          font-size: 13px;
        }

        .doctor-meta span + span {
          position: relative;
        }

        .doctor-meta span + span::before {
          content: "•";
          position: absolute;
          left: -12px;
          color: #a5a9b6;
        }

        .selection-fields {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        label,
        .compact-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        label > span,
        .field-label {
          color: #626b82;
          font-size: 12px;
          font-weight: 700;
        }

        select,
        input,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dfe2eb;
          border-radius: 12px;
          background: #fff;
          color: #27345f;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        select {
          min-height: 45px;
          padding: 0 12px;
          font-size: 14px;
        }

        select:focus,
        input:focus,
        textarea:focus {
          border-color: #7654dd;
          box-shadow: 0 0 0 3px rgba(118, 84, 221, 0.11);
        }

input {
  min-height: 45px;
  padding: 0 12px;
  font-size: 14px;
}

        .date-time-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .compact-field {
          padding: 16px 18px;
        }

        .compact-field strong {
          color: #27345f;
          font-size: 15px;
        }

        .note-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
        }

        .character-count {
          flex: 0 0 auto;
          color: #8990a3;
          font-size: 12px;
        }

        textarea {
          min-height: 210px;
          padding: 16px;
          resize: vertical;
          font: inherit;
          font-size: 14px;
          line-height: 1.65;
        }

        textarea::placeholder {
          color: #a1a6b5;
        }

        .actions {
          padding-top: 22px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .secondary-button,
        .primary-button {
          min-height: 46px;
          padding: 0 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 750;
        }

        .secondary-button {
          border: 1px solid #d9dce6;
          background: rgba(255, 255, 255, 0.75);
          color: #555f79;
        }

.primary-button {
  border: 1px solid #6240ce;
  background: linear-gradient(135deg, #6f4bd7, #5330bf);
  color: #fff;
  box-shadow: 0 7px 16px rgba(83, 48, 191, 0.2);
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.primary-button:disabled {
  border-color: #d1d5db;
  background: #e5e7eb;
  color: #6b7280;
  box-shadow: none;
  cursor: not-allowed;
}



.treatment-section {
  margin-top: 18px;
  padding: clamp(20px, 3vw, 28px);
}

.treatment-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.treatment-help-button,
.add-treatment-button {
  border: 1px solid rgba(109, 40, 217, 0.25);
  border-radius: 10px;
  background: #faf8ff;
  color: #5b35c5;
  font-weight: 700;
  cursor: pointer;
}

.treatment-help-button {
  padding: 9px 12px;
  font-size: 12px;
  white-space: nowrap;
}

.treatment-column-headings,
.treatment-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr)
    minmax(0, 1fr) 34px;
  gap: 10px;
  align-items: start;
}

.treatment-column-headings {
  margin-bottom: 9px;
  color: #626b82;
  font-size: 12px;
  font-weight: 700;
}

.treatment-row {
  margin-bottom: 12px;
}

.treatment-row label {
  min-width: 0;
}

.mobile-field-label {
  display: none;
}

.treatment-row input {
  min-width: 0;
}

.remove-treatment-button {
  width: 34px;
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #b42318;
  font-size: 22px;
  cursor: pointer;
}

.remove-treatment-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.add-treatment-button {
  padding: 10px 14px;
  font-size: 13px;
}

.add-treatment-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.treatment-help-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(20, 25, 50, 0.45);
}

.treatment-help-dialog {
  width: min(100%, 480px);
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
  border: 1px solid #e8e5f2;
  border-radius: 20px;
  background: #fff;
  color: #27345f;
  box-shadow: 0 20px 60px rgba(20, 25, 50, 0.2);
}

.treatment-help-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.treatment-help-title-row h3 {
  margin: 0;
  font-size: 20px;
}

.treatment-help-close {
  border: 0;
  background: transparent;
  color: #626b82;
  font-size: 26px;
  cursor: pointer;
}

.treatment-help-dialog p {
  color: #626b82;
  font-size: 14px;
  line-height: 1.6;
}

.treatment-example {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #f8f6ff;
}

.treatment-example div {
  display: grid;
  gap: 4px;
}

.treatment-example strong {
  font-size: 13px;
}

.treatment-example span {
  color: #626b82;
  font-size: 13px;
  line-height: 1.5;
}

.treatment-help-note {
  font-size: 12px !important;
}

.treatment-help-dialog .primary-button {
  width: 100%;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .treatment-section {
    padding: 18px;
  }

  .treatment-column-headings {
    display: none;
  }

  .treatment-row {
    grid-template-columns: minmax(0, 1fr) 34px;
    gap: 10px;
    padding: 14px;
    border: 1px solid #e8e5f2;
    border-radius: 14px;
    background: #fff;
  }

  .treatment-row label {
    grid-column: 1;
  }

  .treatment-row label + label {
    margin-top: 2px;
  }

  .mobile-field-label {
    display: inline;
  }

  .treatment-row .remove-treatment-button {
    grid-column: 2;
    grid-row: 1;
  }

  .treatment-help-button {
    white-space: normal;
  }
}


@media (max-width: 700px) {
    .page-content {
        width: min(100% - 22px, 940px);
        padding: 30px 0 38px;
    }

    .page-heading {
        margin-bottom: 21px;
    }

    .subtitle {
        font-size: 14px;
    }

    .demo-role-switch {
        max-width: 100%;
    }

    .selection-fields,
    .date-time-grid {
        grid-template-columns: 1fr;
    }

    .patient-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    .patient-section,
    .doctor-section,
    .note-section {
        padding: 18px;
    }

          .doctor-meta {
            flex-direction: column;
            gap: 4px;
          }

          .doctor-meta span + span::before {
            display: none;
          }

          .date-time-grid {
            gap: 10px;
          }

          textarea {
            min-height: 190px;
          }

          .actions {
            flex-direction: column-reverse;
          }

          .secondary-button,
          .primary-button {
            width: 100%;
          }
        }

        @media (min-width: 701px) {
          .patient-card {
            min-height: 76px;
          }
        }
      `}</style>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileHeader, {
  type MobileCareMode,
} from "@/Components/common/MobileHeader";
import CareVRFooter from "@/Components/common/CareVRFooter";
import {
  getCareVRDashboardHandoff,
  type CareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";
import { authService } from "@/lib/auth/authService";

interface DoctorsNoteDoctorOption {
  providerId: string;
  doctorName: string;
  specialisation: string | null;
  facilityId: string | null;
  facilityName: string | null;
}

export default function DoctorsNotesPage() {
  const router = useRouter();

  const [dashboardHandoff, setDashboardHandoff] =
    useState<CareVRDashboardHandoff | null>(null);

  const [careMode, setCareMode] =
    useState<MobileCareMode>("FAMILY");

  const [accountMenuOpen, setAccountMenuOpen] =
    useState(false);

const [loggingOut, setLoggingOut] =
  useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState<string>("");

const [doctorOptions, setDoctorOptions] =
  useState<DoctorsNoteDoctorOption[]>([]);

const [selectedDoctorId, setSelectedDoctorId] =
  useState("");

  const [note, setNote] =
    useState("");

const [saving, setSaving] =
  useState(false);

const [saveError, setSaveError] =
  useState("");

const [saveSuccess, setSaveSuccess] =
  useState("");

const selectedDoctor = useMemo(
  () =>
    doctorOptions.find(
      (doctor) =>
        doctor.providerId === selectedDoctorId
    ) ?? null,
  [doctorOptions, selectedDoctorId],
);

useEffect(() => {
  const handoff = getCareVRDashboardHandoff();

  if (!handoff) {
    router.replace("/dashboard");
    return;
  }

  setDashboardHandoff(handoff);

  if (handoff.patients.length > 0) {
    setSelectedPatient(handoff.patients[0].id);
  }
}, [router]);

// ADD THE NEW EFFECT HERE
useEffect(() => {
  if (!selectedPatient) {
    setDoctorOptions([]);
    setSelectedDoctorId("");
    return;
  }

  let cancelled = false;

  async function loadDoctorOptions() {
    try {
      const response = await fetch(
        "/api/doctors-notes/options",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            patientId: selectedPatient,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to retrieve doctors.",
        );
      }

      if (cancelled) {
        return;
      }

      const options =
        result.data as DoctorsNoteDoctorOption[];

      setDoctorOptions(options);

      setSelectedDoctorId(
        options[0]?.providerId ?? "",
      );
    } catch (error) {
      console.error(
        "Doctors Notes doctor options retrieval failed:",
        error,
      );

      if (!cancelled) {
        setDoctorOptions([]);
        setSelectedDoctorId("");
      }
    }
  }

  loadDoctorOptions();

  return () => {
    cancelled = true;
  };
}, [selectedPatient]);

const patients =
  dashboardHandoff?.patients ?? [];



const handleAccountMenuToggle = () => {
  setAccountMenuOpen(
    (current) => !current
  );
};

const handleCareVRJourney = () => {
  setAccountMenuOpen(false);
  router.push("/carevr-journey");
};

const handleHelp = () => {
  setAccountMenuOpen(false);
  router.push("/help");
};

const handleLogout = async () => {
  if (loggingOut) {
    return;
  }

  setLoggingOut(true);
  setAccountMenuOpen(false);

  try {
    await authService.logout();

    router.replace("/login");
  }
  catch (error) {
    console.error(
      "Unable to log out.",
      error
    );

    setLoggingOut(false);
  }
};




const now = new Date();

const [selectedDate, setSelectedDate] = useState(
  now.toISOString().slice(0, 10)
);

const [selectedTime, setSelectedTime] = useState(
  now.toTimeString().slice(0, 5)
);

const handleSave = async () => {
  if (saving) {
    return;
  }

  setSaveError("");
  setSaveSuccess("");

  if (!selectedPatient) {
    setSaveError(
      "Please select a patient."
    );
    return;
  }

  if (!selectedDoctor) {
    setSaveError(
      "Please select a doctor."
    );
    return;
  }

  if (!note.trim()) {
    setSaveError(
      "Please enter the doctor's note."
    );
    return;
  }

  if (!selectedDate || !selectedTime) {
    setSaveError(
      "Please select the date and time."
    );
    return;
  }

  const noteDateTime = new Date(
    `${selectedDate}T${selectedTime}`
  );

  if (Number.isNaN(noteDateTime.getTime())) {
    setSaveError(
      "The selected date and time are invalid."
    );
    return;
  }

  setSaving(true);

  try {
    const response = await fetch(
      "/api/doctors-notes",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          providerId:
            selectedDoctor.providerId,
          doctorProfileId: null,
          facilityId:
            selectedDoctor.facilityId,
          noteAt:
            noteDateTime.toISOString(),
          note,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error ||
          "Unable to save Doctors Note."
      );
    }

    setSaveSuccess(
      "Doctors Note saved successfully."
    );

    setNote("");
  } catch (error) {
    console.error(
      "Doctors Note save failed:",
      error
    );

    setSaveError(
      error instanceof Error
        ? error.message
        : "Unable to save Doctors Note."
    );
  } finally {
    setSaving(false);
  }
};

return (
    <main className="doctors-notes-page">
<MobileHeader
    careMode={careMode}
    onCareModeChange={setCareMode}
    userName={
        dashboardHandoff?.role === "DOCTOR"
            ? "Doctor"
            : "CareVR User"
    }
    pageTitle="Doctors Notes"
    pageSubtitle="Record a clear note for the patient's health journey."
        showCareModeToggle={true}
        showSelfToggle={false}
        showFamilyToggle={true}
        showHomeButton={true}
        onHomeClick={() => router.push("/dashboard")}
accountMenuOpen={accountMenuOpen}
onAccountMenuToggle={handleAccountMenuToggle}
consentGranted={false}
canAddPatient={false}
onAddPatient={() => {}}
onCareVRJourney={handleCareVRJourney}
onHelp={handleHelp}
onLogout={handleLogout}
loggingOut={loggingOut}
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
                  <span className="patient-avatar">
                    {patient.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>

<span className="patient-details">
  <strong>{patient.name}</strong>
  <small>Patient</small>
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
  {dashboardHandoff?.role === "DOCTOR"
    ? "Your professional details will be attached to this note."
    : "Select the doctor associated with this note."}
</p>
            </div>
          </div>

          {dashboardHandoff?.role === "DOCTOR" ? (
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
<select
  value={selectedDoctorId}
  onChange={(event) =>
    setSelectedDoctorId(
      event.target.value
    )
  }
  disabled={doctorOptions.length === 0}
>
  {doctorOptions.length === 0 ? (
    <option value="">
      No doctor associated with this patient
    </option>
  ) : (
    doctorOptions.map((doctor) => (
      <option
        key={doctor.providerId}
        value={doctor.providerId}
      >
        {doctor.doctorName}
      </option>
    ))
  )}
</select>
              </label>

              <label>
                <span>Hospital</span>
<select
  value={selectedDoctor?.facilityId ?? ""}
  onChange={() => {}}
  disabled={!selectedDoctor}
>
  <option value="">
    {selectedDoctor?.facilityName ??
      "No hospital associated"}
  </option>
</select>
              </label>

              <label>
                <span>Specialisation</span>
<select
  value={selectedDoctor?.specialisation ?? ""}
  onChange={() => {}}
  disabled={!selectedDoctor}
>
  <option value="">
    {selectedDoctor?.specialisation ??
      "No specialisation available"}
  </option>
</select>
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
    onClick={() => router.push("/dashboard")}
    disabled={saving}
  >
    Cancel
  </button>

  <button
    type="button"
    className="primary-button"
    onClick={handleSave}
    disabled={
      saving ||
      !selectedPatient ||
      !selectedDoctor ||
      !note.trim()
    }
  >
    {saving
      ? "Saving..."
      : "Confirm & Save"}
  </button>
</div>

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

          .patient-grid,
          .selection-fields,
          .date-time-grid {
            grid-template-columns: 1fr;
          }

          .patient-grid {
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
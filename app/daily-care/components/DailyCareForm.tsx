"use client";

import { useEffect, useState } from "react";

import { patientStorage } from "@/lib/storage/patientStorage";

import type { Patient } from "@/lib/types/patient";
import type {
  DailyCareSymptom,
  PainLocation,
} from "@/lib/types/dailyCare";

import PatientCard from "./PatientCard";
import TemperatureCard from "./TemperatureCard";
import VitalsCard from "./VitalsCard";
import SymptomsCard from "./SymptomsCard";
import PainLocationCard from "./PainLocationCard";
import ActionButtons from "./ActionButtons";
import { dailyCareStorage } from "@/lib/storage/DailyCareStorage";
import { selfDailyCareStorage } from "@/lib/storage/SelfDailyCareStorage";

import { AppAlert } from "@/lib/utils/appAlert";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  medicalImageService,
} from "@/lib/medical-image/medicalImageService";


//------------------------------------------------------------
// Types
//------------------------------------------------------------

type TemperatureUnit = "F" | "C";

type ReadingInputMethod =
  "image" |
  "manual" |
  null;

interface DailyCareFormState {

  patientId: string;

  date: string;

  time: string;

  temperature: string;

  temperatureUnit: TemperatureUnit;

  systolic: string;

  diastolic: string;

  pulse: string;

  spo2: string;

  symptoms: DailyCareSymptom[];

otherSymptom: string;

painLocations: PainLocation[];

otherPainLocation: string;

}

//------------------------------------------------------------
// Helpers
//------------------------------------------------------------

function getCurrentDate(): string {

  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1)
    .padStart(2, "0");

  const day = String(now.getDate())
    .padStart(2, "0");

  return `${year}-${month}-${day}`;

}

function getCurrentTime(): string {

  const now =
    new Date();

  const hours =
    String(now.getHours())
      .padStart(2, "0");

  const minutes =
    String(now.getMinutes())
      .padStart(2, "0");

  return `${hours}:${minutes}`;

}

function createInitialForm(): DailyCareFormState {

  return {

    patientId: "",

    date: getCurrentDate(),

    time: getCurrentTime(),

    temperature: "",

    temperatureUnit: "F",

    systolic: "",

    diastolic: "",

    pulse: "",

    spo2: "",

    symptoms: [],

otherSymptom: "",

painLocations: [],

otherPainLocation: ""

  };

}

//------------------------------------------------------------
// Component
//------------------------------------------------------------

interface DailyCareFormProps {

  mode: "self" | "family";

  currentUserName?: string;

  selfPatientId?: string;

}

export default function DailyCareForm({

  mode,

  currentUserName,

  selfPatientId

}: DailyCareFormProps) {

 const {
    t,
  } = useLanguage();

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

const [processingImage, setProcessingImage] =
  useState(false);

const [
  readingInputMethod,
  setReadingInputMethod
] = useState<ReadingInputMethod>(
  null
);

const [
  imageReadSuccessful,
  setImageReadSuccessful
] = useState(false);

  const [showVitals, setShowVitals] =
    useState(false);

  const [showSymptoms, setShowSymptoms] =
    useState(false);

  const [formData, setFormData] =
    useState<DailyCareFormState>(
      createInitialForm()
    );

  //------------------------------------------------------------
  // Load Patients
  //------------------------------------------------------------

  useEffect(() => {

    const loadPatients = async () => {

      setLoadingPatients(true);

      try {

        const result =
          await patientStorage.getPatients();

        if (result.success) {

          setPatients(
            result.data ?? []
          );

        }

      }
      finally {

        setLoadingPatients(false);

      }

    };

    loadPatients();

  }, []);

  //------------------------------------------------------------
  // Field Updates
  //------------------------------------------------------------

  function updateField<
    K extends keyof DailyCareFormState
  >(
    field: K,
    value: DailyCareFormState[K]
  ) {

    setFormData(previous => ({

      ...previous,

      [field]: value

    }));

  }

  //------------------------------------------------------------
  // Toggle Symptoms
  //------------------------------------------------------------

  function toggleSymptom(
    symptom: DailyCareSymptom
  ) {

    const exists =
      formData.symptoms.includes(symptom);

if (exists) {

  const updatedSymptoms =
    formData.symptoms.filter(
      s => s !== symptom
    );

  updateField(
    "symptoms",
    updatedSymptoms
  );

  if (symptom === "BODY_PAIN") {

    updateField(
      "painLocations",
      []);

    updateField(
      "otherPainLocation",
      "");

  }

  if (symptom === "OTHER") {

    updateField(
      "otherSymptom",
      "");

  }

  return;

}

    updateField(
      "symptoms",
      [
        ...formData.symptoms,
        symptom
      ]
    );

  }

  //------------------------------------------------------------
  // Toggle Pain Location
  //------------------------------------------------------------

  function togglePainLocation(
    location: PainLocation
  ) {

    const exists =
      formData.painLocations.includes(location);

if (exists) {

  const updatedLocations =
    formData.painLocations.filter(
      p => p !== location
    );

  updateField(
    "painLocations",
    updatedLocations
  );

  if (location === "OTHER") {

    updateField(
      "otherPainLocation",
      ""
    );

  }

  return;

}
    updateField(

      "painLocations",

      [
        ...formData.painLocations,
        location
      ]

    );

  }


//------------------------------------------------------------
// Medical Image Capture
//------------------------------------------------------------

async function handleMedicalImage(
  event: React.ChangeEvent<HTMLInputElement>
) {

  const image =
    event.target.files?.[0];

  event.target.value = "";

  if (!image) {

    return;

  }

  if (
    processingImage ||
    saving
  ) {

    return;

  }

  setProcessingImage(true);

  try {

    const result =
      await medicalImageService.processImage(
        image
      );

    if (
      !result.success ||
      !result.data
    ) {

      AppAlert.error(
        result.error ??
        "Unable to read the medical image."
      );

      return;

    }

    const readings =
      result.data;

setFormData(previous => ({

  ...previous,

  temperature:
    readings.temperature !== null
      ? String(readings.temperature)
      : "",

  temperatureUnit:
    readings.temperatureUnit ??
    previous.temperatureUnit,

  systolic:
    readings.systolic !== null
      ? String(readings.systolic)
      : "",

  diastolic:
    readings.diastolic !== null
      ? String(readings.diastolic)
      : "",

  pulse:
    readings.pulse !== null
      ? String(readings.pulse)
      : "",

  spo2:
    readings.spo2 !== null
      ? String(readings.spo2)
      : "",

}));

    const hasVitals =
      readings.systolic !== null ||
      readings.diastolic !== null ||
      readings.pulse !== null ||
      readings.spo2 !== null;

    if (hasVitals) {

      setShowVitals(true);

    }

setImageReadSuccessful(
  true
);

    AppAlert.success(
      "Image read successfully. Please verify the populated readings before saving."
    );

  }
  catch (error) {

    console.error(
      "Medical Image Capture Error:",
      error
    );

    AppAlert.error(
      "Unable to process the medical image."
    );

  }
  finally {

    setProcessingImage(false);

  }

}
  //------------------------------------------------------------
  // Reset Form
  //------------------------------------------------------------

  function resetForm() {

    const patientId =
      formData.patientId;

    const unit =
      formData.temperatureUnit;

    setFormData({

      ...createInitialForm(),

      patientId,

      temperatureUnit: unit

    });

  }



  //------------------------------------------------------------
  // JSX Continues In Part 2
  //------------------------------------------------------------

return (

  <>

    {/*--------------------------------------------------------
      Patient Information
    --------------------------------------------------------*/}

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        👤 {t("dailyCare.patientInformation")}
      </h3>

<label style={labelStyle}>
  {t("dailyCare.patient")}
</label>

{mode === "family" ? (

  <select
    value={formData.patientId}
    disabled={loadingPatients || saving}
    onChange={(e) =>
      updateField(
        "patientId",
        e.target.value
      )
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

) : (

  <div
    style={{
      ...inputStyle,
      background: "#f3f4f6",
      color: "#374151",
      display: "flex",
      alignItems: "center",
      minHeight: "52px",
      fontWeight: 600,
    }}
  >
    👤 {currentUserName}
  </div>

)}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >

        <div>

          <label style={labelStyle}>
            {t("dailyCare.date")} *
          </label>

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              updateField(
                "date",
                e.target.value
              )
            }
            style={inputStyle}
          />

        </div>

        <div>

          <label style={labelStyle}>
            {t("dailyCare.time")} *
          </label>

          <input
            type="time"
            value={formData.time}
            onChange={(e) =>
              updateField(
                "time",
                e.target.value
              )
            }
            style={inputStyle}
          />

        </div>

      </div>

    </section>

    {/*--------------------------------------------------------
      Reading Input Method
    --------------------------------------------------------*/}

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        {t("dailyCare.readingMethodQuestion")}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >

        <button
          type="button"
          disabled={
            processingImage ||
            saving
          }

onClick={() => {

  setReadingInputMethod(
    "image"
  );

  setImageReadSuccessful(
    false
  );

}}
          style={{
            ...methodButton,

            border:
              readingInputMethod === "image"
                ? "2px solid #2563eb"
                : "1px solid #d1d5db",

            background:
              readingInputMethod === "image"
                ? "#eff6ff"
                : "#ffffff",

            color:
              readingInputMethod === "image"
                ? "#1d4ed8"
                : "#111827",
          }}
        >
          📷 {t("dailyCare.uploadPhoto")}
        </button>

        <button
          type="button"
          disabled={
            processingImage ||
            saving
          }

          onClick={() => {

  setReadingInputMethod(
    "manual"
  );

  setImageReadSuccessful(
    false
  );

}}
          style={{
            ...methodButton,

            border:
              readingInputMethod === "manual"
                ? "2px solid #2563eb"
                : "1px solid #d1d5db",

            background:
              readingInputMethod === "manual"
                ? "#eff6ff"
                : "#ffffff",

            color:
              readingInputMethod === "manual"
                ? "#1d4ed8"
                : "#111827",
          }}
        >
          ✍️ {t("dailyCare.enterManually")}
        </button>

      </div>

    </section>

{readingInputMethod === "image" && (
  <>

{/*--------------------------------------------------------
  Medical Image Capture
--------------------------------------------------------*/}



<section style={cardStyle}>

  <h3 style={sectionTitle}>
    📷 {t("dailyCare.captureMedicalReadings")}
  </h3>

  <p
    style={{
      marginTop: 0,
      marginBottom: "16px",
      color: "#6b7280",
      lineHeight: 1.5,
    }}
  >
    {t("dailyCare.captureHelp")}
  </p>

  <label
    style={{
      ...imageCaptureButton,

      opacity:
        processingImage || saving
          ? 0.7
          : 1,

      cursor:
        processingImage || saving
          ? "not-allowed"
          : "pointer",
    }}
  >

{processingImage
  ? t("dailyCare.readingImage")
  : `📷 ${t("dailyCare.takeOrSelectImage")}`}

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      capture="environment"
      disabled={
        processingImage ||
        saving
      }
      onChange={
        handleMedicalImage
      }
      style={{
        display: "none",
      }}
    />

  </label>

</section>

  </>
)}

{(
  readingInputMethod === "manual" ||
  imageReadSuccessful
) && (
  <>

    {/*--------------------------------------------------------
      Temperature
    --------------------------------------------------------*/}

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        🌡 {t("dailyCare.temperature")}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "16px",
          alignItems: "end",
        }}
      >

        <div>

          <label style={labelStyle}>
            {t("dailyCare.temperature")} 
          </label>

          <input
            type="number"
            step="0.1"
            placeholder={t("dailyCare.enterTemperature")}
            value={formData.temperature}
            onChange={(e) =>
              updateField(
                "temperature",
                e.target.value
              )
            }
            style={inputStyle}
          />

        </div>

        <div>

          <label style={labelStyle}>
            {t("dailyCare.unit")}
          </label>

          <select
            value={formData.temperatureUnit}
            onChange={(e) =>
              updateField(
                "temperatureUnit",
                e.target.value as TemperatureUnit
              )
            }
            style={inputStyle}
          >

            <option value="F">
              °F
            </option>

            <option value="C">
              °C
            </option>

          </select>

        </div>

      </div>

    </section>

    {/*--------------------------------------------------------
      Additional Vitals
    --------------------------------------------------------*/}

<VitalsCard
  expanded={showVitals}
  disabled={saving}
  systolic={formData.systolic}
  diastolic={formData.diastolic}
  pulse={formData.pulse}
  spo2={formData.spo2}
  onToggle={() => setShowVitals(!showVitals)}
  onSystolicChange={(value) =>
    updateField("systolic", value)
  }
  onDiastolicChange={(value) =>
    updateField("diastolic", value)
  }
  onPulseChange={(value) =>
    updateField("pulse", value)
  }
  onSpo2Change={(value) =>
    updateField("spo2", value)
  }
/>

{/*--------------------------------------------------------
  Symptoms
--------------------------------------------------------*/}

<SymptomsCard
  expanded={showSymptoms}
  disabled={saving}
  symptoms={formData.symptoms}
  otherSymptom={formData.otherSymptom}
  onToggle={() =>
    setShowSymptoms(!showSymptoms)
  }
  onSymptomToggle={
    toggleSymptom
  }
  onOtherSymptomChange={(value) =>
    updateField(
      "otherSymptom",
      value
    )
  }
/>

{/*--------------------------------------------------------
  Pain Location
--------------------------------------------------------*/}

{formData.symptoms.includes("BODY_PAIN") && (

  <PainLocationCard
    painLocations={formData.painLocations}
    otherPainLocation={formData.otherPainLocation}
    disabled={saving}
    onPainLocationToggle={
      togglePainLocation
    }
    onOtherPainLocationChange={(value) =>
      updateField(
        "otherPainLocation",
        value
      )
    }
  />

)}



</>
    )}

    {/*--------------------------------------------------------
      Actions
    --------------------------------------------------------*/}

    <div
      style={{
        display: "flex",
        gap: "16px",
        marginTop: "32px"
      }}
    >

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{
          ...primaryButton,
          flex: 1,
          opacity: saving ? 0.7 : 1
        }}
      >

{saving
  ? t("dailyCare.saving")
  : `💾 ${t("dailyCare.saveReading")}`}

      </button>

<button
    type="button"
    disabled={saving}
    onClick={() => window.location.href = "/dashboard"}
    style={{
        ...secondaryButton,
        flex: 1
    }}
>
    🏠 {t("dailyCare.backToDashboard")}
</button>

    </div>

  </>

);

  //------------------------------------------------------------
  // Save
  //------------------------------------------------------------

//------------------------------------------------------------
// Validation
//------------------------------------------------------------

function validateForm(): boolean {

if (
  mode === "family" &&
  !formData.patientId.trim()
) {

  AppAlert.warning(
    "Please select a patient."
  );

  return false;

}

const hasTemperature =
  formData.temperature.trim() !== "";

const hasVitals =
  formData.systolic.trim() !== "" ||
  formData.diastolic.trim() !== "" ||
  formData.pulse.trim() !== "" ||
  formData.spo2.trim() !== "";

const hasSymptoms =
  formData.symptoms.length > 0;

const hasPainLocations =
  formData.painLocations.length > 0;

const hasNotes = false;

const hasMedications = false;

if (
  !hasTemperature &&
  !hasVitals &&
  !hasSymptoms &&
  !hasPainLocations &&
  !hasNotes &&
  !hasMedications
) {

AppAlert.warning(
  "Please record at least one health observation.\n\n" +
  "• Temperature\n" +
  "• Vitals\n" +
  "• Symptoms\n" +
  "• Pain Location"
);

  return false;

}

if (hasTemperature) {

  const temperature =
    Number(formData.temperature);

  if (Number.isNaN(temperature)) {

    AppAlert.warning("Temperature is invalid.");

    return false;

  }

}

  if (
    formData.systolic &&
    Number.isNaN(Number(formData.systolic))
  ) {

    AppAlert.warning("Blood Pressure is invalid.");

    return false;

  }

  if (
    formData.diastolic &&
    Number.isNaN(Number(formData.diastolic))
  ) {

    AppAlert.warning("Blood Pressure is invalid.");


    return false;

  }

  if (
    formData.pulse &&
    Number.isNaN(Number(formData.pulse))
  ) {

    AppAlert.warning("Pulse Rate is invalid.");

    return false;

  }

  if (
    formData.spo2 &&
    Number.isNaN(Number(formData.spo2))
  ) {

    AppAlert.warning("SpO₂ is invalid.");

    return false;

  }

if (
  formData.symptoms.includes("OTHER") &&
  !formData.otherSymptom.trim()
) {

  AppAlert.warning("Please specify the other symptom.");

  return false;

}

if (
  formData.painLocations.includes("OTHER") &&
  !formData.otherPainLocation.trim()
) {

  AppAlert.warning("Please specify the pain location.");

  return false;

}

return true;

}

//------------------------------------------------------------
// Save Reading
//------------------------------------------------------------

async function handleSave() {

  if (saving) {

    return;

  }

  if (!validateForm()) {

    return;

  }

  setSaving(true);

  try {


    const reading = {

      patientId:
        formData.patientId,

      recordedAt:
    `${formData.date}T${formData.time}:00`,

temperature:
  formData.temperature.trim()
    ? Number(formData.temperature)
    : null,

      temperatureUnit:
        formData.temperatureUnit,

      systolic:
        formData.systolic
          ? Number(formData.systolic)
          : null,

      diastolic:
        formData.diastolic
          ? Number(formData.diastolic)
          : null,

      pulse:
        formData.pulse
          ? Number(formData.pulse)
          : null,

      spo2:
        formData.spo2
          ? Number(formData.spo2)
          : null,

      symptoms:
        formData.symptoms,

otherSymptom:
  formData.otherSymptom.trim()
    ? formData.otherSymptom.trim()
    : null,

      painLocations:
        formData.painLocations,

otherPainLocation:
  formData.otherPainLocation.trim()
    ? formData.otherPainLocation.trim()
    : null

    };

let result;

if (mode === "family") {

  result =
    await dailyCareStorage.save(
      reading
    );

}
else {

  result =
    await selfDailyCareStorage.save({

      recordedAt:
        reading.recordedAt,

      temperature:
        reading.temperature,

      temperatureUnit:
        reading.temperatureUnit,

      systolic:
        reading.systolic,

      diastolic:
        reading.diastolic,

      pulse:
        reading.pulse,

      spo2:
        reading.spo2,

      symptoms:
        reading.symptoms,

      otherSymptom:
        reading.otherSymptom,

      painLocations:
        reading.painLocations,

      otherPainLocation:
        reading.otherPainLocation

    });

}

if (!result.success) {

  throw new Error(
    result.error
  );

}
 
    resetForm();

    AppAlert.success("Daily Care saved successfully.");

  }

catch (error) {

  console.error(
    "Daily Care Save Error:",
    error
  );

  if (error instanceof Error) {

    AppAlert.error(error.message);

  } else {

    AppAlert.error("Unable to save Daily Care.");

  }

}
  finally {

    setSaving(false);

  }

}

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const cardStyle: React.CSSProperties = {

  background: "#ffffff",

  border: "1px solid #d1d5db",

  borderRadius: "12px",

  padding: "24px",

  marginBottom: "24px",

  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"

};

const sectionTitle: React.CSSProperties = {

  margin: 0,

  marginBottom: "20px",

  fontSize: "22px",

  fontWeight: 700,

  color: "#111827"

};

const labelStyle: React.CSSProperties = {

  display: "block",

  marginBottom: "8px",

  marginTop: "16px",

  fontWeight: 600,

  color: "#111827",

  fontSize: "15px"

};

const inputStyle: React.CSSProperties = {

  width: "100%",

  padding: "14px",

  border: "1px solid #d1d5db",

  borderRadius: "10px",

  fontSize: "16px",

  boxSizing: "border-box",

  background: "#ffffff",

  outline: "none"

};

const collapseButton: React.CSSProperties = {

  width: "100%",

  background: "transparent",

  border: "none",

  padding: 0,

  margin: 0,

  textAlign: "left",

  fontSize: "20px",

  fontWeight: 700,

  cursor: "pointer",

  color: "#111827"

};

const checkboxLabel: React.CSSProperties = {

  display: "flex",

  alignItems: "center",

  gap: "10px",

  padding: "6px 0",

  cursor: "pointer",

  fontSize: "15px",

  color: "#111827"

};

const methodButton: React.CSSProperties = {

  minHeight: "58px",

  padding: "16px",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: 700,

  cursor: "pointer",

  transition: "0.2s",

};

const primaryButton: React.CSSProperties = {

  padding: "16px",

  background: "#2563eb",

  color: "#ffffff",

  border: "none",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: 700,

  cursor: "pointer",

  transition: "0.2s"

};

const secondaryButton: React.CSSProperties = {

  padding: "16px",

  background: "#ffffff",

  color: "#111827",

  border: "1px solid #d1d5db",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: 700,

  cursor: "pointer",

  transition: "0.2s"

};

const imageCaptureButton: React.CSSProperties = {

  width: "100%",

  minHeight: "54px",

  padding: "16px",

  background: "#ffffff",

  color: "#2563eb",

  border: "2px solid #2563eb",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: 700,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  boxSizing: "border-box",

};
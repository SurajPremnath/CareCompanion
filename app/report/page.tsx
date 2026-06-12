"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Row = { label: string; value: string };

export default function ReportPage() {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<Row[]>([]);
  const [observations, setObservations] = useState<string[]>([]);

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [observerName, setObserverName] = useState("");
  const [observerRelationship, setObserverRelationship] = useState("");

  useEffect(() => {
    const type = localStorage.getItem("assessmentType") || "self";

    setAssessmentType(type);
    setPatientName(localStorage.getItem("patientName") || "");
    setPatientAge(localStorage.getItem("patientAge") || "");
    setAssessmentDate(localStorage.getItem("assessmentDate") || "");
    setObserverName(localStorage.getItem("observerName") || "");

    const rel =
      localStorage.getItem("observerRelationship") === "Other"
        ? localStorage.getItem("observerRelationshipOther") || "Other"
        : localStorage.getItem("observerRelationship") || "";

    setObserverRelationship(rel);

    const breathing = localStorage.getItem("breathing") || "";
    const cough = localStorage.getItem("cough") || "";
    const bloodInCough = localStorage.getItem("bloodInCough") || "";
    const fever = localStorage.getItem("fever") || "";
    const temperatureReading = localStorage.getItem("temperatureReading") || "";
    const temperatureUnit = localStorage.getItem("temperatureUnit") || "F";
    const energy = localStorage.getItem("energy") || "";
    const appetite = localStorage.getItem("appetite") || "";
    const water = localStorage.getItem("water") || "";
    const waterGlasses = localStorage.getItem("waterGlasses") || "";
    const walking = localStorage.getItem("walking") || "";
    const walkingHelp = localStorage.getItem("walkingHelp") || "";
    const looseMotions = localStorage.getItem("looseMotions") || "";
    const looseMotionType = localStorage.getItem("looseMotionType") || "";

    let total = 0;

    const obs: string[] = [];

    if (type === "self") {
      const pain = localStorage.getItem("pain") || "";
      const painAreas = JSON.parse(localStorage.getItem("painAreas") || "[]");

      if (breathing === "normal") total += 2; else if (breathing === "slightly") total += 1;
      if (cough === "no") total += 2; else if (cough === "sometimes") total += 1;
      if (fever === "no") total += 2;
      if (energy === "good") total += 2; else if (energy === "tired") total += 1;
      if (appetite === "normal") total += 2; else if (appetite === "less") total += 1;
      if (water === "yes") total += 2; else if (water === "notsure") total += 1;
      if (pain === "none") total += 2; else if (pain === "mild") total += 1;
      if (walking === "easy") total += 2; else if (walking === "some") total += 1;
      if (looseMotions === "no") total += 2;

      setScore(Math.round((total / 18) * 20));

      setSummary([
        { label: "Breathing", value: breathing },
        { label: "Cough", value: cough },
        { label: "Fever", value: fever },
        { label: "Energy", value: energy },
        { label: "Appetite", value: appetite },
        { label: "Water Intake", value: water + (waterGlasses ? ` (${waterGlasses} glasses)` : "") },
        { label: "Body Pain", value: pain },
        { label: "Pain Areas", value: painAreas.join(", ") || "None" },
        { label: "Walking", value: walking },
        { label: "Loose Motions", value: looseMotions + (looseMotionType ? ` (${looseMotionType})` : "") },
      ]);
    } else {
      const discomfort = localStorage.getItem("discomfort") || "";
      const discomfortAreas = JSON.parse(localStorage.getItem("discomfortAreas") || "[]");
      const confusion = localStorage.getItem("confusion") || "";

      if (breathing === "normal") total += 2;
      if (cough === "no") total += 2;
      if (fever === "no") total += 2;
      if (energy === "good") total += 2;
      if (appetite === "normal") total += 2;
      if (water === "yes") total += 2;
      if (discomfort === "no") total += 2;
      if (walking === "easy") total += 2;
      if (looseMotions === "no") total += 2;
      if (confusion === "no") total += 2;

      setScore(total);

      setSummary([
        { label: "Breathing", value: breathing },
        { label: "Cough", value: cough },
        { label: "Fever", value: fever },
        { label: "Energy", value: energy },
        { label: "Appetite", value: appetite },
        { label: "Water Intake", value: water + (waterGlasses ? ` (${waterGlasses} glasses)` : "") },
        { label: "Discomfort", value: discomfort },
        { label: "Discomfort Areas", value: discomfortAreas.join(", ") || "None" },
        { label: "Walking", value: walking },
        { label: "Confusion", value: confusion },
      ]);

      if (confusion === "yes") obs.push("⚠ Confusion observed");
      if (discomfort === "yes") obs.push("⚠ Discomfort reported");
    }

    if (bloodInCough === "yes") obs.push("⚠ Blood seen while coughing");
    if (fever === "yes" && temperatureReading) obs.push(`⚠ Fever reported (${temperatureReading}°${temperatureUnit})`);
    if (walkingHelp === "yes") obs.push("⚠ Walking assistance required");
    if (breathing === "difficult") obs.push("⚠ Significant breathing difficulty");

    setObservations(obs);

    const finalScore = type === "self" ? Math.round((total / 18) * 20) : total;

    if (finalScore >= 18) {
      setStatus("🟢 Excellent");
      setMessage("Continue daily monitoring and maintain hydration.");
    } else if (finalScore >= 12) {
      setStatus("🟡 Needs Attention");
      setMessage("Monitor symptoms closely and consult a healthcare professional if symptoms worsen.");
    } else {
      setStatus("🔴 Attention Recommended");
      setMessage("Seek medical attention promptly.");
    }

    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",padding:"20px",fontFamily:"Arial"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <div style={{background:"white",padding:"20px",borderRadius:"14px",border:"1px solid #ddd"}}>
          <h1>❤️ CareCompanion</h1>
          <h2>Health Assessment Report</h2>

          <p><b>Patient:</b> {patientName} ({patientAge})</p>
          <p><b>Assessment:</b> {assessmentType === "family" ? "Family Observation" : "Self Assessment"}</p>
          {assessmentType === "family" && <p><b>Completed By:</b> {observerName} ({observerRelationship})</p>}
          <p><b>Date:</b> {assessmentDate}</p>

          <hr />

          <h1>{score}/20</h1>
          <h2>{status}</h2>
          <p>{message}</p>

          <hr />

          <h3>Key Observations</h3>
          {observations.length === 0 ? <p>✅ No significant concerns reported today.</p> :
            observations.map((o,i)=><p key={i}>{o}</p>)}

          <hr />

          <h3>Today's Health Summary</h3>
          {summary.map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #eee"}}>
              <strong>{s.label}</strong>
              <span>{s.value}</span>
            </div>
          ))}

          <button
            onClick={() => router.push("/")}
            style={{width:"100%",marginTop:"20px",padding:"14px",background:"#2563eb",color:"white",border:"none",borderRadius:"10px"}}
          >
            🏠 New Assessment
          </button>
        </div>
      </div>
    </main>
  );
}

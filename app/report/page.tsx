"use client";

import { useEffect, useState, useRef } from "react";
import { downloadAssessmentPdf }
from "@/lib/utils/pdf/assessmentPdf";

import { useRouter } from "next/navigation";
import AppBrand from "@/app/components/AppBrand";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";
import type { AssessmentInput } from "@/lib/types/assessment";

type Row = {
  label: string;
  value: string;
};

export default function ReportPage() {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");
  const [wellbeingSummary, setWellbeingSummary] = useState("");

  const [summaryRows, setSummaryRows] = useState<Row[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");

  const [observerName, setObserverName] = useState("");
  const [observerRelationship, setObserverRelationship] = useState("");

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const type =
      localStorage.getItem("assessmentType") || "self";

    setAssessmentType(type);

    setPatientName(
      localStorage.getItem("patientName") || ""
    );

    setPatientAge(
      localStorage.getItem("patientAge") || ""
    );

    setAssessmentDate(
      localStorage.getItem("assessmentDate") ||
        new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
    );

    setObserverName(
      localStorage.getItem("observerName") || ""
    );

    const relationship =
      localStorage.getItem(
        "observerRelationship"
      ) === "Other"
        ? localStorage.getItem(
            "observerRelationshipOther"
          ) || "Other"
        : localStorage.getItem(
            "observerRelationship"
          ) || "";

    setObserverRelationship(relationship);

    // COMMON QUESTIONS

    const breathing =
      localStorage.getItem("breathing") || "";

    const cough =
      localStorage.getItem("cough") || "";

    const bloodInCough =
      localStorage.getItem("bloodInCough") || "";

    const fever =
      localStorage.getItem("fever") || "";

    const temperatureReading =
      localStorage.getItem(
        "temperatureReading"
      ) || "";

    const temperatureUnit =
      localStorage.getItem(
        "temperatureUnit"
      ) || "F";

    const energy =
      localStorage.getItem("energy") || "";

    const appetite =
      localStorage.getItem("appetite") || "";

    const water =
      localStorage.getItem("water") || "";

    const waterGlasses =
      localStorage.getItem(
        "waterGlasses"
      ) || "";

    const walking =
      localStorage.getItem("walking") || "";

    const walkingHelp =
      localStorage.getItem(
        "walkingHelp"
      ) || "";

    const looseMotions =
      localStorage.getItem(
        "looseMotions"
      ) || "";

    const looseMotionType =
      localStorage.getItem(
        "looseMotionType"
      ) || "";

    const discomfort =
      localStorage.getItem(
        "discomfort"
      ) || "";

    const discomfortAreas = JSON.parse(
      localStorage.getItem(
        "discomfortAreas"
      ) || "[]"
    );

    const confusion =
      localStorage.getItem("confusion") || "";

    let total = 0;

    const observationList: string[] = [];
    const suggestionList: string[] = [];

    const reportSummary: Row[] = [];

const displayValue = (
  field: string,
  value: string
): string => {
  switch (field) {
    case "breathing":
      if (value === "normal") return "Normal";
      if (value === "slightly") return "Slight Difficulty";
      if (value === "difficult") return "Significant Difficulty";
      break;

    case "cough":
      if (value === "no") return "No Cough";
      if (value === "sometimes") return "Occasional Cough";
      if (value === "frequent") return "Frequent Cough";
      break;

    case "fever":
      if (value === "yes") return "Fever Reported";
      if (value === "no") return "No Fever";
      break;

    case "energy":
      if (value === "good") return "Good";
      if (value === "tired") return "Tired";
      if (value === "verytired") return "Very Tired";
      break;

    case "appetite":
      if (value === "normal") return "Normal";
      if (value === "less") return "Reduced";
      if (value === "poor") return "Very Low";
      break;

    case "water":
      if (value === "yes") return "Adequate";
      if (value === "no") return "Insufficient";
      if (value === "notsure") return "Not Sure";
      break;

    case "discomfort":
      if (value === "yes") return "Reported";
      if (value === "no") return "None Reported";
      break;

    case "walking":
      if (value === "easy") return "Walked Easily";
      if (value === "some") return "Some Difficulty";
      if (value === "difficult")
        return "Significant Difficulty";
      break;

    case "confusion":
      if (value === "yes") return "Observed";
      if (value === "no") return "Not Observed";
      break;
  }

  return value || "Not Reported";
};

    // PART 2 CONTINUES HERE
    // =========================
    // SCORING ENGINE
    // =========================

    if (breathing === "normal") total += 2;
    else if (breathing === "slightly") total += 1;

    if (cough === "no") total += 2;
    else if (cough === "sometimes") total += 1;

    if (fever === "no") total += 2;

    if (energy === "good") total += 2;
    else if (energy === "tired") total += 1;

    if (appetite === "normal") total += 2;
    else if (appetite === "less") total += 1;

    if (water === "yes") total += 2;
    else if (water === "notsure") total += 1;

    if (walking === "easy") total += 2;
    else if (walking === "some") total += 1;

    if (looseMotions === "no") total += 2;

    if (type === "self") {
      if (discomfort === "no") total += 2;
      else if (discomfort === "yes") total += 1;

      const convertedScore = Math.round(
        (total / 18) * 20
      );

      setScore(convertedScore);
    } else {
      if (discomfort === "no") total += 2;

      if (confusion === "no") total += 2;

      setScore(total);
    }

    const finalScore =
      type === "self"
        ? Math.round((total / 18) * 20)
        : total;

    let finalStatus = "";
    // =========================
    // SCORE BAND LOGIC
    // =========================

    if (finalScore >= 19) {
      finalStatus = "🟢 Excellent";
      setStatus(finalStatus);

      setWellbeingSummary(
        "Today's responses indicate encouraging signs of wellbeing. Current routines appear to be supporting overall health. Continue hydration, nutrition and regular monitoring."
      );
    } else if (finalScore >= 16) {
      finalStatus = "🟢 Good";
      setStatus(finalStatus);

      setWellbeingSummary(
        "Overall wellbeing appears stable today. A few areas may benefit from gentle attention, but today's responses remain largely encouraging."
      );
    } else if (finalScore >= 12) {
      finalStatus = "🟡 Needs Attention";
      setStatus(finalStatus);

      setWellbeingSummary(
        "A few areas deserve additional attention today. Monitoring symptoms and encouraging hydration, nutrition and rest may be helpful."
      );
    } else {
      finalStatus = "🔴 Immediate Attention Recommended";
      setStatus(finalStatus);

      setWellbeingSummary(
        "Several responses suggest closer observation is needed today. If symptoms persist, worsen or cause concern, consider contacting a healthcare professional."
      );
    }

    // =========================
    // WELLBEING OBSERVATIONS
    // =========================

    if (
      fever === "yes" &&
      temperatureReading
    ) {
      observationList.push(
        `🌡 A raised temperature of ${temperatureReading}°${temperatureUnit} was reported today. Continue monitoring and encourage adequate hydration and rest.`
      );

      suggestionList.push(
        "🌡 Continue monitoring temperature during the day."
      );
    }

    if (energy === "tired") {
      observationList.push(
        "⚡ Energy levels appear lower than usual today. Additional rest may help support recovery."
      );

      suggestionList.push(
        "😴 Encourage additional rest and avoid overexertion."
      );
    }

    if (
      energy === "verytired" ||
      energy === "veryTired"
    ) {
      observationList.push(
        "⚡ Significant fatigue was reported today. Extra rest and close observation may be beneficial."
      );

      suggestionList.push(
        "😴 Prioritize rest and monitor energy levels closely."
      );
    }

    if (water === "notsure") {
      observationList.push(
        "💧 Hydration may need additional attention today."
      );

      suggestionList.push(
        "💧 Encourage regular fluid intake throughout the day."
      );
    }

    if (water === "no") {
      observationList.push(
        "💧 Hydration may benefit from additional attention today."
      );

      suggestionList.push(
        "💧 Encourage water and fluids regularly to support wellbeing."
      );
    }

    if (appetite === "less") {
      observationList.push(
        "🍽 Appetite appears slightly reduced today."
      );

      suggestionList.push(
        "🍽 Smaller frequent meals may help support nutrition."
      );
    }

    if (
      appetite === "hardly" ||
      appetite === "poor"
    ) {
      observationList.push(
        "🍽 Eating appears to have been difficult today."
      );

      suggestionList.push(
        "🍽 Encourage favourite foods and monitor food intake."
      );
    }

    if (discomfort === "yes") {
      observationList.push(
        "🙂 Some discomfort was reported today."
      );

      if (
        discomfortAreas &&
        discomfortAreas.length > 0
      ) {
        observationList.push(
          `📍 Areas affected: ${discomfortAreas.join(
            ", "
          )}`
        );
      }

      suggestionList.push(
        "🛌 Encourage comfort measures and adequate rest."
      );
    }

    if (walking === "some") {
      observationList.push(
        "🚶 Some difficulty with mobility was reported today."
      );

      suggestionList.push(
        "🚶 Encourage safe movement and avoid unnecessary strain."
      );
    }

    if (walking === "difficult") {
      observationList.push(
        "🚶 Mobility appears more challenging today."
      );

      suggestionList.push(
        "🚶 Additional support while walking may be beneficial."
      );
    }

    if (walkingHelp === "yes") {
      observationList.push(
        "🚶 Assistance was needed while walking today."
      );

      suggestionList.push(
        "🚶 Provide support during movement when needed."
      );
    }

    if (
      looseMotions === "yes" &&
      looseMotionType === "sticky"
    ) {
      observationList.push(
        "💩 Changes in bowel movements were reported today (sticky stools)."
      );

      suggestionList.push(
        "🚽 Monitor digestive symptoms and hydration."
      );
    }

    if (
      looseMotions === "yes" &&
      looseMotionType === "watery"
    ) {
      observationList.push(
        "🚽 Digestive changes were reported today and hydration should be monitored."
      );

      suggestionList.push(
        "🚽 Monitor closely for dehydration and encourage fluids."
      );
    }

    if (
      looseMotions === "yes" &&
      looseMotionType === "notsure"
    ) {
      observationList.push(
        "🚽 Changes in bowel movements were reported today."
      );

      suggestionList.push(
        "🚽 Continue observing bowel movement patterns."
      );
    }

    if (confusion === "yes") {
      observationList.push(
        "🧠 Additional reassurance and observation may be helpful today."
      );

      suggestionList.push(
        "🧠 Additional observation and reassurance may be helpful."
      );
    }

    if (bloodInCough === "yes") {
      observationList.push(
        "⚠ Blood was reported while coughing today. This should be monitored carefully."
      );

      suggestionList.push(
        "⚠ Consider seeking medical advice if symptoms continue."
      );
    }

    if (breathing === "difficult") {
      observationList.push(
        "🫁 Breathing appeared more difficult than usual today."
      );

      suggestionList.push(
        "🫁 Monitor breathing closely and seek medical advice if symptoms worsen."
      );
    }

    // PART 3 CONTINUES HERE
    // =========================
    // HEALTH SUMMARY
    // =========================

reportSummary.push(
  {
    label: "Breathing",
    value: displayValue(
      "breathing",
      breathing
    ),
  },
  {
    label: "Cough",
    value: displayValue(
      "cough",
      cough
    ),
  },
  {
    label: "Fever",
    value: displayValue(
      "fever",
      fever
    ),
  },
  {
    label: "Energy",
    value: displayValue(
      "energy",
      energy
    ),
  },
  {
    label: "Appetite",
    value: displayValue(
      "appetite",
      appetite
    ),
  },
  {
    label: "Water Intake",
    value:
      displayValue("water", water) +
      (waterGlasses
        ? ` (${waterGlasses} glasses)`
        : ""),
  },
  {
    label: "Discomfort",
    value: displayValue(
      "discomfort",
      discomfort
    ),
  },
  {
    label: "Discomfort Areas",
    value:
      discomfortAreas?.length > 0
        ? discomfortAreas.join(", ")
        : "None",
  },
  {
    label: "Walking",
    value: displayValue(
      "walking",
      walking
    ),
  }
);

    if (type === "family") {
      reportSummary.push({
  label: "Confusion",
  value: displayValue(
    "confusion",
    confusion
  ),
});
    }

    reportSummary.push({
  label: "Loose Motions",
  value:
    looseMotions === "yes"
      ? looseMotionType === "sticky"
        ? "Sticky Stool Reported"
        : looseMotionType === "watery"
        ? "Watery Stool Reported"
        : "Changes Observed"
      : "None Reported",
});

    // =========================
    // EMPTY STATES
    // =========================

    if (observationList.length === 0) {
      observationList.push(
        "✅ Today's responses indicate encouraging signs of wellbeing. Current routines appear to be supporting overall health."
      );

      suggestionList.push(
        "💧 Continue regular hydration."
      );

      suggestionList.push(
        "🥗 Maintain balanced nutrition."
      );

      suggestionList.push(
        "🚶 Continue regular daily activity as comfortable."
      );
    }


const assessment: Omit<AssessmentInput, "userId"> = {
  patientId:
    type === "family"
      ? localStorage.getItem("patientId")
      : null,

  assessmentType:
    type === "family"
      ? "FAMILY"
      : "SELF",

  assessmentDate: new Date(),

  rawScore: total,

  normalizedScore: finalScore,

  status: "GOOD",

  recommendation: "MONITOR_CLOSELY",

  answers: {
    breathing: "",
    cough: false,
    bloodInCough: false,
    fever: false,
    temperature: null,
    energy: "",
    appetite: "",
    waterIntake: "",
    pain: false,
    painAreas: [],
    walkingDifficulty: false,
    looseMotions: false,
  },

  assessmentVersion: 1,

  dailyCareId: null,
};

void (async () => {
  const result =
    await assessmentStorage.save(
      assessment
    );

  if (!result.success) {
    console.error(
      "Assessment Save Failed",
      result.error
    );

    return;
  }

})();

    setSummaryRows(reportSummary);
    setObservations(observationList);
    setSuggestions(suggestionList);

    setLoaded(true);
  }, []);

async function saveAssessmentToDatabase(
  assessment: Omit<AssessmentInput, "userId">
): Promise<void> {
  const result =
    await assessmentStorage.save(assessment);

  if (!result.success) {
    console.error(
      "Failed to save assessment:",
      result.error
    );
    return;
  }

}

  if (!loaded) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "14px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <div
  ref={reportRef}
  style={{
    background: "white",
            padding: "14px",
            borderRadius: "14px",
            border: "1px solid #ddd",
          }}
        >

<AppBrand />

<h2
  style={{
    fontSize: "32px",
    fontWeight: 700,
    color: "#111827",
    marginTop: "24px",
    marginBottom: "24px",
  }}
>
  📄 Health Assessment Report
</h2>

          <p>
            <strong>Patient:</strong>{" "}
            {patientName} ({patientAge})
          </p>

          <p>
            <strong>Assessment:</strong>{" "}
            {assessmentType === "family"
              ? "Family Assessment"
              : "Self Assessment"}
          </p>

          {assessmentType === "family" && (
            <p>
              <strong>Assessor:</strong>{" "}
              {observerName}
            </p>
          )}

          <p>
            <strong>Date:</strong>{" "}
            {assessmentDate}
          </p>

          <hr
            style={{
              margin: "14px 0",
            }}
          />

          {/* SCORE */}

          <h2>Today's Wellbeing Overview</h2>

          <h1
            style={{
              marginBottom: "10px",
            }}
          >
            {score}/20
          </h1>

          <h2>{status}</h2>

          <p
            style={{
              lineHeight: "1.7",
            }}
          >
            {wellbeingSummary}
          </p>

          <hr
            style={{
              margin: "14px 0",
            }}
          />

          {/* OBSERVATIONS */}

          <h2>Wellbeing Observations</h2>

          {observations.map(
            (item, index) => (
              <p key={index}>
                {item}
              </p>
            )
          )}

          <hr
            style={{
              margin: "14px 0",
            }}
          />

          {/* SUGGESTIONS */}

          <h2>Suggestions For Today</h2>

          {suggestions.map(
            (item, index) => (
              <p key={index}>
                {item}
              </p>
            )
          )}

          <hr
            style={{
              margin: "14px 0",
            }}
          />

          {/* SUMMARY */}

          <h2>Today's Health Summary</h2>

          {summaryRows.map(
            (row, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  padding: "14px 0",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <strong>
                  {row.label}
                </strong>

                <span>
                  {row.value}
                </span>
              </div>
            )
          )}
          <hr
            style={{
              margin: "30px 0",
            }}
          />


          {/* DISCLAIMER */}

          <h3>Disclaimer</h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            This assessment is designed
            to support daily wellbeing
            monitoring and early
            identification of changes in
            health status.
          </p>

          <p
            style={{
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            It is not intended to
            diagnose, treat or replace
            professional medical advice.
            If symptoms are severe,
            worsening or causing concern,
            please consult a qualified
            healthcare professional.
          </p>

<hr
  style={{
    margin: "14px 0",
  }}
/>

<div
  style={{
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.6",
  }}
>
  <p>
    Created by <strong>Suraj Premnath</strong>
  </p>

  <p>
    © {new Date().getFullYear()} CareVR.
    All Rights Reserved.
  </p>
</div>
      </div>
<button
onClick={() => {

  if (!reportRef.current) return;

  downloadAssessmentPdf(

    reportRef.current,

    patientName

  );

}}

  style={{
    width: "100%",
    marginTop: "20px",
    marginBottom: "12px",
    padding: "14px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  📄 Download PDF Report
</button>

          <button
            onClick={() =>
              router.push("/")
            }
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🏠 New Assessment
          </button>
        </div>

    </main>
  );
}
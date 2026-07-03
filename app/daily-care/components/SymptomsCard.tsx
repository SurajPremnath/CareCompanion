"use client";

import type { DailyCareSymptom } from "@/lib/types/dailyCare";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  cardStyle,
  checkboxGrid,
  checkboxLabel,
  collapseButton,
} from "../styles";

interface SymptomsCardProps {

  expanded: boolean;

  disabled?: boolean;

  symptoms: DailyCareSymptom[];

otherSymptom: string;

onOtherSymptomChange: (
  value: string
) => void;

  onToggle: () => void;

  onSymptomToggle: (
    symptom: DailyCareSymptom
  ) => void;

}

const symptomOptions: {
  value: DailyCareSymptom;
  translationKey: string;
}[] = [

  {
    value: "FEVER",
    translationKey: "dailyCare.symptomFever",
  },

  {
    value: "WEAKNESS",
    translationKey: "dailyCare.symptomWeakness",
  },

  {
    value: "BODY_PAIN",
    translationKey: "dailyCare.symptomBodyPain",
  },

  {
    value: "COUGH",
    translationKey: "dailyCare.symptomCough",
  },

  {
    value: "BLOOD_IN_COUGH",
    translationKey: "dailyCare.symptomBloodInCough",
  },

  {
    value: "BREATHLESSNESS",
    translationKey: "dailyCare.symptomBreathlessness",
  },

  {
    value: "WALKING_DIFFICULTY",
    translationKey: "dailyCare.symptomWalkingDifficulty",
  },

  {
    value: "LOSS_OF_APPETITE",
    translationKey: "dailyCare.symptomLossOfAppetite",
  },

  {
    value: "LOOSE_MOTIONS",
    translationKey: "dailyCare.symptomLooseMotions",
  },

  {
    value: "VOMITING",
    translationKey: "dailyCare.symptomVomiting",
  },

  {
    value: "DRY_MOUTH",
    translationKey: "dailyCare.symptomDryMouth",
  },

  {
    value: "OTHER",
    translationKey: "dailyCare.symptomOther",
  },

];

export default function SymptomsCard({

  expanded,

  disabled = false,

symptoms,

otherSymptom,

onToggle,

onSymptomToggle,

onOtherSymptomChange

}: SymptomsCardProps) {

  const {
    t,
  } = useLanguage();

  return (

    <section style={cardStyle}>

      <button
        type="button"
        onClick={onToggle}
        style={collapseButton}
      >

        {expanded ? "▼" : "▶"} {t("dailyCare.symptoms")}

      </button>

{expanded && (

  <>

    <div style={checkboxGrid}>

      {symptomOptions.map((symptom) => (

        <label
          key={symptom.value}
          style={checkboxLabel}
        >

          <input
            type="checkbox"
            disabled={disabled}
            checked={symptoms.includes(
              symptom.value
            )}
            onChange={() =>
              onSymptomToggle(
                symptom.value
              )
            }
          />

          <span>
            {t(symptom.translationKey)}
          </span>

        </label>

      ))}

    </div>

    {symptoms.includes("OTHER") && (

      <div
        style={{
          marginTop: "20px",
        }}
      >

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          {t("dailyCare.pleaseSpecify")} *
        </label>

        <input
          type="text"
          value={otherSymptom}
          disabled={disabled}
          placeholder={
            t(
              "dailyCare.otherSymptomPlaceholder"
            )
          }
          onChange={(event) =>
            onOtherSymptomChange(
              event.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "#ffffff",
            outline: "none",
          }}
        />

      </div>

    )}

  </>

)}

    </section>

  );

}
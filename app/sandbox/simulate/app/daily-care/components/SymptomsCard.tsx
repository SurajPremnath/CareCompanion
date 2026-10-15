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
    value: "COLD",
    translationKey: "dailyCare.symptomCold",
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

<section
    className="symptoms-card"
    style={cardStyle}
>

    <button
        type="button"
        className="symptoms-collapse-button"
        onClick={onToggle}
        style={collapseButton}
    >
        {expanded ? "▼" : "▶"} {t("dailyCare.symptoms")}
    </button>

{expanded && (

  <>

    <div
    className="symptoms-grid"
    style={checkboxGrid}
>

      {symptomOptions.map((symptom) => (

<label
    key={symptom.value}
    className="symptom-option"
    style={checkboxLabel}
>

          <input
    className="symptom-option"
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
    className="symptoms-other"
    style={{
        marginTop: "20px",
    }}
>

        <label
className="symptoms-other-label"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          {t("dailyCare.pleaseSpecify")} *
        </label>

        <input
className="symptoms-other-input"
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

<style jsx>{`
    @media (max-width: 640px) {

        .symptoms-card {
            padding: 10px !important;
            margin-bottom: 8px !important;
        }

        .symptoms-collapse-button {
            font-size: 14px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .symptoms-grid {
            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr) !important;

            gap: 6px 8px !important;
            margin-top: 6px !important;
        }

        .symptom-option {
            font-size: 12px !important;
            line-height: 1.2 !important;
            gap: 6px !important;
        }

        .symptom-option input {
            width: 13px;
            height: 15px;
            flex-shrink: 0;
        }

        .symptoms-other {
            margin-top: 10px !important;
        }

        .symptoms-other-label {
            font-size: 11px !important;
            margin-bottom: 4px !important;
        }

        .symptoms-other-input {
            width: 100% !important;
            height: 36px !important;
            box-sizing: border-box !important;
            padding: 7px 9px !important;
            font-size: 13px !important;
        }
    }
`}</style>

    </section>

  );

}
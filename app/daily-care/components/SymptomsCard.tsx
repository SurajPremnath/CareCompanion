"use client";

import type { DailyCareSymptom } from "@/lib/types/dailyCare";

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

  onToggle: () => void;

  onSymptomToggle: (
    symptom: DailyCareSymptom
  ) => void;

}

const symptomOptions: {
  value: DailyCareSymptom;
  label: string;
}[] = [

  {
    value: "FEVER",
    label: "Fever"
  },

  {
    value: "WEAKNESS",
    label: "Weakness"
  },

  {
    value: "BODY_PAIN",
    label: "Body Pain"
  },

  {
    value: "COUGH",
    label: "Cough"
  },

  {
    value: "BLOOD_IN_COUGH",
    label: "Blood in Cough"
  },

  {
    value: "BREATHLESSNESS",
    label: "Breathlessness"
  },

  {
    value: "WALKING_DIFFICULTY",
    label: "Walking Difficulty"
  },

  {
    value: "LOSS_OF_APPETITE",
    label: "Loss of Appetite"
  },

  {
    value: "LOOSE_MOTIONS",
    label: "Loose Motions"
  },

  {
    value: "VOMITING",
    label: "Vomiting"
  },

  {
    value: "DRY_MOUTH",
    label: "Dry Mouth"
  },

  {
    value: "OTHER",
    label: "Other"
  }

];

export default function SymptomsCard({

  expanded,

  disabled = false,

  symptoms,

  onToggle,

  onSymptomToggle

}: SymptomsCardProps) {

  return (

    <section style={cardStyle}>

      <button
        type="button"
        onClick={onToggle}
        style={collapseButton}
      >

        {expanded ? "▼" : "▶"} Symptoms

      </button>

      {expanded && (

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

                {symptom.label}

              </span>

            </label>

          ))}

        </div>

      )}

    </section>

  );

}
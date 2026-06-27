"use client";

import type { PainLocation } from "@/lib/types/dailyCare";

import {
  cardStyle,
  checkboxGrid,
  checkboxLabel,
  sectionTitle,
} from "../styles";

interface PainLocationCardProps {

  visible: boolean;

  disabled?: boolean;

  painLocations: PainLocation[];

  onPainLocationToggle: (
    location: PainLocation
  ) => void;

}

const painLocationOptions: {
  value: PainLocation;
  label: string;
}[] = [

  {
    value: "HEAD",
    label: "Head"
  },

  {
    value: "NECK",
    label: "Neck"
  },

  {
    value: "CHEST",
    label: "Chest"
  },

  {
    value: "ABDOMEN",
    label: "Abdomen"
  },

  {
    value: "BACK",
    label: "Back"
  },

  {
    value: "SHOULDER",
    label: "Shoulder"
  },

  {
    value: "ARM",
    label: "Arm"
  },

  {
    value: "THIGH",
    label: "Thigh"
  },

  {
    value: "KNEE",
    label: "Knee"
  },

  {
    value: "CALF",
    label: "Calf"
  },

  {
    value: "FEET",
    label: "Feet"
  },

  {
    value: "OTHER",
    label: "Other"
  }

];

export default function PainLocationCard({

  visible,

  disabled = false,

  painLocations,

  onPainLocationToggle

}: PainLocationCardProps) {

  if (!visible) {

    return null;

  }

  return (

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        Pain Location
      </h3>

      <div style={checkboxGrid}>

        {painLocationOptions.map((location) => (

          <label
            key={location.value}
            style={checkboxLabel}
          >

            <input
              type="checkbox"
              disabled={disabled}
              checked={painLocations.includes(
                location.value
              )}
              onChange={() =>
                onPainLocationToggle(
                  location.value
                )
              }
            />

            <span>

              {location.label}

            </span>

          </label>

        ))}

      </div>

    </section>

  );

}
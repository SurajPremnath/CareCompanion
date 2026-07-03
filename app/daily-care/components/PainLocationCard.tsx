"use client";

import type { PainLocation } from "@/lib/types/dailyCare";

import {
  cardStyle,
  checkboxGrid,
  checkboxLabel,
  sectionTitle,
} from "../styles";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface PainLocationCardProps {

  disabled?: boolean;

  painLocations: PainLocation[];

  onPainLocationToggle: (
    location: PainLocation
  ) => void;

otherPainLocation: string;

onOtherPainLocationChange: (
  value: string
) => void;

}

const painLocationOptions: {
  value: PainLocation;
  translationKey: string;
}[] = [
  {
    value: "HEAD",
    translationKey: "dailyCare.painHead",
  },
  {
    value: "NECK",
    translationKey: "dailyCare.painNeck",
  },
  {
    value: "CHEST",
    translationKey: "dailyCare.painChest",
  },
  {
    value: "ABDOMEN",
    translationKey: "dailyCare.painAbdomen",
  },
  {
    value: "BACK",
    translationKey: "dailyCare.painBack",
  },
  {
    value: "SHOULDER",
    translationKey: "dailyCare.painShoulder",
  },
  {
    value: "ARM",
    translationKey: "dailyCare.painArm",
  },
  {
    value: "THIGH",
    translationKey: "dailyCare.painThigh",
  },
  {
    value: "KNEE",
    translationKey: "dailyCare.painKnee",
  },
  {
    value: "CALF",
    translationKey: "dailyCare.painCalf",
  },
  {
    value: "FEET",
    translationKey: "dailyCare.painFeet",
  },
  {
    value: "OTHER",
    translationKey: "dailyCare.painOther",
  },
];

export default function PainLocationCard({

  disabled = false,

  painLocations,

  onPainLocationToggle,

otherPainLocation,

onOtherPainLocationChange,

}: PainLocationCardProps) {

const {
  t,
} = useLanguage();

  return (

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        {t("dailyCare.painLocation")}
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

              {t(location.translationKey)}

            </span>

          </label>

        ))}

      </div>

{painLocations.includes("OTHER") && (
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
      value={otherPainLocation}
      disabled={disabled}
      placeholder={t(
        "dailyCare.otherPainPlaceholder"
      )}
      onChange={(event) =>
        onOtherPainLocationChange(
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

    </section>

  );

}
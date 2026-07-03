"use client";

import {
  LANGUAGE_OPTIONS,
} from "@/lib/i18n";

import type {
  SupportedLanguage,
} from "@/lib/i18n/types";

import {
  useLanguage,
} from "./LanguageProvider";


//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function LanguageSelector() {

  const {
    language,
    setLanguage,
  } = useLanguage();


  return (

    <div style={containerStyle}>

      <label
        htmlFor="carevr-language"
        style={labelStyle}
      >
        🌐 Language
      </label>

      <select
        id="carevr-language"
        value={language}
        onChange={(event) =>
          setLanguage(
            event.target.value as SupportedLanguage
          )
        }
        style={selectStyle}
        aria-label="Select language"
      >

        {LANGUAGE_OPTIONS.map(
          (option) => (

            <option
              key={option.code}
              value={option.code}
            >
              {option.nativeLabel}
            </option>

          )
        )}

      </select>

    </div>

  );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const containerStyle:
  React.CSSProperties = {

    display: "flex",

    alignItems: "center",

    gap: "8px",

  };


const labelStyle:
  React.CSSProperties = {

    fontSize: "14px",

    fontWeight: 600,

    color: "#374151",

    whiteSpace: "nowrap",

  };


const selectStyle:
  React.CSSProperties = {

    minHeight: "40px",

    padding: "8px 12px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    background: "#ffffff",

    color: "#111827",

    fontSize: "14px",

    fontWeight: 600,

    cursor: "pointer",

    outline: "none",

  };
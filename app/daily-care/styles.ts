import type { CSSProperties } from "react";

//------------------------------------------------------------
// Card
//------------------------------------------------------------

export const cardStyle: CSSProperties = {

  background: "#ffffff",

  border: "1px solid #d1d5db",

  borderRadius: "12px",

  padding: "24px",

  marginBottom: "24px",

  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"

};

//------------------------------------------------------------
// Section Title
//------------------------------------------------------------

export const sectionTitle: CSSProperties = {

  margin: 0,

  marginBottom: "20px",

  fontSize: "22px",

  fontWeight: 700,

  color: "#111827"

};

//------------------------------------------------------------
// Labels
//------------------------------------------------------------

export const labelStyle: CSSProperties = {

  display: "block",

  marginTop: "16px",

  marginBottom: "8px",

  fontWeight: 600,

  fontSize: "15px",

  color: "#111827",

  minHeight: "48px",     // <-- Add this
  lineHeight: "24px"    // <-- Optional but recommended

};

//------------------------------------------------------------
// Inputs
//------------------------------------------------------------

export const inputStyle: CSSProperties = {

  width: "100%",

  padding: "14px",

  border: "1px solid #d1d5db",

  borderRadius: "10px",

  fontSize: "16px",

  background: "#ffffff",

  boxSizing: "border-box",

  outline: "none"

};

//------------------------------------------------------------
// Collapse Button
//------------------------------------------------------------

export const collapseButton: CSSProperties = {

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

//------------------------------------------------------------
// Checkbox Label
//------------------------------------------------------------

export const checkboxLabel: CSSProperties = {

  display: "flex",

  alignItems: "center",

  gap: "10px",

  padding: "6px 0",

  cursor: "pointer",

  fontSize: "15px",

  color: "#111827"

};

//------------------------------------------------------------
// Primary Button
//------------------------------------------------------------

export const primaryButton: CSSProperties = {

  padding: "16px",

  background: "#2563eb",

  color: "#ffffff",

  border: "none",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: 700,

  cursor: "pointer",

  transition: "all 0.2s ease"

};

//------------------------------------------------------------
// Secondary Button
//------------------------------------------------------------

export const secondaryButton: CSSProperties = {

  padding: "16px",

  background: "#ffffff",

  color: "#111827",

  border: "1px solid #d1d5db",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: 700,

  cursor: "pointer",

  transition: "all 0.2s ease"

};

//------------------------------------------------------------
// Two Column Grid
//------------------------------------------------------------

export const twoColumnGrid: CSSProperties = {

  display: "grid",

  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",

  gap: "16px"

};

//------------------------------------------------------------
// Four Column Grid
//------------------------------------------------------------

export const fourColumnGrid: CSSProperties = {

  display: "grid",

  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",

  gap: "16px"

};

//------------------------------------------------------------
// Checkbox Grid
//------------------------------------------------------------

export const checkboxGrid: CSSProperties = {

  display: "grid",

  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

  gap: "12px",

  marginTop: "20px"

};

//------------------------------------------------------------
// Action Button Container
//------------------------------------------------------------

export const buttonContainer: CSSProperties = {

  display: "flex",

  gap: "16px",

  marginTop: "32px"

};
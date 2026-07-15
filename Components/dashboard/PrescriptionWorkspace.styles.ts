//------------------------------------------------------------
// Prescription Workspace Styles
//------------------------------------------------------------

import type { CSSProperties } from "react";

export const workspaceContainer: CSSProperties = {

    width: "100%",

    marginTop: "16px",

};

export const cameraContainer: CSSProperties = {

    width: "100%",

    marginBottom: "16px",

    padding: "16px",

    background: "#f8fafc",

    border: "1px solid #e2e8f0",

    borderRadius: "12px",

    boxSizing: "border-box",

};

export const cameraVideo: CSSProperties = {

    display: "block",

    width: "100%",

    maxHeight: "520px",

    objectFit: "contain",

    background: "#000",

    borderRadius: "10px",

};

export const cameraActionRow: CSSProperties = {

    display: "flex",

    justifyContent: "center",

    gap: "12px",

    flexWrap: "wrap",

    marginTop: "16px",

};

export const progressContainer: CSSProperties = {

    marginTop: "16px",

    padding: "16px",

    background: "#ffffff",

    border: "1px solid #dbeafe",

    borderRadius: "10px",

};

export const progressHeader: CSSProperties = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "10px",

    fontWeight: 700,

    color: "#1e3a8a",

};

export const progressTrack: CSSProperties = {

    width: "100%",

    height: "10px",

    background: "#dbeafe",

    borderRadius: "999px",

    overflow: "hidden",

};

export const progressFill: CSSProperties = {

    height: "100%",

    background: "#2563eb",

    transition: "width .35s ease",

};

export const errorBox: CSSProperties = {

    marginBottom: "16px",

    padding: "12px 16px",

    background: "#fef2f2",

    border: "1px solid #fecaca",

    borderRadius: "8px",

};

export const errorText: CSSProperties = {

    margin: 0,

    color: "#991b1b",

    fontWeight: 600,

};

export const successBox: CSSProperties = {

    marginBottom: "16px",

    padding: "12px 16px",

    background: "#f0fdf4",

    border: "1px solid #bbf7d0",

    borderRadius: "8px",

};

export const successText: CSSProperties = {

    margin: 0,

    color: "#166534",

    fontWeight: 600,

};

export const primaryButton: CSSProperties = {

    padding: "12px 20px",

    background: "#2563eb",

    color: "#ffffff",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: 700,

    fontSize: "15px",

};

export const secondaryButton: CSSProperties = {

    padding: "12px 20px",

    background: "#ffffff",

    color: "#111827",

    border: "1px solid #cbd5e1",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: 700,

    fontSize: "15px",

};
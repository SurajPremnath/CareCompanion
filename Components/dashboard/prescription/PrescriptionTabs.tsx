"use client";

import React from "react";

export type PrescriptionTab =
    | "patient"
    | "vitals"
    | "symptoms"
    | "assessment"
    | "medication"
    | "investigations"
    | "instructions"
    | "notes";

interface Props {
    activeTab: PrescriptionTab;
    onChange(tab: PrescriptionTab): void;
}

const tabs: {
    id: PrescriptionTab;
    icon: string;
    title: string;
}[] = [
    {
        id: "patient",
        icon: "👤",
        title: "Patient",
    },
    {
        id: "vitals",
        icon: "❤️",
        title: "Vitals",
    },
    {
        id: "symptoms",
        icon: "🤒",
        title: "Symptoms",
    },
    {
        id: "assessment",
        icon: "🩺",
        title: "Assessment",
    },
    {
        id: "medication",
        icon: "💊",
        title: "Medication",
    },
    {
        id: "investigations",
        icon: "🧪",
        title: "Tests",
    },
    {
        id: "instructions",
        icon: "🏠",
        title: "Instructions",
    },
    {
        id: "notes",
        icon: "📝",
        title: "Notes",
    },
];

export default function PrescriptionTabs({
    activeTab,
    onChange,
}: Props) {
    return (
        <div style={container}>
            {tabs.map(tab => {

                const active =
                    activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                            onChange(tab.id)
                        }
                        style={{
                            ...button,
                            ...(active
                                ? activeButton
                                : {}),
                        }}
                    >
                        <span style={icon}>
                            {tab.icon}
                        </span>

                        <span>
                            {tab.title}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

const container: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
};

const button: React.CSSProperties = {
    padding: "10px 18px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
};

const activeButton: React.CSSProperties = {
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #2563eb",
};

const icon: React.CSSProperties = {
    fontSize: "18px",
};
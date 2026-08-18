import type { CSSProperties } from "react";

import type {
    ExtractedCurrentStateOfHealth,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesCurrentStateCardProps {
    currentState:
        ExtractedCurrentStateOfHealth;
}

const cardStyle: CSSProperties = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #D9E2F2",
    borderRadius: "14px",
    overflow: "hidden",
    boxSizing: "border-box",
};

const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #E5EAF2",
};

const iconStyle: CSSProperties = {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2167D5",
    fontSize: "22px",
    flexShrink: 0,
};

const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#111A3A",
};

const bodyStyle: CSSProperties = {
    padding: "18px 24px 22px",
};

const sectionStyle: CSSProperties = {
    marginBottom: "18px",
};

const labelStyle: CSSProperties = {
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#475569",
};

const listStyle: CSSProperties = {
    margin: 0,
    paddingLeft: "20px",
    color: "#1F2937",
    fontSize: "14px",
    lineHeight: 1.55,
};

const stageStyle: CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.55,
    color: "#1F2937",
};

function hasValues(
    values: string[] | undefined
): boolean {
    return Boolean(
        values &&
        values.some(
            value =>
                typeof value === "string" &&
                value.trim().length > 0
        )
    );
}

function cleanValues(
    values: string[] | undefined
): string[] {
    if (!values) {
        return [];
    }

    return values
        .map(value => value.trim())
        .filter(Boolean);
}

export default function DoctorNotesCurrentStateCard({
    currentState,
}: DoctorNotesCurrentStateCardProps) {
    const conditions =
        cleanValues(currentState.conditions);

    const diseaseStatus =
        cleanValues(currentState.diseaseStatus);

    const clinicalAssessment =
        cleanValues(
            currentState.clinicalAssessment
        );

    const importantFindings =
        cleanValues(
            currentState.importantFindings
        );

    const stage =
        currentState.stage?.trim() || "";

    const hasContent =
        hasValues(conditions) ||
        hasValues(diseaseStatus) ||
        Boolean(stage) ||
        hasValues(clinicalAssessment) ||
        hasValues(importantFindings);

    if (!hasContent) {
        return null;
    }

    return (
        <section style={cardStyle}>
            <div style={headerStyle}>
                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ◉
                </div>

                <h2 style={titleStyle}>
                    Current State of Health
                </h2>
            </div>

            <div style={bodyStyle}>
                {hasValues(conditions) && (
                    <div style={sectionStyle}>
                        <div style={labelStyle}>
                            Conditions
                        </div>

                        <ul style={listStyle}>
                            {conditions.map(
                                (value, index) => (
                                    <li
                                        key={`condition-${index}`}
                                    >
                                        {value}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {hasValues(diseaseStatus) && (
                    <div style={sectionStyle}>
                        <div style={labelStyle}>
                            Disease Status
                        </div>

                        <ul style={listStyle}>
                            {diseaseStatus.map(
                                (value, index) => (
                                    <li
                                        key={`status-${index}`}
                                    >
                                        {value}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {stage && (
                    <div style={sectionStyle}>
                        <div style={labelStyle}>
                            Stage
                        </div>

                        <div style={stageStyle}>
                            {stage}
                        </div>
                    </div>
                )}

                {hasValues(
                    clinicalAssessment
                ) && (
                    <div style={sectionStyle}>
                        <div style={labelStyle}>
                            Clinical Assessment
                        </div>

                        <ul style={listStyle}>
                            {clinicalAssessment.map(
                                (value, index) => (
                                    <li
                                        key={`assessment-${index}`}
                                    >
                                        {value}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {hasValues(
                    importantFindings
                ) && (
                    <div style={sectionStyle}>
                        <div style={labelStyle}>
                            Important Findings
                        </div>

                        <ul style={listStyle}>
                            {importantFindings.map(
                                (value, index) => (
                                    <li
                                        key={`finding-${index}`}
                                    >
                                        {value}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
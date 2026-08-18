import type { CSSProperties } from "react";

import type {
    ExtractedHistory,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesClinicalHistoryCardProps {
    history: ExtractedHistory[];
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

const itemStyle: CSSProperties = {
    padding: "14px 0",
    borderBottom: "1px solid #EEF2F7",
};

const categoryStyle: CSSProperties = {
    marginBottom: "5px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};

const valueStyle: CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.55,
    color: "#1F2937",
};

export default function DoctorNotesClinicalHistoryCard({
    history,
}: DoctorNotesClinicalHistoryCardProps) {

    const validHistory =
        history.filter(
            item =>
                typeof item?.value === "string" &&
                item.value.trim().length > 0
        );

    if (validHistory.length === 0) {
        return null;
    }

    return (
        <section style={cardStyle}>

            <div style={headerStyle}>

                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ◷
                </div>

                <h2 style={titleStyle}>
                    Clinical History
                </h2>

            </div>

            <div style={bodyStyle}>

                {validHistory.map(
                    (item, index) => (
                        <div
                            key={`history-${index}`}
                            style={{
                                ...itemStyle,
                                ...(index ===
                                    validHistory.length - 1
                                    ? {
                                        borderBottom:
                                            "none",
                                    }
                                    : {}),
                            }}
                        >

                            <div
                                style={
                                    categoryStyle
                                }
                            >
                                {item.category}
                            </div>

                            <div
                                style={valueStyle}
                            >
                                {item.value}
                            </div>

                        </div>
                    )
                )}

            </div>

        </section>
    );
}
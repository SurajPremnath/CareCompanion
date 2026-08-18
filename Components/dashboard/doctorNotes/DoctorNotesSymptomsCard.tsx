import type {
    ExtractedSymptom,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesSymptomsCardProps {
    symptoms: ExtractedSymptom[];
}

const cardStyle: React.CSSProperties = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #D9E2F2",
    borderRadius: "14px",
    overflow: "hidden",
    boxSizing: "border-box",
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #E5EAF2",
};

const iconStyle: React.CSSProperties = {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2167D5",
    fontSize: "21px",
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#111A3A",
};

const bodyStyle: React.CSSProperties = {
    padding: "18px 24px 22px",
};

const itemStyle: React.CSSProperties = {
    padding: "14px 0",
    borderBottom: "1px solid #EEF2F7",
};

const symptomStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: 1.45,
    fontWeight: 600,
    color: "#1F2937",
};

const detailRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
};

const detailStyle: React.CSSProperties = {
    fontSize: "12px",
    lineHeight: 1.4,
    color: "#475569",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "999px",
    padding: "4px 9px",
};

export default function DoctorNotesSymptomsCard({
    symptoms,
}: DoctorNotesSymptomsCardProps) {

    const validSymptoms =
        symptoms.filter(
            item =>
                typeof item?.symptom === "string" &&
                item.symptom.trim().length > 0
        );

    if (validSymptoms.length === 0) {
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
                    Symptoms
                </h2>

            </div>

            <div style={bodyStyle}>

                {validSymptoms.map(
                    (item, index) => {

                        const details = [
                            item.duration
                                ? `Duration: ${item.duration}`
                                : null,

                            item.severity
                                ? `Severity: ${item.severity}`
                                : null,

                            item.qualifiers
                                ? item.qualifiers
                                : null,
                        ].filter(
                            (
                                value
                            ): value is string =>
                                Boolean(value)
                        );

                        return (
                            <div
                                key={`symptom-${index}`}
                                style={{
                                    ...itemStyle,

                                    ...(index ===
                                        validSymptoms.length - 1
                                        ? {
                                            borderBottom:
                                                "none",
                                        }
                                        : {}),
                                }}
                            >

                                <div
                                    style={
                                        symptomStyle
                                    }
                                >
                                    {item.symptom}
                                </div>

                                {details.length > 0 && (
                                    <div
                                        style={
                                            detailRowStyle
                                        }
                                    >
                                        {details.map(
                                            (
                                                detail,
                                                detailIndex
                                            ) => (
                                                <span
                                                    key={
                                                        `symptom-${index}-detail-${detailIndex}`
                                                    }
                                                    style={
                                                        detailStyle
                                                    }
                                                >
                                                    {detail}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                            </div>
                        );
                    }
                )}

            </div>

        </section>
    );
}
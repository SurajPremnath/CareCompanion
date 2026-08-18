import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesVitalsCardProps {
    vitals: ExtractedPrescription["consultationVitals"];
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
    gap: "10px",
    padding: "14px 18px 10px",
};

const iconStyle: React.CSSProperties = {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#EEF4FF",
    border: "1px solid #D9E6FF",
    color: "#2167D5",
    fontSize: "17px",
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.25,
    fontWeight: 700,
    color: "#111A3A",
};

const bodyStyle: React.CSSProperties = {
    padding: "4px 18px 16px",
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "10px",
};

const itemStyle: React.CSSProperties = {
    minWidth: 0,
    padding: "10px 12px",
    borderRadius: "10px",
    background: "#F8FAFC",
    border: "1px solid #E5EAF2",
};

const labelStyle: React.CSSProperties = {
    marginBottom: "4px",
    fontSize: "12px",
    lineHeight: 1.3,
    color: "#64748B",
};

const valueStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: 1.35,
    fontWeight: 600,
    color: "#17213D",
    wordBreak: "break-word",
};

function displayValue(
    value: unknown
): string | null {
    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    if (
        typeof value === "string"
    ) {
        return value.trim() || null;
    }

    if (
        typeof value === "object"
    ) {
        const objectValue =
            value as {
                value?: unknown;
                systolic?: unknown;
                diastolic?: unknown;
                unit?: unknown;
            };

        if (
            objectValue.systolic !== undefined &&
            objectValue.diastolic !== undefined
        ) {
            const unit =
                typeof objectValue.unit === "string" &&
                objectValue.unit.trim()
                    ? ` ${objectValue.unit.trim()}`
                    : "";

            return `${objectValue.systolic}/${objectValue.diastolic}${unit}`;
        }

        if (
            objectValue.value !== undefined &&
            objectValue.value !== null
        ) {
            const unit =
                typeof objectValue.unit === "string" &&
                objectValue.unit.trim()
                    ? ` ${objectValue.unit.trim()}`
                    : "";

            return `${objectValue.value}${unit}`;
        }
    }

    return null;
}

export default function DoctorNotesVitalsCard({
    vitals,
}: DoctorNotesVitalsCardProps) {

    const items = [
        {
            label: "Weight",
            value: displayValue(vitals?.weight),
        },
        {
            label: "Height",
            value: displayValue(vitals?.height),
        },
        {
            label: "BMI",
            value: displayValue(vitals?.bmi),
        },
        {
            label: "Blood Pressure",
            value: displayValue(
                vitals?.bloodPressure
            ),
        },
        {
            label: "Pulse",
            value: displayValue(
                vitals?.pulse
            ),
        },
        {
            label: "Respiratory Rate",
            value: displayValue(
                vitals?.respiratoryRate
            ),
        },
        {
            label: "SpO₂",
            value: displayValue(
                vitals?.spo2
            ),
        },
        {
            label: "Temperature",
            value: displayValue(
                vitals?.temperature
            ),
        },
    ].filter(
        item => item.value !== null
    );

    if (items.length === 0) {
        return null;
    }

    return (
        <section style={cardStyle}>

            <div style={headerStyle}>

                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ♥
                </div>

                <h3 style={titleStyle}>
                    Vitals
                </h3>

            </div>

            <div style={bodyStyle}>

                <div style={gridStyle}>

                    {items.map(item => (
                        <div
                            key={item.label}
                            style={itemStyle}
                        >
                            <div style={labelStyle}>
                                {item.label}
                            </div>

                            <div style={valueStyle}>
                                {item.value}
                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}
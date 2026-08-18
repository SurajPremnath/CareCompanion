import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesConsultationCardProps {
    encounter: ExtractedPrescription["encounterIdentity"];
}

const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #D9E2F2",
    borderRadius: "14px",
    overflow: "hidden",
    width: "100%",
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
    fontSize: "27px",
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
    padding: "16px 24px 20px",
};

const primaryGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "minmax(0, 1.1fr) minmax(0, 0.8fr) minmax(0, 1.3fr)",
    width: "100%",
};

const secondaryGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "minmax(0, 1fr) minmax(0, 1fr)",
    width: "100%",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #E5EAF2",
};

const fieldStyle: React.CSSProperties = {
    minWidth: 0,
    paddingRight: "18px",
};

const dividerFieldStyle: React.CSSProperties = {
    ...fieldStyle,
    borderRight: "1px solid #D9E2F2",
    marginRight: "18px",
};

const labelStyle: React.CSSProperties = {
    marginBottom: "8px",
    fontSize: "14px",
    lineHeight: 1.3,
    fontWeight: 500,
    color: "#111A3A",
};

const valueStyle: React.CSSProperties = {
    fontSize: "18px",
    lineHeight: 1.4,
    fontWeight: 500,
    color: "#111827",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
};

const modeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "17px",
    lineHeight: 1.4,
    fontWeight: 500,
    color: "#111827",
};

function ConsultationField({
    label,
    value,
    divider,
}: {
    label: string;
    value: string;
    divider?: boolean;
}) {
    return (
        <div
            style={
                divider
                    ? dividerFieldStyle
                    : fieldStyle
            }
        >
            <div style={labelStyle}>
                {label}
            </div>

            <div style={valueStyle}>
                {value || "—"}
            </div>
        </div>
    );
}

function formatConsultationDate(
    value: string | null | undefined
): string {

    if (!value?.trim()) {
        return "—";
    }

    const match =
        value.trim().match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );

    if (!match) {
        return value.trim();
    }

    const [
        ,
        year,
        month,
        day,
    ] = match;

    const date =
        new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value.trim();
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

export default function DoctorNotesConsultationCard({
    encounter,
}: DoctorNotesConsultationCardProps) {
    const hospital =
        encounter?.hospitalOrClinic?.trim() || "—";

const consultationDate =
    formatConsultationDate(
        encounter?.consultationDate
    );

    const doctor =
        encounter?.doctorName?.trim() || "—";

    const consultationMode =
        encounter?.consultationMode?.trim() || "—";

    const doctorType =
        encounter?.doctorType?.trim() || "—";

    return (
        <section style={cardStyle}>
            <div style={headerStyle}>
                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ♧
                </div>

                <h2 style={titleStyle}>
                    Consultation
                </h2>
            </div>

            <div style={bodyStyle}>
                <div style={primaryGridStyle}>

                    <ConsultationField
                        label="Hospital / Clinic"
                        value={hospital}
                        divider
                    />

<ConsultationField
    label="Consultation Date"
    value={consultationDate}
    divider
/>

                    <ConsultationField
                        label="Consulting Doctor"
                        value={doctor}
                    />
                </div>

                <div style={secondaryGridStyle}>
                    <div style={dividerFieldStyle}>
                        <div style={labelStyle}>
                            Consultation Mode
                        </div>

                        <div style={modeStyle}>
                            <span
                                aria-hidden="true"
                                style={{
                                    color: "#2167D5",
                                    fontSize: "20px",
                                }}
                            >
                                ♧
                            </span>

                            <span>
                                {consultationMode}
                            </span>
                        </div>
                    </div>

                    <ConsultationField
                        label="Doctor Type"
                        value={doctorType}
                    />
                </div>
            </div>




        </section>
    );
}
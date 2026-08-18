import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesPatientCardProps {
    patient: ExtractedPrescription["patientIdentity"];
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

const fieldsStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "minmax(0, 1.6fr) minmax(85px, 0.75fr) minmax(85px, 0.75fr)",
    width: "100%",
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
    whiteSpace: "normal",
    overflowWrap: "break-word",
};

function PatientField({
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

export default function DoctorNotesPatientCard({
    patient,
}: DoctorNotesPatientCardProps) {
    const patientName =
        patient?.patientName?.trim() || "—";

    const sex =
        patient?.patientGender?.trim() || "—";

    const age =
        patient?.patientAge !== null &&
        patient?.patientAge !== undefined &&
        String(patient.patientAge).trim() !== ""
            ? `${patient.patientAge} Years`
            : "—";

    return (
        <section style={cardStyle}>
            <div style={headerStyle}>
                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ♙
                </div>

                <h2 style={titleStyle}>
                    Patient
                </h2>
            </div>

            <div style={bodyStyle}>
                <div style={fieldsStyle}>
                    <PatientField
                        label="Patient Name"
                        value={patientName}
                        divider
                    />

                    <PatientField
                        label="Sex"
                        value={sex}
                        divider
                    />

                    <PatientField
                        label="Age"
                        value={age}
                    />
                </div>
            </div>
        </section>
    );
}
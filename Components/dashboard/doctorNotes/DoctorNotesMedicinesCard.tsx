import type {
    ExtractedPrescriptionMedicine,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesMedicinesCardProps {
    medicines: ExtractedPrescriptionMedicine[];
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
    padding: "16px 18px",
    background: "#F8FAFF",
    borderBottom: "1px solid #E7EDF7",
};

const iconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#EEF4FF",
    border: "1px solid #D5E3FF",
    color: "#2167D5",
    fontSize: "20px",
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.25,
    fontWeight: 700,
    color: "#2167D5",
};

const bodyStyle: React.CSSProperties = {
    padding: "6px 18px 10px",
};

const medicineStyle: React.CSSProperties = {
    padding: "14px 0",
    borderBottom: "1px solid #EEF2F7",
};

const medicineNameStyle: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.4,
    fontWeight: 700,
    color: "#17213D",
};

const medicineMetaStyle: React.CSSProperties = {
    marginTop: "3px",
    fontSize: "12px",
    lineHeight: 1.4,
    color: "#64748B",
};

const detailsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "9px",
};

const detailStyle: React.CSSProperties = {
    fontSize: "12px",
    lineHeight: 1.45,
    color: "#475569",
};

const instructionStyle: React.CSSProperties = {
    marginTop: "7px",
    fontSize: "12px",
    lineHeight: 1.45,
    color: "#334155",
};

export default function DoctorNotesMedicinesCard({
    medicines,
}: DoctorNotesMedicinesCardProps) {

    const validMedicines =
        medicines.filter(
            medicine =>
                typeof medicine?.name === "string" &&
                medicine.name.trim().length > 0
        );

    if (validMedicines.length === 0) {
        return null;
    }

    return (
        <section style={cardStyle}>

            <div style={headerStyle}>

                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    +
                </div>

                <h3 style={titleStyle}>
                    Medicines Suggested
                </h3>

            </div>

            <div style={bodyStyle}>

                {validMedicines.map(
                    (
                        medicine,
                        index
                    ) => {

                        const formAndStrength = [
                            medicine.strength,
                            medicine.form,
                        ].filter(
                            (
                                value
                            ): value is string =>
                                typeof value === "string" &&
                                value.trim().length > 0
                        );

                        const details = [
                            medicine.dose
                                ? `Dose: ${medicine.dose}`
                                : null,

                            medicine.frequency
                                ? `Frequency: ${medicine.frequency}`
                                : null,

                            medicine.timings.length > 0
                                ? `Timing: ${medicine.timings.join(", ")}`
                                : null,

                            medicine.duration
                                ? `Duration: ${medicine.duration}`
                                : null,
                        ].filter(
                            (
                                value
                            ): value is string =>
                                Boolean(value)
                        );

                        return (
                            <div
                                key={
                                    `medicine-${index}`
                                }
                                style={{
                                    ...medicineStyle,

                                    ...(index ===
                                        validMedicines.length - 1
                                        ? {
                                            borderBottom:
                                                "none",
                                        }
                                        : {}),
                                }}
                            >

                                <div
                                    style={
                                        medicineNameStyle
                                    }
                                >
                                    {medicine.name}
                                </div>

                                {formAndStrength.length > 0 && (
                                    <div
                                        style={
                                            medicineMetaStyle
                                        }
                                    >
                                        {formAndStrength.join(
                                            " · "
                                        )}
                                    </div>
                                )}

                                {details.length > 0 && (
                                    <div
                                        style={
                                            detailsStyle
                                        }
                                    >
                                        {details.map(
                                            (
                                                detail,
                                                detailIndex
                                            ) => (
                                                <div
                                                    key={
                                                        `medicine-${index}-detail-${detailIndex}`
                                                    }
                                                    style={
                                                        detailStyle
                                                    }
                                                >
                                                    {detail}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {medicine.instructions && (
                                    <div
                                        style={
                                            instructionStyle
                                        }
                                    >
                                        {medicine.instructions}
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
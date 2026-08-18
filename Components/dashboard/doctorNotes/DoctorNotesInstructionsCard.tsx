import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesInstructionsCardProps {
    instructions:
        ExtractedPrescription["doctorInstructions"];
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
    gap: "14px",
    padding: "16px 18px 10px",
};

const iconStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#EEF4FF",
    border: "1px solid #D5E3FF",
    color: "#2167D5",
    fontSize: "23px",
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
    padding: "2px 20px 18px 78px",
};

const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: "20px",
};

const itemStyle: React.CSSProperties = {
    marginBottom: "8px",
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#17213D",
};

export default function DoctorNotesInstructionsCard({
    instructions,
}: DoctorNotesInstructionsCardProps) {

    const validInstructions =
        instructions.filter(
            item =>
                typeof item === "string" &&
                item.trim().length > 0
        );

    if (validInstructions.length === 0) {
        return null;
    }

    return (
        <section style={cardStyle}>

            <div style={headerStyle}>

                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ✓
                </div>

                <h3 style={titleStyle}>
                    Instructions
                </h3>

            </div>

            <div style={bodyStyle}>

                <ul style={listStyle}>

                    {validInstructions.map(
                        (
                            instruction,
                            index
                        ) => (

                            <li
                                key={
                                    `instruction-${index}`
                                }
                                style={
                                    index ===
                                    validInstructions.length - 1
                                        ? {
                                            ...itemStyle,
                                            marginBottom: 0,
                                        }
                                        : itemStyle
                                }
                            >
                                {instruction}
                            </li>

                        )
                    )}

                </ul>

            </div>

        </section>
    );
}
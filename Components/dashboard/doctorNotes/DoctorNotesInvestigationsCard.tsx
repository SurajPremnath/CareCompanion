import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesInvestigationsCardProps {
    investigations: ExtractedPrescription["investigations"];
}

const cardStyle: React.CSSProperties = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #BFE7F0",
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
    background: "#E5F7FA",
    border: "1px solid #BFE7F0",
    color: "#087B95",
    fontSize: "23px",
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.25,
    fontWeight: 700,
    color: "#087B95",
};

const bodyStyle: React.CSSProperties = {
    padding: "2px 20px 18px 78px",
};

const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: "20px",
};

const itemStyle: React.CSSProperties = {
    marginBottom: "7px",
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#17213D",
};

export default function DoctorNotesInvestigationsCard({
    investigations,
}: DoctorNotesInvestigationsCardProps) {

    const validInvestigations =
        investigations.filter(
            item =>
                typeof item === "string" &&
                item.trim().length > 0
        );

    if (
        validInvestigations.length === 0
    ) {
        return null;
    }

    return (
        <section style={cardStyle}>

            <div style={headerStyle}>

                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ⚗
                </div>

                <h3 style={titleStyle}>
                    Investigations
                </h3>

            </div>

            <div style={bodyStyle}>

                <ul style={listStyle}>

                    {validInvestigations.map(
                        (
                            investigation,
                            index
                        ) => (

                            <li
                                key={
                                    `investigation-${index}`
                                }
                                style={
                                    index ===
                                    validInvestigations.length - 1
                                        ? {
                                            ...itemStyle,
                                            marginBottom: 0,
                                        }
                                        : itemStyle
                                }
                            >
                                {investigation}
                            </li>

                        )
                    )}

                </ul>

            </div>

        </section>
    );
}
interface DoctorNotesFollowUpCardProps {
    followUpPlan: string[];
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
    background: "#FFF9F0",
    borderBottom: "1px solid #F4E5C9",
};

const iconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFF2D9",
    border: "1px solid #F1D8A8",
    color: "#A66A00",
    fontSize: "19px",
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.25,
    fontWeight: 700,
    color: "#A66A00",
};

const bodyStyle: React.CSSProperties = {
    padding: "12px 18px 14px",
};

const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: "20px",
};

const itemStyle: React.CSSProperties = {
    marginBottom: "8px",
    fontSize: "13px",
    lineHeight: 1.5,
    color: "#17213D",
};

export default function DoctorNotesFollowUpCard({
    followUpPlan,
}: DoctorNotesFollowUpCardProps) {

    const validItems =
        followUpPlan.filter(
            item =>
                typeof item === "string" &&
                item.trim().length > 0
        );

    if (validItems.length === 0) {
        return null;
    }

    return (
        <section style={cardStyle}>

            <div style={headerStyle}>

                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ↻
                </div>

                <h3 style={titleStyle}>
                    Follow-up Plan
                </h3>

            </div>

            <div style={bodyStyle}>

                <ul style={listStyle}>

                    {validItems.map(
                        (
                            item,
                            index
                        ) => (

                            <li
                                key={
                                    `follow-up-${index}`
                                }
                                style={
                                    index ===
                                    validItems.length - 1
                                        ? {
                                            ...itemStyle,
                                            marginBottom: 0,
                                        }
                                        : itemStyle
                                }
                            >
                                {item}
                            </li>

                        )
                    )}

                </ul>

            </div>

        </section>
    );
}
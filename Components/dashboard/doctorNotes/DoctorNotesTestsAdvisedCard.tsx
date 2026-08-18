import type {
    ExtractedTestAdvised,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface DoctorNotesTestsAdvisedCardProps {
    testsAdvised: ExtractedTestAdvised[];
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
    gap: "12px",
    padding: "16px 18px",
    background: "#F3FCFD",
    borderBottom: "1px solid #D9F0F4",
};

const iconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#E3F7FA",
    border: "1px solid #BFE7F0",
    color: "#087B95",
    fontSize: "19px",
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
    padding: "6px 18px 10px",
};

const itemStyle: React.CSSProperties = {
    padding: "13px 0",
    borderBottom: "1px solid #EEF2F7",
};

const testStyle: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.45,
    fontWeight: 700,
    color: "#17213D",
};

const detailsStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "7px",
};

const detailStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    color: "#475569",
    fontSize: "11px",
    lineHeight: 1.35,
};

export default function DoctorNotesTestsAdvisedCard({
    testsAdvised,
}: DoctorNotesTestsAdvisedCardProps) {

    const validTests =
        testsAdvised.filter(
            item =>
                typeof item?.test === "string" &&
                item.test.trim().length > 0
        );

    if (validTests.length === 0) {
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
                    Tests Advised
                </h3>

            </div>

            <div style={bodyStyle}>

                {validTests.map(
                    (item, index) => {

                        const details = [
                            item.action,
                            item.timing,
                            item.condition,
                        ].filter(
                            (
                                value
                            ): value is string =>
                                typeof value === "string" &&
                                value.trim().length > 0
                        );

                        return (
                            <div
                                key={
                                    `test-advised-${index}`
                                }
                                style={{
                                    ...itemStyle,

                                    ...(index ===
                                        validTests.length - 1
                                        ? {
                                            borderBottom:
                                                "none",
                                        }
                                        : {}),
                                }}
                            >

                                <div
                                    style={testStyle}
                                >
                                    {item.test}
                                </div>

                                {details.length > 0 && (
                                    <div
                                        style={detailsStyle}
                                    >
                                        {details.map(
                                            (
                                                detail,
                                                detailIndex
                                            ) => (
                                                <span
                                                    key={
                                                        `test-advised-${index}-${detailIndex}`
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
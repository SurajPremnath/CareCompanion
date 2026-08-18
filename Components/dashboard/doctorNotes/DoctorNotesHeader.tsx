"use client";

interface DoctorNotesHeaderProps {
    onBack: () => void;
    onDownloadShare?: () => void;
}

const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    width: "100%",
    marginBottom: "20px",
};

const leftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0,
};

const backButtonStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#0F172A",
    fontSize: "32px",
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "26px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#0F172A",
};

const actionButtonStyle: React.CSSProperties = {
    minHeight: "42px",
    padding: "0 16px",
    borderRadius: "10px",
    border: "1px solid #5B8DEF",
    background: "#FFFFFF",
    color: "#1457C5",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
};

export default function DoctorNotesHeader({
    onBack,
    onDownloadShare,
}: DoctorNotesHeaderProps) {
    return (
        <header style={headerStyle}>
            <div style={leftStyle}>
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back"
                    style={backButtonStyle}
                >
                    ←
                </button>

                <h1 style={titleStyle}>
                    Doctor's Notes
                </h1>
            </div>

            <button
                type="button"
                onClick={onDownloadShare}
                style={actionButtonStyle}
            >
                <span
                    aria-hidden="true"
                    style={{
                        fontSize: "19px",
                        lineHeight: 1,
                    }}
                >
                    ↓
                </span>

                Download / Share
            </button>
        </header>
    );
}
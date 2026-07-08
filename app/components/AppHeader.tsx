"use client";

interface AppHeaderProps {
  pageTitle?: string;
  pageIcon?: string;
  currentUserName?: string;
}

export default function AppHeader({
  pageTitle,
  pageIcon,
  currentUserName,
}: AppHeaderProps) {
  return (
    <header
      style={{
        marginBottom: "32px",
        paddingBottom: "24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            ❤️ CareVR
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "16px",
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Simple daily care.
            <br />
            Better clinical conversations.
          </p>
        </div>

        {currentUserName && (
          <div
            style={{
              textAlign: "right",
              color: "#374151",
              fontSize: "15px",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            👤 {currentUserName}
          </div>
        )}
      </div>

            {/* Page Title */}
      {pageTitle && (
        <div
          style={{
            marginTop: "28px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            {pageIcon ? `${pageIcon} ` : ""}
            {pageTitle}
          </h2>
        </div>
      )}
    </header>
  );
}
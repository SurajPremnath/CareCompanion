"use client";

interface AppHeaderProps {
  pageTitle?: string;
  pageIcon?: string;
  currentUserName?: string;
  compact?: boolean;
  onHelpClick?: () => void;
  helpLabel?: string;
}

export default function AppHeader({
  pageTitle,
  pageIcon,
  currentUserName,
  compact = false,
  onHelpClick,
  helpLabel,
}: AppHeaderProps)
{
  return (
    <header
      style={{
        marginBottom: compact ? "20px" : "32px",
        paddingBottom: compact ? "16px" : "24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Top Row */}
      <div className="app-header-top-row">

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: compact ? "36px" : "40px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            ❤️ CareVR
          </h1>

          <p
            style={{
              marginTop: compact ? "6px" : "10px",
marginBottom: 0,
fontSize: compact ? "15px" : "16px",
color: "#6b7280",
lineHeight: compact ? 1.5 : 1.6,
            }}
          >
            Simple daily care.
            <br />
            Better clinical conversations.
          </p>
        </div>

        {(currentUserName || (onHelpClick && helpLabel)) && (
  <div className="app-header-user-area">
  
{currentUserName && (
  <div
    style={{
      color: "#374151",
      fontSize: "15px",
      fontWeight: 500,
    }}
  >
    👤 {currentUserName}
  </div>
)}

{onHelpClick && helpLabel && (
  <button
    type="button"
    onClick={onHelpClick}
    style={{
      padding: 0,
      background: "transparent",
      border: "none",
      color: "#2563eb",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
    }}
  >
    ❓ {helpLabel}
  </button>
)}
  </div>
)}
      </div>

            {/* Page Title */}
      {pageTitle && (
        <div
          style={{
            marginTop: compact ? "20px" : "28px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: compact ? "26px" : "28px",
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            {pageIcon ? `${pageIcon} ` : ""}
            {pageTitle}
          </h2>
        </div>
      )}

<style jsx>{`
    .app-header-top-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
    }

    .app-header-user-area {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        text-align: right;
        white-space: nowrap;
    }

    @media (max-width: 640px) {

        .app-header-top-row {
            flex-direction: column;
            gap: 14px;
        }

        .app-header-user-area {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
        }

    }
`}</style>

    </header>
  );
}
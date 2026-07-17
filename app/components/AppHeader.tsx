"use client";

interface AppHeaderProps {
  pageTitle?: string;
  pageIcon?: string;
  currentUserName?: string;
  compact?: boolean;
  onHelpClick?: () => void;
  helpLabel?: string;

  onCareVRJourneyClick?: () => void;
  careVRJourneyLabel?: string;
}

export default function AppHeader({
  pageTitle,
  pageIcon,
  currentUserName,
  compact = false,
  onHelpClick,
  helpLabel,
  onCareVRJourneyClick,
  careVRJourneyLabel,
}: AppHeaderProps)
{
  return (
    <header
      style={{
        marginBottom: compact ? "20px" : "32px",
        paddingBottom: compact ? "12px" : "18px",
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
              marginTop: "4px",
marginBottom: 0,
fontSize: compact ? "15px" : "16px",
color: "#6b7280",
lineHeight: 1.35,
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
      marginBottom: "2px",
    }}
  >
    👤 {currentUserName}
  </div>
)}

{onHelpClick && helpLabel && (
  <>
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

    {onCareVRJourneyClick && careVRJourneyLabel && (
      <button
        type="button"
        onClick={onCareVRJourneyClick}
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
        ❤️ {careVRJourneyLabel}
      </button>
    )}

  </>
)}
  </div>
)}
      </div>

            {/* Page Title */}
      {pageTitle && (
        <div
          style={{
            marginTop: compact ? "2px" : "2px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: compact ? "16px" : "18px",
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
    justify-content: flex-start;
    gap: 2px;
    text-align: right;
    white-space: nowrap;
    margin-top: -2px;
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
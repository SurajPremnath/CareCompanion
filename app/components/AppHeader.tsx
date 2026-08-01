"use client";

import type { ReactNode } from "react";

interface AppHeaderProps {
    pageTitle?: string;
    pageIcon?: string;
    currentUserName?: string;
    compact?: boolean;
    onHelpClick?: () => void;
    helpLabel?: string;

    onCareVRJourneyClick?: () => void;
    careVRJourneyLabel?: string;

    headerAccessory?: ReactNode;
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
headerAccessory,
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

{(currentUserName || onCareVRJourneyClick || onHelpClick) && (
    <div className="app-header-user-area">

        {currentUserName && (
<div className="app-header-user-row">

    <div className="user-name">
        👤 {currentUserName}
    </div>

    {headerAccessory && (
        <div className="header-accessory">
            {headerAccessory}
        </div>
    )}

</div>
        )}

        <div className="app-header-nav-row">

            {onCareVRJourneyClick && careVRJourneyLabel && (
                <button
                    type="button"
                    onClick={onCareVRJourneyClick}
                    className="header-link"
                >
                    🧭 {careVRJourneyLabel}
                </button>
            )}

            {onHelpClick && helpLabel && (
                <button
                    type="button"
                    onClick={onHelpClick}
                    className="header-link"
                >
                    ❓ Help
                </button>
            )}

        </div>

    </div>
)}

</div>

<style jsx>{`
    .app-header-top-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
    }

.app-header-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.app-header-action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 4px;

    min-width: 110px;
    min-height: 64px;

    padding: 10px 14px;

    border-radius: 12px;

    border: 1px solid #bfdbfe;

    background: #eff6ff;

    color: #1d4ed8;

    cursor: pointer;

    font-family: inherit;

    transition: all .2s ease;
}

.app-header-action-card:hover {

    background: #dbeafe;

    transform: translateY(-1px);

}

.action-icon {

    font-size: 22px;

}

.action-label {

    font-size: 13px;

    font-weight: 600;

    text-align: center;

    line-height: 1.2;

}

.app-header-user-row,
.app-header-nav-row {

    display:flex;

    justify-content:space-between;

    align-items:center;

    width:100%;

    gap:16px;

}

.app-header-nav-row{

    margin-top:8px;

    padding-top:8px;

    border-top:1px solid #f3f4f6;

}

.user-name{

    flex:1;

    font-size:15px;

    color:#374151;

    font-weight:500;

}

.page-title-inline{

    font-size:16px;

    font-weight:700;

    color:#111827;

}

.header-link{

    background:none;

    border:none;

    padding:0;

    color:#1D4ED8;

    white-space:nowrap;

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    text-decoration:none;

    font-family:inherit;

    transition:color .2s ease;

}

.header-link:hover{

    color:#1E40AF;

}

.header-link:active{

    color:#1E3A8A;

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
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
}

.app-header-actions {

    width: 100%;

    justify-content: space-between;

    margin-top: 10px;

}

.app-header-action-card {

    flex: 1;

    min-width: 0;

    min-height: 58px;

    padding: 8px;

}

.action-icon {

    font-size: 20px;

}

.action-label {

    font-size: 12px;

}

.header-accessory{

    display:flex;

    align-items:center;

    margin-left:16px;

}

    }
`}</style>

    </header>
  );
}
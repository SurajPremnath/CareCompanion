"use client";

import type { ReactNode } from "react";

export type MobileCareMode = "FAMILY" | "SELF";

interface MobileHeaderProps {
    careMode: MobileCareMode;
    onCareModeChange: (mode: MobileCareMode) => void;

    userName: string;

    showCareModeToggle?: boolean;

    showHomeButton?: boolean;
    onHomeClick?: () => void;

    accountMenuOpen: boolean;
    onAccountMenuToggle: () => void;

    consentGranted: boolean;

    onAddPatient: () => void;
    onCareVRJourney: () => void;
    onHelp: () => void;

    languageSelector?: ReactNode;

    onLogout: () => void;
    loggingOut?: boolean;
}

export default function MobileHeader({
    careMode,
    onCareModeChange,

    userName,

    showCareModeToggle = true,

    showHomeButton = false,
    onHomeClick,

    accountMenuOpen,
    onAccountMenuToggle,

    consentGranted,

    onAddPatient,
    onCareVRJourney,
    onHelp,

    languageSelector,

    onLogout,
    loggingOut = false,
}: MobileHeaderProps) {

    const getUserInitials = (name: string): string => {
        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length === 0) {
            return "";
        }

        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    };

    return (
        <header className="carevr-mobile-header">
            <div className="carevr-mobile-brand">
                <img
                    src="/images/CareVR v1.0.png"
                    alt="CareVR"
                    className="carevr-mobile-logo"
                />
            </div>

            <div className="carevr-mobile-header-actions">

                {showHomeButton && onHomeClick && (
<button
    type="button"
    className="carevr-mobile-home-button"
    aria-label="Go to Dashboard"
    onClick={onHomeClick}
>
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M3 10.5L12 3L21 10.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.5 9.5V20H18.5V9.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9.5 20V14H14.5V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
</button>
                )}

<div
    className="carevr-mobile-mode-toggle"
    role="group"
    aria-label="Care mode"
>
    {showCareModeToggle && (
        <button
            type="button"
            className={`carevr-mobile-mode-option ${
                careMode === "FAMILY"
                    ? "carevr-mobile-mode-option-active"
                    : ""
            }`}
            onClick={() =>
                onCareModeChange("FAMILY")
            }
        >
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "6px",
                    color: "#8FD3FF",
                }}
                aria-hidden="true"
            >
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle
                        cx="9"
                        cy="8"
                        r="3"
                    />

                    <path
                        d="M3.5 19c.7-3.2 2.6-5 5.5-5s4.8 1.8 5.5 5"
                    />

                    <path
                        d="M16 5.5a2.5 2.5 0 1 1 0 5"
                    />

                    <path
                        d="M16 13.5c2.4.2 3.9 2 4.5 4.5"
                    />
                </svg>
            </span>

            Family
        </button>
    )}

    <button
        type="button"
        className={`carevr-mobile-mode-option ${
            careMode === "SELF"
                ? "carevr-mobile-mode-option-active"
                : ""
        }`}
        onClick={() =>
            onCareModeChange("SELF")
        }
    >
        Self
    </button>
</div>

                <div className="carevr-mobile-account-wrapper">
                    <button
                        type="button"
                        className="carevr-mobile-user-avatar"
                        aria-label="Account menu"
                        aria-expanded={accountMenuOpen}
                        onClick={onAccountMenuToggle}
                    >
                        {getUserInitials(userName)}
                    </button>

                    {accountMenuOpen && (
                        <div
                            className="carevr-mobile-account-menu"
                            role="menu"
                        >
                            <button
                                type="button"
                                className="carevr-mobile-account-menu-primary"
                                disabled={!consentGranted}
                                onClick={onAddPatient}
                            >
                                Add Patient
                            </button>

                            <button
                                type="button"
                                className="carevr-mobile-account-menu-primary"
                                onClick={onCareVRJourney}
                            >
                                CareVR Journey
                            </button>

                            <button
                                type="button"
                                className="carevr-mobile-account-menu-primary"
                                onClick={onHelp}
                            >
                                Help
                            </button>

                            {languageSelector && (
                                <div className="carevr-mobile-account-menu-language">
                                    <span>
                                        Language
                                    </span>

                                    <div>
                                        {languageSelector}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                className="carevr-mobile-account-menu-logout"
                                disabled={loggingOut}
                                onClick={onLogout}
                            >
                                {loggingOut
                                    ? "Logging out…"
                                    : "Log out"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .carevr-mobile-header {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    width: 100%;
                    padding: 2px 0 2px;
                    box-sizing: border-box;
                    z-index: 20;
                }

                .carevr-mobile-brand {
                    display: flex;
                    align-items: center;
                    min-width: 0;
                    flex: 1 1 auto;
                }

                .carevr-mobile-logo {
                    display: block;
                    width: 200px;
                    height: 100px;
                    object-fit: contain;
                    object-position: left center;
                }

.carevr-mobile-header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: 0 0 auto;
    margin-right: 6px;
}

.carevr-mobile-home-button {
    width: 34px;
    height: 34px;
    border: 1px solid #e5e7eb;
    border-radius: 9px;
    background: #ffffff;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 1px 4px rgba(40, 31, 90, 0.07);
    transition:
        background 0.15s ease,
        transform 0.15s ease;
}

                .carevr-mobile-home-button:hover {
                    background: #f5f7ff;
                    transform: translateY(-1px);
                }

.carevr-mobile-mode-toggle {
    position: absolute;
    left: 54%;
    transform: translateX(-50%);

    display: inline-flex;
    align-items: center;
    padding: 3px;
    border: 1px solid #dfe3ea;
    border-radius: 12px;
    background: #f5f6f8;
    box-shadow: 0 2px 6px rgba(40, 31, 90, 0.06);
}

.carevr-mobile-mode-option {
    min-width: 58px;
    height: 34px;
    padding: 0 12px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #6b7280;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition:
        background 0.18s ease,
        color 0.18s ease,
        box-shadow 0.18s ease;
}

.carevr-mobile-mode-option-active {
    background: #2563eb;
    color: #ffffff;
    font-weight: 700;
    box-shadow: 0 2px 5px rgba(37, 99, 235, 0.22);
}

                .carevr-mobile-account-wrapper {
                    position: relative;
                }

                .carevr-mobile-user-avatar {
                    width: 40px;
                    height: 40px;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    background: linear-gradient(
                        135deg,
                        #2563eb,
                        #4f46e5
                    );
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 800;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 7px rgba(40, 31, 90, 0.12);
                }

                .carevr-mobile-account-menu {
                    position: absolute;
                    top: calc(100% + 7px);
                    right: 0;
                    z-index: 100;
                    width: 178px;
                    padding: 6px;
                    box-sizing: border-box;
                    background: #ffffff;
                    border: 1px solid #e8eaf1;
                    border-radius: 12px;
                    box-shadow:
                        0 10px 30px rgba(40, 31, 90, 0.14);
                }

.carevr-mobile-account-menu-primary,
.carevr-mobile-account-menu-logout {
    width: 100%;
    min-height: 34px;
    border: 0;
    border-radius: 8px;
    padding: 7px 10px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
}

                .carevr-mobile-account-menu-primary {
                    background: #2563eb;
                    color: #ffffff;
                    text-align: center;
                    box-shadow:
                        0 3px 8px rgba(37, 99, 235, 0.16);
                }

                .carevr-mobile-account-menu-primary + .carevr-mobile-account-menu-primary {
                    margin-top: 4px;
                }

                .carevr-mobile-account-menu-primary:hover {
                    background: #1d4ed8;
                }

                .carevr-mobile-account-menu-primary:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

.carevr-mobile-account-menu-language {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0px;
    padding: 4px 2px;
    color: #374151;
    font-size: 12px;
    font-weight: 600;
}

.carevr-mobile-account-menu-logout {
    margin-top: 3px;
    background: #fef2f2;
    color: #dc2626;
}

                .carevr-mobile-account-menu-logout:hover {
                    background: #fee2e2;
                }

                @media (max-width: 420px) {
                    .carevr-mobile-logo {
                        width: 160px;
                        height: 82px;
                    }

.carevr-mobile-header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: 0 0 auto;
    margin-right: 6px;
}
                    .carevr-mobile-mode-option {
                        min-width: 52px;
                        padding: 0 9px;
                        font-size: 12px;
                    }

                    .carevr-mobile-home-button {
                        width: 36px;
                        height: 36px;
                    }

.carevr-mobile-user-avatar {
    width: 38px;
    height: 38px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: linear-gradient(
        135deg,
        #2563eb,
        #4f46e5
    );
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(40, 31, 90, 0.10);
}
                }
            `}</style>
        </header>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authService } from "@/lib/auth/authService";


/*
import { hasPrimaryAccess } from "@/lib/carevr/hasPrimaryAccess";
*/
import { inviteeToPrimaryHandoff } from "@/lib/authorization/inviteeToPrimaryHandoff";
import { supabase } from "@/lib/supabase";
import { patientStorage } from "@/lib/storage/patientStorage";
import { AppAlert } from "@/lib/utils/appAlert";


export type MobileCareMode = "FAMILY" | "SELF";

interface MobileHeaderProps {
    careMode: MobileCareMode;
    onCareModeChange: (mode: MobileCareMode) => void;

userName: string;

pageTitle?: string;
pageSubtitle?: string;

showCareModeToggle?: boolean;

showSelfToggle?: boolean;
showFamilyToggle?: boolean;

showHomeButton?: boolean;
onHomeClick?: () => void;
showSwitchProfile?: boolean;

    accountMenuOpen: boolean;
    onAccountMenuToggle: () => void;

    consentGranted: boolean;
    canAddPatient: boolean;

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

    pageTitle,
    pageSubtitle,

    showCareModeToggle = true,

showSelfToggle = true,
showFamilyToggle = showCareModeToggle,

showHomeButton = false,
onHomeClick,
showSwitchProfile = true,
    accountMenuOpen,
    onAccountMenuToggle,

    consentGranted,
    canAddPatient,
    languageSelector,

    onLogout,
    loggingOut = false,
}: MobileHeaderProps) {
    const router = useRouter();

const [switchingProfile, setSwitchingProfile] =
    useState(false);

const [hasSwitchProfileAccess, setHasSwitchProfileAccess] =
    useState(false);

const [activeAccess, setActiveAccess] = useState<
    {
        id: string;
        access_type: string;
    }[]
>([]);

useEffect(() => {
    let cancelled = false;

    const resolveSwitchProfileVisibility =
        async () => {
            try {
                const user =
                    await authService.getCurrentUser();

                if (!user) {
                    if (!cancelled) {
                        setHasSwitchProfileAccess(false);
                    }
                    return;
                }

const {
    data: loadedActiveAccess,
    error,
} = await supabase
    .from("carevr_access")
    .select("id, access_type")
    .eq("user_id", user.id)
    .eq("access_status", "ACTIVE");

if (error) {
    throw error;
}

const accessRecords = loadedActiveAccess ?? [];


if (!cancelled) {
    setActiveAccess(accessRecords);
}

const hasOriginalInviteeRole =
    accessRecords.some(
        (access) =>
            access.access_type ===
                "CARETAKER" ||
            access.access_type ===
                "DOCTOR" ||
            access.access_type ===
                "SECONDARY_FAMILY_MEMBER"
    );

                if (!cancelled) {
                    setHasSwitchProfileAccess(
                        hasOriginalInviteeRole
                    );
                }
            } catch (error) {
                console.error(
                    "Unable to determine Switch Profile visibility.",
                    error
                );

                if (!cancelled) {
                    setHasSwitchProfileAccess(false);
                }
            }
        };

    void resolveSwitchProfileVisibility();

    return () => {
        cancelled = true;
    };
}, []);

const handleSwitchProfile = async () => {
    if (switchingProfile || loggingOut) {
        return;
    }

    setSwitchingProfile(true);

    try {
        const user =
            await authService.getCurrentUser();

        if (!user) {
            router.replace("/login");
            return;
        }

const primaryAccessExists =
    activeAccess.some(
        (access) =>
            access.access_type === "PRIMARY"
    );

if (!primaryAccessExists) {
const inviteeAccess =
    activeAccess.find(
        (access) =>
            access.access_type ===
                "CARETAKER" ||
            access.access_type ===
                "DOCTOR" ||
            access.access_type ===
                "SECONDARY_FAMILY_MEMBER"
    ) as
        | {
              id: string;
              access_type:
                  | "CARETAKER"
                  | "DOCTOR"
                  | "SECONDARY_FAMILY_MEMBER";
          }
        | undefined;

    if (!inviteeAccess) {
        throw new Error(
            "No valid invitee access was found for profile switching."
        );
    }

    inviteeToPrimaryHandoff.set({
        userId: user.id,
        sourceRole:
            inviteeAccess.access_type,
        targetRole: "PRIMARY",
        createdAt:
            new Date().toISOString(),
    });

sessionStorage.setItem(
    "carevr_invitee_primary_registration",
    JSON.stringify({
        userId: user.id,
        sourceRole:
            inviteeAccess.access_type,
        targetRole: "PRIMARY",
    })
);



    router.replace("/register?registrationContext=INVITEE_PRIMARY");
    return;
}

        router.replace("/profile-selection");
    }
    catch (error) {
        console.error(
            "Unable to switch profile.",
            error
        );

        setSwitchingProfile(false);
    }
};

    const getUserInitials = (name: string): string => {
        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length === 0) {
            return "CV";
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
    <header
    className={`carevr-mobile-header ${
        pageTitle ? "carevr-mobile-header-with-title" : ""
    }`}
>
        <div className="carevr-mobile-brand">
            <img
                src="/images/CareVR v1.0.png"
                alt="CareVR"
                className="carevr-mobile-logo"
            />
        </div>

        {(pageTitle || pageSubtitle) && (
            <div className="carevr-mobile-page-title">
                {pageTitle && (
                    <h1>{pageTitle}</h1>
                )}

                {pageSubtitle && (
                    <p>{pageSubtitle}</p>
                )}
            </div>
        )}

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
    {showFamilyToggle && (
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

    {showSelfToggle && (
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
    )}
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

<div className="carevr-mobile-account-menu">
    <details className="carevr-mobile-account-menu-group">
        <summary className="carevr-mobile-account-menu-trigger">
            <span className="carevr-mobile-account-menu-copy">
                <span className="carevr-mobile-account-menu-heading">
                    Account &amp; Security
                </span>
                <span className="carevr-mobile-account-menu-description">
                    Password and PIN settings
                </span>
            </span>
            <span
                className="carevr-mobile-account-menu-chevron"
                aria-hidden="true"
            >
                ⌄
            </span>
        </summary>

        <div className="carevr-mobile-account-menu-content">
            <button
                type="button"
                className="carevr-mobile-account-menu-primary"
                onClick={() => router.push("/forgot-password")}
            >
                Forgot Password
            </button>

            <button
                type="button"
                className="carevr-mobile-account-menu-primary"
                onClick={() => router.push("/reset-password")}
            >
                Reset Password
            </button>

            <button
                type="button"
                className="carevr-mobile-account-menu-primary"
                onClick={() =>
                    router.push("/secure-access/create-pin?mode=recreate")
                }
            >
                Reset PIN
            </button>
        </div>
    </details>

    <details className="carevr-mobile-account-menu-group">
        <summary className="carevr-mobile-account-menu-trigger">
            <span className="carevr-mobile-account-menu-copy">
                <span className="carevr-mobile-account-menu-heading">
                    Care Management
                </span>
                <span className="carevr-mobile-account-menu-description">
                    Patients, journey and profiles
                </span>
            </span>
            <span
                className="carevr-mobile-account-menu-chevron"
                aria-hidden="true"
            >
                ⌄
            </span>
        </summary>

        <div className="carevr-mobile-account-menu-content">
            {showSwitchProfile && hasSwitchProfileAccess && (
                <button
                    type="button"
                    className="carevr-mobile-account-menu-primary"
                    disabled={switchingProfile || loggingOut}
                    onClick={handleSwitchProfile}
                >
                    {loggingOut
                        ? "Switching profile…"
                        : "Switch Profile"}
                </button>
            )}

{(canAddPatient ||
    activeAccess.some(
        (access) => access.access_type === "PRIMARY"
    )) && (
<button
    type="button"
    className="carevr-mobile-account-menu-primary"
    disabled={!consentGranted}
    onClick={async () => {
        try {
            const result = await patientStorage.getPatients();

            if (!result.success) {
                AppAlert.error(
                    result.error ??
                        "Unable to verify the patient limit. Please try again."
                );
                return;
            }

            const activePatientCount =
                result.data?.length ?? 0;

            if (activePatientCount >= 2) {
                AppAlert.error(
                    "Patient limit reached. You have already added the maximum of 2 patients. You cannot add another patient."
                );
                return;
            }

            router.push("/add-patient");
        } catch {
            AppAlert.error(
                "Unable to verify the patient limit. Please try again."
            );
        }
    }}
>
    Add Patient
</button>
)}

            <button
                type="button"
                className="carevr-mobile-account-menu-primary"
                onClick={() => router.push("/carevr-journey")}
            >
                CareVR Journey
            </button>
        </div>
    </details>

    <details className="carevr-mobile-account-menu-group">
        <summary className="carevr-mobile-account-menu-trigger">
            <span className="carevr-mobile-account-menu-copy">
                <span className="carevr-mobile-account-menu-heading">
                    Help &amp; Support
                </span>
                <span className="carevr-mobile-account-menu-description">
                    Help centre and contact options
                </span>
            </span>
            <span
                className="carevr-mobile-account-menu-chevron"
                aria-hidden="true"
            >
                ⌄
            </span>
        </summary>

        <div className="carevr-mobile-account-menu-content">
            <button
                type="button"
                className="carevr-mobile-account-menu-primary"
                onClick={() => router.push("/help")}
            >
                Help
            </button>

            <a
                href="mailto:lineariseailabs@gmail.com"
                className="carevr-mobile-account-menu-primary carevr-mobile-account-menu-link"
            >
                Contact Support
            </a>
        </div>
    </details>

    {/*
     * Language selection is temporarily hidden during
     * the CareVR soft launch.
     *
     * Localization infrastructure remains active.
     *
     * Keep the language selector hidden during soft launch.
     */}

    <button
        type="button"
        className="carevr-mobile-account-menu-logout"
        disabled={loggingOut}
        onClick={onLogout}
    >
        {loggingOut ? "Logging out…" : "Log out"}
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


.carevr-mobile-header-with-title .carevr-mobile-brand {
    flex: 0 0 auto;
}

.carevr-mobile-page-title {
    flex: 1 1 auto;
    min-width: 0;
    margin-left: 12px;
    padding-right: 8px;
}

@media (max-width: 700px) {
    .carevr-mobile-header-with-title {
        flex-wrap: wrap;
    }

    .carevr-mobile-page-title {
        flex: 1 1 100%;
        order: 2;
        margin-left: 0;
        padding-right: 0;
        padding-top: 4px;
    }

    .carevr-mobile-header-actions {
        order: 3;
        width: auto;
        justify-content: flex-end;
        margin-top: 4px;
        margin-right: 26px;
    }

    .carevr-mobile-mode-toggle {
        position: static;
        transform: none;
    }
}


.carevr-mobile-page-title h1 {
    margin: 0;
    color: #1d2d62;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.1;
}

.carevr-mobile-page-title p {
    margin: 5px 0 0;
    color: #59627b;
    font-size: 12px;
    line-height: 1.3;
}

.carevr-mobile-logo {
    display: block;
    width: 170px;
    height: 70px;
    object-fit: contain;
    object-position: left center;
    flex: 0 0 auto;
}

.carevr-mobile-header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: 0 0 auto;
    margin-right: 28px;
}

.carevr-mobile-home-button {
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    position: relative;
    z-index: 22;
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
    width: 244px;
    max-width: calc(100vw - 24px);
    padding: 8px;
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid #e8eaf1;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(40, 31, 90, 0.16);
}



.carevr-mobile-account-menu-group {
    border-bottom: 1px solid #edf0f5;
}

.carevr-mobile-account-menu-group:last-of-type {
    border-bottom: none;
}

.carevr-mobile-account-menu-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 58px;
    padding: 9px 8px;
    border-radius: 10px;
    list-style: none;
    cursor: pointer;
    transition: background 160ms ease;
}

.carevr-mobile-account-menu-trigger::-webkit-details-marker {
    display: none;
}

.carevr-mobile-account-menu-trigger::marker {
    content: "";
}

.carevr-mobile-account-menu-trigger:hover {
    background: #f7f9fd;
}

.carevr-mobile-account-menu-trigger:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
}

.carevr-mobile-account-menu-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.carevr-mobile-account-menu-heading {
    color: #172033;
    font-size: 12px;
    font-weight: 750;
    line-height: 1.35;
}

.carevr-mobile-account-menu-description {
    color: #697386;
    font-size: 10px;
    font-weight: 500;
    line-height: 1.35;
}

.carevr-mobile-account-menu-chevron {
    flex: 0 0 auto;
    color: #697386;
    font-size: 19px;
    line-height: 1;
    transition: transform 180ms ease;
}

.carevr-mobile-account-menu-group[open]
.carevr-mobile-account-menu-chevron {
    transform: rotate(180deg);
}

.carevr-mobile-account-menu-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 4px 10px 10px;
}

.carevr-mobile-account-menu-primary,
.carevr-mobile-account-menu-logout {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 36px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 9px;
    padding: 8px 10px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 650;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
    transition: background 160ms ease, border-color 160ms ease;
}

.carevr-mobile-account-menu-primary {
    background: #f5f7fc;
    color: #243b67;
    box-shadow: none;
}

.carevr-mobile-account-menu-primary:hover {
    background: #eaf0ff;
    border-color: #dce5ff;
}

.carevr-mobile-account-menu-primary:focus-visible,
.carevr-mobile-account-menu-logout:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

.carevr-mobile-account-menu-primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.carevr-mobile-account-menu-link {
    text-decoration: none;
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
        width: 170px;
        height: 70px;
        max-width: 130px;
    }

/*
Left shift of initial buttons
*/
.carevr-mobile-header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: 0 0 auto;
    margin-right: 28px;
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

"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    authService,
} from "@/lib/auth/authService";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import {
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";

import LanguageSelector from "@/Components/language/LanguageSelector";


//------------------------------------------------------------
// Access Management
//
// Purpose:
// First UI landing page for CareVR Access Management.
//
// Scope of this change:
// UI only. The four cards establish the navigation points for
// the Access Provision, Care Family Invitation, Invitation
// Regeneration, and Clinical Monitoring workflows. Those
// workflows are implemented separately.
//------------------------------------------------------------

type AccessManagementUser = {
    fullName: string;
};


export default function AccessManagementPage() {

    const router =
        useRouter();

    const [
        user,
        setUser,
    ] =
        useState<AccessManagementUser | null>(
            null
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        consentGranted,
        setConsentGranted,
    ] =
        useState(false);

    const [
        loggingOut,
        setLoggingOut,
    ] =
        useState(false);

    const [
        accountMenuOpen,
        setAccountMenuOpen,
    ] =
        useState(false);

    const [
        careMode,
        setCareMode,
    ] =
        useState<MobileCareMode>(
            "FAMILY"
        );


    //--------------------------------------------------------
    // Load authenticated user for the existing CareVR header.
    //--------------------------------------------------------

    useEffect(() => {

        let cancelled = false;

        async function loadUser() {

            try {

                const authUser =
                    await authService
                        .getCurrentUser();

                if (!authUser) {

                    router.replace(
                        "/login"
                    );

                    return;
                }


                const profile =
                    await profileRepository
                        .getCurrentProfile();

                const consent =
                    await consentStorage
                        .hasAcceptedCurrentConsent();

                if (!profile) {

                    await authService.logout();

                    router.replace(
                        "/login"
                    );

                    return;
                }


                if (!cancelled) {

                    setConsentGranted(
                        consent
                    );

                    setUser({
                        fullName:
                            profile.fullName,
                    });

                }

            }
            catch (error) {

                console.error(
                    "Unable to load Access Management page.",
                    error
                );

                try {

                    await authService.logout();

                }
                catch {
                    // Ignore logout failure.
                }

                router.replace(
                    "/login"
                );

            }
            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }

        void loadUser();

        return () => {
            cancelled = true;
        };

    }, [router]);


    //--------------------------------------------------------
    // Mobile Header actions
    //--------------------------------------------------------

    const handleAddPatient =
        () => {

            setAccountMenuOpen(false);

            router.push(
                "/add-patient"
            );

        };


    const handleCareVRJourney =
        () => {

            setAccountMenuOpen(false);

            router.push(
                "/dashboard"
            );

        };


    const handleHelp =
        () => {

            setAccountMenuOpen(false);

            router.push(
                "/help"
            );

        };


    const handleLogout =
        async () => {

            if (loggingOut) {
                return;
            }

            setLoggingOut(true);

            setAccountMenuOpen(false);

            try {

                await authService.logout();

                router.replace(
                    "/login"
                );

            }
            catch (error) {

                console.error(
                    "Unable to log out.",
                    error
                );

                setLoggingOut(false);

            }

        };


    if (loading) {

        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, " +
                        "\"Segoe UI\", sans-serif",
                    color: "#15203d",
                }}
            >
                Loading...
            </main>
        );

    }


    if (!user) {
        return null;
    }


    return (

        <main className="access-management-page">

            <div className="access-management-shell">

                <MobileHeader
                    careMode={careMode}
                    onCareModeChange={setCareMode}
                    userName={user.fullName}
                    showCareModeToggle={false}
                    showHomeButton={true}
                    onHomeClick={() =>
                        router.push("/dashboard")
                    }
                    accountMenuOpen={accountMenuOpen}
                    onAccountMenuToggle={() =>
                        setAccountMenuOpen(
                            value => !value
                        )
                    }
                    consentGranted={consentGranted}
                    canAddPatient={false}
                    onAddPatient={handleAddPatient}
                    onCareVRJourney={handleCareVRJourney}
                    onHelp={handleHelp}
                    languageSelector={<LanguageSelector />}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                />


                {/* Main Access Management landing UI. */}

                <section className="access-management-content">

                    <div className="access-management-icon access-management-icon-shield">

                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 3L20 6V11C20 16 16.8 19.5 12 21C7.2 19.5 4 16 4 11V6L12 3Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M9.5 12L11.2 13.7L14.8 10.1"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                    </div>


                    <h1>
                        Access Management
                    </h1>


                    <p className="access-management-subtitle">
                        Manage people, permissions and clinical
                        monitoring for your CareVR family.
                    </p>


                    <h2>
                        What would you like to manage today?
                    </h2>


                    <div className="access-management-options">

                        <button
                            type="button"
                            className="access-management-option access-management-option-blue"
                            onClick={() =>
                                router.push(
                                    "/access-management/manage-access"
                                )
                            }
                        >

                            <span className="access-management-option-icon">

                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="9"
                                        cy="8"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M3.5 19C4.2 15.8 6.1 14 9 14C11.9 14 13.8 15.8 14.5 19"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <circle
                                        cx="17"
                                        cy="9"
                                        r="2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M15.2 14.5C17.8 14.7 19.5 16.1 20.5 18.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>

                            </span>


                            <span className="access-management-option-copy">

                                <strong>
                                    Manage Access
                                </strong>

                                <span>
                                    Add or revoke CareVR access
                                    for existing family members,
                                    caretakers and doctors.
                                </span>

                            </span>


                            <span
                                className="access-management-chevron"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        <button
                            type="button"
                            className="access-management-option access-management-option-purple"
                            onClick={() =>
                                router.push(
                                    "/access-management/access-to-carevr"
                                )
                            }
                        >

                            <span className="access-management-option-icon">

                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 3L19 6V11C19 15.5 16.2 18.7 12 20C7.8 18.7 5 15.5 5 11V6L12 3Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M9 12H15"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M12 9V15"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>

                            </span>


                            <span className="access-management-option-copy">

                                <strong>
                                    Access to CareVR
                                </strong>

                                <span>
                                    Invite a person to access the
                                    CareVR application.
                                </span>

                            </span>


                            <span
                                className="access-management-chevron"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        <button
                            type="button"
                            className="access-management-option access-management-option-green"
                            onClick={() =>
                                router.push(
                                    "/access-management/invite-care-family-token"
                                )
                            }
                        >

                            <span className="access-management-option-icon">

                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M4 7L12 13L20 7"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </span>


                            <span className="access-management-option-copy">

                                <strong>
                                    Invite Care Family
                                </strong>

                                <span>
                                    Invite a secondary family member,
                                    caretaker or doctor to join your
                                    CareVR family.
                                </span>

                            </span>


                            <span
                                className="access-management-chevron"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        <button
                            type="button"
                            className="access-management-option access-management-option-orange"
                            onClick={() =>
                                router.push(
                                    "/access-management/regenerate-invitation-token"
                                )
                            }
                        >

                            <span className="access-management-option-icon">

                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M20 11A8 8 0 0 0 6.2 5.3L4 7.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M4 4V7.5H7.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M4 13A8 8 0 0 0 17.8 18.7L20 16.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M20 20V16.5H16.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </span>


                            <span className="access-management-option-copy">

                                <strong>
                                    Regenerate Invitation
                                </strong>

                                <span>
                                    Create a new invitation when you
                                    forgot to send the previous
                                    invitation or temporary password.
                                </span>

                            </span>


                            <span
                                className="access-management-chevron"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        <button
                            type="button"
                            className="access-management-option access-management-option-purple"
                            onClick={() =>
                                router.push(
                                    "/access-management/clinical-monitoring"
                                )
                            }
                        >

                            <span className="access-management-option-icon">

                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M6 4V12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12V4"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M4 4H8"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M16 4H20"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <circle
                                        cx="18.5"
                                        cy="17.5"
                                        r="2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                </svg>

                            </span>


                            <span className="access-management-option-copy">

                                <strong>
                                    Clinical Monitoring
                                </strong>

                                <span>
                                    Configure the vitals and symptoms
                                    to be monitored for each patient
                                    based on their doctor's specialist.
                                </span>

                            </span>


                            <span
                                className="access-management-chevron"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <CareVRFooter />

            </div>


            <style jsx global>{`

                * {
                    box-sizing: border-box;
                }


                html,
                body {
                    margin: 0;
                    padding: 0;
                    min-height: 100%;
                }


                body {
                    background: #f8fbff;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    color: #15203d;
                }


                button {
                    font: inherit;
                }


                .access-management-page {
                    min-height: 100vh;
                    min-height: 100dvh;
                    background:
                        linear-gradient(
                            180deg,
                            #f8fbff 0%,
                            #ffffff 52%,
                            #f4f9ff 100%
                        );
                    padding: 0 14px;
                }


                .access-management-shell {
                    width: 100%;
                    max-width: 720px;
                    min-height: 100vh;
                    min-height: 100dvh;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                }


                .access-management-content {
                    flex: 1 0 auto;
                    padding: 34px 10px 22px;
                    text-align: center;
                }


                .access-management-icon {
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }


                .access-management-icon-shield {
                    color: #2563eb;
                    background:
                        linear-gradient(
                            135deg,
                            #eaf4ff,
                            #e8ecff
                        );
                }


                .access-management-content h1 {
                    margin: 0;
                    color: #13265a;
                    font-size: clamp(30px, 7vw, 40px);
                    line-height: 1.15;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }


                .access-management-subtitle {
                    max-width: 560px;
                    margin: 12px auto 28px;
                    color: #53698f;
                    font-size: 17px;
                    line-height: 1.45;
                }


                .access-management-content h2 {
                    margin: 0 0 18px;
                    color: #13265a;
                    font-size: clamp(20px, 5vw, 25px);
                    line-height: 1.25;
                    font-weight: 800;
                }


                .access-management-options {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    width: 100%;
                    max-width: 620px;
                    margin: 0 auto;
                }


                .access-management-option {
                    width: 100%;
                    min-height: 128px;
                    border-radius: 18px;
                    padding: 18px 16px;
                    display: grid;
                    grid-template-columns: 66px minmax(0, 1fr) 22px;
                    align-items: center;
                    gap: 14px;
                    text-align: left;
                    cursor: pointer;
                    transition:
                        transform 0.15s ease,
                        box-shadow 0.15s ease;
                }


                .access-management-option:hover {
                    transform: translateY(-1px);
                    box-shadow:
                        0 8px 22px rgba(40,31,90,0.09);
                }


                .access-management-option-blue {
                    background: #f2f8ff;
                    border: 1px solid #c8e1ff;
                    color: #1264e8;
                }


                .access-management-option-green {
                    background: #f0fcf8;
                    border: 1px solid #c8f0df;
                    color: #12996b;
                }


                .access-management-option-orange {
                    background: #fff7ed;
                    border: 1px solid #fed7aa;
                    color: #ea580c;
                }


                .access-management-option-purple {
                    background: #f7f3ff;
                    border: 1px solid #ddd1ff;
                    color: #5b35d5;
                }


                .access-management-option-icon {
                    width: 66px;
                    height: 66px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.72);
                }


                .access-management-option-copy {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }


                .access-management-option-copy strong {
                    color: #13265a;
                    font-size: 20px;
                    line-height: 1.2;
                    font-weight: 800;
                }


                .access-management-option-copy span {
                    color: #52688d;
                    font-size: 14px;
                    line-height: 1.45;
                    font-weight: 500;
                }


                .access-management-chevron {
                    color: #193b83;
                    font-size: 30px;
                    line-height: 1;
                    font-weight: 400;
                    text-align: center;
                }


                @media (max-width: 420px) {

                    .access-management-page {
                        padding: 0 10px;
                    }


                    .access-management-content {
                        padding-top: 28px;
                    }


                    .access-management-option {
                        min-height: 118px;
                        grid-template-columns: 58px minmax(0, 1fr) 18px;
                        gap: 11px;
                        padding: 15px 12px;
                    }


                    .access-management-option-icon {
                        width: 58px;
                        height: 58px;
                    }


                    .access-management-option-copy strong {
                        font-size: 18px;
                    }


                    .access-management-option-copy span {
                        font-size: 13px;
                    }


                    .access-management-chevron {
                        font-size: 25px;
                    }

                }

            `}</style>

        </main>

    );

}
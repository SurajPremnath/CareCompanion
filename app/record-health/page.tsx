"use client";

import {
    Suspense,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    authService,
} from "@/lib/auth/authService";

import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import type {
    Patient,
} from "@/lib/types/patient";

import {
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import PatientPanel
    from "@/Components/common/PatientPanel";

import CareVRFooter
    from "@/Components/common/CareVRFooter";

import LanguageSelector
    from "@/Components/language/LanguageSelector";

import ManualCareWorkspace
    from "@/Components/dashboard/ManualCareWorkspace";

import VoiceCareWorkspace
    from "@/Components/dashboard/VoiceCareWorkspace";

import UploadCareWorkspace
    from "@/Components/dashboard/UploadCareWorkspace";

import ActionOptions, {
    type ActionOption,
    type MedicationDetailOption,
} from "@/Components/dashboard/ActionOptions";


import PrescriptionWorkspace
    from "@/Components/dashboard/PrescriptionWorkspace";

import PendingMedicationValidation
    from "@/Components/dashboard/PendingMedicationValidation";

import PrescriptionHistoryWorkspace
    from "@/Components/dashboard/PrescriptionHistoryWorkspace";

import ConsultationWorkspace
    from "@/Components/dashboard/ConsultationWorkspace";

import DoctorNotesUploadWorkspace
    from "@/Components/dashboard/DoctorNotesUploadWorkspace";

import {
    prescriptionStorage,
} from "@/lib/prescription/prescriptionStorage";

import ExecutiveSummaryPdfGenerator
    from "@/app/journey-review/mobile/ExecutiveSummaryPdfGenerator";

import ClinicalTrendPdfGenerator
    from "@/app/journey-review/mobile/ClinicalTrendPdfGenerator";

type DashboardUser = {
    id: string;
    fullName: string;
    email: string;
    role: string;
};


type RecordHealthOption =
    | "VOICE"
    | "UPLOAD"
    | "MANUAL"
    | "MEDICATION_MANAGEMENT"
    | "EXECUTIVE_SUMMARY"
    | "CLINICAL_TRENDS"
    | "START_ASSESSMENT"
    | "";


function RecordHealthPageContent() {

    const router =
        useRouter();

const searchParams =
    useSearchParams();

    const [
        user,
        setUser,
    ] = useState<DashboardUser | null>(
        null
    );


    const [
        patients,
        setPatients,
    ] = useState<Patient[]>(
        []
    );


    const [
        selectedPatientId,
        setSelectedPatientId,
    ] = useState<string | null>(
        null
    );


const [
    careMode,
    setCareMode,
] = useState<MobileCareMode>(
    searchParams.get("mode") === "self"
        ? "SELF"
        : "FAMILY"
);

const [
        selectedOption,
        setSelectedOption,
    ] = useState<RecordHealthOption>(
        ""
    );

const [
    medicationDetail,
    setMedicationDetail,
] =
    useState<MedicationDetailOption>(
        ""
    );

const [
    hasPendingMedicationValidation,
    setHasPendingMedicationValidation,
] =
    useState(false);

const [
    checkingPendingMedicationValidation,
    setCheckingPendingMedicationValidation,
] =
    useState(false);

const [
    doctorNotesOption,
    setDoctorNotesOption,
] =
    useState<ActionOption>(
        ""
    );


const handleDoctorNotesOption = (
    option: ActionOption
) => {

    setDoctorNotesOption(
        option
    );

    if (option) {

        setMedicationDetail(
            ""
        );

    }

};

const checkPendingMedicationValidation =
    async (): Promise<void> => {

        if (!user) {
            return;
        }

        setCheckingPendingMedicationValidation(
            true
        );

        try {

            const pending =
                await prescriptionStorage
                    .getPendingMedicationValidation({

                        userId:
                            user.id,

                        patientId:
                            careMode === "FAMILY"
                                ? selectedPatient?.id ??
                                  null
                                : null,

                        familyId:
                            null,

                        recordContext:
                            careMode === "FAMILY"
                                ? "FAMILY"
                                : "SELF",

                    });

            setHasPendingMedicationValidation(
                pending !== null
            );

        }
        finally {

            setCheckingPendingMedicationValidation(
                false
            );

        }

    };

    const [
        consentGranted,
        setConsentGranted,
    ] = useState(false);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        loggingOut,
        setLoggingOut,
    ] = useState(false);


    const [
        accountMenuOpen,
        setAccountMenuOpen,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );


    /*
     * Load authenticated user,
     * consent and active patients.
     */
    useEffect(() => {

        let cancelled = false;


        async function loadPage() {

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


                if (!profile) {

                    await authService.logout();

                    router.replace(
                        "/login"
                    );

                    return;
                }


                const consent =
                    await consentStorage
                        .hasAcceptedCurrentConsent();


                if (cancelled) {
                    return;
                }


                if (!consent) {

                    router.replace(
                        "/consent"
                    );

                    return;
                }


                setUser({
                    id:
                        profile.id,

                    fullName:
                        profile.fullName,

                    email:
                        profile.email,

                    role:
                        profile.role,
                });


                setConsentGranted(
                    true
                );


                const patientResult =
                    await patientStorage
                        .getPatients();


                if (cancelled) {
                    return;
                }


                const loadedPatients =
                    patientResult.success
                        ? patientResult.data ?? []
                        : [];


                setPatients(
                    loadedPatients
                );


                /*
                 * Family mode defaults to
                 * the first active patient.
                 */
                if (
                    loadedPatients.length > 0
                ) {

                    setSelectedPatientId(
                        loadedPatients[0].id
                    );

                }

            }
            catch (loadError) {

                console.error(
                    "Unable to load Record Health page.",
                    loadError
                );


                if (!cancelled) {

                    setError(
                        "Unable to load Record Health."
                    );

                }

            }
            finally {

                if (!cancelled) {

                    setLoading(
                        false
                    );

                }

            }

        }


        void loadPage();


        return () => {

            cancelled = true;

        };

    }, [router]);


const selectedPatient =
    useMemo(
        () =>
            patients.find(
                patient =>
                    patient.id ===
                    selectedPatientId
            ) ?? null,
        [
            patients,
            selectedPatientId,
        ]
    );


/*
 * Check whether the current user / patient
 * has any medicines waiting for validation.
 *
 * This must run after:
 * - user is loaded
 * - patients are loaded
 * - selected patient is available
 */
useEffect(() => {

    if (!user) {
        return;
    }

    if (
        careMode === "FAMILY" &&
        !selectedPatient
    ) {
        return;
    }

    void checkPendingMedicationValidation();

}, [
    user,
    careMode,
    selectedPatient,
]);


/*
 * Changing Family / Self clears
 * the current recording option.
 *
 * Family:
 *   patient must be selected.
 *
 * Self:
 *   no Patient record is required.
 */
const handleCareModeChange =
        (
            mode: MobileCareMode
        ) => {

            setCareMode(
                mode
            );

            setSelectedOption(
                ""
            );

            if (
                mode === "FAMILY" &&
                patients.length > 0
            ) {

                setSelectedPatientId(
                    current =>
                        current &&
                        patients.some(
                            patient =>
                                patient.id ===
                                current
                        )
                            ? current
                            : patients[0].id
                );

            }

        };


    const handlePatientSelect =
        (
            patient: Patient
        ) => {

            if (!consentGranted) {
                return;
            }

            setSelectedPatientId(
                patient.id
            );

            setSelectedOption(
                ""
            );

        };


    const handleLogout =
        async () => {

            if (loggingOut) {
                return;
            }


            setLoggingOut(
                true
            );


            try {

                await authService.logout();


                router.replace(
                    "/login"
                );

            }
            catch (logoutError) {

                console.error(
                    "Unable to log out.",
                    logoutError
                );


                setLoggingOut(
                    false
                );

            }

        };


    const handleCareVRJourney =
        () => {

            setAccountMenuOpen(
                false
            );

            router.push(
                "/dashboard"
            );

        };


    const handleHelp =
        () => {

            setAccountMenuOpen(
                false
            );

            router.push(
                "/help"
            );

        };


    /*
     * Family mode requires a selected patient.
     * Self mode operates without one.
     */
    const canRecord =
        careMode === "SELF" ||
        selectedPatient !== null;


    if (loading) {

        return (
            <main className="record-health-page">

                <div className="record-health-loading">
                    Loading…
                </div>

                <style jsx>{`

                    .record-health-page {
                        min-height: 100vh;
                        background: #f8f6ff;
                    }

                    .record-health-loading {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #59657f;
                        font-size: 15px;
                    }

                `}</style>

            </main>
        );

    }


    if (!user) {
        return null;
    }


    return (
        <main className="record-health-page">

            <div className="record-health-shell">

                <MobileHeader
                    careMode={
                        careMode
                    }

                    onCareModeChange={
                        handleCareModeChange
                    }

                    userName={
                        user.fullName
                    }

                    showHomeButton={
                        true
                    }

                    onHomeClick={() =>
                        router.push(
                            "/dashboard"
                        )
                    }

                    accountMenuOpen={
                        accountMenuOpen
                    }

                    onAccountMenuToggle={() =>
                        setAccountMenuOpen(
                            value => !value
                        )
                    }

                    consentGranted={
                        consentGranted
                    }

                    onAddPatient={() => {
                        /*
                         * Intentionally unused on
                         * Record Health.
                         *
                         * Add Patient will be removed
                         * from this page's account menu
                         * in the reusable header change.
                         */
                    }}

                    onCareVRJourney={
                        handleCareVRJourney
                    }

                    onHelp={
                        handleHelp
                    }

                    languageSelector={
                        <LanguageSelector />
                    }

                    onLogout={
                        handleLogout
                    }

                    loggingOut={
                        loggingOut
                    }
                />


                <section className="record-health-content">


{careMode === "FAMILY" && (

    <PatientPanel
        userName={
            user.fullName
        }
        patients={
            patients
        }
        selectedPatientId={
            selectedPatientId
        }
        onPatientSelect={
            handlePatientSelect
        }
        careMode={
            careMode
        }
    />

)}


                    {careMode === "SELF" && (

                        <section className="self-mode-card">

                            <div className="self-mode-avatar">
                                {
                                    user.fullName
                                        .trim()
                                        .split(/\s+/)
                                        .filter(Boolean)
                                        .map(
                                            part =>
                                                part[0]
                                        )
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()
                                }
                            </div>

                            <div className="self-mode-content">

                                <span className="self-mode-label">
                                    Recording for
                                </span>

                                <strong>
                                    {user.fullName}
                                </strong>

                            </div>

                            <span className="self-mode-check">
                                ✓
                            </span>

                        </section>

                    )}


                    {canRecord && (

                        <section className="record-health-section">

<div className="record-health-heading">

<h1>
    {searchParams.get("view") === "timeline"
        ? "Health Timeline"
        : searchParams.get("view") === "assessment"
            ? "Health Assessment"
            : "Record Health"}
</h1>

<p>
    {searchParams.get("view") === "timeline"
        ? "View your health journey and clinical trends"
        : searchParams.get("view") === "assessment"
            ? "Answer a few questions about your current health"
            : "Choose how you want to record today's information"}
</p>

</div>
{searchParams.get("view") === "care-journey" ? (

    <>

        <ActionOptions
            selectedAction="MEDICATION_MANAGEMENT"

            personMode={
                careMode === "SELF"
                    ? "SELF"
                    : "FAMILY"
            }

            patientId={
                careMode === "FAMILY"
                    ? selectedPatient?.id ?? null
                    : null
            }

            patientName={
                careMode === "SELF"
                    ? user.fullName
                    : selectedPatient?.fullName ?? ""
            }

            hasPendingMedicationValidation={
                hasPendingMedicationValidation
            }

            checkingPendingMedicationValidation={
                checkingPendingMedicationValidation
            }

            onDoctorNotesOptionChange={
                handleDoctorNotesOption
            }

            onMedicationDetailChange={
                (option) => {

                    setMedicationDetail(
                        option
                    );

                    if (option) {

                        setDoctorNotesOption(
                            ""
                        );

                    }

                }
            }

            selectedMedicationDetail={
                medicationDetail
            }
        />

        {doctorNotesOption === "MANUAL" && (

    <div className="dashboard-workspace">

        <ManualCareWorkspace
            mode={
                careMode === "SELF"
                    ? "self"
                    : "family"
            }
            context="DOCTOR_NOTES"
            patientId={
                careMode === "FAMILY"
                    ? selectedPatient?.id ??
                      undefined
                    : undefined
            }
            patientName={
                careMode === "SELF"
                    ? user.fullName
                    : selectedPatient?.fullName ??
                      ""
            }
            currentUserName={
                user.fullName
            }
        />

    </div>

)}

{medicationDetail ===
    "DOCTOR_NOTES_UPLOAD" && (

    <div className="dashboard-workspace">

        <DoctorNotesUploadWorkspace
            mode={
                careMode === "SELF"
                    ? "self"
                    : "family"
            }
            patientId={
                careMode === "FAMILY"
                    ? selectedPatient?.id ??
                      null
                    : null
            }
            patientName={
                careMode === "SELF"
                    ? user.fullName
                    : selectedPatient?.fullName ??
                      ""
            }
            currentUserName={
                user.fullName
            }
            onCancel={() => {
                setMedicationDetail("");
            }}
        />

    </div>

)}

{medicationDetail !== "" &&
    medicationDetail !== "VIEW_PRESCRIPTIONS" &&
    medicationDetail !== "CONTINUE_VALIDATION" &&
    !hasPendingMedicationValidation && (

    <PrescriptionWorkspace

        method={
            medicationDetail
        }

        userId={
            user.id
        }

        recordContext={
            careMode === "FAMILY"
                ? "FAMILY"
                : "SELF"
        }

        patientId={
            careMode === "FAMILY"
                ? selectedPatient?.id ??
                  null
                : null
        }

        patientName={
            careMode === "SELF"
                ? user.fullName
                : selectedPatient?.fullName ??
                  ""
        }

        familyId={
            null
        }

        onCancelReview={() => {

            setMedicationDetail("");

        }}

onSaveComplete={async () => {

    await checkPendingMedicationValidation();

    setMedicationDetail("");

}}
    />

)}

        {medicationDetail ===
            "CONTINUE_VALIDATION" && (

            <PendingMedicationValidation

                userId={
                    user.id
                }

                patientId={
                    careMode === "FAMILY"
                        ? selectedPatient?.id ??
                          null
                        : null
                }

                familyId={
                    null
                }

                recordContext={
                    careMode === "FAMILY"
                        ? "FAMILY"
                        : "SELF"
                }

                onSaveComplete={
                    async () => {

                        await checkPendingMedicationValidation();

                    }
                }

                onClose={() => {

                    setMedicationDetail(
                        ""
                    );

                }}

            />

        )}

        {medicationDetail ===
            "VIEW_PRESCRIPTIONS" && (

            <div className="dashboard-workspace">

                <PrescriptionHistoryWorkspace

                    userId={
                        user.id
                    }

                    recordContext={
                        careMode === "FAMILY"
                            ? "FAMILY"
                            : "SELF"
                    }

                    patientId={
                        careMode === "FAMILY"
                            ? selectedPatient?.id ??
                              null
                            : null
                    }

                    patientName={
                        careMode === "SELF"
                            ? user.fullName
                            : selectedPatient?.fullName ??
                              ""
                    }

                />

            </div>

        )}

        {(
            medicationDetail === "IN_PERSON" ||
            medicationDetail === "VIDEO" ||
            medicationDetail === "PHONE" ||
            medicationDetail === "HOME_VISIT" ||
            medicationDetail === "OTHER"
        ) && (

            <ConsultationWorkspace

                mode={
                    medicationDetail
                }

            />

        )}

    </>

) : searchParams.get("view") === "timeline" ? (

    <>
        {careMode === "FAMILY" &&
        selectedPatient?.fullName === "K V Premnath" ? (
            <div className="timeline-report-grid">

                <button
                    type="button"
                    className={
                        selectedOption === "EXECUTIVE_SUMMARY"
                            ? "timeline-report-option timeline-report-option-selected"
                            : "timeline-report-option"
                    }
                    onClick={() =>
                        setSelectedOption(
                            "EXECUTIVE_SUMMARY"
                        )
                    }
                >

                    <span className="timeline-report-icon">
                        📋
                    </span>

                    <strong>
                        Executive Summary
                    </strong>

                </button>


                <button
                    type="button"
                    className={
                        selectedOption === "CLINICAL_TRENDS"
                            ? "timeline-report-option timeline-report-option-selected"
                            : "timeline-report-option"
                    }
                    onClick={() =>
                        setSelectedOption(
                            "CLINICAL_TRENDS"
                        )
                    }
                >

                    <span className="timeline-report-icon">
                        📈
                    </span>

                    <strong>
                        Clinical Trends
                    </strong>

                </button>

            </div>

        ) : (

            <div className="timeline-unavailable">
                <div className="timeline-unavailable-icon">
                    💙
                </div>

                <strong>
                    Health Timeline is currently available for K V Premnath.
                </strong>

                <p>
                    We are working to make this available for other family
                    members too.
                </p>
            </div>

        )}


        {careMode === "FAMILY" &&
        selectedPatient?.fullName === "K V Premnath" &&
        selectedOption === "EXECUTIVE_SUMMARY" && (

            <section className="workspace-section">

<ExecutiveSummaryPdfGenerator
    patientId={selectedPatient.id}
    patientName={selectedPatient.fullName}
    onComplete={() => {
        setSelectedOption("");
    }}
/>

            </section>

        )}


        {careMode === "FAMILY" &&
        selectedPatient?.fullName === "K V Premnath" &&
        selectedOption === "CLINICAL_TRENDS" && (

            <section className="workspace-section">

                <ClinicalTrendPdfGenerator
                    patientId={
                        selectedPatient.id
                    }
                    patientName={
                        selectedPatient.fullName
                    }
                    onComplete={() => {
                        setSelectedOption("");
                    }}
                />

            </section>

        )}

    </>

) : searchParams.get("view") === "assessment" ? (

    <div className="assessment-mobile-panel">

        <button
            type="button"
            className="assessment-start-option"
            onClick={() => {

                if (
                    careMode === "SELF"
                ) {

                    router.push(
                        "/self/page2"
                    );

                    return;
                }

                if (
                    careMode === "FAMILY" &&
                    selectedPatient
                ) {

                    router.push(
                        "/family/page2"
                    );

                }

            }}
        >

            <span className="assessment-start-icon">
                🩺
            </span>

            <strong>
                Start Assessment
            </strong>

            <span>
                Answer a few questions about your current health
            </span>

        </button>

    </div>

) : (

    <div className="record-method-grid">

        <button
            type="button"
            className={
                selectedOption === "VOICE"
                    ? "record-method record-method-selected"
                    : "record-method"
            }
            onClick={() =>
                setSelectedOption(
                    "VOICE"
                )
            }
        >

            <span className="record-method-icon voice-icon">
                🎙
            </span>

            <strong>
                Record with
                <br />
                Voice
            </strong>

        </button>


        <button
            type="button"
            className={
                selectedOption === "UPLOAD"
                    ? "record-method record-method-selected"
                    : "record-method"
            }
            onClick={() =>
                setSelectedOption(
                    "UPLOAD"
                )
            }
        >

            <span className="record-method-icon upload-icon">
                📷
            </span>

            <strong>
                Upload
                <br />
                Reading
            </strong>

        </button>


        <button
            type="button"
            className={
                selectedOption === "MANUAL"
                    ? "record-method record-method-selected"
                    : "record-method"
            }
            onClick={() =>
                setSelectedOption(
                    "MANUAL"
                )
            }
        >

            <span className="record-method-icon manual-icon">
                ✎
            </span>

            <strong>
                Enter
                <br />
                Manually
            </strong>

        </button>

    </div>

)}

                        </section>

                    )}


                    {careMode === "SELF" &&
                        selectedOption === "VOICE" && (

                        <section className="workspace-section">

                            <VoiceCareWorkspace
                                mode="self"
                                patientId={
                                    undefined
                                }
                                currentUserName={
                                    user.fullName
                                }
                            />

                        </section>

                    )}


                    {careMode === "SELF" &&
                        selectedOption === "UPLOAD" && (

                        <section className="workspace-section">

                            <UploadCareWorkspace
                                mode="self"
                                patientId={
                                    undefined
                                }
                                currentUserName={
                                    user.fullName
                                }
                            />

                        </section>

                    )}


                    {careMode === "SELF" &&
                        selectedOption === "MANUAL" && (

                        <section className="workspace-section">

                            <ManualCareWorkspace
                                mode="self"
                                context="DAILY_CARE"
                                patientId={
                                    undefined
                                }
                                currentUserName={
                                    user.fullName
                                }
                            />

                        </section>

                    )}


                    {careMode === "FAMILY" &&
                        selectedPatient &&
                        selectedOption === "VOICE" && (

                        <section className="workspace-section">

                            <VoiceCareWorkspace
                                mode="family"
                                patientId={
                                    selectedPatient.id
                                }
                                currentUserName={
                                    user.fullName
                                }
                            />

                        </section>

                    )}


                    {careMode === "FAMILY" &&
                        selectedPatient &&
                        selectedOption === "UPLOAD" && (

                        <section className="workspace-section">

                            <UploadCareWorkspace
                                mode="family"
                                patientId={
                                    selectedPatient.id
                                }
                                currentUserName={
                                    user.fullName
                                }
                            />

                        </section>

                    )}


                    {careMode === "FAMILY" &&
                        selectedPatient &&
                        selectedOption === "MANUAL" && (

                        <section className="workspace-section">

                            <ManualCareWorkspace
                                mode="family"
                                context="DAILY_CARE"
                                patientId={
                                    selectedPatient.id
                                }
                                currentUserName={
                                    user.fullName
                                }
                            />

                        </section>

                    )}


                    {error && (

                        <div
                            className="record-health-error"
                            role="alert"
                        >
                            {error}
                        </div>

                    )}

                </section>


                <CareVRFooter />

            </div>


            <style jsx>{`

.assessment-mobile-panel {
    width: 100%;
    margin-top: 4px;
}

.assessment-start-option {
    width: 100%;
    min-height: 150px;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid #dbe7f7;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.95);
    color: #101d45;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
}

.assessment-start-option:active {
    transform: scale(0.99);
}

.assessment-start-icon {
    width: 54px;
    height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #e8f3ff;
    font-size: 28px;
}

.assessment-start-option strong {
    font-size: 16px;
    line-height: 1.25;
    font-weight: 800;
}

.assessment-start-option > span:last-child {
    max-width: 280px;
    color: #59657f;
    font-size: 12px;
    line-height: 1.45;
}

                .record-health-page {
                    min-height: 100vh;
                    width: 100%;
                    box-sizing: border-box;
                    background: #f8f6ff;
                    color: #101d45;
                }

.record-health-shell {
    width: 100%;
    max-width: 767px;
    min-height: 100dvh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.record-health-content {
    flex: 1 1 auto;
    width: 100%;
    padding: 6px 16px 8px;
    box-sizing: border-box;
}



                .self-mode-card {
                    position: relative;
                    width: 100%;
                    min-height: 82px;
                    margin-bottom: 28px;
                    padding: 12px 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-sizing: border-box;
                    border: 2px solid #5630e8;
                    border-radius: 18px;
                    background: #faf8ff;
                    box-shadow:
                        0 3px 12px rgba(79, 32, 216, 0.08);
                }

                .self-mode-avatar {
                    width: 52px;
                    height: 52px;
                    flex: 0 0 auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #f0eaff;
                    color: #4f20d8;
                    font-size: 18px;
                    font-weight: 800;
                }

                .self-mode-content {
                    min-width: 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .self-mode-label {
                    color: #59657f;
                    font-size: 12px;
                    line-height: 1.25;
                }

                .self-mode-content strong {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #101d45;
                    font-size: 15px;
                    line-height: 1.3;
                }

                .self-mode-check {
                    width: 30px;
                    height: 30px;
                    flex: 0 0 auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #4f20d8;
                    color: #ffffff;
                    font-size: 17px;
                    font-weight: 800;
                }

                .record-health-section {
                    width: 100%;
                }

.record-health-heading {
    margin-bottom: 11px;
}

.record-health-heading h1 {
    margin: 5;
    color: #101d45;
    font-size: 15px;
    line-height: 1.2;
    font-weight: 800;
}

.record-health-heading p {
    margin: 5px 5 0;
    color: #59657f;
    font-size: 12px;
    line-height: 1.35;
}

.record-method-grid {
    display: grid;
    grid-template-columns:
        repeat(3, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
}

.record-method {
    min-width: 0;
    height: 85px;
    padding: 8px 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 1px solid #e3e0eb;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.92);
    color: #101d45;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        background 0.15s ease;
}

.record-method-selected {
    border: 2px solid #5630e8;
    background: #faf8ff;
    box-shadow:
        0 2px 8px rgba(79, 32, 216, 0.07);
}

.timeline-report-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
}

.timeline-report-option {
    min-width: 0;
    min-height: 130px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid #e3e0eb;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.92);
    color: #101d45;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        background 0.15s ease;
}

.timeline-report-option-selected {
    border: 2px solid #5630e8;
    background: #faf8ff;
    box-shadow:
        0 3px 10px rgba(79, 32, 216, 0.08);
}

.timeline-report-icon {
    width: 52px;
    height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #eef4ff;
    font-size: 27px;
    line-height: 1;
}

.timeline-report-option strong {
    color: #101d45;
    font-size: 14px;
    line-height: 1.25;
    font-weight: 800;
}

.record-method-icon {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 21px;
    line-height: 1;
}

                .voice-icon {
                    background: #eef4ff;
                }

                .upload-icon {
                    background: #eefbf4;
                }

                .manual-icon {
                    background: #fff3e8;
                }

.record-method strong {
    color: #101d45;
    font-size: 11px;
    line-height: 1.2;
    font-weight: 800;
}


                .workspace-section {
                    width: 100%;
                    margin-top: 18px;
                }

                .record-health-error {
                    margin-top: 18px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    background: #fef2f2;
                    color: #b91c1c;
                    font-size: 14px;
                }

.timeline-unavailable {
    width: 100%;
    box-sizing: border-box;
    margin-top: 4px;
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #dbe7f7;
    border-radius: 18px;
    background: #f7fbff;
    text-align: center;
}

.timeline-unavailable-icon {
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #e8f3ff;
    font-size: 24px;
}

.timeline-unavailable strong {
    color: #101d45;
    font-size: 14px;
    line-height: 1.4;
}

.timeline-unavailable p {
    margin: 0;
    max-width: 300px;
    color: #59657f;
    font-size: 12px;
    line-height: 1.45;
}



                @media (max-width: 420px) {

.timeline-report-grid {
    gap: 8px;
}

.timeline-report-option {
    min-height: 120px;
    padding: 12px 8px;
}

.timeline-report-icon {
    width: 46px;
    height: 46px;
    font-size: 24px;
}

.timeline-report-option strong {
    font-size: 13px;
}


                    .record-health-content {
                        padding-left: 12px;
                        padding-right: 12px;
                    }

.record-health-greeting {
    margin: 4px 0 16px;
    color: #101d45;
    font-size: 21px;
    line-height: 1.25;
    font-weight: 700;
}

.record-method-grid {
    gap: 6px;
}

.record-method {
    height: 68px;
    min-height: 68px;
    padding: 5px 4px;
    gap: 3px;
}

.record-method-icon {
    width: 30px;
    height: 30px;
    font-size: 16px;
}

.record-method strong {
    font-size: 10.5px;
    line-height: 1.15;
}

.record-method-description {
    font-size: 9px;
}

                }

            `}</style>

        </main>
    );
}

export default function RecordHealthPage() {
    return (
        <Suspense fallback={null}>
            <RecordHealthPageContent />
        </Suspense>
    );
}
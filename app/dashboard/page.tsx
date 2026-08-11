"use client";

import {
    useEffect,
    useRef,
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
    patientStorage,
} from "@/lib/storage/patientStorage";

import type {
    Patient,
} from "@/lib/types/patient";

import {
    dailyCareRepository
} from "@/lib/repositories/DailyCareRepository";

import {
    selfDailyCareStorage
} from "@/lib/storage/SelfDailyCareStorage";

import type {
    DailyCare
} from "@/lib/types/dailyCare";

import type {
    SelfDailyCare
} from "@/lib/types/selfDailyCare";

import AppHeader from "@/app/components/AppHeader";

import MobileHeader from "@/Components/common/MobileHeader";

import PatientPanel
    from "@/Components/common/PatientPanel";

import CareVRFooter from "@/Components/common/CareVRFooter";

import LanguageSelector from "@/Components/language/LanguageSelector";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

import {
    analyticsService,
} from "@/lib/analytics/analyticsService";

import {
    ANALYTICS_MODULES,
    ANALYTICS_EVENTS,
} from "@/lib/analytics/analyticsEvents";

import {
    authSessionService,
} from "@/lib/analytics/authSessionService";

import {
    performanceTracker,
} from "@/lib/performance/performanceTracker";


import HelpWorkspace from "@/app/components/dashboard/HelpWorkspace";

import ManualCareWorkspace
    from "@/Components/dashboard/ManualCareWorkspace";

import PersonSelector, {
    type PersonSelection,
} from "@/Components/patient/PersonSelector";

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
    consentStorage,
} from "@/lib/consent/storage/consentStorage";

import {
    prescriptionStorage,
} from "@/lib/prescription/prescriptionStorage";

type DashboardUser = {

    id: string;

    fullName: string;

    email: string;

    role: string;

};


type HomeFeature =
    | "RECORD_HEALTH"
    | "MEDICATION_MANAGEMENT"
    | "ASSESSMENT"
    | "VIEW_HEALTH"
    | "HELP";


type MobileSnapshot = {
    dailyCare:
        | DailyCare
        | SelfDailyCare
        | null;

    needsAttention:
        boolean;

    monitoringItems?:
        string[];
};



function CareJourneyIcon() {
    return (
        <svg
            width="42"
            height="42"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="careJourneyHeart"
                    x1="28"
                    y1="18"
                    x2="72"
                    y2="78"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#FF5A67" />
                    <stop offset="0.55" stopColor="#F21F45" />
                    <stop offset="1" stopColor="#C9163C" />
                </linearGradient>

                <linearGradient
                    id="careJourneyOrbit"
                    x1="22"
                    y1="72"
                    x2="82"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#1479E8" />
                    <stop offset="0.55" stopColor="#18C7B5" />
                    <stop offset="1" stopColor="#16B8D4" />
                </linearGradient>

                <linearGradient
                    id="careJourneyPlus"
                    x1="70"
                    y1="66"
                    x2="87"
                    y2="88"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#29D6D2" />
                    <stop offset="1" stopColor="#087BE8" />
                </linearGradient>

                <filter
                    id="careJourneyShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="160%"
                >
                    <feDropShadow
                        dx="0"
                        dy="3"
                        stdDeviation="2.5"
                        floodOpacity="0.18"
                    />
                </filter>
            </defs>

            {/* Orbit / care swoosh */}
            <path
                d="M18 68C28 82 49 88 68 80C81 75 88 65 90 54"
                stroke="url(#careJourneyOrbit)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
            />

            <path
                d="M72 18C83 23 89 31 91 40"
                stroke="url(#careJourneyOrbit)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
            />

            {/* Heart */}
            <path
                d="
                    M50 75
                    C45 70 22 55 22 36
                    C22 24 31 17 41 18
                    C46 18 50 21 54 26
                    C58 21 62 18 68 18
                    C79 18 86 27 84 38
                    C82 54 63 67 50 75Z
                "
                fill="url(#careJourneyHeart)"
                filter="url(#careJourneyShadow)"
            />

            {/* Heart highlight */}
            <path
                d="M31 28C35 23 41 22 45 25"
                stroke="#FFB7BE"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.75"
            />

            {/* ECG */}
            <path
                d="
                    M27 45
                    H38
                    L43 45
                    L47 38
                    L52 55
                    L57 34
                    L62 45
                    H76
                "
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Medical plus white border */}
            <rect
                x="66"
                y="63"
                width="25"
                height="25"
                rx="7"
                fill="white"
            />

            {/* Medical plus */}
            <path
                d="
                    M75 67
                    H82
                    V75
                    H89
                    V82
                    H82
                    V89
                    H75
                    V82
                    H68
                    V75
                    H75
                    Z
                "
                fill="url(#careJourneyPlus)"
            />
        </svg>
    );
}

export default function DashboardPage() {

    const router =
        useRouter();

const SHOW_PERFORMANCE_DIAGNOSTICS =
    false;

    const dashboardLoadStartedRef =
        useRef(false);

    const {
        t,
    } = useLanguage();


    const [
        user,
        setUser,
    ] =
        useState<DashboardUser | null>(
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
    selectedAction,
    setSelectedAction,
] =
    useState<HomeFeature | "">(
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
] = useState(false);

const [
    checkingPendingMedicationValidation,
    setCheckingPendingMedicationValidation,
] = useState(false);


const [
    doctorNotesOption,
    setDoctorNotesOption,
] =
    useState<ActionOption>(
        ""
    );

const [
    medicationOption,
    setMedicationOption,
] =
    useState<ActionOption>(
        ""
    );

const [
    personSelection,
    setPersonSelection,
] =
    useState<PersonSelection>({

        mode: "",

        patientId: null,

        patientName: null,

    });

const [
    mobileCareMode,
    setMobileCareMode,
] = useState<"FAMILY" | "SELF">(
    "FAMILY"
);

    //------------------------------------------------------------
    // Reset Care Journey child state whenever the primary action changes
    //------------------------------------------------------------

    useEffect(() => {

        setMedicationDetail("");

        setDoctorNotesOption("");

        setMedicationOption("");

    }, [selectedAction]);


    //------------------------------------------------------------
    // Mobile Caretaker Dashboard State
    //------------------------------------------------------------

const [
    mobilePatients,
    setMobilePatients,
] = useState<Patient[]>([]);

const [
    mobileSnapshots,
    setMobileSnapshots,
] = useState<Record<string, MobileSnapshot>>({});

const [
    mobileSelectedPatientId,
    setMobileSelectedPatientId,
] = useState<string>("");

const [
        mobilePeopleLoading,
        setMobilePeopleLoading,
    ] = useState(false);

const [
    mobileAccountMenuOpen,
    setMobileAccountMenuOpen,
] = useState(false);

    //------------------------------------------------------------
    // Load User
    //------------------------------------------------------------

    useEffect(() => {

        if (
            dashboardLoadStartedRef.current
        ) {

            return;

        }

        dashboardLoadStartedRef.current =
            true;


        async function loadDashboard() {

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


const consentGranted =
    await consentStorage
        .hasAcceptedCurrentConsent();

setConsentGranted(
    consentGranted
);

                if (!profile) {

                    await authService.logout();

                    router.replace(
                        "/login"
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


                void analyticsService
                    .track({

                        module:
                            ANALYTICS_MODULES
                                .DASHBOARD,

                        eventName:
                            ANALYTICS_EVENTS
                                .PAGE_VIEWED,

                        pagePath:
                            "/dashboard",

                    })
                    .catch(() => {

                        // Analytics must not block rendering

                    });

            }
            catch (error) {

                console.error(
                    "Unable to load home page.",
                    error
                );


                try {

                    await authService.logout();

                }
                catch {

                    // Ignore logout failure

                }


                router.replace(
                    "/login"
                );

            }
            finally {

                setLoading(false);

            }

        }


        void loadDashboard();

    }, [router]);


    //------------------------------------------------------------
    // Load Mobile Caretaker Data
    //------------------------------------------------------------

useEffect(() => {

    if (
        !user ||
        !consentGranted
    ) {
        return;
    }

const currentUserId = user.id;

    let cancelled = false;

    async function loadMobileCareData() {

        setMobilePeopleLoading(true);

        try {

            //--------------------------------------------------------
            // SELF MODE
            //--------------------------------------------------------

            if (
                mobileCareMode === "SELF"
            ) {

                const result =
                    await selfDailyCareStorage
                        .getUserHistory();

                if (cancelled) {
                    return;
                }

                const history =
                    result.success
                        ? result.data ?? []
                        : [];

                const sortedRecords = [
                    ...history,
                ].sort(
                    (a, b) =>
                        new Date(
                            b.recordedAt
                        ).getTime() -
                        new Date(
                            a.recordedAt
                        ).getTime()
                );

                const latest =
                    sortedRecords[0] ??
                    null;

                const latestBloodPressureRecord =
                    sortedRecords.find(
                        record =>
                            record.systolic != null &&
                            record.diastolic != null
                    ) ?? null;

                const latestSpo2Record =
                    sortedRecords.find(
                        record =>
                            record.spo2 != null
                    ) ?? null;

                const latestPulseRecord =
                    sortedRecords.find(
                        record =>
                            record.pulse != null
                    ) ?? null;

                const latestTemperatureRecord =
                    sortedRecords.find(
                        record =>
                            record.temperature != null
                    ) ?? null;

                const selfDailyCare =
                    latest
                        ? {
                            ...latest,

                            systolic:
                                latestBloodPressureRecord
                                    ?.systolic ??
                                null,

                            diastolic:
                                latestBloodPressureRecord
                                    ?.diastolic ??
                                null,

                            spo2:
                                latestSpo2Record
                                    ?.spo2 ??
                                null,

                            pulse:
                                latestPulseRecord
                                    ?.pulse ??
                                null,

                            temperature:
                                latestTemperatureRecord
                                    ?.temperature ??
                                null,

                            temperatureUnit:
                                latestTemperatureRecord
                                    ?.temperatureUnit ??
                                latest.temperatureUnit ??
                                "F",
                        }
                        : null;

const monitoringItems: string[] = [];

if (selfDailyCare) {

    if (
        selfDailyCare.spo2 != null &&
        selfDailyCare.spo2 < 94
    ) {
        monitoringItems.push(
            `SpO₂ ${selfDailyCare.spo2}%`
        );
    }

    if (
        selfDailyCare.pulse != null &&
        (
            selfDailyCare.pulse < 60 ||
            selfDailyCare.pulse > 100
        )
    ) {
        monitoringItems.push(
            `Pulse ${selfDailyCare.pulse}`
        );
    }

    if (
        selfDailyCare.systolic != null &&
        selfDailyCare.diastolic != null &&
        (
            selfDailyCare.systolic >= 140 ||
            selfDailyCare.diastolic >= 90 ||
            selfDailyCare.systolic < 90 ||
            selfDailyCare.diastolic < 60
        )
    ) {
        monitoringItems.push(
            `BP ${selfDailyCare.systolic}/${selfDailyCare.diastolic}`
        );
    }

    if (
        selfDailyCare.temperature != null
    ) {

        const temperatureF =
            selfDailyCare.temperatureUnit === "C"
                ? (
                    selfDailyCare.temperature * 9 / 5
                ) + 32
                : selfDailyCare.temperature;

        if (
            temperatureF >= 100.4
        ) {
            monitoringItems.push(
                `Temperature ${selfDailyCare.temperature}°${selfDailyCare.temperatureUnit}`
            );
        }
    }

    if (
        selfDailyCare.symptoms?.length > 0
    ) {
        monitoringItems.push(
            "Symptoms reported"
        );
    }

    if (
        selfDailyCare.painLocations?.length > 0
    ) {
        monitoringItems.push(
            "Pain reported"
        );
    }

    if (
        selfDailyCare.otherSymptom?.trim()
    ) {
        monitoringItems.push(
            "Other symptom reported"
        );
    }

    if (
        selfDailyCare.otherPainLocation?.trim()
    ) {
        monitoringItems.push(
            "Other pain reported"
        );
    }
}

const needsAttention =
    selfDailyCare?.overallStatus ===
        "CONCERNS_REPORTED" ||
    monitoringItems.length > 0;

setMobilePatients([]);

setMobileSelectedPatientId("");

setMobileSnapshots(
    selfDailyCare
        ? {
            SELF: {
                dailyCare:
                    selfDailyCare,
                needsAttention,
                monitoringItems,
            },
        }
        : {}
);

                setMobilePeopleLoading(
                    false
                );

                return;
            }


            //--------------------------------------------------------
            // FAMILY MODE
            //--------------------------------------------------------

            const result =
                await patientStorage
                    .getPatients();

            if (cancelled) {
                return;
            }

            const patients =
                result.success
                    ? result.data ?? []
                    : [];

            setMobilePatients(
                patients
            );

            const defaultPatient =
                patients[0] ??
                null;

            if (
                !mobileSelectedPatientId &&
                defaultPatient
            ) {
                setMobileSelectedPatientId(
                    defaultPatient.id
                );
            }

            const snapshotEntries =
                await Promise.all(
                    patients.map(
                        async (
                            patient
                        ): Promise<
                            [
                                string,
                                MobileSnapshot
                            ]
                        > => {

                            try {

                                let records:
                                    DailyCare[] = [];

                                if (patient.id) {

                                    records =
                                        await dailyCareRepository
                                            .getByPatientId(
                                                patient.id
                                            );

                                } else {

records =
    await dailyCareRepository
        .getByUserId(
            currentUserId
        );

                                    records =
                                        records.filter(
                                            record =>
                                                record.patientId ===
                                                null
                                        );
                                }

                                const snapshot =
                                    await dailyCareRepository
                                        .getLatestSnapshotByPatientId(
                                            patient.id
                                        );

                                const sortedRecords = [
                                    ...records,
                                ].sort(
                                    (a, b) =>
                                        new Date(
                                            b.recordedAt
                                        ).getTime() -
                                        new Date(
                                            a.recordedAt
                                        ).getTime()
                                );

                                const latestDailyCare =
                                    snapshot?.latest?.id
                                        ? {
                                            ...snapshot.latest,

                                            id:
                                                snapshot.latest.id,

                                            systolic:
                                                snapshot.bloodPressure
                                                    ?.systolic ??
                                                null,

                                            diastolic:
                                                snapshot.bloodPressure
                                                    ?.diastolic ??
                                                null,

                                            spo2:
                                                snapshot.spo2
                                                    ?.spo2 ??
                                                null,

                                            pulse:
                                                snapshot.pulse
                                                    ?.pulse ??
                                                null,

                                            temperature:
                                                snapshot.temperature
                                                    ?.temperature ??
                                                null,

                                            temperatureUnit:
                                                snapshot.temperature
                                                    ?.temperatureUnit ??
                                                "F",
                                        }
                                        : null;

                                const needsAttention =
                                    snapshot?.latest?.overallStatus ===
                                        "CONCERNS_REPORTED" ||
                                    snapshot?.bloodPressure
                                        ?.overallStatus ===
                                        "CONCERNS_REPORTED" ||
                                    snapshot?.spo2
                                        ?.overallStatus ===
                                        "CONCERNS_REPORTED" ||
                                    snapshot?.pulse
                                        ?.overallStatus ===
                                        "CONCERNS_REPORTED" ||
                                    snapshot?.temperature
                                        ?.overallStatus ===
                                        "CONCERNS_REPORTED";

                                return [
                                    patient.id,
                                    {
                                        dailyCare:
                                            latestDailyCare,
                                        needsAttention,
                                    },
                                ];

                            }
                            catch (
                                snapshotError
                            ) {

                                console.error(
                                    "Unable to load mobile Daily Care snapshot.",
                                    snapshotError
                                );

                                return [
                                    patient.id,
                                    {
                                        dailyCare:
                                            null,
                                        needsAttention:
                                            false,
                                    },
                                ];
                            }
                        }
                    )
                );

            if (cancelled) {
                return;
            }

            setMobileSnapshots(
                Object.fromEntries(
                    snapshotEntries
                )
            );

        }
        catch (error) {

            console.error(
                "Unable to load mobile care dashboard.",
                error
            );

            if (!cancelled) {

                setMobilePatients([]);

                setMobileSnapshots({});
            }

        }
        finally {

            if (!cancelled) {

                setMobilePeopleLoading(
                    false
                );
            }
        }
    }

    void loadMobileCareData();

    return () => {
        cancelled = true;
    };

}, [
    user,
    consentGranted,
    mobileCareMode,
]);


    //------------------------------------------------------------
    // Mobile Dashboard Actions
    //------------------------------------------------------------

const selectedMobilePatient =
    mobileCareMode === "FAMILY"
        ? (
            mobilePatients.find(
                patient =>
                    patient.id ===
                    mobileSelectedPatientId
            ) ??
            mobilePatients[0] ??
            null
        )
        : null;

const selectMobilePatient = (
    patient: Patient
) => {

    if (!consentGranted) {
        return;
    }

    setMobileSelectedPatientId(
        patient.id
    );

    setPersonSelection({
        mode: "FAMILY",
        patientId:
            patient.id,
        patientName:
            patient.fullName,
    });

    setSelectedAction("");
    setMedicationDetail("");
};


const selectMobileSelf = () => {

    if (!consentGranted || !user) {
        return;
    }

    setMobileSelectedPatientId("");

    setMobileCareMode("SELF");

    setPersonSelection({
        mode: "SELF",
        patientId: null,
        patientName:
            user.fullName,
    });

    setSelectedAction("");
    setMedicationDetail("");
};

const openMobileFeature = (
    feature: HomeFeature
) => {

    if (
        !consentGranted ||
        !user
    ) {
        return;
    }

    if (
        mobileCareMode === "FAMILY" &&
        !selectedMobilePatient
    ) {
        return;
    }

    if (
        mobileCareMode === "SELF"
    ) {

        setPersonSelection({
            mode: "SELF",
            patientId: null,
            patientName:
                user.fullName,
        });

    } else {

        setPersonSelection({
            mode: "FAMILY",
            patientId:
                selectedMobilePatient!.id,
            patientName:
                selectedMobilePatient!.fullName,
        });
    }

    trackFeatureClick(
        feature
    );

    if (
        feature === "RECORD_HEALTH"
    ) {
        router.push(
            mobileCareMode === "SELF"
                ? "/record-health?mode=self"
                : "/record-health"
        );

        return;
    }

    setSelectedAction(
        feature
    );

    setMedicationDetail("");
};


    //------------------------------------------------------------
    // Performance Completion
    //------------------------------------------------------------

    useEffect(() => {

        if (
            loading ||
            !user
        ) {

            return;

        }


        void performanceTracker.complete({

            toPath:
                "/dashboard",

        });

    }, [
        loading,
        user,
    ]);


    //------------------------------------------------------------
    // Analytics
    //------------------------------------------------------------

    const trackFeatureClick =
        (
            feature: HomeFeature
        ): void => {

            void analyticsService
                .track({

                    module:
                        ANALYTICS_MODULES
                            .DASHBOARD,

                    eventName:
                        ANALYTICS_EVENTS
                            .FEATURE_CLICKED,

                    pagePath:
                        "/dashboard",

                    metadata: {

                        feature,

                    },

                })
                .catch(() => {

                    // Analytics must not block navigation

                });

        };


    //------------------------------------------------------------
    // Navigation
    //------------------------------------------------------------

    const openRecordHealth = () => {

        trackFeatureClick(
            "RECORD_HEALTH"
        );


        performanceTracker.start({

            fromPath:
                "/dashboard",

            toPath:
                "/care",

            feature:
                "DASHBOARD_TO_CARE",

        });


        router.push(
            "/care"
        );

    };


    const openViewHealth = () => {

        trackFeatureClick(
            "VIEW_HEALTH"
        );


        performanceTracker.start({

            fromPath:
                "/dashboard",

            toPath:
                "/reports",

            feature:
                "DASHBOARD_TO_REPORTS",

        });


        router.push(
            "/reports"
        );

    };


    const openHelp = () => {

        trackFeatureClick(
            "HELP"
        );


        router.push(
            "/help"
        );

    };


const openMedicationManagement = () => {

    trackFeatureClick(
        "MEDICATION_MANAGEMENT"
    );


    performanceTracker.start({

        fromPath:
            "/dashboard",

        toPath:
            "/medications",

        feature:
            "DASHBOARD_TO_MEDICATIONS",

    });


    router.push(
        "/medications"
    );

};

//------------------------------------------------------------
// Start Assessment
//------------------------------------------------------------

const handleStartAssessment = () => {

    if (
        personSelection.mode === "SELF"
    ) {

        router.push(
            "/self/page2"
        );

        return;

    }


    if (
        personSelection.mode === "FAMILY" &&
        personSelection.patientId
    ) {

        router.push(
            "/family/page2"
        );

    }

};


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

    //------------------------------------------------------------
    // Logout
    //------------------------------------------------------------

    const logout = async () => {

        if (loggingOut) {

            return;

        }


        setLoggingOut(true);


        performanceTracker.start({

            fromPath:
                "/dashboard",

            toPath:
                "/login",

            feature:
                "LOGOUT_TO_LOGIN",

        });


try {

    await authSessionService.end();

}
catch (error) {

    console.error(
        "Unable to close analytics auth session.",
        error
    );

}

try {

    await authService.logout();

    router.replace("/login");

}
        catch (error) {

            console.error(
                "Unable to complete logout.",
                error
            );


            performanceTracker.cancel();


            setLoggingOut(false);

        }

    };


//------------------------------------------------------------
// Pending Medication Validation
//------------------------------------------------------------

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

                        userId: user.id,

                        patientId:
                            personSelection.patientId,

                        familyId: null,

                        recordContext:
                            personSelection.mode === "FAMILY"
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


    //------------------------------------------------------------
    // Loading
    //------------------------------------------------------------

    if (loading) {

        return (

            <main style={loadingContainer}>

                {t("dashboard.loading")}

            </main>

        );

    }


    if (!user) {

        return null;

    }

const showPersonSelector =

    selectedAction === "RECORD_HEALTH" ||

    selectedAction === "MEDICATION_MANAGEMENT" ||

    selectedAction === "ASSESSMENT" ||

    selectedAction === "VIEW_HEALTH";


const isPersonSelectionComplete =

    personSelection.mode === "SELF" ||

    (
        personSelection.mode === "FAMILY" &&
        personSelection.patientId !== null
    );


const mobileSnapshotKey =
    mobileCareMode === "SELF"
        ? "SELF"
        : selectedMobilePatient?.id ?? "";

    //------------------------------------------------------------
    // UI
    //------------------------------------------------------------

    return (

        <main style={pageContainer}>

            <div style={pageCard}>

<div className="mobile-dashboard-shell">

<MobileHeader
    careMode={mobileCareMode}
    onCareModeChange={(mode) => {

        setMobileCareMode(mode);

        if (mode === "SELF") {

            setMobileSelectedPatientId("");

            setPersonSelection({
                mode: "SELF",
                patientId: null,
                patientName:
                    user.fullName,
            });

            setSelectedAction("");
            setDoctorNotesOption("");
            setMedicationOption("");
            setMedicationDetail("");

        } else {

            setPersonSelection({
                mode: "FAMILY",
                patientId: null,
                patientName: null,
            });

            setSelectedAction("");
            setDoctorNotesOption("");
            setMedicationOption("");
            setMedicationDetail("");
        }
    }}
    userName={user.fullName}
    showHomeButton={false}
    accountMenuOpen={mobileAccountMenuOpen}
    onAccountMenuToggle={() =>
        setMobileAccountMenuOpen(
            previous => !previous
        )
    }
    consentGranted={consentGranted}
    onAddPatient={() => {
        setMobileAccountMenuOpen(false);
        router.push("/add-patient");
    }}
    onCareVRJourney={() => {
        setMobileAccountMenuOpen(false);
        router.push("/carevr-journey");
    }}
    onHelp={() => {
        setMobileAccountMenuOpen(false);
        openHelp();
    }}
    languageSelector={<LanguageSelector />}
    onLogout={() => {
        setMobileAccountMenuOpen(false);
        void logout();
    }}
    loggingOut={loggingOut}
/>


    {!consentGranted && (

        <div className="mobile-consent-card">

            <strong>
                Consent required
            </strong>

            <span>
                Review and accept CareVR consent to unlock health features.
            </span>

            <button
                type="button"
                onClick={() =>
                    router.push("/consent")
                }
            >
                Review & Accept
            </button>

        </div>

    )}


<PatientPanel
    userName={user.fullName}
    patients={mobilePatients}
    selectedPatientId={mobileSelectedPatientId}
    onPatientSelect={selectMobilePatient}
    careMode={mobileCareMode}
/>

{(
    mobileCareMode === "SELF" ||
    selectedMobilePatient
) && (
    <section className="mobile-health-card">

            <div className="mobile-health-card-heading">

                <h2>
                    Latest Health Snapshot
                </h2>


            </div>

<div className="mobile-vitals-grid">
<div className="mobile-vital">
    <div className="mobile-vital-icon mobile-vital-heart">
        ♡
    </div>

    <strong>
        {mobileSnapshots[
            mobileSnapshotKey
        ]?.dailyCare?.systolic != null &&
        mobileSnapshots[
            mobileSnapshotKey
        ]?.dailyCare?.diastolic != null
            ? `${mobileSnapshots[
                mobileSnapshotKey
            ].dailyCare!.systolic}/${mobileSnapshots[
                mobileSnapshotKey
            ].dailyCare!.diastolic}`
            : "—"}
    </strong>

    <label>
        Blood Pressure
    </label>
</div>


                <div className="mobile-vital">
                    <div className="mobile-vital-icon mobile-vital-spo2">
                        ◇
                    </div>
                    <strong>
                        {mobileSnapshots[
                            mobileSnapshotKey
                        ]?.dailyCare?.spo2 != null
                            ? `${mobileSnapshots[mobileSnapshotKey].dailyCare!.spo2}%`
                            : "—"}
                    </strong>
                    <label>SpO₂</label>
                </div>


                <div className="mobile-vital">
                    <div className="mobile-vital-icon mobile-vital-pulse">
                        ♥
                    </div>
                    <strong>
                        {mobileSnapshots[
                            mobileSnapshotKey
                        ]?.dailyCare?.pulse ??
                            "—"}
                    </strong>
                    <label>Pulse</label>
                </div>


                <div className="mobile-vital">
                    <div className="mobile-vital-icon mobile-vital-temp">
                        ♨
                    </div>
                    <strong>
                        {mobileSnapshots[
                            mobileSnapshotKey
                        ]?.dailyCare?.temperature != null
                            ? `${mobileSnapshots[mobileSnapshotKey].dailyCare!.temperature}°${mobileSnapshots[mobileSnapshotKey].dailyCare!.temperatureUnit}`
                            : "—"}
                    </strong>
                    <label>Temperature</label>
                </div>

            </div>


{mobileSnapshots[
    mobileSnapshotKey
]?.dailyCare ? (

    mobileSnapshots[
        mobileSnapshotKey
    ]?.needsAttention ? (

        <div className="mobile-health-message mobile-health-message-attention">
            <span>!</span>
            <span>
                Some readings need monitoring.
            </span>
        </div>

    ) : (

        (() => {
            const dailyCare =
                mobileSnapshots[
                    mobileSnapshotKey
                ]?.dailyCare;

            const hasBloodPressure =
                dailyCare?.systolic != null &&
                dailyCare?.diastolic != null;

            const hasSpo2 =
                dailyCare?.spo2 != null;

            const hasPulse =
                dailyCare?.pulse != null;

            const allVitalsAvailable =
                hasBloodPressure &&
                hasSpo2 &&
                hasPulse;

            if (allVitalsAvailable) {
                return (
                    <div className="mobile-health-message">
                        <span>✓</span>
                        <span>
                            {mobileCareMode === "SELF"
    ? `${user.fullName} is doing well.`
    : `${selectedMobilePatient?.fullName ?? "The patient"} is doing well.`
}
                        </span>
                    </div>
                );
            }

            return (
                <div className="mobile-health-message mobile-health-message-empty">
                    <span>✦</span>
                    <span>
                        Please record BP, SpO₂ and Pulse to display the latest or last recorded values.
                    </span>
                </div>
            );
        })()

    )

) : (

    <div className="mobile-health-message mobile-health-message-empty">
        <span>✦</span>
        <span>
            Please record BP, SpO₂ and Pulse to display the latest or last recorded values.
        </span>
    </div>

)}

        </section>

    )}


    {mobileSnapshots[
    mobileSnapshotKey
]?.needsAttention && (

        <section className="mobile-attention-section">

            <div className="mobile-section-heading">
                <h2>
                    Needs your attention
                </h2>
            </div>

<button
    type="button"
    className="mobile-attention-card"
    onClick={() =>
        openMobileFeature(
            "RECORD_HEALTH"
        )
    }
>
    <span className="mobile-attention-dot" />

    <div>
        <strong>
            {(
                mobileSnapshots[
                    mobileSnapshotKey
                ]?.monitoringItems ?? []
            ).length > 0
                ? (
                    mobileSnapshots[
                        mobileSnapshotKey
                    ]?.monitoringItems ?? []
                ).join(" • ")
                : "Review latest readings"}
        </strong>
    </div>

</button>

        </section>

    )}


    <section className="mobile-section mobile-quick-actions-section">

        <div className="mobile-section-heading">
            <h2>Quick actions</h2>
        </div>

        <div className="mobile-quick-actions">

            <button
                type="button"
                onClick={() =>
                    openMobileFeature(
                        "RECORD_HEALTH"
                    )
                }
                disabled={!consentGranted}
            >
                <span className="mobile-action-icon mobile-action-heart">
                    ♡
                </span>

                <strong>
                    Record Health
                </strong>

                <span>
                    Vitals, symptoms & more
                </span>
            </button>


            <button
                type="button"
                onClick={() =>
                    openMobileFeature(
                        "MEDICATION_MANAGEMENT"
                    )
                }
                disabled={!consentGranted}
            >
                <span className="mobile-action-icon mobile-action-purple">
                    ♧
                </span>

                <strong>
                    Care Journey
                </strong>

                <span>
                    Prescriptions & doctor’s notes
                </span>
            </button>


            <button
                type="button"
                onClick={() =>
                    openMobileFeature(
                        "ASSESSMENT"
                    )
                }
                disabled={!consentGranted}
            >
                <span className="mobile-action-icon mobile-action-green">
                    ✓
                </span>

                <strong>
                    Assessment
                </strong>

                <span>
                    Health check & assessments
                </span>
            </button>


            <button
                type="button"
                onClick={() =>
                    openMobileFeature(
                        "VIEW_HEALTH"
                    )
                }
                disabled={!consentGranted}
            >
                <span className="mobile-action-icon mobile-action-blue">
                    ▣
                </span>

                <strong>
                    Health Timeline
                </strong>

                <span>
                    View history & past records
                </span>
            </button>

        </div>

    </section>

</div>


<div className="desktop-dashboard-ui">
<AppHeader
    pageTitle={t("dashboard.title")}
    pageIcon="🏠"
    currentUserName={user.fullName}
    compact
    helpLabel={t("dashboard.helpAndFaqs")}
    onHelpClick={openHelp}

    careVRJourneyLabel="CareVR Journey"

headerAccessory={<LanguageSelector />}

    onCareVRJourneyClick={() => {

        performanceTracker.start({

            fromPath: "/dashboard",

            toPath: "/carevr-journey",

            feature: "DASHBOARD_TO_CAREVR_JOURNEY",

        });

        router.push("/carevr-journey");

    }}
/>

{!consentGranted && (

    <div
        style={{

            background: "#fef3c7",

            border: "1px solid #fcd34d",

            borderRadius: "12px",

            padding: "16px",

            marginTop: "16px",

            marginBottom: "16px",

        }}
    >

        <h3
            style={{
                marginTop: 0,
            }}
        >
            ⚠ Consent Required
        </h3>

        <p>

            Before using CareVR, please review and
            accept the Privacy Policy, Terms of Use
            and Medical Disclaimer.

        </p>

        <button
            type="button"
            onClick={() =>
                router.push("/consent")
            }
            style={{

                background: "#2563eb",

                color: "#fff",

                border: "none",

                borderRadius: "8px",

                padding: "10px 18px",

                cursor: "pointer",

            }}
        >

            Review & Accept

        </button>

<p
    style={{
        marginTop: "16px",
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "6px",
    }}
>
    🔒 Health features will be unlocked after you review and accept the CareVR consent.
</p>

    </div>

)}

                {/* Language selector moved to AppHeader */}


<section style={homeSection}>

<div style={personSelectorWrapper}>

    <PersonSelector
        value={personSelection}
        disabled={!consentGranted}
        onChange={(selection) => {
            if (!consentGranted) {
                return;
            }

            setPersonSelection(selection);

            setSelectedAction("");

        }}
        question={t("medication.whoIsThisFor")}
    />

</div>

{isPersonSelectionComplete && (

    <div style={mainActionWrapper}>

    <h2 style={questionTitle}>
        {t("dashboard.whatWouldYouLikeToDo")}
    </h2>

<div
    className="main-action-grid"
    style={mainActionGrid}
>

<button
    type="button"
disabled={!consentGranted}
onClick={() => {

    if (!consentGranted) {
        return;
    }

    trackFeatureClick(
        "RECORD_HEALTH"
    );

    router.push(
        personSelection.mode === "SELF"
            ? "/record-health?mode=self"
            : "/record-health"
    );

}}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

<span
    style={{
        ...mainActionCircle,

        ...(selectedAction ===
        "RECORD_HEALTH"
            ? selectedActionCircle
            : {}),
    }}
>
    ❤️
</span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "RECORD_HEALTH"
            ? selectedActionLabel
            : {}),
    }}
>
    {t("dashboard.recordHealth")}
</span>

    </button>


<button
    type="button"
disabled={!consentGranted}
    onClick={() => {
        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "MEDICATION_MANAGEMENT"
        );

    setMedicationDetail(
        ""
    );

    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

<span
    style={{
        ...mainActionCircle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(selectedAction ===
        "MEDICATION_MANAGEMENT"
            ? selectedActionCircle
            : {}),
    }}
>
    <CareJourneyIcon />
</span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "MEDICATION_MANAGEMENT"
            ? selectedActionLabel
            : {}),
    }}
>
{t("dashboard.medicationManagement")}    
</span>

    </button>


<button
    type="button"
disabled={!consentGranted}
    onClick={() => {
        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "ASSESSMENT"
        );


    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

        <span
            style={{
                ...mainActionCircle,

                ...(selectedAction ===
                "ASSESSMENT"
                    ? selectedActionCircle
                    : {}),
            }}
        >
            🩺
        </span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "ASSESSMENT"
            ? selectedActionLabel
            : {}),
    }}
>
{t("dashboard.healthCheckAssessment")}    
</span>

    </button>


<button
    type="button"
disabled={!consentGranted}
    onClick={() => {
        if (!consentGranted) {

            return;

        }

        setSelectedAction(
            "VIEW_HEALTH"
        );

        
    }}
        style={{

    ...mainActionButton,

    opacity:
        consentGranted
            ? 1
            : 0.45,

    cursor:
        consentGranted
            ? "pointer"
            : "not-allowed",

}}
    >

        <span
            style={{
                ...mainActionCircle,

                ...(selectedAction ===
                "VIEW_HEALTH"
                    ? selectedActionCircle
                    : {}),
            }}
        >
            📊
        </span>

<span
    style={{
        ...mainActionLabel,

        ...(selectedAction ===
        "VIEW_HEALTH"
            ? selectedActionLabel
            : {}),
    }}
>
{t("dashboard.healthHistory")}
</span>

    </button>

</div>

    </div>

)}


</section>

</div>

{isPersonSelectionComplete &&
    selectedAction !== "" &&
    selectedAction !== "HELP" && (

    <div className="dashboard-action-options" style={actionOptionsWrapper}>

<ActionOptions
    selectedAction={
        selectedAction
    }

    personMode={
        personSelection.mode === "SELF"
            ? "SELF"
            : "FAMILY"
    }

    patientId={
        personSelection.patientId
    }

    patientName={
        personSelection.mode === "SELF"
            ? user.fullName
            : personSelection.patientName ?? ""
    }

    hasPendingMedicationValidation={
        hasPendingMedicationValidation
    }

    checkingPendingMedicationValidation={
        checkingPendingMedicationValidation
    }

onStartAssessment={
    handleStartAssessment
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
    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    doctorNotesOption === "MANUAL" && (

    <div className="dashboard-workspace" style={workspaceContainer}>

        <ManualCareWorkspace
            mode={
                personSelection.mode === "SELF"
                    ? "self"
                    : "family"
            }

            context="DOCTOR_NOTES"

            patientId={
                personSelection.patientId ??
                undefined
            }

            patientName={
                personSelection.mode === "SELF"
                    ? user.fullName
                    : personSelection.patientName ??
                      ""
            }

            currentUserName={
                user.fullName
            }
        />

    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    medicationDetail === "DOCTOR_NOTES_UPLOAD" && (
        <div className="dashboard-workspace" style={workspaceContainer}>
            <DoctorNotesUploadWorkspace
                mode={
                    personSelection.mode === "SELF"
                        ? "self"
                        : "family"
                }
                patientId={
                    personSelection.patientId
                }
                patientName={
                    personSelection.mode === "SELF"
                        ? user.fullName
                        : personSelection.patientName ?? ""
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

{selectedAction === "MEDICATION_MANAGEMENT" &&
 !hasPendingMedicationValidation && (

    <PrescriptionWorkspace
    method={
        medicationDetail
    }

    userId={
        user.id
    }

    recordContext={
    personSelection.mode === "FAMILY"
        ? "FAMILY"
        : "SELF"
}

    patientId={
        personSelection.patientId
    }

patientName={
    personSelection.mode === "SELF"
        ? user.fullName
        : personSelection.patientName ?? ""
}


    familyId={
        null
    }

onCancelReview={() => {

    setMedicationDetail(
        ""
    );

}}

/>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    medicationDetail === "CONTINUE_VALIDATION" && (

<PendingMedicationValidation

    userId={user.id}

    patientId={personSelection.patientId}

    familyId={null}

    recordContext={
        personSelection.mode === "FAMILY"
            ? "FAMILY"
            : "SELF"
    }

    onSaveComplete={async () => {

        const pending =
            await prescriptionStorage
                .getPendingMedicationValidation({

                    userId: user.id,

                    patientId: personSelection.patientId,

                    familyId: null,

                    recordContext:
                        personSelection.mode === "FAMILY"
                            ? "FAMILY"
                            : "SELF",

                });

        setHasPendingMedicationValidation(
            pending !== null
        );

    }}

    onClose={() => {

        setMedicationDetail("");

    }}

/>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    medicationDetail === "VIEW_PRESCRIPTIONS" && (

    <div className="dashboard-workspace" style={workspaceContainer}>

        <PrescriptionHistoryWorkspace
            userId={user.id}
            recordContext={
                personSelection.mode === "FAMILY"
                    ? "FAMILY"
                    : "SELF"
            }
            patientId={personSelection.patientId}
            patientName={
                personSelection.mode === "SELF"
                    ? user.fullName
                    : personSelection.patientName ?? ""
            }
        />

    </div>

)}

{selectedAction === "MEDICATION_MANAGEMENT" &&
    (
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

{selectedAction === "HELP" && (

    <div className="dashboard-workspace" style={workspaceContainer}>

        <HelpWorkspace />

    </div>

)}


<CareVRFooter />

                <div className="desktop-dashboard-footer">
                {user.role === "ADMIN" && 
		 SHOW_PERFORMANCE_DIAGNOSTICS && (
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/performance"
                            )
                        }
                        style={adminButton}
                    >
                        📊 Performance Diagnostics
                    </button>

                )}


                <button
                    type="button"
                    onClick={logout}
                    disabled={loggingOut}
                    style={{
                        ...logoutButton,

                        opacity:
                            loggingOut
                                ? 0.7
                                : 1,

                        cursor:
                            loggingOut
                                ? "not-allowed"
                                : "pointer",
                    }}
                >

                    {
                        loggingOut
                            ? "Logging out…"
                            : `🚪 ${t(
                                "dashboard.logout"
                            )}`
                    }

                </button>


                <div style={footerStyle}>

                    {t(
                        "dashboard.createdBy"
                    )}

                </div>

                </div>

            </div>




<style jsx>{`
    .mobile-dashboard-shell {
        display: none;
    }

    @media (max-width: 767px) {

.desktop-dashboard-ui,
.desktop-dashboard-footer,
.mobile-dashboard-footer {
    display: none !important;
}

.mobile-dashboard-footer {
    display: block !important;
}

        :global(main) {
            padding: 12px !important;
            box-sizing: border-box;
        }

:global(main > div) {
    max-width: none !important;
    min-height: calc(100vh - 24px) !important;
    padding: 8px 0 24px !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
}

        :global(body) {
            background: #fbfaff !important;
        }

.mobile-dashboard-shell {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    min-height: 0;
    width: 100%;
    box-sizing: border-box;
    color: #101d45;
}


.mobile-greeting-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 6px;
    margin-bottom: 24px;
}

.mobile-greeting-content {
    width: 100%;
}

        .mobile-greeting-section h1 {
            margin: 0;
            font-size: 18px;
            line-height: 1.4;
            font-weight: 800;
            letter-spacing: -0.2px;
            color: #101d45;
        }

.mobile-greeting-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
}

.mobile-mode-toggle {
    display: inline-flex;
    align-items: center;
    padding: 3px;
    border-radius: 20px;
    background: #f1f3f8;
    border: 1px solid #d9deea;
    box-shadow: 0 2px 7px rgba(31, 42, 78, 0.10);
    flex: 0 0 auto;
}

.mobile-mode-toggle-option {
    min-width: 48px;
    min-height: 30px;
    padding: 0 11px;
    border: 0;
    border-radius: 17px;
    background: transparent;
    color: #68728d;
    font-size: 11px;
    font-weight: 750;
    line-height: 1;
    cursor: pointer;
    transition:
        background 0.15s ease,
        color 0.15s ease,
        box-shadow 0.15s ease;
}

.mobile-mode-toggle-option-active {
    background: #2563eb;
    color: #ffffff;
    box-shadow:
        0 2px 6px rgba(37, 99, 235, 0.25);
}


        .mobile-greeting-section p {
            margin: 7px 0 0;
            color: #647193;
            font-size: 15px;
            line-height: 1.4;
        }

.mobile-add-person-button {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 14px;
    border: 0;
    border-radius: 9px;
    background: #2563eb;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.22);
    cursor: pointer;
    appearance: none;
}

.mobile-add-person-button span {
    font-size: 18px;
    line-height: 1;
    font-weight: 500;
}

        .mobile-add-person-button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        .mobile-consent-card {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 0 0 22px;
            padding: 14px 16px;
            border: 1px solid #f0d38a;
            border-radius: 16px;
            background: #fff9e9;
            color: #6a4a00;
            font-size: 13px;
            line-height: 1.45;
        }

        .mobile-consent-card button {
            align-self: flex-start;
            margin-top: 2px;
            border: 0;
            border-radius: 10px;
            padding: 9px 13px;
            background: #5b2be0;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
        }

.mobile-section {
    margin-bottom: 24px;
}

.mobile-people-section {
    margin-bottom: 10px;
}

.mobile-greeting-people-section {
    width: 100%;
    margin: 0;
}

.mobile-greeting-people-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    margin-bottom: 10px;
}

.mobile-greeting-people-row h1,
.mobile-people-heading h2 {
    margin: 0;
    font-size: 16px;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.1px;
}

.mobile-people-heading {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    flex: 0 0 auto;
}


.mobile-greeting-people-section .mobile-people-row {
    width: 100%;
}

.mobile-quick-actions-section {
    margin-top: -10px;
}

.mobile-section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}

.mobile-section-heading h2 {
    margin: 0;
    color: #101d45;
    font-size: 12px;
    line-height: 1.2;
    font-weight: 700;
}

        .mobile-section-heading button {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 0;
            border: 0;
            background: transparent;
            color: #6030df;
            font-size: 14px;
            font-weight: 750;
            cursor: pointer;
        }

        .mobile-section-heading button span {
            font-size: 22px;
            line-height: 0.8;
        }

.mobile-section-heading .mobile-add-person-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 14px;
    border: 0;
    border-radius: 9px;
    background: #2563eb;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.22);
    cursor: pointer;
}

.mobile-section-heading .mobile-add-person-button span {
    font-size: 18px;
    line-height: 1;
    font-weight: 500;
}


        .mobile-people-row {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding: 2px 2px 8px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
        }

        .mobile-people-row::-webkit-scrollbar {
            display: none;
        }

.mobile-person-card {
    position: relative;
    flex: 0 0 148px;
    min-height: 148px;
    padding: 12px 11px 11px;
    border: 1px solid #eef0f7;
    border-radius: 17px;
    background: rgba(255,255,255,0.94);
    box-shadow: 0 5px 16px rgba(50, 45, 100, 0.055);
    text-align: left;
    color: #101d45;
    cursor: pointer;
}

        .mobile-person-card-selected {
            border: 1.5px solid #7440f3;
            box-shadow: 0 10px 28px rgba(102, 51, 226, 0.12);
        }

.mobile-person-avatar {
    width: 52px;
    height: 52px;
    margin-bottom: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0eef9;
    color: #5c2ce0;
    font-size: 17px;
    font-weight: 800;
}

.mobile-person-name {
    min-height: 40px;
    font-size: 15px;
    line-height: 1.25;
    font-weight: 800;
    color: #101d45;
}

.mobile-person-meta {
    margin-top: 3px;
    color: #687390;
    font-size: 11px;
    line-height: 1.35;
}



        .mobile-person-check {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 27px;
            height: 27px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #6b32e7;
            color: #fff;
            font-size: 14px;
            font-weight: 800;
        }

        .mobile-inline-loading,
        .mobile-empty-people {
            width: 100%;
            padding: 20px 4px;
            color: #69748f;
            font-size: 14px;
        }

        .mobile-health-card {
            margin-bottom: 26px;
            padding: 18px 14px 14px;
            border: 1px solid #eef0f7;
            border-radius: 22px;
            background: rgba(255,255,255,0.96);
            box-shadow: 0 10px 28px rgba(50, 45, 100, 0.08);
        }

        .mobile-health-card-heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 16px;
        }

.mobile-health-card-heading h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #101d45;
}

        .mobile-health-card-heading span {
            color: #65718e;
            font-size: 12px;
            white-space: nowrap;
        }

        .mobile-vitals-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .mobile-vital {
            min-width: 0;
            padding: 0 6px;
            text-align: center;
            border-right: 1px solid #e9ebf2;
        }

        .mobile-vital:last-child {
            border-right: 0;
        }

        .mobile-vital-icon {
            width: 42px;
            height: 42px;
            margin: 0 auto 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 23px;
        }

        .mobile-vital-heart {
            color: #ee3c6b;
            background: #fff0f4;
        }

        .mobile-vital-spo2 {
            color: #1677e8;
            background: #edf6ff;
        }

        .mobile-vital-pulse {
            color: #6632dd;
            background: #f2edff;
        }

        .mobile-vital-temp {
            color: #ef8a20;
            background: #fff4e8;
        }

.mobile-vital strong {
    display: block;
    font-size: 14px;
    line-height: 1.2;
    font-weight: 800;
    color: #101d45;
}

        .mobile-vital > span {
            display: block;
            min-height: 16px;
            margin-top: 3px;
            color: #65718e;
            font-size: 10px;
        }

        .mobile-vital label {
            display: block;
            margin-top: 5px;
            color: #65718e;
            font-size: 9px;
            line-height: 1.2;
        }

        .mobile-health-message {
            display: flex;
            align-items: center;
            gap: 9px;
            margin-top: 15px;
            padding: 12px 13px;
            border-radius: 13px;
            background: #f7f3ff;
            color: #5c6280;
            font-size: 12px;
            line-height: 1.35;
        }

        .mobile-health-message > span:first-child {
            color: #6b32e7;
            font-size: 17px;
            flex: 0 0 auto;
        }

        .mobile-health-message-attention {
            background: #fff3f3;
            color: #8b3942;
        }

        .mobile-health-message-attention > span:first-child {
            color: #e43c62;
            font-weight: 900;
        }

        .mobile-health-message-empty {
            background: #f7f8fb;
        }

        .mobile-attention-section {
            margin-bottom: 24px;
        }

        .mobile-attention-card {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 14px;
            border: 1px solid #f5d9df;
            border-radius: 17px;
            background: #fff7f8;
            color: #101d45;
            text-align: left;
            cursor: default;
        }

        .mobile-attention-dot {
            width: 9px;
            height: 9px;
            flex: 0 0 auto;
            border-radius: 50%;
            background: #f23f6c;
        }

        .mobile-attention-card > div {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .mobile-attention-card strong {
            font-size: 12px;
        }

        .mobile-attention-card span:not(.mobile-attention-dot) {
            color: #737d98;
            font-size: 14px;
        }

.mobile-quick-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}

.mobile-quick-actions button {
    min-height: 100px;
    height: 76px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7px 5px;
    border: 1px solid #eef0f7;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 4px 12px rgba(50, 45, 100, 0.05);
    color: #101d45;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
}

        .mobile-quick-actions button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

.mobile-action-icon {
    width: 34px;
    height: 34px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 18px;
    flex: 0 0 auto;
}

        .mobile-action-heart {
            color: #ec3d68;
            background: #fff0f4;
        }

        .mobile-action-purple {
            color: #6531dd;
            background: #f2edff;
        }

        .mobile-action-green {
            color: #16a866;
            background: #eafaf2;
        }

        .mobile-action-blue {
            color: #1677e8;
            background: #edf6ff;
        }

.mobile-quick-actions strong {
    font-size: 11px;
    line-height: 1.15;
    font-weight: 800;
}

.mobile-quick-actions button > span:last-child {
    margin-top: 2px;
    color: #687390;
    font-size: 9px;
    line-height: 1.15;
}

.mobile-dashboard-footer {
    margin-top: 18px;
    padding: 18px 4px 6px;
    border-top: 1px solid #eceef4;
}

.mobile-dashboard-footer-security {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.mobile-dashboard-footer-icon {
    flex: 0 0 auto;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    background: #f5f7fa;
    border-radius: 50%;
}

.mobile-dashboard-footer-security p {
    margin: 0;
}

.mobile-dashboard-footer-title {
    color: #4b5563;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 700;
}

.mobile-dashboard-footer-text {
    margin-top: 3px !important;
    color: #8a94a8;
    font-size: 11px;
    line-height: 1.45;
    font-weight: 400;
}

        .dashboard-action-options,
        .dashboard-workspace {
            margin-top: 18px !important;
            padding: 14px !important;
            border-radius: 18px !important;
        }
    }

    @media (max-width: 390px) {

        .mobile-greeting-section {
            align-items: flex-start;
            flex-direction: column;
        }

        .mobile-add-person-button {
            align-self: flex-start;
        }


        .mobile-vital {
            padding: 0 3px;
        }

        .mobile-vital strong {
            font-size: 14px;
        }

        .mobile-vital label {
            font-size: 9px;
        }
    }
`}</style>

        </main>

    );

}


//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const pageContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        background:
            "#f8fafc",

        padding:
            "20px",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const pageCard:
    React.CSSProperties = {

        maxWidth:
            "900px",

        margin:
            "0 auto",

        background:
            "#ffffff",

        padding:
            "32px",

        borderRadius:
            "16px",

        border:
            "1px solid #d1d5db",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",

    };


const loadingContainer:
    React.CSSProperties = {

        minHeight:
            "100vh",

        display:
            "flex",

        justifyContent:
            "center",

        alignItems:
            "center",

        background:
            "#f8fafc",

        fontFamily:
            "Inter, Arial, sans-serif",

    };


const languageBox:
    React.CSSProperties = {

marginTop:
    "12px",

marginBottom:
    "20px",

padding:
    "14px 16px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };


const homeSection:
    React.CSSProperties = {

        marginTop:
            "2px",

        marginBottom:
            "24px",

    };


const questionTitle:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "16px",

        fontSize:
            "16px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const actionSelect:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "16px",

        marginBottom:
            "24px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "17px",

        fontWeight:
            600,

        cursor:
            "pointer",

        boxSizing:
            "border-box",

    };

const actionGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap:
            "16px",

    };


const actionButton:
    React.CSSProperties = {

        minHeight:
            "180px",

        padding:
            "24px",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "10px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "14px",

        cursor:
            "pointer",

        textAlign:
            "center",

    };


const actionIcon:
    React.CSSProperties = {

        fontSize:
            "34px",

    };


const actionTitle:
    React.CSSProperties = {

        fontSize:
            "19px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const actionDescription:
    React.CSSProperties = {

        fontSize:
            "14px",

        lineHeight:
            1.5,

        color:
            "#6b7280",

    };


const adminButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "16px",

        marginBottom:
            "14px",

        background:
            "#ffffff",

        color:
            "#111827",

        border:
            "1px solid #d1d5db",

        borderRadius:
            "10px",

        fontSize:
            "16px",

        fontWeight:
            700,

        cursor:
            "pointer",

    };


const logoutButton:
    React.CSSProperties = {

        width:
            "100%",

        padding:
            "14px",

        background:
            "#dc2626",

        color:
            "#ffffff",

        border:
            "none",

        borderRadius:
            "10px",

        fontWeight:
            "bold",

        fontSize:
            "16px",

        marginTop:
            "10px",

    };


const footerStyle:
    React.CSSProperties = {

        marginTop:
            "22px",

        textAlign:
            "center",

        fontSize:
            "12px",

        color:
            "#6b7280",

    };

const workspaceContainer:
    React.CSSProperties = {

        marginTop:
            "8px",

        padding:
            "24px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };


const workspaceTitle:
    React.CSSProperties = {

        marginTop:
            0,

        marginBottom:
            "8px",

        fontSize:
            "22px",

        fontWeight:
            700,

        color:
            "#111827",

    };


const workspaceText:
    React.CSSProperties = {

        margin:
            0,

        color:
            "#6b7280",

        lineHeight:
            1.6,

    };

const personSelectorWrapper:
    React.CSSProperties = {


width:
            "100%",

        marginTop:
            "24px",


    };


const mainActionWrapper:
    React.CSSProperties = {

        marginTop:
            "24px",

    };

const actionOptionsWrapper:
    React.CSSProperties = {

        marginTop:
            "20px",

        padding:
            "20px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

    };

const mainActionGrid:
    React.CSSProperties = {

        display:
            "grid",

        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",

        gap:
            "16px",

        width:
            "100%",

        padding:
            "20px 24px",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px",

        boxSizing:
            "border-box",

    };


const mainActionButton:
    React.CSSProperties = {

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "flex-start",

        gap:
            "8px",

        padding:
            "8px 4px",

        background:
            "transparent",

        border:
            "none",

        cursor:
            "pointer",

        fontFamily:
            "inherit",

    };


const mainActionCircle:
    React.CSSProperties = {

        width:
            "58px",

        height:
            "58px",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        background:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "50%",

        fontSize:
            "25px",

        boxSizing:
            "border-box",

    };


const selectedActionCircle:
    React.CSSProperties = {

        background:
            "#dbeafe",

        border:
            "3px solid #2563eb",

        boxShadow:
            "0 0 0 4px rgba(37, 99, 235, 0.12)",

    };


const mainActionLabel:
    React.CSSProperties = {

        fontSize:
            "14px",

        fontWeight:
            700,

        lineHeight:
            1.3,

        textAlign:
            "center",

color:
    "#374151",

        maxWidth:
            "130px",

    };

const selectedActionLabel:
    React.CSSProperties = {

        color:
            "#1d4ed8",

        fontWeight:
            800,

    };

const careVrJourneyCard: React.CSSProperties = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "24px",

    marginBottom: "24px",

    padding: "24px",

    background: "linear-gradient(135deg,#eff6ff,#ffffff)",

    border: "1px solid #bfdbfe",

    borderRadius: "16px",

    boxShadow: "0 6px 18px rgba(37,99,235,0.08)",

    flexWrap: "wrap",

};

const careVrJourneyTitle: React.CSSProperties = {

    fontSize: "24px",

    fontWeight: 700,

    color: "#1e3a8a",

    marginBottom: "8px",

};

const careVrJourneySubtitle: React.CSSProperties = {

    fontSize: "18px",

    fontWeight: 600,

    color: "#2563eb",

    marginBottom: "12px",

};

const careVrJourneyDescription: React.CSSProperties = {

    maxWidth: "620px",

    color: "#4b5563",

    lineHeight: 1.7,

    fontSize: "15px",

};

const careVrJourneyButton: React.CSSProperties = {

    padding: "14px 24px",

    background: "#2563eb",

    color: "#ffffff",

    border: "none",

    borderRadius: "10px",

    fontSize: "15px",

    fontWeight: 700,

    cursor: "pointer",

    whiteSpace: "nowrap",

};

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { assessmentStorage } from "@/lib/storage/assessmentStorage";

import {
  encryptedAssessmentStorage,
  encryptedHistoryItemToAssessmentRecord,
} from "@/lib/storage/encryptedAssessmentStorage";

import { patientStorage } from "@/lib/storage/patientStorage";
import type { Patient } from "@/lib/types/patient";

import {
  getCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";

import type {
  AssessmentRecord,
  AssessmentStatus,
  AssessmentRecommendation,
} from "@/lib/types/assessment";

import MobileHeader, {
  type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";
import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";
import type { Profile } from "@/lib/types/profile";

import ReportTable, {
  ReportTableColumn,
} from "@/app/components/ReportTable";

/*
import {
  ANALYTICS_CONTEXTS,
  ANALYTICS_EVENTS,
  ANALYTICS_MODULES,
} from "@/lib/analytics/analyticsEvents";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

*/

function FamilyAssessmentHistoryContent() {

const router = useRouter();
const searchParams = useSearchParams();
const requestedPatientId = searchParams.get("patientId");

const dashboardHandoff =
  getCareVRDashboardHandoff();

const [profile, setProfile] = useState<Profile | null>(null);
const [accountMenuOpen, setAccountMenuOpen] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = async () => {
  if (loggingOut) return;

  setLoggingOut(true);

  try {
    await authService.logout();
    router.replace("/sandbox/simulate/app/dashboard");
  } catch (error) {
    console.error("Unable to log out.", error);
    setLoggingOut(false);
  }
};

const handleCareVRJourney = () => {
  setAccountMenuOpen(false);
  router.push("/dashboard");
};

const handleHelp = () => {
  setAccountMenuOpen(false);
  router.push("/help");
};

const handleCareModeChange = (_mode: MobileCareMode) => {
  // Mode switching is intentionally disabled on assessment reports.
};

  //------------------------------------------------------------
  // State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  const [latestAssessment, setLatestAssessment] =
    useState<AssessmentRecord | null>(null);

const [history, setHistory] =
  useState<AssessmentRecord[]>([]);

const [selectedHistoryId, setSelectedHistoryId] =
  useState("");

useEffect(() => {
  let cancelled = false;

  const loadProfile = async () => {
    try {
      const currentProfile =
        await profileRepository.getCurrentProfile();

      if (!cancelled) {
        setProfile(currentProfile);
      }
    } catch (error) {
      console.error("Unable to load current profile.", error);
    }
  };

  void loadProfile();

  return () => {
    cancelled = true;
  };
}, []);


  //------------------------------------------------------------
  // Load Patients
  //------------------------------------------------------------

  useEffect(() => {

    const loadPatients = async () => {

const response =
  await fetch(
    "/api/patients/scope",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        accessId:
          dashboardHandoff?.access.id,
        selectedRole:
          dashboardHandoff?.role,
      }),
    }
  );

const result =
  await response.json();

if (!response.ok) {

  setError(
    result?.error ??
    "Unable to load patients."
  );

  setLoading(false);

  return;
}

const patientList =
  result?.data?.patients ?? [];

setPatients(patientList);

if (patientList.length > 0) {

  const requestedPatient =
    patientList.find(
      (patient: Patient) =>
        patient.id === requestedPatientId
    );

  setSelectedPatientId(
    requestedPatient?.id ?? patientList[0].id
  );

}
else {

  setLoading(false);

}

    };

    loadPatients();

  }, []);

  //------------------------------------------------------------
  // Load Assessment History
  //------------------------------------------------------------

  useEffect(() => {

    if (!selectedPatientId) {

      setLatestAssessment(null);
      setHistory([]);
      setSelectedHistoryId("");
      setLoading(false);

      return;

    }

    let cancelled = false;

    const loadHistory = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          legacyResult,
          encryptedResult,
        ] = await Promise.all([

          assessmentStorage.getPatientHistory(
            selectedPatientId
          ),

          encryptedAssessmentStorage.getHistory(
            "FAMILY",
            selectedPatientId
          ),

        ]);

        if (!legacyResult.success) {

          if (!cancelled) {

            setError(
              legacyResult.error ??
              "Unable to load assessment history."
            );

          }

          return;

        }

        if (!encryptedResult.success) {

          if (!cancelled) {

            setError(
              encryptedResult.error ??
              "Unable to load encrypted assessment history."
            );

          }

          return;

        }

        const legacyRecords =
          legacyResult.data ?? [];

        const encryptedRecords =
          (encryptedResult.data ?? []).map(
            encryptedHistoryItemToAssessmentRecord
          );

        const records = [
          ...legacyRecords,
          ...encryptedRecords,
        ]
          .filter(
            assessment =>
              assessment.assessmentType === "FAMILY" &&
              assessment.patientId === selectedPatientId
          )
          .sort(
            (a, b) =>
              new Date(b.assessmentDate).getTime() -
              new Date(a.assessmentDate).getTime()
          );

/*
        void analyticsService.track({

          module:
            ANALYTICS_MODULES.REPORTS,

          eventName:
            ANALYTICS_EVENTS.VIEWED,

          context:
            ANALYTICS_CONTEXTS.FAMILY,

          pagePath:
            "/reports/assessment/family",

          metadata: {

            reportCategory:
              "ASSESSMENT",

            viewType:
              "HISTORY",

            recordCount:
              records.length,

            patientId:
              selectedPatientId,

          },

        });

*/

        if (cancelled) {
          return;
        }

        if (records.length === 0) {

          setLatestAssessment(null);
          setHistory([]);
          setSelectedHistoryId("");

          return;

        }

        setLatestAssessment(records[0]);

        const previousRecords = records.slice(1);

        setHistory(previousRecords);

        setSelectedHistoryId(
          previousRecords[0]?.id ?? ""
        );

      } catch (error) {

        console.error(
          "Unable to load family assessment history:",
          error
        );

        if (!cancelled) {

          setError(
            "Unable to load assessment history."
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };

    void loadHistory();

    return () => {
      cancelled = true;
    };

  }, [selectedPatientId]);

const selectedPatient =
  patients.find(
    (patient) =>
      patient.id === selectedPatientId
  );

//------------------------------------------------------------
// Explicit Patient Change
//------------------------------------------------------------

const handlePatientChange = (
  patientId: string
) => {

  setSelectedPatientId(
    patientId
  );

/*
  void analyticsService.track({

    module:
      ANALYTICS_MODULES.REPORTS,

    eventName:
      ANALYTICS_EVENTS.FEATURE_CLICKED,

    context:
      ANALYTICS_CONTEXTS.FAMILY,

    pagePath:
      "/reports/assessment/family",

    metadata: {

      reportCategory:
        "ASSESSMENT",

      action:
        "PATIENT_CHANGED",

      patientId,

    },

  });
*/

};

  //------------------------------------------------------------
  // Helpers
  //------------------------------------------------------------
  const formatStatus = (
    status: AssessmentStatus
  ) => {

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (c) => c.toUpperCase()
      );

  };

  const formatRecommendation = (
    recommendation: AssessmentRecommendation
  ) => {

    return recommendation
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (c) => c.toUpperCase()
      );

  };

const columns: ReportTableColumn<AssessmentRecord>[] = [
  {
    key: "date",
    title: "Date",
    width: "34%",
    render: (assessment) =>
      new Date(
        assessment.assessmentDate
      ).toLocaleString(),
  },
  {
    key: "score",
    title: "Score",
    width: "12%",
    align: "center",
    render: (assessment) =>
      `${assessment.normalizedScore}/20`,
  },
  {
    key: "status",
    title: "Status",
    width: "18%",
    align: "center",
    render: (assessment) =>
      formatStatus(assessment.status),
  },
  {
    key: "recommendation",
    title: "Recommendation",
    width: "24%",
    align: "center",
    render: (assessment) =>
      formatRecommendation(
        assessment.recommendation
      ),
  },
  {
    key: "action",
    title: "Action",
    width: "12%",
    align: "center",
    render: (assessment) => (
        <button
            style={viewButtonStyle}
            onClick={() =>
                router.push(
                    `/reports/assessment/family/${assessment.id}`
                )
            }
        >
            View
        </button>
    ),
},
];

  //------------------------------------------------------------
  // Loading
  //------------------------------------------------------------

  if (loading) {

    return (

      <main style={loadingStyle}>

        <h2>

          Loading...

        </h2>

      </main>

    );

  }

  //------------------------------------------------------------
  // Page
  //------------------------------------------------------------

  return (

    <main style={pageStyle}>

      <div style={containerStyle}>

<MobileHeader
  careMode="FAMILY"
  onCareModeChange={handleCareModeChange}
  userName={profile?.fullName ?? ""}
  showHomeButton={true}
  onHomeClick={() =>
  router.push("/record-health?view=timeline")
}
  showCareModeToggle={false}
  showSelfToggle={false}
  showFamilyToggle={false}
  showSwitchProfile={false}
  accountMenuOpen={accountMenuOpen}
  onAccountMenuToggle={() =>
    setAccountMenuOpen(value => !value)
  }
  consentGranted={true}
  canAddPatient={false}
  onAddPatient={() => {}}
  onCareVRJourney={handleCareVRJourney}
  onHelp={handleHelp}
  onLogout={handleLogout}
  loggingOut={loggingOut}
/>

        {/* Patient Selector */}
<div
    style={{
        marginTop: "20px",
        marginBottom: "12px",
        fontSize: "16px",
        fontWeight: 600,
        color: "#374151",
    }}
>
    👤 Patient: {selectedPatient?.fullName ?? ""}
</div>

        {error && (

          <div style={errorStyle}>

            {error}

          </div>

        )}

        {!error &&
          latestAssessment && (

          <div
            style={{
              marginBottom: "32px",
              padding: "24px",
              borderRadius: "16px",
              border: "2px solid #2563eb",
              background: "#eff6ff",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              🩺 Latest Assessment
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                rowGap: "16px",
                columnGap: "28px",
              }}
            >

<div>

  <strong>
    Patient
  </strong>

  <br />

  {selectedPatient?.fullName ?? "-"}

</div>

              <div>

                <strong>Date</strong>

                <br />

                {new Date(
                  latestAssessment.assessmentDate
                ).toLocaleString()}

              </div>

              <div>

                <strong>Score</strong>

                <br />

                {latestAssessment.normalizedScore}/20

              </div>

              <div>

                <strong>Status</strong>

                <br />

                {formatStatus(
                  latestAssessment.status
                )}

              </div>

              <div>

                <strong>Recommendation</strong>

                <br />

                {formatRecommendation(
                  latestAssessment.recommendation
                )}

              </div>

            </div>

            <button
    style={viewButtonStyle}
    onClick={() =>
router.push(
  `/reports/assessment/family/${latestAssessment.id}?patientId=${encodeURIComponent(selectedPatientId)}`
)
    }
>
    View Details
</button>

          </div>

        )}

        {!error &&
          !latestAssessment && (

          <div style={emptyStyle}>

            <h2
              style={{
                marginTop: 0,
              }}
            >
              No Family Assessments
            </h2>

            <p>
              Complete a Family Assessment to begin building the patient's
              assessment history.
            </p>

          </div>

        )}

{!error &&
  history.length > 0 && (

<>

    <h2
        style={{
            marginBottom: "20px",
        }}
    >
        📚 Assessment History
    </h2>

    <div style={historySelectorStyle}>

        <label style={historyLabelStyle}>
            Select Historical Assessment
        </label>

        <div style={historyActionRowStyle}>

            <select
                value={selectedHistoryId}
                onChange={(e) =>
                    setSelectedHistoryId(e.target.value)
                }
                style={historyDropdownCompactStyle}
            >

                {history.map(assessment => (

                    <option
                        key={assessment.id}
                        value={assessment.id}
                    >
                        {new Date(
                            assessment.assessmentDate
                        ).toLocaleString()}
                    </option>

                ))}

            </select>

            <button
                type="button"
                style={viewButtonStyle}
                onClick={() => {

                    if (!selectedHistoryId) return;

router.push(
  `/reports/assessment/family/${selectedHistoryId}?patientId=${encodeURIComponent(selectedPatientId)}`
);

                }}
            >
                View Details
            </button>

        </div>

    </div>

</>

)}
        <button
    style={backButtonStyle}
    onClick={() =>
        router.push("/record-health?view=timeline")
    }
>
    ← 🏠 Back to Health Timeline
</button>

      </div>
<CareVRFooter />

    </main>

  );

}

export default function FamilyAssessmentHistoryPage() {
  return (
    <Suspense fallback={<div>Loading assessment history...</div>}>
      <FamilyAssessmentHistoryContent />
    </Suspense>
  );
}

const loadingStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8fafc",
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "24px",
  fontFamily: "Inter, Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid #e5e7eb",
};

const errorStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#991b1b",
  marginBottom: "24px",
};

const emptyStyle: React.CSSProperties = {
  padding: "48px",
  textAlign: "center",
  border: "1px dashed #d1d5db",
  borderRadius: "12px",
  background: "#fafafa",
};

const backButtonStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};

const viewButtonStyle: React.CSSProperties = {
    marginTop: "24px",
    padding: "8px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
};

const historySelectorStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#ffffff",
};

const historyLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: "#374151",
};

const historyActionRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
};

const historyDropdownCompactStyle: React.CSSProperties = {
    width: "320px",
    maxWidth: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    background: "#ffffff",
};
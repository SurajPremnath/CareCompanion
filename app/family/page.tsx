"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { clearAssessmentData } from "@/lib/assessmentStorage";

import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";
import { patientStorage } from "@/lib/storage/patientStorage";
import AppHeader from "@/app/components/AppHeader";
import type { Patient } from "@/lib/types/patient";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

import {
  ANALYTICS_MODULES,
  ANALYTICS_EVENTS,
  ANALYTICS_CONTEXTS,
} from "@/lib/analytics/analyticsEvents";

import {
  performanceTracker,
} from "@/lib/performance/performanceTracker";

type UserProfile = {
  id: string;
  fullName: string;
};

export default function FamilyPage() {
  const router = useRouter();

const {
  t,
} = useLanguage();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] =
    useState<UserProfile | null>(null);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

//------------------------------------------------------------
// Back To Dashboard
//------------------------------------------------------------

const handleBackToDashboard = () => {

  performanceTracker.start({

    fromPath:
      "/family",

    toPath:
      "/dashboard",

    feature:
      "FAMILY_ASSESSMENT_TO_DASHBOARD",

    context:
      "FAMILY",

  });

  router.push(
    "/dashboard"
  );

};

  useEffect(() => {
    let mounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const user =
          await authService.getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const profile =
          await profileRepository.getCurrentProfile();

        if (!mounted) return;

        if (!profile) {
          setError(
             t("assessment.profileLoadError")
          );
          return;
        }

        setCurrentUser({
          id: profile.id,
          fullName: profile.fullName,
        });

        const result =
          await patientStorage.getPatients();

        if (!mounted) return;

if (!result.success) {
  console.error(
    "Unable to load patients:",
    result.error
  );

  setError(
    t("assessment.patientLoadError")
  );

  return;
}


        const loadedPatients =
          result.data ?? [];

        setPatients(loadedPatients);

        if (loadedPatients.length > 0) {
          setSelectedPatientId(
            loadedPatients[0].id
          );
        }
      } catch (err) {
        console.error(err);

        if (!mounted) return;

        setError(
          t("assessment.pageLoadError")
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      mounted = false;
    };
  }, [router, t]);

  const selectedPatient = useMemo(() => {
    return (
      patients.find(
        (patient) =>
          patient.id === selectedPatientId
      ) ?? null
    );
  }, [patients, selectedPatientId]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {t("common.loading")}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          padding: "20px",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #fecaca",
              borderRadius: "16px",
              padding: "32px",
            }}
          >
            <h2
              style={{
                marginBottom: "16px",
              }}
            >
              {t("assessment.unableToContinue")}
            </h2>

            <p
              style={{
                marginBottom: "24px",
              }}
            >
              {error}
            </p>

            <button
  onClick={handleBackToDashboard}
  style={secondaryButton}
>
  ← {t("assessment.backToDashboard")}
</button>
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return null;
  }

  const startAssessment = async () => {
    if (!currentUser || !selectedPatient) {
      return;
    }

clearAssessmentData();

await analyticsService.track({

  module:
    ANALYTICS_MODULES.ASSESSMENT,

  eventName:
    ANALYTICS_EVENTS.STARTED,

  context:
    ANALYTICS_CONTEXTS.FAMILY,

  pagePath:
    "/family",

  metadata: {

    patientId:
      selectedPatient.id,

  },

});

localStorage.setItem(
  "assessmentType",
  "family"
);

localStorage.setItem(
  "patientId",
  selectedPatient.id
);

    localStorage.setItem(
      "patientName",
      selectedPatient.fullName
    );

    const patientAge =
      selectedPatient.dateOfBirth
        ? String(
            calculateAge(
              selectedPatient.dateOfBirth
            )
          )
        : "";

    localStorage.setItem(
      "patientAge",
      patientAge
    );

    localStorage.setItem(
      "observerName",
      currentUser.fullName
    );

    localStorage.setItem(
      "observerRelationship",
      selectedPatient.relationship ?? ""
    );

    localStorage.setItem(
      "assessmentDate",
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );

    router.push("/family/page2");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "16px",
            padding: "32px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >

<AppHeader
  pageTitle={t("assessment.familyAssessment")}
  pageIcon="👨‍👩‍👧"
  currentUserName={currentUser.fullName}
/>

<p
  style={{
    color: "#6b7280",
    marginBottom: "25px",
  }}
>
  {t("assessment.selectPatientToBegin")}
</p>

          {patients.length === 0 ? (
            <>
              <div
                style={{
                  background: "#fef3c7",
                  border: "1px solid #fcd34d",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                {t("assessment.noPatientsFound")}
              </div>

              <button
                onClick={() =>
                  router.push("/add-patient")
                }
                style={primaryButton}
              >
                ➕ {t("dashboard.addPatient")}
              </button>
            </>
          ) : (
            <>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("assessment.selectPatient")}
              </label>

              <select
                value={selectedPatientId}
                onChange={(e) =>
                  setSelectedPatientId(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  marginBottom: "20px",
                  fontSize: "16px",
                }}
              >
                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.fullName}
                  </option>
                ))}
              </select>

              {selectedPatient && (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <strong>{t("assessment.name")}:</strong>{" "}
                    {selectedPatient.fullName}
                  </div>

                  <div>
                    <strong>{t("assessment.age")}:</strong>{" "}
                    {selectedPatient.dateOfBirth
                      ? calculateAge(
                          selectedPatient.dateOfBirth
                        )
                      : "-"}
                  </div>

                  <div>
                    <strong>{t("assessment.gender")}:</strong>{" "}
                    {selectedPatient.gender ??
                      "-"}
                  </div>

                  <div>
                    <strong>{t("assessment.relationship")}:</strong>{" "}
                    {selectedPatient.relationship ??
                      "-"}
                  </div>
                </div>
              )}

              <button
                onClick={startAssessment}
                style={primaryButton}
              >
                {t("assessment.startAssessment")} →
              </button>

              <button
                onClick={() =>
                  router.push("/add-patient")
                }
                style={secondaryButton}
              >
                ➕ {t("assessment.addNewPatient")}
              </button>
            </>
          )}

          <button
  onClick={handleBackToDashboard}
  style={secondaryButton}
>
  ← {t("assessment.backToDashboard")}
</button>

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            {t("dashboard.createdBy")}
          </div>
        </div>
      </div>
    </main>
  );

  function calculateAge(
    dateOfBirth: string
  ): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age =
      today.getFullYear() -
      dob.getFullYear();

    const monthDifference =
      today.getMonth() -
      dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() <
          dob.getDate())
    ) {
      age--;
    }

    return age;
  }

}

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "12px",
  fontSize: "16px",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "12px",
  fontSize: "16px",
};
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import MobileHeader, {
  type MobileCareMode,
} from "@/Components/common/MobileHeader";
import CareVRFooter from "@/Components/common/CareVRFooter";
import { authService } from "@/lib/auth/authService";
import { profileRepository } from "@/lib/repositories/profileRepository";

import { useLanguage } from "@/Components/language/LanguageProvider";

type Props = {
  currentPage: number;
  assessmentType: "self" | "family";
  children: React.ReactNode;
  useMobileHeader?: boolean;
};

export default function AssessmentLayout({
  currentPage,
  assessmentType,
  children,
  useMobileHeader = false,
}: Props) {
const {
  t,
} = useLanguage();

const router = useRouter();

const [userName, setUserName] = useState("");
const [accountMenuOpen, setAccountMenuOpen] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);

useEffect(() => {
  if (!useMobileHeader) return;

  let active = true;

  const loadProfile = async () => {
    try {
      const profile = await profileRepository.getCurrentProfile();

      if (active) {
        setUserName(profile?.fullName ?? "");
      }
    } catch (error) {
      console.error("Failed to load assessment header profile:", error);
    }
  };

  void loadProfile();

  return () => {
    active = false;
  };
}, [useMobileHeader]);

const handleLogout = async () => {
  if (loggingOut) return;

  setLoggingOut(true);

  try {
    await authService.logout();
    router.replace("/sandbox/simulate/app/dashboard");
  } catch (error) {
    console.error("Assessment logout failed:", error);
    setLoggingOut(false);
  }
};

const handleHelp = () => {
  router.push("/help");
};

const handleCareVRJourney = () => {
  router.push("/carevr-journey");
};

  const safePage = currentPage ?? 1;
  const progress = (safePage / 5) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "15px",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* HEADER (NOW CORRECTLY PASSED) */}

{useMobileHeader ? (
  <div className="assessment-mobile-header">
    <MobileHeader
    careMode={assessmentType === "family" ? "FAMILY" : "SELF"}
    onCareModeChange={() => {}}
    userName={userName}
    pageTitle={
      assessmentType === "family"
        ? t("assessment.familyAssessment")
        : t("assessment.selfAssessment")
    }
    showCareModeToggle={false}
    showSelfToggle={false}
    showFamilyToggle={false}
    showHomeButton
    onHomeClick={() => router.push("/dashboard")}
    showSwitchProfile={false}
    accountMenuOpen={accountMenuOpen}
    onAccountMenuToggle={() =>
      setAccountMenuOpen((current) => !current)
    }
    consentGranted={false}
    canAddPatient={false}
    onAddPatient={() => {}}
    onCareVRJourney={handleCareVRJourney}
    onHelp={handleHelp}
    onLogout={handleLogout}
    loggingOut={loggingOut}
  />
  </div>
) : (
  <Header assessmentType={assessmentType} />
)}

        {/* PROGRESS BAR (COMMON & FIXED) */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#2563eb",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* PAGE INDICATOR */}
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            marginTop: "6px",
            color: "#6b7280",
          }}
        >
          {t("assessment.page")} {safePage} {t("assessment.of")} 5
        </div>

        {/* CONTENT */}
        <div style={{ marginTop: "15px" }}>
          {children}
        </div>
{useMobileHeader && <CareVRFooter />}
      </div>
    </main>
  );
}
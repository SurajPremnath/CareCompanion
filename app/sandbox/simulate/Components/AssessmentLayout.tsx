
"use client";

import { useState } from "react";
import CareVRFooter from "@/Components/common/CareVRFooter";
import SandboxMobileHeader, {
  type SandboxCareMode,
  type SandboxRole,
} from "@/app/sandbox/simulate/Components/common/SandboxMobileHeader";
import { useRouter } from "next/navigation";
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
}: Props) {
  const { t } = useLanguage();
  const router = useRouter();

  const [careMode, setCareMode] = useState<SandboxCareMode>(
    assessmentType === "family" ? "FAMILY" : "SELF"
  );

  const [role, setRole] = useState<SandboxRole>("PRIMARY");

  const safePage = currentPage ?? 1;
  const progress = (safePage / 5) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "15px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <SandboxMobileHeader
          careMode={careMode}
          onCareModeChange={setCareMode}
          userName="Sandbox Participant"
          role={role}
          onRoleChange={setRole}
        />

        <div
          style={{
            marginTop: "10px",
            padding: "10px 12px",
            border: "1px solid #bfdbfe",
            borderRadius: "10px",
            backgroundColor: "#eff6ff",
            color: "#1e40af",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          <strong>Simulation only.</strong> Your assessment answers are used
          to demonstrate CareVR. They are not saved to the CareVR database.
        </div>

        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "16px",
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

        <div style={{ marginTop: "15px" }}>{children}</div>

        <CareVRFooter />
      </div>
    </main>
  );
}

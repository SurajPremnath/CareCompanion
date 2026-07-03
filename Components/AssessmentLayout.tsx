"use client";

import Header from "@/Components/Header";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

type Props = {
  currentPage: number;
  assessmentType: "self" | "family";
  children: React.ReactNode;
};

export default function AssessmentLayout({
  currentPage,
  assessmentType,
  children,
}: Props) {
const {
  t,
} = useLanguage();

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
        <Header assessmentType={assessmentType} />

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
      </div>
    </main>
  );
}
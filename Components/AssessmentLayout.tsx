"use client";

import Header from "@/Components/Header";

type Props = {
  currentPage: number;
  children: React.ReactNode;
};

export default function AssessmentLayout({
  currentPage,
  children,
}: Props) {
  const progress = (currentPage / 5) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "15px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* HEADER (NOW CENTRALIZED) */}
        <Header />

        {/* PROGRESS BAR */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#2563eb",
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
            marginBottom: "15px",
          }}
        >
          Page {currentPage} of 5
        </div>

        {/* PAGE CONTENT */}
        {children}
      </div>
    </main>
  );
}
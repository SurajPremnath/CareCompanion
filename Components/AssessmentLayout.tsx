"use client";

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
        {/* PAGE CONTENT ONLY */}
        {children}
      </div>
    </main>
  );
}
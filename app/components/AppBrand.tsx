"use client";

interface AppBrandProps {
  subtitle?: string;
}

export default function AppBrand({
  subtitle = "Simple daily care.\nBetter clinical conversations.",
}: AppBrandProps) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "32px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "42px",
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.2,
        }}
      >
        ❤️ CareVR
      </h1>

      <p
        style={{
          marginTop: "14px",
          marginBottom: 0,
          color: "#6b7280",
          fontSize: "16px",
          lineHeight: 1.6,
          whiteSpace: "pre-line",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
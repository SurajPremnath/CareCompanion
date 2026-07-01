"use client";

import Link from "next/link";

interface HelpCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function HelpCard({
  title,
  description,
  href,
  icon,
}: HelpCardProps) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: "30px",
                lineHeight: 1,
              }}
            >
              {icon}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {title}
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  marginBottom: 0,
                  color: "#6b7280",
                  fontSize: "15px",
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            </div>
          </div>

          {/* Right Arrow */}

          <div
            style={{
              fontSize: "24px",
              color: "#9ca3af",
              marginLeft: "16px",
            }}
          >
            →
          </div>
        </div>
      </div>
    </Link>
  );
}
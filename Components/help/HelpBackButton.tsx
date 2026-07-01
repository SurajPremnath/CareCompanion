import Link from "next/link";

export default function HelpBackButton() {
  return (
    <Link
      href="/help"
      style={{
        textDecoration: "none",
        color: "#2563eb",
        fontWeight: 500,
        display: "inline-block",
        marginBottom: "24px",
      }}
    >
      ← Back to Help Centre
    </Link>
  );
}
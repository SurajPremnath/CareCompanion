"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type SandboxCareMode = "FAMILY" | "SELF";
export type SandboxRole = "PRIMARY" | "SECONDARY_FAMILY_MEMBER" | "CARETAKER" | "DOCTOR";

interface SandboxMobileHeaderProps {
  careMode: SandboxCareMode;
  onCareModeChange: (mode: SandboxCareMode) => void;
  userName: string;
  role: SandboxRole;
  onRoleChange: (role: SandboxRole) => void;
}

const roles: { value: SandboxRole; label: string }[] = [
  { value: "PRIMARY", label: "Primary" },
  { value: "SECONDARY_FAMILY_MEMBER", label: "Secondary" },
  { value: "CARETAKER", label: "Caretaker" },
  { value: "DOCTOR", label: "Doctor" },
];

export default function SandboxMobileHeader({
  careMode, onCareModeChange, userName, role, onRoleChange,
}: SandboxMobileHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = userName.trim().split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "CV";

  return (
    <header className="sb-mobile-header">
      <button type="button" className="sb-brand" onClick={() => router.push("/sandbox")} aria-label="Return to Sandbox home">
        <img src="/images/CareVR v1.0.png" alt="CareVR" />
      </button>
      <div className="sb-header-actions">
        <div className="sb-mode-toggle" role="group" aria-label="Care mode">
          <button type="button" className={careMode === "FAMILY" ? "active" : ""} onClick={() => onCareModeChange("FAMILY")}>Family</button>
          <button type="button" className={careMode === "SELF" ? "active" : ""} onClick={() => onCareModeChange("SELF")}>Self</button>
        </div>
        <button type="button" className="sb-avatar" aria-label="Sandbox options" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>{initials}</button>
        {menuOpen && (
          <div className="sb-account-menu">
            <strong>Simulation settings</strong>
            <label htmlFor="sb-role">Explore as</label>
            <select id="sb-role" value={role} onChange={(e) => onRoleChange(e.target.value as SandboxRole)}>
              {roles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <p>Fictional demo environment. No real account is connected.</p>
            <button type="button" onClick={() => router.push("/sandbox")}>Exit Sandbox</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .sb-mobile-header{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:74px;padding:2px 0;z-index:20}
        .sb-brand{display:flex;align-items:center;min-width:0;padding:0;border:0;background:transparent;cursor:pointer}
        .sb-brand img{display:block;width:170px;height:70px;max-width:100%;object-fit:contain;object-position:left center}
        .sb-header-actions{position:relative;display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-shrink:0}
        .sb-mode-toggle{display:inline-flex;align-items:center;gap:2px;padding:3px;border:1px solid #dfe3ea;border-radius:12px;background:#f5f6f8}
        .sb-mode-toggle button{min-width:58px;height:34px;padding:0 10px;border:0;border-radius:9px;background:transparent;color:#6b7280;font:600 13px inherit;cursor:pointer}
        .sb-mode-toggle button.active{background:#2563eb;color:#fff;box-shadow:0 2px 5px #2563eb38}
        .sb-avatar{width:40px;height:40px;flex:0 0 40px;border:2px solid #fff;border-radius:50%;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 2px 7px #281f5a1f}
        .sb-account-menu{position:absolute;top:calc(100% + 8px);right:0;z-index:100;width:250px;max-width:calc(100vw - 24px);display:flex;flex-direction:column;gap:9px;padding:15px;border:1px solid #e8eaf1;border-radius:15px;background:#fff;box-shadow:0 12px 32px #281f5a29;color:#172033}
        .sb-account-menu strong{font-size:13px}.sb-account-menu label{font-size:12px;color:#697386}.sb-account-menu select{width:100%;padding:9px;border:1px solid #d9e0ea;border-radius:8px;background:#fff;color:#172033}.sb-account-menu p{margin:0;color:#697386;font-size:11px;line-height:1.5}.sb-account-menu button{padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;background:#f7f9fc;color:#243b67;font-weight:700;cursor:pointer}
        @media(max-width:480px){.sb-brand img{width:130px;height:62px}.sb-mobile-header{gap:6px}.sb-header-actions{gap:5px}.sb-mode-toggle button{min-width:48px;padding:0 7px;font-size:12px}.sb-avatar{width:36px;height:36px;flex-basis:36px}}
      `}</style>
    </header>
  );
}

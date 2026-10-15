"use client";

export interface SandboxPatient {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string;
  relationship: string;
}

interface SandboxPatientPanelProps {
  userName: string;
  patients: SandboxPatient[];
  selectedPatientId: string | null;
  onPatientSelect: (patient: SandboxPatient) => void;
  careMode: "FAMILY" | "SELF";
}

function ageFromDate(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}
function initials(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function SandboxPatientPanel({ userName, patients, selectedPatientId, onPatientSelect, careMode }: SandboxPatientPanelProps) {
  if (careMode === "SELF") return null;
  return (
    <section className="sb-patient-panel">
      <div className="sb-patient-heading"><span>Good morning {userName.trim().split(/\s+/)[0]}.</span><h2>People you care for:</h2></div>
      {patients.length === 0 ? <div className="sb-patient-empty">No demo profiles available.</div> : (
        <div className="sb-patient-list" role="list" aria-label="Demo people you care for">
          {patients.map((patient) => {
            const selected = patient.id === selectedPatientId;
            const age = ageFromDate(patient.dateOfBirth);
            return (
              <button key={patient.id} type="button" role="listitem" aria-pressed={selected} className={`sb-patient-card${selected ? " selected" : ""}`} onClick={() => onPatientSelect(patient)}>
                <div className="sb-patient-card-top"><span className="sb-patient-avatar">{initials(patient.fullName)}</span>{selected && <span className="sb-patient-check" aria-label="Selected">✓</span>}</div>
                <div className="sb-patient-details"><strong>{patient.fullName}</strong><span>{age !== null ? `${age} · ` : ""}{patient.gender}</span><small>{patient.relationship}</small></div>
              </button>
            );
          })}
        </div>
      )}
      <style jsx>{`
        .sb-patient-panel{width:100%;box-sizing:border-box}.sb-patient-heading{display:flex;align-items:center;gap:6px;margin:0 0 8px;flex-wrap:wrap}.sb-patient-heading span{color:#101d45;font-size:14px;line-height:1.25;font-weight:700}.sb-patient-heading h2{margin:0;color:#4f20d8;font-size:14px;line-height:1.25;font-weight:700}
        .sb-patient-list{width:100%;display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding:1px 1px 5px;box-sizing:border-box;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .sb-patient-card{position:relative;flex:0 0 160px;min-height:124px;padding:10px;display:flex;flex-direction:column;align-items:flex-start;gap:7px;border:1px solid #e3e0eb;border-radius:14px;background:rgba(255,255,255,.95);color:#101d45;font-family:inherit;text-align:left;cursor:pointer;box-sizing:border-box;transition:border-color .15s ease,background .15s ease,box-shadow .15s ease}
        .sb-patient-card.selected{border:2px solid #5630e8;background:#faf8ff;box-shadow:0 2px 8px #4f20d812}.sb-patient-card:focus-visible{outline:3px solid #8b7cf6;outline-offset:2px}
        .sb-patient-card-top{display:flex;align-items:center;justify-content:space-between;width:100%}.sb-patient-avatar{width:38px;height:38px;flex:0 0 auto;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#f0eaff;color:#4f20d8;font-size:15px;font-weight:800}.sb-patient-check{width:23px;height:23px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#4f20d8;color:white;font-size:13px;font-weight:800}
        .sb-patient-details{min-width:0;width:100%;display:flex;flex-direction:column;gap:2px}.sb-patient-details strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#101d45;font-size:13px;line-height:1.3;font-weight:800}.sb-patient-details span{color:#59657f;font-size:10px;line-height:1.3}.sb-patient-details small{color:#818ba0;font-size:10px;line-height:1.3}.sb-patient-empty{min-height:72px;padding:18px;display:flex;align-items:center;justify-content:center;border:1px dashed #d1d5db;border-radius:14px;background:#fff;color:#6b7280;font-size:14px}
        @media(min-width:600px){.sb-patient-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;overflow-x:visible}.sb-patient-card{width:100%;min-height:124px;flex-basis:auto}}
      `}</style>
    </section>
  );
}

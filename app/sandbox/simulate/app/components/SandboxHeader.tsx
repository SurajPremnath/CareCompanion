
"use client";

import Image from "next/image";

interface SandboxHeaderProps {
    role: "PRIMARY" | "SECONDARY" | "CARETAKER" | "DOCTOR";
    onSwitchRole: () => void;
}

const roleLabels = {
    PRIMARY: "Primary",
    SECONDARY: "Secondary",
    CARETAKER: "Caretaker",
    DOCTOR: "Doctor",
};

export default function SandboxHeader({
    role,
    onSwitchRole,
}: SandboxHeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Image
                    src="/images/CareVR v1.0.png"
                    alt="CareVR"
                    width={170}
                    height={58}
                    priority
                    className="h-auto w-28 sm:w-36"
                />

                <div className="flex items-center gap-2">
                    <span className="hidden rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 sm:inline-flex">
                        SANDBOX
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                        {roleLabels[role]}
                    </span>

                    <button
                        type="button"
                        onClick={onSwitchRole}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                    >
                        Switch role
                    </button>
                </div>
            </div>
        </header>
    );
}

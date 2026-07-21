// components/journey-review/ActiveTreatmentCard.tsx

"use client";

import {
  Building2,
  Calendar,
  Pill,
  ShieldCheck,
  Stethoscope,
  Clock3,
  Activity,
} from "lucide-react";

import {
  ActiveTreatmentView,
} from "@/lib/journey/view-models";

import {
  JourneyMedicine,
} from "@/lib/journey";

interface ActiveTreatmentCardProps {
    treatment: ActiveTreatmentView;
}

export function ActiveTreatmentCard({
  treatment,
}: ActiveTreatmentCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm">

      <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-3">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Active Treatment Plan
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Current treatment that CareVR considers active.
              </p>

            </div>

          </div>

          <span className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Active
          </span>

        </div>

      </div>

      <div className="space-y-6 p-6">

        {/* Doctor & Hospital */}

        <div className="grid gap-4 md:grid-cols-2">

          <InfoTile
            icon={<Stethoscope className="h-5 w-5 text-sky-600" />}
            title="Treating Doctor"
            value={treatment.doctorName}
          />

          <InfoTile
            icon={<Building2 className="h-5 w-5 text-indigo-600" />}
            title="Hospital / Clinic"
            value={treatment.hospitalName}
          />

        </div>

        {/* Diagnosis */}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

          <div className="mb-3 flex items-center gap-2">

            <Activity className="h-5 w-5 text-red-500" />

            <span className="font-semibold text-slate-900">
              Diagnosis
            </span>

          </div>

          <p className="leading-7 text-slate-700">
            {treatment.diagnosis}
          </p>

        </div>

        {/* Dates */}

        <div className="grid gap-4 md:grid-cols-2">

          <InfoTile
            icon={<Calendar className="h-5 w-5 text-emerald-600" />}
            title="Treatment Started"
            value={formatDate(treatment.startDate)}
          />

          <InfoTile
            icon={<Clock3 className="h-5 w-5 text-amber-600" />}
            title="Expected End"
            value={
              treatment.endDate
                ? formatDate(treatment.endDate)
                : "Ongoing"
            }
          />

        </div>

        {/* Medicines */}

        <div>

          <div className="mb-4 flex items-center gap-2">

            <Pill className="h-5 w-5 text-sky-600" />

            <h4 className="font-semibold text-slate-900">
              Current Medicines
            </h4>

          </div>

          {treatment.medicines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No medicines available.
            </div>
          ) : (
            <div className="space-y-3">

              {treatment.medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                />
              ))}

            </div>
          )}

        </div>

        {/* Notes */}

        {treatment.notes && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Clinical Notes
            </p>

            <p className="mt-3 leading-7 text-slate-700">
              {treatment.notes}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

interface InfoTileProps {
  icon: React.ReactNode;
  title: string;
  value?: string;
}

function InfoTile({
  icon,
  title,
  value,
}: InfoTileProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        {icon}

        <span className="text-sm font-medium text-slate-600">
          {title}
        </span>

      </div>

      <div className="mt-3 text-base font-semibold text-slate-900">
        {value || "-"}
      </div>

    </div>
  );
}

interface MedicineCardProps {
    medicine: JourneyMedicine;
}

function MedicineCard({
  medicine,
}: MedicineCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-sky-300">

      <div className="flex items-start justify-between">

        <div>

          <h5 className="text-base font-semibold text-slate-900">
            {medicine.name}
          </h5>

          {medicine.genericName && (
            <p className="mt-1 text-sm italic text-slate-500">
              {medicine.genericName}
            </p>
          )}

        </div>

        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
          {medicine.strength}
        </span>

      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">

        <MedicineField
          label="Dose"
          value={medicine.dose}
        />

        <MedicineField
          label="Frequency"
          value={medicine.frequency}
        />

        <MedicineField
          label="Duration"
          value={medicine.duration}
        />

      </div>

      {medicine.instructions && (
        <div className="mt-5 rounded-lg bg-amber-50 p-4">

          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Instructions
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {medicine.instructions}
          </p>

        </div>
      )}
    </div>
  );
}

interface MedicineFieldProps {
  label: string;
  value?: string;
}

function MedicineField({
  label,
  value,
}: MedicineFieldProps) {
  return (
    <div>

      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-sm font-medium text-slate-900">
        {value || "-"}
      </div>

    </div>
  );
}

function formatDate(date?: string | Date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
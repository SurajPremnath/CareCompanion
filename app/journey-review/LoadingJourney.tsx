// components/journey-review/LoadingJourney.tsx

"use client";

export function LoadingJourney() {
  return (
    <div className="space-y-6 animate-pulse">

      {[1, 2, 3, 4].map(item => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="h-6 w-56 rounded bg-slate-200" />

          <div className="mt-5 space-y-3">

            <div className="h-4 rounded bg-slate-100" />

            <div className="h-4 w-5/6 rounded bg-slate-100" />

            <div className="h-4 w-3/4 rounded bg-slate-100" />

          </div>

        </div>
      ))}

    </div>
  );
}
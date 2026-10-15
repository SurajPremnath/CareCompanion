"use client";

import { TimelineEvent } from "./types";

interface Props {
    event: TimelineEvent;
    isLast?: boolean;
}

function formatDate(value?: string | null) {
    if (!value) return "--";

    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function TimelineItem({
    event,
    isLast = false,
}: Props) {


    return (

        <article className="relative flex gap-6">

            {!isLast && (
                <div className="absolute left-7 top-16 bottom-0 w-px bg-slate-200" />
            )}

            <div className="relative z-10">

                <div
                    className={`
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        text-white
                        shadow-lg
                        ${event.color}
                    `}
                >
                    <span className="h-3 w-3 rounded-full bg-white" />
                </div>

            </div>

            <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="space-y-2">

                        <div className="flex flex-wrap items-center gap-3">

                            <h3 className="text-xl font-semibold text-slate-900">
                                {event.title}
                            </h3>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {event.type.replaceAll("_", " ")}
                            </span>

                        </div>

                        {event.description && (
                            <p className="leading-7 text-slate-600">
                                {event.description}
                            </p>
                        )}

                    </div>

                    <div className="whitespace-nowrap text-sm font-medium text-slate-500">
                        {formatDate(event.date)}
                    </div>

                </div>

            </div>

        </article>

    );

}
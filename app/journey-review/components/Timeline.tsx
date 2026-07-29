"use client";

import { TimelineEvent } from "./types";
import { TimelineItem } from "./TimelineItem";

interface Props {
    timeline: TimelineEvent[];
}

export function Timeline({
    timeline,
}: Props) {

    return (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-8 py-7">

                <h2 className="jr-title-lg">
                    Health Timeline
                </h2>

                <p className="jr-body mt-2 text-slate-500">
                    Complete chronological clinical journey reconstructed from CareVR.
                </p>

            </div>

            {timeline.length === 0 ? (

                <div className="px-8 py-20 text-center text-slate-500">
                    No clinical events available.
                </div>

            ) : (

                <div className="px-8 py-8">

                    <div className="space-y-8">

                        {timeline.map((event, index) => (

                            <TimelineItem
                                key={event.id}
                                event={event}
                                isLast={index === timeline.length - 1}
                            />

                        ))}

                    </div>

                </div>

            )}

        </section>
    );

}
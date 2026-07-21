import { JourneyEngineResult } from "../engine/engineResult";
import type { JourneyContext } from "../models/journeyContext";

import { TimelineBuilder } from "./TimelineBuilder";
import {
    TimelineEvent,
    TimelineResult,
    TimelineStatus
} from "./timelineTypes";

export class TimelineEngine {

    private readonly builder: TimelineBuilder;

    constructor(
        builder: TimelineBuilder = new TimelineBuilder()
    ) {
        this.builder = builder;
    }

    execute(events: TimelineEvent[]): JourneyEngineResult {

        const startedAt = new Date();

        try {

            const result = this.builder.build(events);

if (result.errors.length > 0) {

    return {
        success: false,
        status: "FAILED" as any,
        context: {} as JourneyContext,
        warnings: result.warnings.map((warning) => ({
            code: "TIMELINE_WARNING",
            message: warning,
        })),
        errors: result.errors.map((error) => ({
            code: "TIMELINE_ERROR",
            message: error,
            recoverable: true,
        })),
        metrics: {
            startedAt: startedAt.toISOString(),
            completedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt.getTime(),
        }
    };
}

return {
    success: true,
    status: "SUCCESS" as any,
    context: {} as JourneyContext,
    warnings: result.warnings.map((warning) => ({
        code: "TIMELINE_WARNING",
        message: warning,
    })),
    errors: [],
    metrics: {
        startedAt: startedAt.toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt.getTime(),
    }
};

} catch (error) {

    return {
        success: false,
        status: "FAILED" as any,
        context: {} as JourneyContext,
        warnings: [],
        errors: [{
            code: "TIMELINE_ERROR",
            message: error instanceof Error
                ? error.message
                : "Timeline engine execution failed.",
            recoverable: false,
        }],
        metrics: {
            startedAt: startedAt.toISOString(),
            completedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt.getTime(),
        }
    };
}
}

 executeOrThrow(events: TimelineEvent[]): TimelineResult {

    const result = this.execute(events);

    if (!result.success) {
        throw new Error(
            result.errors
                .map((e) => e.message)
                .join(", ")
        );
    }

    return result.context.state.timeline as unknown as TimelineResult;
}

    isHealthy(): boolean {
        return true;
    }

    getStatus(): TimelineStatus {
        return TimelineStatus.SUCCESS;
    }
}
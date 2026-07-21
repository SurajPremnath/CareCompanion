import { EngineResult } from "../engine/engineResult";

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

    execute(events: TimelineEvent[]): EngineResult<TimelineResult> {

        const startTime = Date.now();

        try {

            const result = this.builder.build(events);

            if (result.errors.length > 0) {

                return {
                    success: false,
                    data: undefined,
                    warnings: result.warnings,
                    errors: result.errors,
                    metrics: {
                        executionTimeMs: Date.now() - startTime
                    }
                };
            }

            return {
                success: true,
                data: result,
                warnings: result.warnings,
                errors: [],
                metrics: {
                    executionTimeMs: Date.now() - startTime
                }
            };

        } catch (error) {

            return {
                success: false,
                data: undefined,
                warnings: [],
                errors: [
                    error instanceof Error
                        ? error.message
                        : "Timeline engine execution failed."
                ],
                metrics: {
                    executionTimeMs: Date.now() - startTime
                }
            };
        }
    }

    executeOrThrow(events: TimelineEvent[]): TimelineResult {

        const result = this.execute(events);

        if (!result.success || !result.data) {
            throw new Error(result.errors.join(", "));
        }

        return result.data;
    }

    isHealthy(): boolean {
        return true;
    }

    getStatus(): TimelineStatus {
        return TimelineStatus.SUCCESS;
    }
}
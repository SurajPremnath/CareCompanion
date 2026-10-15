import type { JourneyContext } from "../models/journeyContext";
import type { JourneyProcessor } from "./journeyProcessor";
import type {
  JourneyEngineError,
  JourneyEngineResult,
  JourneyEngineWarning,
} from "./engineResult";

/**
 * ============================================================
 * Journey Engine
 * ============================================================
 *
 * Master orchestration engine for the CareVR Journey pipeline.
 *
 * Responsibilities
 * ----------------
 * - Execute processors in sequence
 * - Preserve JourneyContext
 * - Capture execution metrics
 * - Stop on unrecoverable failures
 *
 * This class intentionally contains NO business logic.
 */
export class JourneyEngine {
  constructor(
    private readonly processors: readonly JourneyProcessor[],
  ) {}

  async execute(
    initialContext: JourneyContext,
  ): Promise<JourneyEngineResult> {
    const startedAt = new Date();

    const warnings: JourneyEngineWarning[] = [];
    const errors: JourneyEngineError[] = [];

    let context = initialContext;

    try {
      for (const processor of this.processors) {
        context = await processor.execute(context);
      }

      const completedAt = new Date();

      return {
        success: true,
        status: "SUCCESS",
        context,
        warnings,
        errors,
        metrics: {
          startedAt: startedAt.toISOString(),
          completedAt: completedAt.toISOString(),
          durationMs:
            completedAt.getTime() - startedAt.getTime(),
        },
      };
    } catch (error) {
      const completedAt = new Date();

      errors.push({
        code: "JOURNEY_ENGINE_FAILURE",
        message:
          error instanceof Error
            ? error.message
            : "Unknown Journey Engine error.",
        recoverable: false,
      });

      return {
        success: false,
        status: "FAILED",
        context,
        warnings,
        errors,
        metrics: {
          startedAt: startedAt.toISOString(),
          completedAt: completedAt.toISOString(),
          durationMs:
            completedAt.getTime() - startedAt.getTime(),
        },
      };
    }
  }
}
import type { JourneyContext } from "../models/journeyContext";

/**
 * ============================================================
 * Journey Processor
 * ============================================================
 *
 * Every Journey processing component implements this interface.
 *
 * Examples:
 * - ConsultationEngine
 * - ComparisonEngine
 * - TreatmentEngine
 * - NodeBuilder
 * - EdgeBuilder
 * - GraphBuilder
 * - TimelineBuilder
 * - SummaryBuilder
 * - QuestionBuilder
 * - JourneyAnalysisEngine
 *
 * Each processor receives a JourneyContext, enriches it,
 * and returns the updated context.
 */

export interface JourneyProcessor {

    execute(
        context: JourneyContext
    ): Promise<JourneyContext>;

}
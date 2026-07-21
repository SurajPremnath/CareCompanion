import type { JourneyContext } from "../models/journeyContext";

/* ==========================================================
 * Engine Status
 * ========================================================== */

export type JourneyEngineStatus =
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "VALIDATION_FAILED"
  | "FAILED";

/* ==========================================================
 * Warning
 * ========================================================== */

export interface JourneyEngineWarning {
  code: string;

  message: string;
}

/* ==========================================================
 * Error
 * ========================================================== */

export interface JourneyEngineError {
  code: string;

  message: string;

  recoverable: boolean;
}

/* ==========================================================
 * Metrics
 * ========================================================== */

export interface JourneyEngineMetrics {
  startedAt: string;

  completedAt: string;

  durationMs: number;
}

/* ==========================================================
 * Generic Engine Result
 * ========================================================== */

export interface JourneyEngineResult {

  success: boolean;

  status: JourneyEngineStatus;

  context: JourneyContext;

  warnings: JourneyEngineWarning[];

  errors: JourneyEngineError[];

  metrics: JourneyEngineMetrics;
}
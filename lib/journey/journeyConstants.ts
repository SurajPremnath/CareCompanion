/**
 * ============================================================
 * CAREVR Journey Intelligence Constants
 * ------------------------------------------------------------
 * Global constants used across the Journey module.
 *
 * No business logic.
 * No helper functions.
 * ============================================================
 */

/* ============================================================
 * Journey Engine
 * ============================================================ */

export const JOURNEY_ENGINE_VERSION = "1.0.0";

export const DEFAULT_JOURNEY_CONFIDENCE_SCORE = 0.50;

export const MAX_JOURNEY_HISTORY = 500;

export const MAX_TIMELINE_EVENTS = 1000;

export const DEFAULT_LOOKBACK_DAYS = 365;

/* ============================================================
 * Pattern Matching
 * ============================================================ */

export const MIN_PATTERN_MATCH_SCORE = 0.70;

export const HIGH_PATTERN_MATCH_SCORE = 0.90;

export const PATTERN_LEARNING_THRESHOLD = 5;

export const PATTERN_VERIFICATION_THRESHOLD = 20;

/* ============================================================
 * Learning Engine
 * ============================================================ */

export const MIN_CONFIDENCE_TO_LEARN = 0.60;

export const AUTO_VERIFY_CONFIDENCE = 0.98;

export const MAX_UNKNOWN_PATTERNS = 500;

/* ============================================================
 * Timeline
 * ============================================================ */

export const DEFAULT_TIMELINE_PAGE_SIZE = 50;

export const MAX_TIMELINE_PAGE_SIZE = 500;

export const TIMELINE_DATE_FORMAT = "yyyy-MM-dd";

/* ============================================================
 * Journey Analysis
 * ============================================================ */

export const MAX_CONSULTATION_GAP_DAYS = 180;

export const MAX_REFERRAL_WINDOW_DAYS = 30;

export const MAX_TRANSFER_WINDOW_DAYS = 7;

export const MAX_SECOND_OPINION_WINDOW_DAYS = 60;

/* ============================================================
 * Transition Scoring
 * ============================================================ */

export const SAME_PROVIDER_SCORE = 1.00;

export const SAME_HOSPITAL_SCORE = 0.90;

export const SAME_SPECIALTY_SCORE = 0.80;

export const REFERRAL_SCORE = 0.95;

export const TRANSFER_SCORE = 0.95;

export const SECOND_OPINION_SCORE = 0.85;

/* ============================================================
 * Validation
 * ============================================================ */

export const MAX_PROVIDER_NAME_LENGTH = 150;

export const MAX_FACILITY_NAME_LENGTH = 200;

export const MAX_NOTES_LENGTH = 5000;

export const MAX_METADATA_KEYS = 100;

/* ============================================================
 * Defaults
 * ============================================================ */

export const UNKNOWN_PROVIDER = "Unknown Provider";

export const UNKNOWN_FACILITY = "Unknown Facility";

export const UNKNOWN_SPECIALTY = "Unknown Specialty";

export const UNKNOWN_LOCATION = "Unknown";

/* ============================================================
 * Metadata
 * ============================================================ */

export const JOURNEY_METADATA_VERSION = 1;

export const DEFAULT_TIMEZONE = "UTC";
/**
 * Standard result returned by the Storage layer.
 *
 * Storage modules never expose database exceptions directly
 * to the UI. Instead they return a consistent Result<T>.
 */
export interface Result<T> {

  /**
   * Indicates whether the operation completed successfully.
   */
  success: boolean;

  /**
   * Returned when success = true.
   */
  data?: T;

  /**
   * Stable business error code.
   *
   * Examples:
   * PATIENT_ALREADY_EXISTS
   * VALIDATION_FAILED
   * UNAUTHORIZED
   * NETWORK_ERROR
   */
  code?: string;

  /**
   * User-friendly message suitable for display.
   */
  message?: string;

  /**
   * Optional technical error for logging/debugging.
   */
  error?: unknown;

}
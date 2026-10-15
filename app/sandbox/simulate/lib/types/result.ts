// lib/types/result.ts

/**
 * Standard result wrapper used by all Storage classes.
 *
 * Storage Layer
 * -------------
 * - Never throws business errors.
 * - Always returns Result<T>.
 *
 * Repository Layer
 * ----------------
 * - May throw exceptions from Supabase.
 * - Storage converts exceptions into Result<T>.
 */
export interface Result<T> {

  success: boolean;

  data?: T;

  error?: string;

  message?: string;

  code?: string;

}
import type { Result } from "@/lib/types/result";

/**
 * Helper class for creating Result<T> objects.
 */
export class StorageResult {

  //------------------------------------------------------------
  // Success
  //------------------------------------------------------------

static success<T>(
  data?: T,
  message?: string
): Result<T> {

    return {

      success: true,

      data,

      message

    };

  }

  //------------------------------------------------------------
  // Failure
  //------------------------------------------------------------

  static failure<T>(
    code: string,
    message: string,
    error?: unknown
  ): Result<T> {

    return {

      success: false,

      code,

      message,

      error:
        error instanceof Error
          ? error.message
          : message

    };

  }

}
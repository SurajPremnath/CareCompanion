import { Result } from "../types/result";

/**
 * Helper class for creating Result<T> objects.
 */
export class StorageResult {

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

  static failure<T>(
    code: string,
    message: string,
    error?: unknown
  ): Result<T> {

    return {
      success: false,
      code,
      message,
      error
    };

  }

}
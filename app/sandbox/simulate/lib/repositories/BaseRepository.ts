import { authService } from "@/lib/auth/authService";

export abstract class BaseRepository {
  protected async getCurrentUserId(): Promise<string> {
    return await authService.getCurrentUserId();
  }

  protected async getCurrentUser() {
    return await authService.requireAuthenticatedUser();
  }

  protected async isAuthenticated(): Promise<boolean> {
    return await authService.isAuthenticated();
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error;
    }

    if (error && typeof error === "object") {
      const e = error as {
        message?: unknown;
        details?: unknown;
        hint?: unknown;
        code?: unknown;
      };

      const parts = [
        typeof e.message === "string" ? e.message : undefined,
        typeof e.details === "string" ? e.details : undefined,
        typeof e.hint === "string" ? e.hint : undefined,
        typeof e.code === "string" ? `[${e.code}]` : undefined,
      ].filter(Boolean);

      if (parts.length > 0) {
        throw new Error(parts.join(" "));
      }
    }

    throw new Error("An unexpected repository error occurred.");
  }
}
import type { AssessmentDraft } from "@/lib/types/assessmentDraft";

const STORAGE_KEY = "assessmentDraft";

export class AssessmentDraftStorage {
  /**
   * Merge the supplied values into the existing draft.
   */
  update(
    draft: Partial<AssessmentDraft>
  ): void {
    const existing = this.get();

    const updated: AssessmentDraft = {
      ...existing,
      ...draft,
    } as AssessmentDraft;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  }

  /**
   * Returns the current draft.
   */
  get(): Partial<AssessmentDraft> {
    const draft =
      localStorage.getItem(STORAGE_KEY);

    if (!draft) {
      return {};
    }

    try {
      return JSON.parse(
        draft
      ) as AssessmentDraft;
    } catch {
      this.clear();
      return {};
    }
  }

  /**
   * Removes the assessment draft.
   */
  clear(): void {
    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  /**
   * Returns true when a draft exists.
   */
  hasDraft(): boolean {
    return (
      localStorage.getItem(
        STORAGE_KEY
      ) !== null
    );
  }
}

export const assessmentDraftStorage =
  new AssessmentDraftStorage();
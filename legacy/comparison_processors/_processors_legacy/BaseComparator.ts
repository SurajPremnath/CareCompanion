import type { ComparisonDifference } from "../comparisonTypes";
import type {
  ChangeSeverity,
  ChangeType,
  ComparisonCategory,
  ComparisonConfidence,
} from "../comparisonTypes";

import { ComparisonHelper } from "../utils/ComparisonHelper";

export abstract class BaseComparator {
  protected difference(
    category: ComparisonCategory,
    field: string,
    label: string,
    previousValue: unknown,
    currentValue: unknown,
    changeType: ChangeType,
    severity: ChangeSeverity,
    confidence: ComparisonConfidence,
    reason?: string,
    recommendation?: string,
  ): ComparisonDifference {
    return ComparisonHelper.difference(
      category,
      field,
      label,
      previousValue,
      currentValue,
      changeType,
      severity,
      confidence,
      reason,
      recommendation,
    );
  }

  protected normalize(
    value: string | null | undefined,
  ): string {
    return ComparisonHelper.normalize(value);
  }

  protected same(
    left: string | null | undefined,
    right: string | null | undefined,
  ): boolean {
    return ComparisonHelper.same(left, right);
  }

  protected equals(
    left: unknown,
    right: unknown,
  ): boolean {
    return ComparisonHelper.equals(left, right);
  }

  protected asArray<T>(
    value: T[] | undefined | null,
  ): T[] {
    return ComparisonHelper.asArray(value);
  }

  protected compareCollection<T>(
    previous: T[],
    current: T[],
    selector: (item: T) => string,
  ) {
    return ComparisonHelper.compareCollection(
      previous,
      current,
      selector,
    );
  }
}
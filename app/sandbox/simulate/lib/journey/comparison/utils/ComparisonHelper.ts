import type { ComparisonDifference } from "../comparisonTypes";
import type {
  ChangeSeverity,
  ChangeType,
  ComparisonCategory,
  ComparisonConfidence,
} from "../comparisonTypes";

export class ComparisonHelper {
  static difference(
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
    return {
      id: crypto.randomUUID(),

      category,

      field,

      label,

      previousValue,

      currentValue,

      changeType,

      severity,

      clinicalImpact: this.toClinicalImpact(severity),

      confidence,

      reason,

      recommendation,
    };
  }

  static normalize(
    value: string | null | undefined,
  ): string {
    if (!value) {
      return "";
    }

    return value
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  static same(
    left: string | null | undefined,
    right: string | null | undefined,
  ): boolean {
    return (
      this.normalize(left) ===
      this.normalize(right)
    );
  }

  static equals(
    left: unknown,
    right: unknown,
  ): boolean {
    return (
      JSON.stringify(left) ===
      JSON.stringify(right)
    );
  }

  static asArray<T>(
    value: T[] | undefined | null,
  ): T[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value;
  }

  static compareCollection<T>(
    previous: T[],
    current: T[],
    selector: (item: T) => string,
  ) {
    const previousMap = new Map<string, T>();
    const currentMap = new Map<string, T>();

    previous.forEach(item => {
      previousMap.set(
        selector(item).toLowerCase(),
        item,
      );
    });

    current.forEach(item => {
      currentMap.set(
        selector(item).toLowerCase(),
        item,
      );
    });

    return {
      previousMap,
      currentMap,
    };
  }

  static removeDuplicates(
    differences: ComparisonDifference[],
  ): ComparisonDifference[] {
    const unique = new Map<
      string,
      ComparisonDifference
    >();

    for (const difference of differences) {
      const key = [
        difference.category,
        difference.field,
        difference.label,
        JSON.stringify(
          difference.previousValue,
        ),
        JSON.stringify(
          difference.currentValue,
        ),
        difference.changeType,
      ].join("|");

      if (!unique.has(key)) {
        unique.set(key, difference);
      }
    }

    return [...unique.values()];
  }

  static countSeverity(
    differences: ComparisonDifference[],
    severity: ChangeSeverity,
  ): number {
    return differences.filter(
      d => d.severity === severity,
    ).length;
  }

  static countChangeType(
    differences: ComparisonDifference[],
    type: ChangeType,
  ): number {
    return differences.filter(
      d => d.changeType === type,
    ).length;
  }

  static hasClinicalChanges(
    differences: ComparisonDifference[],
  ): boolean {
    return differences.some(
      d => d.changeType !== "unchanged",
    );
  }

  private static toClinicalImpact(
    severity: ChangeSeverity,
  ) {
    switch (severity) {
      case "critical":
        return "CRITICAL";

      case "major":
        return "HIGH";

      case "moderate":
        return "MEDIUM";

      default:
        return "LOW";
    }
  }
}
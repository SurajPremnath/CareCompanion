// lib/journey/journeyUtils.ts

import {
  DetectedChange,
  JourneyQuestion,
  TimelineDraftEvent,
} from "./journeyModels";

import { JourneyRule } from "./journeyRules";
import { JourneyChangeType } from "./journeyTypes";

/**
 * ============================================================
 * Journey Utilities
 * ============================================================
 */

export class JourneyUtils {
  /**
   * Creates a random identifier.
   */
  static createId(prefix: string): string {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  /**
   * Returns current ISO timestamp.
   */
  static now(): string {
    return new Date().toISOString();
  }

  /**
   * Sort detected changes by priority.
   */
  static sortChanges(
    changes: DetectedChange[],
    rules: ReadonlyMap<JourneyChangeType, JourneyRule>,
  ): DetectedChange[] {
    return [...changes].sort((a, b) => {
      const aPriority = rules.get(a.type)?.priority ?? 999;
      const bPriority = rules.get(b.type)?.priority ?? 999;

      return aPriority - bPriority;
    });
  }

  /**
   * Remove duplicate questions.
   */
  static uniqueQuestions(
    questions: JourneyQuestion[],
  ): JourneyQuestion[] {
    const map = new Map<string, JourneyQuestion>();

    for (const question of questions) {
      map.set(question.id, question);
    }

    return [...map.values()];
  }

  /**
   * Remove duplicate timeline events.
   */
  static uniqueTimelineEvents(
    events: TimelineDraftEvent[],
  ): TimelineDraftEvent[] {
    const map = new Map<string, TimelineDraftEvent>();

    for (const event of events) {
      map.set(event.id, event);
    }

    return [...map.values()];
  }

  /**
   * Sort timeline chronologically.
   */
  static sortTimeline(
    events: TimelineDraftEvent[],
  ): TimelineDraftEvent[] {
    return [...events].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    );
  }

  /**
   * Returns true if at least one change exists.
   */
  static hasChanges(
    changes: DetectedChange[],
  ): boolean {
    return changes.length > 0;
  }

  /**
   * Find a change by type.
   */
  static findChange(
    changes: DetectedChange[],
    type: JourneyChangeType,
  ): DetectedChange | undefined {
    return changes.find(change => change.type === type);
  }

  /**
   * Groups changes by type.
   */
  static groupChanges(
    changes: DetectedChange[],
  ): Map<JourneyChangeType, DetectedChange[]> {
    const groups = new Map<
      JourneyChangeType,
      DetectedChange[]
    >();

    for (const change of changes) {
      const existing = groups.get(change.type) ?? [];

      existing.push(change);

      groups.set(change.type, existing);
    }

    return groups;
  }

  /**
   * Deep clone.
   */
  static clone<T>(value: T): T {
    return structuredClone(value);
  }

  /**
   * Remove null/undefined values.
   */
  static compact<T>(
    values: Array<T | undefined | null>,
  ): T[] {
    return values.filter(
      (value): value is T =>
        value !== undefined && value !== null,
    );
  }
}
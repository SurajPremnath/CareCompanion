/**
 * ============================================================
 * CAREVR Journey Intelligence Rules
 * ------------------------------------------------------------
 * Declarative rule definitions used by the Journey Engine.
 *
 * No implementation logic.
 * No database access.
 * No side effects.
 * ============================================================
 */

import {
    JourneyConfidence,
    JourneyTransitionType,
    JourneyType,
} from "./journeyTypes";

/* ============================================================
 * Rule Condition
 * ============================================================ */

export interface JourneyRuleCondition {
    field: string;

    operator:
        | "EQUALS"
        | "NOT_EQUALS"
        | "GREATER_THAN"
        | "LESS_THAN"
        | "GREATER_THAN_OR_EQUAL"
        | "LESS_THAN_OR_EQUAL"
        | "EXISTS"
        | "NOT_EXISTS"
        | "IN"
        | "NOT_IN";

    value?: unknown;
}

/* ============================================================
 * Rule
 * ============================================================ */

export interface JourneyRule {

    id: string;

    name: string;

    description: string;

    priority: number;

    conditions: JourneyRuleCondition[];

    journeyType: JourneyType;

    transition: JourneyTransitionType;

    confidence: JourneyConfidence;

    enabled: boolean;
}
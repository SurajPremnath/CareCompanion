// ============================================================
// CAREVR Journey Intelligence Models
// ------------------------------------------------------------
// Core domain models for the Journey Engine.
// Contains ONLY interfaces and type definitions.
// No business logic.
// ============================================================

import {
    ConsultationMode,
    ConsultationSource,
    JourneyConfidence,
    JourneyEventType,
    JourneyLearningStatus,
    JourneyNodeType,
    JourneyTransitionType,
    JourneyType,
    ProviderType,
} from "./journeyTypes";

import { ConsultationType } from "./journeyTypes";

import {
    ConsultationContext,
} from "./journeyAnalysisModels";

/* ============================================================
 * Journey
 * ============================================================ */

export interface Journey {
    id: string;

    patientId: string;

    type: JourneyType;

    confidence: JourneyConfidence;

    startedAt: string;

    updatedAt: string;

    completedAt?: string;

    nodes: JourneyNode[];

    transitions: JourneyTransition[];

    metadata: JourneyMetadata;

    learning?: JourneyLearningRecord;
}

/* ============================================================
 * Journey Node
 * ============================================================ */

export interface JourneyNode {
    id: string;

    type: JourneyNodeType;

    event: JourneyEventType;

    occurredAt: string;

    consultationId?: string;

    provider?: JourneyProvider;

    facility?: JourneyFacility;

    mode?: ConsultationMode;

    source?: ConsultationSource;

    notes?: string;

    metadata?: Record<string, unknown>;
}

/* ============================================================
 * Journey Transition
 * ============================================================ */

export interface JourneyTransition {
    id: string;

    fromNodeId: string;

    toNodeId: string;

    type: JourneyTransitionType;

    confidence: JourneyConfidence;

    reason?: string;
}

/* ============================================================
 * Journey Pattern
 * ============================================================ */

export interface JourneyPattern {
    id: string;

    name: string;

    type: JourneyType;

    confidence: JourneyConfidence;

    nodeSequence: JourneyNodeType[];

    transitionSequence: JourneyTransitionType[];

    description?: string;
}

/* ============================================================
 * Pattern Match Result
 * ============================================================ */

export interface JourneyMatch {
    pattern: JourneyPattern;

    score: number;

    confidence: JourneyConfidence;

    matchedNodes: string[];

    explanation: string;
}

/* ============================================================
 * Learning Record
 * ============================================================ */

export interface JourneyLearningRecord {
    status: JourneyLearningStatus;

    firstSeen: string;

    lastSeen: string;

    occurrenceCount: number;

    confidence: JourneyConfidence;

    verifiedBy?: string;
}

/* ============================================================
 * Provider
 * ============================================================ */

export interface JourneyProvider {
    id?: string;

    name: string;

    type: ProviderType;

    specialty?: string;
}

/* ============================================================
 * Facility
 * ============================================================ */

export interface JourneyFacility {
    id?: string;

    name: string;

    type: JourneyNodeType;

    city?: string;

    state?: string;

    country?: string;
}

/* ============================================================
 * Metadata
 * ============================================================ */

export interface JourneyMetadata {
    specialty?: string;

    diagnosis?: string;

    treatmentPlan?: string;

    tags?: string[];

    attributes?: Record<string, unknown>;
}

/* ============================================================
 * Runtime Context
 * ============================================================ */

export interface JourneyContext {
    patientId: string;

    currentJourney?: Journey;

    currentNode?: JourneyNode;

    activeProvider?: JourneyProvider;

    activeFacility?: JourneyFacility;

consultationContext?: ConsultationType;

consultationSource?: ConsultationSource;

currentConsultationDate?: Date | string;

hasPreviousConsultation?: boolean;

previousConsultationDate?: Date | string;

isEmergency?: boolean;

}
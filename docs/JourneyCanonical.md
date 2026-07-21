# CAREVR Journey Module

## Canonical Architecture

This document defines the single source of truth for every Journey Engine component.

Rule:

There must be ONE canonical implementation of every model, type, engine, repository, mapper and service.

Any duplicate implementation must either:

- import the canonical implementation
- or be archived/deleted.

No exceptions.

Core Models
------------
Canonical:
lib/journey/journeyModels.ts

Purpose:
Persistent aggregate/domain model.

Status:
ACTIVE

----------------------------------

Runtime Context
---------------
Canonical:
lib/journey/models/journeyContext.ts

Purpose:
Runtime execution context used by Journey Engine.

Status:
ACTIVE

### JourneyEngine

Status: VALIDATED

Audit Result:
False Positive

Reason:
The root JourneyEngine is the healthcare workflow orchestrator responsible for Comparison, Treatment, Timeline, Questions, and Clinical Summary.

The engine/journeyEngine implementation is a generic processor execution pipeline responsible only for executing JourneyProcessor instances.

These serve different architectural layers and should both remain.

Decision:
KEEP BOTH.

Future Work:
Review naming consistency to reduce import ambiguity.

### JourneyEngineResult

Status: VALIDATED

Audit Result:
False Positive

Reason:

Two JourneyEngineResult models exist intentionally.

Canonical Runtime Result
------------------------

Location:
lib/journey/engine/engineResult.ts

Purpose:
Represents execution of the generic Journey processor pipeline.

Contains:
- status
- context
- warnings
- errors
- metrics

Canonical Business Result
-------------------------

Location:
lib/journey/JourneyEngine.ts

Purpose:
Represents the completed healthcare Journey.

Contains:
- Comparison
- Treatment
- Timeline
- Questions
- Clinical Summary

Decision:
KEEP BOTH.

These belong to different architectural layers and should never be merged.

### Journey Enums

Status: VALIDATED

Audit Result:
True Duplicate

Canonical Location:
lib/journey/models/journeyEnums.ts

Purpose:
Defines the stable domain enumerations for the Journey subsystem.

Decision:
This file is the canonical source for shared Journey enums.

Findings:

The following enums are duplicated in `lib/journey/journeyTypes.ts`:

- JourneyStatus
- JourneyNodeType
- JourneyEventType
- ConsultationMode
- ConsultationType
- TreatmentStatus

These duplicates must not coexist with the same names.

Action:

- Shared domain enums shall remain only in `models/journeyEnums.ts`.
- `journeyTypes.ts` shall either import the canonical enums or rename enums that represent different concepts (for example, workflow state versus domain lifecycle).

Status:
REFACTOR REQUIRED

### Journey Models

Status: VALIDATED

Audit Result:
False Positive

Canonical Aggregate Models
--------------------------

Location:
lib/journey/models/journeyModels.ts

Purpose:
Defines the persisted Journey aggregate assembled from patient, consultation, prescription, daily care and assessment data.

Contains:
- JourneyModel
- JourneyMetadata
- JourneyStatistics

Canonical Journey Graph Models
------------------------------

Location:
lib/journey/journeyModels.ts

Purpose:
Defines the runtime Journey graph used for analysis and orchestration.

Contains:
- Journey
- JourneyNode
- JourneyTransition
- JourneyPattern
- JourneyMatch
- JourneyLearningRecord
- JourneyProvider
- JourneyFacility
- JourneyMetadata
- JourneyContext

Decision:
KEEP BOTH.

Although both files export `JourneyMetadata`, they describe different architectural concepts (aggregate metadata versus graph metadata) and must not be merged.

Future Work:
Review naming consistency to reduce ambiguity between aggregate and graph metadata.
import type { ConsultationRecord } from "@/lib/medication";

import {
    ResolutionStatus,
    type ComparisonDifference,
    type ComparisonEngineResult,
    type ComparisonMetadata,
    type ComparisonRequest,
    type ComparisonResult,
    type ComparisonSummary
} from "../comparisonTypes";

import { ComparisonValidator } from "../comparisonValidator";
import { ComparisonHelper } from "../utils/ComparisonHelper";

import type { ComparisonProcessor } from "../processors/ComparisonProcessor";

import { PatientComparator } from "../processors/PatientComparator";
import { ConsultationComparator } from "../processors/ConsultationComparator";
import { ComplaintComparator } from "../processors/ComplaintComparator";
import { HistoryComparator } from "../processors/HistoryComparator";
import { MedicationComparator } from "../processors/MedicationComparator";
import { ExaminationComparator } from "../processors/ExaminationComparator";
import { VitalComparator } from "../processors/VitalComparator";
import { InvestigationComparator } from "../processors/InvestigationComparator";
import { DoctorInstructionComparator } from "../processors/DoctorInstructionComparator";
import { AssessmentComparator } from "../processors/AssessmentComparator";
import { FollowUpComparator } from "../processors/FollowUpComparator";

export class ComparisonEngine {

    private static readonly ENGINE_VERSION = "2.0.0";

    private readonly processors: ComparisonProcessor[] = [

        new PatientComparator(),

        new ConsultationComparator(),

        new ComplaintComparator(),

        new HistoryComparator(),

        new MedicationComparator(),

        new ExaminationComparator(),

        new VitalComparator(),

        new InvestigationComparator(),

        new DoctorInstructionComparator(),

        new AssessmentComparator(),

        new FollowUpComparator()

    ];

    compare(
        request: ComparisonRequest
    ): ComparisonEngineResult {

        const started = Date.now();

const validation =
    new ComparisonValidator().validate(request);

        if (!validation.valid) {

            return {

                status: ResolutionStatus.FAILED,

                result: undefined,

                errors: validation.errors

            };

        }

        const differences =
            this.executeProcessors(
                request.previousConsultation,
                request.currentConsultation
            );

        differences.sort(this.sortBySeverity);

        const metadata =
            this.buildMetadata(started);

        const summary =
            this.buildSummary(differences);

        const result: ComparisonResult = {

            differences,

            summary,

            metadata,

            warnings: [],

            errors: []

        };

        return {

            status: ResolutionStatus.SUCCESS,

            result,

            errors: []

        };

    }

    private executeProcessors(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        for (const processor of this.processors) {

            differences.push(
                ...processor.compare(
                    previous,
                    current
                )
            );

        }

        return ComparisonHelper.removeDuplicates(
            differences
        );

    }

    private buildMetadata(
        started: number
    ): ComparisonMetadata {

        return {

            comparedAt: new Date(),

            processingTimeMs:
                Date.now() - started,

            engineVersion:
                ComparisonEngine.ENGINE_VERSION

        };

    }

    private buildSummary(
        differences: ComparisonDifference[]
    ): ComparisonSummary {

        return {

            totalDifferences:
                differences.length,

            added:
                ComparisonHelper.countChangeType(
                    differences,
                    "added"
                ),

            removed:
                ComparisonHelper.countChangeType(
                    differences,
                    "removed"
                ),

            modified:
                ComparisonHelper.countChangeType(
                    differences,
                    "modified"
                ),

            unchanged:
                ComparisonHelper.countChangeType(
                    differences,
                    "unchanged"
                ),

            criticalChanges:
                ComparisonHelper.countSeverity(
                    differences,
                    "critical"
                ),

            majorChanges:
                ComparisonHelper.countSeverity(
                    differences,
                    "major"
                ),

            timelineEvents: [],

            questionsGenerated: [],

            clinicalFlags: []

        };

    }

    private sortBySeverity(
        left: ComparisonDifference,
        right: ComparisonDifference
    ): number {

        const severityOrder = {

            critical: 4,

            major: 3,

            moderate: 2,

            minor: 1,

            informational: 0

        };

        return (
            severityOrder[right.severity] -
            severityOrder[left.severity]
        );

    }

}
import type {
    ComparisonResult
} from "./comparison/comparisonTypes";

import { ComparisonEngine } from "./comparison/comparisonEngine"

import { TreatmentEngine } from "./treatment/TreatmentEngine";

import { TimelineEngine } from "./timeline/TimelineEngine";

import { QuestionEngine } from "./question/QuestionEngine";

import { ClinicalSummaryEngine } from "./clinicalSummary/ClinicalSummaryEngine";

import type {
    TreatmentResult
} from "./treatment/treatmentTypes";

import type {
    TimelineResult
} from "./timeline/timelineTypes";

import type {
    QuestionResult
} from "./question/questionTypes";

import type {
    ClinicalSummary
} from "./clinicalSummary/clinicalSummaryTypes";

export enum JourneyStatus {

    SUCCESS = "success",

    FAILED = "failed"

}

export interface JourneyResult {

    comparison: ComparisonResult;

    treatment: TreatmentResult;

    timeline: TimelineResult;

    questions: QuestionResult;

    clinicalSummary: ClinicalSummary;

}

export interface JourneyEngineResult {

    status: JourneyStatus;

    result?: JourneyResult;

    errors: string[];

}

export class JourneyEngine {

    private readonly comparisonEngine =
        new ComparisonEngine();

    private readonly treatmentEngine =
        new TreatmentEngine();

    private readonly timelineEngine =
        new TimelineEngine();

    private readonly questionEngine =
        new QuestionEngine();

    private readonly clinicalSummaryEngine =
        new ClinicalSummaryEngine();

    build(

        previousConsultation: unknown,

        currentConsultation: unknown

    ): JourneyEngineResult {

        const comparisonResult =

            this.comparisonEngine.compare(

                previousConsultation,

                currentConsultation

            );

        if (

            comparisonResult.status !== "success" ||

            !comparisonResult.result

        ) {

            return {

                status: JourneyStatus.FAILED,

                errors: comparisonResult.errors

            };

        }

        const treatmentResult =

            this.treatmentEngine.resolve(

                comparisonResult.result.differences

            );

        if (

            treatmentResult.status !== "success" ||

            !treatmentResult.result

        ) {

            return {

                status: JourneyStatus.FAILED,

                errors: treatmentResult.errors

            };

        }

        const timelineResult =

            this.timelineEngine.build(

                treatmentResult.result.resolutions

            );

        if (

            timelineResult.status !== "success" ||

            !timelineResult.result

        ) {

            return {

                status: JourneyStatus.FAILED,

                errors: timelineResult.errors

            };

        }

        const questionResult =

            this.questionEngine.generate(

                timelineResult.result.events

            );

        if (

            questionResult.status !== "success" ||

            !questionResult.result

        ) {

            return {

                status: JourneyStatus.FAILED,

                errors: questionResult.errors

            };

        }

        const summaryResult =

            this.clinicalSummaryEngine.generate(

                questionResult.result.questions

            );

        if (

            summaryResult.status !== "success" ||

            !summaryResult.summary

        ) {

            return {

                status: JourneyStatus.FAILED,

                errors: summaryResult.errors

            };

        }

        return {

            status: JourneyStatus.SUCCESS,

            result: {

                comparison:
                    comparisonResult.result,

                treatment:
                    treatmentResult.result,

                timeline:
                    timelineResult.result,

                questions:
                    questionResult.result,

                clinicalSummary:
                    summaryResult.summary

            },

            errors: []

        };

    }

}
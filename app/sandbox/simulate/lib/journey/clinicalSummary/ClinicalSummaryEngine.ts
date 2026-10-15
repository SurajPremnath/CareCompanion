import type {
    ClinicalQuestion
} from "../question/QuestionTypes";

import {
    ClinicalRisk,
    ClinicalSummaryStatus,
    type ClinicalSummary,
    type ClinicalSummaryEngineResult,
    type ClinicalSummaryItem
} from "./clinicalSummaryTypes";

import { ClinicalSummaryValidator } from "./clinicalSummaryValidator";
import { ClinicalSummaryHelper } from "./utils/ClinicalSummaryHelper";

import type {
    ClinicalSummaryProcessor
} from "./processors/ClinicalSummaryProcessor";

import { MedicationClinicalSummaryProcessor } from "./processors/MedicationClinicalSummaryProcessor";
import { DiagnosisClinicalSummaryProcessor } from "./processors/DiagnosisClinicalSummaryProcessor";
import { SymptomClinicalSummaryProcessor } from "./processors/SymptomClinicalSummaryProcessor";
import { VitalClinicalSummaryProcessor } from "./processors/VitalClinicalSummaryProcessor";
import { InvestigationClinicalSummaryProcessor } from "./processors/InvestigationClinicalSummaryProcessor";
import { FollowUpClinicalSummaryProcessor } from "./processors/FollowUpClinicalSummaryProcessor";

export class ClinicalSummaryEngine {

    private readonly processors: ClinicalSummaryProcessor[] = [

        new MedicationClinicalSummaryProcessor(),

        new DiagnosisClinicalSummaryProcessor(),

        new SymptomClinicalSummaryProcessor(),

        new VitalClinicalSummaryProcessor(),

        new InvestigationClinicalSummaryProcessor(),

        new FollowUpClinicalSummaryProcessor()

    ];

generate(

    questions: ClinicalQuestion[]

): ClinicalSummaryEngineResult {

        const validation =
            ClinicalSummaryValidator.validate(
                questions
            );

        if (!validation.valid) {

            return {

                status: ClinicalSummaryStatus.FAILED,

                errors: validation.errors

            };

        }

        const items =
            this.executeProcessors(
                questions
            );

        const summary: ClinicalSummary = {

            items,

            overview:
                ClinicalSummaryHelper.buildOverview(
                    items
                ),

            totalFindings:
                items.length,

            criticalFindings:
                ClinicalSummaryHelper.count(
                    items,
                    ClinicalRisk.CRITICAL
                )

        };

        return {

            status: ClinicalSummaryStatus.SUCCESS,

            summary,

            errors: []

        };

    }

private executeProcessors(

    questions: ClinicalQuestion[]

): ClinicalSummaryItem[] {

        const items: ClinicalSummaryItem[] = [];

        for (const processor of this.processors) {

            items.push(

                ...processor.process(
                    questions
                )

            );

        }

        return ClinicalSummaryHelper.sort(

            ClinicalSummaryHelper.unique(
                items
            )

        );

    }

}
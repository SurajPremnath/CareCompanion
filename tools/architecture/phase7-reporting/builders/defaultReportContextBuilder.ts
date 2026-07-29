import { ReportContext } from "../models";

import { AnalysisResult } from "../../phase6-analysis";
import { ValidationResult } from "../../phase9-validation";

export class DefaultReportContextBuilder {

    public build(

        analysis: AnalysisResult,

        validation: ValidationResult,

        outputDirectory: string

    ): ReportContext {

return {

    model: analysis.knowledge,

    knowledge: analysis.knowledge,

    validation,

    findings: analysis.findings,

    recommendations: analysis.recommendations,

    outputDirectory

};

    }

}
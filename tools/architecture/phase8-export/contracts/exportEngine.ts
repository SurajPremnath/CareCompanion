import { ExportResult } from "../models";

import {
    AnalysisResult
} from "../../phase6-analysis";

export interface ExportEngine {

    export(
        analysis: AnalysisResult,
        outputDirectory: string
    ): Promise<ExportResult>;

}
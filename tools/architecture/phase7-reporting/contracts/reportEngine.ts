import { ReportContext } from "../models";

export interface ReportEngine {

    generate(
        context: ReportContext
    ): Promise<void>;

}
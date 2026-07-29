import { ReportContext } from "../models";

export interface ReportGenerator {

    generate(
        context: ReportContext
    ): Promise<void>;

}
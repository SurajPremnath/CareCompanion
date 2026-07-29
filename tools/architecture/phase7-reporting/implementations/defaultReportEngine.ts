import { ReportEngine } from "../contracts/reportEngine";
import { ReportGenerator } from "../contracts/reportGenerator";
import { ReportContext } from "../models";

export class DefaultReportEngine
    implements ReportEngine {

    public constructor(

        private readonly generators: ReportGenerator[]

    ) {}

    public async generate(
        context: ReportContext
    ): Promise<void> {

        for (const generator of this.generators) {

            await generator.generate(context);

        }

    }

}
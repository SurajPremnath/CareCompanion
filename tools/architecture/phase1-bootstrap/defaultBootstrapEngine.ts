import { BootstrapEngine } from "./bootstrapEngine";
import {
    AnalyzerConfiguration,
    analyzerConfiguration
} from "./config";
import { Bootstrapper } from "./bootstrap";

export class DefaultBootstrapEngine
    implements BootstrapEngine {

    public async bootstrap(
        configuration: AnalyzerConfiguration
    ): Promise<void> {

        const bootstrapper =
            new Bootstrapper(configuration);

        await bootstrapper.bootstrap();

    }

}
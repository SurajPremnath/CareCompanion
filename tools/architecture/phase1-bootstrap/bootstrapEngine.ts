import { AnalyzerConfiguration } from "./config";

export interface BootstrapEngine {

    bootstrap(
        configuration: AnalyzerConfiguration
    ): Promise<void>;

}
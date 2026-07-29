import { AnalyzerConfiguration } from "../phase1-bootstrap";

import { DiscoveryEngine } from "./discoveryEngine";
import {
    DiscoveredProject,
    ProjectScanner
} from "./projectScanner";

export class DefaultDiscoveryEngine
    implements DiscoveryEngine {

    public async discover(
        configuration: AnalyzerConfiguration
    ): Promise<DiscoveredProject> {

        const scanner =
            new ProjectScanner(configuration);

        return scanner.scan();

    }

}
import { AnalyzerConfiguration } from "../phase1-bootstrap";
import { DiscoveredProject } from "./projectScanner";

export interface DiscoveryEngine {

    discover(
        configuration: AnalyzerConfiguration
    ): Promise<DiscoveredProject>;

}
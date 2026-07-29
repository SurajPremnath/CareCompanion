import { DiscoveredFile } from "../phase2-discovery";
import { ParserArtifacts } from "./models";

export interface ParserEngine {

    parse(
        files: readonly DiscoveredFile[]
    ): Promise<ParserArtifacts>;

}
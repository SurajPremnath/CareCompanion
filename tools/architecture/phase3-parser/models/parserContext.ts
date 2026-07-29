import { Project } from "ts-morph";

import {
    DiscoveredProject
} from "../../phase2-discovery";

export interface ParserProject {

    readonly project: Project;

}

export interface ParserContext {

    readonly project: ParserProject;

    readonly discovery: DiscoveredProject;

}
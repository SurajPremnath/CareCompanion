import { ArchitecturePipeline } from "./architecturePipeline";
import { ArchitectureContext } from "./architectureContext";

import { BootstrapEngine } from "../../phase1-bootstrap";
import { DiscoveryEngine } from "../../phase2-discovery";
import { ParserEngine } from "../../phase3-parser";
import { SemanticBuilder } from "../../phase4-semantic";
import {
    GraphAnalyzer,
    GraphBuilder
} from "../../phase5-graph";
import { AnalysisEngine } from "../../phase6-analysis";
import {
    DefaultReportContextBuilder,
    ReportEngine
} from "../../phase7-reporting";
import { ExportEngine } from "../../phase8-export";
import { ValidationEngine } from "../../phase9-validation";

export class DefaultArchitecturePipeline
    implements ArchitecturePipeline {

    constructor(
        private readonly bootstrap: BootstrapEngine,
        private readonly discovery: DiscoveryEngine,
        private readonly parser: ParserEngine,
        private readonly semantic: SemanticBuilder,
        private readonly graphBuilder: GraphBuilder,
        private readonly graphAnalyzer: GraphAnalyzer,
        private readonly analysis: AnalysisEngine,
        private readonly validation: ValidationEngine,
        private readonly reportContextBuilder: DefaultReportContextBuilder,
        private readonly reporting: ReportEngine,
        private readonly exporter: ExportEngine
    ) {}

    public async execute(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("────────────────────────────────────────");
        console.log(" CareVR Architecture Engine");
        console.log("────────────────────────────────────────");

        await this.runBootstrap(context);
        await this.runDiscovery(context);
        await this.runParser(context);
        await this.runSemantic(context);
        await this.runGraph(context);
        await this.runAnalysis(context);
        await this.runValidation(context);
        await this.runReporting(context);
        await this.runExport(context);

        console.log("────────────────────────────────────────");
        console.log(" Architecture generation completed");
        console.log("────────────────────────────────────────");
    }

    private async runBootstrap(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Bootstrap...");

        await this.bootstrap.bootstrap(
            context.configuration
        );
    }

    private async runDiscovery(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Discovery...");

        const project =
            await this.discovery.discover(
                context.configuration
            );

        context.files = project.files;
        context.modules = project.modules;
    }

    private async runParser(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Parser...");

        context.parserArtifacts =
            await this.parser.parse(
                context.files ?? []
            );
    }

    private async runSemantic(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Semantic...");

        context.semanticProject =
            this.semantic.build(
                context.parserArtifacts!
            );
    }

private async runGraph(
    context: ArchitectureContext
): Promise<void> {

    console.log("Graph...");

    const knowledgeModel = {

        project: {

            files: context.semanticProject!.symbols.map(symbol => ({

                path: symbol.file,

                module: symbol.module,

                type: symbol.kind

            })),

            dependencies: context.semanticProject!.dependencies

        }

    };

    const dependencyGraph =
        this.graphBuilder.build(
            knowledgeModel as any
        );

    context.graph =
        this.graphAnalyzer.analyze(
            dependencyGraph
        );

}

    private async runAnalysis(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Analysis...");

        context.analysis =
            this.analysis.analyze(
                context.graph!
            );
    }

    private async runValidation(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Validation...");

        context.validation =
            this.validation.validate(
                context.analysis!.knowledge
            );
    }

    private async runReporting(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Reporting...");

        const reportContext =
            this.reportContextBuilder.build(
                context.analysis!,
                context.validation!,
                context.configuration.outputDirectory
            );

        await this.reporting.generate(
            reportContext
        );
    }

    private async runExport(
        context: ArchitectureContext
    ): Promise<void> {

        console.log("Export...");

        context.exportResult =
            await this.exporter.export(
                context.analysis!,
                context.configuration.outputDirectory
            );
    }
}
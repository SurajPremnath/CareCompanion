import {
    DefaultArchitectureEngine,
    DefaultArchitecturePipeline
} from "./core";

/* -------------------------------------------------------------------------- */
/* Phase 1 - Bootstrap                                                        */
/* -------------------------------------------------------------------------- */

import {
    DefaultBootstrapEngine
} from "./phase1-bootstrap";

/* -------------------------------------------------------------------------- */
/* Phase 2 - Discovery                                                        */
/* -------------------------------------------------------------------------- */

import {
    DefaultDiscoveryEngine
} from "./phase2-discovery";

/* -------------------------------------------------------------------------- */
/* Phase 3 - Parser                                                           */
/* -------------------------------------------------------------------------- */

import {
    DefaultParserEngine
} from "./phase3-parser";

/* -------------------------------------------------------------------------- */
/* Phase 4 - Semantic                                                         */
/* -------------------------------------------------------------------------- */

import {
    ArchitectureClassifier,
    DefaultDependencyResolver,
    DefaultModuleResolver,
    DefaultSemanticBuilder,
    DefaultSymbolResolver
} from "./phase4-semantic";

/* -------------------------------------------------------------------------- */
/* Phase 5 - Graph                                                            */
/* -------------------------------------------------------------------------- */

import {
    CircularDependencyRule,
    DefaultGraphAnalyzer,
    DefaultGraphBuilder,
    DuplicateDependencyRule,
    GraphRuleEngine,
    LayerViolationRule,
    OrphanNodeRule
} from "./phase5-graph";

/* -------------------------------------------------------------------------- */
/* Phase 6 - Analysis                                                         */
/* -------------------------------------------------------------------------- */

import {
    DefaultAnalysisEngine
} from "./phase6-analysis";

/* -------------------------------------------------------------------------- */
/* Phase 7 - Reporting                                                        */
/* -------------------------------------------------------------------------- */

import {
    DefaultReportContextBuilder,
    DefaultReportEngine,
    EngineeringKnowledgePackGenerator,
    MarkdownWriter,
    MermaidGenerator,
    ProjectOverviewGenerator,
    ReportBuilder,
    TechnicalCharterGenerator,
    ValidationReportGenerator
} from "./phase7-reporting";

/* -------------------------------------------------------------------------- */
/* Phase 8 - Export                                                           */
/* -------------------------------------------------------------------------- */

import {
    DefaultExportEngine,
    ExportArtifactBuilder
} from "./phase8-export";

/* -------------------------------------------------------------------------- */
/* Phase 9 - Validation                                                       */
/* -------------------------------------------------------------------------- */

import {
    DefaultValidationEngine,
    ValidationRuleEngine
} from "./phase9-validation";

export function createArchitectureContainer() {

/* -------------------------------------------------------------------------- */
/* Phase 4 - Semantic                                                         */
/* -------------------------------------------------------------------------- */

const classifier =
    new ArchitectureClassifier();

const symbolResolver =
    new DefaultSymbolResolver(
        classifier
    );

const dependencyResolver =
    new DefaultDependencyResolver();

const moduleResolver =
    new DefaultModuleResolver();

const semanticBuilder =
    new DefaultSemanticBuilder(

        symbolResolver,

        dependencyResolver,

        moduleResolver

    );

    /* ---------------------------------------------------------------------- */
    /* Graph                                                                  */
    /* ---------------------------------------------------------------------- */

    const graphRules =
        new GraphRuleEngine([

            new OrphanNodeRule(),

            new DuplicateDependencyRule(),

            new CircularDependencyRule(),

            new LayerViolationRule()

        ]);

    /* ---------------------------------------------------------------------- */
    /* Validation                                                             */
    /* ---------------------------------------------------------------------- */

    const validationRules =
        new ValidationRuleEngine([]);

    /* ---------------------------------------------------------------------- */
    /* Reporting                                                              */
    /* ---------------------------------------------------------------------- */

    const reportBuilder =
        new ReportBuilder();

    const markdown =
        new MarkdownWriter();

    const reportEngine =
        new DefaultReportEngine([

            new ProjectOverviewGenerator(
                reportBuilder,
                markdown
            ),

            new EngineeringKnowledgePackGenerator(
                reportBuilder,
                markdown
            ),

            new TechnicalCharterGenerator(
                reportBuilder,
                markdown
            ),

            new ValidationReportGenerator(
                reportBuilder,
                markdown
            ),

            new MermaidGenerator()

        ]);

    /* ---------------------------------------------------------------------- */
    /* Pipeline                                                               */
    /* ---------------------------------------------------------------------- */

    const pipeline =
        new DefaultArchitecturePipeline(

            new DefaultBootstrapEngine(),

            new DefaultDiscoveryEngine(),

            new DefaultParserEngine(),

            semanticBuilder,

            new DefaultGraphBuilder(),

            new DefaultGraphAnalyzer(
                graphRules
            ),

            new DefaultAnalysisEngine(),

            new DefaultValidationEngine(
                validationRules
            ),

            new DefaultReportContextBuilder(),

            reportEngine,

            new DefaultExportEngine(
                new ExportArtifactBuilder()
            )

        );

    /* ---------------------------------------------------------------------- */
    /* Engine                                                                 */
    /* ---------------------------------------------------------------------- */

    return {

        engine:
            new DefaultArchitectureEngine(
                pipeline
            )

    };

}
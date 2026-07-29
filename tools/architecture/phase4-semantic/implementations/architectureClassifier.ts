export class ArchitectureClassifier {

    public classify(
        filePath: string,
        symbolName: string
    ): string {

        const path = filePath.toLowerCase();

        if (path.includes("/repository")) return "Repository";
        if (path.includes("/service")) return "Service";
        if (path.includes("/controller")) return "Controller";
        if (path.includes("/storage")) return "Storage";
        if (path.includes("/mapper")) return "Mapper";
        if (path.includes("/hook")) return "Hook";
        if (path.includes("/component")) return "Component";
        if (path.includes("/page")) return "Page";
        if (path.includes("/api")) return "Api";
        if (path.includes("/engine")) return "Engine";

        if (/^use[A-Z]/.test(symbolName))
            return "Hook";

        return "Class";

    }

}
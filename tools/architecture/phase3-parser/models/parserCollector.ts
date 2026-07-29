import {
    ClassDeclaration,
    FunctionDeclaration,
    InterfaceDeclaration,
    EnumDeclaration,
    TypeAliasDeclaration,
    VariableDeclaration,
    SourceFile
} from "ts-morph";

import { ParserArtifacts } from "./parserResult";

export class ParserCollector {

    private readonly sourceFiles: SourceFile[] = [];

    private readonly classes: ClassDeclaration[] = [];

    private readonly interfaces: InterfaceDeclaration[] = [];

    private readonly functions: FunctionDeclaration[] = [];

    private readonly enums: EnumDeclaration[] = [];

    private readonly typeAliases: TypeAliasDeclaration[] = [];

    private readonly variables: VariableDeclaration[] = [];

    private nodeCount = 0;

    public addSourceFile(sourceFile: SourceFile): void {
        this.sourceFiles.push(sourceFile);
    }

    public incrementNodeCount(): void {
        this.nodeCount++;
    }

    public getNodeCount(): number {
        return this.nodeCount;
    }

    public addClass(node: ClassDeclaration): void {
        this.classes.push(node);
    }

    public addInterface(node: InterfaceDeclaration): void {
        this.interfaces.push(node);
    }

    public addFunction(node: FunctionDeclaration): void {
        this.functions.push(node);
    }

    public addEnum(node: EnumDeclaration): void {
        this.enums.push(node);
    }

    public addTypeAlias(node: TypeAliasDeclaration): void {
        this.typeAliases.push(node);
    }

    public addVariable(node: VariableDeclaration): void {
        this.variables.push(node);
    }

    public buildArtifacts(): ParserArtifacts {

        return {

    sourceFiles: [...this.sourceFiles],

    classes: [...this.classes],

    interfaces: [...this.interfaces],

    functions: [...this.functions],

    enums: [...this.enums],

    typeAliases: [...this.typeAliases],

    variables: [...this.variables]

};

    }

}
const ts = require("typescript");
const path = require("path");

class TypeScriptParser {

    constructor(filePath, sourceText) {

        this.filePath = filePath;

        this.sourceText = sourceText;

const extension = path.extname(filePath).toLowerCase();

const scriptKind =
    extension === ".tsx"
        ? ts.ScriptKind.TSX
        : extension === ".jsx"
            ? ts.ScriptKind.JSX
            : extension === ".js"
                ? ts.ScriptKind.JS
                : ts.ScriptKind.TS;

this.sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
);

    }

    /**
     * ============================================================
     * Helpers
     * ============================================================
     */

getNodeName(node) {

    if (!node) {
        return null;
    }

    if (!("name" in node) || !node.name) {
        return null;
    }

    try {

        if (ts.isIdentifier(node.name)) {
            return node.name.text;
        }

        return node.name.getText(this.sourceFile);

    } catch {

        return null;

    }

}

    getText(node) {

        if (!node)
            return null;

        return node.getText(this.sourceFile);

    }

    getLocation(node) {

        const position =
            this.sourceFile.getLineAndCharacterOfPosition(
                node.getStart(this.sourceFile)
            );

        return {

            line: position.line + 1,

            column: position.character + 1

        };

    }

    getModifiers(node) {

        return ts.canHaveModifiers(node)
            ? ts.getModifiers(node) || []
            : [];

    }

    hasModifier(node, kind) {

        return this.getModifiers(node).some(

            modifier => modifier.kind === kind

        );

    }

    isExported(node) {

        return this.hasModifier(

            node,

            ts.SyntaxKind.ExportKeyword

        );

    }

    isDefaultExport(node) {

        return this.hasModifier(

            node,

            ts.SyntaxKind.DefaultKeyword

        );

    }

    isAsync(node) {

        return this.hasModifier(

            node,

            ts.SyntaxKind.AsyncKeyword

        );

    }

    isAbstract(node) {

        return this.hasModifier(

            node,

            ts.SyntaxKind.AbstractKeyword

        );

    }

    isStatic(node) {

        return this.hasModifier(

            node,

            ts.SyntaxKind.StaticKeyword

        );

    }

    isReadonly(node) {

        return this.hasModifier(

            node,

            ts.SyntaxKind.ReadonlyKeyword

        );

    }

    isGeneric(node) {

        return !!(

            node.typeParameters &&
            node.typeParameters.length

        );

    }

    getDecorators(node) {

        if (!ts.canHaveDecorators(node))
            return [];

        const decorators =
            ts.getDecorators(node) || [];

        return decorators.map(decorator =>
            decorator.expression.getText(
                this.sourceFile
            )
        );

    }

    getHeritage(node, token) {

        if (!node.heritageClauses)
            return [];

        return node.heritageClauses
            .filter(clause => clause.token === token)
            .flatMap(clause =>
                clause.types.map(type =>
                    type.expression.getText(
                        this.sourceFile
                    )
                )
            );

    }

    getJsDoc(node) {

        const docs =
            ts.getJSDocCommentsAndTags(node);

        if (!docs.length)
            return null;

        return docs
            .map(doc => doc.getText(this.sourceFile))
            .join("\n");

    }

    createMetadata(node) {

        return {

            exported:
                this.isExported(node),

            defaultExport:
                this.isDefaultExport(node),

            async:
                this.isAsync(node),

            abstract:
                this.isAbstract(node),

            static:
                this.isStatic(node),

            readonly:
                this.isReadonly(node),

            generic:
                this.isGeneric(node),

            extends:
                this.getHeritage(
                    node,
                    ts.SyntaxKind.ExtendsKeyword
                ),

            implements:
                this.getHeritage(
                    node,
                    ts.SyntaxKind.ImplementsKeyword
                ),

            decorators:
                this.getDecorators(node),

            jsDoc:
                this.getJsDoc(node),

            location:
                this.getLocation(node)

        };

    }
    /**
     * ============================================================
     * Function Parsing
     * ============================================================
     */

    parseFunction(node) {

        return {

            name:
                this.getNodeName(node),

            kind: "function",

            parameters:
                this.getParameters(node),

            returnType:
                this.getReturnType(node),

            ...this.createMetadata(node)

        };

    }

    parseMethod(node) {

        return {

            name:
                this.getNodeName(node),

            kind: "method",

            parameters:
                this.getParameters(node),

            returnType:
                this.getReturnType(node),

            ...this.createMetadata(node)

        };

    }

    parseArrowFunction(variableNode, arrowFunction) {

        return {

            name:
                this.getNodeName(variableNode),

            kind: "arrowFunction",

            parameters:
                this.getParameters(arrowFunction),

            returnType:
                this.getReturnType(arrowFunction),

            ...this.createMetadata(variableNode)

        };

    }

    parseFunctionExpression(variableNode, expression) {

        return {

            name:
                this.getNodeName(variableNode),

            kind: "functionExpression",

            parameters:
                this.getParameters(expression),

            returnType:
                this.getReturnType(expression),

            ...this.createMetadata(variableNode)

        };

    }

    /**
     * ============================================================
     * Parameters
     * ============================================================
     */

    getParameters(node) {

        if (!node.parameters)
            return [];

        return node.parameters.map(parameter => ({

            name:
                parameter.name.getText(this.sourceFile),

            type:
                parameter.type
                    ? parameter.type.getText(this.sourceFile)
                    : "any",

            optional:
                !!parameter.questionToken,

            rest:
                !!parameter.dotDotDotToken,

            initializer:
                !!parameter.initializer

        }));

    }

    /**
     * ============================================================
     * Return Type
     * ============================================================
     */

    getReturnType(node) {

        if (node.type)
            return node.type.getText(this.sourceFile);

        return null;

    }

    /**
     * ============================================================
     * Function Discovery
     * ============================================================
     */

    parseFunctions() {

        const functions = [];

        const visit = node => {

            if (ts.isFunctionDeclaration(node)) {

                functions.push(

                    this.parseFunction(node)

                );

            }

            if (ts.isMethodDeclaration(node)) {

                functions.push(

                    this.parseMethod(node)

                );

            }

            if (ts.isVariableStatement(node)) {

                for (const declaration of node.declarationList.declarations) {

                    if (!declaration.initializer)
                        continue;

                    if (ts.isArrowFunction(declaration.initializer)) {

                        functions.push(

                            this.parseArrowFunction(

                                declaration,

                                declaration.initializer

                            )

                        );

                    }

                    if (ts.isFunctionExpression(declaration.initializer)) {

                        functions.push(

                            this.parseFunctionExpression(

                                declaration,

                                declaration.initializer

                            )

                        );

                    }

                }

            }

            ts.forEachChild(node, visit);

        };

        visit(this.sourceFile);

        return functions;

    }
    /**
     * ============================================================
     * Class Parsing
     * ============================================================
     */

    parseClass(node) {

        return {

            name:
                this.getNodeName(node),

            kind: "class",

            constructors:
                this.getConstructors(node),

            properties:
                this.getProperties(node),

            methods:
                this.getMethods(node),

            ...this.createMetadata(node)

        };

    }

    /**
     * ============================================================
     * Constructors
     * ============================================================
     */

    getConstructors(classNode) {

        return classNode.members

            .filter(member =>
                ts.isConstructorDeclaration(member)
            )

            .map(constructor => ({

                parameters:
                    this.getParameters(constructor),

                location:
                    this.getLocation(constructor)

            }));

    }

    /**
     * ============================================================
     * Properties
     * ============================================================
     */

    getProperties(classNode) {

        return classNode.members

            .filter(member =>
                ts.isPropertyDeclaration(member)
            )

            .map(property => ({

                name:
                    this.getNodeName(property),

                type:
                    property.type
                        ? property.type.getText(this.sourceFile)
                        : "any",

                initializer:
                    property.initializer
                        ? property.initializer.getText(this.sourceFile)
                        : null,

                ...this.createMetadata(property)

            }));

    }

    /**
     * ============================================================
     * Methods
     * ============================================================
     */

    getMethods(classNode) {

        return classNode.members

            .filter(member =>
                ts.isMethodDeclaration(member)
            )

            .map(method =>

                this.parseMethod(method)

            );

    }

    /**
     * ============================================================
     * Class Discovery
     * ============================================================
     */

    parseClasses() {

        const classes = [];

        const visit = node => {

            if (ts.isClassDeclaration(node)) {

                classes.push(

                    this.parseClass(node)

                );

            }

            ts.forEachChild(node, visit);

        };

        visit(this.sourceFile);

        return classes;

    }

    /**
     * ============================================================
     * Class Statistics
     * ============================================================
     */

    getClassStatistics(classes) {

        return {

            totalClasses:
                classes.length,

            abstractClasses:
                classes.filter(c => c.abstract).length,

            genericClasses:
                classes.filter(c => c.generic).length,

            exportedClasses:
                classes.filter(c => c.exported).length,

            decoratedClasses:
                classes.filter(c =>
                    c.decorators.length > 0
                ).length

        };

    }
    /**
     * ============================================================
     * Interface Parsing
     * ============================================================
     */

    parseInterface(node) {

        return {

            name:
                this.getNodeName(node),

            kind: "interface",

            properties:
                this.getInterfaceProperties(node),

            methods:
                this.getInterfaceMethods(node),

            ...this.createMetadata(node)

        };

    }

    getInterfaceProperties(node) {

        return node.members

            .filter(member =>
                ts.isPropertySignature(member)
            )

            .map(property => ({

                name:
                    property.name.getText(this.sourceFile),

                type:
                    property.type
                        ? property.type.getText(this.sourceFile)
                        : "any",

                optional:
                    !!property.questionToken

            }));

    }

    getInterfaceMethods(node) {

        return node.members

            .filter(member =>
                ts.isMethodSignature(member)
            )

            .map(method => ({

                name:
                    method.name.getText(this.sourceFile),

                parameters:
                    this.getParameters(method),

                returnType:
                    this.getReturnType(method),

                generic:
                    this.isGeneric(method)

            }));

    }

    /**
     * ============================================================
     * Type Alias Parsing
     * ============================================================
     */

    parseTypeAlias(node) {

        return {

            name:
                this.getNodeName(node),

            kind: "type",

            definition:
                node.type
                    ? node.type.getText(this.sourceFile)
                    : null,

            ...this.createMetadata(node)

        };

    }

    /**
     * ============================================================
     * Enum Parsing
     * ============================================================
     */

    parseEnum(node) {

        return {

            name:
                this.getNodeName(node),

            kind: "enum",

            members:
                node.members.map(member => ({

                    name:
                        member.name.getText(this.sourceFile),

                    value:
                        member.initializer
                            ? member.initializer.getText(this.sourceFile)
                            : null

                })),

            ...this.createMetadata(node)

        };

    }

    /**
     * ============================================================
     * Discovery
     * ============================================================
     */

    parseInterfaces() {

        const interfaces = [];

        const visit = node => {

            if (ts.isInterfaceDeclaration(node)) {

                interfaces.push(

                    this.parseInterface(node)

                );

            }

            ts.forEachChild(node, visit);

        };

        visit(this.sourceFile);

        return interfaces;

    }

    parseTypes() {

        const types = [];

        const visit = node => {

            if (ts.isTypeAliasDeclaration(node)) {

                types.push(

                    this.parseTypeAlias(node)

                );

            }

            ts.forEachChild(node, visit);

        };

        visit(this.sourceFile);

        return types;

    }

    parseEnums() {

        const enums = [];

        const visit = node => {

            if (ts.isEnumDeclaration(node)) {

                enums.push(

                    this.parseEnum(node)

                );

            }

            ts.forEachChild(node, visit);

        };

        visit(this.sourceFile);

        return enums;

    }

    /**
     * ============================================================
     * Statistics
     * ============================================================
     */

    getTypeStatistics(

        interfaces,

        types,

        enums

    ) {

        return {

            interfaces:
                interfaces.length,

            exportedInterfaces:
                interfaces.filter(i => i.exported).length,

            genericInterfaces:
                interfaces.filter(i => i.generic).length,

            types:
                types.length,

            exportedTypes:
                types.filter(t => t.exported).length,

            enums:
                enums.length,

            exportedEnums:
                enums.filter(e => e.exported).length

        };

    }
    /**
     * ============================================================
     * Variable Parsing
     * ============================================================
     */

    parseVariables() {

        const variables = [];

        const visit = node => {

            if (ts.isVariableStatement(node)) {

                const statementMetadata =
                    this.createMetadata(node);

                for (const declaration of node.declarationList.declarations) {

                    variables.push({

                        name:
                            this.getNodeName(declaration),

                        kind: "variable",

                        type:
                            declaration.type
                                ? declaration.type.getText(this.sourceFile)
                                : null,

                        initializer:
                            declaration.initializer
                                ? declaration.initializer.kind
                                : null,

                        constant:
                            (node.declarationList.flags &
                                ts.NodeFlags.Const) !== 0,

                        ...statementMetadata,

                        location:
                            this.getLocation(declaration)

                    });

                }

            }

            ts.forEachChild(node, visit);

        };

        visit(this.sourceFile);

        return variables;

    }

    /**
     * ============================================================
     * Import Parsing
     * ============================================================
     */

    parseImports() {

        const imports = [];

        this.sourceFile.statements.forEach(statement => {

            if (!ts.isImportDeclaration(statement))
                return;

const clause = statement.importClause;
const namedBindings = clause?.namedBindings ?? null;

imports.push({

    module: statement.moduleSpecifier.text,

    defaultImport:
        clause?.name?.text ?? null,

    namespaceImport:
        namedBindings &&
        ts.isNamespaceImport(namedBindings)
            ? namedBindings.name.text
            : null,

    namedImports:
        namedBindings &&
        ts.isNamedImports(namedBindings)
            ? namedBindings.elements.map(element => ({

                name: element.name.text,

                alias: element.propertyName?.text ?? null

            }))
            : [],

    typeOnly:
        !!clause?.isTypeOnly,

    location:
        this.getLocation(statement)

});

        });

        return imports;

    }

    /**
     * ============================================================
     * Export Parsing
     * ============================================================
     */

parseExports() {

    const exports = [];

    this.sourceFile.statements.forEach(statement => {

        if (!ts.isExportDeclaration(statement))
            return;

        const exportClause = statement.exportClause ?? null;

        exports.push({

            module:
                statement.moduleSpecifier
                    ? statement.moduleSpecifier.text
                    : null,

            exportAll:
                !exportClause,

            namedExports:
                exportClause &&
                ts.isNamedExports(exportClause)
                    ? exportClause.elements.map(element => ({

                        name: element.name.text,

                        alias:
                            element.propertyName?.text ?? null

                    }))
                    : [],

            typeOnly:
                !!statement.isTypeOnly,

            location:
                this.getLocation(statement)

        });

    });

    return exports;

}

    /**
     * ============================================================
     * Re-Export Parsing
     * ============================================================
     */

    parseReExports() {

        return this.parseExports()

            .filter(item => item.module !== null);

    }

    /**
     * ============================================================
     * Barrel Detection
     * ============================================================
     */

    isBarrelFile() {

        const statements =
            this.sourceFile.statements;

        if (!statements.length)
            return false;

        return statements.every(statement =>

            ts.isExportDeclaration(statement)

        );

    }

    /**
     * ============================================================
     * Import Statistics
     * ============================================================
     */

    getImportStatistics(imports) {

        return {

            totalImports:
                imports.length,

            typeOnlyImports:
                imports.filter(i => i.typeOnly).length,

            namespaceImports:
                imports.filter(i => i.namespaceImport).length,

            defaultImports:
                imports.filter(i => i.defaultImport).length,

            namedImports:
                imports.reduce(

                    (count, item) =>

                        count + item.namedImports.length,

                    0

                )

        };

    }

    /**
     * ============================================================
     * Export Statistics
     * ============================================================
     */

    getExportStatistics(exports) {

        return {

            totalExports:
                exports.length,

            exportAll:
                exports.filter(e => e.exportAll).length,

            namedExports:
                exports.reduce(

                    (count, item) =>

                        count + item.namedExports.length,

                    0

                ),

            reExports:
                exports.filter(e => e.module).length

        };

    }
    /**
     * ============================================================
     * Main Parse
     * ============================================================
     */

    parse() {

        const imports =
            this.parseImports();

        const exports =
            this.parseExports();

        const reExports =
            this.parseReExports();

        const variables =
            this.parseVariables();

        const functions =
            this.parseFunctions();

        const classes =
            this.parseClasses();

        const interfaces =
            this.parseInterfaces();

        const types =
            this.parseTypes();

        const enums =
            this.parseEnums();

        return {

            file: this.filePath,

            fileName:
                path.basename(this.filePath),

            directory:
                path.dirname(this.filePath),

            isBarrel:
                this.isBarrelFile(),

            imports,

            exports,

            reExports,

            variables,

            functions,

            classes,

            interfaces,

            types,

            enums,

            statistics: {

                imports:
                    this.getImportStatistics(imports),

                exports:
                    this.getExportStatistics(exports),

                classes:
                    this.getClassStatistics(classes),

                types:
                    this.getTypeStatistics(

                        interfaces,

                        types,

                        enums

                    ),

                totals: {

                    variables:
                        variables.length,

                    functions:
                        functions.length,

                    classes:
                        classes.length,

                    interfaces:
                        interfaces.length,

                    types:
                        types.length,

                    enums:
                        enums.length

                }

            }

        };

    }

}

/**
 * ============================================================
 * Factory
 * ============================================================
 */

function parseTypeScriptFile(

    filePath,

    sourceText

) {

    const parser = new TypeScriptParser(

        filePath,

        sourceText

    );

    return parser.parse();

}

/**
 * ============================================================
 * Backward Compatibility
 * ============================================================
 */

function parseFile(

    filePath,

    sourceText

) {

    return parseTypeScriptFile(

        filePath,

        sourceText

    );

}

module.exports = {

    TypeScriptParser,

    parseTypeScriptFile,

    parseFile

};
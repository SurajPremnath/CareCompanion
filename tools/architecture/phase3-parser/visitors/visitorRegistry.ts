import { Visitor } from "../contracts";

import { FileVisitor } from "./fileVisitor";
import { ImportVisitor } from "./importVisitor";
import { ExportVisitor } from "./exportVisitor";
import { ClassVisitor } from "./classVisitor";
import { InterfaceVisitor } from "./interfaceVisitor";
import { FunctionVisitor } from "./functionVisitor";
import { VariableVisitor } from "./variableVisitor";
import { EnumVisitor } from "./enumVisitor";
import { TypeAliasVisitor } from "./typeAliasVisitor";
import { CallExpressionVisitor } from "./callExpressionVisitor";
import { ObjectCreationVisitor } from "./objectCreationVisitor";
import { JsxVisitor } from "./jsxVisitor";
import { ReactHookVisitor } from "./reactHookVisitor";

export class VisitorRegistry {

    private readonly visitors: readonly Visitor[];

    constructor(
        visitors?: readonly Visitor[]
    ) {

        this.visitors =

            visitors

            ??

            VisitorRegistry.createDefaultVisitors();

    }

    public getVisitors():
        readonly Visitor[] {

        return this.visitors;

    }

    public register(
        visitor: Visitor
    ): VisitorRegistry {

        return new VisitorRegistry([

            ...this.visitors,

            visitor

        ]);

    }

    public registerMany(
        visitors: readonly Visitor[]
    ): VisitorRegistry {

        return new VisitorRegistry([

            ...this.visitors,

            ...visitors

        ]);

    }

    private static createDefaultVisitors():
        readonly Visitor[] {

        return [

            new FileVisitor(),

            new ImportVisitor(),

            new ExportVisitor(),

            new ClassVisitor(),

            new InterfaceVisitor(),

            new FunctionVisitor(),

            new VariableVisitor(),

            new EnumVisitor(),

            new TypeAliasVisitor(),

            new CallExpressionVisitor(),

            new ObjectCreationVisitor(),

            new JsxVisitor(),

            new ReactHookVisitor()

        ];

    }

}
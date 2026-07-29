import {
    EnumDeclaration
} from "ts-morph";

import {
    EnumMemberModel,
    EnumModel,
    SemanticSymbolKind,
    Visibility
} from "../models";

import { SourceLocationFactory } from "./sourceLocationFactory";
import { SymbolFactory } from "./symbolFactory";

export class EnumFactory {

    public static create(
        declaration: EnumDeclaration
    ): EnumModel {

        return {

            id: SymbolFactory.createIdFromNode(
                declaration,
                SemanticSymbolKind.Enum,
                declaration.getName()
            ),

            name:
                declaration.getName(),

            kind:
                SemanticSymbolKind.Enum,

            exported:
                declaration.isExported(),

            visibility:
                Visibility.Public,

            range:
                SourceLocationFactory.fromNode(
                    declaration
                ),

            members:
                declaration
                    .getMembers()
                    .map(member => ({

                        name:
                            member.getName(),

                        value:
                            member
                                .getValue()
                                ?.toString()

                    }))
        };
    }

    public static hasMembers(
        model: EnumModel
    ): boolean {

        return model.members.length > 0;
    }

    public static memberCount(
        model: EnumModel
    ): number {

        return model.members.length;
    }

    public static memberNames(
        model: EnumModel
    ): readonly string[] {

        return model.members.map(
            member => member.name
        );
    }

    public static findMember(
        model: EnumModel,
        name: string
    ): EnumMemberModel | undefined {

        return model.members.find(
            member => member.name === name
        );
    }

    private constructor() {
        // Static factory only.
    }

}
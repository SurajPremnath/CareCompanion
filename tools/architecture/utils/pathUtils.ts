import path from "node:path";

export function normalizePath(
    value: string
): string {

    return value.replace(
        /\\/g,
        "/"
    );

}

export function resolveRelativePath(
    rootDirectory: string,
    absolutePath: string
): string {

    return normalizePath(

        path.relative(
            rootDirectory,
            absolutePath
        )

    );

}

export function ensureTrailingSlash(
    value: string
): string {

    if (
        value.endsWith("/")
    ) {

        return value;

    }

    return `${value}/`;

}

export function isChildPath(
    parent: string,
    child: string
): boolean {

    const relative =
        path.relative(
            parent,
            child
        );

    return (

        relative.length > 0 &&
        !relative.startsWith("..") &&
        !path.isAbsolute(relative)

    );

}
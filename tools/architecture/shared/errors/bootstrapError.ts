export class BootstrapError extends Error {

    public readonly cause?: unknown;

    constructor(
        message: string,
        cause?: unknown
    ) {

        super(message);

        this.name = "BootstrapError";

        this.cause = cause;

        Object.setPrototypeOf(
            this,
            BootstrapError.prototype
        );

    }

    public static configuration(
        message: string,
        cause?: unknown
    ): BootstrapError {

        return new BootstrapError(
            `Configuration Error: ${message}`,
            cause
        );

    }

    public static filesystem(
        message: string,
        cause?: unknown
    ): BootstrapError {

        return new BootstrapError(
            `Filesystem Error: ${message}`,
            cause
        );

    }

    public static project(
        message: string,
        cause?: unknown
    ): BootstrapError {

        return new BootstrapError(
            `Project Error: ${message}`,
            cause
        );

    }

    public static tsConfig(
        message: string,
        cause?: unknown
    ): BootstrapError {

        return new BootstrapError(
            `TSConfig Error: ${message}`,
            cause
        );

    }

}
import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";


export async function GET(
    request: Request,
    context: {
        params: Promise<{
            runId:
                string;
        }>;
    }
) {

    try {

        const {
            runId,
        } =
            await context.params;

        if (
            !runId
        ) {
            return NextResponse.json(
                {
                    error:
                        "runId is required.",
                },
                {
                    status:
                        400,
                }
            );
        }

        const {
            data: run,
            error: runError,
        } =
            await supabaseAdmin
                .from(
                    "founder_audit_summary"
                )
                .select(
                    "*"
                )
                .eq(
                    "run_id",
                    runId
                )
                .single();

        if (
            runError ||
            !run
        ) {
            return NextResponse.json(
                {
                    error:
                        runError?.message ??
                        "Audit run not found.",
                },
                {
                    status:
                        404,
                }
            );
        }

        const {
            data: details,
            error: detailsError,
        } =
            await supabaseAdmin
                .from(
                    "founder_audit_details"
                )
                .select(
                    "*"
                )
                .eq(
                    "run_id",
                    runId
                )
                .order(
                    "event_timestamp",
                    {
                        ascending:
                            true,
                    }
                );

        if (
            detailsError
        ) {
            throw new Error(
                detailsError.message
            );
        }

        const documents =
            (details ?? [])
                .filter(
                    detail =>
                        detail.event_type ===
                        "DOCUMENT_INVENTORY"
                )
                .map(
                    detail => {

                        const document =
                            (
                                detail.evidence as
                                {
                                    document?:
                                        Record<
                                            string,
                                            unknown
                                        >;
                                } |
                                null
                            )?.document;

                        return {
                            documentNumber:
                                detail.document_number,

                            fileName:
                                String(
                                    document?.fileName ??
                                    ""
                                ),

                            fileType:
                                String(
                                    document?.fileType ??
                                    ""
                                ),

                            documentType:
                                document?.documentType
                                    ? String(
                                        document.documentType
                                    )
                                    : undefined,

                            pageCount:
                                typeof document?.pageCount ===
                                "number"
                                    ? document.pageCount
                                    : undefined,

                            status:
                                detail.status ??
                                undefined,
                        };
                    }
                );


        const pageExecution =
            (details ?? [])
                .filter(
                    detail =>
                        detail.event_type ===
                        "PAGE_EXECUTION"
                )
                .map(
                    detail => {

                        const page =
                            (
                                detail.evidence as
                                {
                                    pageExecution?:
                                        Record<
                                            string,
                                            unknown
                                        >;
                                } |
                                null
                            )?.pageExecution;

                        return {

                            documentNumber:
                                detail.document_number,

                            pageNumber:
                                detail.page_number,

                            started:
                                page?.started ===
                                true,

                            completed:
                                page?.completed ===
                                true,
                        };
                    }
                );

        const modelEvidence =
            Array.isArray(
                run.metadata?.modelEvidence
            )
                ? run.metadata.modelEvidence
                : [];

return NextResponse.json({

    run,

    documents,

    pageExecution,

    modelEvidence,

    /*
     * Accuracy is already persisted inside run.metadata
     * by the Audit Agent persistence boundary.
     *
     * Expose that existing evidence to the Founder Audit UI.
     * No accuracy is recalculated here.
     */
    accuracy:
        run.metadata?.accuracy ?? null,
});

    } catch (
        error
    ) {

        console.error(
            "AUDIT RUN LOAD ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load audit run.",
            },
            {
                status:
                    500,
            }
        );
    }
}
import { NextResponse } from "next/server";

import {
    processStrataparseDocument,
} from "@/Strataparse/processing/processStrataparseDocument";

import {
    assessDocument,
} from "@/Strataparse/routing/assessDocument";

import {
    StrataparseAnalyse,
} from "@/Strataparse/orchestration/strataparseEngine";


import {
    observeStrataparse,
} from "@/CareVRTestAuditAgent/runtime/auditObserver";

type StrataparseModule =
    | "RECORD_HEALTH"
    | "CARE_JOURNEY";

type StrataparseConfiguration = {
    expectedOutput?: string[];
};

export async function POST(
    request: Request
) {

let auditRunId:
    string |
    undefined;

    try {

        const formData =
            await request.formData();

        //--------------------------------------------------------
        // DIGITAL KEY
        //
        // Entry handshake.
        //
        // The key must be supplied before Strataparse will
        // process anything.
        //
        // Active-key validation belongs to the integration
        // authentication layer. This route must not invent
        // another key-management mechanism.
        //--------------------------------------------------------

        const digitalKey =
            formData.get(
                "digitalKey"
            );

        if (
            typeof digitalKey !==
                "string" ||
            !digitalKey.trim()
        ) {

            return NextResponse.json(
                {
                    error:
                        "Strataparse digital key is required.",
                },
                {
                    status: 401,
                }
            );
        }

        //--------------------------------------------------------
        // MODULE
        //--------------------------------------------------------

        const moduleValue =
            formData.get(
                "module"
            );

        if (
            moduleValue !==
                "RECORD_HEALTH" &&
            moduleValue !==
                "CARE_JOURNEY"
        ) {

            return NextResponse.json(
                {
                    error:
                        "Invalid Strataparse module.",
                },
                {
                    status: 400,
                }
            );
        }

        const module =
            moduleValue as StrataparseModule;

        //--------------------------------------------------------
        // DOCUMENTS
        //
        // CareVR may send up to five documents.
        //
        // They are NOT combined.
        //
        // Each document gets its own complete processing cycle.
        //--------------------------------------------------------

        const documents =
            formData
                .getAll("documents")
                .filter(
                    (
                        value
                    ): value is File =>
                        value instanceof File
                );

        if (
            documents.length === 0
        ) {

            return NextResponse.json(
                {
                    error:
                        "No documents were supplied to Strataparse.",
                },
                {
                    status: 400,
                }
            );
        }

        //--------------------------------------------------------
        // DOCUMENT TYPE
        //
        // CareVR supplies the document type used to select the
        // targeted extraction prompt.
        //--------------------------------------------------------

        const documentTypeValue =
            formData.get(
                "documentType"
            );

        if (
            typeof documentTypeValue !==
                "string" ||
            !documentTypeValue.trim()
        ) {

            return NextResponse.json(
                {
                    error:
                        "Document type is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const documentType =
            documentTypeValue.trim();

        //--------------------------------------------------------
        // CONFIGURATION
        //
        // Configuration comes from CareVR.
        //
        // Strataparse uses it to determine the requested
        // extraction output. It does not invent requirements.
        //--------------------------------------------------------

        const configurationValue =
            formData.get(
                "configuration"
            );

        let configuration:
            StrataparseConfiguration |
            undefined;

        if (
            typeof configurationValue ===
                "string" &&
            configurationValue.trim()
        ) {

            try {

                configuration =
                    JSON.parse(
                        configurationValue
                    );

            } catch {

                return NextResponse.json(
                    {
                        error:
                            "Invalid Strataparse configuration.",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

//--------------------------------------------------------
// STRATAPARSE INTAKE
//
// The raw CareVR files are converted into Strataparse's
// internal document representation.
//
// During intake Strataparse:
//   1. validates the integration
//   2. counts pages
//   3. classifies each document
//   4. determines readability
//
// No extraction happens here.
//--------------------------------------------------------

const strataparseRequest = {
    integrationKey:
        digitalKey,

    integrationKeyActive:
        true,

    configuration: {
        expectedOutput:
            configuration?.expectedOutput ??
            [],
    },

    documents:
        documents.map(
            (
                file
            ) => ({
                file,
            })
        ),
};


auditRunId =
    crypto.randomUUID();

observeStrataparse({
    type:
        "CONFIGURATION_CAPTURED",

    runId:
        auditRunId,

    configuration:
        {
            ...strataparseRequest.configuration,
        },

    timestamp:
        Date.now(),
});

const intake =
    await StrataparseAnalyse(
        strataparseRequest,
        auditRunId
    );


//--------------------------------------------------------
// PROCESS EACH DOCUMENT INDEPENDENTLY
//
// Each document has already been classified during intake.
//
// Routing:
//   MESSY     → SOL
//   CLEAN     → LUNA
//   UNCERTAIN → TERRA
//
// Documents are never combined.
//--------------------------------------------------------

//--------------------------------------------------------
// STREAM COMPLETED DOCUMENT RESULTS
//
// Strataparse processes documents sequentially.
//
// Each time ONE document completes, immediately send
// that document's result to CareVR.
//
// This does not change Strataparse processing.
// It only exposes each completed document result
// immediately instead of buffering all results.
//--------------------------------------------------------

const encoder =
    new TextEncoder();

const stream =
    new ReadableStream({
        async start(controller) {

            try {

                for (
                    const document of intake.documents
                ) {

                    const assessment =
                        assessDocument({
                            readability:
                                document.readability,

                            pageCount:
                                document.pageCount,
                        });

                    const result =
                        await processStrataparseDocument({
                            document:
                                document.file,

                            documentType:
                                document.documentType,

                            configuration,

                            modelTier:
                                assessment.modelTier,

                            auditRunId:
                                auditRunId,

                            documentNumber:
                                document.documentNumber,
                        });

                    /*
                     * This document is now completely
                     * processed.
                     *
                     * Send only this document's result
                     * to CareVR immediately.
                     */
                    controller.enqueue(
                        encoder.encode(
                            JSON.stringify({
                                type:
                                    "DOCUMENT_COMPLETED",

                                documentNumber:
                                    document.documentNumber,

                                result,
                            }) + "\n"
                        )
                    );
                }

                if (
                    !auditRunId
                ) {
                    throw new Error(
                        "Audit run ID was not created."
                    );
                }

                observeStrataparse({
                    type:
                        "RUN_COMPLETED",

                    runId:
                        auditRunId,

                    documentCount:
                        intake.documentCount,

                    totalPageCount:
                        intake.totalPageCount,

                    timestamp:
                        Date.now(),
                });

                controller.enqueue(
                    encoder.encode(
                        JSON.stringify({
                            type:
                                "RUN_COMPLETED",
                        }) + "\n"
                    )
                );

                controller.close();

            } catch (
                error
            ) {

                console.error(
                    "STRATAPARSE STREAM ERROR:",
                    error
                );

                /*
                 * If one document fails after previous
                 * documents have already been returned,
                 * preserve those completed results and
                 * communicate the failure through the stream.
                 */
                controller.enqueue(
                    encoder.encode(
                        JSON.stringify({
                            type:
                                "PROCESSING_FAILED",

                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Strataparse processing failed.",
                        }) + "\n"
                    )
                );

                controller.close();
            }
        },
    });

return new Response(
    stream,
    {
        headers: {
            "Content-Type":
                "application/x-ndjson; charset=utf-8",

            "Cache-Control":
                "no-cache, no-transform",

            "Connection":
                "keep-alive",
        },
    }
);

    } catch (
        error
    ) {

        console.error(
            "STRATAPARSE ROUTE ERROR:",
            error
        );

        if (
            auditRunId
        ) {

            observeStrataparse({
                type:
                    "PROCESSING_FAILED",

                runId:
                    auditRunId,

                error:
                    error instanceof Error
                        ? error.message
                        : "Strataparse processing failed.",

                timestamp:
                    Date.now(),
            });
        }

        return NextResponse.json(
            {
                error:
                    "Strataparse processing failed.",
            },
            {
                status: 500,
            }
        );
    }
}
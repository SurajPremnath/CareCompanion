import OpenAI from "openai";
import {
    PDFDocument,
} from "pdf-lib";

import type {
    StrataparseModelTier,
} from "@/Strataparse/routing/assessDocument";

import {
    resolveStrataparseModel,
} from "@/Strataparse/configuration/strataparseModels";

import {
    buildExtractionPrompt,
} from "@/Strataparse/prompts/promptBuilder";

import {
    STRATAPARSE_SYSTEM_PROMPT,
} from "@/Strataparse/prompts/strataparseSystemPrompt";

import {
    observeStrataparse,
} from "@/CareVRTestAuditAgent/runtime/auditObserver";

export type StrataparseConfiguration = {
    expectedOutput?: string[];
};

export type ProcessStrataparseDocumentInput = {
    document: File;
    documentType: string;
    configuration?: StrataparseConfiguration;
    modelTier: StrataparseModelTier;

    /**
     * Optional audit context.
     *
     * Audit is observational only. When supplied, the
     * processing function emits fire-and-forget observations
     * but never waits for the audit system.
     */
    auditRunId?: string;
    documentNumber?: number;
};

export type StrataparseDocumentResult = {
    documentType: string;
    extraction: Record<string, unknown>;
};

const openai =
    new OpenAI({
        apiKey:
            process.env.OPENAI_API_KEY,
    });

/**
 * Processes exactly ONE document.
 *
 * ONE DOCUMENT
 *      ↓
 * de-assemble into ordered pages
 *      ↓
 * page 1 → extract → append
 * page 2 → extract → append
 * page 3 → extract → append
 *      ↓
 * assemble
 *      ↓
 * ONE DOCUMENT JSON
 *
 * No other document enters this process.
 */
export async function processStrataparseDocument(
    input: ProcessStrataparseDocumentInput
): Promise<StrataparseDocumentResult> {

const {
    document,
    documentType,
    configuration,
    modelTier,
    auditRunId,
    documentNumber,
} = input;

    //--------------------------------------------------------
    // MODEL
    //
    // The logical tier is resolved through the environment
    // configuration. No model name is hardcoded here.
    //--------------------------------------------------------

    const model =
        resolveStrataparseModel(
            modelTier
        );

    //--------------------------------------------------------
    // TARGETED PROMPT
    //--------------------------------------------------------

    const targetedPrompt =
        buildExtractionPrompt(
            documentType,
            configuration
        );

    //--------------------------------------------------------
    // DE-ASSEMBLE DOCUMENT
    //--------------------------------------------------------

    const pages =
        await deassembleDocument(
            document
        );

    if (
        pages.length === 0
    ) {
        throw new Error(
            "Strataparse could not identify any pages in the supplied document."
        );
    }

    //--------------------------------------------------------
    // PAGE-BY-PAGE EXTRACTION
    //
    // Sequential processing is intentional.
    // Every page belongs only to this document.
    //--------------------------------------------------------

    const pageResults:
        Record<string, unknown>[] = [];

    for (
        let pageIndex = 0;
        pageIndex < pages.length;
        pageIndex += 1
    ) {

        const page =
            pages[
                pageIndex
            ];

const pageResult =
    await extractPage({
        page,
        model,
        targetedPrompt,
        pageNumber:
            pageIndex + 1,

        auditRunId,
        documentNumber,
        modelTier,
    });

if (
    auditRunId &&
    documentNumber !== undefined
) {
observeStrataparse({
    type:
        "PAGE_COMPLETED",

    runId:
        auditRunId,

    documentNumber,

    pageNumber:
        pageIndex + 1,

    modelTier,

    /*
     * Preserve the actual GPT model already resolved by
     * Strataparse and already supplied to extractPage().
     *
     * The Audit Agent observes this value only.
     * It does not select or modify the model.
     */
    model,

    inputTokens:
        pageResult.inputTokens,

    outputTokens:
        pageResult.outputTokens,

    totalTokens:
        pageResult.totalTokens,

    timestamp:
        Date.now(),
});
}

pageResults.push(
    pageResult.extraction
);
    }

    //--------------------------------------------------------
    // ASSEMBLE DOCUMENT
    //--------------------------------------------------------

    const extraction =
        assembleDocumentResults(
            pageResults
        );

    if (
        auditRunId &&
        documentNumber !== undefined
    ) {
        observeStrataparse({
            type:
                "DOCUMENT_COMPLETED",

            runId:
                auditRunId,

            documentNumber,

            timestamp:
                Date.now(),
        });
    }


    return {
        documentType,
        extraction,
    };
}

type ExtractPageInput = {
    page:
        Blob;

    model:
        string;

    targetedPrompt:
        string;

    pageNumber:
        number;

    auditRunId?:
        string;

    documentNumber?:
        number;

    modelTier:
        StrataparseModelTier;
};


type ExtractPageResult = {

    extraction:
        Record<string, unknown>;

    inputTokens?:
        number;

    outputTokens?:
        number;

    totalTokens?:
        number;
};


/**
 * Extracts exactly ONE page.
 *
 * IMAGE page:
 *   → sent as input_image
 *
 * PDF page:
 *   → uploaded as a temporary one-page PDF
 *   → sent as input_file
 *
 * No second page or second document is included.
 */
async function extractPage(
    input:
        ExtractPageInput
): Promise<ExtractPageResult> {

const {
    page,
    model,
    targetedPrompt,
    pageNumber,
    auditRunId,
    documentNumber,
    modelTier,
} = input;

    let temporaryOpenAIFileId:
        string |
        undefined;

    try {

        const pageType =
            page.type.toLowerCase();

        //----------------------------------------------------
        // Build page content
        //----------------------------------------------------

        const content:
            Array<
                | {
                    type:
                        "input_text";
                    text:
                        string;
                }
                | {
                    type:
                        "input_image";
                    image_url:
                        string;
                    detail:
                        "high";
                }
                | {
                    type:
                        "input_file";
                    file_id:
                        string;
                }
            > = [
                {
                    type:
                        "input_text",
                    text: `
${targetedPrompt}

SOURCE PAGE
===========

This is page ${pageNumber} of the current document.

Extract information from THIS PAGE ONLY.

Return structured JSON.

Do not invent information that is not visible
or reliably supported by this page.
`,
                },
            ];

        //----------------------------------------------------
        // IMAGE PAGE
        //----------------------------------------------------

        if (
            pageType.startsWith(
                "image/"
            )
        ) {

            const bytes =
                Buffer.from(
                    await page.arrayBuffer()
                );

            const base64 =
                bytes.toString(
                    "base64"
                );

            content.push({
                type:
                    "input_image",
                image_url:
                    `data:${page.type};base64,${base64}`,
                detail:
                    "high",
            });
        }

        //----------------------------------------------------
        // PDF PAGE
        //
        // This is a single-page PDF created by de-assembly.
        //----------------------------------------------------

        else if (
            pageType ===
            "application/pdf"
        ) {

            const bytes =
                await page.arrayBuffer();

            const uploadedFile =
                await openai.files.create({
                    file:
                        new File(
                            [
                                bytes,
                            ],
                            `strataparse-page-${pageNumber}.pdf`,
                            {
                                type:
                                    "application/pdf",
                            }
                        ),
                    purpose:
                        "user_data",
                });

            temporaryOpenAIFileId =
                uploadedFile.id;

            content.push({
                type:
                    "input_file",
                file_id:
                    uploadedFile.id,
            });
        }

        else {

            throw new Error(
                `Unsupported Strataparse page type: ${page.type || "unknown"}`
            );
        }

        //----------------------------------------------------
        // EXTRACTION
        //----------------------------------------------------

        if (
            auditRunId &&
            documentNumber !== undefined
        ) {
            observeStrataparse({
                type:
                    "PAGE_STARTED",

                runId:
                    auditRunId,

                documentNumber,

                pageNumber,

                modelTier,

                timestamp:
                    Date.now(),
            });

            observeStrataparse({
                type:
                    "PROMPT_CAPTURED",

                runId:
                    auditRunId,

                prompt:
                    targetedPrompt,

                timestamp:
                    Date.now(),
            });
        }

        const response =
            await openai.responses.create({

                model,

                instructions:
                    STRATAPARSE_SYSTEM_PROMPT,

                input: [
                    {
                        role:
                            "user",
                        content,
                    },
                ],

                text: {
                    format: {
                        type:
                            "json_object",
                    },
                },
            });

        //----------------------------------------------------
        // VALIDATE RESPONSE
        //----------------------------------------------------

        const outputText =
            response.output_text?.trim();

        if (
            !outputText
        ) {
            throw new Error(
                `Strataparse returned no extraction for page ${pageNumber}.`
            );
        }

        let parsed:
            unknown;

        try {

            parsed =
                JSON.parse(
                    outputText
                );

        } catch {

            throw new Error(
                `Strataparse returned invalid structured data for page ${pageNumber}.`
            );
        }

        if (
            !parsed ||
            typeof parsed !==
                "object" ||
            Array.isArray(parsed)
        ) {
            throw new Error(
                `Strataparse returned an invalid extraction object for page ${pageNumber}.`
            );
        }

return {

    extraction:
        parsed as
        Record<string, unknown>,

    inputTokens:
        response.usage?.input_tokens,

    outputTokens:
        response.usage?.output_tokens,

    totalTokens:
        response.usage?.total_tokens,
};

    } finally {

        //----------------------------------------------------
        // Remove temporary OpenAI PDF page.
        //----------------------------------------------------

        if (
            temporaryOpenAIFileId
        ) {

            try {

                await openai.files.delete(
                    temporaryOpenAIFileId
                );

            } catch (
                cleanupError
            ) {

                console.error(
                    "STRATAPARSE TEMPORARY FILE CLEANUP ERROR:",
                    cleanupError
                );
            }
        }
    }
}

/**
 * Converts ONE document into ordered pages.
 *
 * IMAGE
 *   → one image page
 *
 * ONE-PAGE PDF
 *   → one PDF page
 *
 * MULTI-PAGE PDF
 *   → individual one-page PDFs
 *
 * Page order is preserved.
 */
async function deassembleDocument(
    document: File
): Promise<Blob[]> {

    const mimeType =
        document.type
            .toLowerCase();

    //--------------------------------------------------------
    // IMAGE
    //--------------------------------------------------------

    if (
        mimeType.startsWith(
            "image/"
        )
    ) {
        return [
            document,
        ];
    }

    //--------------------------------------------------------
    // PDF
    //--------------------------------------------------------

    if (
        mimeType ===
        "application/pdf"
    ) {

        return deassemblePdf(
            document
        );
    }

    throw new Error(
        `Unsupported Strataparse document type: ${document.type || "unknown"}`
    );
}

/**
 * Splits ONE PDF into ordered ONE-PAGE PDFs.
 *
 * No extraction happens here.
 *
 * PDF:
 *   page 1 → PDF blob
 *   page 2 → PDF blob
 *   page 3 → PDF blob
 */
async function deassemblePdf(
    document: File
): Promise<Blob[]> {

    const sourceBytes =
        await document.arrayBuffer();

    const sourcePdf =
        await PDFDocument.load(
            sourceBytes
        );

    const pageCount =
        sourcePdf.getPageCount();

    if (
        pageCount === 0
    ) {
        return [];
    }

    const pages:
        Blob[] = [];

    for (
        let pageIndex = 0;
        pageIndex < pageCount;
        pageIndex += 1
    ) {

        //----------------------------------------------------
        // Create a new PDF containing exactly ONE page.
        //----------------------------------------------------

        const singlePagePdf =
            await PDFDocument.create();

        const [
            copiedPage,
        ] =
            await singlePagePdf.copyPages(
                sourcePdf,
                [
                    pageIndex,
                ]
            );

        singlePagePdf.addPage(
            copiedPage
        );

const pageBytes =
    await singlePagePdf.save();

const pageBuffer =
    new Uint8Array(
        pageBytes
    ).buffer;

pages.push(
    new Blob(
        [
            pageBuffer,
        ],
        {
            type:
                "application/pdf",
        }
    )
);
    }

    return pages;
}

/**
 * Combines page-level extraction into ONE document result.
 *
 * Important:
 * repeated values are preserved.
 * They are never silently overwritten.
 */
function assembleDocumentResults(
    pageResults:
        Record<string, unknown>[]
): Record<string, unknown> {

    const assembled:
        Record<string, unknown> = {};

    for (
        const pageResult of pageResults
    ) {

        for (
            const [
                key,
                value,
            ] of Object.entries(
                pageResult
            )
        ) {

            if (
                value ===
                undefined
            ) {
                continue;
            }

            const existing =
                assembled[key];

            //------------------------------------------------
            // First value
            //------------------------------------------------

            if (
                existing ===
                undefined
            ) {

                assembled[key] =
                    value;

                continue;
            }

            //------------------------------------------------
            // Existing array
            //------------------------------------------------

            if (
                Array.isArray(
                    existing
                )
            ) {

                assembled[key] = [
                    ...existing,
                    ...(Array.isArray(
                        value
                    )
                        ? value
                        : [
                            value,
                        ]),
                ];

                continue;
            }

            //------------------------------------------------
            // New value is an array
            //------------------------------------------------

            if (
                Array.isArray(
                    value
                )
            ) {

                assembled[key] = [
                    existing,
                    ...value,
                ];

                continue;
            }

            //------------------------------------------------
            // Same field on another page.
            // Preserve both values.
            //------------------------------------------------

            assembled[key] = [
                existing,
                value,
            ];
        }
    }

    return assembled;
}
import OpenAI from "openai";

import type {
    StrataparseDocumentType,
} from "./documentTypes";

import {
    DOCUMENT_CLASSIFICATION_PROMPT,
} from "../prompts/documentClassificationPrompt";

export type StrataparseDocumentReadability =
    | "MESSY"
    | "CLEAN"
    | "UNCERTAIN";

export interface StrataparseDocumentClassificationResult {
    documentType: StrataparseDocumentType;
    readability: StrataparseDocumentReadability;
}

const openai =
    new OpenAI({
        apiKey:
            process.env.OPENAI_API_KEY,
    });

/**
 * Classifies exactly ONE document.
 *
 * This stage determines:
 *
 * 1. What the document is.
 * 2. How reliably the document can be read.
 *
 * Readability is intentionally separate from document type.
 *
 * Example:
 *
 * Prescription + MESSY
 * Prescription + CLEAN
 * Doctor Notes + MESSY
 *
 * The classification result is later used by the
 * Strataparse routing layer to select the processing tier.
 */
export async function classifyStrataparseDocument(
    file: File
): Promise<StrataparseDocumentClassificationResult> {

    const bytes =
        await file.arrayBuffer();

const pageType =
    file.type.toLowerCase();

let uploadedFile:
    OpenAI.Files.FileObject |
    undefined;

try {

    const documentContent:
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
Analyse this document.

Determine:
1. The document type.
2. Whether the document is clean/readable,
   messy/handwritten/difficult to read, or uncertain.

Use only information visible in the supplied document.

Do not infer the document type from its filename.

Return JSON only.
`,
            },
        ];

    if (
        pageType.startsWith(
            "image/"
        )
    ) {

        const base64 =
            Buffer.from(
                bytes
            ).toString(
                "base64"
            );

        documentContent.push({
            type:
                "input_image",

            image_url:
                `data:${file.type};base64,${base64}`,

            detail:
                "high",
        });

    } else {

        uploadedFile =
            await openai.files.create({
                file:
                    new File(
                        [
                            bytes,
                        ],
                        file.name,
                        {
                            type:
                                file.type ||
                                "application/octet-stream",
                        }
                    ),
                purpose:
                    "user_data",
            });

        documentContent.push({
            type:
                "input_file",

            file_id:
                uploadedFile.id,
        });
    }

    const response =
        await openai.responses.create({
            model:
                process.env.STRATAPARSE_MODEL_CLASSIFIER ||
                process.env.STRATAPARSE_MODEL_LUNA ||
                "",

            input: [
                {
                    role:
                        "system",

                    content: [
                        {
                            type:
                                "input_text",

                            text:
                                DOCUMENT_CLASSIFICATION_PROMPT,
                        },
                    ],
                },

                {
                    role:
                        "user",

                    content:
                        documentContent,
                },
            ],

            text: {
                format: {
                    type:
                        "json_object",
                },
            },
        });

        const outputText =
            response.output_text?.trim();

        if (!outputText) {
            throw new Error(
                "Strataparse classification returned no result."
            );
        }

        const parsed =
            JSON.parse(
                outputText
            ) as {
                documentType?: string;
                readability?: string;
            };

        const validDocumentTypes:
    StrataparseDocumentType[] = [
    "PRESCRIPTION",
    "DOCTOR_NOTES",
    "LAB_REPORT",
    "DIAGNOSTIC_REPORT",
    "VITALS",
    "OTHER",
];

        const validReadability:
            StrataparseDocumentReadability[] = [
                "MESSY",
                "CLEAN",
                "UNCERTAIN",
            ];

        if (
            !parsed.documentType ||
            !validDocumentTypes.includes(
                parsed.documentType as StrataparseDocumentType
            )
        ) {
            throw new Error(
                "Strataparse returned an invalid document classification."
            );
        }

        if (
            !parsed.readability ||
            !validReadability.includes(
                parsed.readability as StrataparseDocumentReadability
            )
        ) {
            throw new Error(
                "Strataparse returned an invalid document readability classification."
            );
        }

        return {
            documentType:
                parsed.documentType as StrataparseDocumentType,

            readability:
                parsed.readability as StrataparseDocumentReadability,
        };

    } finally {

        /*
         * The uploaded classification file is temporary.
         * The classification stage does not own persistent storage.
         */
try {
    if (uploadedFile) {
        await openai.files.delete(
            uploadedFile.id
        );
    }
} catch {
    // Classification result remains valid even if cleanup fails.
}
    }
}
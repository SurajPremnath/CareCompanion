"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileImage,
    FileText,
    LoaderCircle,
    LockKeyhole,
    Search,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import type {
    CareJourneyDisplayConfiguration,
} from "@/lib/prescription-ai/configuration/careJourneyConfiguration";

import {
    startAuditAgent,
    recordAuditEvent,
completeAuditAgent,
} from "@/CareVRTestAuditAgent/runtime/auditAgent";


import type {
    AuditAgent,
} from "@/CareVRTestAuditAgent/runtime/auditAgent";

import CareVRFooter from "@/Components/common/CareVRFooter";

import { useRouter } from "next/navigation";

/* ============================================================
   CARE JOURNEY WOW WORKSPACE

   UI-FIRST VERSION

   Responsibility:
   - Receive the documents selected by CareVR.
   - Receive the saved Care Journey configuration.
   - Present the intelligence/processing experience.

   Intentionally NOT responsible yet for:
   - Strataparse processing
   - document classification
   - extraction
   - result persistence
   - timeline creation

   The Strataparse request contract from the existing test
   workspace is deliberately preserved for the next integration
   step: documents[] + configuration.expectedOutput.
============================================================ */

type ProcessingStatus =
    | "WAITING"
    | "READING"
    | "EXTRACTING"
    | "COMPLETED"
    | "FAILED";

interface CareJourneyDocumentWorkspaceItem {
    file: File;
    status: ProcessingStatus;

/*
 * Complete document result returned by the current
 * Strataparse processing pipeline.
 *
 * The UI consumes the document type and extraction
 * without modifying the Strataparse result.
 */
data?: {
    documentType: string;
    extraction: Record<string, unknown>;
};

    error?: string;
}

interface CareJourneyProcessingWorkspaceProps {
    documents: File[];
    configuration: CareJourneyDisplayConfiguration;
    auditAgent?: AuditAgent | null;
    persistedItems?: CareJourneyDocumentWorkspaceItem[];
    onProcessingStateChange?: (
        items: CareJourneyDocumentWorkspaceItem[]
    ) => void;
    onBack?: () => void;
}

function getFileSizeLabel(bytes: number): string {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeLabel(file: File): string {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        return "PDF";
    }

    if (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
        return "JPG";
    }

    return "FILE";
}

function getDocumentIcon(file: File) {
    return getFileTypeLabel(file) === "PDF" ? FileText : FileImage;
}

function getStatusLabel(status: ProcessingStatus): string {
    switch (status) {
        case "READING":
            return "Extracting";
        case "EXTRACTING":
            return "Analysis";
        case "COMPLETED":
            return "Completed";
        case "FAILED":
            return "Needs attention";
        default:
            return "Queued";
    }
}

function getStatusClass(status: ProcessingStatus): string {
    switch (status) {
        case "COMPLETED":
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "READING":
            return "bg-blue-50 text-blue-700 border-blue-100";
        case "EXTRACTING":
            return "bg-violet-50 text-violet-700 border-violet-100";
        case "FAILED":
            return "bg-rose-50 text-rose-700 border-rose-100";
        default:
            return "bg-amber-50 text-amber-700 border-amber-100";
    }
}

function getStatusIcon(status: ProcessingStatus) {
    if (status === "COMPLETED") {
        return <Check className="h-4 w-4" />;
    }

    if (status === "READING" || status === "EXTRACTING") {
        return <LoaderCircle className="h-4 w-4 animate-spin" />;
    }

    if (status === "FAILED") {
        return <span className="text-sm font-bold">!</span>;
    }

    return <Clock3 className="h-4 w-4" />;
}

function getDocumentPages(file: File): string {
    /*
     * Page count belongs to Strataparse and must not be guessed
     * from the filename or MIME type. Until the engine is wired,
     * the UI intentionally shows a neutral document descriptor.
     */
    return getFileTypeLabel(file) === "PDF" ? "PDF document" : "Image document";
}

/*
 * ============================================================
 * CARE JOURNEY INFORMATION PRESENTATION
 * ============================================================
 *
 * The workspace receives the complete result from Strataparse,
 * but only presents information selected by the user.
 *
 * These helpers are presentation-only.
 * They do not alter the Strataparse extraction.
 */

const INFORMATION_NOT_AVAILABLE =
    "Information not available in the document uploaded.";

function formatInformationLabel(
    value: string
): string {
    return value
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^./, character =>
            character.toUpperCase()
        );
}

function hasInformation(
    value: unknown
): boolean {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return false;
    }

    if (
        Array.isArray(value)
    ) {
        return value.length > 0;
    }

    if (
        typeof value === "object"
    ) {
        return Object.keys(
            value as Record<string, unknown>
        ).length > 0;
    }

    return true;
}

function formatInformationValue(
    value: unknown
): string {
    if (
        Array.isArray(value)
    ) {
        return value
            .map(item =>
                typeof item === "object"
                    ? JSON.stringify(item)
                    : String(item)
            )
            .join("\n");
    }

    if (
        typeof value === "object" &&
        value !== null
    ) {
        return Object.entries(
            value as Record<string, unknown>
        )
            .map(
                ([key, nestedValue]) =>
                    `${formatInformationLabel(key)}: ${
                        hasInformation(nestedValue)
                            ? formatInformationValue(
                                  nestedValue
                              )
                            : INFORMATION_NOT_AVAILABLE
                    }`
            )
            .join("\n");
    }

    return String(value);
}

function getConfiguredExtractionValue(
    extraction: Record<string, unknown>,
    panel: string
): unknown {

    const panelFieldMap:
        Record<string, string[]> = {

        PATIENT: [
            "patientIdentity",
            "patient",
            "patientInformation",
        ],

        DOCTOR: [
            "doctor",
            "doctorName",
        ],

        HOSPITAL: [
            "hospital",
            "hospitalName",
            "hospitalOrClinic",
        ],

        CONSULTATION: [
            "consultation",
            "consultationDate",
            "consultationMode",
        ],

        CURRENT_STATE_OF_HEALTH: [
            "currentStateOfHealth",
        ],

        DIAGNOSIS: [
            "diagnosis",
            "diagnosisOrAssessment",
        ],

        CLINICAL_ASSESSMENTS: [
            "clinicalAssessments",
            "clinicalAssessment",
        ],

        SYMPTOMS: [
            "symptoms",
        ],

        PRESENTING_COMPLAINTS: [
            "presentingComplaints",
            "complaints",
        ],

        CLINICAL_HISTORY: [
            "clinicalHistory",
            "pastMedicalHistory",
            "history",
        ],

        EXAMINATION_FINDINGS: [
            "examinationFindings",
        ],

        TESTS_ADVISED: [
            "testsAdvised",
            "investigations",
        ],

        DOCTOR_INSTRUCTIONS: [
            "doctorInstructions",
        ],

        MEDICATIONS: [
            "medicines",
            "medications",
        ],

        FOLLOW_UP_PLAN: [
            "followUpPlan",
        ],

        CLINICAL_PLAN: [
            "clinicalPlan",
        ],
    };

    const possibleFields =
        panelFieldMap[panel] ?? [];

    for (
        const field of possibleFields
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                extraction,
                field
            )
        ) {
            return extraction[field];
        }
    }

    return undefined;
}

export default function CareJourneyProcessingWorkspaceWOW({
    documents,
    configuration,
    auditAgent,
    persistedItems,
    onProcessingStateChange,
    onBack,
}: CareJourneyProcessingWorkspaceProps) {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 01 - Component function entered",
        {
            timestamp: new Date().toISOString(),
            documentsCount: documents.length,
            documents: documents.map(file => file.name),
            configuration,
            persistedItemsCount: persistedItems?.length ?? 0,
        }
    );

const router = useRouter();

    console.log(
        "[CARE JOURNEY DEBUG] WOW 02 - Router initialized",
        {
            timestamp: new Date().toISOString(),
        }
    );


    const initialItems = useMemo(() => {
        const persistedByKey = new Map(
            (persistedItems ?? []).map(item => [
                `${item.file.name}|${item.file.size}|${item.file.lastModified}`,
                item,
            ])
        );



        return documents.slice(0, 5).map(file => {
            const key = `${file.name}|${file.size}|${file.lastModified}`;
            return (
                persistedByKey.get(key) ?? {
                    file,
                    status: "WAITING" as ProcessingStatus,
                }
            );
        });
    }, [documents, persistedItems]);

    console.log(
        "[CARE JOURNEY DEBUG] WOW 03 - Initial document items calculated",
        {
            timestamp: new Date().toISOString(),
            initialItemsCount: initialItems.length,
            items: initialItems.map(item => ({
                name: item.file.name,
                status: item.status,
            })),
        }
    );



const auditObservedDocumentsRef =
    useRef<Set<number>>(
        new Set()
    );

const auditCompletedDocumentsRef =
    useRef<Set<number>>(
        new Set()
    );

const auditFailedDocumentsRef =
    useRef<Set<number>>(
        new Set()
    );

const auditAgentRef =
    useRef<AuditAgent | null>(null);


const startAuditObservation = () => {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 04 - startAuditObservation entered",
        {
            timestamp: new Date().toISOString(),
            auditAlreadyExists: !!auditAgentRef.current,
        }
    );


    if (auditAgentRef.current) {
        return;
    }

    try {

        console.log(
            "[CARE JOURNEY DEBUG] WOW 05 - About to start Audit observation",
            {
                timestamp: new Date().toISOString(),
                documentCount: documents.length,
            }
        );

        auditAgentRef.current =
            startAuditAgent({
                runId:
                    crypto.randomUUID(),

                module:
                    "CARE_JOURNEY",

                documentCount:
                    documents.length,
            });

        console.log(
            "[CARE JOURNEY DEBUG] WOW 06 - Audit observation start returned",
            {
                timestamp: new Date().toISOString(),
                auditAgentCreated: !!auditAgentRef.current,
            }
        );


    } catch (error) {

        /*
         * The Audit Agent is observational only.
         * An audit failure must never affect
         * the CareVR processing journey.
         */

        console.error(
            "CareVR Audit Agent start failed:",
            error
        );

    }
};

/*
 * Start the passive audit observation when the
 * processing workspace has its current document set.
 *
 * The audit agent observes processing only.
 * It does not control or block Strataparse.
 */
useEffect(() => {

    startAuditObservation();

}, [documents.length]);

console.log(
    "[CARE JOURNEY DEBUG] WOW 08 - About to initialize items state",
    {
        timestamp: new Date().toISOString(),
        initialItemsCount: initialItems.length,
        initialStatuses: initialItems.map(item => item.status),
    }
);


    const [items, setItems] = useState<CareJourneyDocumentWorkspaceItem[]>(
        initialItems
    );

    const [expandedDocument, setExpandedDocument] = useState<number | null>(
        null
    );

    useEffect(() => {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 09 - Items synchronization effect entered",
        {
            timestamp: new Date().toISOString(),
            initialItemsCount: initialItems.length,
            items: initialItems.map((item, index) => ({
                documentNumber: index + 1,
                name: item.file.name,
                status: item.status,
            })),
        }
    );


        setItems(initialItems);

    console.log(
        "[CARE JOURNEY DEBUG] WOW 10 - Items synchronization state update requested",
        {
            timestamp: new Date().toISOString(),
        }
    );

    }, [initialItems]);

useEffect(() => {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 11 - Items processing-state effect entered",
        {
            timestamp: new Date().toISOString(),
            itemsCount: items.length,
            items: items.map((item, index) => ({
                documentNumber: index + 1,
                name: item.file.name,
                status: item.status,
            })),
        }
    );

    console.log(
        "[CARE JOURNEY DEBUG] WOW 12 - About to notify parent of processing state",
        {
            timestamp: new Date().toISOString(),
        }
    );


    onProcessingStateChange?.(items);

    console.log(
        "[CARE JOURNEY DEBUG] WOW 13 - Parent processing-state notification returned",
        {
            timestamp: new Date().toISOString(),
        }
    );


    const agent =
        auditAgentRef.current;

    console.log(
        "[CARE JOURNEY DEBUG] WOW 14 - Audit agent checked",
        {
            timestamp: new Date().toISOString(),
            auditAgentExists: !!agent,
        }
    );


    if (!agent) {
        return;
    }

    items.forEach(
        (item, index) => {

            const documentNumber =
                index + 1;

        console.log(
            "[CARE JOURNEY DEBUG] WOW 15 - Inspecting document status",
            {
                timestamp: new Date().toISOString(),
                documentNumber,
                fileName: item.file.name,
                status: item.status,
            }
        );


            if (
                item.status === "READING" &&
                !auditObservedDocumentsRef.current.has(
                    documentNumber
                )
            ) {

                auditObservedDocumentsRef.current.add(
                    documentNumber
                );


                console.log(
                    "[CARE JOURNEY DEBUG] WOW 16 - Audit DOCUMENT_STARTED",
                    {
                        timestamp: new Date().toISOString(),
                        documentNumber,
                        fileName: item.file.name,
                    }
                );

                console.log(
                    "[CARE JOURNEY DEBUG] WOW 17 - Audit PAGE_STARTED",
                    {
                        timestamp: new Date().toISOString(),
                        documentNumber,
                    }
                );



                recordAuditEvent({

                    type:
                        "PAGE_STARTED",

                    runId:
                        agent.run.runId,

                    documentNumber,

                    pageNumber:
                        1,

                    modelTier:
                        "CAREJOURNEY",

                    timestamp:
                        Date.now(),
                });

            }

                if (
                    item.status === "COMPLETED" &&
                    !auditCompletedDocumentsRef.current.has(
                        documentNumber
                    )
                ) {

                    auditCompletedDocumentsRef.current.add(
                        documentNumber
                    );

                    console.log(
                        "[CARE JOURNEY DEBUG] WOW 19 - Audit DOCUMENT_COMPLETED",
                        {
                            timestamp: new Date().toISOString(),
                            documentNumber,
                        }
                    );


                    recordAuditEvent({

                        type:
                            "DOCUMENT_COMPLETED",

                        runId:
                            agent.run.runId,

                        documentNumber,

                        durationMs:
                            undefined,

                        timestamp:
                            Date.now(),
                    });

                }


            if (item.status === "FAILED") {

    if (
        !auditFailedDocumentsRef.current.has(
            documentNumber
        )
    ) {

        auditFailedDocumentsRef.current.add(
            documentNumber
        );

        console.log(
            "[CARE JOURNEY DEBUG] WOW 20 - Audit PROCESSING_FAILED",
            {
                timestamp: new Date().toISOString(),
                documentNumber,
                fileName: item.file.name,
            }
        );

        recordAuditEvent({
            type:
                "PROCESSING_FAILED",

            runId:
                agent.run.runId,

            documentNumber,

            error:
                "Care Journey document processing failed.",

            timestamp:
                Date.now(),
        });

    }  // closes inner if

}      // closes FAILED if

}      // closes items.forEach callback
);     // closes items.forEach(...)

}, [items, onProcessingStateChange]);

    const completedCount = items.filter(
        item => item.status === "COMPLETED"
    ).length;

    const activeCount = items.filter(
        item => item.status === "READING" || item.status === "EXTRACTING"
    ).length;

    const failedCount = items.filter(
        item => item.status === "FAILED"
    ).length;

    const allComplete =
        items.length > 0 && completedCount === items.length;




    const overallProgress =
        items.length === 0
            ? 0
            : Math.round((completedCount / items.length) * 100);


console.log(
    "[CARE JOURNEY DEBUG] WOW 29 - Progress calculated",
    {
        timestamp: new Date().toISOString(),
        itemsCount: items.length,
        completedCount,
        activeCount,
        failedCount,
        overallProgress,
    }
);


    const currentIndex = items.findIndex(
        item => item.status === "READING" || item.status === "EXTRACTING"
    );

    const activeIndex = currentIndex >= 0 ? currentIndex : Math.min(completedCount, Math.max(items.length - 1, 0));
    const activeItem = items[activeIndex];


console.log(
    "[CARE JOURNEY DEBUG] WOW 30 - Active document calculated",
    {
        timestamp: new Date().toISOString(),
        currentIndex,
        activeIndex,
        activeItem: activeItem
            ? {
                name: activeItem.file.name,
                status: activeItem.status,
            }
            : null,
    }
);

console.log(
    "[CARE JOURNEY DEBUG] WOW 31 - Component returning UI",
    {
        timestamp: new Date().toISOString(),
        items: items.map(item => ({
            name: item.file.name,
            status: item.status,
        })),
        overallProgress,
        currentIndex,
        activeIndex,
        allComplete,
    }
);

    return (



        <main className="min-h-screen bg-[#fbfbff] text-[#18204a]">
            {/* =====================================================
                HEADER
            ===================================================== */}
            <header className="sticky top-0 z-20 border-b border-[#e7e8f4] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 32 - Processing Workspace Back clicked",
        {
            timestamp: new Date().toISOString(),
            items: items.map(item => ({
                name: item.file.name,
                status: item.status,
            })),
        }
    );

    onBack?.();
}}
                            disabled={!onBack}
                            aria-label="Go back"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e6f2] bg-white text-[#3f46c6] shadow-sm transition hover:border-[#cfd1f4] disabled:cursor-default disabled:opacity-0"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[23px] font-extrabold tracking-[-0.03em] text-[#4d35dc]">
                                    CareVR
                                </span>
                                <span className="h-6 w-px bg-[#d9d9e8]" />
                                <span className="text-[17px] font-bold text-[#18204a]">
                                    Care Journey
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs font-medium text-[#7a809d]">
                                Intelligent health record understanding
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-full border border-[#e5e6f2] bg-white px-3 py-2 text-xs font-semibold text-[#606783] sm:flex">
                            <LockKeyhole className="h-3.5 w-3.5 text-[#4d35dc]" />
                            Secure processing
                        </div>
                        <button
                            type="button"
                            className="flex h-11 items-center gap-2 rounded-xl border border-[#c9c3ff] bg-white px-5 font-bold text-[#4d35dc] shadow-sm transition hover:bg-[#faf9ff]"
                        >
                            <span className="text-lg">⌂</span>
                            Home
                        </button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4d35dc] text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(77,53,220,0.25)]">
                            SP
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1180px] px-6 pb-12 pt-8">
                {/* =================================================
                    DOCUMENTS
                ================================================= */}
                <section className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)] sm:p-7">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-extrabold tracking-[-0.02em]">
                                    Your documents
                                </h2>
                                <span className="rounded-full bg-[#f0efff] px-2.5 py-1 text-xs font-bold text-[#5140d0]">
                                    {items.length}/5
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-[#7a809d]">
                                CareVR will understand each document independently.
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-extrabold text-[#4d35dc]">
                                {overallProgress}%
                            </div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b90a8]">
                                understood
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item, index) => {
                            const Icon = getDocumentIcon(item.file);
                            const isExpanded = expandedDocument === index;
                            const isActive =
                                item.status === "READING" ||
                                item.status === "EXTRACTING";

                            return (
                                <article
                                    key={`${item.file.name}-${item.file.lastModified}-${index}`}
                                    className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition-all ${
                                        isActive
                                            ? "border-[#b9c8ff] shadow-[0_12px_30px_rgba(57,101,229,0.12)]"
                                            : item.status === "COMPLETED"
                                                ? "border-[#bdebd1]"
                                                : "border-[#e5e6f2] hover:border-[#d0d2ec]"
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4d35dc] via-[#1684ff] to-[#54b7ff]" />
                                    )}

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f1f0ff] text-[#4d35dc]">
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <button
                                            type="button"
onClick={() => {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 33 - Document options clicked",
        {
            timestamp: new Date().toISOString(),
            documentIndex: index,
            fileName: item.file.name,
            status: item.status,
            wasExpanded: isExpanded,
        }
    );

    setExpandedDocument(
        isExpanded ? null : index
    );
}}
                                            aria-label={`Show options for ${item.file.name}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6d7391] transition hover:bg-[#f5f5fb]"
                                        >
                                            <span className="text-xl leading-none">⋮</span>
                                        </button>
                                    </div>

                                    <div className="mt-5 min-w-0">
                                        <h3 className="truncate text-base font-extrabold text-[#18204a]">
                                            {item.file.name}
                                        </h3>
                                        <p className="mt-1 truncate text-xs font-medium text-[#7b819d]">
                                            {getDocumentPages(item.file)} · {getFileSizeLabel(item.file.size)}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {getStatusLabel(item.status)}
                                        </div>

                                        <ChevronRight className="h-5 w-5 text-[#68708f] transition group-hover:translate-x-0.5" />
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-4 rounded-xl border border-[#ececf5] bg-[#fafaff] p-3 text-xs text-[#69708d]">
                                            <div className="font-bold text-[#3e4569]">
                                                Document information
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div>Type: {getFileTypeLabel(item.file)}</div>
                                                <div>Size: {getFileSizeLabel(item.file.size)}</div>
                                                {item.error && (
                                                    <div className="pt-1 font-semibold text-rose-600">
                                                        {item.error}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* =================================================
                    WHAT'S HAPPENING
                ================================================= */}
                <section className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)] sm:p-7">
                    <div className="mb-7">
                        <h2 className="text-xl font-extrabold tracking-[-0.02em]">
                            What&apos;s happening?
                        </h2>
                        <p className="mt-1 text-sm text-[#7a809d]">
                            CareVR Intelligence is turning your records into information you can understand.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 items-start gap-3 sm:gap-8">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-600 sm:text-sm">
                                Extracting
                            </div>
                        </div>

                        <div className="relative text-center">
                            <div className="absolute left-[-38%] right-[62%] top-8 hidden border-t-2 border-dashed border-[#c8cdfa] sm:block" />
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#dfe8ff] bg-[#eef4ff] text-[#1684ff] shadow-[0_10px_35px_rgba(22,132,255,0.2)]">
                                <Search className="h-9 w-9" />
                            </div>
                            <div className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#1684ff] sm:text-sm">
                                Analysis
                            </div>
                        </div>

                        <div className="relative text-center">
                            <div className="absolute left-[-38%] right-[62%] top-8 hidden border-t-2 border-dashed border-[#c8cdfa] sm:block" />
                            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 ${allComplete ? "border-emerald-100 bg-emerald-50 text-emerald-600" : "border-[#e1e3ef] bg-[#fafaff] text-[#9298b2]"}`}>
                                {allComplete ? (
                                    <Check className="h-7 w-7" />
                                ) : (
                                    <ShieldCheck className="h-7 w-7" />
                                )}
                            </div>
                            <div className={`mt-3 text-xs font-extrabold uppercase tracking-[0.12em] sm:text-sm ${allComplete ? "text-emerald-600" : "text-[#737a99]"}`}>
                                {allComplete ? "Completed" : "Completed"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-[#dfe6ff] bg-gradient-to-r from-[#f4f7ff] via-[#f8f7ff] to-[#f5fbff] p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#1684ff] shadow-sm">
                                {allComplete ? (
                                    <Check className="h-6 w-6" />
                                ) : (
                                    <LoaderCircle className="h-6 w-6 animate-spin" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                    <div className="font-extrabold text-[#23305c]">
                                        {allComplete
                                            ? "Your documents are ready to review"
                                            : failedCount > 0
                                                ? "Some documents need attention"
                                                : activeItem
                                                    ? `Understanding ${activeItem.file.name}`
                                                    : "Preparing your documents for intelligence"}
                                    </div>
                                    <div className="text-lg font-extrabold text-[#1684ff]">
                                        {overallProgress}%
                                    </div>
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white shadow-inner">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#4d35dc] to-[#1684ff] transition-all duration-700"
                                        style={{ width: `${Math.max(overallProgress, activeCount > 0 ? 8 : 0)}%` }}
                                    />
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[#69708d]">
                                    <span>{completedCount} of {items.length} understood</span>
                                    {activeCount > 0 && <span>• Intelligence in progress</span>}
                                    {failedCount > 0 && <span className="text-rose-600">• {failedCount} needs attention</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    EXTRACTED INFORMATION

                    Strataparse owns extraction and analysis.
                    CareVR displays the returned intelligence.

                    The display is configuration-driven:
                    - Prescription → prescription information
                    - Doctor Notes → consultation / clinical information
                    - Lab Results → patient-relevant laboratory information

                    CareVR does not invent values that were not
                    returned by Strataparse.
                ================================================= */}
                <section className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)] sm:p-7">

                    <div className="flex items-start justify-between gap-4 border-b border-[#ececf4] pb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-extrabold tracking-[-0.02em]">
                                    Intelligence results
                                </h2>

                                <Sparkles className="h-4 w-4 text-[#4d35dc]" />
                            </div>

                            <p className="mt-1 text-sm text-[#7a809d]">
                                Information identified from your health records.
                            </p>
                        </div>

                        <div className="hidden rounded-full bg-[#f3f1ff] px-3 py-1.5 text-xs font-bold text-[#5140d0] sm:block">
                            Care Journey
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">

                        {items
                            .filter(
                                item =>
                                    item.status === "COMPLETED" &&
                                    item.data
                            )
                            .map(
                                (
                                    item,
                                    index
                                ) => (

                                    <article
                                        key={`${item.file.name}-result-${index}`}
                                        className="rounded-2xl border border-[#e5e6f2] bg-[#fbfbff] p-5"
                                    >

                                        <div className="mb-4 flex items-start justify-between gap-4">

                                            <div className="min-w-0">

                                                <div className="text-sm font-extrabold text-[#18204a]">
                                                    {item.file.name}
                                                </div>

<div className="mt-1 text-xs font-medium text-[#7b819d]">
    {formatInformationLabel(
        item.data?.documentType ?? "Document"
    )}
</div>

                                            </div>

                                            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                                <Check className="h-4 w-4" />
                                                Completed
                                            </div>

                                        </div>

<div className="space-y-3">

    {configuration.configurable_Rest.map(
        panel => {

            const value =
                getConfiguredExtractionValue(
                    item.data?.extraction ?? {},
                    panel
                );

            const available =
                hasInformation(value);

            return (
                <div
                    key={panel}
                    className="rounded-xl border border-[#ececf5] bg-white p-4"
                >

                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                        {formatInformationLabel(
                            panel
                        )}
                    </div>

                    <div
                        className={
                            available
                                ? "mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#30375d]"
                                : "mt-2 text-sm leading-6 text-[#8a90a8]"
                        }
                    >
                        {available
                            ? formatInformationValue(
                                  value
                              )
                            : INFORMATION_NOT_AVAILABLE}
                    </div>

                </div>
            );
        }
    )}

</div>

                                    </article>

                                )
                            )}

                        {!items.some(
                            item =>
                                item.status === "COMPLETED" &&
                                item.data
                        ) && (

                            <div className="py-8 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f4ff] text-[#4d35dc]">
                                    <Sparkles className="h-6 w-6" />
                                </div>

                                <h3 className="mt-4 text-base font-extrabold text-[#30375d]">
                                    {allComplete
                                        ? "No extracted information was returned"
                                        : "Your information is being understood"}
                                </h3>

                                <p className="mx-auto mt-2 max-w-[560px] text-sm leading-6 text-[#7a809d]">
                                    CareVR displays information returned by Strataparse and does not invent missing values.
                                </p>

                            </div>

                        )}

                    </div>

                </section>

{allComplete && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
onClick={() => {

    console.log(
        "[CARE JOURNEY DEBUG] WOW 34 - Audit page button clicked",
        {
            timestamp: new Date().toISOString(),
            allComplete,
            items: items.map(item => ({
                name: item.file.name,
                status: item.status,
            })),
        }
    );

    router.push("/admin/Audit");
}}
                            className="rounded-xl bg-[#4d35dc] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3f2cc5]"
                        >
                            View Audit Report
                        </button>
                    </div>
                )}


            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}
            <CareVRFooter />
        </main>
    );
}

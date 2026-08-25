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
    error?: string;
}

interface CareJourneyProcessingWorkspaceProps {
    documents: File[];
    configuration: CareJourneyDisplayConfiguration;
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

export default function CareJourneyProcessingWorkspaceWOW({
    documents,
    configuration,
    persistedItems,
    onProcessingStateChange,
    onBack,
}: CareJourneyProcessingWorkspaceProps) {

const router = useRouter();

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

    if (auditAgentRef.current) {
        return;
    }

    try {

        auditAgentRef.current =
            startAuditAgent({
                runId:
                    crypto.randomUUID(),

                module:
                    "CARE_JOURNEY",

                documentCount:
                    documents.length,
            });

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


    const [items, setItems] = useState<CareJourneyDocumentWorkspaceItem[]>(
        initialItems
    );

    const [expandedDocument, setExpandedDocument] = useState<number | null>(
        null
    );

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

useEffect(() => {

    onProcessingStateChange?.(items);

    const agent =
        auditAgentRef.current;

    if (!agent) {
        return;
    }

    items.forEach(
        (item, index) => {

            const documentNumber =
                index + 1;

            if (
                item.status === "READING" &&
                !auditObservedDocumentsRef.current.has(
                    documentNumber
                )
            ) {

                auditObservedDocumentsRef.current.add(
                    documentNumber
                );

                recordAuditEvent({
                    type:
                        "DOCUMENT_STARTED",

                    runId:
                        agent.run.runId,

                    documentNumber,

                    pageCount:
                        1,

                    documentType:
                        "UNKNOWN",

                    readability:
                        "UNKNOWN",

                    timestamp:
                        Date.now(),
                });

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

            if (item.status === "COMPLETED") {

                if (
                    !auditCompletedDocumentsRef.current.has(
                        documentNumber
                    )
                ) {

                    auditCompletedDocumentsRef.current.add(
                        documentNumber
                    );

                    recordAuditEvent({
                        type:
                            "PAGE_COMPLETED",

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

                }

            }

        }
    );

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

useEffect(() => {

    const agent =
        auditAgentRef.current;

    if (!agent || !allComplete) {
        return;
    }

    if (
        agent.run.status === "COMPLETED"
    ) {
        return;
    }

    recordAuditEvent({
        type:
            "RUN_COMPLETED",

        runId:
            agent.run.runId,

        documentCount:
            items.length,

        totalPageCount:
            items.length,

        timestamp:
            Date.now(),
    });

    const completedAgent =
        completeAuditAgent(
            agent
        );

    auditAgentRef.current =
        completedAgent;

}, [allComplete, items.length]);



    const overallProgress =
        items.length === 0
            ? 0
            : Math.round((completedCount / items.length) * 100);

    const currentIndex = items.findIndex(
        item => item.status === "READING" || item.status === "EXTRACTING"
    );

    const activeIndex = currentIndex >= 0 ? currentIndex : Math.min(completedCount, Math.max(items.length - 1, 0));
    const activeItem = items[activeIndex];

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
                            onClick={onBack}
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
                    HERO / INTELLIGENCE INTRO
                ================================================= */}
                <section className="relative overflow-hidden rounded-[28px] border border-[#e4e5f5] bg-white px-7 py-8 shadow-[0_16px_50px_rgba(37,42,93,0.07)] sm:px-10 sm:py-10">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#e9e6ff] blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#e5f3ff] blur-3xl" />

                    <div className="relative flex flex-col items-center text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eeeaff] to-[#dfeaff] shadow-[0_12px_30px_rgba(77,53,220,0.14)]">
                            <Sparkles className="h-8 w-8 text-[#4d35dc]" />
                        </div>

                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#dedaff] bg-[#f8f7ff] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#5946d9]">
                            CareVR Intelligence
                        </div>

                        <h1 className="max-w-[760px] text-3xl font-extrabold tracking-[-0.04em] text-[#17204a] sm:text-[42px] sm:leading-[1.08]">
                            Understanding your health records
                        </h1>

                        <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-[#69708d] sm:text-base">
                            CareVR is carefully reading your documents and finding the information that matters for this Care Journey.
                        </p>
                    </div>
                </section>

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
                                            onClick={() =>
                                                setExpandedDocument(
                                                    isExpanded ? null : index
                                                )
                                            }
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
                    EXTRACTED INFORMATION / RESULT PLACEHOLDER

                    This intentionally does not invent extracted values.
                    Strataparse will populate this area in the next step.
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
                                Information relevant to this Care Journey will appear here.
                            </p>
                        </div>

                        <div className="hidden rounded-full bg-[#f3f1ff] px-3 py-1.5 text-xs font-bold text-[#5140d0] sm:block">
                            Care Journey
                        </div>
                    </div>

                    <div className="py-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f4ff] text-[#4d35dc]">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-base font-extrabold text-[#30375d]">
                            {allComplete
                                ? "Your information is ready"
                                : "Your information is being understood"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-[560px] text-sm leading-6 text-[#7a809d]">
                            CareVR will show only the information requested by this Care Journey configuration. It will not guess missing information or replace source values.
                        </p>
                    </div>
                </section>

{allComplete && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/admin/Audit")
                            }
                            className="rounded-xl bg-[#4d35dc] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3f2cc5]"
                        >
                            View Audit Report
                        </button>
                    </div>
                )}

                {/* =================================================
                    TRUST
                ================================================= */}
                <section className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[#e0e5f4] bg-gradient-to-r from-white to-[#f8faff] p-6 shadow-[0_10px_35px_rgba(37,42,93,0.04)] sm:flex-row sm:items-center sm:p-7">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0efff] text-[#4d35dc]">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-extrabold text-[#263057]">
                            Your health information is protected
                        </h3>
                        <p className="mt-1 max-w-[760px] text-sm leading-6 text-[#737a97]">
                            CareVR keeps the processing experience focused on the documents and Care Journey configuration you provided.
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-5 w-5" />
                    </div>
                </section>
            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}
            <footer className="border-t border-[#dfe2f1] bg-[#17234f] text-white">
                <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="font-extrabold tracking-wide">CareVR</div>
                        <div className="mt-1 text-xs text-white/60">
                            Intelligent. Secure. Built around the Care Journey.
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-white/75">
                        <ShieldCheck className="h-5 w-5" />
                        Secure · Private · Trusted
                    </div>
                </div>
            </footer>
        </main>
    );
}

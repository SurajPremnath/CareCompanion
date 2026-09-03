"use client";

import {
    useEffect,
    useState,
} from "react";

/**
 * CareVR AI Test Audit
 *
 * Founder-facing Audit page.
 *
 * Responsibility:
 * - Select Product.
 * - Select Rule.
 * - Select an actual persisted audit run.
 * - Display the run details.
 * - Display the Test Run Summary.
 * - Display Test Coverage.
 * - Display the actual Document Inventory.
 *
 * IMPORTANT:
 *
 * This page is read-only.
 *
 * It does not:
 * - start an audit
 * - control Strataparse
 * - invoke AI models
 * - modify prompts
 * - modify extraction
 * - modify audit evidence
 * - calculate audit evidence
 *
 * The database is the source of truth for completed
 * or persisted audit runs.
 */

interface AuditProduct {
    product_id:
        string;

    product_name:
        string;
}

interface AuditRule {
    rule_id:
        string;

    product_id:
        string;

    rule:
        string;
}

interface AuditRun {
    run_id:
        string;

    product_id:
        string;

    rule_id:
        string;

    run_date:
        string;

    run_started_at:
        string | null;

    run_ended_at:
        string | null;

    audit_status:
        string;

    audit_status_reason:
        string | null;

    document_count:
        number;

    completed_documents:
        number;

    failed_documents:
        number;

    total_pages:
        number;

    request_count:
        number;

    completed_requests:
        number;

    failed_requests:
        number;

    input_tokens:
        number;

    output_tokens:
        number;

    total_tokens:
        number;

    total_cost:
        number;

    currency:
        string;

    rule_snapshot:
        string | null;

    metadata:
        Record<string, unknown>;

    accuracy?:
        {
            evaluatedItems:
                number;

            correctItems:
                number;

            missedItems:
                number;

            incorrectItems:
                number;

            accuracyPercentage:
                number |
                undefined;

            misses:
                Array<{
                    itemId:
                        string;

                    field:
                        string;

                    expected:
                        unknown;

                    actual:
                        unknown;

                    reason:
                        string;
                }>;
        };
}


interface AuditAccuracyMiss {
    itemId:
        string;

    field:
        string;

    expected:
        unknown;

    actual:
        unknown;

    reason:
        string;
}


interface AuditAccuracy {
    evaluatedItems:
        number;

    correctItems:
        number;

    missedItems:
        number;

    incorrectItems:
        number;

    accuracyPercentage:
        number |
        undefined;

    misses:
        AuditAccuracyMiss[];
}

interface AuditDocumentInventoryItem {
    documentNumber:
        number;

    fileName:
        string;

    fileType:
        string;

    documentType?:
        string;

    pageCount?:
        number;

    status?:
        string;
}


interface AuditModelEvidence {
    documentNumber:
        number;

    documentType:
        string;

    readability:
        string;

    pageCount:
        number;

    expectedTier:
        string;

    modelTiers:
        string[];

    actualModels:
        string[];

    rightModelUsed:
        "YES" |
        "NO" |
        "NOT_DETERMINABLE";

    difficultyBasedModelChange:
        "YES" |
        "NO" |
        "NOT_DETERMINABLE";

    modelChanges:
        Array<{
            fromTier:
                string;

            toTier:
                string;

            fromModel:
                string;

            toModel:
                string;

            pageNumber:
                number;
        }>;
}

export default function AuditAdminPage() {

    const [
        products,
        setProducts,
    ] = useState<AuditProduct[]>([]);

    const [
        rules,
        setRules,
    ] = useState<AuditRule[]>([]);

    const [
        runs,
        setRuns,
    ] = useState<AuditRun[]>([]);

    const [
        selectedProduct,
        setSelectedProduct,
    ] = useState("");

    const [
        selectedRule,
        setSelectedRule,
    ] = useState("");

    const [
        selectedRunId,
        setSelectedRunId,
    ] = useState("");

    const [
        selectedRun,
        setSelectedRun,
    ] = useState<AuditRun | null>(null);

const [
    documents,
    setDocuments,
] = useState<AuditDocumentInventoryItem[]>([]);

const [
    pageExecution,
    setPageExecution,
] = useState<
    Array<{
        documentNumber: number;
        pageNumber: number;
        started: boolean;
        completed: boolean;
    }>
>([]);

const [
    modelEvidence,
    setModelEvidence,
] = useState<AuditModelEvidence[]>([]);

const [
    accuracy,
    setAccuracy,
] = useState<AuditAccuracy | null>(
    null
);

const [
    loading,
    setLoading,
] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    /*
     * Load the available Founder Audit products.
     *
     * Product selection is database-backed rather than
     * hardcoded into the Founder UI.
     */
    useEffect(() => {

        let cancelled = false;

        async function loadProducts() {

            try {

                setError("");

                const response =
                    await fetch(
                        "/api/admin/audit/products"
                    );

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "Unable to load audit products."
                    );
                }

                const data =
                    await response.json();

                if (
                    !cancelled
                ) {
                    setProducts(
                        Array.isArray(
                            data.products
                        )
                            ? data.products
                            : []
                    );
                }

            } catch (
                loadError
            ) {

                if (
                    !cancelled
                ) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load audit products."
                    );
                }
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };

    }, []);


    /*
     * Load rules only after a Product has been selected.
     */
    useEffect(() => {

        setRules([]);
        setSelectedRule("");
        setRuns([]);
        setSelectedRunId("");
        setSelectedRun(null);
        setDocuments([]);
        setPageExecution([]);
        setModelEvidence([]);
        setAccuracy(null);

        if (
            !selectedProduct
        ) {
            return;
        }

        let cancelled = false;

        async function loadRules() {

            try {

                setError("");

                const response =
                    await fetch(
                        `/api/admin/audit/rules?productId=${encodeURIComponent(
                            selectedProduct
                        )}`
                    );

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "Unable to load audit rules."
                    );
                }

                const data =
                    await response.json();

                if (
                    !cancelled
                ) {
                    setRules(
                        Array.isArray(
                            data.rules
                        )
                            ? data.rules
                            : []
                    );
                }

            } catch (
                loadError
            ) {

                if (
                    !cancelled
                ) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load audit rules."
                    );
                }
            }
        }

        loadRules();

        return () => {
            cancelled = true;
        };

    }, [
        selectedProduct,
    ]);


    /*
     * Load actual persisted audit runs after Product + Rule
     * have both been selected.
     */
    useEffect(() => {

        setRuns([]);
        setSelectedRunId("");
        setSelectedRun(null);
        setDocuments([]);

        if (
            !selectedProduct ||
            !selectedRule
        ) {
            return;
        }

        let cancelled = false;

        async function loadRuns() {

            try {

                setError("");
                setLoading(true);

                const response =
                    await fetch(
                        `/api/admin/audit/runs?productId=${encodeURIComponent(
                            selectedProduct
                        )}&ruleId=${encodeURIComponent(
                            selectedRule
                        )}`
                    );

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "Unable to load audit runs."
                    );
                }

                const data =
                    await response.json();

                if (
                    !cancelled
                ) {
                    setRuns(
                        Array.isArray(
                            data.runs
                        )
                            ? data.runs
                            : []
                    );
                }

            } catch (
                loadError
            ) {

                if (
                    !cancelled
                ) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load audit runs."
                    );
                }

            } finally {

                if (
                    !cancelled
                ) {
                    setLoading(false);
                }
            }
        }

        loadRuns();

        return () => {
            cancelled = true;
        };

    }, [
        selectedProduct,
        selectedRule,
    ]);


    /*
     * Load one selected run and its actual document inventory.
     */
    useEffect(() => {

        setSelectedRun(null);
        setDocuments([]);

        if (
            !selectedRunId
        ) {
            return;
        }

        let cancelled = false;

        async function loadRun() {

            try {

                setError("");
                setLoading(true);

                const response =
                    await fetch(
                        `/api/admin/audit/runs/${encodeURIComponent(
                            selectedRunId
                        )}`
                    );

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "Unable to load audit run."
                    );
                }

                const data =
                    await response.json();

                if (
                    !cancelled
                ) {

                    setSelectedRun(
    data.run ?? null
);

setDocuments(
    Array.isArray(
        data.documents
    )
        ? data.documents
        : []
);

setPageExecution(
    Array.isArray(
        data.pageExecution
    )
        ? data.pageExecution
        : []
);

setModelEvidence(
    Array.isArray(
        data.modelEvidence
    )
        ? data.modelEvidence
        : []
);

setAccuracy(
    data.accuracy &&
    typeof data.accuracy ===
        "object"
        ? data.accuracy
        : null
);
                }

            } catch (
                loadError
            ) {

                if (
                    !cancelled
                ) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load audit run."
                    );
                }

            } finally {

                if (
                    !cancelled
                ) {
                    setLoading(false);
                }
            }
        }

        loadRun();

        return () => {
            cancelled = true;
        };

    }, [
        selectedRunId,
    ]);


    const selectedProductName =
        products.find(
            product =>
                product.product_id ===
                selectedProduct
        )?.product_name ??
        "";


    const selectedRuleName =
        rules.find(
            rule =>
                rule.rule_id ===
                selectedRule
        )?.rule ??
        "";


    const selectedAccuracy =
        selectedRun &&
        selectedRun.metadata &&
        typeof selectedRun.metadata.accuracy ===
            "object" &&
        selectedRun.metadata.accuracy !== null
            ? selectedRun.metadata.accuracy as {
                evaluatedItems:
                    number;

                correctItems:
                    number;

                missedItems:
                    number;

                incorrectItems:
                    number;

                accuracyPercentage?:
                    number;

                misses?:
                    Array<{
                        itemId:
                            string;

                        field:
                            string;

                        expected:
                            unknown;

                        actual:
                            unknown;

                        reason:
                            string;
                    }>;
            }
            : null;

const singlePageDocuments =
    documents.filter(
        document =>
            document.pageCount === 1
    ).length;


const multiPageDocuments =
    documents.filter(
        document =>
            typeof document.pageCount ===
                "number" &&
            document.pageCount > 1
    ).length;


const averageCostPerDocument =
    selectedRun &&
    selectedRun.document_count > 0
        ? selectedRun.total_cost /
          selectedRun.document_count
        : 0;


const accuracyPercentage =
    selectedAccuracy &&
    typeof selectedAccuracy.accuracyPercentage ===
        "number"
        ? `${selectedAccuracy.accuracyPercentage}%`
        : "NOT EVALUATED";


const modelSelectionAssessment =
    modelEvidence.length === 0
        ? "NOT OBSERVED"
        : modelEvidence.some(
            evidence =>
                evidence.rightModelUsed ===
                "NO"
        )
            ? "Incorrect"
            : modelEvidence.every(
                evidence =>
                    evidence.rightModelUsed ===
                    "YES"
            )
                ? "Correct"
                : "NOT DETERMINABLE";


const difficultyBasedModelChangeAssessment =
    modelEvidence.length === 0
        ? "NOT OBSERVED"
        : modelEvidence.some(
            evidence =>
                evidence.difficultyBasedModelChange ===
                "YES"
        )
            ? "Yes"
            : modelEvidence.every(
                evidence =>
                    evidence.difficultyBasedModelChange ===
                    "NO"
            )
                ? "No"
                : "NOT DETERMINABLE";


const firstAccuracyMiss =
    selectedAccuracy &&
    Array.isArray(
        selectedAccuracy.misses
    ) &&
    selectedAccuracy.misses.length > 0
        ? selectedAccuracy.misses[0]
        : null;


    return (
        <main className="min-h-screen bg-[#f7f7fb]">

            {/* =====================================================
                FOUNDER AUDIT SELECTION
            ===================================================== */}

            <section className="mx-auto max-w-[1180px] px-6 pb-6 pt-8">

                <div className="rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)] sm:p-7">

                    <div className="mb-6">

                        <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                            Founder Audit
                        </div>

                        <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.02em] text-[#18204a]">
                            Audit Reports
                        </h1>

                        <p className="mt-1 text-sm text-[#7a809d]">
                            Select a product, rule and completed audit run.
                        </p>

                    </div>


                    <div className="grid gap-5 md:grid-cols-3">

                        {/* PRODUCT */}

                        <div>

                            <label
                                htmlFor="audit-product"
                                className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]"
                            >
                                Product
                            </label>

                            <select
                                id="audit-product"
                                value={selectedProduct}
                                onChange={(event) => {
                                    setSelectedProduct(
                                        event.target.value
                                    );
                                }}
                                className="h-12 w-full rounded-xl border border-[#dfe1ef] bg-white px-4 text-sm font-semibold text-[#30375d] outline-none"
                            >

                                <option value="">
                                    Select Product
                                </option>

                                {products.map(
                                    product => (
                                        <option
                                            key={
                                                product.product_id
                                            }
                                            value={
                                                product.product_id
                                            }
                                        >
                                            {
                                                product.product_name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* RULE */}

                        <div>

                            <label
                                htmlFor="audit-rule"
                                className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]"
                            >
                                Rule
                            </label>

                            <select
                                id="audit-rule"
                                value={selectedRule}
                                onChange={(event) => {
                                    setSelectedRule(
                                        event.target.value
                                    );
                                }}
                                disabled={
                                    !selectedProduct
                                }
                                className="h-12 w-full rounded-xl border border-[#dfe1ef] bg-white px-4 text-sm font-semibold text-[#30375d] outline-none disabled:cursor-not-allowed disabled:bg-[#f7f7fb]"
                            >

                                <option value="">
                                    Select Rule
                                </option>

                                {rules.map(
                                    rule => (
                                        <option
                                            key={
                                                `${rule.product_id}-${rule.rule_id}`
                                            }
                                            value={
                                                rule.rule_id
                                            }
                                        >
                                            {
                                                rule.rule
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* RUN */}

                        <div>

                            <label
                                htmlFor="audit-run"
                                className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]"
                            >
                                Audit Run
                            </label>

                            <select
                                id="audit-run"
                                value={selectedRunId}
                                onChange={(event) => {
                                    setSelectedRunId(
                                        event.target.value
                                    );
                                }}
                                disabled={
                                    !selectedRule ||
                                    loading
                                }
                                className="h-12 w-full rounded-xl border border-[#dfe1ef] bg-white px-4 text-sm font-semibold text-[#30375d] outline-none disabled:cursor-not-allowed disabled:bg-[#f7f7fb]"
                            >

                                <option value="">
                                    Select Run
                                </option>

                                {runs.map(
                                    run => (
                                        <option
                                            key={
                                                run.run_id
                                            }
                                            value={
                                                run.run_id
                                            }
                                        >
                                            {
                                                run.run_id
                                            } — {
                                                run.run_date
                                            } — {
                                                run.audit_status
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-[#f0caca] bg-[#fff7f7] px-4 py-3 text-sm font-semibold text-[#9b3d3d]">
                            {error}
                        </div>
                    )}

                </div>

            </section>


            {/* =====================================================
                SELECTED RUN
            ===================================================== */}

            {selectedRun && (
                <section className="mx-auto max-w-[1180px] px-6 pb-10">

                    {/* RUN DETAILS */}

                    <div className="rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)]">

                        <div className="mb-5">

                            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                                Run Details
                            </div>

                            <h2 className="mt-1 text-xl font-extrabold text-[#18204a]">
                                {selectedProductName}
                            </h2>

                            <p className="mt-1 text-sm text-[#7a809d]">
                                {selectedRuleName}
                            </p>

                        </div>


                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <AuditMetric
                                label="Run ID"
                                value={
                                    selectedRun.run_id
                                }
                            />

                            <AuditMetric
                                label="Run Date"
                                value={
                                    selectedRun.run_date
                                }
                            />

                            <AuditMetric
                                label="Status"
                                value={
                                    selectedRun.audit_status
                                }
                            />

                            <AuditMetric
                                label="Documents"
                                value={
                                    String(
                                        selectedRun.document_count
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        TEST RUN SUMMARY
                    ================================================= */}

                    <div className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)]">

                        <div className="mb-5">

                            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                                Test Run Summary
                            </div>

                            <h2 className="mt-1 text-xl font-extrabold text-[#18204a]">
                                Executive Summary
                            </h2>

                        </div>


                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <AuditMetric
                                label="Documents"
                                value={
                                    String(
                                        selectedRun.document_count
                                    )
                                }
                            />

                            <AuditMetric
                                label="Completed"
                                value={
                                    String(
                                        selectedRun.completed_documents
                                    )
                                }
                            />

                            <AuditMetric
                                label="Failed"
                                value={
                                    String(
                                        selectedRun.failed_documents
                                    )
                                }
                            />

                            <AuditMetric
                                label="Total Pages"
                                value={
                                    String(
                                        selectedRun.total_pages
                                    )
                                }
                            />

                            <AuditMetric
                                label="Requests"
                                value={
                                    String(
                                        selectedRun.request_count
                                    )
                                }
                            />

                            <AuditMetric
                                label="Completed Requests"
                                value={
                                    String(
                                        selectedRun.completed_requests
                                    )
                                }
                            />

                            <AuditMetric
                                label="Failed Requests"
                                value={
                                    String(
                                        selectedRun.failed_requests
                                    )
                                }
                            />

<AuditMetric
    label="Total Tokens"
    value={
        String(
            selectedRun.total_tokens
        )
    }
/>

<AuditMetric
    label="Avg Tokens / Request"
    value={
        selectedRun.request_count > 0
            ? Math.round(
                selectedRun.total_tokens /
                selectedRun.request_count
            ).toLocaleString()
            : "0"
    }
/>

                        </div>

                    </div>


                    {/* =================================================
                        ACCURACY EVALUATION
                    ================================================= */}

                    <div className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)]">

                        <div className="mb-5">

                            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                                Accuracy Evaluation
                            </div>

                            <h2 className="mt-1 text-xl font-extrabold text-[#18204a]">
                                Gold Standard Comparison
                            </h2>

                            <p className="mt-1 text-sm text-[#7a809d]">
                                Expected clinical evidence compared with the
                                actual CareVR extraction.
                            </p>

                        </div>


                        {!selectedAccuracy ? (

                            <div className="rounded-xl border border-[#e5e6f2] bg-[#fafaff] px-5 py-8 text-center text-sm font-semibold text-[#737a99]">
                                No accuracy evaluation is available for this run.
                            </div>

                        ) : (

                            <>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                                    <AuditMetric
                                        label="Accuracy"
                                        value={
                                            selectedAccuracy.accuracyPercentage !==
                                            undefined
                                                ? `${selectedAccuracy.accuracyPercentage}%`
                                                : "—"
                                        }
                                    />

                                    <AuditMetric
                                        label="Evaluated"
                                        value={
                                            String(
                                                selectedAccuracy.evaluatedItems
                                            )
                                        }
                                    />

                                    <AuditMetric
                                        label="Correct"
                                        value={
                                            String(
                                                selectedAccuracy.correctItems
                                            )
                                        }
                                    />

                                    <AuditMetric
                                        label="Missed"
                                        value={
                                            String(
                                                selectedAccuracy.missedItems
                                            )
                                        }
                                    />

                                    <AuditMetric
                                        label="Incorrect"
                                        value={
                                            String(
                                                selectedAccuracy.incorrectItems
                                            )
                                        }
                                    />

                                </div>


                                {Array.isArray(
                                    selectedAccuracy.misses
                                ) &&
                                selectedAccuracy.misses.length > 0 && (

                                    <div className="mt-6">

                                        <div className="mb-3 text-sm font-extrabold text-[#18204a]">
                                            Accuracy Misses
                                        </div>

                                        <div className="overflow-x-auto">

                                            <table className="w-full min-w-[760px] text-left">

                                                <thead>

                                                    <tr className="border-b border-[#e5e6f2]">

                                                        <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                            Field
                                                        </th>

                                                        <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                            Expected
                                                        </th>

                                                        <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                            Actual
                                                        </th>

                                                        <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                            Reason
                                                        </th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {selectedAccuracy.misses.map(
                                                        (
                                                            miss,
                                                            index
                                                        ) => (

                                                            <tr
                                                                key={
                                                                    `${miss.itemId}-${index}`
                                                                }
                                                                className="border-b border-[#f0f0f6] last:border-0"
                                                            >

                                                                <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                                    {
                                                                        miss.field
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-[#737a99]">
                                                                    {
                                                                        typeof miss.expected ===
                                                                        "string"
                                                                            ? miss.expected
                                                                            : JSON.stringify(
                                                                                miss.expected
                                                                            )
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-[#737a99]">
                                                                    {
                                                                        typeof miss.actual ===
                                                                        "string"
                                                                            ? miss.actual
                                                                            : JSON.stringify(
                                                                                miss.actual
                                                                            )
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-[#737a99]">
                                                                    {
                                                                        miss.reason
                                                                    }
                                                                </td>

                                                            </tr>

                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                )}

                            </>

                        )}

                    </div>

                    {/* =================================================
                        TEST COVERAGE
                    ================================================= */}

                    <div className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)]">

                        <div className="mb-5">

                            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                                Test Coverage
                            </div>

                            <h2 className="mt-1 text-xl font-extrabold text-[#18204a]">
                                Documents and Pages
                            </h2>

                        </div>


                        <div className="grid gap-4 sm:grid-cols-3">

                            <AuditMetric
                                label="Documents"
                                value={
                                    String(
                                        selectedRun.document_count
                                    )
                                }
                            />

                            <AuditMetric
                                label="Single-page"
                                value={
                                    String(
                                        singlePageDocuments
                                    )
                                }
                            />

                            <AuditMetric
                                label="Multi-page"
                                value={
                                    String(
                                        multiPageDocuments
                                    )
                                }
                            />

                        </div>


                        {/* =================================================
                            OBSERVED PAGE EXECUTION
                        ================================================= */}

                        <div className="mt-6">

                            <div className="mb-3 text-sm font-extrabold text-[#18204a]">
                                Observed Page Execution
                            </div>


                            {pageExecution.length === 0 ? (

                                <div className="rounded-xl border border-[#e5e6f2] bg-[#fafaff] px-5 py-8 text-center text-sm font-semibold text-[#737a99]">
                                    No page execution evidence is available for this run.
                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[620px] text-left">

                                        <thead>

                                            <tr className="border-b border-[#e5e6f2]">

                                                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                    Document
                                                </th>

                                                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                    Page
                                                </th>

                                                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                    Started
                                                </th>

                                                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                    Completed
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {pageExecution.map(
                                                page => (

                                                    <tr
                                                        key={
                                                            `${page.documentNumber}-${page.pageNumber}`
                                                        }
                                                        className="border-b border-[#f0f0f6] last:border-0"
                                                    >

                                                        <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                            {
                                                                page.documentNumber
                                                            }
                                                        </td>

                                                        <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                            {
                                                                page.pageNumber
                                                            }
                                                        </td>

                                                        <td className="px-4 py-4 text-sm font-semibold text-[#737a99]">
                                                            {
                                                                page.started
                                                                    ? "YES"
                                                                    : "NO"
                                                            }
                                                        </td>

                                                        <td className="px-4 py-4 text-sm font-semibold text-[#737a99]">
                                                            {
                                                                page.completed
                                                                    ? "YES"
                                                                    : "NO"
                                                            }
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        DOCUMENT INVENTORY — STEP 4
                    ================================================= */}

                    <div className="mt-6 rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)]">

                        <div className="mb-5">

                            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                                Document Inventory
                            </div>

                            <h2 className="mt-1 text-xl font-extrabold text-[#18204a]">
                                Actual Documents Tested
                            </h2>

                            <p className="mt-1 text-sm text-[#7a809d]">
                                Documents recorded for this audit run.
                            </p>

                        </div>


                        {documents.length === 0 ? (

                            <div className="rounded-xl border border-[#e5e6f2] bg-[#fafaff] px-5 py-8 text-center text-sm font-semibold text-[#737a99]">
                                No document inventory is available for this run.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[720px] text-left">

                                    <thead>

                                        <tr className="border-b border-[#e5e6f2]">

                                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                #
                                            </th>

                                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                Document
                                            </th>

                                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                File Type
                                            </th>

                                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                Document Type
                                            </th>

                                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                Pages
                                            </th>

                                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {documents.map(
                                            document => (

                                                <tr
                                                    key={
                                                        document.documentNumber
                                                    }
                                                    className="border-b border-[#f0f0f6] last:border-0"
                                                >

                                                    <td className="px-4 py-4 text-sm font-bold text-[#30375d]">
                                                        {
                                                            document.documentNumber
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                        {
                                                            document.fileName
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-[#737a99]">
                                                        {
                                                            document.fileType
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-[#737a99]">
                                                        {
                                                            document.documentType ??
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                        {
                                                            document.pageCount ??
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-[#737a99]">
                                                        {
                                                            document.status ??
                                                            "—"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </section>
            )}

{/* =====================================================
    MODEL SELECTION / ROUTING EVIDENCE
===================================================== */}

<section className="mx-auto max-w-[1180px] px-6 pb-6">

    <div className="rounded-[24px] border border-[#e5e6f2] bg-white p-6 shadow-[0_10px_35px_rgba(37,42,93,0.05)] sm:p-7">

        <div className="mb-6">

            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#737a99]">
                Model Selection Evidence
            </div>

            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-[#18204a]">
                Model Routing
            </h2>

            <p className="mt-1 text-sm text-[#7a809d]">
                Observed classification, routing tier, actual model,
                and model changes recorded during processing.
            </p>

        </div>


        {modelEvidence.length === 0 ? (

            <div className="rounded-xl border border-[#e5e6f2] bg-[#fafaff] px-5 py-8 text-center text-sm font-semibold text-[#737a99]">
                No model selection evidence is available for this run.
            </div>

        ) : (

            <div className="space-y-5">

                {modelEvidence.map(
                    evidence => (

                        <div
                            key={
                                evidence.documentNumber
                            }
                            className="rounded-2xl border border-[#e5e6f2] bg-[#fafaff] p-5"
                        >

                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                                <div>

                                    <div className="text-sm font-extrabold text-[#18204a]">
                                        Document {
                                            evidence.documentNumber
                                        }
                                    </div>

                                    <div className="mt-1 text-xs font-semibold text-[#737a99]">
                                        {
                                            evidence.documentType
                                        }
                                    </div>

                                </div>

                            </div>


                            <div className="grid gap-4 md:grid-cols-4">

                                <AuditMetric
                                    label="Difficulty"
                                    value={
                                        evidence.readability
                                    }
                                />

                                <AuditMetric
                                    label="Expected Tier"
                                    value={
                                        evidence.expectedTier
                                    }
                                />

                                <AuditMetric
                                    label="Observed Tier"
                                    value={
                                        evidence.modelTiers.length > 0
                                            ? evidence.modelTiers.join(
                                                ", "
                                            )
                                            : "NOT OBSERVED"
                                    }
                                />

                                <AuditMetric
                                    label="Actual Model"
                                    value={
                                        evidence.actualModels.length > 0
                                            ? evidence.actualModels.join(
                                                ", "
                                            )
                                            : "NOT OBSERVED"
                                    }
                                />

                            </div>


                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                                <AuditMetric
                                    label="Right Model Used"
                                    value={
                                        evidence.rightModelUsed
                                    }
                                />

                                <AuditMetric
                                    label="Difficulty-Based Model Change"
                                    value={
                                        evidence.difficultyBasedModelChange
                                    }
                                />

                            </div>


                            <div className="mt-5">

                                <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                    Observed Model Changes
                                </div>


                                {evidence.modelChanges.length === 0 ? (

                                    <div className="rounded-xl border border-[#e5e6f2] bg-white px-4 py-4 text-sm font-semibold text-[#737a99]">
                                        No model change was observed.
                                    </div>

                                ) : (

                                    <div className="overflow-x-auto">

                                        <table className="w-full min-w-[760px] text-left">

                                            <thead>

                                                <tr className="border-b border-[#e5e6f2]">

                                                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                        Page
                                                    </th>

                                                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                        From Tier
                                                    </th>

                                                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                        To Tier
                                                    </th>

                                                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                        From Model
                                                    </th>

                                                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                                                        To Model
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {evidence.modelChanges.map(
                                                    (
                                                        change,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={`${evidence.documentNumber}-${change.pageNumber}-${index}`}
                                                            className="border-b border-[#f0f0f6] last:border-0"
                                                        >

                                                            <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                                {
                                                                    change.pageNumber
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 text-sm text-[#737a99]">
                                                                {
                                                                    change.fromTier
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                                {
                                                                    change.toTier
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 text-sm text-[#737a99]">
                                                                {
                                                                    change.fromModel
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 text-sm font-semibold text-[#30375d]">
                                                                {
                                                                    change.toModel
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                        </div>

                    )
                )}

            </div>

        )}

    </div>

</section>

        </main>



    );
}


/**
 * Small read-only metric used by the Founder audit page.
 */
function AuditMetric(
    {
        label,
        value,
    }: {
        label:
            string;

        value:
            string;
    }
) {

    return (
        <div className="rounded-xl border border-[#e8e9f2] bg-[#fafaff] p-4">

            <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#737a99]">
                {label}
            </div>

            <div className="mt-2 break-words text-lg font-extrabold text-[#18204a]">
                {value}
            </div>

        </div>
    );
}
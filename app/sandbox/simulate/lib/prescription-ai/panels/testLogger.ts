import fs from "fs";
import path from "path";

// ============================================================
// DOCTOR NOTES QA TEST LOGGING
// Temporary QA instrumentation.
// Purpose:
// 1. Record every completed Doctor's Notes extraction.
// 2. Preserve the exact raw AI output.
// 3. Create a clean test-run record for later gap analysis.
//
// IMPORTANT:
// - This logger records OBSERVATIONS only.
// - It does not decide whether the AI result is correct.
// - Human QA findings are recorded separately.
// Remove this file and its route integration after QA is complete.
// ============================================================

// ============================================================
// QA STORAGE LOCATION
// Keep all Doctor's Notes QA files together under:
// C:\\Users\\Suraj\\CareCompanion\\qa\\doctor-notes
// ============================================================

const QA_DIR = path.join(
    process.cwd(),
    "qa",
    "doctor-notes"
);

const RUNS_CSV_PATH = path.join(
    QA_DIR,
    "doctor-notes-test-runs.csv"
);

const FINDINGS_CSV_PATH = path.join(
    QA_DIR,
    "doctor-notes-test-findings.csv"
);

// doctor-notes-final.xlsx is intentionally NOT written by this logger.
// It is the final QA/specification workbook and will be prepared
// deliberately after the test cycle is complete.

// Exact raw AI outputs are kept separately so every test can be
// reviewed later without putting large JSON blobs into the CSV.
const RAW_OUTPUT_DIR = path.join(
    QA_DIR,
    "raw"
);

const RUNS_HEADER = [
    "Test Number",
    "Documents Uploaded",
    "Document Count",
    "Reading Time (ms)",
    "AI Extraction Successful",
    "Raw AI Output File",
    "Extraction Status",
    "QA Status",
    "Overall Result",
].join(",") + "\n";

const FINDINGS_HEADER = [
    "Test Number",
    "Category",
    "Expected From Document",
    "AI Extracted",
    "UI Displayed",
    "Result",
    "Gap",
    "Severity",
].join(",") + "\n";

function ensureQaDirectory(): void {
    fs.mkdirSync(
        QA_DIR,
        { recursive: true }
    );

    fs.mkdirSync(
        RAW_OUTPUT_DIR,
        { recursive: true }
    );

    if (!fs.existsSync(RUNS_CSV_PATH)) {
        fs.writeFileSync(
            RUNS_CSV_PATH,
            RUNS_HEADER,
            "utf8"
        );
    }

    if (!fs.existsSync(FINDINGS_CSV_PATH)) {
        fs.writeFileSync(
            FINDINGS_CSV_PATH,
            FINDINGS_HEADER,
            "utf8"
        );
    }
}

function csvEscape(
    value: unknown
): string {
    const text =
        value == null
            ? ""
            : String(value);

    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n") ||
        text.includes("\r")
    ) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

// ============================================================
// Automatically assign the next test number.
// Existing tests are never overwritten.
// ============================================================

function getNextTestNumber(): number {
    if (!fs.existsSync(RUNS_CSV_PATH)) {
        return 1;
    }

    const contents =
        fs.readFileSync(
            RUNS_CSV_PATH,
            "utf8"
        );

    const lines =
        contents
            .split(/\r?\n/)
            .filter(Boolean);

    return Math.max(
        1,
        lines.length
    );
}

export interface DoctorNotesTestRun {
    documentsUploaded: string[];
    readingTimeMs: number;
    rawAiOutput: string;
    aiExtractionSuccessful: boolean;
    extractionStatus: string;
    overallResult: string;
}

export interface DoctorNotesTestFinding {
    testNumber: number;
    category: string;
    expectedFromDocument?: string;
    aiExtracted?: string;
    uiDisplayed?: string;
    result?: string;
    gap?: string;
    severity?: string;
}

// ============================================================
// Record one completed automatic extraction.
// ============================================================

export function appendDoctorNotesTestRun(
    result: DoctorNotesTestRun
): number {

    ensureQaDirectory();

    const testNumber =
        getNextTestNumber();

    const rawFileName =
        `test-${String(testNumber).padStart(3, "0")}-raw.txt`;

    const rawFilePath =
        path.join(
            RAW_OUTPUT_DIR,
            rawFileName
        );

    fs.writeFileSync(
        rawFilePath,
        result.rawAiOutput,
        "utf8"
    );

    const row = [
        testNumber,
        result.documentsUploaded.join(" | "),
        result.documentsUploaded.length,
        result.readingTimeMs,
        result.aiExtractionSuccessful ? "YES" : "NO",
        path.relative(
            process.cwd(),
            rawFilePath
        ),
        result.extractionStatus,
        "PENDING",
        result.overallResult,
    ]
        .map(csvEscape)
        .join(",") + "\n";

    fs.appendFileSync(
        RUNS_CSV_PATH,
        row,
        "utf8"
    );

    return testNumber;
}

// ============================================================
// Human QA finding entry point.
//
// Use this AFTER reviewing the source document, raw AI output,
// and UI. This deliberately does not run automatically.
// ============================================================

export function appendDoctorNotesTestFinding(
    finding: DoctorNotesTestFinding
): void {

    ensureQaDirectory();

    const row = [
        finding.testNumber,
        finding.category,
        finding.expectedFromDocument ?? "",
        finding.aiExtracted ?? "",
        finding.uiDisplayed ?? "",
        finding.result ?? "",
        finding.gap ?? "",
        finding.severity ?? "",
    ]
        .map(csvEscape)
        .join(",") + "\n";

    fs.appendFileSync(
        FINDINGS_CSV_PATH,
        row,
        "utf8"
    );
}
# CareVR Care Journey - Strataparse and Audit Assessment

Generated: 2026-08-27 17:53:02 +05:30

This report is generated from the current files on disk.

## Executive assessment

### A - Strataparse capability: EVIDENCE FOUND
### B - Care Journey invokes Strataparse: NOT FOUND
### C - Audit Agent invocation: EVIDENCE FOUND
### C2 - Audit events: EVIDENCE FOUND

## A - Strataparse capability

### processStrataparseDocument
- `Strataparse\processing\processStrataparseDocument.ts` line 26: `export type ProcessStrataparseDocumentInput = {`
- `Strataparse\processing\processStrataparseDocument.ts` line 61: `export async function processStrataparseDocument(`
- `Strataparse\processing\processStrataparseDocument.ts` line 62: `input: ProcessStrataparseDocumentInput`

### assessDocument
- `Strataparse\processing\processStrataparseDocument.ts` line 8: `} from "@/Strataparse/routing/assessDocument";`
- `Strataparse\routing\assessDocument.ts` line 5: `type AssessDocumentInput = {`
- `Strataparse\routing\assessDocument.ts` line 48: `export function assessDocument(`
- `Strataparse\routing\assessDocument.ts` line 49: `input: AssessDocumentInput`

### extractPage
- `Strataparse\processing\processStrataparseDocument.ts` line 133: `await extractPage({`
- `Strataparse\processing\processStrataparseDocument.ts` line 161: `type ExtractPageInput = {`
- `Strataparse\processing\processStrataparseDocument.ts` line 180: `async function extractPage(`
- `Strataparse\processing\processStrataparseDocument.ts` line 181: `input: ExtractPageInput`

### assembleDocument
- `Strataparse\processing\processStrataparseDocument.ts` line 99: `await deassembleDocument(`
- `Strataparse\processing\processStrataparseDocument.ts` line 151: `assembleDocumentResults(`
- `Strataparse\processing\processStrataparseDocument.ts` line 443: `async function deassembleDocument(`
- `Strataparse\processing\processStrataparseDocument.ts` line 576: `function assembleDocumentResults(`

### resolveStrataparseModel
- `Strataparse\configuration\strataparseModels.ts` line 6: `export function resolveStrataparseModel(`
- `Strataparse\processing\processStrataparseDocument.ts` line 11: `resolveStrataparseModel,`
- `Strataparse\processing\processStrataparseDocument.ts` line 80: `resolveStrataparseModel(`
- `Strataparse\routing\modelConfiguration.ts` line 26: `export function resolveStrataparseModel(`

### documentType
- `Strataparse\ingestion\documentClassifier.ts` line 4: `StrataparseDocumentType,`
- `Strataparse\ingestion\documentClassifier.ts` line 5: `} from "./documentTypes";`
- `Strataparse\ingestion\documentClassifier.ts` line 17: `documentType: StrataparseDocumentType;`
- `Strataparse\ingestion\documentClassifier.ts` line 153: `documentType?: string;`
- `Strataparse\ingestion\documentClassifier.ts` line 157: `const validDocumentTypes:`
- `Strataparse\ingestion\documentClassifier.ts` line 158: `StrataparseDocumentType[] = [`
- `Strataparse\ingestion\documentClassifier.ts` line 175: `!parsed.documentType ||`
- `Strataparse\ingestion\documentClassifier.ts` line 176: `!validDocumentTypes.includes(`
- `Strataparse\ingestion\documentClassifier.ts` line 177: `parsed.documentType as StrataparseDocumentType`
- `Strataparse\ingestion\documentClassifier.ts` line 197: `documentType:`
- `Strataparse\ingestion\documentClassifier.ts` line 198: `parsed.documentType as StrataparseDocumentType,`
- `Strataparse\ingestion\documentIngestion.ts` line 10: `} from "./documentTypes";`
- `Strataparse\ingestion\documentIngestion.ts` line 51: `documentType:`
- `Strataparse\ingestion\documentIngestion.ts` line 52: `classification.documentType,`
- `Strataparse\ingestion\documentTypes.ts` line 22: `readonly documentType: StrataparseDocumentType;`
- `Strataparse\ingestion\documentTypes.ts` line 32: `export type StrataparseDocumentType =`
- `Strataparse\orchestration\strataparseEngine.ts` line 7: `} from "../ingestion/documentTypes";`
- `Strataparse\processing\processStrataparseDocument.ts` line 28: `documentType: string;`
- `Strataparse\processing\processStrataparseDocument.ts` line 34: `documentType: string;`
- `Strataparse\processing\processStrataparseDocument.ts` line 67: `documentType,`
- `Strataparse\processing\processStrataparseDocument.ts` line 90: `documentType,`
- `Strataparse\processing\processStrataparseDocument.ts` line 156: `documentType,`
- `Strataparse\prompts\documentClassificationPrompt.ts` line 95: `"documentType": "<CLASSIFICATION_CONSTANT>",`
- `Strataparse\prompts\promptBuilder.ts` line 59: `documentType: string,`
- `Strataparse\prompts\promptBuilder.ts` line 66: `documentType`
- `Strataparse\prompts\promptBuilder.ts` line 71: ``Unsupported Strataparse document type: ${documentType}``

## B - Care Journey to Strataparse

### WOW - Strataparse references
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 52: `- Strataparse processing`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 58: `The Strataparse request contract from the existing test`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 158: `* Page count belongs to Strataparse and must not be guessed`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 1129: `Strataparse will populate this area in the next step.`

### record-health - Strataparse references
- `app\record-health\page.tsx` line 68: `from "@/Components/dashboard/CareJourneyProcessingWorkspaceStrataparseTest";`

### WOW - processStrataparseDocument
_No matches found._

### record-health - processStrataparseDocument
_No matches found._

### WOW - fetch calls
_No matches found._

### record-health - fetch calls
_No matches found._

## C - Audit

### WOW - startAuditAgent
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 30: `startAuditAgent,`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 274: `startAuditAgent({`

### record-health - startAuditAgent
- `app\record-health\page.tsx` line 94: `startAuditAgent,`
- `app\record-health\page.tsx` line 371: `startAuditAgent({`

### WOW - recordAuditEvent
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 31: `recordAuditEvent,`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 443: `recordAuditEvent({`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 476: `recordAuditEvent({`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 519: `recordAuditEvent({`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 549: `recordAuditEvent({`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 591: `recordAuditEvent({`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 692: `recordAuditEvent({`

### record-health - recordAuditEvent
_No matches found._

### WOW - completeAuditAgent
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 32: `completeAuditAgent,`
- `Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx` line 727: `completeAuditAgent(`

### record-health - completeAuditAgent
_No matches found._

### Audit UI
- `app\admin\Audit\page.tsx` line 4: `* CareVR Test Audit`
- `app\admin\Audit\page.tsx` line 6: `* Founder/Admin Audit Summary Page.`
- `app\admin\Audit\page.tsx` line 9: `* - Read the completed AuditReport produced by CareVRTestAuditAgent.`
- `app\admin\Audit\page.tsx` line 10: `* - Convert measured audit evidence into the existing AuditSummary UI model.`
- `app\admin\Audit\page.tsx` line 11: `* - Render the existing AuditSummary component.`
- `app\admin\Audit\page.tsx` line 14: `* - This page does NOT start an audit.`
- `app\admin\Audit\page.tsx` line 17: `* - This page does NOT create or modify audit evidence.`
- `app\admin\Audit\page.tsx` line 27: `import AuditSummary, {`
- `app\admin\Audit\page.tsx` line 28: `type AuditSummaryModel,`
- `app\admin\Audit\page.tsx` line 29: `} from "@/CareVRTestAuditAgent/ui/summary/AuditSummary";`
- `app\admin\Audit\page.tsx` line 32: `getAllStoredAuditReports,`
- `app\admin\Audit\page.tsx` line 33: `} from "@/CareVRTestAuditAgent/runtime/auditReportStorage";`
- `app\admin\Audit\page.tsx` line 36: `AuditReport,`
- `app\admin\Audit\page.tsx` line 37: `} from "@/CareVRTestAuditAgent/runtime/auditReport";`
- `app\admin\Audit\page.tsx` line 164: `AuditReport,`
- `app\admin\Audit\page.tsx` line 243: `AuditReport`
- `app\admin\Audit\page.tsx` line 245: `AuditSummaryModel {`
- `app\admin\Audit\page.tsx` line 524: `* measured document count from the Audit Run without`
- `app\admin\Audit\page.tsx` line 657: `* The current AuditRun represents one module. Therefore`
- `app\admin\Audit\page.tsx` line 854: `export default function AuditAdminPage() {`
- `app\admin\Audit\page.tsx` line 861: `AuditSummaryModel |`
- `app\admin\Audit\page.tsx` line 876: `const loadAuditReport =`
- `app\admin\Audit\page.tsx` line 881: `getAllStoredAuditReports();`
- `app\admin\Audit\page.tsx` line 901: `* in the current in-memory audit store.`
- `app\admin\Audit\page.tsx` line 925: `loadAuditReport();`
- `app\admin\Audit\page.tsx` line 929: `loadAuditReport,`
- `app\admin\Audit\page.tsx` line 970: `CareVR AI Test Audit`
- `app\admin\Audit\page.tsx` line 982: `No completed audit report is currently`
- `app\admin\Audit\page.tsx` line 983: `available in the Audit Agent store.`
- `app\admin\Audit\page.tsx` line 989: `loadAuditReport`
- `app\admin\Audit\page.tsx` line 1006: `Refresh Audit`
- `app\admin\Audit\page.tsx` line 1044: `loadAuditReport`
- `app\admin\Audit\page.tsx` line 1065: `Refresh Audit`
- `app\admin\Audit\page.tsx` line 1069: `<AuditSummary`

## Important

A text match does NOT prove execution.

The next investigation step is to trace the actual function call chain.


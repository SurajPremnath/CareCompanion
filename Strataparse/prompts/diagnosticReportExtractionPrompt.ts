/**
 * Diagnostic-report-specific extraction instructions.
 */
export const DIAGNOSTIC_REPORT_EXTRACTION_PROMPT = `
DIAGNOSTIC REPORT EXTRACTION

Extract information explicitly present in the diagnostic report.

Extract, when available and requested:

- examination or study name
- examination date
- findings
- observations
- measurements
- impression
- conclusion
- diagnosis when explicitly stated
- recommendations when explicitly stated
- reporting doctor
- hospital or diagnostic centre

FINDINGS
========

Preserve reported findings accurately.

Do not convert findings into a diagnosis.

IMPRESSION / CONCLUSION
=======================

Extract the reported impression or conclusion exactly according
to the requested structured output.

Do not create an impression when none is present.

MEASUREMENTS
============

Preserve measurements and their units accurately.

Do not calculate or reinterpret them unless explicitly required.

RECOMMENDATIONS
===============

Extract recommendations only when explicitly documented.

Do not create recommendations from general medical knowledge.

MULTI-PAGE REPORTS
==================

Preserve relevant information from every page.

Do not silently overwrite information from another page.
`;
/**
 * Laboratory-report-specific extraction instructions.
 */
export const LAB_REPORT_EXTRACTION_PROMPT = `
LAB REPORT EXTRACTION

Extract laboratory information explicitly present in the source.

Extract, when available and requested:

- test name
- result
- unit
- reference range
- abnormal/high/low indicator
- specimen information
- test date
- report date
- laboratory name
- other requested laboratory information

NUMERICAL ACCURACY
==================

Preserve every reported value accurately.

Do not:

- round values
- estimate values
- change decimal places
- change units
- replace a value with a medically expected value
- calculate a new result unless explicitly requested

TEST ASSOCIATION
================

Keep each result associated with its correct:

- test
- unit
- reference range
- abnormal indicator

Do not associate a reference range from one test with another.

MULTIPLE RESULTS
================

If the same test appears more than once, preserve every source
result rather than silently overwriting an earlier result.

Do not calculate averages unless explicitly required by the
CareVR configuration.

Do not add clinical interpretation that is absent from the report.
`;
export const VITALS_PANEL_RULES = `
============================================================
PANEL: CONSULTATION VITALS EXTRACTION
============================================================

Consultation vitals are among the most clinically important fields in this document.

These values are frequently handwritten.

Accuracy is more important than completeness.

Never estimate.

Never infer.

Never normalize.

Never "improve" handwriting.

If a value cannot be read confidently, return null.

Return only values that are actually written.

------------------------------------------------------------
EXTRACTION ORDER
------------------------------------------------------------

Read the consultation vitals ONE FIELD AT A TIME in this exact order.

1. Weight
2. Height
3. BMI
4. Blood Pressure
5. Pulse
6. Respiratory Rate
7. SpO₂
8. Temperature

Complete one field before moving to the next.

Never use another vital to infer a missing value.

------------------------------------------------------------
HANDWRITTEN NUMERIC VALIDATION
------------------------------------------------------------

Before returning any handwritten numeric value:

Step 1
Locate the handwritten value.

Step 2
Read EACH character individually.

Example

72.2

Read as

7
2
.
2

NOT

79.2

Step 3

Re-read the handwritten value a second time.

If both readings match, return the value.

If they differ, return null.

------------------------------------------------------------
DECIMAL NUMBERS
------------------------------------------------------------

Decimal values require additional validation.

Read

digit

digit

decimal point

digit

individually.

Preserve every digit exactly.

Never change

72.2 → 79.2

35.4 → 36.4

81.5 → 81 kg

Return exactly what is written.

------------------------------------------------------------
UNITS
------------------------------------------------------------

Preserve units exactly.

Examples

72.2 kg

114/78 mmHg

115 bpm

95%

35.4 C

Do not invent units.

Do not convert units.

------------------------------------------------------------
WEIGHT
------------------------------------------------------------

Weight is a high-priority clinical value.

Perform a dedicated second visual scan for weight before returning JSON.

Search ONLY in the Vitals / Consultation Vitals section.

Look for labels:

- Weight
- Wt
- Wt.
- Body Weight

Rules:

- Read every digit individually.
- Distinguish carefully between 2 and 9.
- Preserve decimal places exactly.
- Preserve the unit exactly.
- Never estimate.
- Never infer.
- Never use values from previous consultations.
- Never copy numbers from BP, Pulse, Temperature, BMI or any neighbouring field.

Examples:

72.2 kg → 72.2 kg

72 kg → 72 kg

If any digit cannot be read confidently,
return null.

------------------------------------------------------------
HEIGHT
------------------------------------------------------------

Return exactly as written.

Otherwise return null.

------------------------------------------------------------
BMI
------------------------------------------------------------

Return exactly as written.

Never calculate BMI.

------------------------------------------------------------
BLOOD PRESSURE
------------------------------------------------------------

Return systolic and diastolic exactly as written.

Example

114/78 mmHg

------------------------------------------------------------
PULSE
------------------------------------------------------------

Return exactly as written.

Example

115 bpm

------------------------------------------------------------
RESPIRATORY RATE
------------------------------------------------------------

Return exactly as written.

Otherwise return null.

------------------------------------------------------------
SpO₂
------------------------------------------------------------

Return exactly as written.

Example

95%

------------------------------------------------------------
TEMPERATURE
------------------------------------------------------------

Return exactly as written.

Preserve decimal places.

Never round.

Never estimate.

------------------------------------------------------------
OUTPUT
------------------------------------------------------------

Return

{
  "weight": "...",
  "height": "...",
  "bmi": "...",
  "bloodPressure": "...",
  "pulse": "...",
  "respiratoryRate": "...",
  "spo2": "...",
  "temperature": "..."
}

Use null whenever a value cannot be read confidently.
`;
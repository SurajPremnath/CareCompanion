/**
 * Vitals Panel
 *
 * Single responsibility:
 * Extract explicitly documented patient vital measurements.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Daily Care
 * - Other clinical-document extraction workflows
 *
 * This panel MUST NOT interpret clinical significance.
 */

export const VITALS_PANEL_RULES = `
============================================================
VITALS PANEL
============================================================

PURPOSE
Extract explicitly documented patient vital measurements from the
supplied medical document.

This panel is responsible ONLY for:

1. Weight
2. Height
3. BMI
4. Blood Pressure
5. Pulse
6. Respiratory Rate
7. SpO2
8. Temperature

============================================================
1. GENERAL EXTRACTION RULE
============================================================

Scan the COMPLETE document.

Look in:

- Vital-sign sections
- Consultation headers
- Examination sections
- Doctor's notes
- Prescription areas
- Nursing observations
- Handwritten annotations
- Tables
- Margins
- Stamps where clinically relevant

Extract only values that are explicitly documented.

Do not calculate or infer missing vitals.


============================================================
2. WEIGHT
============================================================

Extract explicitly documented body weight.

Examples:

- 79.2 kg
- Wt 79.2
- Weight: 79.2 kg
- 79 kg

Preserve the numerical value and unit.

Do not infer weight from:

- BMI
- height
- previous records

If unavailable:

weight = null


============================================================
3. HEIGHT
============================================================

Extract explicitly documented height.

Examples:

- 170 cm
- Ht 170 cm
- Height: 1.70 m

Preserve the documented unit.

Do not calculate height from BMI and weight.

If unavailable:

height = null


============================================================
4. BMI
============================================================

Extract BMI only when explicitly documented.

Examples:

- BMI 27.4
- BMI: 27.4

Do not calculate BMI from weight and height.

If BMI is not explicitly documented:

bmi = null


============================================================
5. BLOOD PRESSURE
============================================================

Extract explicitly documented blood pressure.

Examples:

- BP 114/78
- BP: 114/78 mmHg
- 114/78

Preserve systolic and diastolic values.

Recommended structure:

{
  "systolic": number | null,
  "diastolic": number | null,
  "unit": string | null
}

Do not infer blood pressure from symptoms or clinical statements.


============================================================
6. PULSE
============================================================

Extract explicitly documented pulse/heart rate.

Examples:

- Pulse 115
- HR 115
- PR 115 bpm
- Heart rate: 115 bpm

Normalize the concept to pulse.

Preserve the numerical value and unit where available.

Do not infer pulse from:

- tachycardia mentioned without a numeric value
- symptoms
- ECG interpretation

If only a qualitative statement exists:

pulse = null


============================================================
7. RESPIRATORY RATE
============================================================

Extract explicitly documented respiratory rate.

Examples:

- RR 20
- Resp 20/min
- Respiratory rate: 20

Do not infer respiratory rate from breathing symptoms.

If unavailable:

respiratoryRate = null


============================================================
8. SPO2
============================================================

Extract explicitly documented oxygen saturation.

Examples:

- SpO2 95%
- SpO₂: 95
- O2 saturation 95%
- Saturation 95%

Normalize the concept to SpO2.

Preserve the numerical value and unit where available.

Do not infer SpO2 from:

- oxygen therapy
- respiratory symptoms
- diagnosis
- statements such as "hypoxic" without a numerical reading

If unavailable:

spo2 = null


============================================================
9. TEMPERATURE
============================================================

Extract explicitly documented body temperature.

Examples:

- Temp 99.2 F
- Temperature: 37.2 C
- T 99°F
- 99.5°F

Preserve the documented unit.

Do not convert between Celsius and Fahrenheit unless the application
explicitly requires normalization elsewhere.

Do not infer temperature from the word "fever" alone.

If only "fever" is documented without a numerical temperature:

temperature = null


============================================================
10. HANDWRITTEN VITALS
============================================================

Handwritten vitals require careful visual reading.

Read digits individually.

Pay particular attention to visually similar digits.

Examples of potential ambiguity:

- 1 vs 7
- 3 vs 8
- 5 vs 6
- 0 vs 6
- decimal point vs ink mark

If a vital cannot be read reliably:

return null

Do not guess the most clinically plausible value.


============================================================
11. MULTIPLE VITAL READINGS
============================================================

If multiple readings are explicitly documented in the same document:

preserve them when the output contract supports multiple readings.

Do not automatically select:

- the highest value
- the lowest value
- the most recent value
- the clinically most important value

unless the surrounding document explicitly identifies one as the
relevant/current reading.

Do not merge different readings into one value.


============================================================
12. VITALS VS CLINICAL INTERPRETATION
============================================================

This panel extracts measurements.

It does NOT interpret them.

Example:

"BP 90/60"

→ extract BP 90/60

Do NOT add:

"Low BP"

Example:

"Pulse 120"

→ extract Pulse 120

Do NOT add:

"Tachycardia"

Clinical interpretation belongs to the appropriate clinical panel.


============================================================
13. SOURCE OF TRUTH
============================================================

Use ONLY information visibly supported by the supplied document.

Do not use:

- application context
- previous records
- database values
- user-provided patient profile
- clinical assumptions
- calculated values


============================================================
14. STRICT SCOPE
============================================================

THIS PANEL MUST NOT EXTRACT:

- Patient Name
- Patient Age
- Patient Sex
- Doctor Name
- Doctor Type
- Hospital
- UHID
- Consultation Date
- Consultation Mode
- Document Type
- Current State of Health
- Clinical History
- Symptoms
- Investigations
- Tests Advised
- Medicines
- Instructions
- Follow-up

This panel extracts measurements only.


============================================================
15. OUTPUT
============================================================

This panel contributes ONLY:

{
  "vitals": {
    "weight": ...,
    "height": ...,
    "bmi": ...,
    "bloodPressure": ...,
    "pulse": ...,
    "respiratoryRate": ...,
    "spo2": ...,
    "temperature": ...
  }
}

Use null for unavailable scalar measurements.

Do not manufacture values.


============================================================
16. FINAL VALIDATION
============================================================

Before returning vitals:

1. Was the value explicitly documented?
2. Was it actually associated with the patient?
3. Was it read correctly?
4. Was the unit preserved where applicable?
5. Was no value calculated?
6. Was no clinical interpretation added?
7. Were multiple readings kept distinct where required?
8. Was information from other panels excluded?

When uncertain, return null rather than guessing.

END VITALS PANEL
`;
export const ASSESSMENT_RULES = `
===========================================================
DOCTOR ASSESSMENT / CLINICAL IMPRESSION
===========================================================

Purpose

Extract the doctor's clinical assessment exactly as documented.

This represents the doctor's medical opinion during the consultation.

Preserve the doctor's wording.

Never strengthen or weaken the level of diagnostic certainty.

-----------------------------------------------------------
Confirmed Assessment
-----------------------------------------------------------

Examples

• Viral URTI

• Diabetes Mellitus

• Hypertension

• COPD

• Pneumonia

-----------------------------------------------------------
Probable Assessment
-----------------------------------------------------------

Examples

• Likely Viral URTI

• Possible COPD

• Probable CHF

• Suspected Tuberculosis

• ? BPH

• Rule out TB

Preserve the wording exactly.

Do NOT remove

Likely

Possible

Probable

Suspected

Rule out

?

-----------------------------------------------------------
Differential Diagnosis
-----------------------------------------------------------

Doctors may document more than one possible diagnosis.

Examples

• Viral URTI

• Rule out Pneumonia

• ? COPD

Return every assessment separately.

-----------------------------------------------------------
Clinical Observations
-----------------------------------------------------------

Observations that contribute to the doctor's assessment
should remain as assessments when they clearly represent
clinical reasoning.

-----------------------------------------------------------
Rules
-----------------------------------------------------------

Do NOT convert a probable diagnosis into a confirmed diagnosis.

Do NOT move investigations into assessment.

Do NOT move symptoms into assessment.

Do NOT move doctor advice into assessment.

Preserve the doctor's original wording exactly.

Return

[
{
assessment: "..."
}
]

Never infer a diagnosis.

Never rewrite medical terminology.

===========================================================
`;
export const HISTORY_RULES = `
===========================================================
PAST MEDICAL HISTORY
===========================================================

Purpose

Extract clinically relevant background information about the
patient.

Past Medical History provides context for the current
consultation.

It is NOT today's diagnosis.

-----------------------------------------------------------
Medical History
-----------------------------------------------------------

Examples

• Hypertension
• Diabetes Mellitus
• Dyslipidaemia
• Asthma
• COPD
• CKD
• CAD
• Previous Stroke
• Thyroid Disorder
• Tuberculosis
• Cancer

-----------------------------------------------------------
Surgical History
-----------------------------------------------------------

Examples

• CABG
• Angioplasty
• Hernia Repair
• Knee Replacement
• Cataract Surgery
• Appendicectomy

-----------------------------------------------------------
Medication History
-----------------------------------------------------------

Examples

• Continue Statin

• Stopped Metformin

• Restart Aspirin

• Previously on Insulin

• Statin discontinued

These are NOT today's prescription.

-----------------------------------------------------------
Allergies
-----------------------------------------------------------

Examples

• Penicillin allergy

• Sulfa allergy

• NKDA

-----------------------------------------------------------
Lifestyle
-----------------------------------------------------------

Examples

• Vegetarian

• Mixed Diet

• High Protein Diet

• Low Salt Diet

• Smoker

• Non-smoker

• Alcohol

• No alcohol

-----------------------------------------------------------
Social History
-----------------------------------------------------------

Examples

• Lives in apartment

• Lives alone

• Lives with family

• Recent travel

• No recent travel

• Occupation

-----------------------------------------------------------
Rules
-----------------------------------------------------------

Do NOT classify history as diagnosis.

Do NOT classify history as doctor instructions.

Do NOT classify history as investigations.

Preserve the doctor's wording.

Categorize history as

MEDICAL

SURGICAL

MEDICATION

ALLERGY

LIFESTYLE

SOCIAL

OTHER

Return

[
{
category: "...",
value: "..."
}
]

Never invent history.

Never infer previous illnesses.

===========================================================
`;
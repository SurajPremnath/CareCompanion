export const INVESTIGATION_RULES = `
===========================================================
INVESTIGATIONS AND CLINICAL PLAN
===========================================================

Purpose

Extract every investigation, laboratory test, imaging study,
screening test, monitoring activity or diagnostic procedure
recommended, ordered or planned by the doctor.

These represent the doctor's clinical plan.

They are NOT diagnoses.

-----------------------------------------------------------
Laboratory Investigations
-----------------------------------------------------------

Examples

• CBC

• Complete Blood Count

• HbA1c

• ESR

• CRP

• LFT

• RFT

• Lipid Profile

• PSA

• TSH

• Vitamin B12

• Vitamin D

• Blood Sugar

• Urine Routine

-----------------------------------------------------------
Imaging
-----------------------------------------------------------

Examples

• X-Ray

• Chest X-Ray

• Ultrasound

• Ultrasound Abdomen

• Ultrasound Abdomen & Pelvis

• CT Scan

• MRI

• PET CT

• Mammography

• Echocardiogram

-----------------------------------------------------------
Diagnostic Procedures
-----------------------------------------------------------

Examples

• ECG

• PFT

• Spirometry

• Endoscopy

• Colonoscopy

• Bronchoscopy

• Biopsy

-----------------------------------------------------------
Monitoring
-----------------------------------------------------------

Examples

• Repeat CBC

• Repeat PSA

• Repeat Chest X-Ray

• Repeat Blood Sugar

• Monitor BP

• Monitor Weight

-----------------------------------------------------------
Clinical Plan
-----------------------------------------------------------

Examples

• Blood Work

• Blood Tests

• Check PSA

• Advise PET CT

• Ultrasound Abdomen

• Repeat after one month

• Review after investigations

-----------------------------------------------------------
Rules
-----------------------------------------------------------

Return only investigations that the doctor has requested,
planned, advised or ordered.

Do NOT classify completed investigation results as
new investigations.

Do NOT classify investigations as diagnosis.

Do NOT classify investigations as medicines.

Do NOT classify investigations as doctor instructions.

Preserve the doctor's wording whenever possible.

Return

[
{
investigation: "..."
}
]

Never infer additional investigations.

Never rewrite medical terminology.

===========================================================
`;
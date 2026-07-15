export const EXAMINATION_RULES = `
===========================================================
PHYSICAL EXAMINATION FINDINGS
===========================================================

Purpose

Extract only the objective clinical findings documented by the
doctor during physical examination.

These represent what the doctor observed while examining the
patient.

They are NOT patient complaints.

They are NOT past medical history.

They are NOT the doctor's diagnosis.

-----------------------------------------------------------
Common Examination Findings
-----------------------------------------------------------

General

• Pallor

• No pallor

• Icterus

• No icterus

• Cyanosis

• Clubbing

• Pedal edema

• No pedal edema

• Lymphadenopathy

-----------------------------------------------------------

Respiratory

• Bilateral air entry

• Reduced air entry

• Wheeze

• Bilateral wheeze

• Crepitations

• Crackles

• Rhonchi

• Chest clear

-----------------------------------------------------------

Cardiovascular

• S1 S2 normal

• Murmur

• Tachycardia

• Bradycardia

-----------------------------------------------------------

Abdomen

• Soft

• Tender

• Distended

• Organomegaly

-----------------------------------------------------------

Neurological

• Conscious

• Oriented

• Power normal

-----------------------------------------------------------

Rules

STEP 1

First locate the physical examination section.

Common examination headings include:

• O/E
• O/E:
• On Examination
• Examination
• Physical Examination
• RS
• CVS
• PA
• CNS
• P/A
• Respiratory System
• Cardiovascular System

STEP 2

Only extract findings documented inside the examination section.

STEP 3

Do NOT extract information written before the examination section.

These belong to:

• Presenting Complaints
• Medical History

STEP 4

Do NOT extract information written after the examination section.

These usually belong to:

• Assessment
• Investigations
• Medicines
• Doctor Instructions

STEP 5

If no examination section exists, return an empty array.

Never move history into Examination Findings.

Never move patient complaints into Examination Findings.

Never infer findings that are not explicitly documented.

-----------------------------------------------------------

Examples

Patient says

Dry cough

↓

Presenting Complaint

-----------------------------------------------------------

Doctor writes

Bilateral wheeze

↓

Examination Finding

Doctor writes

No recent travel

↓

Past Medical History

NOT Examination Finding

-----------------------------------------------------------

Doctor writes

Mostly vegetarian

↓

Lifestyle History

NOT Examination Finding

-----------------------------------------------------------

Doctor writes

Dry cough

↓

Presenting Complaint

NOT Examination Finding

-----------------------------------------------------------

Doctor writes

Likely Viral URTI

↓

Doctor Assessment

-----------------------------------------------------------

Return

[
{
finding: "..."
}
]

===========================================================
`;
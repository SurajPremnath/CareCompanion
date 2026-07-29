export const MEDICATION_PANEL_RULES = `
------------------------------------------------------------
PANEL: MEDICATIONS & PRESCRIPTIONS
------------------------------------------------------------

• OBJECTIVE:
Extract EVERY prescribed medication exactly as written by the clinician, including chronic medicines, newly prescribed medicines, PRN medicines, and continuation medicines.

• TARGET ARRAY:

"medicines"

Return an array of medication objects with the following fields.

{
    "name": string,
    "strength": string|null,
    "form": string|null,
    "dose": string|null,
    "frequency": string|null,
    "timings": string[],
    "duration": string|null,
    "instructions": string|null
}

Examples

{
    "name":"Olmeset",
    "strength":"20 mg",
    "form":"Tablet",
    "dose":"1",
    "frequency":"OD",
    "timings":["Morning"],
    "duration":"1 Month",
    "instructions":null
}

{
    "name":"Foracort",
    "strength":null,
    "form":"Inhaler",
    "dose":"1 puff",
    "frequency":"BD",
    "timings":["Morning","Night"],
    "duration":null,
    "instructions":null
}

------------------------------------------------------------
EXTRACTION RULES
------------------------------------------------------------

- Scan the ENTIRE prescription including:
    • Rx section
    • Continuation pages
    • Side margins
    • Handwritten additions
    • Dosage tables

- Extract EVERY medicine exactly once.

- Preserve the medicine name exactly as written.

- Preserve combination medicines exactly as written.

Example:

"Sompraz-D / Nexpro-RP"

should remain a single medicine entry.

Do NOT split unless the prescription clearly lists them separately.

------------------------------------------------------------
FORM
------------------------------------------------------------

Extract dosage form when available.

Examples

Tablet
Capsule
Inhaler
Effervescent
Syrup
Injection
Drops
Cream
Ointment
Nebuliser

------------------------------------------------------------
STRENGTH
------------------------------------------------------------

Examples

20 mg
650 mg
600 mg
250/125 mg
200 mcg

------------------------------------------------------------
DOSE
------------------------------------------------------------

Examples

1 tablet
1/2 tablet
2 tablets
1 puff
2 puffs
5 ml
10 drops

------------------------------------------------------------
FREQUENCY
------------------------------------------------------------

Examples

OD
BD
TDS
QID
SOS
HS
STAT

Preserve the doctor's wording when possible.

------------------------------------------------------------
TIMINGS
------------------------------------------------------------

OBJECTIVE

Extract medicine administration timing exactly as prescribed.

If a timing abbreviation is written, convert it to the standardized timing value below.

TIMING NORMALIZATION

BBF
Before Breakfast
Pre Breakfast
Before BF
→ BEFORE_BREAKFAST

ABF
After Breakfast
Post Breakfast
After BF
→ AFTER_BREAKFAST

BL
Before Lunch
→ BEFORE_LUNCH

AL
After Lunch
→ AFTER_LUNCH

BD
Before Dinner
→ BEFORE_DINNER

AD
After Dinner
Post Dinner
→ AFTER_DINNER

AC
A.C.
Before Food
Before Meals
→ BEFORE_FOOD

PC
P.C.
After Food
After Meals
→ AFTER_FOOD

HS
H.S.
Bedtime
→ AT_BEDTIME

Morning
→ MORNING

Afternoon
→ AFTERNOON

Evening
→ EVENING

Night
→ NIGHT

Empty stomach
Fasting
→ EMPTY_STOMACH

RULES

Always populate the timings array whenever an explicit timing is written.

Examples

BBF

returns

"timings": ["BEFORE_BREAKFAST"]

---

OD BBF

returns

"frequency": "OD",
"timings": ["BEFORE_BREAKFAST"]

---

1-0-1 AC

returns

"timings": ["BEFORE_FOOD"]

---

SOS

does not imply timing.

Return timings only when explicitly written.

------------------------------------------------------------
DURATION
------------------------------------------------------------

Examples

5 days
7 days
2 weeks
1 month
Continue
Long term
Till review
------------------------------------------------------------
INSTRUCTIONS
------------------------------------------------------------

Capture medicine-specific instructions only.

Examples

Mix in 1/2 litre warm water

Before breakfast

Shake well

Do NOT duplicate general care advice already extracted under Doctor Instructions.

------------------------------------------------------------
IMPORTANT
------------------------------------------------------------

- Never invent medicines.

- Never infer strength.

- Never infer frequency.

- Never infer duration.

- Use null when information is not available.

- Return [] only if no medicines are prescribed.

- Before returning JSON, verify that every medicine written on the prescription has been extracted exactly once.
`;
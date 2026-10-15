export const COMPLAINTS_RULES = `
===========================================================
PRESENTING COMPLAINTS
===========================================================

Purpose

Identify WHY the patient came for the consultation.

Extract every symptom, complaint or concern mentioned by the
doctor or patient before the clinical assessment.

Include:

• Symptoms
• Patient complaints
• Duration
• Progression
• Laterality
• Severity (if explicitly written)

Examples

"Tiredness"
→ complaint = Tiredness

"Tiredness x 1 week"
→ complaint = Tiredness
→ duration = 1 week

"Dry cough"
→ complaint = Dry cough

"Chest congestion"
→ complaint = Chest congestion

"Mild chest tightness"
→ complaint = Mild chest tightness

"SOB on exertion"
→ complaint = Shortness of breath on exertion

"Leg pain"
→ complaint = Leg pain

"Wheezy"
→ complaint = Wheeze

"Giddiness"
→ complaint = Giddiness

"Headache settled"

Do NOT include because symptom has resolved.

"Feverish every evening"

Extract as

Complaint:
Feverish every evening

-----------------------------------------------------------
NOT Presenting Complaints
-----------------------------------------------------------

Past Medical History

Examples

• Hypertension × 20 years

• Diabetes Mellitus

• Hernia

• Previous Stroke

↓

These belong to Past Medical History.

-----------------------------------------------------------

Examination Findings

Examples

• Bilateral wheeze

• Chest clear

• No pedal edema

• No pallor

• Bilateral air entry

↓

These belong to Examination Findings.

-----------------------------------------------------------

Doctor Assessment

Examples

• Likely Viral URTI

• Nutritional deficiency

• ? BPH

• Rule out Tuberculosis

↓

These belong to Doctor Assessment.

-----------------------------------------------------------

Lifestyle

Examples

• Mostly vegetarian

• Lives in apartment

• No recent travel

↓

These belong to Patient History.


Do NOT include

• Diagnosis
• Investigations
• Medicines
• Doctor advice
• Past medical history

-----------------------------------------------------------
Grouped Complaint Lists
-----------------------------------------------------------

Doctors frequently document presenting complaints as a vertical
list without writing complete sentences.

Each line should normally be treated as an independent
presenting complaint.

Example

Tiredness

Dry cough

Chest congestion

Leg pain

↓

Return

Complaint:
Tiredness

Complaint:
Dry cough

Complaint:
Chest congestion

Complaint:
Leg pain

-----------------------------------------------------------

If one complaint spans multiple lines because of handwriting
or formatting, combine only those lines that clearly belong
to the same complaint.

Never merge unrelated complaints into a single sentence.

Never combine vertically listed complaints into one complaint.


-----------------------------------------------------------
Duration Recognition
-----------------------------------------------------------

If a complaint includes a duration, associate the duration with
that complaint.

Common duration expressions include:

• x 1 day

• x 2 days

• x 1 week

• x 2 weeks

• x 3 months

• x 1 year

• Since yesterday

• Since morning

• Since last night

• For 3 days

• For 1 week

• Chronic

• Intermittent

• Recurrent

Examples

"Tiredness x 1 week"

↓

complaint = "Tiredness"

duration = "1 week"

-----------------------------------------------------------

"Chest congestion for 3 days"

↓

complaint = "Chest congestion"

duration = "3 days"

-----------------------------------------------------------

"Dry cough since yesterday"

↓

complaint = "Dry cough"

duration = "Since yesterday"

-----------------------------------------------------------

If no duration is written,

return

duration = null.

Never guess duration.

Never copy the duration to another complaint.


Return

[
{
complaint: "...",
duration: "..."
}
]

If duration is unknown

duration = null

Never invent duration.

Never merge two different complaints.

Preserve doctor's wording whenever possible.

===========================================================
`;
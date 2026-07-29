export const SYMPTOMS_PANEL_RULES = `
------------------------------------------------------------
PANEL: SYMPTOMS & PRESENTING COMPLAINTS
------------------------------------------------------------

• OBJECTIVE:
Extract EVERY symptom documented for the current consultation.

Do NOT rank, filter, summarize, prioritise or omit symptoms.

If a symptom is written anywhere in the consultation notes, it MUST appear in the symptoms array exactly once.

Examples include:
- chief complaints
- handwritten narrative
- continuation pages
- review notes

• TARGET ARRAYS:

1. "symptoms"
- Return a flat array of individual symptom strings.
- Preserve the clinical wording as closely as possible.
- Examples:
  - "Tiredness"
  - "Leg pain"
  - "Wheezing"
  - "Chest congestion"
  - "RT ear blocked"
  - "Giddiness"
  - "Headache"
  - "Dry cough"
  - "Shortness of breath on exertion"
  - "Mild chest tightness"

2. "presentingComplaints"
- Return structured objects containing the primary complaint and its documented duration.

Example:

{
  "complaint": "Tiredness",
  "duration": "1 wk"
}

• EXTRACTION RULES

- Scan the entire prescription, including:
  - Chief Complaints (C/C.)
  - Clinical narrative
  - Handwritten notes
  - Continuation pages

- Extract all symptoms documented for the current consultation.

- Preserve symptom specificity.
  Example:
    "Chest congestion"
    NOT
    "Congestion"

- Preserve symptom qualifiers whenever clinically relevant.
  Examples:
    "Dry cough"
    "Mild chest tightness"
    "Shortness of breath on exertion"

- If duration is explicitly documented, populate presentingComplaints.duration.

- A symptom may appear in BOTH arrays.
  Example:
    symptoms:
      "Tiredness"

    presentingComplaints:
      {
        "complaint":"Tiredness",
        "duration":"1 wk"
      }

- Do NOT convert diagnoses into symptoms.

- Do NOT include past medical history.

- Do NOT create generic symptoms from medicine indications.
  Example:
    If Paracetamol is prescribed for "Fever / Pain",
    do not create standalone symptoms "Pain" or "Fever"
    unless they are documented as current complaints.

- Eliminate duplicate or less-specific symptoms.
  Example:
    Keep "Chest congestion".
    Do NOT also return "Congestion".

- Return [] only when no symptoms are documented.

- Before returning JSON, verify that every symptom documented in the prescription has been represented in the symptoms array. 

- Do not omit symptoms because they appear less important or because they are associated with another symptom.
`;
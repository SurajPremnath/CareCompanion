export const VITALS_RULES = `
===========================================================
CONSULTATION VITALS
===========================================================

Purpose

Extract every vital sign explicitly documented by the doctor
during the consultation.

Only extract values that are actually written.

Never estimate.

Never calculate.

Never convert units.

-----------------------------------------------------------
Extract the following
-----------------------------------------------------------

Weight

Blood Pressure

Pulse / Heart Rate

SpO₂

Temperature

Respiratory Rate

Height

BMI

-----------------------------------------------------------
Examples
-----------------------------------------------------------

Wt = 72.2 kg

↓

weight = "72.2 kg"

-----------------------------------------------------------

BP = 114/78

↓

bloodPressure = "114/78"

-----------------------------------------------------------

Pulse = 115/min

↓

pulse = "115/min"

-----------------------------------------------------------

P = 115

↓

pulse = "115"

-----------------------------------------------------------

SpO₂ = 95%

↓

spo2 = "95%"

-----------------------------------------------------------

Temp = 35.4°C

↓

temperature = "35.4°C"

-----------------------------------------------------------

RR = 18/min

↓

respiratoryRate = "18/min"

-----------------------------------------------------------

Ht = 172 cm

↓

height = "172 cm"

-----------------------------------------------------------

BMI = 24.3

↓

bmi = "24.3"

-----------------------------------------------------------
Common Doctor Abbreviations
-----------------------------------------------------------

Weight

Wt

Wt.

Weight

Body Weight

-----------------------------------------------------------

Blood Pressure

BP

B.P.

Blood Pressure

-----------------------------------------------------------

Pulse

P

PR

Pulse

Heart Rate

HR

-----------------------------------------------------------

SpO₂

SpO2

SPO2

SpO₂

Oxygen Saturation

O₂ Sat

-----------------------------------------------------------

Temperature

T

Temp

Temperature

-----------------------------------------------------------

Respiratory Rate

RR

Resp Rate

Respiratory Rate

-----------------------------------------------------------

Height

Ht

Height

-----------------------------------------------------------

BMI

BMI

Body Mass Index

-----------------------------------------------------------
Location Guidance
-----------------------------------------------------------

Consultation vitals are commonly written together as a block.

They are usually located:

• Near the top-right corner of the consultation sheet.

• Immediately after the doctor's name or signature.

• Beside the hospital logo or patient identifiers.

• In a vertically aligned list.

When multiple measurements appear together, treat them as the
current consultation vitals.

Example:

Wt = 72.2 kg

BP = 114/78

P = 115/min

SpO₂ = 95%

T = 35.4°C

Extract every available vital from the block.

Do not ignore a vital simply because another vital is missing.

Do not search previous pages for replacement values if a vital
is absent from the current consultation.

-----------------------------------------------------------
Rules
-----------------------------------------------------------

Extract exactly as written.

Preserve units.

Do not normalize units.

Do not convert Celsius to Fahrenheit.

Do not convert kilograms to pounds.

Do not calculate BMI.

Do not derive missing vitals.

If a vital is absent

Return null.

Never infer values from surrounding notes.

Vitals must not be extracted from previous consultations
unless they are explicitly repeated in the current document.

===========================================================
`;
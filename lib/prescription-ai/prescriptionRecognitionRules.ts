//------------------------------------------------------------
// CareVR Prescription Recognition Rules
//------------------------------------------------------------

export const PRESCRIPTION_RECOGNITION_RULES = `

------------------------------------------------------------
MEDICINE RECOGNITION
------------------------------------------------------------

A medicine is usually identified by one or more of the following:

• Begins with:
  Tab.
  Tablet
  Cap.
  Capsule
  Inj.
  Injection
  Syr.
  Syrup
  Drops
  Cream
  Oint.
  Gel
  Patch
  Spray
  Neb.

• Followed by a strength:

  5 mg
  10 mg
  40 mg
  200 mg
  500 mg
  1 g
  5 ml

• Followed by dosage:

  1-0-1
  1-1-1
  0-0-1
  SOS
  OD
  BD
  TDS

• Followed by duration:

  x 5 days
  x 7 days
  x one month
  Continue
  Lifelong
  Till review

If these appear together,
they almost certainly belong to the same medicine.

------------------------------------------------------------
MEDICINE ASSOCIATION
------------------------------------------------------------

Information written immediately below a medicine
normally belongs to that medicine.

Example

Tab. Capmatinib 200

1-0-1

Daily

x One Month

Should become

Medicine:
Capmatinib

Strength:
200 mg

Dose:
1-0-1

Frequency:
Daily

Duration:
One Month

------------------------------------------------------------
DO NOT CONFUSE
------------------------------------------------------------

Do NOT treat as medicines:

• Registration numbers

• File numbers

• Visit numbers

• Room numbers

• Dates

• BP values

• Pulse

• Temperature

• Investigation values

------------------------------------------------------------
QUANTITY
------------------------------------------------------------

If a number is inside a circle
or appears alone on the right side,

it is usually quantity supplied,

NOT medicine strength.

Example

60

should not become

Strength = 60 mg

unless mg is explicitly written.

------------------------------------------------------------
HANDWRITING
------------------------------------------------------------

If one character is unclear,

prefer preserving the doctor's writing.

Do not invent medicine names.

If confidence is low,

return null.

`;
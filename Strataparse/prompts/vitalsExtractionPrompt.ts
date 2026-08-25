/**
 * Vitals-specific extraction instructions.
 *
 * Strataparse returns every source reading.
 * CareVR performs presentation and calculations such as averages.
 */
export const VITALS_EXTRACTION_PROMPT = `
VITALS EXTRACTION

Extract EVERY vital reading explicitly visible in the supplied
document or image.

Supported vitals include:

- temperature
- systolic blood pressure
- diastolic blood pressure
- pulse
- SpO2
- weight

MULTIPLE READINGS
=================

A source may contain multiple readings of the same vital.

Return EVERY reading.

For example, if the source contains:

Temperature: 99.0°F
Temperature: 100.0°F

return both values.

Do NOT:

- select only one value
- select only the latest value
- discard earlier values
- combine values
- calculate an average
- replace multiple values with one value

If two source images/pages contain readings for the same vital,
preserve both readings.

NUMERICAL ACCURACY
==================

Read every number carefully.

Preserve:

- exact value
- decimal precision
- unit
- associated vital

Do not estimate unreadable digits.

Do not round values.

Do not change values because another value appears medically
likely.

BLOOD PRESSURE
==============

Preserve systolic and diastolic values for every blood-pressure
reading.

TEMPERATURE
===========

Return every visible temperature reading and its unit.

PULSE
=====

Return every visible pulse reading and its unit when available.

SpO2
====

Return every visible oxygen saturation reading.

WEIGHT
======

Return every visible weight reading and its unit.

OUTPUT
======

Represent multiple readings as multiple structured values.

Example:

{
  "temperature": [
    {
      "value": 99.0,
      "unit": "F"
    },
    {
      "value": 100.0,
      "unit": "F"
    }
  ]
}

If another vital has multiple readings, preserve them in the same
manner.

AVERAGE
=======

DO NOT calculate an average.

Strataparse returns the source readings.

CareVR calculates and displays averages from the extracted
readings.

Only return vitals actually visible in the source and requested
by the CareVR configuration.
`;
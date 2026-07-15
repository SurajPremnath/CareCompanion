export const IDENTITY_EXTRACTION_INSTRUCTIONS = `

You are reading ONLY the identity section of a medical prescription.

Your task is NOT to read medicines or clinical information.

Extract ONLY:

{
  "patientName": string | null,
  "doctorName": string | null,
  "hospitalOrClinic": string | null,
  "consultationDate": string | null
}

Rules

• Focus ONLY on the top portion of Page 1.
• Read the handwritten consultation date character by character.
• The consultation date is usually written beside "Dt" or "Date".
• Ignore registration numbers, UHID, phone numbers and patient IDs.
• Assume Indian date format:
  DD/MM/YYYY
  DD/MM/YY
  DD-MM-YYYY
  DD-MM-YY
• Return consultationDate ONLY in ISO format (YYYY-MM-DD).
• If unreadable, return null.
• Return ONLY valid JSON.

`;
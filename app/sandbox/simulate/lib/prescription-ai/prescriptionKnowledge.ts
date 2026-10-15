//------------------------------------------------------------
// CareVR Prescription Knowledge Base
//------------------------------------------------------------

export const MEDICINE_PREFIXES = [

    "Tab",
    "Tablet",
    "Cap",
    "Capsule",
    "Syp",
    "Syrup",
    "Inj",
    "Injection",
    "Neb",
    "Nebulization",
    "Cream",
    "Ointment",
    "Gel",
    "Drops",
    "Eye Drops",
    "Ear Drops",
    "Nasal Spray",
    "Spray",
    "Patch",

] as const;


export const DOSAGE_PATTERNS = [

    "1-0-1",
    "1-1-1",
    "1-0-0",
    "0-1-0",
    "0-0-1",
    "½-0-½",
    "½-½-½",
    "SOS",
    "OD",
    "BD",
    "TDS",
    "QID",
    "HS",
    "AC",
    "PC",

] as const;


export const DURATION_PATTERNS = [

    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "14 days",
    "15 days",
    "30 days",
    "One Month",
    "One month",
    "1 Month",
    "One Week",
    "Continue",
    "Continue Till Review",
    "Lifelong",
    "Till Next Visit",

] as const;


export const INVESTIGATION_KEYWORDS = [

    "CBC",
    "Blood Test",
    "PET CT",
    "PET-CT",
    "MRI",
    "CT",
    "X-Ray",
    "Ultrasound",
    "ECG",
    "Echo",
    "Biopsy",
    "HbA1c",
    "PSA",
    "Creatinine",
    "LFT",
    "KFT",
"ESR",
"CRP",
"Lipid Profile",
"Liver Function Test",
"Renal Function Test",
"Vitamin D",
"Vitamin B12",
"Iron Studies",
"Ferritin",
"TSH",
"Urine Routine",
"Urine Culture",
"X-Ray Chest",
"HRCT",
"MRI Brain",
"MRI Spine",
"CT Chest",
"CT Abdomen",
"Ultrasound Abdomen",

] as const;


export const INSTRUCTION_KEYWORDS = [

    "Steam Inhalation",
    "Gargle",
    "Warm Water",
    "Rest",
    "Exercise",
    "Diet",
    "Hydration",
    "Avoid",
    "Continue",
    "Review",
    "Follow Up",
"Drink Plenty of Water",

"Drink Fluids",

"Steam Inhalation",

"Salt Water Gargle",

"Bed Rest",

"Rest",

"Avoid Smoking",

"Avoid Alcohol",

"Exercise",

"Diet Control",

"High Protein Diet",

"Monitor BP",

"Monitor Sugar",

"Return Immediately",

"Visit ER",

"Continue Current Medicines",

] as const;


export const DEVICE_KEYWORDS = [

    "Compression Stockings",
    "Walker",
    "Walking Stick",
    "Wheelchair",
    "Nebulizer",
    "Oxygen Concentrator",
    "CPAP",

] as const;

export const SYMPTOM_KEYWORDS = [

"Fever",
"Low Grade Fever",
"High Fever",
"Cough",
"Dry Cough",
"Productive Cough",
"Blood in Sputum",
"Breathlessness",
"Shortness of Breath",
"Wheezing",
"Chest Pain",
"Chest Tightness",
"Headache",
"Dizziness",
"Giddiness",
"Vomiting",
"Nausea",
"Loose Motion",
"Diarrhea",
"Constipation",
"Abdominal Pain",
"Loss of Appetite",
"Weight Loss",
"Fatigue",
"Weakness",
"Body Pain",
"Joint Pain",
"Leg Pain",
"Back Pain",
"Burning Micturition",
"Swelling",
"Palpitations",

] as const;

export const PAST_HISTORY_KEYWORDS = [

"HTN",
"Hypertension",

"DM",
"Diabetes",

"CAD",
"IHD",

"COPD",

"Asthma",

"CKD",

"CLD",

"Hypothyroidism",

"Hyperthyroidism",

"Dyslipidemia",

"Hyperlipidemia",

"Cancer",

"Tuberculosis",

"Hernia",

"Stroke",

] as const;

export const EXAMINATION_KEYWORDS = [

"BP",

"Pulse",

"PR",

"Temperature",

"Temp",

"SpO₂",

"SPO2",

"Respiratory Rate",

"RR",

"Weight",

"Height",

"BMI",

"Chest",

"CVS",

"CNS",

"PA",

"RS",

] as const;

export const CONSULTATION_KEYWORDS = [

"OPD",

"IP",

"Ward",

"Emergency",

"Teleconsultation",

"Tele Consultation",

"Telemedicine",

"Video",

"Video Consultation",

"Phone",

"Telephone",

"WhatsApp",

"WhatsApp Consultation",

"Email",

"Home Visit",

"Discharge Summary",

"Admission Note",

"Follow Up",

] as const;

export const COMMON_MEDICAL_ABBREVIATIONS = [

"c/o",          // complains of
"k/c/o",        // known case of
"h/o",          // history of
"o/e",          // on examination
"dx",           // diagnosis
"rx",           // treatment
"sos",
"prn",
"stat",
"od",
"bd",
"tds",
"qid",
"hs",
"ac",
"pc",
"po",
"iv",
"im",

] as const;
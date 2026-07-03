import type {
  TranslationDictionary,
} from "../types";

export const te: TranslationDictionary = {

  common: {
    save: "సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",
    back: "వెనక్కి",
    loading: "లోడ్ అవుతోంది...",
    yes: "అవును",
    no: "కాదు",
    notRecorded: "నమోదు చేయలేదు",
  },

  dailyCare: {
    title: "రోజువారీ సంరక్షణ",

    patientInformation:
      "రోగి సమాచారం",

    patient:
      "రోగి",

    date:
      "తేదీ",

    time:
      "సమయం",

    readingMethodQuestion:
      "ఈరోజు రీడింగ్స్‌ను ఎలా నమోదు చేయాలనుకుంటున్నారు?",

    uploadPhoto:
      "ఫోటో అప్‌లోడ్ చేయండి",

    enterManually:
      "మీరే నమోదు చేయండి",

    captureMedicalReadings:
      "మెడికల్ రీడింగ్స్‌ను ఫోటో ద్వారా నమోదు చేయండి",

    captureHelp:
      "మీ మెడికల్ పరికరంలోని రీడింగ్స్ స్పష్టంగా కనిపించేలా ఫోటో తీయండి లేదా ఫోటోను ఎంచుకోండి.",

    takeOrSelectImage:
      "ఫోటో తీయండి లేదా ఎంచుకోండి",

    readingImage:
      "ఫోటోను చదువుతోంది...",

    temperature:
      "ఉష్ణోగ్రత",

    unit:
      "యూనిట్",

    enterTemperature:
      "ఉష్ణోగ్రత నమోదు చేయండి",

    additionalVitals:
      "ఇతర ముఖ్యమైన ఆరోగ్య రీడింగ్స్",

    bloodPressure:
      "బ్లడ్ ప్రెషర్",

    systolic:
      "పై రీడింగ్ (సిస్టోలిక్)",

    diastolic:
      "కింది రీడింగ్ (డయాస్టోలిక్)",

    pulseRate:
      "పల్స్ రేట్",

    spo2:
      "SpO₂",

    symptoms:
      "లక్షణాలు",

    painLocation:
      "నొప్పి ఉన్న ప్రదేశం",

painHead: "తల",
painNeck: "మెడ",
painChest: "ఛాతీ",
painAbdomen: "పొత్తికడుపు",
painBack: "వీపు",
painShoulder: "భుజం",
painArm: "చేయి",
painThigh: "తొడ",
painKnee: "మోకాలు",
painCalf: "పిక్క",
painFeet: "పాదాలు",
painOther: "ఇతర",

otherPainPlaceholder:
  "ఉదాహరణ: ఎడమ భుజం, కుడి మోచేయి...",

    medications:
      "మందులు",

    notes:
      "గమనికలు",

symptomFever:
  "జ్వరం",

symptomWeakness:
  "బలహీనత",

symptomBodyPain:
  "ఒంటి నొప్పులు",

symptomCough:
  "దగ్గు",

symptomBloodInCough:
  "దగ్గులో రక్తం",

symptomBreathlessness:
  "శ్వాస తీసుకోవడంలో ఇబ్బంది",

symptomWalkingDifficulty:
  "నడవడంలో ఇబ్బంది",

symptomLossOfAppetite:
  "ఆకలి తగ్గడం",

symptomLooseMotions:
  "విరేచనాలు",

symptomVomiting:
  "వాంతులు",

symptomDryMouth:
  "నోరు పొడిబారడం",

symptomOther:
  "ఇతర",

pleaseSpecify:
  "దయచేసి వివరించండి",

otherSymptomPlaceholder:
  "ఉదాహరణ: తల తిరగడం, చలి, వాపు...",

saving: "సేవ్ అవుతోంది...",
saveReading: "రీడింగ్‌ను సేవ్ చేయండి",
backToDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",

recordingFor:
  "మీరు ఎవరి కోసం రోజువారీ సంరక్షణను నమోదు చేస్తున్నారు?",

chooseOneOption:
  "దయచేసి ఒక ఎంపికను ఎంచుకోండి.",

myself:
  "నా కోసం",

familyMember:
  "కుటుంబ సభ్యుడు",
  },

  alerts: {
    imageReadSuccess:
      "ఫోటో విజయవంతంగా చదవబడింది. సేవ్ చేసే ముందు నమోదు చేసిన రీడింగ్స్‌ను ఒకసారి సరిచూసుకోండి.",

    invalidMedicalImage:
      "దయచేసి థర్మామీటర్, బ్లడ్ ప్రెషర్ మానిటర్ లేదా పల్స్ ఆక్సీమీటర్ డిస్‌ప్లే స్పష్టంగా కనిపించే ఫోటోను అప్‌లోడ్ చేయండి.",

    multipleReadings:
      "ఫోటోలో ఒకటి కంటే ఎక్కువ వేర్వేరు రీడింగ్స్ కనిపించాయి. దయచేసి తాజా రీడింగ్ మాత్రమే కనిపించే ఫోటోను అప్‌లోడ్ చేయండి.",

    creditsOver:
      "క్రెడిట్స్ అయిపోయాయి. అడ్మిన్‌ను సంప్రదించండి.",

    imageProcessingFailed:
      "మెడికల్ ఫోటోను ప్రాసెస్ చేయలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.",

    saveSuccess:
      "రోజువారీ సంరక్షణ రీడింగ్ విజయవంతంగా సేవ్ అయింది.",

    saveFailed:
      "రోజువారీ సంరక్షణ రీడింగ్‌ను సేవ్ చేయలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.",
  },

  reports: {
    dailyCareReport:
      "రోజువారీ సంరక్షణ రిపోర్ట్",

    patientSummary:
      "రోగి వివరాల సారాంశం",

    recordedOn:
      "నమోదు చేసిన సమయం",

    vitalSigns:
      "ముఖ్యమైన ఆరోగ్య రీడింగ్స్",

    bloodPressure:
      "బ్లడ్ ప్రెషర్",

    pulse:
      "పల్స్",
  },

dashboard: {

  title:
    "డ్యాష్‌బోర్డ్",

  dailyCareSection:
    "రోజువారీ సంరక్షణ",

  dailyCare:
    "రోజువారీ సంరక్షణ",

  helpCentre:
    "సహాయ కేంద్రం",

  assessmentSection:
    "ఆరోగ్య అంచనా",

  familyAssessment:
    "కుటుంబ ఆరోగ్య అంచనా",

  selfAssessment:
    "స్వీయ ఆరోగ్య అంచనా",

  patientManagement:
    "రోగి నిర్వహణ",

  addPatient:
    "రోగిని జోడించండి",

  reports:
    "నివేదికలు",

  logout:
    "లాగ్ అవుట్",

  loading:
    "డ్యాష్‌బోర్డ్ లోడ్ అవుతోంది...",

  createdBy:
    "సూరజ్ ప్రేమ్‌నాథ్ రూపొందించారు",

},

addPatient: {
  title: "రోగిని జోడించండి",
  loading: "లోడ్ అవుతోంది...",

  fullName: "పూర్తి పేరు",
  fullNamePlaceholder: "రోగి పూర్తి పేరును నమోదు చేయండి",

  dateOfBirth: "పుట్టిన తేదీ",
  age: "వయస్సు",
  years: "సంవత్సరాలు",

  gender: "లింగం",
  selectGender: "లింగాన్ని ఎంచుకోండి",
  male: "పురుషుడు",
  female: "స్త్రీ",
  other: "ఇతర",
  preferNotToSay: "చెప్పడానికి ఇష్టపడను",

  relationship: "సంబంధం",
  selectRelationship: "సంబంధాన్ని ఎంచుకోండి",

  father: "తండ్రి",
  mother: "తల్లి",
  spouse: "జీవిత భాగస్వామి",
  brother: "సోదరుడు",
  sister: "సోదరి",
  son: "కుమారుడు",
  daughter: "కుమార్తె",
  grandfather: "తాత",
  grandmother: "అమ్మమ్మ / నానమ్మ",
  uncle: "మామ / బాబాయి",
  aunt: "అత్త / పిన్ని",
  friend: "స్నేహితుడు",
  neighbour: "పొరుగువారు",

  savingPatient: "రోగి సమాచారాన్ని సేవ్ చేస్తోంది...",
  savePatient: "రోగిని సేవ్ చేయండి",
  backToDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",

  createdBy: "సూరజ్ ప్రేమ్‌నాథ్ రూపొందించారు",

  saveFailed: "రోగి సమాచారాన్ని సేవ్ చేయలేకపోయాం.",
  saveSuccess: "రోగి విజయవంతంగా జోడించబడ్డారు.",
  unexpectedError:
    "రోగి సమాచారాన్ని సేవ్ చేస్తున్నప్పుడు సమస్య ఏర్పడింది.",
},

};
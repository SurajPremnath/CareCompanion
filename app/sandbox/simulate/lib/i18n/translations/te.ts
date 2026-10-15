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

takePhoto: "ఫోటో తీయండి",
chooseExistingPhoto: "ఇప్పటికే ఉన్న ఫోటోను ఎంచుకోండి",
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

home:
    "హోమ్",

whatWouldYouLikeToDo:
    "మీరు ఏమి చేయాలనుకుంటున్నారు?",

recordHealth:
    "ఆరోగ్య సమాచారాన్ని నమోదు చేయండి",

recordHealthDescription:
    "మీ లేదా కుటుంబ సభ్యుని ఆరోగ్య సమాచారాన్ని నమోదు చేయండి",

viewHealth:
    "ఆరోగ్య సమాచారాన్ని చూడండి",

viewHealthDescription:
    "ఆరోగ్య కాలక్రమం, నివేదికలు మరియు ధోరణులను చూడండి",

helpAndFaqs:
    "సహాయం మరియు సాధారణ ప్రశ్నలు",

helpAndFaqsDescription:
    "CareVR ఎలా ఉపయోగించాలో తెలుసుకోండి మరియు సమాధానాలు పొందండి",

backToHome:
    "హోమ్‌కు తిరిగి వెళ్లండి",

healthCheckAssessment:
    "ఆరోగ్య తనిఖీ అంచనా",

healthHistory:
    "ఆరోగ్య చరిత్ర",

medicationManagement:
    "ఔషధ నిర్వహణ",
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

assessment: {
  tagline:
    "సులభమైన రోజువారీ సంరక్షణ.\nమెరుగైన వైద్య సంభాషణలు.",

  selfAssessment:
    "స్వీయ ఆరోగ్య అంచనా",

  familyAssessment:
    "కుటుంబ ఆరోగ్య అంచనా",

  page:
    "పేజీ",

  of:
    "లో",

  healthCheckToday:
    "ఈరోజు ఆరోగ్య తనిఖీ",

  feelFeverish:
    "ఈరోజు మీకు జ్వరంగా అనిపిస్తోందా?",

  temperatureTaken:
    "మీ ఉష్ణోగ్రతను కొలిచారా?",

  latestTemperature:
    "తాజా ఉష్ణోగ్రత రీడింగ్",

  temperaturePlaceholder:
    "ఉదాహరణ: 101.4",

  energyToday:
    "ఈరోజు మీ శక్తి స్థాయి ఎలా ఉంది?",

  good:
    "బాగుంది",

  tired:
    "అలసటగా ఉంది",

  veryTired:
    "చాలా అలసటగా ఉంది",

  previous:
    "వెనుకకు",

  next:
    "తదుపరి",

  alertFever:
    "మీకు జ్వరంగా అనిపిస్తోందా అనే ప్రశ్నకు సమాధానం ఇవ్వండి.",

  alertTemperatureTaken:
    "ఉష్ణోగ్రత కొలిచారా అనే ప్రశ్నకు సమాధానం ఇవ్వండి.",

  alertTemperatureReading:
    "దయచేసి ఉష్ణోగ్రత రీడింగ్‌ను నమోదు చేయండి.",

  alertEnergy:
    "దయచేసి మీ శక్తి స్థాయిని ఎంచుకోండి.",

appetiteToday:
  "ఈరోజు మీ ఆకలి ఎలా ఉంది?",

appetiteNormal:
  "సాధారణంగా ఉంది",

appetiteLess:
  "తక్కువగా తింటున్నాను",

appetitePoor:
  "చాలా తక్కువగా తింటున్నాను",

drinkingEnoughWater:
  "మీరు తగినంత నీరు తాగుతున్నారా?",

notSure:
  "ఖచ్చితంగా తెలియదు",

waterIntake:
  "నీటి తీసుకోవడం",

alertAllQuestions:
  "దయచేసి అన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి.",

alertWaterIntake:
  "దయచేసి నీటి తీసుకునే పరిమాణాన్ని ఎంచుకోండి.",

discomfortToday:
  "ఈరోజు మీకు ఏదైనా నొప్పి లేదా అసౌకర్యం అనిపించిందా?",

discomfortWhere:
  "మీకు నొప్పి లేదా అసౌకర్యం ఎక్కడ అనిపించింది?",

areaHead: "తల",
areaEyes: "కళ్లు",
areaEars: "చెవులు",
areaNeck: "మెడ",
areaChest: "ఛాతీ",
areaBack: "వీపు",
areaStomach: "కడుపు",
areaArmsHands: "చేతులు / అరచేతులు",
areaLegsFeet: "కాళ్లు / పాదాలు",
areaJoints: "కీళ్లు",
areaOther: "ఇతర",

describeDiscomfort:
  "నొప్పి లేదా అసౌకర్యాన్ని వివరించండి",

alertQuestion:
  "దయచేసి ప్రశ్నకు సమాధానం ఇవ్వండి.",

alertDiscomfortAreas:
  "దయచేసి నొప్పి లేదా అసౌకర్యం ఉన్న ప్రదేశాలను ఎంచుకోండి.",

alertSpecifyDiscomfort:
  "దయచేసి నొప్పి లేదా అసౌకర్యాన్ని వివరించండి.",

walkingToday:
  "మీరు ఈరోజు నడవగలుగుతున్నారా?",

walkingEasily:
  "సులభంగా",

walkingSomeDifficulty:
  "కొంత ఇబ్బందితో",

walkingVeryDifficult:
  "చాలా ఇబ్బందిగా ఉంది",

needHelpWalking:
  "నడవడానికి సహాయం అవసరమా?",

looseMotionsToday:
  "ఈరోజు విరేచనాలు ఉన్నాయా?",

looseMotionType:
  "ఏ రకం?",

looseMotionWatery:
  "నీళ్లలా",

looseMotionSticky:
  "జిగటగా",

finishAssessment:
  "అంచనాను పూర్తి చేయండి",

alertWalkingHelp:
  "నడవడానికి సహాయం అవసరమా అనే ప్రశ్నకు సమాధానం ఇవ్వండి.",

alertLooseMotionType:
  "దయచేసి విరేచనాల రకాన్ని ఎంచుకోండి.",

assessmentDetails:
  "అంచనా వివరాలు",

yourName:
  "మీ పేరు",

enterYourName:
  "మీ పేరును నమోదు చేయండి",

yourAge:
  "మీ వయస్సు",

enterYourAge:
  "మీ వయస్సును నమోదు చేయండి",

startAssessment:
  "అంచనాను ప్రారంభించండి",

alertNameAndAge:
  "దయచేసి పేరు మరియు వయస్సును నమోదు చేయండి",

selectPatientToBegin:
  "అంచనాను ప్రారంభించడానికి రోగిని ఎంచుకోండి.",

noPatientsFound:
  "రోగులు ఎవరూ కనబడలేదు. దయచేసి ముందుగా ఒక రోగిని జోడించండి.",

selectPatient:
  "రోగిని ఎంచుకోండి",

name:
  "పేరు",

age:
  "వయస్సు",

gender:
  "లింగం",

relationship:
  "సంబంధం",

addNewPatient:
  "కొత్త రోగిని జోడించండి",

backToDashboard:
  "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",

unableToContinue:
  "కొనసాగించడం సాధ్యం కాదు",

profileLoadError:
  "మీ ప్రొఫైల్‌ను లోడ్ చేయలేకపోయాం. దయచేసి మళ్లీ సైన్ ఇన్ చేయండి.",

patientLoadError:
  "రోగుల సమాచారాన్ని లోడ్ చేయలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.",

pageLoadError:
  "ఈ పేజీని లోడ్ చేస్తున్నప్పుడు సమస్య ఏర్పడింది. దయచేసి పేజీని రిఫ్రెష్ చేసి మళ్లీ ప్రయత్నించండి.",

breathingToday:
  "ఈరోజు రోగి శ్వాస తీసుకోవడం ఎలా ఉంది?",

breathingNormal:
  "సాధారణం",

breathingSlightlyDifficult:
  "కొద్దిగా ఇబ్బంది",

breathingVeryDifficult:
  "చాలా ఇబ్బంది",

coughingToday:
  "ఈరోజు రోగికి దగ్గు ఉందా?",

coughSometimes:
  "అప్పుడప్పుడు",

coughFrequently:
  "తరచుగా",

bloodWhileCoughing:
  "దగ్గుతున్నప్పుడు రక్తం కనిపించిందా?",

alertBloodInCough:
  "దగ్గుతున్నప్పుడు రక్తం కనిపించిందా అనే ప్రశ్నకు దయచేసి సమాధానం ఇవ్వండి.",

patientFeverishToday:
  "ఈరోజు రోగికి జ్వరం ఉన్నట్లు అనిపించిందా?",

temperatureMeasured:
  "ఉష్ణోగ్రతను కొలిచారా?",

enterLatestTemperature:
  "తాజా ఉష్ణోగ్రతను నమోదు చేయండి",

patientEnergyToday:
  "ఈరోజు రోగి ఎంత చురుకుగా కనిపించారు?",

energyActive:
  "చురుకుగా",

energyLessActive:
  "తక్కువ చురుకుగా",

energyVeryWeak:
  "చాలా బలహీనంగా",

alertTemperatureMeasured:
  "ఉష్ణోగ్రతను కొలిచారా లేదా అనే విషయాన్ని దయచేసి తెలియజేయండి.",

patientEatingToday:
  "ఈ రోజు రోగి ఆహారం తీసుకోవడం ఎలా ఉంది?",

patientDrinkingEnoughWater:
  "రోగి ఈ రోజు తగినంత నీరు తాగారా?",

patientWaterGlasses:
  "రోగి సుమారుగా ఎన్ని గ్లాసుల నీరు తాగారు?",

oneGlass:
  "1 గ్లాసు",

twoGlasses:
  "2 గ్లాసులు",

threeGlasses:
  "3 గ్లాసులు",

fourGlasses:
  "4 గ్లాసులు",

fivePlusGlasses:
  "5+ గ్లాసులు",

patientDiscomfortToday:
  "రోగికి ఈ రోజు ఏదైనా అసౌకర్యం అనిపించిందా?",

patientDiscomfortWhere:
  "రోగికి ఎక్కడ అసౌకర్యం అనిపించింది?",

areaArms:
  "చేతులు",

areaLegs:
  "కాళ్లు",

alertPatientDiscomfortAreas:
  "రోగికి ఎక్కడ అసౌకర్యం అనిపించిందో ఎంచుకోండి.",

alertOtherDiscomfortArea:
  "దయచేసి ఇతర అసౌకర్య ప్రాంతాన్ని పేర్కొనండి.",

patientWalkingToday:
  "ఈ రోజు రోగి నడక ఎలా ఉంది?",

walkedEasily:
  "సులభంగా నడిచారు",

patientNeedHelpWalking:
  "రోగికి నడవడానికి సహాయం అవసరమైందా?",

alertWalkingHelpNeeded:
  "నడవడానికి సహాయం అవసరమైందో లేదో తెలియజేయండి.",

looseMotionsObserved:
  "విరేచనాలు గమనించారా?",

looseMotionTypeObserved:
  "ఏ రకమైన విరేచనాలు గమనించారు?",

patientConfusedToday:
  "రోగి ఈ రోజు అసాధారణంగా అయోమయంలో ఉన్నట్లు కనిపించారా?",

},

medication: {

    //--------------------------------------------------
    // General
    //--------------------------------------------------

    title:
        "ఔషధ నిర్వహణ",

    addPrescription:
        "ప్రిస్క్రిప్షన్ జోడించండి",

    viewPrescriptions:
        "భద్రపరచిన ప్రిస్క్రిప్షన్లను చూడండి",

    prescriptionDetails:
        "ప్రిస్క్రిప్షన్ వివరాలు",

    reviewPrescription:
        "ప్రిస్క్రిప్షన్ సమీక్ష",

    //--------------------------------------------------
    // Upload
    //--------------------------------------------------

    takePhoto:
        "ఫోటో తీయండి",

    choosePhotos:
        "ఫోటోలను ఎంచుకోండి",

    uploadPdf:
        "PDF అప్‌లోడ్ చేయండి",

    readPrescription:
        "ప్రిస్క్రిప్షన్ చదవండి",

    readingPrescription:
        "ప్రిస్క్రిప్షన్ చదువుతోంది...",

    preparingPrescription:
        "ప్రిస్క్రిప్షన్ సిద్ధం చేస్తోంది...",

    prescriptionReadSuccess:
        "ప్రిస్క్రిప్షన్ విజయవంతంగా చదవబడింది.",

    //--------------------------------------------------
    // Consultation
    //--------------------------------------------------

    consultationDate:
        "సంప్రదింపు తేదీ",

    consultationMode:
        "సంప్రదింపు రకం",

    doctor:
        "వైద్యుడు",

    hospital:
        "ఆసుపత్రి / క్లినిక్",

    diagnosisAssessment:
        "వ్యాధి నిర్ధారణ / అంచనా",

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    medicines:
        "ఔషధాలు",

    medicine:
        "ఔషధం",

    dosage:
        "మోతాదు",

    frequency:
        "తరచుదనం",

    duration:
        "వ్యవధి",

    instructions:
        "సూచనలు",

    //--------------------------------------------------
    // Actions
    //--------------------------------------------------

    savePrescription:
        "నిర్ధారించి భద్రపరచండి",

    savingPrescription:
        "భద్రపరుస్తోంది...",

    reupload:
        "ప్రిస్క్రిప్షన్‌ను మళ్లీ అప్‌లోడ్ చేయండి",

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    consultationDateRequired:
        "సంప్రదింపు తేదీ తప్పనిసరి.",

    consultationDateFuture:
        "సంప్రదింపు తేదీ భవిష్యత్తు తేదీ కాకూడదు.",

    consultationDateInvalid:
        "చెల్లని సంప్రదింపు తేదీ.",

    consultationTypeRequired:
        "దయచేసి సంప్రదింపు రకాన్ని ఎంచుకోండి.",

    patientRequired:
        "దయచేసి రోగిని ఎంచుకోండి.",

    patientMismatch:
        "ఈ ప్రిస్క్రిప్షన్ మరొక రోగికి చెందినదిగా కనిపిస్తోంది.",

    //--------------------------------------------------
    // Warnings
    //--------------------------------------------------

    warningTitle:
        "హెచ్చరికలతో సమీక్ష పూర్తయింది",

    doctorNotDetected:
        "వైద్యుని పేరు గుర్తించబడలేదు.",

    hospitalNotDetected:
        "ఆసుపత్రి లేదా క్లినిక్ పేరు గుర్తించబడలేదు.",

    diagnosisNotDetected:
        "వ్యాధి నిర్ధారణ లేదా అంచనా గుర్తించబడలేదు.",

    medicinesNotDetected:
        "ఏ ఔషధాలు గుర్తించబడలేదు.",

    warningContinue:
        "సమాచారం సరైనదైతే ఈ ప్రిస్క్రిప్షన్‌ను అయినప్పటికీ భద్రపరచవచ్చు.",

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    saveSuccess:
        "ప్రిస్క్రిప్షన్ విజయవంతంగా భద్రపరచబడింది.",

    saveFailed:
        "ప్రిస్క్రిప్షన్‌ను భద్రపరచడం సాధ్యపడలేదు.",

    selectPrescription:
        "దయచేసి ఒక ప్రిస్క్రిప్షన్‌ను ఎంచుకోండి.",

    readFailed:
        "ప్రిస్క్రిప్షన్‌ను చదవడం సాధ్యపడలేదు.",

    processingFailed:
        "ప్రిస్క్రిప్షన్‌ను ప్రాసెస్ చేయడం సాధ్యపడలేదు.",

    patientMismatchTitle:
        "ప్రిస్క్రిప్షన్ వేరే రోగికి చెందినది",

    patient:
        "రోగి",

    patientDetails:
        "రోగి వివరాలు",

    patientSymptoms:
        "రోగి లక్షణాలు",

    assessment:
        "అంచనా",

    additionalDiagnoses:
        "అదనపు వ్యాధి నిర్ధారణలు",

    examinationFindings:
        "పరీక్ష ఫలితాలు",

    relevantMedicalHistory:
        "సంబంధిత వైద్య చరిత్ర",

    lifestyle:
        "జీవనశైలి",

    consultationVitals:
        "సంప్రదింపు జీవచిహ్నాలు",

    investigationsOrdered:
        "సూచించిన పరీక్షలు",

    careInstructions:
        "సంరక్షణ సూచనలు",

    otherNotes:
        "ఇతర గమనికలు",

    medicationsPrescribed:
        "సూచించిన ఔషధాలు",

    importantAdministrationTiming:
        "ముఖ్యం: ఔషధం తీసుకునే సమయం",

    administrationTimingInfo1:
        "ఔషధాన్ని భోజనం ముందు, తర్వాత, భోజనంతో లేదా ఇతర సమయంలో తీసుకోవాలా అనే విషయాన్ని CareVR స్వయంచాలకంగా నిర్ణయించదు.",

    administrationTimingInfo2:
        "విలువను ఎంచుకునే ముందు సరైన ఔషధ సేవన సమయాన్ని వైద్యునితో నిర్ధారించండి.",

    administrationTimingInfo3:
        "ఔషధ సేవన సమయం ఇంకా నిర్ధారించబడకపోతే 'పేర్కొనబడలేదు'గా ఉంచి తర్వాత నవీకరించండి.",

    noMedicinesDetected:
        "ఏ ఔషధాలను గుర్తించలేకపోయాము.",

    aiExtractedDate:
        "AI గుర్తించిన తేదీ",

    consultationDateHelp:
        "తేదీ తప్పుగా ఉంటే సరైన సంప్రదింపు తేదీని ఎంచుకోండి.",

    weight:
        "బరువు",

    bloodPressure:
        "రక్తపోటు",

    pulse:
        "నాడి",

    temperature:
        "ఉష్ణోగ్రత",

    spo2:
        "SpO₂",

    strength:
        "శక్తి",

    dose:
        "మోతాదు",

    administrationTiming:
        "ఔషధం తీసుకునే సమయం",

    //--------------------------------------------------
    // Administration Timing
    //--------------------------------------------------

    notSpecified:
        "పేర్కొనబడలేదు",

    beforeFood:
        "భోజనం ముందు",

    afterFood:
        "భోజనం తర్వాత",

    withFood:
        "భోజనంతో",

    emptyStomach:
        "ఖాళీ కడుపుతో",

    beforeBreakfast:
        "ఉదయం అల్పాహారం ముందు",

    afterBreakfast:
        "ఉదయం అల్పాహారం తర్వాత",

    beforeLunch:
        "మధ్యాహ్న భోజనం ముందు",

    afterLunch:
        "మధ్యాహ్న భోజనం తర్వాత",

    beforeDinner:
        "రాత్రి భోజనం ముందు",

    afterDinner:
        "రాత్రి భోజనం తర్వాత",

    atBedtime:
        "నిద్రకు ముందు",

    asDirected:
        "వైద్యుని సూచన ప్రకారం",

whatWouldYouLikeToDo:
    "మీరు ఏమి చేయాలనుకుంటున్నారు?",

modeOfConsultation:
    "సంప్రదింపు రకం",

howWouldYouLikeToAddPrescription:
    "మీరు ప్రిస్క్రిప్షన్‌ను ఎలా జోడించాలనుకుంటున్నారు?",

forBestResults:
    "ఉత్తమ ఫలితాల కోసం",

supportedFormats:
    "మద్దతు ఉన్న ఫార్మాట్లు: JPG, JPEG మరియు PNG",

useClearImages:
    "స్పష్టమైన మరియు మంచి వెలుతురు ఉన్న చిత్రాలను ఉపయోగించండి",

cropBackground:
    "అనవసరమైన నేపథ్యాన్ని తొలగించండి",

recommendedImageSize:
    "సిఫార్సు చేసిన చిత్ర పరిమాణం: 300 KB – 1 MB",

maximumImageSize:
    "ప్రతి చిత్రానికి గరిష్ట పరిమాణం: 2 MB",

howWasConsultationConducted:
    "సంప్రదింపు ఎలా జరిగింది?",

inPerson:
    "ప్రత్యక్షంగా",

video:
    "వీడియో",

phone:
    "ఫోన్",

homeVisit:
    "ఇంటి సందర్శన",

other:
    "ఇతర",

howWouldYouLikeToRecordHealth:
    "మీరు ఆరోగ్యాన్ని ఎలా నమోదు చేయాలనుకుంటున్నారు?",

recordWithVoice:
    "వాయిస్‌తో నమోదు చేయండి",

uploadReading:
    "రీడింగ్‌ను అప్‌లోడ్ చేయండి",

enterManually:
    "మాన్యువల్‌గా నమోదు చేయండి",

dailyCare:
    "రోజువారీ సంరక్షణ",

assessmentsHistory:
    "అంచనాలు",

clinicalTrends:
    "క్లినికల్ ధోరణులు",

detailedTimeline:
    "వివరణాత్మక కాలక్రమం",

pleaseSpecifyConsultationMode:
    "దయచేసి సంప్రదింపు రకాన్ని పేర్కొనండి",

validationErrorsTitle:
    "సేవ్ చేసే ముందు క్రింది లోపాలను సరిచేయండి",

patientBelongsTo:
    "ఈ ప్రిస్క్రిప్షన్ ఈ రోగికి చెందినదిగా కనిపిస్తోంది",

currentlyAddingFor:
    "మీరు ప్రస్తుతం ఈ రోగి కోసం ప్రిస్క్రిప్షన్‌ను జోడిస్తున్నారు",

chooseCorrectPatient:
    "దయచేసి సరైన ప్రిస్క్రిప్షన్‌ను మళ్లీ అప్‌లోడ్ చేయండి లేదా వెనక్కి వెళ్లి సరైన కుటుంబ సభ్యుడిని ఎంచుకోండి.",

reuploadPrescription:
    "ప్రిస్క్రిప్షన్‌ను మళ్లీ అప్‌లోడ్ చేయండి",

whoIsThisFor:
    "ఇది ఎవరి కోసం?",

//--------------------------------------------------
// Consultation Workspace
//--------------------------------------------------

consultationDetails:
    "సంప్రదింపు వివరాలు",

consultationDetailsDescription:
    "మీకు తెలిసిన వివరాలను నమోదు చేయండి. ఐచ్ఛిక ఫీల్డ్‌లను ఖాళీగా వదిలివేయవచ్చు.",

doctorName:
    "డాక్టర్ పేరు",

enterDoctorName:
    "డాక్టర్ పేరును నమోదు చేయండి",

hospitalOrClinic:
    "ఆసుపత్రి / క్లినిక్",

enterHospitalOrClinic:
    "ఆసుపత్రి లేదా క్లినిక్ పేరును నమోదు చేయండి",

optional:
    "ఐచ్ఛికం",

videoPlatform:
    "వీడియో ప్లాట్‌ఫారమ్",

exampleVideoPlatform:
    "ఉదాహరణ: WhatsApp, Zoom",

consultationType:
    "సంప్రదింపు రకం",

phoneConsultation:
    "ఫోన్ సంప్రదింపు",

doctorServiceDetails:
    "డాక్టర్ / సేవ వివరాలు",

enterDoctorServiceDetails:
    "డాక్టర్ లేదా సేవ వివరాలను నమోదు చేయండి",

consultationMethod:
    "సంప్రదింపు విధానం",

describeConsultationMethod:
    "సంప్రదింపు విధానాన్ని వివరించండి",

consultationNotes:
    "గమనికలు",

enterConsultationNotes:
    "సంప్రదింపు గమనికలను నమోదు చేయండి",

//--------------------------------------------------
// Prescription Review
//--------------------------------------------------

reviewNoteTitle:
    "సేవ్ చేయడానికి ముందు సమీక్షించండి",

reviewNoteDescription:
    "క్రింద ఉన్న సమాచారం అప్లోడ్ చేసిన ప్రిస్క్రిప్షన్ నుండి AI ద్వారా సేకరించబడింది. సేవ్ చేసే ముందు దయచేసి దాని ఖచ్చితత్వాన్ని నిర్ధారించండి.",

reviewInstruction:
    "సేవ్ చేయడానికి ముందు ప్రతి విభాగాన్ని తెరిచి సేకరించిన సమాచారాన్ని ధృవీకరించండి.",

//--------------------------------------------------
// Prescription Upload
//--------------------------------------------------

uploadFailed:
    "ఎంచుకున్న ప్రిస్క్రిప్షన్ చిత్రం(లు) అప్లోడ్ చేయలేకపోయాము.",

filesTooLarge:
    "క్రింది ఫైల్(లు) అనుమతించిన పరిమాణాన్ని మించాయి.",

recommendedUploadSize:
    "సిఫార్సు చేసిన పరిమాణం: ప్రతి చిత్రానికి 300 KB – 1 MB.",

maximumUploadSize:
    "గరిష్ట అనుమతించబడిన పరిమాణం: ప్రతి చిత్రానికి 2 MB.",

cropBackgroundBeforeUpload:
    "అప్లోడ్ చేసే ముందు అవసరం లేని నేపథ్యాన్ని తొలగించండి.",

reduceImageSize:
    "దయచేసి చిత్ర పరిమాణాన్ని తగ్గించి మళ్లీ ప్రయత్నించండి.",

cameraUnavailable:
    "కెమెరాను ఉపయోగించలేకపోయాము.",

readingFailed:
    "ప్రిస్క్రిప్షన్‌ను చదవలేకపోయాము.",

savingFailed:
    "ప్రిస్క్రిప్షన్‌ను సేవ్ చేయలేకపోయాము.",

prescriptionSaved:
    "ప్రిస్క్రిప్షన్ విజయవంతంగా సేవ్ చేయబడింది.",

//--------------------------------------------------
// Additional UI Messages
//--------------------------------------------------

uploadFileTooLargeMessage:
    "ఎంచుకున్న ప్రిస్క్రిప్షన్ చిత్రాలను అప్లోడ్ చేయలేకపోయాము.\n\n" +
    "క్రింది ఫైళ్లు అనుమతించిన పరిమాణాన్ని మించాయి:\n\n" +
    "{fileNames}\n\n" +
    "మెరుగైన అనుభవం కోసం (ప్రత్యేకంగా iPhone లో):\n\n" +
    "• సిఫార్సు చేసిన పరిమాణం: ప్రతి చిత్రానికి 300 KB - 1 MB\n" +
    "• గరిష్ట అనుమతించబడిన పరిమాణం: ప్రతి చిత్రానికి 2 MB\n" +
    "• అప్లోడ్ చేసే ముందు అవసరం లేని నేపథ్యాన్ని తొలగించండి\n\n" +
    "దయచేసి చిత్ర పరిమాణాన్ని తగ్గించి మళ్లీ ప్రయత్నించండి.",

pleaseRecordatleastOneObservation:
    "దయచేసి కనీసం ఒక ఆరోగ్య పరిశీలనను నమోదు చేయండి.\n\n" +
    "• ఉష్ణోగ్రత\n" +
    "• బరువు\n" +
    "• ముఖ్యమైన రీడింగ్స్ (Vitals)\n" +
    "• లక్షణాలు\n" +
    "• నొప్పి ఉన్న ప్రదేశం",

choosePhoto:
    "ఫోటోను ఎంచుకోండి",

currentlyAddingPrescriptionFor:
    "మీరు ప్రస్తుతం ఈ రోగి కోసం ప్రిస్క్రిప్షన్‌ను జోడిస్తున్నారు",

capturePhoto:
    "ఫోటో తీయండి",

chooseCorrectPrescription:
    "దయచేసి సరైన ప్రిస్క్రిప్షన్‌ను మళ్లీ అప్లోడ్ చేయండి లేదా వెనక్కి వెళ్లి సరైన కుటుంబ సభ్యుడిని ఎంచుకోండి.",

prescriptionReadError:
    "ప్రిస్క్రిప్షన్ చదవడంలో లోపం:",

pleaseSelectFamilyMember:
    "దయచేసి కుటుంబ సభ్యుడిని ఎంచుకోండి.",

manualCareSaveError:
    "మాన్యువల్ కేర్ సేవ్ లోపం:",

clear:
    "తొలగించు",

yourFamilyMember:
    "మీ కుటుంబ సభ్యుడు",

uploadCareImageProcessingError:
    "అప్లోడ్ చేసిన ఆరోగ్య చిత్రాన్ని ప్రాసెస్ చేయడంలో లోపం:",

uploadCareSaveError:
    "ఆరోగ్య రికార్డును సేవ్ చేయడంలో లోపం:",

useAnotherPhoto:
    "మరొక ఫోటో ఉపయోగించండి",

saveHealthReading:
    "ఆరోగ్య రీడింగ్‌ను సేవ్ చేయండి",

selectTemperatureOrDontKnow:
    "దయచేసి ఉష్ణోగ్రతను ఎంచుకోండి లేదా 'నాకు తెలియదు'ని ఎంచుకోండి.",

voiceCareSaveError:
    "వాయిస్ కేర్ సేవ్ లోపం:",

reviewRecording:
    "రికార్డింగ్‌ను సమీక్షించండి",

healthUpdateReady:
    "మీ ఆరోగ్య నవీకరణ సిద్ధంగా ఉంది. మీరు దాన్ని సమీక్షించవచ్చు లేదా నేరుగా సేవ్ చేయవచ్చు.",

},

};
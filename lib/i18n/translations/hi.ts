import type {
  TranslationDictionary,
} from "../types";

export const hi: TranslationDictionary = {

  common: {
    save: "सहेजें",
    cancel: "रद्द करें",
    back: "वापस",
    loading: "लोड हो रहा है...",
    yes: "हाँ",
    no: "नहीं",
    notRecorded: "दर्ज नहीं किया गया",
  },

  dailyCare: {
    title: "दैनिक देखभाल",

    patientInformation:
      "रोगी की जानकारी",

    patient: "रोगी",

    date: "तारीख",

    time: "समय",

    readingMethodQuestion:
      "आज की रीडिंग कैसे दर्ज करना चाहेंगे?",

    uploadPhoto:
      "फोटो अपलोड करें",

    enterManually:
      "स्वयं दर्ज करें",

    captureMedicalReadings:
      "मेडिकल रीडिंग कैप्चर करें",

    captureHelp:
      "अपने मेडिकल उपकरण की रीडिंग वाली फोटो लें या चुनें।",

    takeOrSelectImage:
      "फोटो लें या चुनें",

    readingImage:
      "फोटो पढ़ी जा रही है...",

    temperature:
      "तापमान",

    unit:
      "इकाई",

    enterTemperature:
      "तापमान दर्ज करें",

    additionalVitals:
      "अन्य महत्वपूर्ण माप",

    bloodPressure:
      "रक्तचाप",

    systolic:
      "ऊपरी (सिस्टोलिक)",

    diastolic:
      "निचला (डायस्टोलिक)",

    pulseRate:
      "नाड़ी दर",

    spo2:
      "SpO₂",

    symptoms:
      "लक्षण",

    painLocation:
      "दर्द का स्थान",

painHead: "सिर",
painNeck: "गर्दन",
painChest: "छाती",
painAbdomen: "पेट",
painBack: "पीठ",
painShoulder: "कंधा",
painArm: "बाँह",
painThigh: "जांघ",
painKnee: "घुटना",
painCalf: "पिंडली",
painFeet: "पैर",
painOther: "अन्य",

otherPainPlaceholder:
  "उदाहरण: बायाँ कंधा, दाहिनी कोहनी...",

    medications:
      "दवाइयाँ",

    notes:
      "नोट्स",

symptomFever:
  "बुखार",

symptomWeakness:
  "कमज़ोरी",

symptomBodyPain:
  "शरीर में दर्द",

symptomCough:
  "खाँसी",

symptomBloodInCough:
  "खाँसी में खून",

symptomBreathlessness:
  "साँस लेने में तकलीफ़",

symptomWalkingDifficulty:
  "चलने में कठिनाई",

symptomLossOfAppetite:
  "भूख कम लगना",

symptomLooseMotions:
  "दस्त",

symptomVomiting:
  "उल्टी",

symptomDryMouth:
  "मुँह सूखना",

symptomOther:
  "अन्य",

pleaseSpecify:
  "कृपया विवरण दें",

otherSymptomPlaceholder:
  "उदाहरण: चक्कर आना, ठंड लगना, सूजन...",

saving: "सहेजा जा रहा है...",
saveReading: "रीडिंग सहेजें",
backToDashboard: "डैशबोर्ड पर वापस जाएँ",

recordingFor:
  "आप दैनिक देखभाल किसके लिए दर्ज कर रहे हैं?",

chooseOneOption:
  "कृपया एक विकल्प चुनें।",

myself:
  "स्वयं",

familyMember:
  "परिवार का सदस्य",
  },

  alerts: {
    imageReadSuccess:
      "फोटो सफलतापूर्वक पढ़ी गई। सहेजने से पहले भरी गई रीडिंग की जाँच करें।",

    invalidMedicalImage:
      "कृपया थर्मामीटर, ब्लड प्रेशर मॉनिटर या पल्स ऑक्सीमीटर की स्पष्ट फोटो अपलोड करें।",

    multipleReadings:
      "फोटो में एक से अधिक अलग-अलग रीडिंग मिली हैं। कृपया केवल नवीनतम रीडिंग की फोटो अपलोड करें।",

    creditsOver:
      "क्रेडिट समाप्त हो गए हैं। एडमिन से संपर्क करें।",

    imageProcessingFailed:
      "मेडिकल फोटो को प्रोसेस नहीं किया जा सका। कृपया फिर से प्रयास करें।",

    saveSuccess:
      "दैनिक देखभाल की रीडिंग सफलतापूर्वक सहेजी गई।",

    saveFailed:
      "दैनिक देखभाल की रीडिंग सहेजी नहीं जा सकी। कृपया फिर से प्रयास करें।",
  },

  reports: {
    dailyCareReport:
      "दैनिक देखभाल रिपोर्ट",

    patientSummary:
      "रोगी सारांश",

    recordedOn:
      "दर्ज करने का समय",

    vitalSigns:
      "महत्वपूर्ण स्वास्थ्य माप",

    bloodPressure:
      "रक्तचाप",

    pulse:
      "नाड़ी",
  },
dashboard: {

  title:
    "डैशबोर्ड",

  dailyCareSection:
    "दैनिक देखभाल",

  dailyCare:
    "दैनिक देखभाल",

  helpCentre:
    "सहायता केंद्र",

  assessmentSection:
    "स्वास्थ्य आकलन",

  familyAssessment:
    "परिवार का स्वास्थ्य आकलन",

  selfAssessment:
    "स्वयं का स्वास्थ्य आकलन",

  patientManagement:
    "रोगी प्रबंधन",

  addPatient:
    "रोगी जोड़ें",

  reports:
    "रिपोर्ट",

  logout:
    "लॉग आउट",

  loading:
    "डैशबोर्ड लोड हो रहा है...",

  createdBy:
    "सूरज प्रेमनाथ द्वारा निर्मित",

},

addPatient: {
  title: "रोगी जोड़ें",
  loading: "लोड हो रहा है...",

  fullName: "पूरा नाम",
  fullNamePlaceholder: "रोगी का पूरा नाम दर्ज करें",

  dateOfBirth: "जन्म तिथि",
  age: "आयु",
  years: "वर्ष",

  gender: "लिंग",
  selectGender: "लिंग चुनें",
  male: "पुरुष",
  female: "महिला",
  other: "अन्य",
  preferNotToSay: "बताना नहीं चाहते",

  relationship: "रिश्ता",
  selectRelationship: "रिश्ता चुनें",

  father: "पिता",
  mother: "माता",
  spouse: "जीवनसाथी",
  brother: "भाई",
  sister: "बहन",
  son: "बेटा",
  daughter: "बेटी",
  grandfather: "दादा / नाना",
  grandmother: "दादी / नानी",
  uncle: "चाचा / मामा",
  aunt: "चाची / मामी",
  friend: "मित्र",
  neighbour: "पड़ोसी",

  savingPatient: "रोगी की जानकारी सहेजी जा रही है...",
  savePatient: "रोगी को सहेजें",
  backToDashboard: "डैशबोर्ड पर वापस जाएँ",

  createdBy: "सूरज प्रेमनाथ द्वारा निर्मित",

  saveFailed: "रोगी की जानकारी सहेजी नहीं जा सकी।",
  saveSuccess: "रोगी सफलतापूर्वक जोड़ा गया।",
  unexpectedError:
    "रोगी की जानकारी सहेजते समय कुछ गलत हो गया।",
},

assessment: {
  tagline:
    "सरल दैनिक देखभाल।\nबेहतर चिकित्सकीय बातचीत।",

  selfAssessment:
    "स्वयं का स्वास्थ्य आकलन",

  familyAssessment:
    "परिवार का स्वास्थ्य आकलन",

  page:
    "पृष्ठ",

  of:
    "में से",

  healthCheckToday:
    "आज की स्वास्थ्य जाँच",

  feelFeverish:
    "क्या आज आपको बुखार जैसा महसूस हो रहा है?",

  temperatureTaken:
    "क्या आपका तापमान मापा गया?",

  latestTemperature:
    "नवीनतम तापमान रीडिंग",

  temperaturePlaceholder:
    "उदाहरण: 101.4",

  energyToday:
    "आज आपकी ऊर्जा कैसी है?",

  good:
    "अच्छी",

  tired:
    "थकान",

  veryTired:
    "बहुत अधिक थकान",

  previous:
    "पिछला",

  next:
    "अगला",

  alertFever:
    "कृपया बताएं कि क्या आपको बुखार जैसा महसूस हो रहा है।",

  alertTemperatureTaken:
    "कृपया बताएं कि क्या तापमान मापा गया था।",

  alertTemperatureReading:
    "कृपया तापमान रीडिंग दर्ज करें।",

  alertEnergy:
    "कृपया अपनी ऊर्जा का स्तर चुनें।",

appetiteToday:
  "आज आपकी भूख कैसी है?",

appetiteNormal:
  "सामान्य",

appetiteLess:
  "कम खा रहे हैं",

appetitePoor:
  "बहुत कम खा रहे हैं",

drinkingEnoughWater:
  "क्या आप पर्याप्त पानी पी रहे हैं?",

notSure:
  "पता नहीं",

waterIntake:
  "पानी का सेवन",

alertAllQuestions:
  "कृपया सभी प्रश्नों का उत्तर दें।",

alertWaterIntake:
  "कृपया पानी के सेवन की मात्रा चुनें।",

discomfortToday:
  "क्या आज आपको कोई दर्द या असुविधा महसूस हुई?",

discomfortWhere:
  "आपको दर्द या असुविधा कहाँ महसूस हुई?",

areaHead: "सिर",
areaEyes: "आँखें",
areaEars: "कान",
areaNeck: "गर्दन",
areaChest: "छाती",
areaBack: "पीठ",
areaStomach: "पेट",
areaArmsHands: "बाँहें / हाथ",
areaLegsFeet: "पैर / पाँव",
areaJoints: "जोड़",
areaOther: "अन्य",

describeDiscomfort:
  "दर्द या असुविधा का विवरण दें",

alertQuestion:
  "कृपया प्रश्न का उत्तर दें।",

alertDiscomfortAreas:
  "कृपया दर्द या असुविधा वाले स्थान चुनें।",

alertSpecifyDiscomfort:
  "कृपया दर्द या असुविधा का विवरण दें।",

walkingToday:
  "क्या आप आज चल पा रहे हैं?",

walkingEasily:
  "आसानी से",

walkingSomeDifficulty:
  "कुछ कठिनाई के साथ",

walkingVeryDifficult:
  "बहुत कठिनाई हो रही है",

needHelpWalking:
  "क्या चलने में सहायता की आवश्यकता है?",

looseMotionsToday:
  "क्या आज दस्त हुए हैं?",

looseMotionType:
  "किस प्रकार के?",

looseMotionWatery:
  "पानी जैसे",

looseMotionSticky:
  "चिपचिपे",

finishAssessment:
  "आकलन पूरा करें",

alertWalkingHelp:
  "कृपया बताएं कि क्या चलने में सहायता की आवश्यकता है।",

alertLooseMotionType:
  "कृपया दस्त का प्रकार चुनें।",

assessmentDetails:
  "आकलन विवरण",

yourName:
  "आपका नाम",

enterYourName:
  "अपना नाम दर्ज करें",

yourAge:
  "आपकी आयु",

enterYourAge:
  "अपनी आयु दर्ज करें",

startAssessment:
  "आकलन शुरू करें",

alertNameAndAge:
  "कृपया नाम और आयु दर्ज करें",

},

};
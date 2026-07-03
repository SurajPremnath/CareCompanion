import type {
  TranslationDictionary,
} from "../types";

export const mr: TranslationDictionary = {

  common: {
    save: "जतन करा",
    cancel: "रद्द करा",
    back: "मागे",
    loading: "लोड होत आहे...",
    yes: "होय",
    no: "नाही",
    notRecorded: "नोंद केलेली नाही",
  },

  dailyCare: {
    title:
      "दैनंदिन काळजी",

    patientInformation:
      "रुग्णाची माहिती",

    patient:
      "रुग्ण",

    date:
      "तारीख",

    time:
      "वेळ",

    readingMethodQuestion:
      "आजची रीडिंग्स कशी नोंदवायची आहेत?",

    uploadPhoto:
      "फोटो अपलोड करा",

    enterManually:
      "स्वतः नोंद करा",

    captureMedicalReadings:
      "वैद्यकीय रीडिंग्सचा फोटो घ्या",

    captureHelp:
      "वैद्यकीय उपकरणावरील रीडिंग्स स्पष्ट दिसतील असा फोटो घ्या किंवा फोटो निवडा.",

    takeOrSelectImage:
      "फोटो घ्या किंवा निवडा",

    readingImage:
      "फोटो वाचला जात आहे...",

    temperature:
      "शरीराचे तापमान",

    unit:
      "एकक",

    enterTemperature:
      "तापमान नोंदवा",

    additionalVitals:
      "इतर महत्त्वाची आरोग्य रीडिंग्स",

    bloodPressure:
      "रक्तदाब",

    systolic:
      "वरचा दाब (सिस्टोलिक)",

    diastolic:
      "खालचा दाब (डायस्टोलिक)",

    pulseRate:
      "नाडीचा वेग",

    spo2:
      "SpO₂",

    symptoms:
      "लक्षणे",

    painLocation:
      "वेदना असलेले ठिकाण",

painHead: "डोके",
painNeck: "मान",
painChest: "छाती",
painAbdomen: "पोट",
painBack: "पाठ",
painShoulder: "खांदा",
painArm: "हात",
painThigh: "मांडी",
painKnee: "गुडघा",
painCalf: "पोटरी",
painFeet: "पाय",
painOther: "इतर",

otherPainPlaceholder:
  "उदाहरण: डावा खांदा, उजवी कोपर...",

    medications:
      "औषधे",

    notes:
      "नोंदी",

symptomFever:
  "ताप",

symptomWeakness:
  "अशक्तपणा",

symptomBodyPain:
  "अंगदुखी",

symptomCough:
  "खोकला",

symptomBloodInCough:
  "खोकल्यातून रक्त येणे",

symptomBreathlessness:
  "श्वास घेण्यास त्रास",

symptomWalkingDifficulty:
  "चालण्यास त्रास",

symptomLossOfAppetite:
  "भूक कमी होणे",

symptomLooseMotions:
  "जुलाब",

symptomVomiting:
  "उलटी",

symptomDryMouth:
  "तोंड कोरडे पडणे",

symptomOther:
  "इतर",

pleaseSpecify:
  "कृपया तपशील द्या",

otherSymptomPlaceholder:
  "उदाहरण: चक्कर येणे, थंडी वाजणे, सूज...",

saving: "जतन करत आहे...",
saveReading: "रीडिंग जतन करा",
backToDashboard: "डॅशबोर्डवर परत जा",

recordingFor:
  "तुम्ही कोणासाठी दैनंदिन काळजीची नोंद करत आहात?",

chooseOneOption:
  "कृपया एक पर्याय निवडा.",

myself:
  "स्वतःसाठी",

familyMember:
  "कुटुंबातील सदस्य",
  },

  alerts: {
    imageReadSuccess:
      "फोटो यशस्वीपणे वाचला गेला. जतन करण्यापूर्वी भरलेली रीडिंग्स तपासा.",

    invalidMedicalImage:
      "कृपया थर्मामीटर, ब्लड प्रेशर मॉनिटर किंवा पल्स ऑक्सिमीटरचा डिस्प्ले स्पष्ट दिसणारा फोटो अपलोड करा.",

    multipleReadings:
      "फोटोमध्ये एकापेक्षा जास्त वेगवेगळी रीडिंग्स आढळली. कृपया फक्त नवीनतम रीडिंग दिसणारा फोटो अपलोड करा.",

    creditsOver:
      "क्रेडिट्स संपले आहेत. ॲडमिनशी संपर्क साधा.",

    imageProcessingFailed:
      "वैद्यकीय फोटो प्रक्रिया करता आली नाही. कृपया पुन्हा प्रयत्न करा.",

    saveSuccess:
      "दैनंदिन काळजीची रीडिंग यशस्वीपणे जतन झाली.",

    saveFailed:
      "दैनंदिन काळजीची रीडिंग जतन करता आली नाही. कृपया पुन्हा प्रयत्न करा.",
  },

  reports: {
    dailyCareReport:
      "दैनंदिन काळजी अहवाल",

    patientSummary:
      "रुग्णाचा सारांश",

    recordedOn:
      "नोंदवलेली वेळ",

    vitalSigns:
      "महत्त्वाची आरोग्य रीडिंग्स",

    bloodPressure:
      "रक्तदाब",

    pulse:
      "नाडी",
  },
dashboard: {

  title:
    "डॅशबोर्ड",

  dailyCareSection:
    "दैनंदिन काळजी",

  dailyCare:
    "दैनंदिन काळजी",

  helpCentre:
    "मदत केंद्र",

  assessmentSection:
    "आरोग्य मूल्यांकन",

  familyAssessment:
    "कुटुंबाचे आरोग्य मूल्यांकन",

  selfAssessment:
    "स्वतःचे आरोग्य मूल्यांकन",

  patientManagement:
    "रुग्ण व्यवस्थापन",

  addPatient:
    "रुग्ण जोडा",

  reports:
    "अहवाल",

  logout:
    "लॉग आउट",

  loading:
    "डॅशबोर्ड लोड होत आहे...",

  createdBy:
    "सूरज प्रेमनाथ यांनी तयार केले",

},

};
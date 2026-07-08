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

takePhoto: "फोटो काढा",
chooseExistingPhoto: "आधीचा फोटो निवडा",
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

home:
    "मुख्यपृष्ठ",

whatWouldYouLikeToDo:
    "तुम्हाला काय करायचे आहे?",

recordHealth:
    "आरोग्य माहिती नोंदवा",

recordHealthDescription:
    "स्वतःची किंवा कुटुंबातील सदस्याची आरोग्य माहिती नोंदवा",

viewHealth:
    "आरोग्य माहिती पहा",

viewHealthDescription:
    "आरोग्य कालरेषा, अहवाल आणि कल पहा",

helpAndFaqs:
    "मदत आणि सामान्य प्रश्न",

helpAndFaqsDescription:
    "CareVR कसे वापरायचे ते जाणून घ्या आणि प्रश्नांची उत्तरे मिळवा",

backToHome:
    "मुख्यपृष्ठावर परत जा",
},

addPatient: {
  title: "रुग्ण जोडा",
  loading: "लोड होत आहे...",

  fullName: "पूर्ण नाव",
  fullNamePlaceholder: "रुग्णाचे पूर्ण नाव नोंदवा",

  dateOfBirth: "जन्मतारीख",
  age: "वय",
  years: "वर्षे",

  gender: "लिंग",
  selectGender: "लिंग निवडा",
  male: "पुरुष",
  female: "महिला",
  other: "इतर",
  preferNotToSay: "सांगू इच्छित नाही",

  relationship: "नाते",
  selectRelationship: "नाते निवडा",

  father: "वडील",
  mother: "आई",
  spouse: "जोडीदार",
  brother: "भाऊ",
  sister: "बहीण",
  son: "मुलगा",
  daughter: "मुलगी",
  grandfather: "आजोबा",
  grandmother: "आजी",
  uncle: "काका / मामा",
  aunt: "काकू / मावशी",
  friend: "मित्र",
  neighbour: "शेजारी",

  savingPatient: "रुग्णाची माहिती जतन होत आहे...",
  savePatient: "रुग्णाची माहिती जतन करा",
  backToDashboard: "डॅशबोर्डवर परत जा",

  createdBy: "सूरज प्रेमनाथ यांनी तयार केले",

  saveFailed: "रुग्णाची माहिती जतन करता आली नाही.",
  saveSuccess: "रुग्ण यशस्वीपणे जोडला गेला.",
  unexpectedError:
    "रुग्णाची माहिती जतन करताना काहीतरी चूक झाली.",
},

assessment: {
  tagline:
    "सोप्या पद्धतीने दैनंदिन काळजी.\nअधिक चांगले वैद्यकीय संवाद.",

  selfAssessment:
    "स्वतःचे आरोग्य मूल्यांकन",

  familyAssessment:
    "कुटुंबाचे आरोग्य मूल्यांकन",

  page:
    "पृष्ठ",

  of:
    "पैकी",

  healthCheckToday:
    "आजची आरोग्य तपासणी",

  feelFeverish:
    "आज तुम्हाला ताप आल्यासारखे वाटत आहे का?",

  temperatureTaken:
    "तुमचे तापमान मोजले आहे का?",

  latestTemperature:
    "नवीनतम तापमान रीडिंग",

  temperaturePlaceholder:
    "उदाहरण: 101.4",

  energyToday:
    "आज तुमची ऊर्जा कशी आहे?",

  good:
    "चांगली",

  tired:
    "थकवा जाणवत आहे",

  veryTired:
    "खूप थकवा जाणवत आहे",

  previous:
    "मागील",

  next:
    "पुढील",

  alertFever:
    "तुम्हाला ताप आल्यासारखे वाटत आहे का हे कृपया सांगा.",

  alertTemperatureTaken:
    "तापमान मोजले आहे का हे कृपया सांगा.",

  alertTemperatureReading:
    "कृपया तापमान रीडिंग नोंदवा.",

  alertEnergy:
    "कृपया तुमची ऊर्जा पातळी निवडा.",

appetiteToday:
  "आज तुमची भूक कशी आहे?",

appetiteNormal:
  "सामान्य",

appetiteLess:
  "कमी खात आहे",

appetitePoor:
  "फारच कमी खात आहे",

drinkingEnoughWater:
  "तुम्ही पुरेसे पाणी पीत आहात का?",

notSure:
  "खात्री नाही",

waterIntake:
  "पाणी पिण्याचे प्रमाण",

alertAllQuestions:
  "कृपया सर्व प्रश्नांची उत्तरे द्या.",

alertWaterIntake:
  "कृपया पाणी पिण्याचे प्रमाण निवडा.",

discomfortToday:
  "आज तुम्हाला काही वेदना किंवा अस्वस्थता जाणवली का?",

discomfortWhere:
  "तुम्हाला वेदना किंवा अस्वस्थता कुठे जाणवली?",

areaHead: "डोके",
areaEyes: "डोळे",
areaEars: "कान",
areaNeck: "मान",
areaChest: "छाती",
areaBack: "पाठ",
areaStomach: "पोट",
areaArmsHands: "बाहू / हात",
areaLegsFeet: "पाय / पावले",
areaJoints: "सांधे",
areaOther: "इतर",

describeDiscomfort:
  "वेदना किंवा अस्वस्थतेचे वर्णन करा",

alertQuestion:
  "कृपया प्रश्नाचे उत्तर द्या.",

alertDiscomfortAreas:
  "कृपया वेदना किंवा अस्वस्थता असलेली ठिकाणे निवडा.",

alertSpecifyDiscomfort:
  "कृपया वेदना किंवा अस्वस्थतेचे वर्णन करा.",

walkingToday:
  "आज तुम्हाला चालता येत आहे का?",

walkingEasily:
  "सहजपणे",

walkingSomeDifficulty:
  "थोड्या अडचणीने",

walkingVeryDifficult:
  "खूप अडचण होत आहे",

needHelpWalking:
  "चालण्यासाठी मदतीची गरज आहे का?",

looseMotionsToday:
  "आज जुलाब झाले आहेत का?",

looseMotionType:
  "कोणत्या प्रकारचे?",

looseMotionWatery:
  "पाण्यासारखे",

looseMotionSticky:
  "चिकट",

finishAssessment:
  "मूल्यांकन पूर्ण करा",

alertWalkingHelp:
  "चालण्यासाठी मदतीची गरज आहे का हे कृपया सांगा.",

alertLooseMotionType:
  "कृपया जुलाबाचा प्रकार निवडा.",

assessmentDetails:
  "मूल्यांकन तपशील",

yourName:
  "तुमचे नाव",

enterYourName:
  "तुमचे नाव नोंदवा",

yourAge:
  "तुमचे वय",

enterYourAge:
  "तुमचे वय नोंदवा",

startAssessment:
  "मूल्यांकन सुरू करा",

alertNameAndAge:
  "कृपया नाव आणि वय नोंदवा",

selectPatientToBegin:
  "मूल्यांकन सुरू करण्यासाठी रुग्ण निवडा.",

noPatientsFound:
  "कोणतेही रुग्ण आढळले नाहीत. कृपया प्रथम रुग्ण जोडा.",

selectPatient:
  "रुग्ण निवडा",

name:
  "नाव",

age:
  "वय",

gender:
  "लिंग",

relationship:
  "नाते",

addNewPatient:
  "नवीन रुग्ण जोडा",

backToDashboard:
  "डॅशबोर्डवर परत जा",

unableToContinue:
  "पुढे सुरू ठेवता येत नाही",

profileLoadError:
  "तुमची प्रोफाइल माहिती लोड करता आली नाही. कृपया पुन्हा साइन इन करा.",

patientLoadError:
  "रुग्णांची माहिती लोड करता आली नाही. कृपया पुन्हा प्रयत्न करा.",

pageLoadError:
  "हे पृष्ठ लोड करताना काहीतरी चूक झाली. कृपया पृष्ठ रिफ्रेश करून पुन्हा प्रयत्न करा.",

breathingToday:
  "आज रुग्णाचा श्वास कसा होता?",

breathingNormal:
  "सामान्य",

breathingSlightlyDifficult:
  "थोडा त्रास",

breathingVeryDifficult:
  "खूप त्रास",

coughingToday:
  "आज रुग्णाला खोकला होता का?",

coughSometimes:
  "कधीकधी",

coughFrequently:
  "वारंवार",

bloodWhileCoughing:
  "खोकताना रक्त दिसले का?",

alertBloodInCough:
  "खोकताना रक्त दिसले होते का हे कृपया सांगा.",

patientFeverishToday:
  "आज रुग्णाला ताप आल्यासारखे वाटत होते का?",

temperatureMeasured:
  "तापमान मोजले होते का?",

enterLatestTemperature:
  "नवीनतम तापमान नोंदवा",

patientEnergyToday:
  "आज रुग्ण किती सक्रिय दिसत होता?",

energyActive:
  "सक्रिय",

energyLessActive:
  "कमी सक्रिय",

energyVeryWeak:
  "खूप अशक्त",

alertTemperatureMeasured:
  "तापमान मोजले होते का हे कृपया सांगा.",

patientEatingToday:
  "आज रुग्णाचे खाणे कसे होते?",

patientDrinkingEnoughWater:
  "रुग्णाने आज पुरेसे पाणी प्यायले का?",

patientWaterGlasses:
  "रुग्णाने अंदाजे किती ग्लास पाणी प्यायले?",

oneGlass:
  "1 ग्लास",

twoGlasses:
  "2 ग्लास",

threeGlasses:
  "3 ग्लास",

fourGlasses:
  "4 ग्लास",

fivePlusGlasses:
  "5+ ग्लास",

patientDiscomfortToday:
  "रुग्णाला आज काही अस्वस्थता जाणवली का?",

patientDiscomfortWhere:
  "रुग्णाला कुठे अस्वस्थता जाणवली?",

areaArms:
  "हात",

areaLegs:
  "पाय",

alertPatientDiscomfortAreas:
  "कृपया रुग्णाला कुठे अस्वस्थता जाणवली ते निवडा.",

alertOtherDiscomfortArea:
  "कृपया अस्वस्थतेचे इतर ठिकाण नमूद करा.",

patientWalkingToday:
  "आज रुग्णाचे चालणे कसे होते?",

walkedEasily:
  "सहज चालले",

patientNeedHelpWalking:
  "रुग्णाला चालण्यासाठी मदतीची गरज पडली का?",

alertWalkingHelpNeeded:
  "कृपया चालण्यासाठी मदतीची गरज पडली का ते सांगा.",

looseMotionsObserved:
  "जुलाब झाले होते का?",

looseMotionTypeObserved:
  "कोणत्या प्रकारचे जुलाब झाले होते?",

patientConfusedToday:
  "रुग्ण आज नेहमीपेक्षा अधिक गोंधळलेला दिसला का?",

},

};
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

takePhoto: "फ़ोटो लें",
chooseExistingPhoto: "मौजूदा फ़ोटो चुनें",
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

home:
    "होम",

whatWouldYouLikeToDo:
    "आप क्या करना चाहेंगे?",

recordHealth:
    "स्वास्थ्य रिकॉर्ड करें",

recordHealthDescription:
    "अपने या परिवार के किसी सदस्य के स्वास्थ्य की जानकारी रिकॉर्ड करें",

viewHealth:
    "स्वास्थ्य देखें",

viewHealthDescription:
    "स्वास्थ्य समयरेखा, रिपोर्ट और रुझान देखें",

helpAndFaqs:
    "सहायता और सामान्य प्रश्न",

helpAndFaqsDescription:
    "CareVR का उपयोग करना सीखें और अपने प्रश्नों के उत्तर पाएँ",

backToHome:
    "होम पर वापस जाएँ",

healthCheckAssessment:
    "स्वास्थ्य जांच मूल्यांकन",

healthHistory:
    "स्वास्थ्य इतिहास",

medicationManagement:
    "दवा प्रबंधन",
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

selectPatientToBegin:
  "आकलन शुरू करने के लिए एक रोगी चुनें।",

noPatientsFound:
  "कोई रोगी नहीं मिला। कृपया पहले एक रोगी जोड़ें।",

selectPatient:
  "रोगी चुनें",

name:
  "नाम",

age:
  "आयु",

gender:
  "लिंग",

relationship:
  "रिश्ता",

addNewPatient:
  "नया रोगी जोड़ें",

backToDashboard:
  "डैशबोर्ड पर वापस जाएँ",

unableToContinue:
  "आगे जारी नहीं रख सकते",

profileLoadError:
  "आपकी प्रोफ़ाइल लोड नहीं हो सकी। कृपया फिर से साइन इन करें।",

patientLoadError:
  "रोगियों की जानकारी लोड नहीं हो सकी। कृपया फिर से प्रयास करें।",

pageLoadError:
  "इस पृष्ठ को लोड करते समय कुछ गलत हो गया। कृपया पृष्ठ को रीफ़्रेश करके फिर से प्रयास करें।",

breathingToday:
  "आज रोगी की साँस लेने की स्थिति कैसी थी?",

breathingNormal:
  "सामान्य",

breathingSlightlyDifficult:
  "थोड़ी कठिनाई",

breathingVeryDifficult:
  "बहुत कठिनाई",

coughingToday:
  "क्या आज रोगी को खाँसी हो रही थी?",

coughSometimes:
  "कभी-कभी",

coughFrequently:
  "बार-बार",

bloodWhileCoughing:
  "क्या खाँसी के दौरान खून दिखाई दिया?",

alertBloodInCough:
  "कृपया बताएं कि क्या खाँसी के दौरान खून दिखाई दिया था।",

patientFeverishToday:
  "क्या आज रोगी को बुखार जैसा महसूस हो रहा था?",

temperatureMeasured:
  "क्या तापमान मापा गया था?",

enterLatestTemperature:
  "नवीनतम तापमान दर्ज करें",

patientEnergyToday:
  "आज रोगी कितना सक्रिय दिखाई दिया?",

energyActive:
  "सक्रिय",

energyLessActive:
  "कम सक्रिय",

energyVeryWeak:
  "बहुत कमजोर",

alertTemperatureMeasured:
  "कृपया बताएं कि तापमान मापा गया था या नहीं।",

patientEatingToday:
  "आज मरीज ने कैसा खाना खाया?",

patientDrinkingEnoughWater:
  "क्या मरीज ने आज पर्याप्त पानी पिया?",

patientWaterGlasses:
  "मरीज ने लगभग कितने गिलास पानी पिया?",

oneGlass:
  "1 गिलास",

twoGlasses:
  "2 गिलास",

threeGlasses:
  "3 गिलास",

fourGlasses:
  "4 गिलास",

fivePlusGlasses:
  "5+ गिलास",

patientDiscomfortToday:
  "क्या मरीज को आज कोई असुविधा महसूस हुई?",

patientDiscomfortWhere:
  "मरीज को कहाँ असुविधा महसूस हुई?",

areaArms:
  "बाँहें",

areaLegs:
  "पैर",

alertPatientDiscomfortAreas:
  "कृपया चुनें कि मरीज को कहाँ असुविधा महसूस हुई।",

alertOtherDiscomfortArea:
  "कृपया अन्य असुविधा वाले स्थान के बारे में बताएं।",

patientWalkingToday:
  "आज मरीज का चलना कैसा था?",

walkedEasily:
  "आसानी से चले",

patientNeedHelpWalking:
  "क्या मरीज को चलने में मदद की जरूरत पड़ी?",

alertWalkingHelpNeeded:
  "कृपया बताएं कि चलने में मदद की जरूरत पड़ी या नहीं।",

looseMotionsObserved:
  "क्या दस्त देखे गए?",

looseMotionTypeObserved:
  "किस प्रकार के दस्त देखे गए?",

patientConfusedToday:
  "क्या मरीज आज असामान्य रूप से भ्रमित दिखाई दिया?",

},

medication: {

    //--------------------------------------------------
    // General
    //--------------------------------------------------

    title:
        "दवा प्रबंधन",

    addPrescription:
        "प्रिस्क्रिप्शन जोड़ें",

    viewPrescriptions:
        "सहेजे गए प्रिस्क्रिप्शन देखें",

    prescriptionDetails:
        "प्रिस्क्रिप्शन विवरण",

    reviewPrescription:
        "प्रिस्क्रिप्शन की समीक्षा",

    //--------------------------------------------------
    // Upload
    //--------------------------------------------------

    takePhoto:
        "फोटो लें",

    choosePhotos:
        "फोटो चुनें",

    uploadPdf:
        "PDF अपलोड करें",

    readPrescription:
        "प्रिस्क्रिप्शन पढ़ें",

    readingPrescription:
        "प्रिस्क्रिप्शन पढ़ा जा रहा है...",

    preparingPrescription:
        "प्रिस्क्रिप्शन तैयार किया जा रहा है...",

    prescriptionReadSuccess:
        "प्रिस्क्रिप्शन सफलतापूर्वक पढ़ लिया गया।",

    //--------------------------------------------------
    // Consultation
    //--------------------------------------------------

    consultationDate:
        "परामर्श तिथि",

    consultationMode:
        "परामर्श का प्रकार",

    doctor:
        "डॉक्टर",

    hospital:
        "अस्पताल / क्लिनिक",

    diagnosisAssessment:
        "निदान / मूल्यांकन",

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    medicines:
        "दवाइयाँ",

    medicine:
        "दवा",

    dosage:
        "खुराक",

    frequency:
        "आवृत्ति",

    duration:
        "अवधि",

    instructions:
        "निर्देश",

    //--------------------------------------------------
    // Actions
    //--------------------------------------------------

    savePrescription:
        "पुष्टि करें और सहेजें",

    savingPrescription:
        "सहेजा जा रहा है...",

    reupload:
        "प्रिस्क्रिप्शन पुनः अपलोड करें",

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    consultationDateRequired:
        "परामर्श तिथि आवश्यक है।",

    consultationDateFuture:
        "परामर्श तिथि भविष्य की नहीं हो सकती।",

    consultationDateInvalid:
        "अमान्य परामर्श तिथि।",

    consultationTypeRequired:
        "कृपया परामर्श का प्रकार चुनें।",

    patientRequired:
        "कृपया रोगी चुनें।",

    patientMismatch:
        "यह प्रिस्क्रिप्शन किसी अन्य रोगी का प्रतीत होता है।",

    //--------------------------------------------------
    // Warnings
    //--------------------------------------------------

    warningTitle:
        "चेतावनियों के साथ समीक्षा पूर्ण हुई",

    doctorNotDetected:
        "डॉक्टर का नाम नहीं मिला।",

    hospitalNotDetected:
        "अस्पताल या क्लिनिक का नाम नहीं मिला।",

    diagnosisNotDetected:
        "निदान या मूल्यांकन नहीं मिला।",

    medicinesNotDetected:
        "कोई दवा नहीं मिली।",

    warningContinue:
        "यदि जानकारी सही है, तो भी आप इस प्रिस्क्रिप्शन को सहेज सकते हैं।",

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    saveSuccess:
        "प्रिस्क्रिप्शन सफलतापूर्वक सहेजा गया।",

    saveFailed:
        "प्रिस्क्रिप्शन सहेजा नहीं जा सका।",

    selectPrescription:
        "कृपया एक प्रिस्क्रिप्शन चुनें।",

    readFailed:
        "प्रिस्क्रिप्शन पढ़ा नहीं जा सका।",

    processingFailed:
        "प्रिस्क्रिप्शन संसाधित नहीं किया जा सका।",

    patientMismatchTitle:
        "प्रिस्क्रिप्शन किसी अन्य रोगी का है",

    patient:
        "रोगी",

    patientDetails:
        "रोगी का विवरण",

    patientSymptoms:
        "रोगी के लक्षण",

    assessment:
        "मूल्यांकन",

    additionalDiagnoses:
        "अतिरिक्त निदान",

    examinationFindings:
        "जांच के निष्कर्ष",

    relevantMedicalHistory:
        "संबंधित चिकित्सीय इतिहास",

    lifestyle:
        "जीवनशैली",

    consultationVitals:
        "परामर्श के जीवन संकेत",

    investigationsOrdered:
        "निर्धारित जांचें",

    careInstructions:
        "देखभाल संबंधी निर्देश",

    otherNotes:
        "अन्य टिप्पणियाँ",

    medicationsPrescribed:
        "निर्धारित दवाइयाँ",

    importantAdministrationTiming:
        "महत्वपूर्ण: दवा लेने का समय",

    administrationTimingInfo1:
        "CareVR यह अनुमान नहीं लगाता कि दवा भोजन से पहले, बाद में, भोजन के साथ या किसी अन्य समय लेनी चाहिए।",

    administrationTimingInfo2:
        "सही दवा लेने का समय डॉक्टर से पुष्टि करने के बाद ही चुनें।",

    administrationTimingInfo3:
        "यदि समय अभी तक पुष्टि नहीं हुआ है, तो 'निर्दिष्ट नहीं' रहने दें और बाद में अपडेट करें।",

    noMedicinesDetected:
        "कोई दवा पहचानी नहीं जा सकी।",

    aiExtractedDate:
        "AI द्वारा पहचानी गई तिथि",

    consultationDateHelp:
        "यदि तिथि गलत है, तो सही परामर्श तिथि चुनें।",

    weight:
        "वजन",

    bloodPressure:
        "रक्तचाप",

    pulse:
        "नाड़ी",

    temperature:
        "तापमान",

    spo2:
        "SpO₂",

    strength:
        "शक्ति",

    dose:
        "खुराक",

    administrationTiming:
        "दवा लेने का समय",

    //--------------------------------------------------
    // Administration Timing
    //--------------------------------------------------

    notSpecified:
        "निर्दिष्ट नहीं",

    beforeFood:
        "भोजन से पहले",

    afterFood:
        "भोजन के बाद",

    withFood:
        "भोजन के साथ",

    emptyStomach:
        "खाली पेट",

    beforeBreakfast:
        "नाश्ते से पहले",

    afterBreakfast:
        "नाश्ते के बाद",

    beforeLunch:
        "दोपहर के भोजन से पहले",

    afterLunch:
        "दोपहर के भोजन के बाद",

    beforeDinner:
        "रात के भोजन से पहले",

    afterDinner:
        "रात के भोजन के बाद",

    atBedtime:
        "सोने से पहले",

    asDirected:
        "डॉक्टर के निर्देशानुसार",

whatWouldYouLikeToDo:
    "आप क्या करना चाहते हैं?",

modeOfConsultation:
    "परामर्श का प्रकार",

howWouldYouLikeToAddPrescription:
    "आप प्रिस्क्रिप्शन कैसे जोड़ना चाहेंगे?",

forBestResults:
    "सर्वोत्तम परिणामों के लिए",

supportedFormats:
    "समर्थित प्रारूप: JPG, JPEG और PNG",

useClearImages:
    "स्पष्ट और अच्छी रोशनी वाली तस्वीरों का उपयोग करें",

cropBackground:
    "अनावश्यक पृष्ठभूमि हटाएँ",

recommendedImageSize:
    "अनुशंसित चित्र आकार: 300 KB – 1 MB",

maximumImageSize:
    "प्रति चित्र अधिकतम आकार: 2 MB",

howWasConsultationConducted:
    "परामर्श कैसे किया गया था?",

inPerson:
    "प्रत्यक्ष",

video:
    "वीडियो",

phone:
    "फ़ोन",

homeVisit:
    "घर पर मुलाकात",

other:
    "अन्य",

howWouldYouLikeToRecordHealth:
    "आप स्वास्थ्य रिकॉर्ड कैसे करना चाहेंगे?",

recordWithVoice:
    "आवाज़ द्वारा रिकॉर्ड करें",

uploadReading:
    "रीडिंग अपलोड करें",

enterManually:
    "मैन्युअली दर्ज करें",

dailyCare:
    "दैनिक देखभाल",

assessmentsHistory:
    "मूल्यांकन",

clinicalTrends:
    "क्लिनिकल ट्रेंड्स",

detailedTimeline:
    "विस्तृत समयरेखा",

pleaseSpecifyConsultationMode:
    "कृपया परामर्श का प्रकार बताइए",

validationErrorsTitle:
    "सहेजने से पहले कृपया निम्न त्रुटियाँ सुधारें",

patientBelongsTo:
    "यह प्रिस्क्रिप्शन संभवतः इस रोगी का है",

currentlyAddingFor:
    "आप वर्तमान में इस रोगी के लिए प्रिस्क्रिप्शन जोड़ रहे हैं",

chooseCorrectPatient:
    "कृपया सही प्रिस्क्रिप्शन पुनः अपलोड करें या वापस जाकर सही परिवार सदस्य चुनें।",

reuploadPrescription:
    "प्रिस्क्रिप्शन पुनः अपलोड करें",

whoIsThisFor:
    "यह किसके लिए है?",

//--------------------------------------------------
// Consultation Workspace
//--------------------------------------------------

consultationDetails:
    "परामर्श विवरण",

consultationDetailsDescription:
    "जो जानकारी आपको पता है उसे भरें। वैकल्पिक फ़ील्ड खाली छोड़ी जा सकती हैं।",

doctorName:
    "डॉक्टर का नाम",

enterDoctorName:
    "डॉक्टर का नाम दर्ज करें",

hospitalOrClinic:
    "अस्पताल / क्लिनिक",

enterHospitalOrClinic:
    "अस्पताल या क्लिनिक का नाम दर्ज करें",

optional:
    "वैकल्पिक",

videoPlatform:
    "वीडियो प्लेटफ़ॉर्म",

exampleVideoPlatform:
    "उदाहरण: WhatsApp, Zoom",

consultationType:
    "परामर्श का प्रकार",

phoneConsultation:
    "फ़ोन परामर्श",

doctorServiceDetails:
    "डॉक्टर / सेवा विवरण",

enterDoctorServiceDetails:
    "डॉक्टर या सेवा का विवरण दर्ज करें",

consultationMethod:
    "परामर्श का तरीका",

describeConsultationMethod:
    "परामर्श का तरीका बताइए",

consultationNotes:
    "टिप्पणियाँ",

enterConsultationNotes:
    "परामर्श संबंधी टिप्पणियाँ दर्ज करें",

//--------------------------------------------------
// Prescription Review
//--------------------------------------------------

reviewNoteTitle:
    "सहेजने से पहले समीक्षा करें",

reviewNoteDescription:
    "नीचे दी गई जानकारी AI द्वारा अपलोड किए गए प्रिस्क्रिप्शन से निकाली गई है। कृपया सहेजने से पहले इसकी पुष्टि करें।",

reviewInstruction:
    "सहेजने से पहले प्रत्येक अनुभाग पर क्लिक करके निकाली गई जानकारी की पुष्टि करें।",

//--------------------------------------------------
// Prescription Upload
//--------------------------------------------------

uploadFailed:
    "चयनित प्रिस्क्रिप्शन चित्र अपलोड नहीं किए जा सके।",

filesTooLarge:
    "निम्न फ़ाइलें अनुमत आकार से बड़ी हैं।",

recommendedUploadSize:
    "अनुशंसित आकार: प्रति चित्र 300 KB – 1 MB।",

maximumUploadSize:
    "अधिकतम अनुमत आकार: प्रति चित्र 2 MB।",

cropBackgroundBeforeUpload:
    "अपलोड करने से पहले अनावश्यक पृष्ठभूमि हटाएँ।",

reduceImageSize:
    "कृपया चित्र का आकार कम करके पुनः प्रयास करें।",

cameraUnavailable:
    "कैमरा उपलब्ध नहीं है।",

readingFailed:
    "प्रिस्क्रिप्शन पढ़ा नहीं जा सका।",

savingFailed:
    "प्रिस्क्रिप्शन सहेजा नहीं जा सका।",

prescriptionSaved:
    "प्रिस्क्रिप्शन सफलतापूर्वक सहेजा गया।",

//--------------------------------------------------
// Additional UI Messages
//--------------------------------------------------

uploadFileTooLargeMessage:
    "चयनित प्रिस्क्रिप्शन चित्र अपलोड नहीं किए जा सके।\n\n" +
    "निम्न फ़ाइलें अनुमत आकार से बड़ी हैं:\n\n" +
    "{fileNames}\n\n" +
    "सर्वोत्तम अनुभव के लिए (विशेषकर iPhone पर):\n\n" +
    "• अनुशंसित आकार: प्रति चित्र 300 KB - 1 MB\n" +
    "• अधिकतम अनुमत आकार: प्रति चित्र 2 MB\n" +
    "• अपलोड करने से पहले अनावश्यक पृष्ठभूमि हटाएँ\n\n" +
    "कृपया चित्र का आकार कम करके पुनः प्रयास करें।",

pleaseRecordatleastOneObservation:
    "कृपया कम से कम एक स्वास्थ्य अवलोकन दर्ज करें।\n\n" +
    "• तापमान\n" +
    "• वजन\n" +
    "• महत्वपूर्ण संकेत (Vitals)\n" +
    "• लक्षण\n" +
    "• दर्द का स्थान",

choosePhoto:
    "फोटो चुनें",

currentlyAddingPrescriptionFor:
    "आप वर्तमान में इस रोगी के लिए प्रिस्क्रिप्शन जोड़ रहे हैं",

capturePhoto:
    "फोटो लें",

chooseCorrectPrescription:
    "कृपया सही प्रिस्क्रिप्शन पुनः अपलोड करें या वापस जाकर सही परिवार सदस्य चुनें।",

prescriptionReadError:
    "प्रिस्क्रिप्शन पढ़ने में त्रुटि:",

pleaseSelectFamilyMember:
    "कृपया परिवार के सदस्य का चयन करें।",

manualCareSaveError:
    "मैनुअल केयर सहेजने में त्रुटि:",

clear:
    "साफ़ करें",

yourFamilyMember:
    "आपके परिवार का सदस्य",

uploadCareImageProcessingError:
    "अपलोड की गई स्वास्थ्य छवि संसाधित करने में त्रुटि:",

uploadCareSaveError:
    "स्वास्थ्य रिकॉर्ड सहेजने में त्रुटि:",

useAnotherPhoto:
    "दूसरी फोटो उपयोग करें",

saveHealthReading:
    "स्वास्थ्य रीडिंग सहेजें",

selectTemperatureOrDontKnow:
    "कृपया तापमान चुनें या 'मुझे नहीं पता' चुनें।",

voiceCareSaveError:
    "वॉइस केयर सहेजने में त्रुटि:",

reviewRecording:
    "रिकॉर्डिंग की समीक्षा करें",

healthUpdateReady:
    "आपका स्वास्थ्य अपडेट तैयार है। आप इसकी समीक्षा कर सकते हैं या सीधे सहेज सकते हैं।",

},

};
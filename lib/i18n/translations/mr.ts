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

healthCheckAssessment:
    "आरोग्य तपासणी मूल्यांकन",

healthHistory:
    "आरोग्य इतिहास",

medicationManagement:
    "औषध व्यवस्थापन",
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

medication: {

    //--------------------------------------------------
    // General
    //--------------------------------------------------

    title:
        "औषध व्यवस्थापन",

    addPrescription:
        "प्रिस्क्रिप्शन जोडा",

    viewPrescriptions:
        "जतन केलेली प्रिस्क्रिप्शन्स पहा",

    prescriptionDetails:
        "प्रिस्क्रिप्शन तपशील",

    reviewPrescription:
        "प्रिस्क्रिप्शन पुनरावलोकन",

    //--------------------------------------------------
    // Upload
    //--------------------------------------------------

    takePhoto:
        "फोटो काढा",

    choosePhotos:
        "फोटो निवडा",

    uploadPdf:
        "PDF अपलोड करा",

    readPrescription:
        "प्रिस्क्रिप्शन वाचा",

    readingPrescription:
        "प्रिस्क्रिप्शन वाचले जात आहे...",

    preparingPrescription:
        "प्रिस्क्रिप्शन तयार केले जात आहे...",

    prescriptionReadSuccess:
        "प्रिस्क्रिप्शन यशस्वीरित्या वाचले गेले.",

    //--------------------------------------------------
    // Consultation
    //--------------------------------------------------

    consultationDate:
        "सल्लामसलत दिनांक",

    consultationMode:
        "सल्लामसलतीचा प्रकार",

    doctor:
        "डॉक्टर",

    hospital:
        "रुग्णालय / दवाखाना",

    diagnosisAssessment:
        "निदान / मूल्यांकन",

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    medicines:
        "औषधे",

    medicine:
        "औषध",

    dosage:
        "डोस",

    frequency:
        "वारंवारता",

    duration:
        "कालावधी",

    instructions:
        "सूचना",

    //--------------------------------------------------
    // Actions
    //--------------------------------------------------

    savePrescription:
        "पुष्टी करा आणि जतन करा",

    savingPrescription:
        "जतन केले जात आहे...",

    reupload:
        "प्रिस्क्रिप्शन पुन्हा अपलोड करा",

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    consultationDateRequired:
        "सल्लामसलत दिनांक आवश्यक आहे.",

    consultationDateFuture:
        "सल्लामसलत दिनांक भविष्यातील असू शकत नाही.",

    consultationDateInvalid:
        "अवैध सल्लामसलत दिनांक.",

    consultationTypeRequired:
        "कृपया सल्लामसलतीचा प्रकार निवडा.",

    patientRequired:
        "कृपया रुग्ण निवडा.",

    patientMismatch:
        "हे प्रिस्क्रिप्शन दुसऱ्या रुग्णाचे असल्याचे दिसते.",

    //--------------------------------------------------
    // Warnings
    //--------------------------------------------------

    warningTitle:
        "इशाऱ्यांसह पुनरावलोकन पूर्ण झाले",

    doctorNotDetected:
        "डॉक्टरांचे नाव आढळले नाही.",

    hospitalNotDetected:
        "रुग्णालय किंवा दवाखान्याचे नाव आढळले नाही.",

    diagnosisNotDetected:
        "निदान किंवा मूल्यांकन आढळले नाही.",

    medicinesNotDetected:
        "कोणतीही औषधे आढळली नाहीत.",

    warningContinue:
        "माहिती योग्य असल्यास हे प्रिस्क्रिप्शन तरीही जतन करू शकता.",

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    saveSuccess:
        "प्रिस्क्रिप्शन यशस्वीरित्या जतन केले.",

    saveFailed:
        "प्रिस्क्रिप्शन जतन करता आले नाही.",

    selectPrescription:
        "कृपया एक प्रिस्क्रिप्शन निवडा.",

    readFailed:
        "प्रिस्क्रिप्शन वाचता आले नाही.",

    processingFailed:
        "प्रिस्क्रिप्शन प्रक्रिया करता आली नाही.",

    patientMismatchTitle:
        "प्रिस्क्रिप्शन दुसऱ्या रुग्णाचे आहे",

    patient:
        "रुग्ण",

    patientDetails:
        "रुग्णाची माहिती",

    patientSymptoms:
        "रुग्णाची लक्षणे",

    assessment:
        "मूल्यांकन",

    additionalDiagnoses:
        "अतिरिक्त निदाने",

    examinationFindings:
        "तपासणी निष्कर्ष",

    relevantMedicalHistory:
        "संबंधित वैद्यकीय इतिहास",

    lifestyle:
        "जीवनशैली",

    consultationVitals:
        "सल्लामसलतीतील जीवनचिन्हे",

    investigationsOrdered:
        "सुचविलेल्या तपासण्या",

    careInstructions:
        "काळजी घेण्याच्या सूचना",

    otherNotes:
        "इतर नोंदी",

    medicationsPrescribed:
        "लिहून दिलेली औषधे",

    importantAdministrationTiming:
        "महत्त्वाचे: औषध घेण्याची वेळ",

    administrationTimingInfo1:
        "CareVR औषध जेवणापूर्वी, जेवणानंतर, जेवणासोबत किंवा इतर कोणत्या वेळी घ्यावे याचा अंदाज लावत नाही.",

    administrationTimingInfo2:
        "योग्य औषध घेण्याची वेळ डॉक्टरांकडून निश्चित करूनच मूल्य निवडा.",

    administrationTimingInfo3:
        "वेळ अद्याप निश्चित नसेल तर 'निर्दिष्ट नाही' असे ठेवून नंतर अद्ययावत करा.",

    noMedicinesDetected:
        "कोणतीही औषधे ओळखता आली नाहीत.",

    aiExtractedDate:
        "AI ने ओळखलेली तारीख",

    consultationDateHelp:
        "तारीख चुकीची असल्यास योग्य सल्लामसलत दिनांक निवडा.",

    weight:
        "वजन",

    bloodPressure:
        "रक्तदाब",

    pulse:
        "नाडी",

    temperature:
        "तापमान",

    spo2:
        "SpO₂",

    strength:
        "शक्ती",

    dose:
        "डोस",

    administrationTiming:
        "औषध घेण्याची वेळ",

    //--------------------------------------------------
    // Administration Timing
    //--------------------------------------------------

    notSpecified:
        "निर्दिष्ट नाही",

    beforeFood:
        "जेवणापूर्वी",

    afterFood:
        "जेवणानंतर",

    withFood:
        "जेवणासोबत",

    emptyStomach:
        "रिकाम्या पोटी",

    beforeBreakfast:
        "नाश्त्यापूर्वी",

    afterBreakfast:
        "नाश्त्यानंतर",

    beforeLunch:
        "दुपारच्या जेवणापूर्वी",

    afterLunch:
        "दुपारच्या जेवणानंतर",

    beforeDinner:
        "रात्रीच्या जेवणापूर्वी",

    afterDinner:
        "रात्रीच्या जेवणानंतर",

    atBedtime:
        "झोपण्यापूर्वी",

    asDirected:
        "डॉक्टरांच्या सूचनेनुसार",

whatWouldYouLikeToDo:
    "तुम्हाला काय करायचे आहे?",

modeOfConsultation:
    "सल्लामसलतीचा प्रकार",

howWouldYouLikeToAddPrescription:
    "तुम्ही प्रिस्क्रिप्शन कसे जोडू इच्छिता?",

forBestResults:
    "सर्वोत्तम परिणामांसाठी",

supportedFormats:
    "समर्थित स्वरूप: JPG, JPEG आणि PNG",

useClearImages:
    "स्पष्ट आणि चांगल्या प्रकाशातील प्रतिमा वापरा",

cropBackground:
    "अनावश्यक पार्श्वभूमी काढून टाका",

recommendedImageSize:
    "शिफारस केलेला प्रतिमा आकार: 300 KB – 1 MB",

maximumImageSize:
    "प्रति प्रतिमा कमाल आकार: 2 MB",

howWasConsultationConducted:
    "सल्लामसलत कशी झाली?",

inPerson:
    "प्रत्यक्ष",

video:
    "व्हिडिओ",

phone:
    "फोन",

homeVisit:
    "घरी भेट",

other:
    "इतर",

howWouldYouLikeToRecordHealth:
    "तुम्हाला आरोग्य कसे नोंदवायचे आहे?",

recordWithVoice:
    "आवाजाद्वारे नोंद करा",

uploadReading:
    "रीडिंग अपलोड करा",

enterManually:
    "स्वतः नोंदवा",

dailyCare:
    "दैनंदिन काळजी",

assessmentsHistory:
    "मूल्यांकन",

clinicalTrends:
    "क्लिनिकल ट्रेंड्स",

detailedTimeline:
    "तपशीलवार कालरेषा",

pleaseSpecifyConsultationMode:
    "कृपया सल्लामसलतीचा प्रकार नमूद करा",

validationErrorsTitle:
    "जतन करण्यापूर्वी खालील त्रुटी दुरुस्त करा",

patientBelongsTo:
    "हे प्रिस्क्रिप्शन या रुग्णाचे असल्याचे दिसते",

currentlyAddingFor:
    "तुम्ही सध्या या रुग्णासाठी प्रिस्क्रिप्शन जोडत आहात",

chooseCorrectPatient:
    "कृपया योग्य प्रिस्क्रिप्शन पुन्हा अपलोड करा किंवा मागे जाऊन योग्य कुटुंब सदस्य निवडा.",

reuploadPrescription:
    "प्रिस्क्रिप्शन पुन्हा अपलोड करा",

whoIsThisFor:
    "हे कोणासाठी आहे?",

//--------------------------------------------------
// Consultation Workspace
//--------------------------------------------------

consultationDetails:
    "सल्लामसलत तपशील",

consultationDetailsDescription:
    "तुम्हाला माहित असलेली माहिती भरा. ऐच्छिक फील्ड रिक्त ठेवू शकता.",

doctorName:
    "डॉक्टरांचे नाव",

enterDoctorName:
    "डॉक्टरांचे नाव प्रविष्ट करा",

hospitalOrClinic:
    "रुग्णालय / दवाखाना",

enterHospitalOrClinic:
    "रुग्णालय किंवा दवाखान्याचे नाव प्रविष्ट करा",

optional:
    "ऐच्छिक",

videoPlatform:
    "व्हिडिओ प्लॅटफॉर्म",

exampleVideoPlatform:
    "उदाहरण: WhatsApp, Zoom",

consultationType:
    "सल्लामसलतीचा प्रकार",

phoneConsultation:
    "फोन सल्लामसलत",

doctorServiceDetails:
    "डॉक्टर / सेवा तपशील",

enterDoctorServiceDetails:
    "डॉक्टर किंवा सेवेचे तपशील प्रविष्ट करा",

consultationMethod:
    "सल्लामसलत पद्धत",

describeConsultationMethod:
    "सल्लामसलतीची पद्धत वर्णन करा",

consultationNotes:
    "नोंदी",

enterConsultationNotes:
    "सल्लामसलतीच्या नोंदी जोडा",

//--------------------------------------------------
// Prescription Review
//--------------------------------------------------

reviewNoteTitle:
    "जतन करण्यापूर्वी पडताळा करा",

reviewNoteDescription:
    "खालील माहिती अपलोड केलेल्या प्रिस्क्रिप्शनमधून AI द्वारे काढण्यात आली आहे. जतन करण्यापूर्वी कृपया तिची अचूकता तपासा.",

reviewInstruction:
    "जतन करण्यापूर्वी प्रत्येक विभागावर क्लिक करून काढलेली माहिती पडताळा करा.",

//--------------------------------------------------
// Prescription Upload
//--------------------------------------------------

uploadFailed:
    "निवडलेली प्रिस्क्रिप्शन प्रतिमा अपलोड करता आली नाही.",

filesTooLarge:
    "खालील फाइल्स अनुमत आकारापेक्षा मोठ्या आहेत.",

recommendedUploadSize:
    "शिफारस केलेला आकार: प्रत्येक प्रतिमेसाठी 300 KB – 1 MB.",

maximumUploadSize:
    "कमाल अनुमत आकार: प्रत्येक प्रतिमेसाठी 2 MB.",

cropBackgroundBeforeUpload:
    "अपलोड करण्यापूर्वी अनावश्यक पार्श्वभूमी काढून टाका.",

reduceImageSize:
    "कृपया प्रतिमेचा आकार कमी करून पुन्हा प्रयत्न करा.",

cameraUnavailable:
    "कॅमेरा वापरता आला नाही.",

readingFailed:
    "प्रिस्क्रिप्शन वाचता आले नाही.",

savingFailed:
    "प्रिस्क्रिप्शन जतन करता आले नाही.",

prescriptionSaved:
    "प्रिस्क्रिप्शन यशस्वीरित्या जतन केले.",

//--------------------------------------------------
// Additional UI Messages
//--------------------------------------------------

uploadFileTooLargeMessage:
    "निवडलेली प्रिस्क्रिप्शन प्रतिमा अपलोड करता आली नाही.\n\n" +
    "खालील फाइल्स अनुमत आकारापेक्षा मोठ्या आहेत:\n\n" +
    "{fileNames}\n\n" +
    "सर्वोत्तम अनुभवासाठी (विशेषतः iPhone वर):\n\n" +
    "• शिफारस केलेला आकार: प्रत्येक प्रतिमेसाठी 300 KB - 1 MB\n" +
    "• कमाल अनुमत आकार: प्रत्येक प्रतिमेसाठी 2 MB\n" +
    "• अपलोड करण्यापूर्वी अनावश्यक पार्श्वभूमी काढून टाका\n\n" +
    "कृपया प्रतिमेचा आकार कमी करून पुन्हा प्रयत्न करा.",

pleaseRecordatleastOneObservation:
    "कृपया किमान एक आरोग्य निरीक्षण नोंदवा.\n\n" +
    "• तापमान\n" +
    "• वजन\n" +
    "• महत्त्वाची मोजमापे (Vitals)\n" +
    "• लक्षणे\n" +
    "• वेदनेचे स्थान",

choosePhoto:
    "फोटो निवडा",

currentlyAddingPrescriptionFor:
    "आपण सध्या या रुग्णासाठी प्रिस्क्रिप्शन जोडत आहात",

capturePhoto:
    "फोटो काढा",

chooseCorrectPrescription:
    "कृपया योग्य प्रिस्क्रिप्शन पुन्हा अपलोड करा किंवा मागे जाऊन योग्य कुटुंब सदस्य निवडा.",

prescriptionReadError:
    "प्रिस्क्रिप्शन वाचन त्रुटी:",

pleaseSelectFamilyMember:
    "कृपया कुटुंबातील सदस्य निवडा.",

manualCareSaveError:
    "मॅन्युअल केअर जतन त्रुटी:",

clear:
    "साफ करा",

yourFamilyMember:
    "आपल्या कुटुंबातील सदस्य",

uploadCareImageProcessingError:
    "अपलोड केलेल्या आरोग्य प्रतिमेवर प्रक्रिया करताना त्रुटी:",

uploadCareSaveError:
    "आरोग्य नोंद जतन करताना त्रुटी:",

useAnotherPhoto:
    "दुसरा फोटो वापरा",

saveHealthReading:
    "आरोग्य मोजमाप जतन करा",

selectTemperatureOrDontKnow:
    "कृपया तापमान निवडा किंवा 'मला माहित नाही' निवडा.",

voiceCareSaveError:
    "व्हॉइस केअर जतन त्रुटी:",

reviewRecording:
    "रेकॉर्डिंगचे पुनरावलोकन करा",

healthUpdateReady:
    "तुमचे आरोग्य अद्यतन तयार आहे. तुम्ही त्याचे पुनरावलोकन करू शकता किंवा थेट जतन करू शकता.",

},

};
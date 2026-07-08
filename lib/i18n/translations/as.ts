import type {
  TranslationDictionary,
} from "../types";

export const as: TranslationDictionary = {

  common: {
    save: "সংৰক্ষণ কৰক",
    cancel: "বাতিল কৰক",
    back: "পিছলৈ",
    loading: "লোড হৈ আছে...",
    yes: "হয়",
    no: "নহয়",
    notRecorded: "ৰেকৰ্ড কৰা হোৱা নাই",
  },

  dailyCare: {
    title: "দৈনিক যত্ন",

    patientInformation:
      "ৰোগীৰ তথ্য",

    patient:
      "ৰোগী",

    date:
      "তাৰিখ",

    time:
      "সময়",

    readingMethodQuestion:
      "আজিৰ ৰিডিংসমূহ কেনেকৈ যোগ কৰিব বিচাৰে?",

    uploadPhoto:
      "ফটো আপলোড কৰক",

    enterManually:
      "নিজে লিখক",

    captureMedicalReadings:
      "চিকিৎসা ৰিডিং লওক",

    captureHelp:
      "আপোনাৰ চিকিৎসা যন্ত্ৰৰ ৰিডিঙৰ ফটো লওক অথবা আগতে তোলা ছবি বাছনি কৰক।",

    takeOrSelectImage:
      "ফটো লওক অথবা ছবি বাছনি কৰক",

    readingImage:
      "ছবি পঢ়ি থকা হৈছে...",

    temperature:
      "তাপমাত্ৰা",

    unit:
      "একক",

    enterTemperature:
      "তাপমাত্ৰা লিখক",

    additionalVitals:
      "অতিৰিক্ত গুৰুত্বপূৰ্ণ স্বাস্থ্য মাপ",

    bloodPressure:
      "ৰক্তচাপ",

    systolic:
      "ওপৰৰ (চিষ্টোলিক)",

    diastolic:
      "তলৰ (ডায়াষ্টোলিক)",

    pulseRate:
      "নাড়ীৰ গতি",

    spo2:
      "SpO₂",

    symptoms:
      "লক্ষণসমূহ",

    painLocation:
      "বিষৰ স্থান",

    painHead:
      "মূৰ",

    painNeck:
      "ডিঙি",

    painChest:
      "বুকু",

    painAbdomen:
      "পেট",

    painBack:
      "পিঠি",

    painShoulder:
      "কান্ধ",

    painArm:
      "বাহু",

    painThigh:
      "উৰু",

    painKnee:
      "আঁঠু",

    painCalf:
      "ভৰিৰ কলাফুল",

    painFeet:
      "ভৰি",

    painOther:
      "অন্য",

    otherPainPlaceholder:
      "উদাহৰণ: বাওঁ কান্ধ, সোঁ কিলাকুটি...",

    medications:
      "ঔষধসমূহ",

    notes:
      "টোকাসমূহ",

    symptomFever:
      "জ্বৰ",

    symptomWeakness:
      "দুৰ্বলতা",

    symptomBodyPain:
      "শৰীৰৰ বিষ",

    symptomCough:
      "কাহ",

    symptomBloodInCough:
      "কাহত তেজ",

    symptomBreathlessness:
      "উশাহ লোৱাত কষ্ট",

    symptomWalkingDifficulty:
      "খোজ কঢ়াত অসুবিধা",

    symptomLossOfAppetite:
      "ভোক কমি যোৱা",

    symptomLooseMotions:
      "পাতল পায়খানা",

    symptomVomiting:
      "বমি",

    symptomDryMouth:
      "মুখ শুকাই যোৱা",

    symptomOther:
      "অন্য",

    pleaseSpecify:
      "অনুগ্ৰহ কৰি উল্লেখ কৰক",

    otherSymptomPlaceholder:
      "উদাহৰণ: মূৰ ঘূৰোৱা, কঁপনি, ফুলা...",

    saving:
      "সংৰক্ষণ হৈ আছে...",

    saveReading:
      "ৰিডিং সংৰক্ষণ কৰক",

    backToDashboard:
      "ডেশ্বব'ৰ্ডলৈ উভতি যাওক",

    recordingFor:
      "আপুনি কাৰ বাবে দৈনিক যত্ন ৰেকৰ্ড কৰিছে?",

    chooseOneOption:
      "অনুগ্ৰহ কৰি এটা বিকল্প বাছনি কৰক।",

    myself:
      "নিজৰ বাবে",

    familyMember:
      "পৰিয়ালৰ সদস্যৰ বাবে",

    takePhoto:
      "ফটো লওক",

    chooseExistingPhoto:
      "আগতে তোলা ফটো বাছনি কৰক",
  },

  alerts: {
    imageReadSuccess:
      "ছবিখন সফলতাৰে পঢ়া হৈছে। সংৰক্ষণ কৰাৰ আগতে পূৰণ হোৱা ৰিডিংসমূহ পৰীক্ষা কৰক।",

    invalidMedicalImage:
      "অনুগ্ৰহ কৰি থাৰ্মোমিটাৰ, ৰক্তচাপ মাপনী অথবা পালছ অক্সিমিটাৰ ডিছপ্লেৰ এখন স্পষ্ট ফটো আপলোড কৰক।",

    multipleReadings:
      "একাধিক ভিন্ন ৰিডিং চিনাক্ত কৰা হৈছে। অনুগ্ৰহ কৰি কেৱল শেহতীয়া ৰিডিং আপলোড কৰক।",

    creditsOver:
      "ক্ৰেডিট শেষ হৈছে। এডমিনৰ সৈতে যোগাযোগ কৰক।",

    imageProcessingFailed:
      "চিকিৎসা ছবিখন প্ৰক্ৰিয়াকৰণ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",

    saveSuccess:
      "দৈনিক যত্নৰ ৰিডিং সফলতাৰে সংৰক্ষণ কৰা হৈছে।",

    saveFailed:
      "দৈনিক যত্নৰ ৰিডিং সংৰক্ষণ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",
  },

  reports: {
    dailyCareReport:
      "দৈনিক যত্নৰ প্ৰতিবেদন",

    patientSummary:
      "ৰোগীৰ সাৰাংশ",

    recordedOn:
      "ৰেকৰ্ডৰ তাৰিখ",

    vitalSigns:
      "গুৰুত্বপূৰ্ণ স্বাস্থ্য মাপ",

    bloodPressure:
      "ৰক্তচাপ",

    pulse:
      "নাড়ী",
  },

  dashboard: {
    title:
      "ডেশ্বব'ৰ্ড",

    dailyCareSection:
      "দৈনিক যত্ন",

    dailyCare:
      "দৈনিক যত্ন",

    helpCentre:
      "সহায়তা কেন্দ্ৰ",

    assessmentSection:
      "স্বাস্থ্য মূল্যায়ন",

    familyAssessment:
      "পৰিয়ালৰ স্বাস্থ্য মূল্যায়ন",

    selfAssessment:
      "নিজৰ স্বাস্থ্য মূল্যায়ন",

    patientManagement:
      "ৰোগী ব্যৱস্থাপনা",

    addPatient:
      "ৰোগী যোগ কৰক",

    reports:
      "প্ৰতিবেদনসমূহ",

    logout:
      "লগ আউট",

    loading:
      "ডেশ্বব'ৰ্ড লোড হৈ আছে...",

    createdBy:
      "Suraj Premnath-ৰ দ্বাৰা নিৰ্মিত",

home:
    "মুখ্য পৃষ্ঠা",

whatWouldYouLikeToDo:
    "আপুনি কি কৰিব বিচাৰে?",

recordHealth:
    "স্বাস্থ্য তথ্য ৰেকৰ্ড কৰক",

recordHealthDescription:
    "নিজৰ বা পৰিয়ালৰ কোনো সদস্যৰ স্বাস্থ্য তথ্য ৰেকৰ্ড কৰক",

viewHealth:
    "স্বাস্থ্য তথ্য চাওক",

viewHealthDescription:
    "স্বাস্থ্য সময়ৰেখা, প্ৰতিবেদন আৰু প্ৰৱণতা চাওক",

helpAndFaqs:
    "সহায়তা আৰু সাধাৰণ প্ৰশ্ন",

helpAndFaqsDescription:
    "CareVR কেনেকৈ ব্যৱহাৰ কৰিব লাগে জানক আৰু উত্তৰ বিচাৰি পাওক",
  },

  addPatient: {
    title:
      "ৰোগী যোগ কৰক",

    loading:
      "লোড হৈ আছে...",

    fullName:
      "সম্পূৰ্ণ নাম",

    fullNamePlaceholder:
      "ৰোগীৰ সম্পূৰ্ণ নাম লিখক",

    dateOfBirth:
      "জন্ম তাৰিখ",

    age:
      "বয়স",

    years:
      "বছৰ",

    gender:
      "লিংগ",

    selectGender:
      "লিংগ বাছনি কৰক",

    male:
      "পুৰুষ",

    female:
      "মহিলা",

    other:
      "অন্য",

    preferNotToSay:
      "ক'ব নিবিচাৰে",

    relationship:
      "সম্পৰ্ক",

    selectRelationship:
      "সম্পৰ্ক বাছনি কৰক",

    father:
      "দেউতা",

    mother:
      "মা",

    spouse:
      "জীৱনসংগী",

    brother:
      "ভাই",

    sister:
      "ভনী",

    son:
      "পুত্ৰ",

    daughter:
      "কন্যা",

    grandfather:
      "ককা / নানা",

    grandmother:
      "আইতা / নানী",

    uncle:
      "খুৰা / মামা",

    aunt:
      "খুৰী / মাহী",

    friend:
      "বন্ধু",

    neighbour:
      "চুবুৰীয়া",

    savingPatient:
      "ৰোগীৰ তথ্য সংৰক্ষণ হৈ আছে...",

    savePatient:
      "ৰোগীৰ তথ্য সংৰক্ষণ কৰক",

    backToDashboard:
      "ডেশ্বব'ৰ্ডলৈ উভতি যাওক",

    createdBy:
      "Suraj Premnath-ৰ দ্বাৰা নিৰ্মিত",

    saveFailed:
      "ৰোগীৰ তথ্য সংৰক্ষণ কৰিব পৰা নগ'ল।",

    saveSuccess:
      "ৰোগী সফলতাৰে যোগ কৰা হৈছে।",

    unexpectedError:
      "ৰোগীৰ তথ্য সংৰক্ষণ কৰোঁতে কিবা ভুল হৈছে।",
  },

  assessment: {
    tagline:
      "সহজ দৈনিক যত্ন।\nউন্নত চিকিৎসা আলোচনা।",

    selfAssessment:
      "নিজৰ স্বাস্থ্য মূল্যায়ন",

    familyAssessment:
      "পৰিয়ালৰ স্বাস্থ্য মূল্যায়ন",

    page:
      "পৃষ্ঠা",

    of:
      "ৰ ভিতৰত",

    healthCheckToday:
      "আজিৰ স্বাস্থ্য পৰীক্ষা",

    feelFeverish:
      "আজি আপোনাৰ জ্বৰ জ্বৰ অনুভৱ হৈছে নেকি?",

    temperatureTaken:
      "আপোনাৰ তাপমাত্ৰা জোখা হৈছিল নেকি?",

    latestTemperature:
      "শেহতীয়া তাপমাত্ৰাৰ ৰিডিং",

    temperaturePlaceholder:
      "উদাহৰণ: 101.4",

    energyToday:
      "আজি আপোনাৰ শক্তি কেনেকুৱা?",

    good:
      "ভাল",

    tired:
      "ভাগৰুৱা",

    veryTired:
      "অতি ভাগৰুৱা",

    previous:
      "পূৰ্বৱৰ্তী",

    next:
      "পৰৱৰ্তী",

    alertFever:
      "অনুগ্ৰহ কৰি আপোনাৰ জ্বৰ জ্বৰ অনুভৱ হৈছে নে নাই জনাওক।",

    alertTemperatureTaken:
      "অনুগ্ৰহ কৰি তাপমাত্ৰা জোখা হৈছিল নে নাই জনাওক।",

    alertTemperatureReading:
      "অনুগ্ৰহ কৰি তাপমাত্ৰাৰ ৰিডিং লিখক।",

    alertEnergy:
      "অনুগ্ৰহ কৰি আপোনাৰ শক্তিৰ স্তৰ বাছনি কৰক।",

    appetiteToday:
      "আজি আপোনাৰ ভোক কেনেকুৱা?",

    appetiteNormal:
      "স্বাভাৱিক",

    appetiteLess:
      "কমকৈ খাইছে",

    appetitePoor:
      "প্ৰায় একোৱেই খোৱা নাই",

    drinkingEnoughWater:
      "আপুনি পৰ্যাপ্ত পানী খাইছে নেকি?",

    notSure:
      "নিশ্চিত নহয়",

    waterIntake:
      "পানী খোৱাৰ পৰিমাণ",

    alertAllQuestions:
      "অনুগ্ৰহ কৰি সকলো প্ৰশ্নৰ উত্তৰ দিয়ক।",

    alertWaterIntake:
      "অনুগ্ৰহ কৰি পানী খোৱাৰ পৰিমাণ বাছনি কৰক।",

    discomfortToday:
      "আজি আপুনি কোনো অস্বস্তি অনুভৱ কৰিছিল নেকি?",

    discomfortWhere:
      "আপুনি ক'ত অস্বস্তি অনুভৱ কৰিছিল?",

    areaHead:
      "মূৰ",

    areaEyes:
      "চকু",

    areaEars:
      "কাণ",

    areaNeck:
      "ডিঙি",

    areaChest:
      "বুকু",

    areaBack:
      "পিঠি",

    areaStomach:
      "পেট",

    areaArmsHands:
      "বাহু / হাত",

    areaLegsFeet:
      "ঠেং / ভৰি",

    areaJoints:
      "গাঁঠি",

    areaOther:
      "অন্য",

    describeDiscomfort:
      "অস্বস্তিৰ বিৱৰণ দিয়ক",

    alertQuestion:
      "অনুগ্ৰহ কৰি প্ৰশ্নটোৰ উত্তৰ দিয়ক।",

    alertDiscomfortAreas:
      "অনুগ্ৰহ কৰি অস্বস্তি হোৱা স্থানসমূহ বাছনি কৰক।",

    alertSpecifyDiscomfort:
      "অনুগ্ৰহ কৰি অস্বস্তিৰ বিষয়ে উল্লেখ কৰক।",

    walkingToday:
      "আজি আপুনি খোজ কাঢ়িব পাৰিছে নেকি?",

    walkingEasily:
      "সহজে",

    walkingSomeDifficulty:
      "কিছু অসুবিধাৰে",

    walkingVeryDifficult:
      "অতি কষ্টকৰ",

    needHelpWalking:
      "খোজ কঢ়াৰ বাবে সহায়ৰ প্ৰয়োজন নেকি?",

    looseMotionsToday:
      "আজি পাতল পায়খানা হৈছে নেকি?",

    looseMotionType:
      "প্ৰকাৰ?",

    looseMotionWatery:
      "পানীৰ দৰে",

    looseMotionSticky:
      "আঠাযুক্ত",

    finishAssessment:
      "মূল্যায়ন সম্পূৰ্ণ কৰক",

    alertWalkingHelp:
      "অনুগ্ৰহ কৰি খোজ কঢ়াৰ বাবে সহায়ৰ প্ৰয়োজন আছে নে নাই জনাওক।",

    alertLooseMotionType:
      "অনুগ্ৰহ কৰি পাতল পায়খানাৰ প্ৰকাৰ বাছনি কৰক।",

    assessmentDetails:
      "মূল্যায়নৰ বিৱৰণ",

    yourName:
      "আপোনাৰ নাম",

    enterYourName:
      "আপোনাৰ নাম লিখক",

    yourAge:
      "আপোনাৰ বয়স",

    enterYourAge:
      "আপোনাৰ বয়স লিখক",

    startAssessment:
      "মূল্যায়ন আৰম্ভ কৰক",

    alertNameAndAge:
      "অনুগ্ৰহ কৰি নাম আৰু বয়স লিখক",

    selectPatientToBegin:
      "মূল্যায়ন আৰম্ভ কৰিবলৈ এজন ৰোগী বাছনি কৰক।",

    noPatientsFound:
      "কোনো ৰোগী পোৱা নগ'ল। অনুগ্ৰহ কৰি প্ৰথমে এজন ৰোগী যোগ কৰক।",

    selectPatient:
      "ৰোগী বাছনি কৰক",

    name:
      "নাম",

    age:
      "বয়স",

    gender:
      "লিংগ",

    relationship:
      "সম্পৰ্ক",

    addNewPatient:
      "নতুন ৰোগী যোগ কৰক",

    backToDashboard:
      "ডেশ্বব'ৰ্ডলৈ উভতি যাওক",

    unableToContinue:
      "আগবাঢ়িব পৰা নগ'ল",

    profileLoadError:
      "আপোনাৰ প্ৰ'ফাইল লোড কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰ ছাইন ইন কৰক।",

    patientLoadError:
      "ৰোগীৰ তথ্য লোড কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",

    pageLoadError:
      "এই পৃষ্ঠাটো লোড কৰোঁতে কিবা ভুল হৈছে। অনুগ্ৰহ কৰি ৰিফ্ৰেছ কৰি পুনৰ চেষ্টা কৰক।",

    breathingToday:
      "আজি ৰোগীৰ উশাহ-নিশাহ কেনেকুৱা আছিল?",

    breathingNormal:
      "স্বাভাৱিক",

    breathingSlightlyDifficult:
      "সামান্য কষ্টকৰ",

    breathingVeryDifficult:
      "অতি কষ্টকৰ",

    coughingToday:
      "আজি ৰোগীৰ কাহ হৈছিল নেকি?",

    coughSometimes:
      "কেতিয়াবা",

    coughFrequently:
      "সঘনাই",

    bloodWhileCoughing:
      "কাহোঁতে তেজ দেখা গৈছিল নেকি?",

    alertBloodInCough:
      "অনুগ্ৰহ কৰি কাহোঁতে তেজ দেখা গৈছিল নে নাই জনাওক।",

    patientFeverishToday:
      "আজি ৰোগীক জ্বৰ জ্বৰ যেন লাগিছিল নেকি?",

    temperatureMeasured:
      "তাপমাত্ৰা জোখা হৈছিল নেকি?",

    enterLatestTemperature:
      "শেহতীয়া তাপমাত্ৰা লিখক",

    patientEnergyToday:
      "আজি ৰোগীক কিমান সক্ৰিয় যেন লাগিছিল?",

    energyActive:
      "সক্ৰিয়",

    energyLessActive:
      "কম সক্ৰিয়",

    energyVeryWeak:
      "অতি দুৰ্বল",

    alertTemperatureMeasured:
      "অনুগ্ৰহ কৰি তাপমাত্ৰা জোখা হৈছিল নে নাই জনাওক।",

    patientEatingToday:
      "আজি ৰোগীৰ খোৱা-বোৱা কেনেকুৱা আছিল?",

    patientDrinkingEnoughWater:
      "আজি ৰোগীয়ে পৰ্যাপ্ত পানী খাইছিল নেকি?",

    patientWaterGlasses:
      "ৰোগীয়ে আনুমানিক কিমান গিলাচ পানী খাইছিল?",

    oneGlass:
      "1 গিলাচ",

    twoGlasses:
      "2 গিলাচ",

    threeGlasses:
      "3 গিলাচ",

    fourGlasses:
      "4 গিলাচ",

    fivePlusGlasses:
      "5+ গিলাচ",

    patientDiscomfortToday:
      "আজি ৰোগীয়ে কোনো অস্বস্তি অনুভৱ কৰিছিল নেকি?",

    patientDiscomfortWhere:
      "ৰোগীয়ে ক'ত অস্বস্তি অনুভৱ কৰিছিল?",

    areaArms:
      "বাহু",

    areaLegs:
      "ঠেং",

    alertPatientDiscomfortAreas:
      "অনুগ্ৰহ কৰি ৰোগীয়ে অস্বস্তি অনুভৱ কৰা স্থানসমূহ বাছনি কৰক।",

    alertOtherDiscomfortArea:
      "অনুগ্ৰহ কৰি অন্য অস্বস্তিৰ স্থান উল্লেখ কৰক।",

    patientWalkingToday:
      "আজি ৰোগীৰ খোজ কঢ়া কেনেকুৱা আছিল?",

    walkedEasily:
      "সহজে খোজ কাঢ়িছিল",

    patientNeedHelpWalking:
      "ৰোগীক খোজ কঢ়াৰ বাবে সহায়ৰ প্ৰয়োজন হৈছিল নেকি?",

    alertWalkingHelpNeeded:
      "অনুগ্ৰহ কৰি সহায়ৰ প্ৰয়োজন হৈছিল নে নাই জনাওক।",

    looseMotionsObserved:
      "পাতল পায়খানা হোৱা দেখা গৈছিল নেকি?",

    looseMotionTypeObserved:
      "কি ধৰণৰ পাতল পায়খানা দেখা গৈছিল?",

    patientConfusedToday:
      "আজি ৰোগীক অস্বাভাৱিকভাৱে বিভ্ৰান্ত যেন লাগিছিল নেকি?",
  },

};
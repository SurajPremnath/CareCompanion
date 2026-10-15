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

backToHome:
    "মুখ্য পৃষ্ঠালৈ উভতি যাওক",

healthCheckAssessment:
    "স্বাস্থ্য পৰীক্ষা মূল্যায়ন",

healthHistory:
    "স্বাস্থ্য ইতিহাস",

medicationManagement:
    "ঔষধ ব্যৱস্থাপনা",
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

medication: {

    //--------------------------------------------------
    // General
    //--------------------------------------------------

    title:
        "ঔষধ ব্যৱস্থাপনা",

    addPrescription:
        "প্ৰেছক্ৰিপশ্যন যোগ কৰক",

    viewPrescriptions:
        "সংৰক্ষিত প্ৰেছক্ৰিপশ্যনসমূহ চাওক",

    prescriptionDetails:
        "প্ৰেছক্ৰিপশ্যনৰ বিৱৰণ",

    reviewPrescription:
        "প্ৰেছক্ৰিপশ্যন পৰ্যালোচনা",

    //--------------------------------------------------
    // Upload
    //--------------------------------------------------

    takePhoto:
        "ফটো লওক",

    choosePhotos:
        "ফটো বাছক",

    uploadPdf:
        "PDF আপলোড কৰক",

    readPrescription:
        "প্ৰেছক্ৰিপশ্যন পঢ়ক",

    readingPrescription:
        "প্ৰেছক্ৰিপশ্যন পঢ়া হৈছে...",

    preparingPrescription:
        "প্ৰেছক্ৰিপশ্যন প্ৰস্তুত কৰা হৈছে...",

    prescriptionReadSuccess:
        "প্ৰেছক্ৰিপশ্যন সফলভাৱে পঢ়া হৈছে।",

    //--------------------------------------------------
    // Consultation
    //--------------------------------------------------

    consultationDate:
        "পৰামৰ্শৰ তাৰিখ",

    consultationMode:
        "পৰামৰ্শৰ ধৰণ",

    doctor:
        "ডাক্তৰ",

    hospital:
        "হাস্পতাল / ক্লিনিক",

    diagnosisAssessment:
        "ৰোগ নিৰ্ণয় / মূল্যায়ন",

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    medicines:
        "ঔষধসমূহ",

    medicine:
        "ঔষধ",

    dosage:
        "ড'জ",

    frequency:
        "বাৰম্বাৰতা",

    duration:
        "সময়সীমা",

    instructions:
        "নিৰ্দেশনা",

    //--------------------------------------------------
    // Actions
    //--------------------------------------------------

    savePrescription:
        "নিশ্চিত কৰি সংৰক্ষণ কৰক",

    savingPrescription:
        "সংৰক্ষণ কৰা হৈছে...",

    reupload:
        "প্ৰেছক্ৰিপশ্যন পুনৰ আপলোড কৰক",

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    consultationDateRequired:
        "পৰামৰ্শৰ তাৰিখ প্ৰয়োজন।",

    consultationDateFuture:
        "পৰামৰ্শৰ তাৰিখ ভৱিষ্যতৰ হ'ব নোৱাৰে।",

    consultationDateInvalid:
        "অবৈধ পৰামৰ্শৰ তাৰিখ।",

    consultationTypeRequired:
        "অনুগ্ৰহ কৰি পৰামৰ্শৰ ধৰণ বাছক।",

    patientRequired:
        "অনুগ্ৰহ কৰি ৰোগী বাছক।",

    patientMismatch:
        "এই প্ৰেছক্ৰিপশ্যন আন এজন ৰোগীৰ যেন লাগে।",

    //--------------------------------------------------
    // Warnings
    //--------------------------------------------------

    warningTitle:
        "সতৰ্কবাণীৰ সৈতে পৰ্যালোচনা সম্পূৰ্ণ হৈছে",

    doctorNotDetected:
        "ডাক্তৰৰ নাম চিনাক্ত কৰিব পৰা নগ'ল।",

    hospitalNotDetected:
        "হাস্পতাল বা ক্লিনিকৰ নাম চিনাক্ত কৰিব পৰা নগ'ল।",

    diagnosisNotDetected:
        "ৰোগ নিৰ্ণয় বা মূল্যায়ন চিনাক্ত কৰিব পৰা নগ'ল।",

    medicinesNotDetected:
        "কোনো ঔষধ চিনাক্ত কৰিব পৰা নগ'ল।",

    warningContinue:
        "তথ্য সঠিক হ'লে আপুনি এই প্ৰেছক্ৰিপশ্যন সংৰক্ষণ কৰিব পাৰে।",

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    saveSuccess:
        "প্ৰেছক্ৰিপশ্যন সফলভাৱে সংৰক্ষণ কৰা হৈছে।",

    saveFailed:
        "প্ৰেছক্ৰিপশ্যন সংৰক্ষণ কৰিব পৰা নগ'ল।",

    selectPrescription:
        "অনুগ্ৰহ কৰি এটা প্ৰেছক্ৰিপশ্যন বাছক।",

    readFailed:
        "প্ৰেছক্ৰিপশ্যন পঢ়িব পৰা নগ'ল।",

    processingFailed:
        "প্ৰেছক্ৰিপশ্যন প্ৰক্ৰিয়াকৰণ কৰিব পৰা নগ'ল।",

    patientMismatchTitle:
        "প্ৰেছক্ৰিপশ্যন আন এজন ৰোগীৰ",

    patient:
        "ৰোগী",

    patientDetails:
        "ৰোগীৰ বিৱৰণ",

    patientSymptoms:
        "ৰোগীৰ লক্ষণসমূহ",

    assessment:
        "মূল্যায়ন",

    additionalDiagnoses:
        "অতিৰিক্ত ৰোগ নিৰ্ণয়",

    examinationFindings:
        "পৰীক্ষাৰ ফলাফল",

    relevantMedicalHistory:
        "সম্পৰ্কিত চিকিৎসা ইতিহাস",

    lifestyle:
        "জীৱনশৈলী",

    consultationVitals:
        "পৰামৰ্শৰ ভাইটেলসমূহ",

    investigationsOrdered:
        "নিৰ্দেশিত পৰীক্ষাসমূহ",

    careInstructions:
        "যত্নৰ নিৰ্দেশনা",

    otherNotes:
        "অন্যান্য টোকা",

    medicationsPrescribed:
        "নিৰ্ধাৰিত ঔষধসমূহ",

    importantAdministrationTiming:
        "গুৰুত্বপূৰ্ণ: ঔষধ সেৱনৰ সময়",

    administrationTimingInfo1:
        "CareVR এ ঔষধ খাবাৰৰ আগতে, পিছত, খাবাৰৰ সৈতে বা অন্য সময়ত ল'ব লাগে নে নাই সেইটো অনুমান নকৰে।",

    administrationTimingInfo2:
        "ঔষধ লোৱাৰ সঠিক সময় ডাক্তৰৰ সৈতে নিশ্চিত কৰি তাৰ পিছত বাছনি কৰক।",

    administrationTimingInfo3:
        "যদি সময় এতিয়াও নিশ্চিত হোৱা নাই, তেন্তে 'নিৰ্দিষ্ট কৰা হোৱা নাই' হিচাপে ৰাখক আৰু পিছত আপডেট কৰক।",

    noMedicinesDetected:
        "কোনো ঔষধ চিনাক্ত কৰিব পৰা নগ'ল।",

    aiExtractedDate:
        "AI দ্বাৰা চিনাক্ত কৰা তাৰিখ",

    consultationDateHelp:
        "তাৰিখ ভুল হ'লে সঠিক পৰামৰ্শৰ তাৰিখ বাছক।",

    weight:
        "ওজন",

    bloodPressure:
        "ৰক্তচাপ",

    pulse:
        "নাড়ী",

    temperature:
        "তাপমাত্ৰা",

    spo2:
        "SpO₂",

    strength:
        "শক্তি",

    dose:
        "ড'জ",

    administrationTiming:
        "ঔষধ সেৱনৰ সময়",

    //--------------------------------------------------
    // Administration Timing
    //--------------------------------------------------

    notSpecified:
        "নিৰ্দিষ্ট কৰা হোৱা নাই",

    beforeFood:
        "খাবাৰৰ আগতে",

    afterFood:
        "খাবাৰৰ পিছত",

    withFood:
        "খাবাৰৰ সৈতে",

    emptyStomach:
        "খালী পেটত",

    beforeBreakfast:
        "জলপানৰ আগতে",

    afterBreakfast:
        "জলপানৰ পিছত",

    beforeLunch:
        "দুপৰীয়াৰ আহাৰৰ আগতে",

    afterLunch:
        "দুপৰীয়াৰ আহাৰৰ পিছত",

    beforeDinner:
        "ৰাতিৰ আহাৰৰ আগতে",

    afterDinner:
        "ৰাতিৰ আহাৰৰ পিছত",

    atBedtime:
        "শুবলৈ যোৱাৰ আগতে",

    asDirected:
        "ডাক্তৰৰ পৰামৰ্শ অনুসৰি",

whatWouldYouLikeToDo:
    "আপুনি কি কৰিব বিচাৰে?",

modeOfConsultation:
    "পৰামৰ্শৰ ধৰণ",

howWouldYouLikeToAddPrescription:
    "আপুনি কেনেকৈ প্ৰেছক্ৰিপশ্যন যোগ কৰিব বিচাৰে?",

forBestResults:
    "সৰ্বোত্তম ফলাফলৰ বাবে",

supportedFormats:
    "সমৰ্থিত ফৰ্মেট: JPG, JPEG আৰু PNG",

useClearImages:
    "স্পষ্ট আৰু ভাল পোহৰৰ ছবি ব্যৱহাৰ কৰক",

cropBackground:
    "অপ্ৰয়োজনীয় পটভূমি আঁতৰাওক",

recommendedImageSize:
    "পৰামৰ্শিত ছবিৰ আকাৰ: 300 KB – 1 MB",

maximumImageSize:
    "প্ৰতি ছবিৰ সৰ্বাধিক আকাৰ: 2 MB",

howWasConsultationConducted:
    "পৰামৰ্শ কেনেকৈ কৰা হৈছিল?",

inPerson:
    "সাক্ষাতে",

video:
    "ভিডিঅ’",

phone:
    "ফোন",

homeVisit:
    "ঘৰত সাক্ষাৎ",

other:
    "অন্যান্য",

howWouldYouLikeToRecordHealth:
    "আপুনি কেনেকৈ স্বাস্থ্য ৰেকৰ্ড কৰিব বিচাৰে?",

recordWithVoice:
    "কণ্ঠস্বৰে ৰেকৰ্ড কৰক",

uploadReading:
    "ৰিডিং আপলোড কৰক",

enterManually:
    "নিজে লিখক",

dailyCare:
    "দৈনিক যত্ন",

assessmentsHistory:
    "মূল্যায়নসমূহ",

clinicalTrends:
    "ক্লিনিকেল প্ৰৱণতা",

detailedTimeline:
    "বিস্তৃত সময়ৰেখা",

pleaseSpecifyConsultationMode:
    "অনুগ্ৰহ কৰি পৰামৰ্শৰ ধৰণ উল্লেখ কৰক",

validationErrorsTitle:
    "সংৰক্ষণ কৰাৰ আগতে তলৰ ভুলসমূহ সংশোধন কৰক",

patientBelongsTo:
    "এই প্ৰেছক্ৰিপশ্যন এই ৰোগীৰ যেন লাগে",

currentlyAddingFor:
    "আপুনি বৰ্তমান এই ৰোগীৰ বাবে প্ৰেছক্ৰিপশ্যন যোগ কৰি আছে",

chooseCorrectPatient:
    "অনুগ্ৰহ কৰি সঠিক প্ৰেছক্ৰিপশ্যন পুনৰ আপলোড কৰক অথবা উভতি গৈ সঠিক পৰিয়ালৰ সদস্য বাছনি কৰক।",

reuploadPrescription:
    "প্ৰেছক্ৰিপশ্যন পুনৰ আপলোড কৰক",

whoIsThisFor:
    "এইটো কাৰ বাবে?",

//--------------------------------------------------
// Consultation Workspace
//--------------------------------------------------

consultationDetails:
    "পৰামৰ্শৰ বিৱৰণ",

consultationDetailsDescription:
    "আপুনি জনা তথ্যসমূহ যোগ কৰক। ঐচ্ছিক ক্ষেত্ৰসমূহ খালী ৰাখিব পাৰিব।",

doctorName:
    "ডাক্তৰৰ নাম",

enterDoctorName:
    "ডাক্তৰৰ নাম লিখক",

hospitalOrClinic:
    "হাস্পতাল / ক্লিনিক",

enterHospitalOrClinic:
    "হাস্পতাল বা ক্লিনিকৰ নাম লিখক",

optional:
    "ঐচ্ছিক",

videoPlatform:
    "ভিডিঅ' প্লেটফৰ্ম",

exampleVideoPlatform:
    "উদাহৰণ: WhatsApp, Zoom",

consultationType:
    "পৰামৰ্শৰ ধৰণ",

phoneConsultation:
    "ফোন পৰামৰ্শ",

doctorServiceDetails:
    "ডাক্তৰ / সেৱাৰ বিৱৰণ",

enterDoctorServiceDetails:
    "ডাক্তৰ বা সেৱাৰ বিৱৰণ লিখক",

consultationMethod:
    "পৰামৰ্শৰ পদ্ধতি",

describeConsultationMethod:
    "পৰামৰ্শৰ পদ্ধতি বৰ্ণনা কৰক",

consultationNotes:
    "টোকা",

enterConsultationNotes:
    "পৰামৰ্শ সম্পৰ্কীয় টোকা যোগ কৰক",

//--------------------------------------------------
// Prescription Review
//--------------------------------------------------

reviewNoteTitle:
    "সংৰক্ষণ কৰাৰ আগতে পৰ্যালোচনা কৰক",

reviewNoteDescription:
    "তলৰ তথ্যসমূহ আপলোড কৰা প্ৰেছক্ৰিপশ্যনৰ পৰা AI-এ সংগ্ৰহ কৰিছে। সংৰক্ষণ কৰাৰ আগতে অনুগ্ৰহ কৰি ইয়াৰ শুদ্ধতা নিশ্চিত কৰক।",

reviewInstruction:
    "সংৰক্ষণ কৰাৰ আগতে প্ৰতিটো অংশ খুলি সংগৃহীত তথ্যসমূহ পৰীক্ষা কৰক।",

//--------------------------------------------------
// Prescription Upload
//--------------------------------------------------

uploadFailed:
    "নিৰ্বাচিত প্ৰেছক্ৰিপশ্যনৰ ছবি আপলোড কৰিব পৰা নগ'ল।",

filesTooLarge:
    "তলৰ ফাইলসমূহ অনুমোদিত আকাৰতকৈ ডাঙৰ।",

recommendedUploadSize:
    "পৰামৰ্শিত আকাৰ: প্ৰতিটো ছবিৰ বাবে 300 KB – 1 MB।",

maximumUploadSize:
    "সৰ্বাধিক অনুমোদিত আকাৰ: প্ৰতিটো ছবিৰ বাবে 2 MB।",

cropBackgroundBeforeUpload:
    "আপলোড কৰাৰ আগতে অপ্ৰয়োজনীয় পটভূমি আঁতৰাওক।",

reduceImageSize:
    "অনুগ্ৰহ কৰি ছবিৰ আকাৰ কমাই পুনৰ চেষ্টা কৰক।",

cameraUnavailable:
    "কেমেৰা ব্যৱহাৰ কৰিব পৰা নগ'ল।",

readingFailed:
    "প্ৰেছক্ৰিপশ্যন পঢ়িব পৰা নগ'ল।",

savingFailed:
    "প্ৰেছক্ৰিপশ্যন সংৰক্ষণ কৰিব পৰা নগ'ল।",

prescriptionSaved:
    "প্ৰেছক্ৰিপশ্যন সফলভাৱে সংৰক্ষণ কৰা হৈছে।",

//--------------------------------------------------
// Additional UI Messages
//--------------------------------------------------

uploadFileTooLargeMessage:
    "নিৰ্বাচিত প্ৰেছক্ৰিপশ্যনৰ ছবিসমূহ আপলোড কৰিব পৰা নগ'ল।\n\n" +
    "তলৰ ফাইলসমূহ অনুমোদিত আকাৰতকৈ ডাঙৰ:\n\n" +
    "{fileNames}\n\n" +
    "সৰ্বোত্তম অভিজ্ঞতাৰ বাবে (বিশেষকৈ iPhone-ত):\n\n" +
    "• প্ৰতিখন ছবিৰ বাবে পৰামৰ্শিত আকাৰ: 300 KB - 1 MB\n" +
    "• প্ৰতিখন ছবিৰ বাবে সৰ্বাধিক অনুমোদিত আকাৰ: 2 MB\n" +
    "• আপলোড কৰাৰ আগতে অপ্ৰয়োজনীয় পটভূমি আঁতৰাওক\n\n" +
    "অনুগ্ৰহ কৰি ছবিৰ আকাৰ কমাই পুনৰ চেষ্টা কৰক।",

pleaseRecordatleastOneObservation:
    "অনুগ্ৰহ কৰি অন্ততঃ এটা স্বাস্থ্য পৰ্যবেক্ষণ লিপিবদ্ধ কৰক।\n\n" +
    "• তাপমাত্ৰা\n" +
    "• ওজন\n" +
    "• গুৰুত্বপূৰ্ণ মাপ (Vitals)\n" +
    "• লক্ষণসমূহ\n" +
    "• বিষৰ স্থান",

choosePhoto:
    "ফটো বাছক",

currentlyAddingPrescriptionFor:
    "আপুনি বৰ্তমান এই ৰোগীৰ বাবে এটা প্ৰেছক্ৰিপশ্যন যোগ কৰি আছে",

capturePhoto:
    "ফটো তুলক",

chooseCorrectPrescription:
    "অনুগ্ৰহ কৰি সঠিক প্ৰেছক্ৰিপশ্যন পুনৰ আপলোড কৰক অথবা পিছলৈ গৈ সঠিক পৰিয়ালৰ সদস্য বাছনি কৰক।",

prescriptionReadError:
    "প্ৰেছক্ৰিপশ্যন পঢ়াৰ ত্ৰুটি:",

pleaseSelectFamilyMember:
    "অনুগ্ৰহ কৰি এজন পৰিয়ালৰ সদস্য বাছনি কৰক।",

manualCareSaveError:
    "ম্যানুৱেল কেয়াৰ সংৰক্ষণ ত্ৰুটি:",

clear:
    "পৰিষ্কাৰ কৰক",

yourFamilyMember:
    "আপোনাৰ পৰিয়ালৰ সদস্য",

uploadCareImageProcessingError:
    "আপলোড কৰা স্বাস্থ্য ছবিখন প্ৰক্ৰিয়াকৰণত ত্ৰুটি:",

uploadCareSaveError:
    "স্বাস্থ্য ৰেকৰ্ড সংৰক্ষণত ত্ৰুটি:",

useAnotherPhoto:
    "আন এখন ফটো ব্যৱহাৰ কৰক",

saveHealthReading:
    "স্বাস্থ্য ৰিডিং সংৰক্ষণ কৰক",

selectTemperatureOrDontKnow:
    "অনুগ্ৰহ কৰি তাপমাত্ৰা বাছনি কৰক অথবা 'মই নাজানো' বাছনি কৰক।",

voiceCareSaveError:
    "ভইচ কেয়াৰ সংৰক্ষণ ত্ৰুটি:",

reviewRecording:
    "ৰেকৰ্ডিং পৰ্যালোচনা কৰক",

healthUpdateReady:
    "আপোনাৰ স্বাস্থ্য আপডেট সাজু হৈছে। আপুনি ইয়াক পৰ্যালোচনা কৰিব পাৰে অথবা পোনপটীয়াকৈ সংৰক্ষণ কৰিব পাৰে।",

},

};
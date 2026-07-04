import type {
  TranslationDictionary,
} from "../types";

export const bn: TranslationDictionary = {

  common: {
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    back: "ফিরে যান",
    loading: "লোড হচ্ছে...",
    yes: "হ্যাঁ",
    no: "না",
    notRecorded: "রেকর্ড করা হয়নি",
  },

  dailyCare: {
    title:
      "দৈনন্দিন যত্ন",

    patientInformation:
      "রোগীর তথ্য",

    patient:
      "রোগী",

    date:
      "তারিখ",

    time:
      "সময়",

    readingMethodQuestion:
      "আজকের রিডিং কীভাবে রেকর্ড করতে চান?",

    uploadPhoto:
      "ছবি আপলোড করুন",

    enterManually:
      "নিজে লিখুন",

    captureMedicalReadings:
      "মেডিকেল রিডিংয়ের ছবি তুলুন",

    captureHelp:
      "মেডিকেল ডিভাইসের রিডিং স্পষ্ট দেখা যায় এমন ছবি তুলুন অথবা একটি ছবি নির্বাচন করুন।",

    takeOrSelectImage:
      "ছবি তুলুন অথবা নির্বাচন করুন",

    readingImage:
      "ছবি পড়া হচ্ছে...",

    temperature:
      "শরীরের তাপমাত্রা",

    unit:
      "ইউনিট",

    enterTemperature:
      "তাপমাত্রা লিখুন",

    additionalVitals:
      "অন্যান্য গুরুত্বপূর্ণ স্বাস্থ্য রিডিং",

    bloodPressure:
      "রক্তচাপ",

    systolic:
      "উপরের চাপ (সিস্টোলিক)",

    diastolic:
      "নিচের চাপ (ডায়াস্টোলিক)",

    pulseRate:
      "পালস রেট",

    spo2:
      "SpO₂",

    symptoms:
      "উপসর্গ",

    painLocation:
      "ব্যথার স্থান",

painHead: "মাথা",
painNeck: "ঘাড়",
painChest: "বুক",
painAbdomen: "পেট",
painBack: "পিঠ",
painShoulder: "কাঁধ",
painArm: "বাহু",
painThigh: "উরু",
painKnee: "হাঁটু",
painCalf: "পায়ের পেছনের অংশ",
painFeet: "পা",
painOther: "অন্যান্য",

otherPainPlaceholder:
  "উদাহরণ: বাম কাঁধ, ডান কনুই...",

    medications:
      "ওষুধ",

    notes:
      "নোট",

symptomFever:
  "জ্বর",

symptomWeakness:
  "দুর্বলতা",

symptomBodyPain:
  "শরীর ব্যথা",

symptomCough:
  "কাশি",

symptomBloodInCough:
  "কাশির সঙ্গে রক্ত",

symptomBreathlessness:
  "শ্বাসকষ্ট",

symptomWalkingDifficulty:
  "হাঁটতে অসুবিধা",

symptomLossOfAppetite:
  "ক্ষুধা কমে যাওয়া",

symptomLooseMotions:
  "পাতলা পায়খানা",

symptomVomiting:
  "বমি",

symptomDryMouth:
  "মুখ শুকিয়ে যাওয়া",

symptomOther:
  "অন্যান্য",

pleaseSpecify:
  "অনুগ্রহ করে বিস্তারিত লিখুন",

otherSymptomPlaceholder:
  "উদাহরণ: মাথা ঘোরা, কাঁপুনি দিয়ে ঠান্ডা লাগা, ফোলা...",

saving: "সংরক্ষণ করা হচ্ছে...",
saveReading: "রিডিং সংরক্ষণ করুন",
backToDashboard: "ড্যাশবোর্ডে ফিরে যান",

recordingFor:
  "আপনি কার জন্য দৈনিক যত্নের তথ্য নথিভুক্ত করছেন?",

chooseOneOption:
  "অনুগ্রহ করে একটি বিকল্প নির্বাচন করুন।",

myself:
  "নিজের জন্য",

familyMember:
  "পরিবারের সদস্য",

takePhoto: "ছবি তুলুন",
chooseExistingPhoto: "আগের ছবি নির্বাচন করুন",
  },

  alerts: {
    imageReadSuccess:
      "ছবিটি সফলভাবে পড়া হয়েছে। সংরক্ষণ করার আগে পূরণ হওয়া রিডিংগুলো যাচাই করুন।",

    invalidMedicalImage:
      "অনুগ্রহ করে থার্মোমিটার, ব্লাড প্রেসার মনিটর অথবা পালস অক্সিমিটারের ডিসপ্লে স্পষ্ট দেখা যায় এমন ছবি আপলোড করুন।",

    multipleReadings:
      "ছবিতে একাধিক আলাদা রিডিং পাওয়া গেছে। অনুগ্রহ করে শুধু সর্বশেষ রিডিং দেখা যায় এমন ছবি আপলোড করুন।",

    creditsOver:
      "ক্রেডিট শেষ হয়ে গেছে। অ্যাডমিনের সঙ্গে যোগাযোগ করুন।",

    imageProcessingFailed:
      "মেডিকেল ছবিটি প্রসেস করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",

    saveSuccess:
      "দৈনন্দিন যত্নের রিডিং সফলভাবে সংরক্ষণ করা হয়েছে।",

    saveFailed:
      "দৈনন্দিন যত্নের রিডিং সংরক্ষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
  },

  reports: {
    dailyCareReport:
      "দৈনন্দিন যত্ন রিপোর্ট",

    patientSummary:
      "রোগীর সারাংশ",

    recordedOn:
      "রেকর্ড করার সময়",

    vitalSigns:
      "গুরুত্বপূর্ণ স্বাস্থ্য রিডিং",

    bloodPressure:
      "রক্তচাপ",

    pulse:
      "পালস",
  },
dashboard: {

  title:
    "ড্যাশবোর্ড",

  dailyCareSection:
    "দৈনিক যত্ন",

  dailyCare:
    "দৈনিক যত্ন",

  helpCentre:
    "সহায়তা কেন্দ্র",

  assessmentSection:
    "স্বাস্থ্য মূল্যায়ন",

  familyAssessment:
    "পরিবারের স্বাস্থ্য মূল্যায়ন",

  selfAssessment:
    "নিজের স্বাস্থ্য মূল্যায়ন",

  patientManagement:
    "রোগী ব্যবস্থাপনা",

  addPatient:
    "রোগী যোগ করুন",

  reports:
    "রিপোর্ট",

  logout:
    "লগ আউট",

  loading:
    "ড্যাশবোর্ড লোড হচ্ছে...",

  createdBy:
    "সুরজ প্রেমনাথ দ্বারা নির্মিত",

},

addPatient: {
  title: "রোগী যোগ করুন",
  loading: "লোড হচ্ছে...",

  fullName: "পুরো নাম",
  fullNamePlaceholder: "রোগীর পুরো নাম লিখুন",

  dateOfBirth: "জন্ম তারিখ",
  age: "বয়স",
  years: "বছর",

  gender: "লিঙ্গ",
  selectGender: "লিঙ্গ নির্বাচন করুন",
  male: "পুরুষ",
  female: "মহিলা",
  other: "অন্যান্য",
  preferNotToSay: "বলতে চাই না",

  relationship: "সম্পর্ক",
  selectRelationship: "সম্পর্ক নির্বাচন করুন",

  father: "বাবা",
  mother: "মা",
  spouse: "জীবনসঙ্গী",
  brother: "ভাই",
  sister: "বোন",
  son: "ছেলে",
  daughter: "মেয়ে",
  grandfather: "দাদু / নানু",
  grandmother: "দিদা / নানি",
  uncle: "কাকা / মামা",
  aunt: "কাকিমা / মাসি",
  friend: "বন্ধু",
  neighbour: "প্রতিবেশী",

  savingPatient: "রোগীর তথ্য সংরক্ষণ করা হচ্ছে...",
  savePatient: "রোগীর তথ্য সংরক্ষণ করুন",
  backToDashboard: "ড্যাশবোর্ডে ফিরে যান",

  createdBy: "সুরজ প্রেমনাথ দ্বারা নির্মিত",

  saveFailed: "রোগীর তথ্য সংরক্ষণ করা যায়নি।",
  saveSuccess: "রোগী সফলভাবে যোগ করা হয়েছে।",
  unexpectedError:
    "রোগীর তথ্য সংরক্ষণ করার সময় একটি সমস্যা হয়েছে।",
},

assessment: {
  tagline:
    "সহজ দৈনন্দিন যত্ন।\nআরও ভালো চিকিৎসা সংক্রান্ত আলোচনা।",

  selfAssessment:
    "নিজের স্বাস্থ্য মূল্যায়ন",

  familyAssessment:
    "পরিবারের স্বাস্থ্য মূল্যায়ন",

  page:
    "পৃষ্ঠা",

  of:
    "এর মধ্যে",

  healthCheckToday:
    "আজকের স্বাস্থ্য পরীক্ষা",

  feelFeverish:
    "আজ কি আপনার জ্বর জ্বর লাগছে?",

  temperatureTaken:
    "আপনার তাপমাত্রা কি মাপা হয়েছে?",

  latestTemperature:
    "সর্বশেষ তাপমাত্রার রিডিং",

  temperaturePlaceholder:
    "উদাহরণ: 101.4",

  energyToday:
    "আজ আপনার শক্তির মাত্রা কেমন?",

  good:
    "ভালো",

  tired:
    "ক্লান্ত",

  veryTired:
    "খুব ক্লান্ত",

  previous:
    "আগেরটি",

  next:
    "পরবর্তী",

  alertFever:
    "আপনার জ্বর জ্বর লাগছে কি না তা অনুগ্রহ করে জানান।",

  alertTemperatureTaken:
    "তাপমাত্রা মাপা হয়েছে কি না তা অনুগ্রহ করে জানান।",

  alertTemperatureReading:
    "অনুগ্রহ করে তাপমাত্রার রিডিং লিখুন।",

  alertEnergy:
    "অনুগ্রহ করে আপনার শক্তির মাত্রা নির্বাচন করুন।",

appetiteToday:
  "আজ আপনার ক্ষুধা কেমন?",

appetiteNormal:
  "স্বাভাবিক",

appetiteLess:
  "কম খাচ্ছি",

appetitePoor:
  "খুব কম খাচ্ছি",

drinkingEnoughWater:
  "আপনি কি পর্যাপ্ত পানি পান করছেন?",

notSure:
  "নিশ্চিত নই",

waterIntake:
  "পানি পান করার পরিমাণ",

alertAllQuestions:
  "অনুগ্রহ করে সব প্রশ্নের উত্তর দিন।",

alertWaterIntake:
  "অনুগ্রহ করে পানি পান করার পরিমাণ নির্বাচন করুন।",

discomfortToday:
  "আজ কি আপনার কোনো ব্যথা বা অস্বস্তি হয়েছে?",

discomfortWhere:
  "আপনার কোথায় ব্যথা বা অস্বস্তি হয়েছে?",

areaHead: "মাথা",
areaEyes: "চোখ",
areaEars: "কান",
areaNeck: "ঘাড়",
areaChest: "বুক",
areaBack: "পিঠ",
areaStomach: "পেট",
areaArmsHands: "বাহু / হাত",
areaLegsFeet: "পা / পায়ের পাতা",
areaJoints: "জয়েন্ট",
areaOther: "অন্যান্য",

describeDiscomfort:
  "ব্যথা বা অস্বস্তির বিবরণ দিন",

alertQuestion:
  "অনুগ্রহ করে প্রশ্নটির উত্তর দিন।",

alertDiscomfortAreas:
  "অনুগ্রহ করে ব্যথা বা অস্বস্তির স্থানগুলি নির্বাচন করুন।",

alertSpecifyDiscomfort:
  "অনুগ্রহ করে ব্যথা বা অস্বস্তির বিবরণ দিন।",

walkingToday:
  "আজ আপনি হাঁটতে পারছেন কি?",

walkingEasily:
  "সহজে",

walkingSomeDifficulty:
  "কিছুটা অসুবিধার সঙ্গে",

walkingVeryDifficult:
  "খুব অসুবিধা হচ্ছে",

needHelpWalking:
  "হাঁটার জন্য সাহায্য দরকার কি?",

looseMotionsToday:
  "আজ কি পাতলা পায়খানা হয়েছে?",

looseMotionType:
  "কী ধরনের?",

looseMotionWatery:
  "পানির মতো",

looseMotionSticky:
  "আঠালো",

finishAssessment:
  "মূল্যায়ন সম্পূর্ণ করুন",

alertWalkingHelp:
  "হাঁটার জন্য সাহায্য দরকার কি না অনুগ্রহ করে জানান।",

alertLooseMotionType:
  "অনুগ্রহ করে পাতলা পায়খানার ধরন নির্বাচন করুন।",

assessmentDetails:
  "মূল্যায়নের বিবরণ",

yourName:
  "আপনার নাম",

enterYourName:
  "আপনার নাম লিখুন",

yourAge:
  "আপনার বয়স",

enterYourAge:
  "আপনার বয়স লিখুন",

startAssessment:
  "মূল্যায়ন শুরু করুন",

alertNameAndAge:
  "অনুগ্রহ করে নাম এবং বয়স লিখুন",

selectPatientToBegin:
  "মূল্যায়ন শুরু করতে একজন রোগী নির্বাচন করুন।",

noPatientsFound:
  "কোনো রোগী পাওয়া যায়নি। অনুগ্রহ করে প্রথমে একজন রোগী যোগ করুন।",

selectPatient:
  "রোগী নির্বাচন করুন",

name:
  "নাম",

age:
  "বয়স",

gender:
  "লিঙ্গ",

relationship:
  "সম্পর্ক",

addNewPatient:
  "নতুন রোগী যোগ করুন",

backToDashboard:
  "ড্যাশবোর্ডে ফিরে যান",

unableToContinue:
  "এগিয়ে যাওয়া সম্ভব নয়",

profileLoadError:
  "আপনার প্রোফাইল লোড করা যায়নি। অনুগ্রহ করে আবার সাইন ইন করুন।",

patientLoadError:
  "রোগীদের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",

pageLoadError:
  "এই পৃষ্ঠাটি লোড করার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।",

breathingToday:
  "আজ রোগীর শ্বাসপ্রশ্বাস কেমন ছিল?",

breathingNormal:
  "স্বাভাবিক",

breathingSlightlyDifficult:
  "সামান্য কষ্ট",

breathingVeryDifficult:
  "খুব কষ্ট",

coughingToday:
  "আজ রোগীর কি কাশি ছিল?",

coughSometimes:
  "মাঝে মাঝে",

coughFrequently:
  "ঘন ঘন",

bloodWhileCoughing:
  "কাশির সময় কি রক্ত দেখা গেছে?",

alertBloodInCough:
  "কাশির সময় রক্ত দেখা গেছে কি না অনুগ্রহ করে জানান.",

patientFeverishToday:
  "আজ রোগীর কি জ্বর জ্বর মনে হচ্ছিল?",

temperatureMeasured:
  "তাপমাত্রা কি মাপা হয়েছিল?",

enterLatestTemperature:
  "সর্বশেষ তাপমাত্রা লিখুন",

patientEnergyToday:
  "আজ রোগীকে কতটা সক্রিয় মনে হয়েছে?",

energyActive:
  "সক্রিয়",

energyLessActive:
  "কম সক্রিয়",

energyVeryWeak:
  "খুব দুর্বল",

alertTemperatureMeasured:
  "তাপমাত্রা মাপা হয়েছিল কি না অনুগ্রহ করে জানান।",

patientEatingToday:
  "আজ রোগীর খাওয়া কেমন ছিল?",

patientDrinkingEnoughWater:
  "রোগী কি আজ পর্যাপ্ত পানি পান করেছেন?",

patientWaterGlasses:
  "রোগী আনুমানিক কত গ্লাস পানি পান করেছেন?",

oneGlass:
  "১ গ্লাস",

twoGlasses:
  "২ গ্লাস",

threeGlasses:
  "৩ গ্লাস",

fourGlasses:
  "৪ গ্লাস",

fivePlusGlasses:
  "৫+ গ্লাস",

patientDiscomfortToday:
  "রোগীর কি আজ কোনো অস্বস্তি হয়েছে?",

patientDiscomfortWhere:
  "রোগীর কোথায় অস্বস্তি হয়েছে?",

areaArms:
  "হাত",

areaLegs:
  "পা",

alertPatientDiscomfortAreas:
  "রোগীর কোথায় অস্বস্তি হয়েছে তা নির্বাচন করুন।",

alertOtherDiscomfortArea:
  "অনুগ্রহ করে অস্বস্তির অন্য স্থানটি উল্লেখ করুন।",

patientWalkingToday:
  "আজ রোগীর হাঁটাচলা কেমন ছিল?",

walkedEasily:
  "সহজে হেঁটেছেন",

patientNeedHelpWalking:
  "রোগীর কি হাঁটার জন্য সাহায্যের প্রয়োজন হয়েছিল?",

alertWalkingHelpNeeded:
  "হাঁটার জন্য সাহায্যের প্রয়োজন হয়েছিল কি না তা জানান।",

looseMotionsObserved:
  "পাতলা পায়খানা হয়েছিল কি?",

looseMotionTypeObserved:
  "কী ধরনের পাতলা পায়খানা হয়েছিল?",

patientConfusedToday:
  "রোগীকে কি আজ অস্বাভাবিকভাবে বিভ্রান্ত মনে হয়েছে?",

},

};
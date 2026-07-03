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

};
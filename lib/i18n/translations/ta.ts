import type {
  TranslationDictionary,
} from "../types";

export const ta: TranslationDictionary = {

  common: {
    save: "சேமிக்கவும்",
    cancel: "ரத்து செய்யவும்",
    back: "திரும்பிச் செல்லவும்",
    loading: "ஏற்றப்படுகிறது...",
    yes: "ஆம்",
    no: "இல்லை",
    notRecorded: "பதிவு செய்யப்படவில்லை",
  },

  dailyCare: {
    title:
      "தினசரி பராமரிப்பு",

    patientInformation:
      "நோயாளியின் தகவல்கள்",

    patient:
      "நோயாளி",

    date:
      "தேதி",

    time:
      "நேரம்",

    readingMethodQuestion:
      "இன்றைய அளவீடுகளை எவ்வாறு பதிவு செய்ய விரும்புகிறீர்கள்?",

    uploadPhoto:
      "புகைப்படத்தை பதிவேற்றவும்",

    enterManually:
      "நீங்களே பதிவு செய்யவும்",

    captureMedicalReadings:
      "மருத்துவ அளவீடுகளை புகைப்படம் எடுக்கவும்",

    captureHelp:
      "உங்கள் மருத்துவ சாதனத்தின் அளவீடுகள் தெளிவாகத் தெரியும் வகையில் புகைப்படம் எடுக்கவும் அல்லது ஒரு புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.",

    takeOrSelectImage:
      "புகைப்படம் எடுக்கவும் அல்லது தேர்ந்தெடுக்கவும்",

    readingImage:
      "புகைப்படம் படிக்கப்படுகிறது...",

    temperature:
      "உடல் வெப்பநிலை",

    unit:
      "அலகு",

    enterTemperature:
      "வெப்பநிலையை பதிவு செய்யவும்",

    additionalVitals:
      "கூடுதல் முக்கிய உடல்நல அளவீடுகள்",

    bloodPressure:
      "இரத்த அழுத்தம்",

    systolic:
      "மேல் அளவு (சிஸ்டாலிக்)",

    diastolic:
      "கீழ் அளவு (டயஸ்டாலிக்)",

    pulseRate:
      "நாடித் துடிப்பு",

    spo2:
      "SpO₂",

    symptoms:
      "அறிகுறிகள்",

    painLocation:
      "வலி உள்ள இடம்",

painHead: "தலை",
painNeck: "கழுத்து",
painChest: "மார்பு",
painAbdomen: "வயிறு",
painBack: "முதுகு",
painShoulder: "தோள்",
painArm: "கை",
painThigh: "தொடை",
painKnee: "முழங்கால்",
painCalf: "கெண்டைக்கால்",
painFeet: "பாதங்கள்",
painOther: "மற்றவை",

otherPainPlaceholder:
  "உதாரணம்: இடது தோள், வலது முழங்கை...",

    medications:
      "மருந்துகள்",

    notes:
      "குறிப்புகள்",

symptomFever:
  "காய்ச்சல்",

symptomWeakness:
  "பலவீனம்",

symptomBodyPain:
  "உடல் வலி",

symptomCough:
  "இருமல்",

symptomBloodInCough:
  "இருமலில் இரத்தம்",

symptomBreathlessness:
  "மூச்சுத் திணறல்",

symptomWalkingDifficulty:
  "நடப்பதில் சிரமம்",

symptomLossOfAppetite:
  "பசியின்மை",

symptomLooseMotions:
  "வயிற்றுப்போக்கு",

symptomVomiting:
  "வாந்தி",

symptomDryMouth:
  "வாய் வறட்சி",

symptomOther:
  "மற்றவை",

pleaseSpecify:
  "தயவுசெய்து விவரிக்கவும்",

otherSymptomPlaceholder:
  "உதாரணம்: தலைச்சுற்றல், குளிர் நடுக்கம், வீக்கம்...",

saving: "சேமிக்கப்படுகிறது...",
saveReading: "அளவீட்டைச் சேமிக்கவும்",
backToDashboard: "டாஷ்போர்டுக்கு திரும்பவும்",

recordingFor:
  "நீங்கள் யாருக்காக தினசரி பராமரிப்பைப் பதிவு செய்கிறீர்கள்?",

chooseOneOption:
  "தயவுசெய்து ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்.",

myself:
  "எனக்காக",

familyMember:
  "குடும்ப உறுப்பினர்",
  },

  alerts: {
    imageReadSuccess:
      "புகைப்படம் வெற்றிகரமாகப் படிக்கப்பட்டது. சேமிப்பதற்கு முன் பதிவு செய்யப்பட்ட அளவீடுகளைச் சரிபார்க்கவும்.",

    invalidMedicalImage:
      "தயவுசெய்து தெர்மாமீட்டர், இரத்த அழுத்த மானிட்டர் அல்லது பல்ஸ் ஆக்சிமீட்டர் திரை தெளிவாகத் தெரியும் புகைப்படத்தை பதிவேற்றவும்.",

    multipleReadings:
      "புகைப்படத்தில் ஒன்றுக்கு மேற்பட்ட வெவ்வேறு அளவீடுகள் கண்டறியப்பட்டுள்ளன. சமீபத்திய அளவீடு மட்டும் தெரியும் புகைப்படத்தை பதிவேற்றவும்.",

    creditsOver:
      "கிரெடிட்கள் முடிந்துவிட்டன. நிர்வாகியை தொடர்பு கொள்ளவும்.",

    imageProcessingFailed:
      "மருத்துவ புகைப்படத்தை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",

    saveSuccess:
      "தினசரி பராமரிப்பு அளவீடு வெற்றிகரமாக சேமிக்கப்பட்டது.",

    saveFailed:
      "தினசரி பராமரிப்பு அளவீட்டை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  },

  reports: {
    dailyCareReport:
      "தினசரி பராமரிப்பு அறிக்கை",

    patientSummary:
      "நோயாளியின் சுருக்கம்",

    recordedOn:
      "பதிவு செய்யப்பட்ட நேரம்",

    vitalSigns:
      "முக்கிய உடல்நல அளவீடுகள்",

    bloodPressure:
      "இரத்த அழுத்தம்",

    pulse:
      "நாடித் துடிப்பு",
  },
dashboard: {

  title:
    "டாஷ்போர்டு",

  dailyCareSection:
    "தினசரி பராமரிப்பு",

  dailyCare:
    "தினசரி பராமரிப்பு",

  helpCentre:
    "உதவி மையம்",

  assessmentSection:
    "உடல்நல மதிப்பீடு",

  familyAssessment:
    "குடும்ப உடல்நல மதிப்பீடு",

  selfAssessment:
    "சுய உடல்நல மதிப்பீடு",

  patientManagement:
    "நோயாளி மேலாண்மை",

  addPatient:
    "நோயாளியைச் சேர்க்கவும்",

  reports:
    "அறிக்கைகள்",

  logout:
    "வெளியேறு",

  loading:
    "டாஷ்போர்டு ஏற்றப்படுகிறது...",

  createdBy:
    "சூரஜ் பிரேம்நாத் உருவாக்கியது",

},

addPatient: {
  title: "நோயாளியைச் சேர்க்கவும்",
  loading: "ஏற்றப்படுகிறது...",

  fullName: "முழுப் பெயர்",
  fullNamePlaceholder: "நோயாளியின் முழுப் பெயரை உள்ளிடவும்",

  dateOfBirth: "பிறந்த தேதி",
  age: "வயது",
  years: "ஆண்டுகள்",

  gender: "பாலினம்",
  selectGender: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
  male: "ஆண்",
  female: "பெண்",
  other: "மற்றவை",
  preferNotToSay: "கூற விரும்பவில்லை",

  relationship: "உறவு",
  selectRelationship: "உறவைத் தேர்ந்தெடுக்கவும்",

  father: "தந்தை",
  mother: "தாய்",
  spouse: "வாழ்க்கைத் துணை",
  brother: "சகோதரர்",
  sister: "சகோதரி",
  son: "மகன்",
  daughter: "மகள்",
  grandfather: "தாத்தா",
  grandmother: "பாட்டி",
  uncle: "மாமா / சித்தப்பா",
  aunt: "அத்தை / சித்தி",
  friend: "நண்பர்",
  neighbour: "அயல்வாசி",

  savingPatient: "நோயாளியின் தகவல்கள் சேமிக்கப்படுகின்றன...",
  savePatient: "நோயாளியைச் சேமிக்கவும்",
  backToDashboard: "டாஷ்போர்டுக்கு திரும்பவும்",

  createdBy: "சூரஜ் பிரேம்நாத் உருவாக்கியது",

  saveFailed: "நோயாளியின் தகவல்களைச் சேமிக்க முடியவில்லை.",
  saveSuccess: "நோயாளி வெற்றிகரமாகச் சேர்க்கப்பட்டார்.",
  unexpectedError:
    "நோயாளியின் தகவல்களைச் சேமிக்கும் போது சிக்கல் ஏற்பட்டது.",
},

assessment: {
  tagline:
    "எளிய தினசரி பராமரிப்பு.\nசிறந்த மருத்துவ உரையாடல்கள்.",

  selfAssessment:
    "சுய உடல்நல மதிப்பீடு",

  familyAssessment:
    "குடும்ப உடல்நல மதிப்பீடு",

  page:
    "பக்கம்",

  of:
    "இல்",

  healthCheckToday:
    "இன்றைய உடல்நல பரிசோதனை",

  feelFeverish:
    "இன்று உங்களுக்கு காய்ச்சல் இருப்பது போல் உணர்கிறீர்களா?",

  temperatureTaken:
    "உங்கள் உடல் வெப்பநிலை அளவிடப்பட்டதா?",

  latestTemperature:
    "சமீபத்திய வெப்பநிலை அளவீடு",

  temperaturePlaceholder:
    "உதாரணம்: 101.4",

  energyToday:
    "இன்று உங்கள் ஆற்றல் நிலை எப்படி உள்ளது?",

  good:
    "நன்றாக உள்ளது",

  tired:
    "சோர்வாக உள்ளது",

  veryTired:
    "மிகவும் சோர்வாக உள்ளது",

  previous:
    "முந்தையது",

  next:
    "அடுத்தது",

  alertFever:
    "உங்களுக்கு காய்ச்சல் இருப்பது போல் உணர்கிறீர்களா என்பதைத் தெரிவிக்கவும்.",

  alertTemperatureTaken:
    "உடல் வெப்பநிலை அளவிடப்பட்டதா என்பதைத் தெரிவிக்கவும்.",

  alertTemperatureReading:
    "தயவுசெய்து வெப்பநிலை அளவீட்டை உள்ளிடவும்.",

  alertEnergy:
    "தயவுசெய்து உங்கள் ஆற்றல் நிலையைத் தேர்ந்தெடுக்கவும்.",

appetiteToday:
  "இன்று உங்கள் பசி எப்படி உள்ளது?",

appetiteNormal:
  "வழக்கமாக உள்ளது",

appetiteLess:
  "குறைவாக சாப்பிடுகிறேன்",

appetitePoor:
  "மிகக் குறைவாக சாப்பிடுகிறேன்",

drinkingEnoughWater:
  "நீங்கள் போதுமான அளவு தண்ணீர் குடிக்கிறீர்களா?",

notSure:
  "உறுதியாகத் தெரியவில்லை",

waterIntake:
  "தண்ணீர் குடிக்கும் அளவு",

alertAllQuestions:
  "தயவுசெய்து அனைத்து கேள்விகளுக்கும் பதிலளிக்கவும்.",

alertWaterIntake:
  "தயவுசெய்து தண்ணீர் குடிக்கும் அளவைத் தேர்ந்தெடுக்கவும்.",

discomfortToday:
  "இன்று உங்களுக்கு ஏதேனும் வலி அல்லது அசௌகரியம் ஏற்பட்டதா?",

discomfortWhere:
  "உங்களுக்கு வலி அல்லது அசௌகரியம் எங்கு ஏற்பட்டது?",

areaHead: "தலை",
areaEyes: "கண்கள்",
areaEars: "காதுகள்",
areaNeck: "கழுத்து",
areaChest: "மார்பு",
areaBack: "முதுகு",
areaStomach: "வயிறு",
areaArmsHands: "கைகள்",
areaLegsFeet: "கால்கள் / பாதங்கள்",
areaJoints: "மூட்டுகள்",
areaOther: "மற்றவை",

describeDiscomfort:
  "வலி அல்லது அசௌகரியத்தை விவரிக்கவும்",

alertQuestion:
  "தயவுசெய்து கேள்விக்கு பதிலளிக்கவும்.",

alertDiscomfortAreas:
  "தயவுசெய்து வலி அல்லது அசௌகரியம் ஏற்பட்ட இடங்களைத் தேர்ந்தெடுக்கவும்.",

alertSpecifyDiscomfort:
  "தயவுசெய்து வலி அல்லது அசௌகரியத்தை விவரிக்கவும்.",

walkingToday:
  "இன்று உங்களால் நடக்க முடிகிறதா?",

walkingEasily:
  "எளிதாக",

walkingSomeDifficulty:
  "சிறிது சிரமத்துடன்",

walkingVeryDifficult:
  "மிகவும் சிரமமாக உள்ளது",

needHelpWalking:
  "நடக்க உதவி தேவையா?",

looseMotionsToday:
  "இன்று வயிற்றுப்போக்கு ஏற்பட்டதா?",

looseMotionType:
  "எந்த வகை?",

looseMotionWatery:
  "தண்ணீர் போன்று",

looseMotionSticky:
  "பிசுபிசுப்பாக",

finishAssessment:
  "மதிப்பீட்டை முடிக்கவும்",

alertWalkingHelp:
  "நடக்க உதவி தேவையா என்பதைத் தெரிவிக்கவும்.",

alertLooseMotionType:
  "தயவுசெய்து வயிற்றுப்போக்கின் வகையைத் தேர்ந்தெடுக்கவும்.",

assessmentDetails:
  "மதிப்பீட்டு விவரங்கள்",

yourName:
  "உங்கள் பெயர்",

enterYourName:
  "உங்கள் பெயரை உள்ளிடவும்",

yourAge:
  "உங்கள் வயது",

enterYourAge:
  "உங்கள் வயதை உள்ளிடவும்",

startAssessment:
  "மதிப்பீட்டைத் தொடங்கவும்",

alertNameAndAge:
  "தயவுசெய்து பெயர் மற்றும் வயதை உள்ளிடவும்",

},

};
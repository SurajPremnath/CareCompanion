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

takePhoto: "புகைப்படம் எடுக்கவும்",
chooseExistingPhoto: "ஏற்கனவே உள்ள புகைப்படத்தைத் தேர்ந்தெடுக்கவும்",
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

home:
    "முகப்பு",

whatWouldYouLikeToDo:
    "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",

recordHealth:
    "உடல்நல தகவலை பதிவு செய்யுங்கள்",

recordHealthDescription:
    "உங்களுடைய அல்லது குடும்ப உறுப்பினரின் உடல்நல தகவலை பதிவு செய்யுங்கள்",

viewHealth:
    "உடல்நல தகவலைப் பாருங்கள்",

viewHealthDescription:
    "உடல்நல காலவரிசை, அறிக்கைகள் மற்றும் போக்குகளைப் பாருங்கள்",

helpAndFaqs:
    "உதவி மற்றும் பொதுவான கேள்விகள்",

helpAndFaqsDescription:
    "CareVR-ஐ பயன்படுத்துவது எப்படி என்பதை அறிந்து பதில்களைப் பெறுங்கள்",

backToHome:
    "முகப்புக்குத் திரும்பு",

healthCheckAssessment:
    "உடல்நல பரிசோதனை மதிப்பீடு",

healthHistory:
    "உடல்நல வரலாறு",

medicationManagement:
    "மருந்து மேலாண்மை",
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

selectPatientToBegin:
  "மதிப்பீட்டைத் தொடங்க ஒரு நோயாளியைத் தேர்ந்தெடுக்கவும்.",

noPatientsFound:
  "நோயாளிகள் எவரும் கிடைக்கவில்லை. தயவுசெய்து முதலில் ஒரு நோயாளியைச் சேர்க்கவும்.",

selectPatient:
  "நோயாளியைத் தேர்ந்தெடுக்கவும்",

name:
  "பெயர்",

age:
  "வயது",

gender:
  "பாலினம்",

relationship:
  "உறவு",

addNewPatient:
  "புதிய நோயாளியைச் சேர்க்கவும்",

backToDashboard:
  "டாஷ்போர்டுக்கு திரும்பவும்",

unableToContinue:
  "தொடர முடியவில்லை",

profileLoadError:
  "உங்கள் சுயவிவரத்தை ஏற்ற முடியவில்லை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",

patientLoadError:
  "நோயாளிகளின் தகவல்களை ஏற்ற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",

pageLoadError:
  "இந்தப் பக்கத்தை ஏற்றும்போது சிக்கல் ஏற்பட்டது. தயவுசெய்து பக்கத்தைப் புதுப்பித்து மீண்டும் முயற்சிக்கவும்.",

breathingToday:
  "இன்று நோயாளியின் சுவாசம் எப்படி இருந்தது?",

breathingNormal:
  "இயல்பாக இருந்தது",

breathingSlightlyDifficult:
  "சிறிது சிரமமாக இருந்தது",

breathingVeryDifficult:
  "மிகவும் சிரமமாக இருந்தது",

coughingToday:
  "இன்று நோயாளிக்கு இருமல் இருந்ததா?",

coughSometimes:
  "சில நேரங்களில்",

coughFrequently:
  "அடிக்கடி",

bloodWhileCoughing:
  "இருமும்போது இரத்தம் காணப்பட்டதா?",

alertBloodInCough:
  "இருமும்போது இரத்தம் காணப்பட்டதா என்பதைத் தெரிவிக்கவும்.",

patientFeverishToday:
  "இன்று நோயாளிக்கு காய்ச்சல் இருப்பது போல் தோன்றியதா?",

temperatureMeasured:
  "உடல் வெப்பநிலை அளவிடப்பட்டதா?",

enterLatestTemperature:
  "சமீபத்திய வெப்பநிலையை உள்ளிடவும்",

patientEnergyToday:
  "இன்று நோயாளி எந்த அளவிற்கு சுறுசுறுப்பாக இருந்தார்?",

energyActive:
  "சுறுசுறுப்பாக",

energyLessActive:
  "குறைவான சுறுசுறுப்பு",

energyVeryWeak:
  "மிகவும் பலவீனமாக",

alertTemperatureMeasured:
  "உடல் வெப்பநிலை அளவிடப்பட்டதா என்பதைத் தெரிவிக்கவும்.",

patientEatingToday:
  "இன்று நோயாளியின் உணவு உட்கொள்ளல் எப்படி இருந்தது?",

patientDrinkingEnoughWater:
  "நோயாளி இன்று போதுமான அளவு தண்ணீர் குடித்தாரா?",

patientWaterGlasses:
  "நோயாளி தோராயமாக எத்தனை டம்ளர் தண்ணீர் குடித்தார்?",

oneGlass:
  "1 டம்ளர்",

twoGlasses:
  "2 டம்ளர்கள்",

threeGlasses:
  "3 டம்ளர்கள்",

fourGlasses:
  "4 டம்ளர்கள்",

fivePlusGlasses:
  "5+ டம்ளர்கள்",

patientDiscomfortToday:
  "நோயாளிக்கு இன்று ஏதேனும் அசௌகரியம் ஏற்பட்டதா?",

patientDiscomfortWhere:
  "நோயாளிக்கு எங்கு அசௌகரியம் ஏற்பட்டது?",

areaArms:
  "கைகள்",

areaLegs:
  "கால்கள்",

alertPatientDiscomfortAreas:
  "நோயாளிக்கு எங்கு அசௌகரியம் ஏற்பட்டது என்பதைத் தேர்ந்தெடுக்கவும்.",

alertOtherDiscomfortArea:
  "மற்ற அசௌகரியம் ஏற்பட்ட பகுதியைக் குறிப்பிடவும்.",

patientWalkingToday:
  "இன்று நோயாளியின் நடை எப்படி இருந்தது?",

walkedEasily:
  "எளிதாக நடந்தார்",

patientNeedHelpWalking:
  "நோயாளிக்கு நடக்க உதவி தேவைப்பட்டதா?",

alertWalkingHelpNeeded:
  "நடக்க உதவி தேவைப்பட்டதா என்பதைத் தெரிவிக்கவும்.",

looseMotionsObserved:
  "வயிற்றுப்போக்கு காணப்பட்டதா?",

looseMotionTypeObserved:
  "எந்த வகையான வயிற்றுப்போக்கு காணப்பட்டது?",

patientConfusedToday:
  "நோயாளி இன்று வழக்கத்திற்கு மாறாக குழப்பமாகத் தோன்றினாரா?",

},

medication: {

    //--------------------------------------------------
    // General
    //--------------------------------------------------

    title:
        "மருந்து மேலாண்மை",

    addPrescription:
        "மருத்துவ பரிந்துரையைச் சேர்க்கவும்",

    viewPrescriptions:
        "சேமிக்கப்பட்ட மருத்துவ பரிந்துரைகளைப் பார்க்கவும்",

    prescriptionDetails:
        "மருத்துவ பரிந்துரை விவரங்கள்",

    reviewPrescription:
        "மருத்துவ பரிந்துரையை மதிப்பாய்வு செய்யவும்",

    //--------------------------------------------------
    // Upload
    //--------------------------------------------------

    takePhoto:
        "புகைப்படம் எடுக்கவும்",

    choosePhotos:
        "புகைப்படங்களைத் தேர்ந்தெடுக்கவும்",

    uploadPdf:
        "PDF பதிவேற்றவும்",

    readPrescription:
        "மருத்துவ பரிந்துரையைப் படிக்கவும்",

    readingPrescription:
        "மருத்துவ பரிந்துரை படிக்கப்படுகிறது...",

    preparingPrescription:
        "மருத்துவ பரிந்துரை தயாராகிறது...",

    prescriptionReadSuccess:
        "மருத்துவ பரிந்துரை வெற்றிகரமாகப் படிக்கப்பட்டது.",

    //--------------------------------------------------
    // Consultation
    //--------------------------------------------------

    consultationDate:
        "ஆலோசனை தேதி",

    consultationMode:
        "ஆலோசனை வகை",

    doctor:
        "மருத்துவர்",

    hospital:
        "மருத்துவமனை / கிளினிக்",

    diagnosisAssessment:
        "நோயறிதல் / மதிப்பீடு",

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    medicines:
        "மருந்துகள்",

    medicine:
        "மருந்து",

    dosage:
        "அளவு",

    frequency:
        "அடிக்கடி",

    duration:
        "கால அளவு",

    instructions:
        "வழிமுறைகள்",

    //--------------------------------------------------
    // Actions
    //--------------------------------------------------

    savePrescription:
        "உறுதிப்படுத்தி சேமிக்கவும்",

    savingPrescription:
        "சேமிக்கப்படுகிறது...",

    reupload:
        "மருத்துவ பரிந்துரையை மீண்டும் பதிவேற்றவும்",

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    consultationDateRequired:
        "ஆலோசனை தேதி அவசியம்.",

    consultationDateFuture:
        "ஆலோசனை தேதி எதிர்கால தேதியாக இருக்கக்கூடாது.",

    consultationDateInvalid:
        "தவறான ஆலோசனை தேதி.",

    consultationTypeRequired:
        "தயவுசெய்து ஆலோசனை வகையைத் தேர்ந்தெடுக்கவும்.",

    patientRequired:
        "தயவுசெய்து நோயாளியைத் தேர்ந்தெடுக்கவும்.",

    patientMismatch:
        "இந்த மருத்துவ பரிந்துரை வேறு நோயாளிக்குச் சொந்தமானதாகத் தெரிகிறது.",

    //--------------------------------------------------
    // Warnings
    //--------------------------------------------------

    warningTitle:
        "எச்சரிக்கைகளுடன் மதிப்பாய்வு முடிந்தது",

    doctorNotDetected:
        "மருத்துவரின் பெயர் கண்டறியப்படவில்லை.",

    hospitalNotDetected:
        "மருத்துவமனை அல்லது கிளினிக் பெயர் கண்டறியப்படவில்லை.",

    diagnosisNotDetected:
        "நோயறிதல் அல்லது மதிப்பீடு கண்டறியப்படவில்லை.",

    medicinesNotDetected:
        "எந்த மருந்துகளும் கண்டறியப்படவில்லை.",

    warningContinue:
        "தகவல் சரியாக இருந்தால் இந்த மருத்துவ பரிந்துரையை சேமிக்கலாம்.",

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    saveSuccess:
        "மருத்துவ பரிந்துரை வெற்றிகரமாக சேமிக்கப்பட்டது.",

    saveFailed:
        "மருத்துவ பரிந்துரையை சேமிக்க முடியவில்லை.",

    selectPrescription:
        "தயவுசெய்து ஒரு மருத்துவ பரிந்துரையைத் தேர்ந்தெடுக்கவும்.",

    readFailed:
        "மருத்துவ பரிந்துரையைப் படிக்க முடியவில்லை.",

    processingFailed:
        "மருத்துவ பரிந்துரையை செயலாக்க முடியவில்லை.",

    patientMismatchTitle:
        "மருத்துவ பரிந்துரை வேறு நோயாளிக்குச் சொந்தமானது",

    patient:
        "நோயாளர்",

    patientDetails:
        "நோயாளர் விவரங்கள்",

    patientSymptoms:
        "நோயாளர் அறிகுறிகள்",

    assessment:
        "மதிப்பீடு",

    additionalDiagnoses:
        "கூடுதல் நோயறிதல்கள்",

    examinationFindings:
        "பரிசோதனை முடிவுகள்",

    relevantMedicalHistory:
        "தொடர்புடைய மருத்துவ வரலாறு",

    lifestyle:
        "வாழ்க்கை முறை",

    consultationVitals:
        "ஆலோசனை உயிரியல் அளவுகள்",

    investigationsOrdered:
        "பரிந்துரைக்கப்பட்ட பரிசோதனைகள்",

    careInstructions:
        "பராமரிப்பு வழிமுறைகள்",

    otherNotes:
        "பிற குறிப்புகள்",

    medicationsPrescribed:
        "பரிந்துரைக்கப்பட்ட மருந்துகள்",

    importantAdministrationTiming:
        "முக்கியம்: மருந்து எடுத்துக்கொள்ளும் நேரம்",

    administrationTimingInfo1:
        "மருந்தை உணவுக்கு முன், பின், உணவுடன் அல்லது வேறு நேரத்தில் எடுத்துக்கொள்ள வேண்டுமா என்பதை CareVR தானாக ஊகிக்காது.",

    administrationTimingInfo2:
        "சரியான மருந்து எடுத்துக்கொள்ளும் நேரத்தை மருத்துவரிடம் உறுதிப்படுத்திய பிறகே தேர்வு செய்யவும்.",

    administrationTimingInfo3:
        "நேரம் இன்னும் உறுதிப்படுத்தப்படவில்லை என்றால் 'குறிப்பிடப்படவில்லை' என்று விட்டு பின்னர் புதுப்பிக்கவும்.",

    noMedicinesDetected:
        "எந்த மருந்துகளையும் அடையாளம் காண முடியவில்லை.",

    aiExtractedDate:
        "AI கண்டறிந்த தேதி",

    consultationDateHelp:
        "தேதி தவறாக இருந்தால் சரியான ஆலோசனை தேதியைத் தேர்ந்தெடுக்கவும்.",

    weight:
        "எடை",

    bloodPressure:
        "இரத்த அழுத்தம்",

    pulse:
        "நாடித்துடிப்பு",

    temperature:
        "வெப்பநிலை",

    spo2:
        "SpO₂",

    strength:
        "வலிமை",

    dose:
        "அளவு",

    administrationTiming:
        "மருந்து எடுத்துக்கொள்ளும் நேரம்",

    //--------------------------------------------------
    // Administration Timing
    //--------------------------------------------------

    notSpecified:
        "குறிப்பிடப்படவில்லை",

    beforeFood:
        "உணவுக்கு முன்",

    afterFood:
        "உணவுக்குப் பின்",

    withFood:
        "உணவுடன்",

    emptyStomach:
        "வெறும் வயிற்றில்",

    beforeBreakfast:
        "காலை உணவுக்கு முன்",

    afterBreakfast:
        "காலை உணவுக்குப் பின்",

    beforeLunch:
        "மதிய உணவுக்கு முன்",

    afterLunch:
        "மதிய உணவுக்குப் பின்",

    beforeDinner:
        "இரவு உணவுக்கு முன்",

    afterDinner:
        "இரவு உணவுக்குப் பின்",

    atBedtime:
        "தூங்குவதற்கு முன்",

    asDirected:
        "மருத்துவர் கூறியபடி",

whatWouldYouLikeToDo:
    "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",

modeOfConsultation:
    "ஆலோசனை வகை",

howWouldYouLikeToAddPrescription:
    "மருத்துவ பரிந்துரையை எவ்வாறு சேர்க்க விரும்புகிறீர்கள்?",

forBestResults:
    "சிறந்த முடிவுகளுக்காக",

supportedFormats:
    "ஆதரிக்கப்படும் வடிவங்கள்: JPG, JPEG மற்றும் PNG",

useClearImages:
    "தெளிவான மற்றும் நல்ல வெளிச்சமுள்ள படங்களைப் பயன்படுத்தவும்",

cropBackground:
    "தேவையற்ற பின்னணியை அகற்றவும்",

recommendedImageSize:
    "பரிந்துரைக்கப்பட்ட பட அளவு: 300 KB – 1 MB",

maximumImageSize:
    "ஒரு படத்திற்கு அதிகபட்ச அளவு: 2 MB",

howWasConsultationConducted:
    "ஆலோசனை எவ்வாறு நடைபெற்றது?",

inPerson:
    "நேரில்",

video:
    "வீடியோ",

phone:
    "தொலைபேசி",

homeVisit:
    "வீட்டு வருகை",

other:
    "மற்றவை",

howWouldYouLikeToRecordHealth:
    "உடல்நலத்தை எவ்வாறு பதிவு செய்ய விரும்புகிறீர்கள்?",

recordWithVoice:
    "குரல் மூலம் பதிவு செய்யவும்",

uploadReading:
    "அளவீட்டைப் பதிவேற்றவும்",

enterManually:
    "கைமுறையாக உள்ளிடவும்",

dailyCare:
    "தினசரி பராமரிப்பு",

assessmentsHistory:
    "மதிப்பீடுகள்",

clinicalTrends:
    "மருத்துவ போக்குகள்",

detailedTimeline:
    "விரிவான காலவரிசை",

pleaseSpecifyConsultationMode:
    "தயவுசெய்து ஆலோசனை வகையை குறிப்பிடவும்",

validationErrorsTitle:
    "சேமிப்பதற்கு முன் கீழே உள்ள பிழைகளைச் சரிசெய்யவும்",

patientBelongsTo:
    "இந்த மருத்துவ பரிந்துரை இந்த நோயாளிக்குச் சொந்தமானதாகத் தெரிகிறது",

currentlyAddingFor:
    "நீங்கள் தற்போது இந்த நோயாளிக்காக மருத்துவ பரிந்துரையைச் சேர்க்கிறீர்கள்",

chooseCorrectPatient:
    "சரியான மருத்துவ பரிந்துரையை மீண்டும் பதிவேற்றவும் அல்லது திரும்பிச் சென்று சரியான குடும்ப உறுப்பினரைத் தேர்ந்தெடுக்கவும்.",

reuploadPrescription:
    "மருத்துவ பரிந்துரையை மீண்டும் பதிவேற்றவும்",

whoIsThisFor:
    "இது யாருக்காக?",

//--------------------------------------------------
// Consultation Workspace
//--------------------------------------------------

consultationDetails:
    "ஆலோசனை விவரங்கள்",

consultationDetailsDescription:
    "உங்களுக்குத் தெரிந்த விவரங்களைச் சேர்க்கவும். விருப்பப் புலங்களை காலியாக விடலாம்.",

doctorName:
    "மருத்துவரின் பெயர்",

enterDoctorName:
    "மருத்துவரின் பெயரை உள்ளிடவும்",

hospitalOrClinic:
    "மருத்துவமனை / கிளினிக்",

enterHospitalOrClinic:
    "மருத்துவமனை அல்லது கிளினிக் பெயரை உள்ளிடவும்",

optional:
    "விருப்பமானது",

videoPlatform:
    "வீடியோ தளம்",

exampleVideoPlatform:
    "உதாரணம்: WhatsApp, Zoom",

consultationType:
    "ஆலோசனை வகை",

phoneConsultation:
    "தொலைபேசி ஆலோசனை",

doctorServiceDetails:
    "மருத்துவர் / சேவை விவரங்கள்",

enterDoctorServiceDetails:
    "மருத்துவர் அல்லது சேவை விவரங்களை உள்ளிடவும்",

consultationMethod:
    "ஆலோசனை முறை",

describeConsultationMethod:
    "ஆலோசனை முறையை விவரிக்கவும்",

consultationNotes:
    "குறிப்புகள்",

enterConsultationNotes:
    "ஆலோசனை குறிப்புகளைச் சேர்க்கவும்",

//--------------------------------------------------
// Prescription Review
//--------------------------------------------------

reviewNoteTitle:
    "சேமிப்பதற்கு முன் சரிபார்க்கவும்",

reviewNoteDescription:
    "கீழே உள்ள தகவல்கள் பதிவேற்றப்பட்ட மருந்துச் சீட்டிலிருந்து AI மூலம் எடுக்கப்பட்டவை. சேமிப்பதற்கு முன் அவற்றின் துல்லியத்தை உறுதிப்படுத்தவும்.",

reviewInstruction:
    "சேமிப்பதற்கு முன் ஒவ்வொரு பகுதிக்கும் சென்று எடுத்த தகவலைச் சரிபார்க்கவும்.",

//--------------------------------------------------
// Prescription Upload
//--------------------------------------------------

uploadFailed:
    "தேர்ந்தெடுக்கப்பட்ட மருந்துச் சீட்டு படங்களைப் பதிவேற்ற முடியவில்லை.",

filesTooLarge:
    "பின்வரும் கோப்புகள் அனுமதிக்கப்பட்ட அளவை மீறுகின்றன.",

recommendedUploadSize:
    "பரிந்துரைக்கப்படும் அளவு: ஒரு படத்திற்கு 300 KB – 1 MB.",

maximumUploadSize:
    "அதிகபட்ச அனுமதிக்கப்பட்ட அளவு: ஒரு படத்திற்கு 2 MB.",

cropBackgroundBeforeUpload:
    "பதிவேற்றுவதற்கு முன் தேவையற்ற பின்னணியை அகற்றவும்.",

reduceImageSize:
    "படத்தின் அளவைக் குறைத்து மீண்டும் முயற்சிக்கவும்.",

cameraUnavailable:
    "கேமராவை அணுக முடியவில்லை.",

readingFailed:
    "மருந்துச் சீட்டை படிக்க முடியவில்லை.",

savingFailed:
    "மருந்துச் சீட்டைச் சேமிக்க முடியவில்லை.",

prescriptionSaved:
    "மருந்துச் சீட்டு வெற்றிகரமாகச் சேமிக்கப்பட்டது.",

//--------------------------------------------------
// Additional UI Messages
//--------------------------------------------------

uploadFileTooLargeMessage:
    "தேர்ந்தெடுக்கப்பட்ட மருந்துச் சீட்டு படங்களைப் பதிவேற்ற முடியவில்லை.\n\n" +
    "பின்வரும் கோப்புகள் அனுமதிக்கப்பட்ட அளவை மீறுகின்றன:\n\n" +
    "{fileNames}\n\n" +
    "சிறந்த அனுபவத்திற்காக (குறிப்பாக iPhone-ல்):\n\n" +
    "• பரிந்துரைக்கப்படும் அளவு: ஒரு படத்திற்கு 300 KB - 1 MB\n" +
    "• அதிகபட்ச அனுமதிக்கப்பட்ட அளவு: ஒரு படத்திற்கு 2 MB\n" +
    "• பதிவேற்றுவதற்கு முன் தேவையற்ற பின்னணியை அகற்றவும்\n\n" +
    "படத்தின் அளவைக் குறைத்து மீண்டும் முயற்சிக்கவும்.",

pleaseRecordatleastOneObservation:
    "குறைந்தபட்சம் ஒரு உடல்நல பதிவையாவது உள்ளிடவும்.\n\n" +
    "• வெப்பநிலை\n" +
    "• எடை\n" +
    "• முக்கிய அறிகுறிகள் (Vitals)\n" +
    "• அறிகுறிகள்\n" +
    "• வலி உள்ள இடம்",

choosePhoto:
    "புகைப்படத்தைத் தேர்ந்தெடுக்கவும்",

currentlyAddingPrescriptionFor:
    "நீங்கள் தற்போது இந்த நோயாளிக்கான மருந்துச் சீட்டைச் சேர்த்து வருகிறீர்கள்",

capturePhoto:
    "புகைப்படம் எடுக்கவும்",

chooseCorrectPrescription:
    "சரியான மருந்துச் சீட்டை மீண்டும் பதிவேற்றவும் அல்லது திரும்பிச் சென்று சரியான குடும்ப உறுப்பினரைத் தேர்ந்தெடுக்கவும்.",

prescriptionReadError:
    "மருந்துச் சீட்டைப் படிக்கும் பிழை:",

pleaseSelectFamilyMember:
    "குடும்ப உறுப்பினரைத் தேர்ந்தெடுக்கவும்.",

manualCareSaveError:
    "கைமுறை உடல்நல பதிவு சேமிப்பு பிழை:",

clear:
    "அழி",

yourFamilyMember:
    "உங்கள் குடும்ப உறுப்பினர்",

uploadCareImageProcessingError:
    "பதிவேற்றப்பட்ட உடல்நலப் படத்தை செயலாக்கும் பிழை:",

uploadCareSaveError:
    "உடல்நல பதிவைச் சேமிக்கும் பிழை:",

useAnotherPhoto:
    "வேறு புகைப்படத்தைப் பயன்படுத்தவும்",

saveHealthReading:
    "உடல்நல அளவீட்டைச் சேமிக்கவும்",

selectTemperatureOrDontKnow:
    "வெப்பநிலையைத் தேர்ந்தெடுக்கவும் அல்லது 'எனக்குத் தெரியாது' என்பதைத் தேர்ந்தெடுக்கவும்.",

voiceCareSaveError:
    "குரல் பதிவு சேமிப்பு பிழை:",

reviewRecording:
    "பதிவை மதிப்பாய்வு செய்யவும்",

healthUpdateReady:
    "உங்கள் உடல்நலப் புதுப்பிப்பு தயாராக உள்ளது. அதை மதிப்பாய்வு செய்யலாம் அல்லது நேரடியாகச் சேமிக்கலாம்.",

},

};
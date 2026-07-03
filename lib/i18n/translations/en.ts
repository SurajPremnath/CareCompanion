import type {
  TranslationDictionary,
} from "../types";

export const en: TranslationDictionary = {

  common: {
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    loading: "Loading...",
    yes: "Yes",
    no: "No",
    notRecorded: "Not Recorded",
  },

  dailyCare: {
    title: "Daily Care",

    patientInformation:
      "Patient Information",

    patient: "Patient",

    date: "Date",

    time: "Time",

    readingMethodQuestion:
      "How would you like to add today's readings?",

    uploadPhoto:
      "Upload Photo",

    enterManually:
      "Enter Manually",

    captureMedicalReadings:
      "Capture Medical Readings",

    captureHelp:
      "Take a photo or select an image containing your medical device readings.",

    takeOrSelectImage:
      "Take or Select Image",

    readingImage:
      "Reading Image...",

    temperature:
      "Temperature",

    unit:
      "Unit",

    enterTemperature:
      "Enter Temperature",

    additionalVitals:
      "Additional Vitals",

    bloodPressure:
      "Blood Pressure",

    systolic:
      "Upper (Systolic)",

    diastolic:
      "Lower (Diastolic)",

    pulseRate:
      "Pulse Rate",

    spo2:
      "SpO₂",

    symptoms:
      "Symptoms",

    painLocation:
      "Pain Location",

painHead:
  "Head",

painNeck:
  "Neck",

painChest:
  "Chest",

painAbdomen:
  "Abdomen",

painBack:
  "Back",

painShoulder:
  "Shoulder",

painArm:
  "Arm",

painThigh:
  "Thigh",

painKnee:
  "Knee",

painCalf:
  "Calf",

painFeet:
  "Feet",

painOther:
  "Other",

otherPainPlaceholder:
  "Example: Left shoulder, Right elbow...",

    medications:
      "Medications",

    notes:
      "Notes",

symptomFever: "Fever",

symptomWeakness: "Weakness",

symptomBodyPain: "Body Pain",

symptomCough: "Cough",

symptomBloodInCough: "Blood in Cough",

symptomBreathlessness: "Breathlessness",

symptomWalkingDifficulty: "Walking Difficulty",

symptomLossOfAppetite: "Loss of Appetite",

symptomLooseMotions: "Loose Motions",

symptomVomiting: "Vomiting",

symptomDryMouth: "Dry Mouth",

symptomOther: "Other",

pleaseSpecify:
  "Please specify",

otherSymptomPlaceholder:
  "Example: Dizziness, Chills, Swelling...",

saving: "Saving...",
saveReading: "Save Reading",
backToDashboard: "Back to Dashboard",

recordingFor:
  "Who are you recording Daily Care for?",

chooseOneOption:
  "Please choose one option.",

myself:
  "Myself",

familyMember:
  "Family Member",
  },

  alerts: {
    imageReadSuccess:
      "Image read successfully. Please verify the populated readings before saving.",

    invalidMedicalImage:
      "Please upload a clear photo of a thermometer, blood pressure monitor, or pulse oximeter display.",

    multipleReadings:
      "Multiple different readings were detected. Please upload only the latest reading.",

    creditsOver:
      "Credits over. Contact Admin.",

    imageProcessingFailed:
      "Unable to process the medical image. Please try again.",

    saveSuccess:
      "Daily care reading saved successfully.",

    saveFailed:
      "Unable to save the daily care reading. Please try again.",
  },

  reports: {
    dailyCareReport:
      "Daily Care Report",

    patientSummary:
      "Patient Summary",

    recordedOn:
      "Recorded On",

    vitalSigns:
      "Vital Signs",

    bloodPressure:
      "Blood Pressure",

    pulse:
      "Pulse",
  },

dashboard: {

    title:
        "Dashboard",

    dailyCareSection:
        "Daily Care",

    dailyCare:
        "Daily Care",

    helpCentre:
        "Help Centre",

    assessmentSection:
        "Assessment",

    familyAssessment:
        "Family Assessment",

    selfAssessment:
        "Self Assessment",

    patientManagement:
        "Patient Management",

    addPatient:
        "Add Patient",

    reports:
        "Reports",

    logout:
        "Logout",

    loading:
        "Loading Dashboard...",

    createdBy:
        "Created by Suraj Premnath",

},

addPatient: {
  title: "Add Patient",
  loading: "Loading...",

  fullName: "Full Name",
  fullNamePlaceholder: "Enter patient's full name",

  dateOfBirth: "Date of Birth",
  age: "Age",
  years: "Years",

  gender: "Gender",
  selectGender: "Select Gender",
  male: "Male",
  female: "Female",
  other: "Other",
  preferNotToSay: "Prefer not to say",

  relationship: "Relationship",
  selectRelationship: "Select Relationship",

  father: "Father",
  mother: "Mother",
  spouse: "Spouse",
  brother: "Brother",
  sister: "Sister",
  son: "Son",
  daughter: "Daughter",
  grandfather: "Grandfather",
  grandmother: "Grandmother",
  uncle: "Uncle",
  aunt: "Aunt",
  friend: "Friend",
  neighbour: "Neighbour",

  savingPatient: "Saving Patient...",
  savePatient: "Save Patient",
  backToDashboard: "Back To Dashboard",

  createdBy: "Created by Suraj Premnath",

  saveFailed: "Unable to save patient.",
  saveSuccess: "Patient added successfully.",
  unexpectedError:
    "Something went wrong while saving the patient.",
},

assessment: {
  tagline:
    "Simple daily care.\nBetter clinical conversations.",

  selfAssessment:
    "Self Assessment",

  familyAssessment:
    "Family Assessment",

  page:
    "Page",

  of:
    "of",

  healthCheckToday:
    "Health Check for today",

  feelFeverish:
    "Do you feel feverish today?",

  temperatureTaken:
    "Was your temperature taken?",

  latestTemperature:
    "Latest temperature reading",

  temperaturePlaceholder:
    "e.g. 101.4",

  energyToday:
    "How is your energy today?",

  good:
    "Good",

  tired:
    "Tired",

  veryTired:
    "Very Tired",

  previous:
    "Previous",

  next:
    "Next",

  alertFever:
    "Please answer whether you feel feverish.",

  alertTemperatureTaken:
    "Please answer whether temperature was taken.",

  alertTemperatureReading:
    "Please enter temperature reading.",

  alertEnergy:
    "Please select your energy level.",

appetiteToday:
  "How is your appetite today?",

appetiteNormal:
  "Normal",

appetiteLess:
  "Eating Less",

appetitePoor:
  "Hardly Eating",

drinkingEnoughWater:
  "Have you been drinking enough water?",

notSure:
  "Not Sure",

waterIntake:
  "Water intake",

alertAllQuestions:
  "Please answer all questions.",

alertWaterIntake:
  "Please select water intake.",

discomfortToday:
  "Did you feel any discomfort today?",

discomfortWhere:
  "Where did you feel discomfort?",

areaHead:
  "Head",

areaEyes:
  "Eyes",

areaEars:
  "Ears",

areaNeck:
  "Neck",

areaChest:
  "Chest",

areaBack:
  "Back",

areaStomach:
  "Stomach",

areaArmsHands:
  "Arms / Hands",

areaLegsFeet:
  "Legs / Feet",

areaJoints:
  "Joints",

areaOther:
  "Other",

describeDiscomfort:
  "Describe discomfort",

alertQuestion:
  "Please answer the question.",

alertDiscomfortAreas:
  "Please select discomfort areas.",

alertSpecifyDiscomfort:
  "Please specify discomfort.",

walkingToday:
  "Are you able to walk today?",

walkingEasily:
  "Easily",

walkingSomeDifficulty:
  "Some Difficulty",

walkingVeryDifficult:
  "Very Difficult",

needHelpWalking:
  "Need help walking?",

looseMotionsToday:
  "Loose motions today?",

looseMotionType:
  "Type?",

looseMotionWatery:
  "Watery",

looseMotionSticky:
  "Sticky",

finishAssessment:
  "Finish Assessment",

alertWalkingHelp:
  "Please answer walking help.",

alertLooseMotionType:
  "Please select loose motion type.",

assessmentDetails:
  "Assessment Details",

yourName:
  "Your Name",

enterYourName:
  "Enter your name",

yourAge:
  "Your Age",

enterYourAge:
  "Enter your age",

startAssessment:
  "Start Assessment",

alertNameAndAge:
  "Please enter name and age",

},

};
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

takePhoto: "Take Photo",
chooseExistingPhoto: "Choose Existing Photo",

//--------------------------------------------------
// Upload Reading
//--------------------------------------------------

uploadHealthReading:
    "Upload Health Reading",

reviewHealthReading:
    "Review Health Reading",

uploadReadingDescription:
    "Take a photo or choose an existing photo of a health reading for {name}.",

reviewReadingDescription:
    "Check the readings below and correct anything before saving.",


readingHealthInformation:
    "Reading the health information from the image...",

tryAgain:
    "Try Again",

healthReadingSaved:
    "Health reading saved successfully.",

unableToReadImage:
    "Unable to read the medical image.",

unableToProcessImage:
    "Unable to process the medical image.",

unableToSaveReading:
    "Unable to save the health reading.",

noReadingDetected:
    "No supported health reading was found in this image. Please try another photo.",

keepOneReading:
    "Please keep at least one health reading before saving.",

//--------------------------------------------------
// Voice Recording
//--------------------------------------------------

tellUsHowYouFeel:
    "Tell us how you are feeling today",

tellUsHowPatientFeels:
    "Tell us how {name} is today",

understandingRecording:
    "Understanding your recording...",

preparingHealthUpdate:
    "Please wait while we prepare your health update.",

reviewRecording:
    "Review Recording",

transcript:
    "Transcript",

mentionedFever:
    "You mentioned fever.",

knowTemperature:
    "Do you know the temperature?",

selectTemperature:
    "Select temperature",

dontKnow:
    "I DON'T KNOW",

showTranscript:
    "Show Transcript",

hideTranscript:
    "Hide Transcript",

recordAgain:
    "Record Again",

rerecord:
    "Re-record",

unableToComplete:
    "Unable to complete the request.",

unableToSaveHealthUpdate:
    "Unable to save the health update.",

//--------------------------------------------------
// Manual Entry
//--------------------------------------------------

enterHealthInformation:
    "Enter Health Information",

enterRelevantInformation:
    "You only need to enter what is relevant.",

dateAndTime:
    "Date and Time",

invalidTemperature:
    "Temperature is invalid.",

invalidBloodPressure:
    "Blood Pressure is invalid.",

invalidPulse:
    "Pulse Rate is invalid.",

invalidSpo2:
    "SpO₂ is invalid.",

specifyOtherSymptom:
    "Please specify the other symptom.",

specifyPainLocation:
    "Please specify the pain location.",

recordOneObservation:
    "Please record at least one health observation.",

healthInformationSaved:
    "Health information saved successfully.",

unableToSaveHealthInformation:
    "Unable to save health information.",

recordHealthInformationFor:
    "Record health information for {name}.",

saveHealthInformation:
    "💾 Save Health Information",


selectFamilyMember:
    "Please select {name} before continuing.",

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

home:
    "Home",

whatWouldYouLikeToDo:
    "What do you want to do?",

recordHealth:
    "Record Health",

recordHealthDescription:
    "Record a health update for yourself or a family member",

viewHealth:
    "View Health",

viewHealthDescription:
    "View health timeline, reports and trends",

helpAndFaqs:
    "Help & FAQs",

helpAndFaqsDescription:
    "Learn how to use CareVR and find answers",

backToHome:
    "Back to Home",

medicationManagement:
    "Medication Management",

healthCheckAssessment:
    "Health Check Assessment",

healthHistory:
    "Health History",
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


selectPatientToBegin:
  "Select a patient to begin assessment.",

noPatientsFound:
  "No patients found. Please add a patient first.",

selectPatient:
  "Select Patient",

name:
  "Name",

age:
  "Age",

gender:
  "Gender",

relationship:
  "Relationship",

addNewPatient:
  "Add New Patient",

backToDashboard:
  "Back To Dashboard",

unableToContinue:
  "Unable to Continue",

profileLoadError:
  "Unable to load your profile. Please sign in again.",

patientLoadError:
  "Unable to load patients. Please try again.",

pageLoadError:
  "Something went wrong while loading this page. Please refresh and try again.",

breathingToday:
  "How was the patient's breathing today?",

breathingNormal:
  "Normal",

breathingSlightlyDifficult:
  "Slightly Difficult",

breathingVeryDifficult:
  "Very Difficult",

coughingToday:
  "Was the patient coughing today?",

coughSometimes:
  "Sometimes",

coughFrequently:
  "Frequently",

bloodWhileCoughing:
  "Was blood seen while coughing?",

alertBloodInCough:
  "Please answer whether blood was seen while coughing.",

patientFeverishToday:
  "Did the patient seem feverish today?",

temperatureMeasured:
  "Was temperature measured?",

enterLatestTemperature:
  "Enter latest temperature",

patientEnergyToday:
  "How energetic did the patient seem today?",

energyActive:
  "Active",

energyLessActive:
  "Less Active",

energyVeryWeak:
  "Very Weak",

alertTemperatureMeasured:
  "Please indicate whether temperature was measured.",

patientEatingToday:
  "How was the patient's eating today?",

patientDrinkingEnoughWater:
  "Did the patient drink enough water today?",

patientWaterGlasses:
  "Approximately how many glasses of water did the patient drink?",

oneGlass:
  "1 Glass",

twoGlasses:
  "2 Glasses",

threeGlasses:
  "3 Glasses",

fourGlasses:
  "4 Glasses",

fivePlusGlasses:
  "5+ Glasses",

patientDiscomfortToday:
  "Did the patient feel any discomfort today?",

patientDiscomfortWhere:
  "Where did the patient feel discomfort?",

areaArms:
  "Arms",

areaLegs:
  "Legs",

alertPatientDiscomfortAreas:
  "Please select where the patient felt discomfort.",

alertOtherDiscomfortArea:
  "Please specify the other discomfort area.",

patientWalkingToday:
  "How was the patient's walking today?",

walkedEasily:
  "Walked Easily",

patientNeedHelpWalking:
  "Did the patient need help walking?",

alertWalkingHelpNeeded:
  "Please indicate whether help was needed.",

looseMotionsObserved:
  "Were loose motions observed?",

looseMotionTypeObserved:
  "What type of loose motions were observed?",

patientConfusedToday:
  "Did the patient seem unusually confused today?",

},

medication: {

    //--------------------------------------------------
    // General
    //--------------------------------------------------

    title:
        "Medication Management",

    addPrescription:
        "Add Prescription",

    viewPrescriptions:
        "View Saved Prescriptions",

    prescriptionDetails:
        "Prescription Details",

    reviewPrescription:
        "Review Prescription",

    //--------------------------------------------------
    // Upload
    //--------------------------------------------------

    takePhoto:
        "Take Photo",

    choosePhotos:
        "Choose Photos",

    uploadPdf:
        "Upload PDF",

    readPrescription:
        "Read Prescription",

    readingPrescription:
        "Reading prescription...",

    preparingPrescription:
        "Preparing prescription...",

    prescriptionReadSuccess:
        "Prescription successfully read.",

    //--------------------------------------------------
    // Consultation
    //--------------------------------------------------

    consultationDate:
        "Consultation Date",

    consultationMode:
        "Consultation Type",

    doctor:
        "Doctor",

    hospital:
        "Hospital or Clinic",

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    medicines:
        "Medicines",

    medicine:
        "Medicine",

    dosage:
        "Dosage",

    frequency:
        "Frequency",

    duration:
        "Duration",

    instructions:
        "Instructions",

    //--------------------------------------------------
    // Actions
    //--------------------------------------------------

    savePrescription:
        "Confirm & Save",

    savingPrescription:
        "Saving...",

    reupload:
        "Re-upload Prescription",

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    consultationDateRequired:
        "Consultation date is required.",

    consultationDateFuture:
        "Consultation date cannot be in the future.",

    consultationDateInvalid:
        "Consultation date is invalid.",

    consultationTypeRequired:
        "Please select the consultation type.",

    patientRequired:
        "Please select a patient.",

    patientMismatch:
        "This prescription appears to belong to another patient.",

    //--------------------------------------------------
    // Warnings
    //--------------------------------------------------

    warningTitle:
        "Review completed with warnings",

    doctorNotDetected:
        "Doctor name was not detected.",

    hospitalNotDetected:
        "Hospital or clinic was not detected.",

    diagnosisNotDetected:
        "Diagnosis or assessment was not detected.",

    medicinesNotDetected:
        "No medicines were detected.",

    warningContinue:
        "You may still save this prescription if the information is correct.",

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    saveSuccess:
        "Prescription saved successfully.",

    saveFailed:
        "Unable to save the prescription.",

selectPrescription:
    "Please select a prescription.",

readFailed:
    "Unable to read the prescription.",

processingFailed:
    "Unable to process the prescription.",

patientMismatchTitle:
    "Prescription belongs to another patient",

  patientDetails: "Patient Details",

  patientSymptoms: "Patient Symptoms",

  assessment: "Assessment",

  diagnosisAssessment: "Diagnosis / Assessment",

  additionalDiagnoses: "Additional Diagnoses",

  examinationFindings: "Examination Findings",

  relevantMedicalHistory: "Relevant Medical History",

  lifestyle: "Lifestyle",

  consultationVitals: "Consultation Vitals",

  investigationsOrdered: "Investigations Ordered",

  careInstructions: "Care Instructions",

  otherNotes: "Other Notes",

  medicationsPrescribed: "Medications Prescribed",

  importantAdministrationTiming:
    "Important: Administration Timing",

  administrationTimingInfo1:
    "CareVR does not infer whether a medicine should be taken before food, after food, with food, or at another specific time.",

  administrationTimingInfo2:
    "Please confirm the correct Administration Timing with the consulting doctor before selecting a value.",

  administrationTimingInfo3:
    "If the administration timing has not yet been confirmed with the consulting doctor, leave the value as Not Specified and update it later after verification.",

  noMedicinesDetected:
    "No medicines could be identified.",

//--------------------------------------------------
// Patient Card
//--------------------------------------------------

patient:
    "Patient",

aiExtractedDate:
    "AI Extracted Date",

consultationDateHelp:
    "If the date is incorrect, select the correct consultation date.",


weight:
    "Weight",

bloodPressure:
    "Blood Pressure",

pulse:
    "Pulse",

temperature:
    "Temperature",

spo2:
    "SpO₂",

strength:
    "Strength",

dose:
    "Dose",

administrationTiming:
    "Administration Timing",


//--------------------------------------------------
// Administration Timing
//--------------------------------------------------

notSpecified:
    "Not Specified",

beforeFood:
    "Before Food",

afterFood:
    "After Food",

withFood:
    "With Food",

emptyStomach:
    "Empty Stomach",

beforeBreakfast:
    "Before Breakfast",

afterBreakfast:
    "After Breakfast",

beforeLunch:
    "Before Lunch",

afterLunch:
    "After Lunch",

beforeDinner:
    "Before Dinner",

afterDinner:
    "After Dinner",

atBedtime:
    "At Bedtime",

asDirected:
    "As Directed",

whatWouldYouLikeToDo:
    "What would you like to do?",

modeOfConsultation:
    "Mode of Consultation",

howWouldYouLikeToAddPrescription:
    "How would you like to add the prescription?",

forBestResults:
    "For Best Results",

supportedFormats:
    "Supported formats: JPG, JPEG and PNG",

useClearImages:
    "Use clear, well-lit images",

cropBackground:
    "Crop unnecessary background",

recommendedImageSize:
    "Recommended image size: 300 KB – 1 MB",

maximumImageSize:
    "Maximum supported size: 2 MB per image",

howWasConsultationConducted:
    "How was the consultation conducted?",

inPerson:
    "In Person",

video:
    "Video",

phone:
    "Phone",

homeVisit:
    "Home Visit",

other:
    "Other",

howWouldYouLikeToRecordHealth:
    "How would you like to record health?",

recordWithVoice:
    "Record with Voice",

uploadReading:
    "Upload Reading",

enterManually:
    "Enter Manually",

dailyCare:
    "Daily Care",

assessmentsHistory:
    "Assessments",

clinicalTrends:
    "Clinical Trends",

detailedTimeline:
    "Detailed Timeline",

pleaseSpecifyConsultationMode:
    "Please specify consultation mode",

whoIsThisFor:
    "Who is this for?",

//--------------------------------------------------
// Consultation Workspace
//--------------------------------------------------

consultationDetails:
    "Consultation Details",

consultationDetailsDescription:
    "Add the details you know. Optional fields can be left blank.",

doctorName:
    "Doctor Name",

enterDoctorName:
    "Enter doctor's name",

hospitalOrClinic:
    "Hospital or Clinic",

enterHospitalOrClinic:
    "Enter hospital or clinic",

optional:
    "Optional",

videoPlatform:
    "Video Platform",

exampleVideoPlatform:
    "Example: WhatsApp, Zoom",

consultationType:
    "Consultation Type",

phoneConsultation:
    "Phone Consultation",

doctorServiceDetails:
    "Doctor / Service Details",

enterDoctorServiceDetails:
    "Enter doctor or service details",

consultationMethod:
    "Consultation Method",

describeConsultationMethod:
    "Describe the consultation method",

consultationNotes:
    "Notes",

enterConsultationNotes:
    "Add any consultation notes",

//--------------------------------------------------
// Prescription Review
//--------------------------------------------------

reviewNoteTitle:
    "Review Before Saving",

reviewNoteDescription:
    "The information below has been extracted from the uploaded prescription using AI. Please review and confirm its accuracy before saving.",

reviewInstruction:
    "Click on each section and verify the extracted prescription before saving.",

//--------------------------------------------------
// Prescription Upload
//--------------------------------------------------

uploadFailed:
    "Unable to upload the selected prescription image(s).",

filesTooLarge:
    "The following file(s) exceed the supported size.",

recommendedUploadSize:
    "Recommended size: 300 KB – 1 MB per image.",

maximumUploadSize:
    "Maximum supported: 2 MB per image.",

cropBackgroundBeforeUpload:
    "Crop unnecessary background before uploading.",

reduceImageSize:
    "Please reduce the image size and try again.",

cameraUnavailable:
    "Unable to access the camera.",

readingFailed:
    "Unable to read the prescription.",

savingFailed:
    "Unable to save the prescription.",

prescriptionSaved:
    "Prescription saved successfully.",

//--------------------------------------------------
// Additional UI Messages
//--------------------------------------------------

uploadFileTooLargeMessage:
    "Unable to upload the selected prescription image(s).\n\n" +
    "The following file(s) exceed the supported size:\n\n" +
    "{fileNames}\n\n" +
    "For the best experience (especially on iPhone):\n\n" +
    "• Recommended size: 300 KB - 1 MB per image\n" +
    "• Maximum supported: 2 MB per image\n" +
    "• Crop unnecessary background before uploading\n\n" +
    "Please reduce the image size and try again.",

pleaseRecordatleastOneObservation:
    "Please record at least one health observation.\n\n" +
     "• Temperature\n" +
     "• Weight\n" +
     "• Vitals\n" +
     "• Symptoms\n" +
     "• Pain Location",

choosePhoto:
     "Choose Photo",


currentlyAddingPrescriptionFor:
    "You are currently adding a prescription for",

capturePhoto:
    "Capture Photo",

chooseCorrectPrescription:
    "Please re-upload the correct prescription or return and choose the appropriate family member.",

prescriptionReadError:
    "Prescription Read Error:",

pleaseSelectFamilyMember:
    "Please select a family member.",

manualCareSaveError:
    "Manual Care Save Error:",

clear:
    "Clear",

yourFamilyMember:
    "your family member",

uploadCareImageProcessingError:
    "Upload Care Image Processing Error:",

uploadCareSaveError:
    "Upload Care Save Error:",

useAnotherPhoto:
    "Use Another Photo",

saveHealthReading:
    "Save Health Reading",

selectTemperatureOrDontKnow:
    "Please select the temperature or choose I DON'T KNOW.",

voiceCareSaveError:
    "Voice Care Save Error:",

reviewRecording:
    "Review Recording",

healthUpdateReady:
    "Your health update is ready. You can review it or save directly.",

},

};
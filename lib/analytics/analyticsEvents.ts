//------------------------------------------------------------
// Care Companion Canonical Analytics Events
//------------------------------------------------------------

export const ANALYTICS_MODULES = {

  AUTH: "AUTH",

  DASHBOARD: "DASHBOARD",

  DAILY_CARE: "DAILY_CARE",

  ASSESSMENT: "ASSESSMENT",

  REPORTS: "REPORTS",

  PATIENT: "PATIENT",

  HELP: "HELP",

  AI_IMAGE: "AI_IMAGE",

  AI_VOICE: "AI_VOICE",

  MEDICATION: "MEDICATION",

  MEDICAL_REPORT: "MEDICAL_REPORT",

  SUBSCRIPTION: "SUBSCRIPTION",

  PERFORMANCE: "PERFORMANCE",

  AUDIT: "AUDIT",

} as const;


//------------------------------------------------------------
// Event Names
//------------------------------------------------------------

export const ANALYTICS_EVENTS = {

  //----------------------------------------------------------
  // Navigation and Discovery
  //----------------------------------------------------------

  PAGE_VIEWED: "PAGE_VIEWED",

  DISCOVERED: "DISCOVERED",

FEATURE_CLICKED: "FEATURE_CLICKED",

OPENED: "OPENED",

BACK_TO_DASHBOARD_CLICKED:
  "BACK_TO_DASHBOARD_CLICKED",


  //----------------------------------------------------------
  // Workflow Funnel
  //----------------------------------------------------------

CONTEXT_SELECTED: "CONTEXT_SELECTED",

INPUT_METHOD_SELECTED:
  "INPUT_METHOD_SELECTED",

IMAGE_SOURCE_SELECTED:
  "IMAGE_SOURCE_SELECTED",

STARTED: "STARTED",

  PAGE_REACHED: "PAGE_REACHED",

  DATA_ENTERED: "DATA_ENTERED",

  COMPLETED: "COMPLETED",

  SAVED: "SAVED",


  //----------------------------------------------------------
  // Result and Report Behaviour
  //----------------------------------------------------------

  RESULT_SHOWN: "RESULT_SHOWN",

  VIEWED: "VIEWED",

  DOWNLOAD_STARTED: "DOWNLOAD_STARTED",

  DOWNLOAD_COMPLETED: "DOWNLOAD_COMPLETED",

  DOWNLOAD_FAILED: "DOWNLOAD_FAILED",

  NEW_ASSESSMENT_CLICKED:
    "NEW_ASSESSMENT_CLICKED",


  //----------------------------------------------------------
  // Technical / API Outcomes
  //----------------------------------------------------------

  ATTEMPTED: "ATTEMPTED",

  SUCCEEDED: "SUCCEEDED",

  FAILED: "FAILED",


  //----------------------------------------------------------
  // Authentication and Registration
  //----------------------------------------------------------

  LOGIN_SUCCESS: "LOGIN_SUCCESS",

  LOGOUT: "LOGOUT",

  REGISTRATION_STARTED:
    "REGISTRATION_STARTED",

  REGISTRATION_COMPLETED:
    "REGISTRATION_COMPLETED",

  FIRST_OPEN: "FIRST_OPEN",

} as const;


//------------------------------------------------------------
// Context Values
//------------------------------------------------------------

export const ANALYTICS_CONTEXTS = {

  //----------------------------------------------------------
  // Care Context
  //----------------------------------------------------------

  SELF: "SELF",

  FAMILY: "FAMILY",


  //----------------------------------------------------------
  // Report Context
  //----------------------------------------------------------

  DAILY_CARE: "DAILY_CARE",

  ASSESSMENT: "ASSESSMENT",

  CLINICAL_TRENDS: "CLINICAL_TRENDS",

  MEDICAL_REPORT: "MEDICAL_REPORT",

  MEDICATION: "MEDICATION",


  //----------------------------------------------------------
  // Report View Context
  //----------------------------------------------------------

  TREND: "TREND",

  HISTORY: "HISTORY",

  OVERVIEW: "OVERVIEW",

} as const;


//------------------------------------------------------------
// Input Methods
//------------------------------------------------------------

export const ANALYTICS_INPUT_METHODS = {

  MANUAL: "MANUAL",

  IMAGE: "IMAGE",

  VOICE: "VOICE",

  IMPORT: "IMPORT",

  SYSTEM: "SYSTEM",

} as const;


//------------------------------------------------------------
// Platforms
//------------------------------------------------------------

export const ANALYTICS_PLATFORMS = {

  WEB: "WEB",

  PWA: "PWA",

  ANDROID: "ANDROID",

  IOS: "IOS",

} as const;
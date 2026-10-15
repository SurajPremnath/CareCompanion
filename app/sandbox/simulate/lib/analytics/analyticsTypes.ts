//------------------------------------------------------------
// Care Companion Analytics Types
//------------------------------------------------------------


//------------------------------------------------------------
// Platform
//------------------------------------------------------------

export type AnalyticsPlatform =
  | "WEB"
  | "PWA"
  | "ANDROID"
  | "IOS";


//------------------------------------------------------------
// Input Method
//------------------------------------------------------------

export type AnalyticsInputMethod =
  | "MANUAL"
  | "IMAGE"
  | "VOICE"
  | "IMPORT"
  | "SYSTEM";


//------------------------------------------------------------
// Analytics Modules
//------------------------------------------------------------

export type AnalyticsModule =
  | "AUTH"
  | "DASHBOARD"
  | "DAILY_CARE"
  | "ASSESSMENT"
  | "REPORTS"
  | "PATIENT"
  | "HELP"
  | "AI_IMAGE"
  | "AI_VOICE"
  | "MEDICATION"
  | "MEDICAL_REPORT"
  | "SUBSCRIPTION"
  | "PERFORMANCE"
  | "AUDIT";


//------------------------------------------------------------
// Analytics Events
//------------------------------------------------------------

export type AnalyticsEventName =

  //----------------------------------------------------------
  // Navigation and Discovery
  //----------------------------------------------------------

  | "PAGE_VIEWED"
  | "DISCOVERED"
  | "FEATURE_CLICKED"
  | "OPENED"
  | "BACK_TO_DASHBOARD_CLICKED"


  //----------------------------------------------------------
  // Workflow Funnel
  //----------------------------------------------------------

  | "CONTEXT_SELECTED"
  | "INPUT_METHOD_SELECTED"
  | "IMAGE_SOURCE_SELECTED"
  | "STARTED"
  | "PAGE_REACHED"
  | "DATA_ENTERED"
  | "COMPLETED"
  | "SAVED"


  //----------------------------------------------------------
  // Result and Report Behaviour
  //----------------------------------------------------------

  | "RESULT_SHOWN"
  | "VIEWED"
  | "DOWNLOAD_STARTED"
  | "DOWNLOAD_COMPLETED"
  | "DOWNLOAD_FAILED"
  | "NEW_ASSESSMENT_CLICKED"


  //----------------------------------------------------------
  // Technical / API Outcomes
  //----------------------------------------------------------

  | "ATTEMPTED"
  | "SUCCEEDED"
  | "FAILED"


  //----------------------------------------------------------
  // Authentication and Registration
  //----------------------------------------------------------

  | "LOGIN_SUCCESS"
  | "LOGOUT"
  | "REGISTRATION_STARTED"
  | "REGISTRATION_COMPLETED"
  | "FIRST_OPEN";


//------------------------------------------------------------
// Analytics Context
//------------------------------------------------------------

export type AnalyticsContext =
  | "SELF"
  | "FAMILY"
  | "DAILY_CARE"
  | "ASSESSMENT"
  | "CLINICAL_TRENDS"
  | "MEDICAL_REPORT"
  | "MEDICATION"
  | "TREND"
  | "HISTORY"
  | "OVERVIEW"
  | null;


//------------------------------------------------------------
// Analytics Event Input
//------------------------------------------------------------

export interface AnalyticsEventInput {

  module: AnalyticsModule;

  eventName: AnalyticsEventName;

  context?: AnalyticsContext;

  pagePath?: string | null;

  inputMethod?: AnalyticsInputMethod | null;

  metadata?: Record<
    string,
    string | number | boolean | null
  >;

}


//------------------------------------------------------------
// Analytics Event Record
//------------------------------------------------------------

export interface AnalyticsEventRecord {

  id: string;

  userId: string | null;

  anonymousId: string | null;

  sessionId: string | null;

  module: AnalyticsModule;

  eventName: AnalyticsEventName;

  context: AnalyticsContext;

  pagePath: string | null;

  platform: AnalyticsPlatform;

  appVersion: string | null;

  inputMethod: AnalyticsInputMethod | null;

  metadata: Record<
    string,
    string | number | boolean | null
  >;

  createdAt: string;

}
//------------------------------------------------------------
// Performance Status
//------------------------------------------------------------

export type PerformanceStatus =
  | "SUCCESS"
  | "FAILED";


//------------------------------------------------------------
// Performance Context
//------------------------------------------------------------

export type PerformanceContext =
  | "SELF"
  | "FAMILY"
  | null;

//------------------------------------------------------------
// Device Information
//------------------------------------------------------------

export type PerformanceDeviceType =
  | "MOBILE"
  | "TABLET"
  | "DESKTOP"
  | "UNKNOWN";


export type PerformancePlatform =
  | "IOS"
  | "ANDROID"
  | "WINDOWS"
  | "MACOS"
  | "LINUX"
  | "UNKNOWN";


//------------------------------------------------------------
// Pending Performance Transition
//------------------------------------------------------------

export interface PendingPerformanceTransition {

  id: string;

  journeyId: string;

  fromPath: string;

  toPath: string;

  feature: string;

  context: PerformanceContext;

  startedAt: string;

  startedAtMs: number;

}


//------------------------------------------------------------
// Completed Performance Record
//------------------------------------------------------------

export interface PerformanceRecord {

  id: string;

  journeyId: string;

  fromPath: string;

  toPath: string;

  feature: string;

  context: PerformanceContext;

  startedAt: string;

  completedAt: string;

  durationMs: number;

  status: PerformanceStatus;

  deviceType?: PerformanceDeviceType;

  platform?: PerformancePlatform;

}
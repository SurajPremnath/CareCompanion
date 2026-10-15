import type {
  PendingPerformanceTransition,
  PerformanceContext,
  PerformanceDeviceType,
  PerformancePlatform,
  PerformanceRecord,
  PerformanceStatus,
} from "./performanceTypes";

import {
  performanceStorage,
} from "./performanceStorage";


//------------------------------------------------------------
// Constants
//------------------------------------------------------------

const PENDING_TRANSITION_KEY =
  "carevr_pending_performance_transition";

const JOURNEY_ID_KEY =
  "carevr_performance_journey_id";


//------------------------------------------------------------
// Create ID
//------------------------------------------------------------

function createId(): string {

  return crypto.randomUUID();

}


//------------------------------------------------------------
// Get Or Create Journey ID
//------------------------------------------------------------

function getJourneyId():
  string {

  const existingJourneyId =
    sessionStorage.getItem(
      JOURNEY_ID_KEY
    );


  if (existingJourneyId) {

    return existingJourneyId;

  }


  const journeyId =
    createId();


  sessionStorage.setItem(
    JOURNEY_ID_KEY,
    journeyId
  );


  return journeyId;

}

//------------------------------------------------------------
// Detect Device Type
//------------------------------------------------------------

function detectDeviceType():
  PerformanceDeviceType {

  const userAgent =
    navigator.userAgent.toLowerCase();

  const isTablet =
    /ipad|tablet|playbook|silk/.test(
      userAgent
    ) ||
    (
      /android/.test(
        userAgent
      ) &&
      !/mobile/.test(
        userAgent
      )
    );


  if (isTablet) {

    return "TABLET";

  }


  const isMobile =
    /iphone|ipod|android.*mobile|windows phone/.test(
      userAgent
    );


  if (isMobile) {

    return "MOBILE";

  }


  if (
    userAgent.length > 0
  ) {

    return "DESKTOP";

  }


  return "UNKNOWN";

}


//------------------------------------------------------------
// Detect Platform
//------------------------------------------------------------

function detectPlatform():
  PerformancePlatform {

  const userAgent =
    navigator.userAgent.toLowerCase();


  if (
    /iphone|ipad|ipod/.test(
      userAgent
    )
  ) {

    return "IOS";

  }


  if (
    /android/.test(
      userAgent
    )
  ) {

    return "ANDROID";

  }


  if (
    /windows/.test(
      userAgent
    )
  ) {

    return "WINDOWS";

  }


  if (
    /macintosh|mac os x/.test(
      userAgent
    )
  ) {

    return "MACOS";

  }


  if (
    /linux/.test(
      userAgent
    )
  ) {

    return "LINUX";

  }


  return "UNKNOWN";

}

//------------------------------------------------------------
// Start Transition
//------------------------------------------------------------

function start({

  fromPath,

  toPath,

  feature,

  context = null,

}: {

  fromPath: string;

  toPath: string;

  feature: string;

  context?: PerformanceContext;

}): void {

  if (
    typeof window ===
    "undefined"
  ) {

    return;

  }


const startedAtMs =
  Date.now();

  const pendingTransition:
    PendingPerformanceTransition = {

      id:
        createId(),

      journeyId:
        getJourneyId(),

      fromPath,

      toPath,

      feature,

      context,

      startedAt:
        new Date().toISOString(),

      startedAtMs,

    };


  sessionStorage.setItem(
    PENDING_TRANSITION_KEY,
    JSON.stringify(
      pendingTransition
    )
  );

}


//------------------------------------------------------------
// Complete Transition
//------------------------------------------------------------

async function complete({

  toPath,

  status = "SUCCESS",

}: {

  toPath: string;

  status?: PerformanceStatus;

}): Promise<
  PerformanceRecord | null
> {

  if (
    typeof window ===
    "undefined"
  ) {

    return null;

  }


  const storedTransition =
    sessionStorage.getItem(
      PENDING_TRANSITION_KEY
    );


  if (!storedTransition) {

    return null;

  }


  let pendingTransition:
    PendingPerformanceTransition;


  try {

    pendingTransition =
      JSON.parse(
        storedTransition
      ) as PendingPerformanceTransition;

  }
  catch {

    sessionStorage.removeItem(
      PENDING_TRANSITION_KEY
    );

    return null;

  }


  if (
    pendingTransition.toPath !==
    toPath
  ) {

    return null;

  }


const completedAtMs =
  Date.now();


  const record:
    PerformanceRecord = {

      id:
        pendingTransition.id,

      journeyId:
        pendingTransition.journeyId,

      fromPath:
        pendingTransition.fromPath,

      toPath:
        pendingTransition.toPath,

      feature:
        pendingTransition.feature,

      context:
        pendingTransition.context,

      startedAt:
        pendingTransition.startedAt,

      completedAt:
        new Date().toISOString(),

      durationMs:
        Math.round(
          completedAtMs -
          pendingTransition.startedAtMs
        ),

      status,

      deviceType:
        detectDeviceType(),

      platform:
        detectPlatform(),

    };


  await performanceStorage.save(
    record
  );


  sessionStorage.removeItem(
    PENDING_TRANSITION_KEY
  );


  return record;

}


//------------------------------------------------------------
// Cancel Transition
//------------------------------------------------------------

function cancel(): void {

  if (
    typeof window ===
    "undefined"
  ) {

    return;

  }


  sessionStorage.removeItem(
    PENDING_TRANSITION_KEY
  );

}


//------------------------------------------------------------
// Export
//------------------------------------------------------------

export const performanceTracker = {

  start,

  complete,

  cancel,

};
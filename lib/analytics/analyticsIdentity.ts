//------------------------------------------------------------
// CareVR Analytics Identity
//------------------------------------------------------------

const ANALYTICS_SESSION_KEY =
  "carevr_analytics_session_id";

const ANALYTICS_ANONYMOUS_KEY =
  "carevr_analytics_anonymous_id";


//------------------------------------------------------------
// Create UUID
//------------------------------------------------------------

function createId(): string {

  return crypto.randomUUID();

}


//------------------------------------------------------------
// Get Or Create Session ID
//------------------------------------------------------------

export function getAnalyticsSessionId():
  string {

  if (typeof window === "undefined") {

    throw new Error(
      "Analytics session identity is browser-only."
    );

  }

  const existingSessionId =
    sessionStorage.getItem(
      ANALYTICS_SESSION_KEY
    );

  if (existingSessionId) {

    return existingSessionId;

  }

  const sessionId =
    createId();

  sessionStorage.setItem(
    ANALYTICS_SESSION_KEY,
    sessionId
  );

  return sessionId;

}


//------------------------------------------------------------
// Get Or Create Anonymous ID
//------------------------------------------------------------

export function getAnalyticsAnonymousId():
  string {

  if (typeof window === "undefined") {

    throw new Error(
      "Analytics anonymous identity is browser-only."
    );

  }

  const existingAnonymousId =
    localStorage.getItem(
      ANALYTICS_ANONYMOUS_KEY
    );

  if (existingAnonymousId) {

    return existingAnonymousId;

  }

  const anonymousId =
    createId();

  localStorage.setItem(
    ANALYTICS_ANONYMOUS_KEY,
    anonymousId
  );

  return anonymousId;

}
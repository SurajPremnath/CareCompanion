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

  //----------------------------------------------------------
  // Modern Browser UUID
  //----------------------------------------------------------

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return crypto.randomUUID();

  }


  //----------------------------------------------------------
  // Cross-Browser Fallback
  //----------------------------------------------------------

  const randomValues =
    new Uint8Array(16);


  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {

    crypto.getRandomValues(
      randomValues
    );

  }
  else {

    for (
      let index = 0;
      index < randomValues.length;
      index += 1
    ) {

      randomValues[index] =
        Math.floor(
          Math.random() * 256
        );

    }

  }


  //----------------------------------------------------------
  // UUID v4 Bits
  //----------------------------------------------------------

  randomValues[6] =
    (
      randomValues[6] & 0x0f
    ) | 0x40;

  randomValues[8] =
    (
      randomValues[8] & 0x3f
    ) | 0x80;


  //----------------------------------------------------------
  // Format UUID
  //----------------------------------------------------------

  const hex =
    Array.from(
      randomValues,
      value =>
        value
          .toString(16)
          .padStart(2, "0")
    );


  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");

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
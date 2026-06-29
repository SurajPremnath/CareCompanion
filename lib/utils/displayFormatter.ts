/**
 * ------------------------------------------------------------
 * Display Formatter
 * ------------------------------------------------------------
 * Converts enum-style values into user-friendly text.
 * ------------------------------------------------------------
 */

export function formatDisplayText(
  value: string
): string {

  if (!value) {

    return "";

  }

  return value
    .trim()
    .toLowerCase()
    .split("_")
    .map(word =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
    )
    .join(" ");

}

/**
 * ------------------------------------------------------------
 * Formats an array of enum values.
 * ------------------------------------------------------------
 */

export function formatDisplayList(
  values?: string[]
): string {

  if (!values || values.length === 0) {

    return "Not Recorded";

  }

  return values
    .filter(Boolean)
    .map(formatDisplayText)
    .join(", ");

}

export function formatRecordedDate(
  recordedAt: string
): string {

  if (!recordedAt) {
    return "";
  }

  // Expected format:
  // 2026-06-29 19:45:00

  const [datePart, timePart] = recordedAt.split(" ");

  const [year, month, day] =
    datePart.split("-").map(Number);

  const [hour, minute] =
    timePart.split(":").map(Number);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ];

  const displayHour =
    hour % 12 || 12;

  const ampm =
    hour >= 12 ? "pm" : "am";

  return `${day.toString().padStart(2, "0")} ${
    monthNames[month - 1]
  } ${year}, ${
    displayHour.toString().padStart(2, "0")
  }:${minute.toString().padStart(2, "0")} ${ampm}`;

}
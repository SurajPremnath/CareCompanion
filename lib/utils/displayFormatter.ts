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
  recordedAt?: string | null
): string {

  if (!recordedAt) {
    return "Not Recorded";
  }

  const value = recordedAt.trim();

  if (!value) {
    return "Not Recorded";
  }

  // Handle both
  // 2026-06-29 19:45:00
  // 2026-06-29T19:45:00

  const normalized =
    value.replace("T", " ");

  const parts =
    normalized.split(" ");

  if (parts.length < 2) {
    return value;
  }

  const [datePart, timePart] = parts;

  const date =
    datePart.split("-");

  const time =
    timePart.split(":");

  if (
    date.length !== 3 ||
    time.length < 2
  ) {
    return value;
  }

  const year =
    Number(date[0]);

  const month =
    Number(date[1]);

  const day =
    Number(date[2]);

  const hour =
    Number(time[0]);

  const minute =
    Number(time[1]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const displayHour =
    hour % 12 || 12;

  const ampm =
    hour >= 12 ? "pm" : "am";

  return `${day
    .toString()
    .padStart(2, "0")} ${
    months[month - 1]
  } ${year}, ${displayHour
    .toString()
    .padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${ampm}`;

}
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
export function normalizeMedicineName(name: string): string {
  return name
    .toLowerCase()

    // remove brackets
    .replace(/\(.*?\)/g, "")

    // normalize separators
    .replace(/[-_/]/g, " ")

    // remove punctuation
    .replace(/[.,]/g, "")

    // remove dosage units
    .replace(/\b\d+\s?(mg|mcg|g|ml)\b/g, "")

    // remove dosage forms
    .replace(
      /\b(tablet|tablets|tab|tabs|capsule|capsules|cap|caps|inj|injection|syrup|suspension)\b/g,
      ""
    )

    // collapse spaces
    .replace(/\s+/g, " ")

    .trim();
}

export function normalizeCompact(name: string): string {
  return normalizeMedicineName(name)
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}


const SEPARATORS = [
  "/",
  " OR ",
  " or ",
  "&",
  ","
];

export function splitMedicineName(name: string): string[] {
  let values = [name];

  for (const separator of SEPARATORS) {
    values = values.flatMap(v =>
      v.split(separator).map(x => x.trim()).filter(Boolean)
    );
  }

  return [...new Set(values)];
}
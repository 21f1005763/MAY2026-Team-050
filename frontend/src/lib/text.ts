/** Turn a backend enum key like "insufficient_information" into "Insufficient information". */
export function humanizeKey(key: string | null | undefined): string | null {
  if (!key) return null;
  const text = key.replace(/_/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : null;
}

/** Replace {name} placeholders: fill("Step {n}", { n: 2 }). */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

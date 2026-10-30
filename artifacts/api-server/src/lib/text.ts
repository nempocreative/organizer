const ABBREVIATIONS: Record<string, string> = {
  "JL.": "Jl.",
  "NO.": "No.",
  "KEC.": "Kec.",
  "KAB.": "Kab.",
  "KP.": "Kp.",
};
const PRESERVED_WORDS = new Set(["&", "RT", "RW"]);

function titleCasePart(part: string): string {
  if (!part || /^\d+$/.test(part)) return part;
  if (ABBREVIATIONS[part.toUpperCase()]) return ABBREVIATIONS[part.toUpperCase()];
  if (PRESERVED_WORDS.has(part.toUpperCase())) return part.toUpperCase();
  if (/^[A-Z]{1,3}\.?$/.test(part) && part.length <= 3) return part;
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

/**
 * Keeps place names readable when data comes from Google Maps, where names
 * frequently arrive in all caps and branch details are appended in brackets.
 */
export function cleanPlaceName(value: unknown): string | null {
  if (typeof value !== "string") return value == null ? null : String(value).trim() || null;
  let text = value.trim().replace(/\s+/g, " ");
  // Branch/street qualifiers in a trailing bracket make the card title noisy.
  text = text.replace(/\s*\([^()]{1,80}\)\s*$/, "");
  text = text.replace(/\s*-\s*/g, " - ");
  text = text.replace(/\s*&\s*/g, " & ");
  text = text.replace(/\s*,\s*/g, ", ");
  text = text.replace(/\bNo\.?\s*(\d)/gi, "No. $1");

  const words = text.split(" ");
  return words
    .map(word => word.split(/([.'’/-])/).map(titleCasePart).join(""))
    .join(" ")
    .trim() || null;
}

export function cleanLocation(value: unknown): string | null {
  const text = cleanPlaceName(value);
  if (!text) return null;
  return text
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return value == null ? null : String(value).trim() || null;
  const text = value.replace(/\s+/g, " ").trim();
  return text || null;
}

export function cleanDescription(value: unknown, rawName?: unknown, cleanedName?: string): string | null {
  const text = cleanText(value);
  if (!text || typeof rawName !== "string" || !cleanedName) return text;
  const source = rawName.trim();
  if (!source || source === cleanedName) return text;
  return text.replace(new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), cleanedName);
}

export function cleanCommaList(value: unknown): string | null {
  const text = cleanText(value);
  if (!text) return null;
  return text.split(",").map(item => cleanPlaceName(item) ?? "").filter(Boolean).join(", ");
}
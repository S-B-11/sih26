/**
 * Language auto-detection via Unicode script ranges.
 * Returns a language code or null if English/unrecognised.
 */

const SCRIPT_RANGES = [
  { code: "hi", name: "Hindi",      range: /[\u0900-\u097F]/ },
  { code: "ta", name: "Tamil",      range: /[\u0B80-\u0BFF]/ },
  { code: "te", name: "Telugu",     range: /[\u0C00-\u0C7F]/ },
  { code: "ml", name: "Malayalam",  range: /[\u0D00-\u0D7F]/ },
  { code: "bn", name: "Bengali",    range: /[\u0980-\u09FF]/ },
  { code: "gu", name: "Gujarati",   range: /[\u0A80-\u0AFF]/ },
];

/**
 * Returns { code, name } for the detected script, or null for English/unknown.
 */
export function detectLanguage(text) {
  if (!text || text.trim().length < 2) return null;
  for (const { code, name, range } of SCRIPT_RANGES) {
    if (range.test(text)) return { code, name };
  }
  return null;
}

export type NricPrefix = "S" | "T" | "F" | "G" | "M";
export type NricPrefixSelection = NricPrefix | "AUTO";

const WEIGHTS = [2, 7, 6, 5, 4, 3, 2] as const;
const PREFIXES: NricPrefix[] = ["S", "T", "F", "G", "M"];

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function normalizeNric(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function checksumFor(prefix: NricPrefix, digits: string): string {
  const sum = digits
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * WEIGHTS[index], 0);

  const offset = prefix === "T" || prefix === "G" ? 4 : prefix === "M" ? 3 : 0;
  const remainder = (sum + offset) % 11;

  if (prefix === "S" || prefix === "T") {
    return "JZIHGFEDCBA"[remainder];
  }
  if (prefix === "M") {
    return "XWUTRQPNJLK"[remainder];
  }
  return "XWUTRQPNMLK"[remainder];
}

export function generateNric(prefixSelection: NricPrefixSelection = "AUTO"): string {
  const prefix =
    prefixSelection === "AUTO"
      ? PREFIXES[randomInt(PREFIXES.length)]
      : prefixSelection;
  const digits = String(randomInt(10_000_000)).padStart(7, "0");
  const checksum = checksumFor(prefix, digits);
  return `${prefix}${digits}${checksum}`;
}

export function generateBatch(
  count: number,
  prefixSelection: NricPrefixSelection = "AUTO",
): string[] {
  const size = Math.min(Math.max(count, 1), 50);
  const values = new Set<string>();
  while (values.size < size) {
    values.add(generateNric(prefixSelection));
  }
  return [...values];
}

export function validateNric(rawValue: string): {
  valid: boolean;
  normalized: string;
  reason?: string;
} {
  const normalized = normalizeNric(rawValue);
  const match = normalized.match(/^([STFGM])(\d{7})([A-Z])$/);

  if (!match) {
    return {
      valid: false,
      normalized,
      reason: "Expected format: prefix + 7 digits + suffix (e.g. S1234567D).",
    };
  }

  const [, prefix, digits, suffix] = match;
  const expected = checksumFor(prefix as NricPrefix, digits);
  if (suffix !== expected) {
    return {
      valid: false,
      normalized,
      reason: `Invalid checksum. Expected suffix: ${expected}.`,
    };
  }

  return { valid: true, normalized };
}

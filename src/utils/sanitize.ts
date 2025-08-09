import { SearchParams } from "@/types/search";

//we can use some library also to do this instead of managing regex ourself

/**
 * Normalizes an unknown value to a trimmed string.
 * - Trims leading/trailing whitespace
 * - Collapses internal runs of whitespace to single spaces
 * - Returns undefined if input is not a string or becomes empty after trimming
 */
function toTrimmed(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Parses an integer from an unknown value and clamps it within bounds.
 * Falls back to defaultValue when parsing fails.
 */
function toClampedInteger(
  value: unknown,
  options: { min: number; max?: number; defaultValue: number }
): number {
  const parsed =
    typeof value === "string" ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(parsed)) return options.defaultValue;
  const withMin = Math.max(options.min, parsed);
  return typeof options.max === "number"
    ? Math.min(options.max, withMin)
    : withMin;
}

/**
 * Validates a date string in strict YYYY-MM-DD format.
 */
function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

/**
 * Normalizes the `type` filter to a safe lowercase token.
 * Only allows letters, digits, underscore, and hyphen.
 */
function sanitizeType(value: unknown): string | undefined {
  const v = toTrimmed(value)?.toLowerCase();
  if (!v) return undefined;
  // Whitelist safe characters to avoid weird inputs
  return /^[a-z0-9_-]+$/.test(v) ? v : undefined;
}

/**
 * Sanitizes raw query parameters into a well-formed SearchParams object.
 * - Trims/normalizes text fields (q, tag, photographer)
 * - Validates dates; swaps dateFrom/dateTo when inverted
 * - Clamps limit to [1, 100] (default 10) and offset to >= 0 (default 0)
 * - Restricts type to a safe lowercase token
 */
export function sanitizeSearchParams(
  query: Record<string, unknown>
): SearchParams {
  let dateFrom = isValidDate(query.dateFrom)
    ? (query.dateFrom as string)
    : undefined;
  let dateTo = isValidDate(query.dateTo) ? (query.dateTo as string) : undefined;

  // If user inverted dates, swap them
  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    const tmp = dateFrom;
    dateFrom = dateTo;
    dateTo = tmp;
  }

  const limit = toClampedInteger(query.limit, {
    min: 1,
    max: 100,
    defaultValue: 10,
  });
  const offset = toClampedInteger(query.offset, { min: 0, defaultValue: 0 });

  return {
    q: toTrimmed(query.q),
    tag: toTrimmed(query.tag),
    type: sanitizeType(query.type),
    limit,
    offset,
    dateFrom,
    dateTo,
    photographer: toTrimmed(query.photographer),
  };
}

export default sanitizeSearchParams;

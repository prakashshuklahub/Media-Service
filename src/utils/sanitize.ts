import { SearchParams } from "@/types/search";

function toTrimmed(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : undefined;
}

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

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

function sanitizeType(value: unknown): string | undefined {
  const v = toTrimmed(value)?.toLowerCase();
  if (!v) return undefined;
  // Whitelist safe characters to avoid weird inputs
  return /^[a-z0-9_-]+$/.test(v) ? v : undefined;
}

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

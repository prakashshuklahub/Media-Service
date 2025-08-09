import { Media } from "./media";

/**
 * Input parameters accepted by the media search endpoint.
 * All fields are optional; missing values are interpreted sensibly.
 *
 * @property q         - Free‑text query applied to `suchtext` and `fotografen`.
 * @property tag       - Optional tag filter (reserved for future use).
 * @property type      - Source/database key (sanitized lowercase token).
 * @property limit     - Page size; clamped to [1, 100].
 * @property offset    - Pagination offset; minimum 0.
 * @property dateFrom  - Start of date range filter (YYYY‑MM‑DD).
 * @property dateTo    - End of date range filter (YYYY‑MM‑DD).
 * @property photographer - Photographer name filter.
 */
export interface SearchParams {
  q?: string;
  tag?: string;
  type?: string;
  limit?: number;
  offset?: number;
  dateFrom?: string;
  dateTo?: string;
  photographer?: string;
}

/**
 * Minimal search result envelope used by callers that do not require all fields.
 */
export interface SearchResult {
  success: boolean;
  query?: string;
  tag?: string;
  type?: string;
  total: number;
  count: number;
  data: any[];
  took?: number;
}

/**
 * Full search response returned to the API consumer.
 *
 * @property total   - Total number of matched documents.
 * @property limit   - Page size used in the query.
 * @property offset  - Offset used in the query.
 * @property count   - Number of items in `data`.
 * @property data    - Array of normalized `Media` records.
 * @property took    - Elasticsearch reported time in ms (optional).
 */
export interface SearchResponse {
  success: boolean;
  query?: string;
  tag?: string;
  type?: string;
  total: number;
  limit: number;
  offset: number;
  count: number;
  data: Media[];
  took?: number;
}

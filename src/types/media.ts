/**
 * Media document returned by the repository after normalizing an
 * Elasticsearch hit.
 *
 * @remarks
 * - Numeric fields are coerced to numbers and default to 0 when invalid.
 * - `url` may be an empty string if it cannot be built from the source data.
 * - `createdAt` is a parsed `Date` derived from the ISO string in `datum`.
 */
export interface Media {
  /** Elasticsearch document id */
  id: string;
  /** Optional relevance score returned by Elasticsearch */
  score?: number;
  /** Provider-specific media identifier (zero‑padded when composing URLs) */
  bildnummer: string;
  /** ISO 8601 date string associated with the media */
  datum: string;
  /** Full‑text field used for search */
  suchtext: string;
  /** Photographer name(s) as stored in the source */
  fotografen: string;
  /** Pixel height of the media */
  hoehe: number;
  /** Pixel width of the media */
  breite: number;
  /** Source database key */
  db: string;
  /** Thumbnail URL; may be empty if it cannot be constructed */
  url: string;
  /** Parsed `Date` corresponding to `datum` */
  createdAt: Date;
  /** Optional highlighted snippet for matched text */
  highlightedText?: string;
}

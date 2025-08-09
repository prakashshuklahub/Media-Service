import { Client } from "@elastic/elasticsearch";
import {
  ELASTICSEARCH_HOST,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_INDEX_NAME,
  IMAGO_BASE_URL,
} from "@/config/index";

/**
 * Singleton wrapper around the Elasticsearch `Client`.

 */
class ElasticsearchClient {
  private static instance: ElasticsearchClient | null = null;
  private readonly client: Client;

  private constructor() {
    this.client = new Client({
      node: ELASTICSEARCH_HOST || "",
      auth: {
        username: ELASTICSEARCH_USERNAME || "",
        password: ELASTICSEARCH_PASSWORD || "",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  static getInstance(): ElasticsearchClient {
    if (!this.instance) {
      this.instance = new ElasticsearchClient();
    }
    return this.instance;
  }

  // Delegate to the underlying client while preserving types
  search(
    params: Parameters<Client["search"]>[0]
  ): ReturnType<Client["search"]> {
    return this.client.search(params as any) as ReturnType<Client["search"]>;
  }
}

export const INDEX_NAME = ELASTICSEARCH_INDEX_NAME || "";

export function buildMediaUrl(
  db: string | undefined,
  mediaId: string | undefined
): string | undefined {
  if (!db || !mediaId) return undefined;
  const paddedId = mediaId.padStart(10, "0");
  return `${IMAGO_BASE_URL}/bild/${db}/${paddedId}/s.jpg`;
}

export function transformElasticsearchHit(hit: any) {
  const source = hit?._source ?? {};

  const bildnummer: string = String(source.bildnummer ?? "");
  const datum: string = String(source.datum ?? "");
  const suchtext: string = String(source.suchtext ?? "");
  const fotografen: string = String(source.fotografen ?? "");
  const db: string = String(source.db ?? "unknown");

  const hoehe: number = Number.parseInt(String(source.hoehe ?? ""), 10);
  const breite: number = Number.parseInt(String(source.breite ?? ""), 10);

  const createdAt = Number.isFinite(Date.parse(datum))
    ? new Date(datum)
    : new Date(0);

  const url = buildMediaUrl(db, bildnummer) ?? "";

  return {
    id: hit?._id ?? "",
    score: hit?._score ?? undefined,
    bildnummer,
    datum,
    suchtext,
    fotografen,
    hoehe: Number.isFinite(hoehe) ? hoehe : 0,
    breite: Number.isFinite(breite) ? breite : 0,
    db,
    url,
    createdAt,
  };
}

// Default export remains an object exposing `search` (singleton instance)
export default ElasticsearchClient.getInstance();

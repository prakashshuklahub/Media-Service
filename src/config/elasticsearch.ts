import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_HOST || "",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || "",
    password: process.env.ELASTICSEARCH_PASSWORD || "",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const INDEX_NAME = process.env.ELASTICSEARCH_INDEX_NAME || "";

export function buildMediaUrl(
  db: string | undefined,
  mediaId: string | undefined
): string | undefined {
  if (!db || !mediaId) return undefined;
  const paddedId = mediaId.padStart(10, "0");
  return `https://www.imago-images.de/bild/${db}/${paddedId}/s.jpg`;
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

export default client;

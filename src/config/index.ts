import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Server
export const PORT: number = Number(process.env.PORT) || 3000;

// Elasticsearch
export const ELASTICSEARCH_HOST: string = process.env.ELASTICSEARCH_HOST || "";
export const ELASTICSEARCH_USERNAME: string =
  process.env.ELASTICSEARCH_USERNAME || "";
export const ELASTICSEARCH_PASSWORD: string =
  process.env.ELASTICSEARCH_PASSWORD || "";
export const ELASTICSEARCH_INDEX_NAME: string =
  process.env.ELASTICSEARCH_INDEX_NAME || "";

// External media provider base URL
export const IMAGO_BASE_URL: string = (
  process.env.IMAGO_BASE_URL || "https://www.imago-images.de"
).replace(/\/$/, "");

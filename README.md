## Media Service

A small TypeScript/Express service exposing a media search API backed by Elasticsearch.

### Features

- Search media with text query, date range, photographer, and type filters
- CORS enabled, JSON body parsing
- Health check endpoint
- Jest + ts-jest test setup

### Requirements

- Node.js (LTS recommended)
- Yarn or npm

### Setup

1. Install dependencies:
   - `npm install`
2. Create a `.env` file in the project root:

```env
# Server
PORT=3000

# Elasticsearch
ELASTICSEARCH_HOST=https://elasticsearch-ip:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
ELASTICSEARCH_INDEX_NAME=media_index
```

3. Start the server in development:

   - `npm run dev`

4. Build and run in production:
   - `npm run build`
   - `npm start`

### Scripts

- `npm run dev`: Start with nodemon + ts-node
- `npm run build`: Compile TypeScript and rewrite path aliases (`tsc` + `tsc-alias`)
- `npm start`: Run the compiled server from `dist/`
- `npm test`: Run Jest tests

### API

Base URL: `http://localhost:${PORT}` (default `PORT=3000`)

#### Health

- `GET /health`
  - Returns basic service status.

#### Search Media

- `GET /api/media/search`
- Query parameters (all optional):
  - `q` (string): Free-text query (matched against `suchtext` and `fotografen`)
  - `photographer` (string)
  - `dateFrom` (YYYY-MM-DD)
  - `dateTo` (YYYY-MM-DD)
  - `type` (string): Lowercase token; only letters, numbers, `_`, `-` allowed
  - `limit` (number): 1–100 (default 10)
  - `offset` (number): >= 0 (default 0)

Example:

```bash
curl "http://localhost:3000/api/media/search?q=dogs&limit=5&dateFrom=2024-01-01&dateTo=2024-12-31"
```

### Testing

- Run tests: `npm test`

### Notes

- Environment variables are loaded via `dotenv`. Ensure `.env` exists for local runs.

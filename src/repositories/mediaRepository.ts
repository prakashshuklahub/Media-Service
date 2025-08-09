import client, {
  INDEX_NAME,
  transformElasticsearchHit,
} from "@/config/elasticsearch";
import { Media } from "@/types/media";
import { SearchParams, SearchResponse } from "@/types/search";

export class MediaRepository {
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const {
        q,
        tag,
        type,
        limit = 10,
        offset = 0,
        dateFrom,
        dateTo,
        photographer,
      } = params;

      // Build Elasticsearch query
      let query: any;

      // Check if we have any search criteria
      const hasSearchCriteria = q || photographer || dateFrom || dateTo || type;

      if (hasSearchCriteria) {
        query = {
          bool: {
            must: [],
            filter: [],
          },
        };

        // Text search in suchtext field
        if (q) {
          query.bool.must.push({
            multi_match: {
              query: q,
              fields: ["suchtext^2", "fotografen"],
              type: "best_fields",
              fuzziness: "AUTO",
            },
          });
        }

        // Filter by photographer
        if (photographer) {
          query.bool.filter.push({
            term: {
              fotografen: photographer,
            },
          });
        }

        // Filter by date range
        if (dateFrom || dateTo) {
          const dateFilter: any = {
            range: {
              datum: {},
            },
          };
          if (dateFrom) dateFilter.range.datum.gte = dateFrom;
          if (dateTo) dateFilter.range.datum.lte = dateTo;
          query.bool.filter.push(dateFilter);
        }

        // Filter by database type
        if (type) {
          query.bool.filter.push({
            term: {
              db: type,
            },
          });
        }
      } else {
        // If no specific query, match all
        query = {
          match_all: {},
        };
      }

      const response = await client.search({
        index: INDEX_NAME,
        from: offset,
        size: limit,
        query,
        sort: [{ _score: { order: "desc" } }, { datum: { order: "desc" } }],
      });

      const hits = response.hits;

      const transformedData = hits.hits.map((hit: any) => {
        return transformElasticsearchHit(hit);
      });

      return {
        success: true,
        query: q || undefined,
        tag: tag || undefined,
        type: type || undefined,
        total: (hits.total as any).value || 0,
        limit,
        offset,
        count: transformedData.length,
        data: transformedData as Media[],
        took: response.took,
      };
    } catch (error) {
      console.error("Elasticsearch search error:", error);
      throw new Error(
        `Search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export default new MediaRepository();

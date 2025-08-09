import mediaRepository from "@/repositories/mediaRepository";
import { SearchParams, SearchResult } from "@/types/search";

export class MediaService {
  async searchMedia(params: SearchParams): Promise<SearchResult> {
    try {
      return await mediaRepository.search(params);
    } catch (error) {
      console.error("Media service search error:", error);
      throw error;
    }
  }
}

export default new MediaService();

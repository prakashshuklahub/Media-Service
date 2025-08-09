import { Request, Response } from "express";
import mediaService from "@/services/mediaService";
import { sanitizeSearchParams } from "@/utils/sanitize";

export class MediaController {
  async searchMedia(req: Request, res: Response) {
    try {
      const searchParams = sanitizeSearchParams(
        req.query as Record<string, unknown>
      );

      const result = await mediaService.searchMedia(searchParams);

      res.status(200).json(result);
    } catch (error) {
      console.error("Media controller search error:", error);
      res.status(500).json({
        success: false,
        message: "Error searching media",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new MediaController();

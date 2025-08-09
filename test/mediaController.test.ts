import express from "express";
import request from "supertest";
import { MediaController } from "../src/controllers/mediaController";

jest.mock("@/services/mediaService", () => ({
  __esModule: true,
  default: {
    searchMedia: jest.fn(),
  },
}));

import mediaService from "@/services/mediaService";

function createApp(controller: MediaController) {
  const app = express();
  app.get("/search", (req, res) => controller.searchMedia(req, res));
  return app;
}

describe("MediaController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with service result on success", async () => {
    const controller = new MediaController();
    (mediaService.searchMedia as jest.Mock).mockResolvedValueOnce({
      success: true,
      total: 0,
      count: 0,
      data: [],
    });

    const app = createApp(controller);
    const res = await request(app).get("/search").query({ q: "  dogs  " });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mediaService.searchMedia).toHaveBeenCalledTimes(1);
    expect(mediaService.searchMedia).toHaveBeenCalledWith({
      q: "dogs",
      tag: undefined,
      type: undefined,
      limit: 10,
      offset: 0,
      dateFrom: undefined,
      dateTo: undefined,
      photographer: undefined,
    });
  });

  it("returns 500 on service failure", async () => {
    const controller = new MediaController();
    (mediaService.searchMedia as jest.Mock).mockRejectedValueOnce(
      new Error("boom")
    );

    const app = createApp(controller);
    const res = await request(app).get("/search");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Error searching media");
  });
});

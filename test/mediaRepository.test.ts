import { MediaRepository } from "../src/repositories/mediaRepository";

jest.mock("@/config/elasticsearch", () => ({
  __esModule: true,
  default: {
    search: jest.fn(),
  },
  INDEX_NAME: "index",
  transformElasticsearchHit: jest.fn(),
}));

import esClient, { transformElasticsearchHit } from "@/config/elasticsearch";

describe("MediaRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("builds search request and maps hits", async () => {
    const repo = new MediaRepository();

    const fakeHit = { _id: "1" } as any;
    const transformed = { id: "1" } as any;

    (transformElasticsearchHit as jest.Mock).mockReturnValue(transformed);
    (esClient.search as jest.Mock).mockResolvedValue({
      hits: { hits: [fakeHit], total: { value: 1 } },
      took: 12,
    });

    const result = await repo.search({ q: "dog" } as any);

    expect(esClient.search).toHaveBeenCalledTimes(1);

    const callArg = (esClient.search as jest.Mock).mock.calls[0][0];
    expect(callArg.index).toBe("index");
    expect(callArg.size).toBeDefined();
    expect(callArg.from).toBeDefined();
    expect(callArg.query).toBeDefined();

    expect(transformElasticsearchHit).toHaveBeenCalledWith(fakeHit);

    expect(result.success).toBe(true);
    expect(result.total).toBe(1);
    expect(result.count).toBe(1);
    expect(result.data).toEqual([transformed]);
    expect(result.took).toBe(12);
  });
});

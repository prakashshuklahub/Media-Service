import { MediaService } from "../src/services/mediaService";

jest.mock("@/repositories/mediaRepository", () => ({
  __esModule: true,
  default: {
    search: jest.fn(),
  },
}));

// Import the mocked module types after jest.mock so TypeScript can infer them
import mediaRepository from "@/repositories/mediaRepository";

describe("MediaService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("delegates to repository.search and returns its result", async () => {
    const params = { q: "cats", limit: 5, offset: 2 } as any;
    const mockedResult = {
      success: true,
      total: 1,
      count: 1,
      data: [{ id: "1" }],
    };

    (mediaRepository.search as jest.Mock).mockResolvedValueOnce(mockedResult);

    const service = new MediaService();
    const result = await service.searchMedia(params);

    expect(mediaRepository.search).toHaveBeenCalledTimes(1);
    expect(mediaRepository.search).toHaveBeenCalledWith(params);
    expect(result).toBe(mockedResult);
  });
});

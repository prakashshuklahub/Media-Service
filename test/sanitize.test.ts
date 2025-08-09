import { sanitizeSearchParams } from "../src/utils/sanitize";

describe("sanitizeSearchParams", () => {
  it("returns trimmed q and clamps limit and offset", () => {
    const result = sanitizeSearchParams({
      q: "  hello   world  ",
      limit: "200",
      offset: "-5",
    });

    expect(result.q).toBe("hello world");
    expect(result.limit).toBe(100);
    expect(result.offset).toBe(0);
  });

  it("swaps inverted dates and normalizes type", () => {
    const result = sanitizeSearchParams({
      dateFrom: "2024-12-31",
      dateTo: "2024-01-01",
      type: "  Photo_Gallery  ",
    });

    expect(result.dateFrom).toBe("2024-01-01");
    expect(result.dateTo).toBe("2024-12-31");
    expect(result.type).toBe("photo_gallery");
  });
});

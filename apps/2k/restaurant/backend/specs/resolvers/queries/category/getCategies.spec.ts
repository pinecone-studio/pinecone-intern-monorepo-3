import { CategoryModel } from "apps/2k/restaurant/backend/src/models/category.model";
import { getCategories } from "apps/2k/restaurant/backend/src/resolvers/queries/category/getCategories"; // ← энэ нь хамгийн найдвартай импорт
import { GraphQLResolveInfo } from "graphql";

jest.mock("apps/2k/restaurant/backend/src/models/category.model", () => ({
  CategoryModel: {
    find: jest.fn(),
  },
}));

describe("getCategories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of categories", async () => {
    const mockCategories = [
      { categoryId: "1", categoryName: "Test Category 1" },
      { categoryId: "2", categoryName: "Test Category 2" },
    ];

    (CategoryModel.find as jest.Mock).mockResolvedValue(mockCategories);

    const result = await getCategories?.({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual(mockCategories);
  });

  it("should return an empty array if no categories exist", async () => {
    (CategoryModel.find as jest.Mock).mockResolvedValue([]);

    const result = await getCategories?.({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual([]);
  });

  it("should throw an error if database fails", async () => {
    (CategoryModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      getCategories?.({}, {}, {}, {} as GraphQLResolveInfo)
    ).rejects.toThrow("Failed to fetch categories");
  });
});

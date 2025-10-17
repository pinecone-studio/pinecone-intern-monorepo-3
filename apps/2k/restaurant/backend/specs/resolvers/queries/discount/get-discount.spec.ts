import { getDiscount } from "../../../../src/resolvers/queries/discount/get-discount";
import { DiscountModel } from "../../../../src/models/discount.model";


jest.mock("../../../../src/models/discount.model");

describe("getDiscount resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all discounts successfully", async () => {
    const mockDiscounts = [
      {
        _id: "1",
        discountName: "Winter Sale",
        discountRate: 10,
        startDate: "2025-10-01",
        endDate: "2025-10-31",
      },
      {
        _id: "2",
        discountName: "Summer Sale",
        discountRate: 15,
        startDate: "2025-06-01",
        endDate: "2025-06-30",
      },
    ];

    (DiscountModel.find as jest.Mock).mockResolvedValue(mockDiscounts);

    const result = await getDiscount();

    expect(DiscountModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockDiscounts);
  });

  it("should return an empty array if no discounts found", async () => {
    (DiscountModel.find as jest.Mock).mockResolvedValue(null);

    const result = await getDiscount();

    expect(result).toEqual([]);
  });

  it("should throw an error if database query fails", async () => {
    (DiscountModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(getDiscount()).rejects.toThrow("DB error");
  });
});

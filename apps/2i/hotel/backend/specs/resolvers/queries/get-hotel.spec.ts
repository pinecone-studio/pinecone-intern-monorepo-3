import { HotelModel } from "../../../src/models/hotel-model";
import { getHotel } from "../../../src/resolvers/queries";

jest.mock("../../../src/models/hotel-model", () => ({
    HotelModel: {
        find: jest.fn()
    }
}));

describe("getHotel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


        it("should return hotel list", async () => {
  const hotels = [
    {
      hotelName: "test hotelName",
      location: "test location",
    }
  ];

  (HotelModel.find as jest.Mock).mockResolvedValue(hotels);

        const result = await getHotel();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty("hotelName", "test hotelName");
        expect(result[0]).toHaveProperty("location", "test location");
    });
});

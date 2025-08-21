
import { HotelModel } from "../../../src/models/hotel-model";
import { getHotelById } from "../../../src/resolvers/queries";

jest.mock("../../../src/models/hotel-model");

describe("getHotelById", () => {
  const mockHotel = {
    _id: "001",
    hotelName: "Test Hotel",
    location: "UB",
    description: "Test description",
    starRating: "5 star",
    userRating: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return hotel if found", async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(mockHotel);

    const result = await getHotelById({}, { id: "001" });

    expect(HotelModel.findById).toHaveBeenCalledWith( "001" );
    expect(result).toEqual(mockHotel);
  });

  it("should throw error if hotel not found", async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(getHotelById({}, { id: "001" })).rejects.toThrow("Hotel not found");

    expect(HotelModel.findById).toHaveBeenCalledWith( "001" );
  });

  it("should throw server error on exception", async () => {
    (HotelModel.findById as jest.Mock).mockRejectedValue(new Error("Some DB error"));

    await expect(getHotelById({}, { id: "001" })).rejects.toThrow("Server error");

    expect(HotelModel.findById).toHaveBeenCalledWith("001" );
  });
});

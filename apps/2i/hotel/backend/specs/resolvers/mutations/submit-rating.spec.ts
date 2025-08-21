import { submitUserRating } from "../../../src/resolvers/mutations/submit-rating-mutation";
import { HotelModel } from "../../../src/models/hotel-model";
import mongoose from "mongoose";


jest.mock("../../../src/models/hotel-model", () => ({
  HotelModel: {
    findById: jest.fn()
  }
}));


// jest.mock("mongoose", () => {
//   const original = jest.requireActual("mongoose");
//   return {
//     ...original,
//     Types: {
//       ObjectId: jest.fn().mockImplementation((id) => `mocked-object-id-${id}`)
//     }
//   };
// });

describe("submitUserRating", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should submit rating by hotel id", async () => {
    const saveMock = jest.fn();
    const hotel = { userRating: [], save: saveMock };

    (HotelModel.findById as jest.Mock).mockResolvedValue(hotel);

    const args = {
      hotelId: "001",
      rating: 5,
      comment: "Good hotel"
    };

    const result = await submitUserRating({}, args);

    expect(HotelModel.findById).toHaveBeenCalledWith("001");
    expect(hotel.userRating.length).toBe(1);
    expect(hotel.userRating[0]).toMatchObject({
      rating: 5,
      comment: "Good hotel",
      hotel: "001"
    });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe(hotel.userRating);
  });

  it("should throw error if hotel not found", async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);

    const args = {
      hotelId: "001",
      rating: 4,
      comment: "test"
    };

    await expect(submitUserRating({}, args)).rejects.toThrow("Hotel not found");
    expect(HotelModel.findById).toHaveBeenCalledWith("001");
  });

  it("should initialize userRating as array if it's not an array", async () => {
    const saveMock = jest.fn();
    const hotel = { userRating: "not-array", save: saveMock };

    (HotelModel.findById as jest.Mock).mockResolvedValue(hotel);

    const args = {
      hotelId: "002",
      rating: 3,
      comment: "Average stay"
    };

    const result = await submitUserRating({}, args);

    expect(Array.isArray(hotel.userRating)).toBe(true);
    expect(hotel.userRating.length).toBe(1);
    expect(result[0].rating).toBe(3);
    expect(saveMock).toHaveBeenCalled();
  });

  it("should handle missing comment", async () => {
    const saveMock = jest.fn();
    const hotel = { userRating: [], save: saveMock };

    (HotelModel.findById as jest.Mock).mockResolvedValue(hotel);

    const args = {
      hotelId: "003",
      rating: 4
 
    };

    const result = await submitUserRating({}, args);

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty("rating", 4);
    expect(result[0]).toHaveProperty("comment", undefined); 
    expect(saveMock).toHaveBeenCalled();
  });
});

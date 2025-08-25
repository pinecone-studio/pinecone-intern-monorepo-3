import { HotelModel } from "../../../src/models/hotel-model";
import { deleteHotel } from "../../../src/resolvers/mutations";

jest.mock("../../../src/models/hotel-model", () => ({
  HotelModel: {
    findByIdAndDelete: jest.fn()
  }
}));

describe("deleteHotel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a hotel and return true", async () => {
    (HotelModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({ id: "001" });

    const result = await deleteHotel(undefined, { id: "001" });

    expect(result).toBe(true);
  });

  it("should return false if hotel was not found for deletion", async () => {
    (HotelModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

    const result = await deleteHotel(undefined, { id: "non-existing-id" });

    expect(result).toBe(false);
  });
});

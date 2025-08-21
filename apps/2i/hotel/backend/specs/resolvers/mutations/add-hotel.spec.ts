import { HotelModel } from "../../../src/models/hotel-model";
import { addHotel } from "../../../src/resolvers/mutations/add-hotel-mutation";

jest.mock("../../../src/models/hotel-model");

describe("addHotel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new hotel when it doesn't exist", async () => {
    jest.spyOn(HotelModel, "findOne").mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue({
      _id: "001",
      hotelName: "test hotel",
      location: "test UB",
      starRating: "5 star",
      userRating: [],
      description: "tailbar end bn"
    });

    (HotelModel.create as jest.Mock).mockImplementation(() => ({
      save: saveMock,
    toObject: () => ({
    _id: "001",
    hotelName: "test hotel",
    location: "test UB",
    starRating: "5 star",
    userRating: [],
    description: "tailbar end bn"
  }),
    }));

    const hotelData= {
      id: "001",
      hotelName: "test hotel",
      location: "test UB",
      starRating: "5 star",
      userRating: "test 10",
      description: "tailbar end bn"
    
    };

    const result = await addHotel({}, hotelData);

    expect(result).toBeDefined();
    expect(result._id).toBe("001");
    expect(result.hotelName).toBe("test hotel");

    expect(HotelModel.findOne).toHaveBeenCalledWith({
      _id: "001",
      hotelName: "test hotel",
    });

    expect(saveMock).toHaveBeenCalled();
  });

  it("should throw an error if hotel already exists", async () => {
    jest.spyOn(HotelModel, "findOne").mockResolvedValue({ id: "001" });

    await expect(
      addHotel({}, {
       id: "001",
        hotelName: "test hotel",
        location: "test UB",
        starRating: "5 star",
        // userRating: [],
        description: "tailbar end bn"
      })
    ).rejects.toThrow("Hotel with this name already exists.");
  });
});

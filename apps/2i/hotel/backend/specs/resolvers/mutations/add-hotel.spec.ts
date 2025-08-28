import { HotelModel } from '../../../src/models/hotel-model';
import { addHotel } from '../../../src/resolvers/mutations/add-hotel-mutation';

jest.mock('../../../src/models/hotel-model');

describe('addHotel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new hotel when it doesn't exist", async () => {
    jest.spyOn(HotelModel, 'findOne').mockResolvedValue(null);

    (HotelModel.create as jest.Mock).mockImplementation(() => ({
      hotelName: 'test hotel',
      phoneNumber: '99119911',
      starRating: '5 star',
      description: 'tailbar end bn',
    }));

    const hotelData = {
      hotelName: 'test hotel',
      starRating: '5 star',
      phoneNumber: '99119911',
      description: 'tailbar end bn',
    };

    const result = await addHotel({}, hotelData);

    expect(result).toBeDefined();
    expect(result.phoneNumber).toBe('99119911');
    expect(result.hotelName).toBe('test hotel');

    expect(HotelModel.findOne).toHaveBeenCalledWith({
      _id: '001',
      hotelName: 'test hotel',
    });
  });

  it('should throw an error if hotel already exists', async () => {
    jest.spyOn(HotelModel, 'findOne').mockResolvedValue({ id: '001' });

    await expect(
      addHotel(
        {},
        {
          hotelName: 'test hotel',
          starRating: '5 star',
          description: 'tailbar end bn',
          phoneNumber: '99119911',
        }
      )
    ).rejects.toThrow('Hotel with this name already exists.');
  });
});

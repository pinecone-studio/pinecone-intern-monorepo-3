// __tests__/addHotel.test.js

import { HotelModel } from '../../../src/models/hotel-model';
import { addHotel } from '../../../src/resolvers/mutations/add-hotel-mutation';

jest.mock('../../../src/models/hotel-model');

describe('addHotel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new hotel if it does not exist', async () => {
    (HotelModel.findOne as jest.Mock).mockResolvedValue(null);

    const mockHotel = {
      hotelName: 'Test Hotel',
      description: 'Test Description',
      starRating: '5',
      phoneNumber: '123456789',
    };
    (HotelModel.create as jest.Mock).mockResolvedValue(mockHotel);

    const args = {
      hotelName: 'Test Hotel',
      description: 'Test Description',
      starRating: '5',
      phoneNumber: '123456789',
    };

    const result = await addHotel(null, args);

    expect(HotelModel.findOne).toHaveBeenCalledWith({ hotelName: 'Test Hotel' });
    expect(HotelModel.create).toHaveBeenCalledWith(args);
    expect(result).toEqual(mockHotel);
  });

  it('should throw an error if hotel already exists', async () => {
    (HotelModel.findOne as jest.Mock).mockResolvedValue({ hotelName: 'Existing Hotel' });

    const args = {
      hotelName: 'Existing Hotel',
      description: 'Test Description',
      starRating: '5',
      phoneNumber: '123456789',
    };

    await expect(addHotel(null, args)).rejects.toThrow('Hotel with this name already exists.');
    expect(HotelModel.findOne).toHaveBeenCalledWith({ hotelName: 'Existing Hotel' });
    expect(HotelModel.create).not.toHaveBeenCalled();
  });
});

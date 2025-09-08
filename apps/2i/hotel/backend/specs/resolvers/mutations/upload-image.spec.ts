import { HotelModel } from '../../../src/models/hotel-model';
import { uploadToCloudinary } from '../../../src/resolvers/mutations/upload-image-mutations';

jest.mock('../../../src/models/hotel-model', () => {
  return {
    HotelModel: {
      findById: jest.fn(),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('uploadToCloudinary mutation', () => {
  const mockHotelId = 'hotel123';
  const mockImages = ['img1.jpg', 'img2.jpg'];

  it('should upload images if hotel exists', async () => {
    const mockHotel = {
      _id: mockHotelId,
      image: ['old.jpg'],
      save: jest.fn().mockResolvedValue(true),
    };

    (HotelModel.findById as jest.Mock).mockResolvedValue(mockHotel);

    const result = await uploadToCloudinary(null, { hotelId: mockHotelId, image: mockImages });

    expect(HotelModel.findById).toHaveBeenCalledWith({ _id: mockHotelId });
    expect(mockHotel.image).toEqual(['old.jpg', ...mockImages]);
    expect(mockHotel.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Successfully uploaded images' });
  });

  it('should throw an error if hotel not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(uploadToCloudinary(null, { hotelId: mockHotelId, image: mockImages })).rejects.toThrow('Hotel not found');

    expect(HotelModel.findById).toHaveBeenCalledWith({ _id: mockHotelId });
  });

  it('should throw a server error if something goes wrong', async () => {
    (HotelModel.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(uploadToCloudinary(null, { hotelId: mockHotelId, image: mockImages })).rejects.toThrow('Server error Error: DB error');
  });
});

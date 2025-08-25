import { uploadToCloudinary } from '../../../src/resolvers/mutations/upload-image-mutations';
import { HotelModel } from '../../../src/models/hotel-model';

jest.mock('../../../src/models/hotel-model');

describe('uploadToCloudinary', () => {
  it('should push images to existing hotel and return it', async () => {
    const mockHotel = {
      _id: '123',
      image: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const args = {
      hotelId: '123',
      image: ['https://cloudinary.com/image1.jpg', 'https://cloudinary.com/image2.jpg'],
    };

    (HotelModel.findById as jest.Mock).mockResolvedValue(mockHotel);

    const result = await uploadToCloudinary(null, args);

    expect(HotelModel.findById).toHaveBeenCalledWith({ _id: '123' });
    expect(mockHotel.image).toEqual(args.image);
    expect(result).toBe(mockHotel);
  });

  it('should throw an error if hotel not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);

    const args = {
      hotelId: 'non-existent-id',
      image: ['some-url'],
    };

    await expect(uploadToCloudinary(null, args)).rejects.toThrow('Hotel not found');
  });

  it('should handle and throw server errors', async () => {
    (HotelModel.findById as jest.Mock).mockRejectedValue(new Error('DB failure'));

    const args = {
      hotelId: '123',
      image: ['some-url'],
    };

    await expect(uploadToCloudinary(null, args)).rejects.toThrow('Server error');
  });
});

import { RoomModel } from '../../../src/models/room-model';
import { getFilterRoom } from '../../../src/resolvers/queries/get-filter-room-query';

jest.mock('../../../src/models/room-model');

describe('getFilterRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered rooms when filtering by roomType and amenities', async () => {
    const mockRooms = [
      {
        roomType: 'deluxe',
        amenities: {
          technology: ['WiFi'],
          bathroom: [],
          foodAndDrink: [],
          accessibility: [],
          bedroom: [],
          more: [],
        },
      },
    ];

    (RoomModel.find as jest.Mock).mockResolvedValue(mockRooms);

    const args = {
      roomType: 'deluxe',
      amenities: {
        technology: ['WiFi'],
      },
    };

    const result = await getFilterRoom(null, args);

    expect(RoomModel.find).toHaveBeenCalledWith({
      roomType: 'deluxe',
      'amenities.technology': { $all: ['WiFi'] },
    });

    expect(result).toEqual([
      {
        roomType: 'deluxe',
        amenities: mockRooms[0].amenities,
      },
    ]);
  });

  it('should return filtered rooms when filtering by roomType only', async () => {
    const mockRooms = [
      {
        roomType: 'standard',
        amenities: {
          technology: [],
          bathroom: [],
          foodAndDrink: [],
          accessibility: [],
          bedroom: [],
          more: [],
        },
      },
    ];

    (RoomModel.find as jest.Mock).mockResolvedValue(mockRooms);

    const args = {
      roomType: 'standard',
    };

    const result = await getFilterRoom(null, args);

    expect(RoomModel.find).toHaveBeenCalledWith({
      roomType: 'standard',
    });

    expect(result).toEqual([
      {
        roomType: 'standard',
        amenities: mockRooms[0].amenities,
      },
    ]);
  });

  it('should return filtered rooms when filtering by amenities only', async () => {
    const mockRooms = [
      {
        roomType: 'suite',
        amenities: {
          bathroom: ['bathtub'],
          technology: [],
          foodAndDrink: [],
          accessibility: [],
          bedroom: [],
          more: [],
        },
      },
    ];

    (RoomModel.find as jest.Mock).mockResolvedValue(mockRooms);

    const args = {
      amenities: {
        bathroom: ['bathtub'],
      },
    };

    const result = await getFilterRoom(null, args);

    expect(RoomModel.find).toHaveBeenCalledWith({
      'amenities.bathroom': { $all: ['bathtub'] },
    });

    expect(result).toEqual([
      {
        roomType: 'suite',
        amenities: mockRooms[0].amenities,
      },
    ]);
  });

  it('should return all rooms if no filter args provided', async () => {
    const mockRooms = [
      {
        roomType: 'deluxe',
        amenities: {},
      },
      {
        roomType: 'standard',
        amenities: {},
      },
    ];

    (RoomModel.find as jest.Mock).mockResolvedValue(mockRooms);

    const result = await getFilterRoom(null, {});

    expect(RoomModel.find).toHaveBeenCalledWith({});
    expect(result).toEqual([
      { roomType: 'deluxe', amenities: {} },
      { roomType: 'standard', amenities: {} },
    ]);
  });

  it('should skip amenities keys with empty arrays in the query', async () => {
    const mockRooms = [
      {
        roomType: 'suite',
        amenities: {
          bathroom: ['bathtub'],
          technology: [],
        },
      },
    ];

    (RoomModel.find as jest.Mock).mockResolvedValue(mockRooms);

    const args = {
      amenities: {
        technology: [],
        bathroom: ['bathtub'],
      },
    };

    const result = await getFilterRoom(null, args);

    expect(RoomModel.find).toHaveBeenCalledWith({
      'amenities.bathroom': { $all: ['bathtub'] },
    });

    expect(result).toEqual([
      {
        roomType: 'suite',
        amenities: mockRooms[0].amenities,
      },
    ]);
  });
});

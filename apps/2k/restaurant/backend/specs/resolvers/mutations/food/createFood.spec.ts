import { createFood } from '../../../../src/resolvers/mutations/food/create-food';
import { Food } from '../../../../src/models/food.model';

jest.mock('../../../../src/models/food.model');

describe('createFood mutation', () => {
  it('should return undefined if name is missing', async () => {
    const result = await createFood({}, { name: '', image: 'img.png', price: 10, available: true });
    expect(result).toBeUndefined();
  });

  it('should create and return new food if name is provided', async () => {
    const saveMock = jest.fn().mockResolvedValue({
      id: '1',
      name: 'Pizza',
      image: 'img.png',
      price: 10,
      available: true,
    });
    (Food as any).mockImplementation(() => ({ save: saveMock }));

    const result = await createFood({}, { name: 'Pizza', image: 'img.png', price: 10, available: true });

    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({
      id: '1',
      name: 'Pizza',
      image: 'img.png',
      price: 10,
      available: true,
    });
  });
});

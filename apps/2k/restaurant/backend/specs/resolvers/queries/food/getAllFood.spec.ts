import { GetAllFoods } from '../../../../src/resolvers/queries/food/get-all-food';
import { Food } from '../../../../src/models/food.model';

jest.mock('../../../../src/models/food.model', () => ({
  Food: {
    find: jest.fn(),
  },
}));

describe('GetAllFood', () => {
  it('хоол байвал бүх хоолыг буцаах ёстой', async () => {
    const mockedFood = [
      {
        id: '68e7276fa7ed99a6717171b6',
        image: 'update image',
        name: 'foodUpdate1',
      },
    ];

    (Food.find as jest.Mock).mockResolvedValue(mockedFood);

    const result = await GetAllFoods();

    expect(result).toEqual(mockedFood);
  });

  it('хоол байхгүй бол хоосон буцаа', async () => {
    (Food.find as jest.Mock).mockResolvedValue([]);

    const result = await GetAllFoods();

    expect(result).toEqual([]);
  });

  it('алдаа гарсан тохиолдолд хоосон массив буцаах ёстой', async () => {
    (Food.find as jest.Mock).mockRejectedValue(new Error('DB алдаа food test'));
    const result = await GetAllFoods();

    expect(result).toEqual([]);
  });
});

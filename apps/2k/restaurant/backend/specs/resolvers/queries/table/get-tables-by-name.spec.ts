// __tests__/getTablesByName.test.ts

import { getTablesByName } from 'apps/2k/restaurant/backend/src/resolvers/queries/table/get-table-by-name';
import { TableModel } from '../../../../src/models/table.model';

jest.mock('../../../../src/models/table.model');

describe('getTablesByName Query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tables filtered by name', async () => {
    const mockTables = [
      { tableName: '1A', tableQr: '1A', tableId: '1' },
      { tableName: '1A', tableQr: '1B', tableId: '2' },
    ];
    (TableModel.find as jest.Mock).mockResolvedValue(mockTables);

    const result = await getTablesByName(null, { tableName: '1A' });

    expect(TableModel.find).toHaveBeenCalledWith({ tableName: '1A' });
    expect(result).toEqual(mockTables);
  });

  it('should return empty array if no table matches', async () => {
    (TableModel.find as jest.Mock).mockResolvedValue([]);

    const result = await getTablesByName(null, { tableName: 'NonExist' });

    expect(TableModel.find).toHaveBeenCalledWith({ tableName: 'NonExist' });
    expect(result).toEqual([]);
  });

  it('should throw an error if find fails', async () => {
    (TableModel.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(getTablesByName(null, { tableName: '1A' })).rejects.toThrow('Ширээний мэдээлэл авахад алдаа гарлаа');
  });
});

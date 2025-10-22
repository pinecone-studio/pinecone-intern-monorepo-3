// __tests__/getTables.test.ts

import { getTables } from 'apps/2k/restaurant/backend/src/resolvers/queries';
import { TableModel } from '../../../../src/models/table.model';
import mongoose from 'mongoose';

// TableModel-г mock хийх
jest.mock('../../../../src/models/table.model');

describe('getTables Query', () => {
  it('should return all tables', async () => {
    const mockTables = [
      { _id: '1', tableName: '1A', tableQr: '1A-QR' },
      { _id: '2', tableName: '1B', tableQr: '1B-QR' },
    ];

    (TableModel.find as jest.Mock).mockResolvedValue(mockTables);

    const result = await getTables();

    expect(result).toHaveLength(2);
    expect(result[0].tableName).toBe('1A');
    expect(result[1].tableQr).toBe('1B-QR');
  });

  it('should throw error when find fails', async () => {
    (TableModel.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(getTables()).rejects.toThrow('Ширээний мэдээлэл авахад алдаа гарлаа');
  });
});

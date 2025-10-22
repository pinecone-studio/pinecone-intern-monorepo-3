import { deleteTable } from 'apps/2k/restaurant/backend/src/resolvers/mutations';
import { TableModel } from '../../../../src/models/table.model';

jest.mock('../../../../src/models/table.model');

describe('deleteTable resolver', () => {
  const mockTableId = '123abc';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a table and return deleted table data', async () => {
    const mockDeletedTable = {
      _id: mockTableId,
      tableName: 'Table 1',
      tableQr: '1A',
    };

    (TableModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedTable);

    const result = await deleteTable(null, { tableId: mockTableId });

    expect(TableModel.findByIdAndDelete).toHaveBeenCalledWith(mockTableId);
    expect(result).toEqual({
      tableId: mockDeletedTable._id,
      tableName: mockDeletedTable.tableName,
      tableQr: mockDeletedTable.tableQr,
    });
  });

  it('should throw an error if table to delete not found', async () => {
    (TableModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(deleteTable(null, { tableId: mockTableId })).rejects.toThrow(`Table with ID ${mockTableId} not found`);

    expect(TableModel.findByIdAndDelete).toHaveBeenCalledWith(mockTableId);
  });
});

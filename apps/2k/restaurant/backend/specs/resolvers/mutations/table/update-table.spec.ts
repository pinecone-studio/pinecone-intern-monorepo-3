import { updateTable } from '../../../../src/resolvers/mutations/table/update-table';
import { TableModel } from '../../../../src/models/table.model';

jest.mock('../../../../src/models/table.model');

describe('updateTable', () => {
  const mockTableId = '123abc';
  const mockInput = { tableName: 'New Table Name' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update table name successfully', async () => {
    const mockTable = {
      _id: mockTableId,
      tableName: 'Old Table Name',
      tableQr: 'some-qr-code',
      save: jest.fn().mockResolvedValue(true),
    };

    (TableModel.findById as jest.Mock).mockResolvedValue(mockTable);
    (TableModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await updateTable(null, { tableId: mockTableId, input: mockInput });

    expect(TableModel.findById).toHaveBeenCalledWith(mockTableId);
    expect(TableModel.findOne).toHaveBeenCalledWith({ tableName: mockInput.tableName, _id: { $ne: mockTableId } });
    expect(mockTable.save).toHaveBeenCalled();
    expect(result).toEqual({
      tableId: mockTableId,
      tableName: mockInput.tableName,
      tableQr: mockTable.tableQr,
    });
  });

  it('should throw error if table not found', async () => {
    (TableModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateTable(null, { tableId: mockTableId, input: mockInput })).rejects.toThrow('Table not found');

    expect(TableModel.findById).toHaveBeenCalledWith(mockTableId);
  });

  it('should throw error if table name already exists', async () => {
    const mockTable = {
      _id: mockTableId,
      tableName: 'Old Table Name',
      save: jest.fn(),
    };

    (TableModel.findById as jest.Mock).mockResolvedValue(mockTable);
    (TableModel.findOne as jest.Mock).mockResolvedValue({ _id: 'otherId', tableName: mockInput.tableName });

    await expect(updateTable(null, { tableId: mockTableId, input: mockInput })).rejects.toThrow('Table name already exists');

    expect(TableModel.findById).toHaveBeenCalledWith(mockTableId);
    expect(TableModel.findOne).toHaveBeenCalledWith({ tableName: mockInput.tableName, _id: { $ne: mockTableId } });
  });
});

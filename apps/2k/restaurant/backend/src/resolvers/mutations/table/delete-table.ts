import { TableModel } from '../../../../src/models/table.model';

export const deleteTable = async (_: unknown, args: { tableId: string }) => {
  const { tableId } = args;

  const deleted = await TableModel.findByIdAndDelete(tableId);
  if (!deleted) {
    throw new Error(`Table with ID ${tableId} not found`);
  }

  return {
    tableId: deleted._id.toString(),
    tableName: deleted.tableName,
    tableQr: deleted.tableQr,
  };
};

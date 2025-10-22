import { TableModel } from '../../../../src/models/table.model';
import { UpdateTableInput } from '../../../generated';

export const updateTable = async (_: unknown, args: { tableId: string; input: UpdateTableInput }) => {
  const { tableId, input } = args;
  const { tableName } = input;

  const table = await TableModel.findById(tableId);
  if (!table) throw new Error('Table not found');

  // Шинэ нэр нь өөр ширээтэй давхцахгүйг шалгах
  const existingTable = await TableModel.findOne({ tableName, _id: { $ne: tableId } });
  if (existingTable) throw new Error('Table name already exists');

  table.tableName = tableName;

  await table.save();

  return {
    tableId: table._id.toString(),
    tableName: table.tableName,
    tableQr: table.tableQr,
  };
};

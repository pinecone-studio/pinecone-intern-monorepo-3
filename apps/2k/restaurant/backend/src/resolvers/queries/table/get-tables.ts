import { TableModel } from '../../../models/table.model';

export const getTables = async () => {
  try {
    const tables = await TableModel.find();

    return tables.map((table) => ({
      tableId: table._id.toString(),
      tableName: table.tableName,
      tableQr: table.tableQr,
      tableQrImage: table.tableQrImage,
    }));
  } catch (error) {
    throw new Error('Ширээний мэдээлэл авахад алдаа гарлаа');
  }
};

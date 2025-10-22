// get-tables-by-name.ts
import { TableModel } from '../../../models/table.model';

export const getTablesByName = async (_: unknown, { tableName }: { tableName: string }) => {
  try {
    const tables = await TableModel.find({ tableName });
    return tables;
  } catch (error) {
    throw new Error('Ширээний мэдээлэл авахад алдаа гарлаа');
  }
};

import { QueryResolvers } from "../../../generated";
import { TableModel } from "../../../models/tableModel";

export const getTableByName: QueryResolvers['getTableByName'] = async (_, { tableName }) => {
  const table = await TableModel.findOne({ tableName });

  if (!table) {
    throw new Error(`Table with name ${tableName} not found`);
  }

  return table;
};
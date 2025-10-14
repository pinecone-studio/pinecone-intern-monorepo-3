import { QueryResolvers } from "../../../generated";
import { TableModel } from "../../../models/tableModel";


export const getTables: QueryResolvers['getTables'] = async () => {
  const Tables = await TableModel.find();
  return Tables;
};
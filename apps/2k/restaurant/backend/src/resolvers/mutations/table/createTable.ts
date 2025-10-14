import { MutationResolvers } from '../../../generated';
import { TableModel } from '../../../models/tableModel';
import QRCode from 'qrcode';

export const createTable: MutationResolvers['createTable'] = async (_, { input: { tableName } }) => {
    
  const existingTable = await TableModel.findOne({ tableName });
  console.log("tableNamee",tableName);
  
  if (existingTable) throw new Error('table already exists');

  const generatedQr = await QRCode.toDataURL(`http://localhost:4201${tableName}`);
  const newTable = await TableModel.create({ tableName, tableQr: generatedQr });

  return newTable;
};
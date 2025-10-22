import QRCode from 'qrcode';
import { TableModel } from '../../../../src/models/table.model';
import { CreateTableInput } from '../../../generated';

export const createTable = async (_: unknown, input: { input: CreateTableInput }) => {
  const { tableName } = input.input;

  const existingTable = await TableModel.findOne({ tableName });
  if (existingTable) throw new Error('Table already exists');

  const totalTables = await TableModel.countDocuments();
  const tablesPerRow = 4;
  const rowNumber = Math.floor(totalTables / tablesPerRow) + 1;
  const columnLetter = String.fromCharCode(65 + (totalTables % tablesPerRow));
  const tableCode = `${rowNumber}${columnLetter}`;

  const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:4201';
  const qrUrl = `${BASE_URL}/order?table=${tableCode}`;
  const generatedQr = await QRCode.toDataURL(qrUrl);

  const newTable = await TableModel.create({
    tableName,
    tableQr: tableCode,
    tableQrImage: generatedQr,
  });

  return {
    tableId: newTable._id.toString(),
    tableName: newTable.tableName,
    tableQr: newTable.tableQr,
  };
};

import QRCode from 'qrcode';
import { TableModel } from '../../../models/table.model';
import { CreateTableInput } from '../../../generated';

export const createTable = async (_: unknown, input: { input: CreateTableInput }) => {
  const { tableName } = input.input;

  const existingTable = await TableModel.findOne({ tableName });
  if (existingTable) throw new Error('Table already exists');

  const totalTables = await TableModel.countDocuments();
  const tablesPerRow = 4; // 1 эгнээнд 4 ширээ
  const rowNumber = Math.floor(totalTables / tablesPerRow) + 1;
  const columnLetter = String.fromCharCode(65 + (totalTables % tablesPerRow)); // 0->A, 1->B, 2->C, 3->D

  const tableCode = `${rowNumber}${columnLetter}`; // Жишээ: 1A, 1B, 2C

  // 3️⃣ QR код үүсгэх — локал frontend рүү заана
  const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  const qrUrl = `${BASE_URL}/order?table=${tableCode}`;
  const generatedQr = await QRCode.toDataURL(qrUrl);

  // 4️⃣ Шинэ Table үүсгэх
  const newTable = await TableModel.create({
    tableName,
    tableQr: tableCode, // Ширээний код хадгалах (1A, 2B гэх мэт)
    tableQrImage: generatedQr, // QR image хадгалах
  });

  return newTable;
};

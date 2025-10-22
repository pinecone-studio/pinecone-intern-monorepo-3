// __tests__/createTable.test.ts
import { createTable } from 'apps/2k/restaurant/backend/src/resolvers/mutations';
import { TableModel } from '../../../../src/models/table.model';
import QRCode from 'qrcode';

jest.mock('../../../../src/models/table.model');
jest.mock('qrcode');

describe('createTable resolver', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, FRONTEND_URL: 'http://mock-frontend.com' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should create a new table successfully using FRONTEND_URL', async () => {
    (TableModel.findOne as jest.Mock).mockResolvedValue(null);
    (TableModel.countDocuments as jest.Mock).mockResolvedValue(0);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('mocked_qr_data');
    (TableModel.create as jest.Mock).mockResolvedValue({
      tableName: '1A',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });

    const input = { input: { tableName: '1A' } };
    const result = await createTable(null, input);

    expect(TableModel.findOne).toHaveBeenCalledWith({ tableName: '1A' });
    expect(TableModel.create).toHaveBeenCalledWith({
      tableName: '1A',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });
    expect(QRCode.toDataURL).toHaveBeenCalledWith('http://mock-frontend.com/order?table=1A');
    expect(result).toEqual({
      tableName: '1A',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });
  });

  it('should create a new table successfully using default BASE_URL', async () => {
    delete process.env.FRONTEND_URL; // default BASE_URL-г test-д ашиглана
    (TableModel.findOne as jest.Mock).mockResolvedValue(null);
    (TableModel.countDocuments as jest.Mock).mockResolvedValue(0);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('mocked_qr_data');
    (TableModel.create as jest.Mock).mockResolvedValue({
      tableName: '1A',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });

    const input = { input: { tableName: '1A' } };
    const result = await createTable(null, input);

    expect(QRCode.toDataURL).toHaveBeenCalledWith('http://localhost:3000/order?table=1A');
    expect(result.tableQrImage).toBe('mocked_qr_data');
  });

  it('should throw an error if table already exists', async () => {
    (TableModel.findOne as jest.Mock).mockResolvedValue({ tableName: '1A' });

    const input = { input: { tableName: '1A' } };
    await expect(createTable(null, input)).rejects.toThrow('Table already exists');
  });
});

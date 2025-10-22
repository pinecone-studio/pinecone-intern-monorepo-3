import { createTable } from '../../../../src/resolvers/mutations/table/create-table';
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
      _id: 'mockId',
      tableName: 'My Table',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });

    const input = { input: { tableName: 'My Table' } };
    const result = await createTable(null, input);

    expect(TableModel.findOne).toHaveBeenCalledWith({ tableName: 'My Table' });
    expect(TableModel.create).toHaveBeenCalledWith({
      tableName: 'My Table',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });
    expect(QRCode.toDataURL).toHaveBeenCalledWith('http://mock-frontend.com/order?table=1A');
    expect(result).toEqual({
      tableId: 'mockId',
      tableName: 'My Table',
      tableQr: '1A',
    });
  });

  it('should create a new table successfully using default BASE_URL', async () => {
    delete process.env.FRONTEND_URL; // default BASE_URL-г ашиглана
    process.env = { ...process.env, FRONTEND_URL: undefined }; // Мөн хэрэгтэй

    (TableModel.findOne as jest.Mock).mockResolvedValue(null);
    (TableModel.countDocuments as jest.Mock).mockResolvedValue(0);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('mocked_qr_data');
    (TableModel.create as jest.Mock).mockResolvedValue({
      _id: 'mockId2',
      tableName: 'My Table 2',
      tableQr: '1A',
      tableQrImage: 'mocked_qr_data',
    });

    const input = { input: { tableName: 'My Table 2' } };
    const result = await createTable(null, input);

    expect(QRCode.toDataURL).toHaveBeenCalledWith('http://localhost:4201/order?table=1A');
    expect(result).toEqual({
      tableId: 'mockId2',
      tableName: 'My Table 2',
      tableQr: '1A',
    });
  });

  it('should throw an error if table already exists', async () => {
    (TableModel.findOne as jest.Mock).mockResolvedValue({ tableName: 'My Table' });

    const input = { input: { tableName: 'My Table' } };
    await expect(createTable(null, input)).rejects.toThrow('Table already exists');
  });
});

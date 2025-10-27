'use client';
import { Button } from '@/components/ui/button';
import { DialogContainer } from './DialogContainer';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ImageDownloader } from '@/utils/image-downloader';

type TableData = {
  tableId: string;
  tableName: string;
  tableQr: string;
};

export const SeeTableModal = ({ data }: { data: TableData }) => {
  const baseUrl = 'https://restaurant-be-eta.vercel.app'; // ← одоохондоо локал
  const qrDataUrl = `${baseUrl}/?tableQr=${data.tableQr}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=291x291&data=${encodeURIComponent(qrDataUrl)}`;

  const handleDownload = () => {
    ImageDownloader(qrUrl, `${data.tableName}_QRcode.png`);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-[#F4F4F5] text-[14px] rounded-md flex w-fit px-2 h-[36px] items-center">QR харах</DialogTrigger>
      <DialogContainer
        title={`${data.tableName} ширээний QR код`}
        content={
          <div className="flex flex-col gap-4 items-center">
            <img src={qrUrl} width={291} height={291} alt="QR Code" />
            <Button onClick={handleDownload} className="w-full bg-black">
              QR татах
            </Button>
          </div>
        }
      />
    </Dialog>
  );
};

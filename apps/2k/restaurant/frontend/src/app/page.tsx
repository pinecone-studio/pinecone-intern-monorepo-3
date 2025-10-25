'use client';

import MenuPage from '@/components/home/HomePage';
import { QrScannerComponent } from '@/components/QrScanner';
import { useState } from 'react';

const Page = () => {
  const [tableQr, setTableQr] = useState<string | null>(null);

  return <div>{!tableQr ? <QrScannerComponent onScan={(qr) => setTableQr(qr)} /> : <MenuPage tableQr={tableQr} />}</div>;
};

export default Page;

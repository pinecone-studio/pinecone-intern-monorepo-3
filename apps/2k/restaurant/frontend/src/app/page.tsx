'use client';

import MenuPage from '@/components/home/HomePage';
import { QrScannerComponent } from '@/components/QrScanner';
import { useEffect, useMemo, useState } from 'react';
import { useGetTablesQuery } from '@/generated';

const Page = () => {
  const [tableQr, setTableQr] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);

  console.log('table id:', tableId);

  // When tableQr is known but tableId is missing, try to resolve via GraphQL
  const shouldFetchTables = useMemo(() => Boolean(tableQr) && !tableId, [tableQr, tableId]);
  const { data: tablesData } = useGetTablesQuery({ skip: !shouldFetchTables });

  useEffect(() => {
    if (shouldFetchTables && tablesData?.getTables) {
      const found = tablesData.getTables.find((t) => t.tableQr === tableQr);
      if (found?.tableId) setTableId(found.tableId);
    }
  }, [shouldFetchTables, tablesData, tableQr]);

  return (
    <div>
      {!tableQr ? (
        <QrScannerComponent
          onScan={(qr) => {
            try {
              const url = new URL(qr);
              const scannedTableQr = url.searchParams.get('tableQr');
              const scannedTableId = url.searchParams.get('tableId');
              setTableQr(scannedTableQr);
              setTableId(scannedTableId);
            } catch {
              // If not an absolute URL, try to extract query manually
              const queryPart = qr.includes('?') ? qr.substring(qr.indexOf('?') + 1) : qr;
              const params = new URLSearchParams(queryPart);
              const scannedTableQr = params.get('tableQr') || null;
              const scannedTableId = params.get('tableId') || null;
              if (scannedTableQr || scannedTableId) {
                setTableQr(scannedTableQr);
                setTableId(scannedTableId);
              } else {
                // Fallback: treat entire payload as tableQr
                setTableQr(qr);
                setTableId(null);
              }
            }
          }}
        />
      ) : (
        <MenuPage tableQr={tableQr} tableId={tableId} />
      )}
    </div>
  );
};

export default Page;

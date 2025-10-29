'use client';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SeeTableModal } from './SeeTableModal';
import { useGetTablesQuery, GetTablesQuery } from '@/generated';
import { Toaster } from 'sonner';
// import { CreateTableModal } from '@/components/features/admin-table/CreateTable.Modal';
// import { UpdateTableModal } from '@/components/features/admin-table/UpdateTable.Modal';
// import { DeleteTableModal } from '@/components/features/admin-table/DeleteTable.Modal';

export const TableGrid = () => {
  const { loading, error, data, refetch } = useGetTablesQuery();

  if (loading) return 'loading...';
  if (error) throw new Error(error.message);

  const tableData = data?.getTables;

  return (
    <div className="flex sm:w-[600px] w-full h-fit flex-col gap-4 px-4">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#441500]">Ширээний жагсаалт</h1>
        <button className="px-6 py-2.5 rounded-lg font-medium bg-[#441500] text-white hover:bg-amber-900 transition-colors">Ширээ үүсгэх</button>
      </div>

      {/* Table List */}
      <div className="flex flex-col p-5 bg-white border border-gray-200 rounded-xl shadow-sm h-fit max-h-[450px] overflow-scroll">
        {tableData?.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <h1 data-testid="admin-empty-message" className="text-sm text-gray-500">
              Ширээ үүсээгүй байна.
            </h1>
          </div>
        ) : (
          <>
            {tableData?.map((table: GetTablesQuery['getTables'][0]) => (
              <div data-testid="admin-table" key={table.tableId}>
                <div className="flex items-center justify-between w-full py-4">
                  <h1 className="font-semibold text-base text-gray-900">{table.tableName}</h1>
                  <div className="flex items-center gap-2">
                    <SeeTableModal data={table} />
                    {/* <UpdateTableModal refetch={refetch} tableId={table.tableId} currentName={table.tableName} /> */}
                    {/* <DeleteTableModal refetch={refetch} tableId={table.tableId} tableName={table.tableName} /> */}
                  </div>
                </div>
                {tableData.indexOf(table) < tableData.length - 1 && <Separator />}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

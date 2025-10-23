'use client';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { GetTablesQuery, useDeleteTableMutation } from '@/generated';
import { useState } from 'react';
import { toast } from 'sonner';
import { ApolloQueryResult } from '@apollo/client';
import { DialogContainer } from '@/components/admin/table/DialogContainer';

type DeleteTableModalProps = {
  refetch: () => Promise<ApolloQueryResult<GetTablesQuery>>;
  tableId: string;
  tableName: string;
};

export const DeleteTableModal = ({ tableId, tableName, refetch }: DeleteTableModalProps) => {
  const [deleteTable, { loading }] = useDeleteTableMutation();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Та ${tableName} ширээг устгахдаа итгэлтэй байна уу?`)) return;

    try {
      await deleteTable({ variables: { tableId } });

      await refetch();

      toast.success(`${tableName} ширээ амжилттай устгагдлаа`);

      setOpen(false);
    } catch (err: unknown) {
      toast.error('Амжилтгүй боллоо');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger data-cy="Admin-Delete-Table-Dialog-Trigger" className="bg-[#F4F4F5] text-[14px] rounded-md flex w-[36px] h-[36px] justify-center items-center">
        <Trash className="w-[13.22px] h-[13.22px]" />
      </DialogTrigger>

      <DialogContainer
        title="Ширээ устгах"
        content={
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#71717A]">Устгахдаа итгэлтэй байна уу?</p>
            <Button data-cy="Admin-Delete-Table-Button" disabled={loading} onClick={handleDelete} className="w-full bg-[#1D1F24]">
              {loading ? 'Устгаж байна...' : 'Устгах'}
            </Button>
          </div>
        }
      />
    </Dialog>
  );
};

'use client';
import { Pen } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { ApolloQueryResult } from '@apollo/client';
import { GetTablesQuery, useUpdateTableMutation } from '@/generated';
import { useState } from 'react';
import { toast } from 'sonner';
import { DialogContainer } from '@/components/admin/table/DialogContainer';

type UpdateTableModalProps = {
  refetch: () => Promise<ApolloQueryResult<GetTablesQuery>>;
  tableId: string;
  currentName: string;
};

export const UpdateTableModal = ({ tableId, currentName, refetch }: UpdateTableModalProps) => {
  const [updateTable, { loading }] = useUpdateTableMutation();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    tableName: z.string().min(1, { message: 'Ширээний нэр оруулна уу' }).max(10, { message: '10-c доош тэмдэгт ашиглана уу' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableName: currentName,
    },
  });

  const handleUpdateTable = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateTable({
        variables: {
          tableId,
          input: {
            tableName: values.tableName,
            tableQr: '', // шаардлагатай бол backend-д тохируулна
          },
        },
      });

      await refetch();

      form.reset({ tableName: values.tableName });

      toast.success('Ширээ амжилттай шинэчлэгдлээ');

      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('already exists')) {
          toast.error('Ширээний нэр давхардсан байна! Өөр нэр сонгоно уу');
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error('Алдаа гарлаа');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger data-cy="Admin-Update-Table-Dialog-Trigger" className="bg-[#F4F4F5] text-[14px] rounded-md flex w-[36px] h-[36px] justify-center items-center">
        <Pen className="w-[13.22px] h-[13.22px]" />
      </DialogTrigger>
      <DialogContainer
        title="Ширээ засах"
        content={
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateTable)} className="space-y-4">
              <FormField
                control={form.control}
                name="tableName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input data-cy="Admin-Update-Table-Input" placeholder="Ширээний нэр" {...field} />
                    </FormControl>
                    <FormMessage data-testid="Admin-Update-Table-Error-Message" />
                  </FormItem>
                )}
              />
              <Button data-cy="Admin-Update-Table-Button" disabled={loading} className="w-full bg-[#1D1F24]" type="submit">
                {loading ? 'Шинэчилж байна...' : 'Шинэчлэх'}
              </Button>
            </form>
          </Form>
        }
      />
    </Dialog>
  );
};

import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { GetTablesQuery, useCreateTableMutation } from '@/generated';
import { useState } from 'react';
import { toast } from 'sonner';
import { ApolloQueryResult } from '@apollo/client';
import { DialogContainer } from '@/components/admin/table/DialogContainer';

type CreateTableModalProps = {
  refetch: () => Promise<ApolloQueryResult<GetTablesQuery>>;
};

const formSchema = z.object({
  tableName: z.string().min(1, { message: 'Ширээний нэр оруулна уу' }).max(10, { message: '10-с доош тэмдэгт ашиглана уу' }),
});

export const CreateTableModal = ({ refetch }: CreateTableModalProps) => {
  const [CreateTable, { loading }] = useCreateTableMutation();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableName: '',
    },
  });

  const handleTableCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      await CreateTable({
        variables: {
          input: {
            tableName: values.tableName,
          },
        },
      });

      refetch();

      form.reset();

      toast.success(`${values.tableName} ширээ амжилттай үүслээ`);

      setOpen(false);
    } catch (err: unknown) {
      // Давхар нэрийг backend-аас ирсэн алдаагаар шалгах
      if (err instanceof Error) {
        if (err.message.includes('already exists')) {
          toast.error(`Ширээний нэр давхардсан байна! Өөр нэр сонгоно уу`);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error('Алдаа гарлаа');
      }
    }
  };

  return (
    <div data-testid="Create-Table" className="w-full flex justify-between items-center">
      <h1 className="font-semibold text-[28px]">Ширээ</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger data-testid="Admin-Create-Table-Dialog-Trigger" className="bg-white text-[14px] font-medium rounded-md flex w-fit px-4 h-[36px] items-center gap-1">
          Ширээ <Plus className="h-4 w-4 stroke-[2px]" />
        </DialogTrigger>
        <DialogContainer
          title="Ширээ нэмэх"
          content={
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleTableCreate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tableName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input data-testid="Admin-Create-Table-Input" placeholder="Ширээний нэр" {...field} />
                      </FormControl>
                      <FormMessage data-testid="Admin-Create-Table-Error-Message" />
                    </FormItem>
                  )}
                />
                <Button data-testid="Admin-Create-Table-Button" className="w-full bg-[#1D1F24]" type="submit" disabled={loading}>
                  {loading ? 'Үүсгэж байна...' : 'Үүсгэх'}
                </Button>
              </form>
            </Form>
          }
        />
      </Dialog>
    </div>
  );
};

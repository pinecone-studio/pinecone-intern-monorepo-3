import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
export const CheckGuest = () => {
  const form = useFormContext();
  return (
    <div>
      <FormField
        control={form.control}
        name="firstname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First name </FormLabel>
            <FormControl>
              <Input placeholder="Enter first name here" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="middlename"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Middle name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter middle name here" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Last name here" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

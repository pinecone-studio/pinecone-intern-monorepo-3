import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CheckPayment = () => {
  const form = useFormContext();
  return (
    <div>
      <h1 className="font-semibold text-xl">3. Reservation card detail</h1>
      <p className="text-sm text-muted-foreground">Safe, secure transactions. Your personal information is protectd</p>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="cardname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name on card</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardnumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number on card</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration date</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" placeholder="MM/YY" maxLength={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Security code (CVV)</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" maxLength={4} placeholder="CVV" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              {/* ⬇️ Trigger дээр биш, Select дээр binding хий! */}
              <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Mongolia">Mongolia</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

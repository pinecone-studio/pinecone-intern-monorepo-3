import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export const AppearanceTab = () => {
  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-medium">Appearance</h2>
        <p className="text-sm text-muted-foreground">Choose how the app looks to you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block text-sm">Theme</Label>
          <Select defaultValue="system">
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 w-[--radix-select-trigger-width]">
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Font size</Label>
          <Select defaultValue="md">
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 w-[--radix-select-trigger-width]">
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

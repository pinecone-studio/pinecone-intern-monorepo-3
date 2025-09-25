import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export const DisplayTab = () => {
  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-medium">Display</h2>
        <p className="text-sm text-muted-foreground">Localization & formatting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="mb-2 block text-sm">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 w-[--radix-select-trigger-width]">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="mn">Монгол</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Currency</Label>
          <Select defaultValue="mnt">
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 w-[--radix-select-trigger-width]">
              <SelectItem value="mnt">MNT (₮)</SelectItem>
              <SelectItem value="usd">USD ($)</SelectItem>
              <SelectItem value="eur">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Timezone</Label>
          <Select defaultValue="asia-ulaanbaatar">
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 w-[--radix-select-trigger-width]">
              <SelectItem value="asia-ulaanbaatar">Asia/Ulaanbaatar (UTC+8)</SelectItem>
              <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
              <SelectItem value="utc">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

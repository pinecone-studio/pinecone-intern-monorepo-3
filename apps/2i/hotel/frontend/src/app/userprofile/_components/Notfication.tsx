import { Switch } from '@/components/ui/switch';

export const NotificationsTab = () => {
  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-medium">Notifications</h2>
        <p className="text-sm text-muted-foreground">Control what updates you receive.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <div className="text-sm font-medium">Booking updates</div>
            <div className="text-sm text-muted-foreground">Trip reminders and changes.</div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <div className="text-sm font-medium">Promotions</div>
            <div className="text-sm text-muted-foreground">Deals and special offers.</div>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <div className="text-sm font-medium">Security alerts</div>
            <div className="text-sm text-muted-foreground">Account activity & sign-ins.</div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </section>
  );
};

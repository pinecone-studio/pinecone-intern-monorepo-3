import { Key, Mail } from 'lucide-react';

export const Account = () => {
  return (
    <div>
      {' '}
      <h2 className="text-lg font-semibold">Security &amp; Settings</h2>
      <p className="text-sm text-muted-foreground mb-4">keep your account safe with a secure password</p>
      {/* Example cards same style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
              <Mail className="w-4 h-4" />
            </span>
            <div className="leading-tight">
              <div className="text-sm">Email</div>
              <div className="text-xs text-muted-foreground">n.shagai@pinecone.mn</div>
            </div>
          </div>
          <span className="text-xl">›</span>
        </div>

        <button className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            {/* <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border"> */}
            <Key className="w-4 h-4" />

            <div className="leading-tight text-left">
              <div className="text-sm">Change password</div>
              <div className="text-xs text-muted-foreground">Update your password</div>
            </div>
          </div>
          <span className="text-xl">›</span>
        </button>
      </div>{' '}
    </div>
  );
};

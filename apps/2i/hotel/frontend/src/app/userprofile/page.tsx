import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Profile } from './_components/Profile';
import { Account } from './_components/Account';
import { AppearanceTab } from './_components/Appearance';
import { NotificationsTab } from './_components/Notfication';
import { DisplayTab } from './_components/Display';

const ProfilePage = () => {
  return (
    <div className="mx-auto max-w-[1334px] px-6 pt-10 pb-16">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Hi, Shagai</h1>
          <p className="text-muted-foreground">n.shagai@pinecone.mn</p>
        </div>

        {/* Separator */}
        <div className="border-b" />

        {/* Main layout */}
        <Tabs defaultValue="profile" className="grid gap-6 grid-cols-1 md:[grid-template-columns:220px_1fr]">
          {/* Sidebar */}
          <TabsList
            className="
              bg-transparent p-0 flex flex-col items-stretch space-y-1
               md:pr-6 mt-20
            "
          >
            <TabsTrigger value="profile" className="w-full justify-start text-left px-3 py-2 rounded-md data-[state=active]:bg-[#F4F4F5] hover:bg-[#F4F4F5]">
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="w-full justify-start text-left px-3 py-2 rounded-md data-[state=active]:bg-[#F4F4F5] hover:bg-[#F4F4F5]">
              Account
            </TabsTrigger>
            <TabsTrigger value="appearance" className="w-full justify-start text-left px-3 py-2 rounded-md data-[state=active]:bg-[#F4F4F5] hover:bg-[#F4F4F5]">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full justify-start text-left px-3 py-2 rounded-md data-[state=active]:bg-[#F4F4F5] hover:bg-[#F4F4F5]">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="display" className="w-full justify-start text-left px-3 py-2 rounded-md data-[state=active]:bg-[#F4F4F5] hover:bg-[#F4F4F5]">
              Display
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="min-w-0 md:pl-6">
            <TabsContent value="profile" className="mt-0">
              <Profile />
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <Account />
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <AppearanceTab />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="display" className="mt-0">
              <DisplayTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;

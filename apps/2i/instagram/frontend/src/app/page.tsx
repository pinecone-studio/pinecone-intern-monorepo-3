import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Feed } from '@/components/Feed/Feed';

const Page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Feed />
      </main>
    </div>
  );
};

export default Page;

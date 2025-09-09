'use client';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith('/admin')) return null;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const handleLogOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };
  return (
    <header className="relative w-full bg-[#013B94] h-[280px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2 text-white">
          <div className="h-4 w-4  bg-white border rounded-full" />
          <span className="text-xl font-semibold">Pedia</span>
        </div>
        {token ? (
          <Button variant="outline" onClick={handleLogOut}>
            Sign out
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <button className="rounded-md px-3 py-1.5 text-sm text-white/90 hover:bg-white/10" onClick={() => router.push('/signup')}>
              Register
            </button>
            <button className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[#013B94] hover:bg-white/90" onClick={() => router.push('/login')}>
              Sign in
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-[36px]">Find the Best Hotel for Your Stay</h1>
        <p className="mt-1 text-white/90">Book from a wide selection of hotels for your next trip.</p>
      </div>
    </header>
  );
};

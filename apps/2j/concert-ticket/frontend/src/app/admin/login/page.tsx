'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up to real admin login mutation
    console.log('Admin login attempt', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-3 w-3 rounded-full bg-sky-500 inline-block" />
          <span className="text-2xl font-semibold tracking-wide">TICKET BOOKING</span>
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-semibold text-amber-900 mb-8">Нэвтрэх</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Имэйл хаяг"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <button
            type="submit"
            className="w-full rounded-md bg-black text-white py-3 text-lg font-medium hover:opacity-90 transition"
          >
            Нэвтрэх
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/admin/forgot-password" className="text-gray-700 hover:underline">
            Нууц үг мартсан?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;



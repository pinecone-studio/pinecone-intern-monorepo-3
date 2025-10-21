'use client';

import Link from 'next/link';

export default function SignUpSuccess() {
  return (
    <div className="bg-black min-h-screen w-screen flex justify-center items-center text-white p-4">
      <div className="w-2/3 max-w-lg border border-neutral-600 rounded-md flex flex-col p-8 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-400 mb-2">Амжилттай бүртгүүллээ!</h1>
          <p className="text-neutral-400 mb-4">Тавтай морилно уу!</p>
          <p className="text-sm text-neutral-500">Таны бүртгэл амжилттай үүсгэгдлээ. Одоо та системд нэвтэрч болно.</p>
        </div>

        <div className="flex gap-4">
          <Link href="/" className="flex-1 bg-blue-400 text-black rounded-lg py-3 text-center hover:bg-blue-500 transition-colors font-medium">
            Нүүр хуудас руу очих
          </Link>
          <Link href="/profile" className="flex-1 bg-neutral-700 text-white rounded-lg py-3 text-center hover:bg-neutral-600 transition-colors font-medium">
            Профайл харах
          </Link>
        </div>
      </div>
    </div>
  );
}

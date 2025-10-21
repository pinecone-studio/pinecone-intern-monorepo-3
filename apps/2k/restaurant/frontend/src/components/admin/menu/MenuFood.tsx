import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { DialogDemo } from './TabNeg/AddFoodCategory';
import { Pen } from 'lucide-react';
import { DeleteFood } from './TabNeg/DeleteFoodCategory';

export const MenuFood = () => {
  const categories = [
    { name: 'Үндсэн', slug: 'undsen' },
    { name: 'Кофе, цай', slug: 'coffee-tsai' },
    { name: 'Ус, ундаа', slug: 'us-undaa' },
    { name: 'Хямдрал', slug: 'hymdral' },
    { name: 'Амттан', slug: 'amttan' },
    { name: 'Улирлын', slug: 'ulirliin' },
  ];

  const [activeCategory, setActiveCategory] = useState('undsen');

  return (
    <Card className="border-gray-200 shadow-sm">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[18px] font-semibold text-gray-800">Цэс</CardTitle>
        <DialogDemo />
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Категори товчнууд */}
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                activeCategory === category.slug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Food card */}

        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <img src="https://i.pinimg.com/736x/4a/70/74/4a7074e01ac804231a3956c5933cd106.jpg" alt="Taso" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
            <div className="flex flex-col justify-center leading-snug">
              <p className="text-[15px] font-medium text-gray-700 tracking-tight">Taso</p>
              <p className="text-[17px] font-semibold text-gray-900 mt-0.5">4₮</p>
              <p className="text-[13px] font-medium text-gray-500 mt-0.5 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                идэвхитэй
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all">
              <Pen className="w-4 h-4" />
            </button>
            <DeleteFood />
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </Card>
  );
};

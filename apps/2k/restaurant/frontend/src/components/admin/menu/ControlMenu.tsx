import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { AddDialog } from './TabHoyr/DiscountDialog';
import { AddCategoryDialog } from './TabHoyr/AddCategoryDialog';

import { DeleteFood } from './TabHoyr/DeleteCategory';

export const ControlMenu = () => {
  const navbar = [
    { name: 'Бүгд', slug: 'all' },
    { name: 'Цэс', slug: 'menu' },
    { name: 'Хямдрал', slug: 'discount' },
  ];

  const All = [{ name: 'Үндсэн' }, { name: 'Кофе, цай' }, { name: 'Ус, ундаа' }, { name: 'Хямдрал' }, { name: 'Амттан' }, { name: 'Улирлын' }];

  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-[18px] font-semibold text-gray-800">Цэс удирдах</CardTitle>

        <div className="flex items-center gap-2">
          <AddDialog />
          <AddCategoryDialog isUpdate={false} />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-5">
        {/* Navbar buttons */}
        <div className="flex flex-wrap gap-2">
          {navbar.map((item) => (
            <button
              key={item.slug}
              onClick={() => setActiveCategory(item.slug)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${activeCategory === item.slug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Category list */}
        <div className="space-y-2">
          {All.map((category, index) => (
            <div key={index} className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 transition-all duration-200">
              <p className="text-[15px] font-medium text-gray-800">{category.name}</p>

              <div className="flex items-center gap-1.5">
                {/* <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all">
                  <Pen className="w-4 h-4" />
                </button> */}

                <AddCategoryDialog isUpdate={true} />
                <DeleteFood />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {All.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <p className="text-[15px] font-medium">Одоогоор өгөгдөл алга байна</p>
            <p className="text-[13px] text-gray-400 mt-1">Шинэ ангилал эсвэл хямдрал нэмэх товчийг ашиглана уу.</p>
          </div>
        )}
      </CardContent>

      {/* Footer */}

    </Card>
  );
};

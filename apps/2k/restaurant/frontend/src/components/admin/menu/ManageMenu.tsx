import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { AddDialog } from './ManageMenu/DiscountDialog';
import { AddCategoryDialog } from './ManageMenu/CategoryAddUpdate';
import { Category, GetCategoriesQuery } from '@/generated';
import { ApolloQueryResult } from '@apollo/client';
import { ItemCard } from './ManageMenu/CategoryCard';
import { DiscountItemCard } from './ManageMenu/DiscountItem';
import { EmptyState } from './ManageMenu/EmptyState';



export const mockDiscounts = [
  {
    id: '1',
    discountName: 'Summer Sale',
    discountRate: 15, // хувь
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    createdAt: '2025-05-20T10:00:00Z',
    updatedAt: '2025-05-21T12:00:00Z',
    // food: [{ id: "101", name: "Burger", price: 5000 }],
  },
  {
    id: '2',
    discountName: 'Weekend Special',
    discountRate: 20,
    startDate: '2025-10-25',
    endDate: '2025-10-26',
    createdAt: '2025-10-20T08:30:00Z',
    updatedAt: '2025-10-22T09:15:00Z',
    // food: [{ id: "102", name: "Pizza", price: 8000 }],
  },
  {
    id: '3',
    discountName: 'New Year Offer',
    discountRate: 25,
    startDate: '2025-12-31',
    endDate: '2026-01-01',
    createdAt: '2025-12-01T14:00:00Z',
    updatedAt: '2025-12-10T16:00:00Z',
    // food: [{ id: "103", name: "Sushi Set", price: 12000 }],
  },
];

export const ManageMenu = ({ categories, refetchCategory }: { categories: Category[]; refetchCategory: () => Promise<ApolloQueryResult<GetCategoriesQuery>> }) => {
  const navbar = [
    { name: 'Бүгд', slug: 'all' },
    { name: 'Цэс', slug: 'menu' },
    { name: 'Хямдрал', slug: 'discount' },
  ];

  const [activeCategory, setActiveCategory] = useState('menu'); // default — "Цэс"

  console.log('activeCategory', activeCategory);

  const allItems = [...categories, ...mockDiscounts];

  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-[18px] font-semibold text-gray-800">Цэс удирдах</CardTitle>

        <div className="flex items-center gap-2">
          <AddDialog />
          <AddCategoryDialog isUpdate={false} refetchCategory={refetchCategory}  />
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

        {/* Content depending on activeCategory */}

        <div className="space-2y">
          {activeCategory === 'menu' && categories.map((category) => <ItemCard key={category.categoryId} category={category} refetchCategory={refetchCategory} />)}

          {activeCategory === 'discount' && categories.map((discount) => <DiscountItemCard key={discount.categoryId} category={discount} refetchCategory={refetchCategory} />)}

          {/* {activeCategory === 'all' && (
            <>
              {categories.map((category) => (
                <ItemCard key={category.categoryId} category={category} refetchCategory={refetchCategory} />
              ))}
              {discountCategories.map((discount) => (
                <DiscountCard key={discount.discountId} discount={discount} refetchCategory={refetchCategory} />
              ))}
            </>
          )} */}
        </div>

        {/* Other tabs */}
        {/* {activeCategory === 'discount' && <div className="text-gray-500 text-sm py-10 text-center">Хямдралын тохиргоо энд гарна.</div>} */}

        {activeCategory === 'all' && (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <ItemCard key={index} category={category} refetchCategory={refetchCategory} />
            ))}

            {/* Empty state */}
            {categories.length === 0 && <EmptyState />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

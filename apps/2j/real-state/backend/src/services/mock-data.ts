export const mockProperties = [
  {
    _id: '1',
    title: 'Цагаан давааны шинэ орон сууц',
    price: 450000000,
    location: 'Цагаан даваа, Улаанбаатар',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: 'apartment',
    image: '/executive-condo-suite.jpg',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Сүхбаатар дүүргийн гэр',
    price: 320000000,
    location: 'Сүхбаатар дүүрэг, Улаанбаатар',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    type: 'house',
    image: '/contemporary-family-home.jpg',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Хан-Уул дүүргийн оффис',
    price: 280000000,
    location: 'Хан-Уул дүүрэг, Улаанбаатар',
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    type: 'commercial',
    image: '/urban-loft.jpg',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const getMockProperties = (limit = 20, offset = 0) => {
  return mockProperties.slice(offset, offset + limit);
};

export const getMockPropertyById = (id: string) => {
  return mockProperties.find(p => p._id === id);
};

export const getMockFeaturedProperties = (limit = 6) => {
  return mockProperties.filter(p => p.featured).slice(0, limit);
};

export const searchMockProperties = (query: string | undefined, limit = 20) => {
  let results = mockProperties;
  
  if (query) {
    results = results.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return results.slice(0, limit);
};

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Land Properties - Real Estate',
  description: 'Browse land properties for sale and development',
};

const LandPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Land Properties</h1>
      <p className="text-gray-600 mb-8">
        Discover land opportunities for residential and commercial development.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Residential Land</h3>
          <p className="text-gray-600">Prime locations for residential development</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Commercial Land</h3>
          <p className="text-gray-600">Strategic locations for commercial projects</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Agricultural Land</h3>
          <p className="text-gray-600">Fertile land for farming and agriculture</p>
        </div>
      </div>
    </div>
  );
};

export default LandPage;

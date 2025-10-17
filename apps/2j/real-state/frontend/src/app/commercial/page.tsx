import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Properties - Real Estate',
  description: 'Browse commercial properties for sale and rent',
};

const CommercialPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Commercial Properties</h1>
      <p className="text-gray-600 mb-8">
        Find the perfect commercial space for your business needs.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Office Spaces</h3>
          <p className="text-gray-600">Modern office buildings in prime locations</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Retail Spaces</h3>
          <p className="text-gray-600">High-traffic retail locations for your business</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Warehouses</h3>
          <p className="text-gray-600">Large storage and distribution facilities</p>
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;

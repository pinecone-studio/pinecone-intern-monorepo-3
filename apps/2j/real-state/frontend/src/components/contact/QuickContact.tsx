import { Phone } from 'lucide-react';

const QuickContact = () => {
  return (
    <div className="bg-blue-600 text-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Шуурхай холбоо</h3>
      <p className="text-blue-100 mb-4">
        Яаралтай асуудал байвал шууд утасдаарай
      </p>
      <a
        href="tel:+97611123456"
        className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
      >
        <Phone className="h-4 w-4 mr-2" />
        +976 11 123456
      </a>
    </div>
  );
};

export default QuickContact;

import { Phone, Mail } from 'lucide-react';

const ContactCTA = () => {
  return (
    <div className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Бидэнтэй холбогдох</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Асуулт байвал бидэнтэй холбогдоорой. Манай мэргэжилтнүүд танд туслана.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+97611123456"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
          >
            <Phone className="h-5 w-5 mr-2" />
            +976 11 123456
          </a>
          <a
            href="mailto:info@realestate.mn"
            className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
          >
            <Mail className="h-5 w-5 mr-2" />
            info@realestate.mn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactCTA;

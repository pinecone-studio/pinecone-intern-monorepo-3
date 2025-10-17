import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactCTA = () => {
  return (
    <div className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Холбоо барих</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Асуулт байвал бидэнтэй холбогдоорой. Манай мэргэжилтнүүд танд туслана.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            +976 11 123456
          </Button>
          <Button variant="outline" className="flex items-center bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
            <Mail className="h-5 w-5 mr-2" />
            info@realestate.mn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactCTA;

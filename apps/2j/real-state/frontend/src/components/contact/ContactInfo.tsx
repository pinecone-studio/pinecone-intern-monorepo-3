import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactInfo = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Хаяг',
      details: ['Улаанбаатар хот', 'Сүхбаатар дүүрэг, 1-р хороо', 'RealEstate.mn байр'],
    },
    {
      icon: Phone,
      title: 'Утас',
      details: ['+976 11 123456', '+976 11 123457', '24/7 үйлчилгээ'],
    },
    {
      icon: Mail,
      title: 'И-мэйл',
      details: ['info@realestate.mn', 'support@realestate.mn', 'sales@realestate.mn'],
    },
    {
      icon: Clock,
      title: 'Ажлын цаг',
      details: ['Даваа - Баасан: 9:00 - 18:00', 'Бямба: 9:00 - 15:00', 'Ням: Амралт'],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Холбоо барих мэдээлэл</h2>
        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <info.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-gray-600 mb-1">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

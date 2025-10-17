import Image from 'next/image';

interface TeamMember {
  name: string;
  position: string;
  image: string;
  description: string;
}

const TeamSection = () => {
  const team: TeamMember[] = [
    {
      name: 'Батбаяр',
      position: 'Гүйцэтгэх захирал',
      image: '/api/placeholder/300/300',
      description: '15 жилийн туршлагатай үл хөдлөх хөрөнгийн салбарт ажиллаж байна.',
    },
    {
      name: 'Сараа',
      position: 'Худалдааны менежер',
      image: '/api/placeholder/300/300',
      description: 'Орон сууцны худалдаа, түрээслэлтэд мэргэшсэн.',
    },
    {
      name: 'Энхтуяа',
      position: 'Хууль зүйн зөвлөх',
      image: '/api/placeholder/300/300',
      description: 'Үл хөдлөх хөрөнгийн гэрээ, эрх зүйн асуудалд мэргэшсэн.',
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Манай баг</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мэргэжлийн туршлагатай, хэрэглэгчдэд үйлчилэхдээ урам зоригтой баг
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.position}</p>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;

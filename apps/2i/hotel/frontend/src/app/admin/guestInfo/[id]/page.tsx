import { use } from 'chai';
import { GuestBooking } from '../_Components/GuestBooking';
import { GuestInfo } from '../_Components/GuestInfo';
import { ChevronLeft } from 'lucide-react';

type Props = {
  params: { id: string };
};

const GuestPage = async ({ params }: Props) => {
  // const guest = await getUserDataById(params.id);

  const guest = {
    firstName: 'Shagai',
    lastName: 'Nyamdorj',
    status: 'Booked',
    checkIn: 'Oct 20, Monday, Jul 1, 3:00pm',
    checkOut: 'Oct 21, Tuesday, Jul 3, 11:00am',
    email: 'n.shagai@pinecone.mn',
    phoneNumber: '+976 99112233',
    guestRequest: 'No Request',
    roomNumber: 'Room #502',
  };

  const booking = {
    roomType: 'Economy Double Room, City View',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200',
    nights: 1,
    pricePerNight: 150000,
    taxes: 12000,
  };

  return (
    <div className="p-6  gap-6">
      <div>
        <button className="flex justify-center items-center text-2xl font-semibold mb-4 text-gray-800 gap-5">
          <ChevronLeft /> {guest.firstName}
        </button>
      </div>
      <div className="flex gap-5">
        <div className="md:col-span-2">
          <GuestInfo guest={guest} />
        </div>
        <div className="md:col-span-1">
          <GuestBooking booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default GuestPage;

import React from 'react';
import Image from 'next/image';
type GuestBookingProps = {
  booking: {
    roomType: string;
    image: string;
    nights: number;
    pricePerNight: number;
    taxes: number;
  };
};

export const GuestBooking: React.FC<GuestBookingProps> = ({ booking }) => {
  const total = booking.pricePerNight * booking.nights + booking.taxes;

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-2xl shadow-sm backdrop-brightness-125 ">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold">{booking.roomType}</h3>
          <button className="text-blue-600 text-sm hover:underline">View</button>
        </div>
        <Image src={booking.image} alt="Room" className="w-full h-40 object-cover rounded-lg" />
      </div>

      <div className="p-4 border rounded-2xl shadow-sm backdrop-brightness-125">
        <h3 className="text-md font-semibold mb-2">Price Detail</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{booking.nights} night</span>
            <span>{booking.pricePerNight.toLocaleString()}₮</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>{booking.pricePerNight.toLocaleString()}₮ per night</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{booking.taxes.toLocaleString()}₮</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total price</span>
            <span>{total.toLocaleString()}₮</span>
          </div>
        </div>
      </div>
    </div>
  );
};

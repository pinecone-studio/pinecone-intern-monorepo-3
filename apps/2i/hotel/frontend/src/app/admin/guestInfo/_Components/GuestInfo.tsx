import React from 'react';
import { CheckoutDialog } from './CheckoutDialog';

type GuestInfoProps = {
  guest: {
    firstName: string;
    lastName: string;
    status?: string;
    checkIn?: string; // Example: "Oct 20, Monday, Jul 1, 3:00pm"
    checkOut?: string; // Example: "Oct 21, Tuesday, Jul 3, 11:00am"
    email?: string;
    phoneNumber?: string;
    guestRequest?: string;
    roomNumber?: string;
    adults?: number; // Added for guest count
    children?: number; // Added for guest count
  };
};

export const GuestInfo: React.FC<GuestInfoProps> = ({ guest }) => {
  const totalGuests = (guest.adults || 0) + (guest.children || 0);

  return (
    <div className="backdrop-brightness-125 p-6 rounded-lg shadow-md max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Guest Info</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* First Name */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">First name</span>
          <span className="text-gray-800 font-medium">{guest.firstName}</span>
        </div>
        {/* Last Name */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Last name</span>
          <span className="text-gray-800 font-medium">{guest.lastName}</span>
        </div>

        {/* Status */}
        {guest.status && (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Status</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${guest.status === 'Booked' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {guest.status}
            </span>
          </div>
        )}
        {/* Guests */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Guests</span>
          <span className="text-gray-800 font-medium">
            {guest.adults || 0} adult, {guest.children || 0} children
          </span>
        </div>

        {/* Check in */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Check in</span>
          <span className="text-gray-800 font-medium">{guest.checkIn}</span>
        </div>
        {/* Check out */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Check out</span>
          <span className="text-gray-800 font-medium">{guest.checkOut}</span>
        </div>

        {/* Email */}
        {guest.email && (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">{guest.email}</span>
          </div>
        )}
        {/* Phone number */}
        {guest.phoneNumber && (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Phone number</span>
            <span className="text-gray-800 font-medium">{guest.phoneNumber}</span>
          </div>
        )}

        {/* Guest Request */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Guest Request</span>
          <span className="text-gray-800 font-medium">{guest.guestRequest || 'No Request'}</span>
        </div>
        {/* Room Number */}
        {guest.roomNumber && (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Room Number</span>
            <span className="text-gray-800 font-medium">{guest.roomNumber}</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <CheckoutDialog />
      </div>
    </div>
  );
};

import React from 'react';
import { CheckoutDialog } from './CheckoutDialog';
import { InfoRow, StatusBadge } from './InfoRow';

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
  return (
    <div className="backdrop-brightness-125 p-6 rounded-lg shadow-md max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Guest Info</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <InfoRow label="First name" value={guest.firstName} />
        <InfoRow label="Last name" value={guest.lastName} />
        {guest.status && (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Status</span>
            <StatusBadge status={guest.status} />
          </div>
        )}
        <InfoRow label="Guests" value={`${guest.adults || 0} adult, ${guest.children || 0} children`} />
        <InfoRow label="Check in" value={guest.checkIn} />
        <InfoRow label="Check out" value={guest.checkOut} />
        <InfoRow label="Email" value={guest.email} />
        <InfoRow label="Phone number" value={guest.phoneNumber} />
        <InfoRow label="Guest Request" value={guest.guestRequest || 'No Request'} />
        <InfoRow label="Room Number" value={guest.roomNumber} />
      </div>

      <div className="mt-8 flex justify-end">
        <CheckoutDialog />
      </div>
    </div>
  );
};

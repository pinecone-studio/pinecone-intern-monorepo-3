'use client';

import React from 'react';
import { Mail, Phone, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-8 text-white bg-black">
      <div className="max-w-[1400px] mx-auto flex justify-between items-start">
        {/* Left Section - Branding */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2" data-testid="footer-logo">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-lg font-bold">TICKET BOOKING</span>
          </div>
          <p className="text-sm text-gray-400" data-testid="footer-copyright">
            © 2024 Booking Mongolia. All Rights Reserved.
          </p>
        </div>

        {/* Right Section - Contact Information */}
        <div className="flex flex-col space-y-3">
          <h3 className="mb-2 text-sm font-medium text-gray-500" data-testid="contact-header">
            Contact Information
          </h3>

          <div className="flex items-center gap-3" data-testid="email">
            <Mail className="w-4 h-4 text-white" />
            <div>
              <span className="text-sm text-gray-400">Email:</span>
              <span className="ml-2 text-sm text-white">support@ticketinbooking.mn</span>
            </div>
          </div>

          <div className="flex items-center gap-3" data-testid="phone">
            <Phone className="w-4 h-4 text-white" />
            <div>
              <span className="text-sm text-gray-400">Phone:</span>
              <span className="ml-2 text-sm text-white">+976 (11) 123-4567</span>
            </div>
          </div>

          <div className="flex items-center gap-3" data-testid="support">
            <Headphones className="w-4 h-4 text-white" />
            <div>
              <span className="text-sm text-gray-400">Customer Support:</span>
              <span className="ml-2 text-sm text-white">Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

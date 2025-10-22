import React from 'react';
import { Mail, Phone, Headset } from 'lucide-react';

interface Props {
  className?: string;
}

const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer className={`mt-[24px] w-full bg-[#0e0e0e] ${className ?? ''}`}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[16px] py-[48px] text-[12px] font-light text-gray-400">
        <div>
          <div className="flex items-center gap-[8px]">
            <div data-testid="footer-logo-dot" className="h-[12px] w-[12px] rounded-full bg-cyan-400" />
            <span data-testid="footer-logo" className="text-[16px] font-semibold tracking-wide text-white">
              TICKET BOOKING
            </span>
          </div>
          <div className="mt-[12px] text-[12px] font-light text-gray-500">© 2024 Booking Mongolia. All Rights Reserved.</div>
        </div>
        <div className="flex items-start gap-[32px]">
          <div>
            <div className="mb-[12px] text-[14px] font-light text-gray-300">Contact Information</div>
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[8px]">
                <Mail size={16} className="text-gray-500" />
                <span className="font-light">support@ticketbooking.mn</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <Phone size={16} className="text-gray-500" />
                <span className="font-light">+976 1234-5678</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <Headset size={16} className="text-gray-500" />
                <span className="font-light">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

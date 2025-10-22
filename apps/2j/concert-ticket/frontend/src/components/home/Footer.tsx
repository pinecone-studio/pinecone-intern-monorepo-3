import React from 'react';

interface Props {
  className?: string;
}

const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer className={`mt-[24px] w-full bg-[#0e0e0e] ${className ?? ''}`}>
      <div className="mx-auto max-w-[1200px] px-[16px] py-[24px] text-[12px] text-gray-400">
        <div className="flex items-center gap-[8px]">
          <div data-testid="footer-logo-dot" className="h-[8px] w-[8px] rounded-full bg-cyan-400" />
          <span data-testid="footer-logo">TICKET BOOKING</span>
        </div>
        <div className="mt-[12px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 md:grid-cols-3">
          <div>© 2025 Booking Mongolia. All Rights Reserved.</div>
          <div>support@ticketbooking.mn</div>
          <div>+976 1234-567</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



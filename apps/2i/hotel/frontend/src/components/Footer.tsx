import { Headphones, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white ">
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="flex  justify-between ">
          {/* left */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-black inline-block" />
              <span className="font-semibold">Pedia</span>
            </div>
            <p className="text-sm text-neutral-600">© 2024 Booking Mongolia. All Rights Reserved.</p>

            {/* Accepted payment methods */}
            <div>
              <p className="text-xs text-neutral-500 mb-2">Accepted Payment Methods</p>
              <div className="flex items-center gap-3">
                <span className="h-6 w-10 rounded bg-neutral-100 border flex items-center justify-center text-[10px]">VISA</span>
                <span className="h-6 w-10 rounded bg-neutral-100 border flex items-center justify-center text-[10px]">MAST</span>
                <span className="h-6 w-10 rounded bg-neutral-100 border flex items-center justify-center text-[10px]">AMEX</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="text-sm space-y-2 text-neutral-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <div>
                  Email:
                  <br />
                  <a href="mailto:support@pedia.mn" className="text-blue-600 hover:underline">
                    support@pedia.mn
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <p>
                  Phone:
                  <br />
                  +976 (11) 123-4567
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4h*4" />
                <p>
                  Customer Support:
                  <br />
                  Available 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Follow us */}
          <div className="space-y-3">
            <h4 className="font-semibold">Follow us</h4>
            <ul className="text-sm space-y-2 text-neutral-700">
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Youtube
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="font-semibold">Policies</h4>
            <ul className="text-sm space-y-2 text-neutral-700">
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Other */}
          <div className="space-y-3">
            <h4 className="font-semibold">Other</h4>
            <ul className="text-sm space-y-2 text-neutral-700">
              <li>
                <a href="#" className="hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Travel guides
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

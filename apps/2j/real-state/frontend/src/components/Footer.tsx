import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RealEstate MN</h3>
            <p className="text-gray-300">
              Your trusted partner in finding the perfect home in Mongolia.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white transition duration-300">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Property Sales</li>
              <li>Property Rentals</li>
              <li>Property Management</li>
              <li>Investment Consulting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Ulaanbaatar, Mongolia</li>
              <li>+976 11 123 456</li>
              <li>info@realestatemn.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2024 RealEstate MN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
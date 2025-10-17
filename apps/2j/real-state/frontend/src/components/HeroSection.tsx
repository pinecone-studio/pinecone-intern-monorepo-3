import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Home in Mongolia
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover the best properties in Ulaanbaatar and beyond. Expert real estate services for buyers and sellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
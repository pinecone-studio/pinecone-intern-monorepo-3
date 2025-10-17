import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About RealEstate MN</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect home in Mongolia. We&apos;ve been helping families and individuals find their dream properties for over a decade.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2014, RealEstate MN has grown from a small local agency to become one of Mongolia&apos;s most trusted real estate companies. We understand the unique challenges and opportunities in the Mongolian property market.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team of experienced agents combines local knowledge with modern technology to provide exceptional service to our clients. Whether you&apos;re buying your first home or investing in commercial property, we&apos;re here to guide you every step of the way.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                To make property buying and selling in Mongolia simple, transparent, and successful for everyone.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Integrity in all transactions</li>
                <li>• Client satisfaction first</li>
                <li>• Local market expertise</li>
                <li>• Transparent communication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RealEstate MN?</h2>
            <p className="text-xl text-gray-600">We provide exceptional service and local expertise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Team</h3>
              <p className="text-gray-600">
                Our experienced agents have deep knowledge of the local market.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Service</h3>
              <p className="text-gray-600">
                Over 10 years of experience helping clients find their perfect homes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Results</h3>
              <p className="text-gray-600">
                Quick and efficient property transactions with modern technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
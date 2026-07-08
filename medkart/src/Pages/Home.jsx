
import { FaPills, FaTruck, FaHeadset } from "react-icons/fa";
import pharmacyImg from "../assets/pharmacy.jpg"; // Local image import

export default function Home() {
  return (
    <div className="bg-linear-to-br from-blue-50 to-cyan-50">
     

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center lg:items-center gap-12 py-16 lg:py-28">

          {/* Left Content */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
            <span className="inline-block px-5 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-bold tracking-wide">
              Online Pharmacy Service
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Your Trusted <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                Online Pharmacy
              </span>
            </h1>

            <p className="text-gray-600 text-lg max-w-lg">
              Order genuine medicines online and get fast home delivery.
              Trusted by thousands of families across the country.
            </p>

            <div className="flex gap-4 mt-4">
              <a
                href="/medicine"
                className="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
              >
                Buy Medicine
              </a>

              <a
                href="/contact"
                className="px-8 py-3 rounded-2xl border border-blue-500 text-blue-600 font-semibold transform transition duration-300 hover:bg-blue-50 hover:scale-105 hover:-translate-y-1"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:w-1/2 flex justify-center relative">
            <img
              src={pharmacyImg}
              alt="Online Pharmacy"
              className="w-full h-100 md:h-125 lg:h-[550px] object-cover rounded-3xl drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
            {/* Optional subtle floating background shapes */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-cyan-200 rounded-full opacity-30 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 md:px-16 pb-20 grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transform transition duration-300 hover:-translate-y-2">
          <FaPills className="text-blue-500 text-3xl mb-3" />
          <h3 className="font-bold text-lg mb-2">Genuine Medicines</h3>
          <p className="text-gray-600 text-sm">
            100% authentic medicines from trusted suppliers.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transform transition duration-300 hover:-translate-y-2">
          <FaTruck className="text-blue-500 text-3xl mb-3" />
          <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
          <p className="text-gray-600 text-sm">
            Quick and safe delivery right at your doorstep.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transform transition duration-300 hover:-translate-y-2">
          <FaHeadset className="text-blue-500 text-3xl mb-3" />
          <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
          <p className="text-gray-600 text-sm">
            Our support team is always ready to help you.
          </p>
        </div>
      </section>
    </div>
  );
}

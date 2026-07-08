import { FaUsers, FaShieldAlt, FaClock } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="bg-linear-to-br from-blue-50 to-cyan-50 min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-16 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          About <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">MedKart</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your trusted partner in healthcare. We are committed to providing genuine medicines, fast delivery, and exceptional customer service to ensure your well-being.
        </p>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-6 md:px-16 pb-20">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Founded in 2020, MedKart emerged from a vision to revolutionize the way people access healthcare. We recognized the challenges in obtaining genuine medicines and the need for a reliable online pharmacy service.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Today, we serve thousands of customers across the country, delivering authentic medications right to their doorsteps. Our commitment to quality, safety, and customer satisfaction drives everything we do.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 md:px-16 pb-20 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            To provide accessible, affordable, and authentic healthcare solutions through our online pharmacy platform, ensuring every customer has access to the medicines they need without compromise on quality or safety.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600 leading-relaxed">
            To become the leading online pharmacy in the region, setting the standard for digital healthcare services and making quality medications available to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-6 md:px-16 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose MedCart?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transform transition duration-300 hover:-translate-y-2 text-center">
            <FaShieldAlt className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h4 className="font-bold text-xl mb-3">Quality Assurance</h4>
            <p className="text-gray-600">
              All medicines are sourced from licensed manufacturers and undergo rigorous quality checks.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transform transition duration-300 hover:-translate-y-2 text-center">
            <FaClock className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h4 className="font-bold text-xl mb-3">Fast Delivery</h4>
            <p className="text-gray-600">
              Same-day delivery in major cities and express shipping across the country.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transform transition duration-300 hover:-translate-y-2 text-center">
            <FaUsers className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h4 className="font-bold text-xl mb-3">Expert Support</h4>
            <p className="text-gray-600">
              Our pharmacists and customer service team are available 24/7 to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="container mx-auto px-6 md:px-16 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">A</span>
            </div>
            <h4 className="font-bold text-xl mb-2">Amanot</h4>
            <p className="text-blue-600 mb-3">CEO & Founder</p>
            <p className="text-gray-600 text-sm">
              Passionate about healthcare innovation and improving access to quality medicines.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-24 h-24 bg-cyan-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-600">M</span>
            </div>
            <h4 className="font-bold text-xl mb-2">Maruf</h4>
            <p className="text-cyan-600 mb-3">Chief Pharmacist</p>
            <p className="text-gray-600 text-sm">
              Licensed pharmacist with 10+ years of experience in pharmaceutical services.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">D</span>
            </div>
            <h4 className="font-bold text-xl mb-2">Daniel</h4>
            <p className="text-purple-600 mb-3">Operations Manager</p>
            <p className="text-gray-600 text-sm">
              Ensures smooth operations and timely delivery of all orders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

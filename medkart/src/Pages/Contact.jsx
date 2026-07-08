import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="bg-sky-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700">Contact Us</h1>
          <p className="text-gray-600 mt-3">
            We’d love to hear from you. Please reach out using the form below.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow">

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">
              Get in Touch
            </h2>

            <div className="space-y-5 text-gray-700">
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-blue-600" />
                <span>+880 1XXXXXXXXX</span>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-blue-600" />
                <span>medkart@gmail.com</span>
              </div>

              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-blue-600" />
                <span>Cumilla, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

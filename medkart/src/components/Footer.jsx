import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      {/* Top section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">

          {/* Payment section */}
          <div>
            <h4 className="font-semibold text-gray-800 border-b-2 border-blue-500 inline-block mb-4">
              Pay with
            </h4>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <img src="https://i.pinimg.com/originals/38/2f/0a/382f0a8cbcec2f9d791702ef4b151443.png" alt="Mastercard" className="h-8 w-auto" />
              <img src="https://i.pinimg.com/originals/5f/79/a6/5f79a6defe837d721dd2e3b2dba041e1.png" alt="Visa" className="h-8 w-auto" />
              <img src="https://tse1.mm.bing.net/th/id/OIP.HXBSuyFxKOM8VRwn9EdU1gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="bKash" className="h-8 w-auto" />
              <img src="https://tse1.mm.bing.net/th/id/OIP.wLyq2cYesC71gX9ITa84qgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Nagad" className="h-8 w-auto" />
              <img src="https://tse2.mm.bing.net/th/id/OIP.UubILEYQ4YRmMntP3jfKYgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Rocket" className="h-8 w-auto" />
            </div>
          </div>

          {/* Social links */}
          <div>
            <h4 className="font-semibold text-gray-800 border-b-2 border-blue-500 inline-block mb-4">
              Social Links
            </h4>
            <div className="flex gap-3 mt-3">
              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:scale-110 transition">
                <FaFacebookF />
              </a>

              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:scale-110 transition">
                <FaYoutube />
              </a>
              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:scale-110 transition">
                <FaLinkedinIn />
              </a>
              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white hover:scale-110 transition">
                <FaWhatsapp />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm gap-3">
          <div className="flex gap-4 flex-wrap">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span className="cursor-pointer hover:underline">Returns Policy</span>
            <span className="cursor-pointer hover:underline">Terms & Conditions</span>
          </div>

          

          <div>© Copyright 2025. All Rights Reserved</div>
        </div>
      </div>
    </footer>
  );
}

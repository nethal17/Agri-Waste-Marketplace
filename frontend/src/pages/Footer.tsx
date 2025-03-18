"use client"
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-bold text-green-600">Waste2Wealth</h2>
          <p className="text-white mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A odio non nemo
            veniam, natus accusantium. Praesentium, doloribus mollitia dignissimos.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-green-600 transition">
              <FaWhatsapp className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-green-600 transition">
              <FaFacebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-green-600 transition">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-green-600 transition">
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-600">Our Services</h3>
          <ul className="mt-2 space-y-2 text-white">
            <li><a href="#" className="hover:text-green-600">Buy Products</a></li>
            <li><a href="#" className="hover:text-green-600">Sell Products</a></li>
            <li><a href="#" className="hover:text-green-600">Transport Services</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-600">Support</h3>
          <ul className="mt-2 space-y-2 text-white">
            <li><a href="#" className="hover:text-green-600">Contact Us</a></li>
            <li><a href="#" className="hover:text-green-600">About Us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

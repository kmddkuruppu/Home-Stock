import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaFacebookF, FaTwitter, FaGooglePlusG } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { TbSend } from 'react-icons/tb';

const Footer = () => {
  return (
    <footer className="bg-[#151414] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-orange-500 text-2xl mt-1" />
            <div>
              <h4 className="text-lg font-semibold">Find us</h4>
              <span className="text-gray-400 text-sm">1010 Avenue, sw 54321, Chandigarh</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaPhone className="text-orange-500 text-2xl mt-1" />
            <div>
              <h4 className="text-lg font-semibold">Call us</h4>
              <span className="text-gray-400 text-sm">9876543210 0</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FiMail className="text-orange-500 text-2xl mt-1" />
            <div>
              <h4 className="text-lg font-semibold">Mail us</h4>
              <span className="text-gray-400 text-sm">mail@info.com</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <div>
            <img src="https://i.ibb.co/QDy827D/ak-logo.png" alt="Logo" className="mb-4 max-w-[200px]" />
            <p className="text-gray-400 text-sm leading-7 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div>
              <span className="text-lg font-bold mb-4 block">Follow us</span>
              <div className="flex gap-4">
                <a href="#" className="bg-[#3B5998] p-2 rounded-full text-white"><FaFacebookF /></a>
                <a href="#" className="bg-[#55ACEE] p-2 rounded-full text-white"><FaTwitter /></a>
                <a href="#" className="bg-[#DD4B39] p-2 rounded-full text-white"><FaGooglePlusG /></a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-12 after:h-0.5 after:bg-orange-500">Useful Links</h3>
            <ul className="flex flex-wrap gap-y-2">
              {['Home','about','services','portfolio','Contact','About us','Our Services','Expert Team','Contact us','Latest News'].map((link, index) => (
                <li key={index} className="w-1/2 text-sm text-gray-400 hover:text-orange-500 capitalize">
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-12 after:h-0.5 after:bg-orange-500">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">Don’t miss to subscribe to our new feeds, kindly fill the form below.</p>
            <form className="relative">
              <input
                type="text"
                placeholder="Email Address"
                className="w-full p-3 bg-[#2E2E2E] border border-[#2E2E2E] text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-orange-500 hover:bg-orange-600"
              >
                <TbSend className="text-white text-xl" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <p className="text-center md:text-left mb-4 md:mb-0">&copy; 2025, All Rights Reserved <a href="https://codepen.io/anupkumar92/" className="text-orange-500">Anup</a></p>
          <ul className="flex justify-center md:justify-end gap-4">
            {['Home','Terms','Privacy','Policy','Contact'].map((item, index) => (
              <li key={index} className="hover:text-orange-500">
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

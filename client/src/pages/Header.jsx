import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const toggleCountrySelect = () => {
    setIsCountrySelectOpen(!isCountrySelectOpen);
  };

  return (
    <div>

      <div className=" w-full bg-purple-800">
        <div className="max-w-screen-xl mx-auto px-4">
      
          <div className="hidden lg:flex items-center justify-between py-4">
            <a href="#" className="text-white text-xl font-semibold">Online Shopping</a>
            <div className="flex items-center space-x-6">
              <a href="/welcome" className="text-white hover:bg-purple-600 px-4 py-2 rounded">Home</a>
              <a href="/products" className="text-white hover:bg-purple-600 px-4 py-2 rounded">Products</a>
              <a href="/Allpayment" className="text-white hover:bg-purple-600 px-4 py-2 rounded">All Payments</a>
              <a href="/AddpreOrder" className="text-white hover:bg-purple-600 px-4 py-2 rounded">Add Re-order</a>
              <a href="/AllpreOrder" className="text-white hover:bg-purple-600 px-4 py-2 rounded">View All Re-orders</a>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow">
  <a href="/" className="block w-full h-full">Logout</a>
</button>

              

              
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden flex justify-between items-center py-4">
            <a href="#" className="text-white text-xl font-semibold">Online Store</a>
            <button onClick={toggleMenu} className="text-white">
              <i className="content icon"></i>
            </button>
          </div>
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="bg-purple-800 text-white p-4 space-y-4">
                <div className="space-y-2">
                  <a href="#" className="block px-4 py-2 hover:bg-purple-600 rounded">Home</a>
                  <a href="#" className="block px-4 py-2 hover:bg-purple-600 rounded">About</a>
                  <a href="#" className="block px-4 py-2 hover:bg-purple-600 rounded">Contact</a>
                </div>
                
              </div>
            </div>
          )}
        </div>
      </div>
      {/* End: Navbar */}

      {/* Content Section */}
      <br/> 
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="bg-gray-200 p-8 rounded-md shadow-md">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">Welcome to Our Exclusive Collection!</h1>
          <p className="text-lg text-gray-700 mb-4">Explore our carefully curated selection of premium products, each crafted with quality and attention to detail. Whether you're looking for a delicious treat or a special gift, you're sure to find something that suits your taste. Browse through our items, add them to your cart, and enjoy an effortless shopping experience.</p>
          <p className="text-lg text-gray-700 mb-4">To see the difference between static and fixed top navbars, just scroll.</p>
          <a href="#" className="bg-purple-800 text-white py-2 px-6 rounded-md">Happy shopping! &raquo;</a>
        </div>
      </div>
    </div>
  );
};

export default Header;

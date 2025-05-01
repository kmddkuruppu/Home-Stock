import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentCheckout = () => {
  const location = useLocation();
  const { cartItems = [], totalAmount = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    paymentMethod: "card",
    cardNumber: "",
    cardCVC: "",
    cardExpiry: "",
    date:"",
    phone:"",
    termsAccepted: false,
  });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if ((name === 'cardNumber' || name === 'cardCVC') && isNaN(value)) {
      toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} must be a number`);
      return;
    }
  
    if (name === 'fullName') {
      // Reject non-letter characters
      if (/[^a-zA-Z\s]/.test(value)) {
        toast.error('Full Name must contain only alphabetic characters');
        return;
      }
  
      // Check if each word starts with a capital letter
      const words = value.trim().split(' ');
      const allCapitalized = words.every(
        (word) => word.length > 0 && word[0] === word[0].toUpperCase()
      );
  
      if (!allCapitalized && value !== "") {
        toast.error('Each word in Full Name must start with a capital letter');
        return;
      }
    }
  
    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        toast.error("Phone number must contain only numbers.");
        return;
      }
    }
  
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if(formData.cardNumber.length !== 16) {
      toast.error("card number must be exactly 16 digits.");
      return;
    }
    if(formData.cardCVC.length !== 3) {
      toast.error("card CVC must be exactly 3 digits.");
      return;
    }
    const payload = {
      ...formData,
      cartItems,
      totalAmount,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/addpayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        toast.success("Payment processed successfully!");
      } else {
        toast.error("Payment failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred.");
    }
  };

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Your Cart</h2>
            {cartItems.length > 0 ? (
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between bg-blue-50 p-3 rounded-lg text-gray-700"
                  >
                    <span className="font-medium">{item.item} × {formatNumbers(item.amount)}</span>
                    <span className="text-right font-semibold text-blue-800">Rs:{formatNumbers(item.price * item.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items in your cart</p>
            )}
            <div className="mt-6 text-xl text-right font-bold text-blue-900">
              Total: Rs:{formatNumbers(totalAmount)}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Payment Information</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="Card Number"
                required
                className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="cardCVC"
                  value={formData.cardCVC}
                  onChange={handleInputChange}
                  placeholder="CVC"
                  required
                  className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="Expiration Date"
                  required
                  className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="Date"
                  required
                  className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  required
                  className="w-full p-3 border border-blue-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>
              

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer/>
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar
        closeButton={false}
        toastClassName="custom-toast"  
      />
    </div>
    
  );
};

export default PaymentCheckout;

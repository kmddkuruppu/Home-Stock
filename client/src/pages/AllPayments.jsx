import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; 
import Header from "./Header";
import Footer from "./Footer";

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍  
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:5000/api/gettallpayment")
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error("Error fetching payments:", err));
  }, []);

  const handleView = (paymentId) => {
    navigate(`/single-payment/${paymentId}`); 
  };

  // Filtered payments based on the search query
  const filteredPayments = payments.filter((payment) =>
    payment.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">
          All Payments
        </h1>

        {/* 🔍 Search bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by full name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Payment Method</th>
                <th className="py-3 px-4 text-left">Card Number</th>
                <th className="py-3 px-4 text-left">CVC</th>
                <th className="py-3 px-4 text-left">Expiry</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-blue-50 border-b border-blue-100">
                  <td className="py-3 px-4">{payment.fullName}</td>
                  <td className="py-3 px-4 capitalize">{payment.paymentMethod}</td>
                  <td className="py-3 px-4">***</td>
                  <td className="py-3 px-4">***</td>
                  <td className="py-3 px-4">{payment.cardExpiry}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleView(payment._id)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No payment records found.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllPayments;

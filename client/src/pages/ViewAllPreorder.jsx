import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";
import Footer from "./Footer";

const ViewAllPreorder = () => {
  const [preorders, setPreorders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search query

  useEffect(() => {
    const fetchPreOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/preorder/getAll-order"); 
        setPreorders(res.data);
        toast.success("Preorders fetched successfully!");
      } catch (err) {
        console.error("Failed to fetch preorders", err);
      }
    };
    fetchPreOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this preorder?")) {
      try {
        await axios.delete(`http://localhost:5000/api/preorder/deleteOrder/${id}`);
        setPreorders(preorders.filter((order) => order._id !== id));
        toast.success("Preorder deleted successfully!");
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete preorder");
      }
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/updateorder/${id}`;
  };

  // 🔍 Filtered preorders
  const filteredPreorders = preorders.filter((order) =>
    order.fullname.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">All reOrders</h2>

        {/* 🔍 Search input */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by full name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Expected Date</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPreorders.map((order) => (
                <tr key={order._id} className="text-center border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{order.fullname}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">{order.productname}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.expecteddate}</td>
                  <td className="px-4 py-2">{order.notes || "-"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(order._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPreorders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No matching preorders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
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

export default ViewAllPreorder;

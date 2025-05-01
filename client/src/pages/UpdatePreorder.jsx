import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePreorder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    productname: "",
    quantity: "",
    expecteddate: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPreorder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/preorder/SinglePreorder/${id}`);
        setForm(res.data);
        toast.success("Preorder data fetched successfully!");
      } catch (error) {
        console.error("Failed to fetch preorder data", error);
        toast.error("Failed to fetch preorder data");
      }
    };

    fetchPreorder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/preorder/update-order/${id}`, form);
      toast.success("Preorder updated successfully!");
      navigate("/AllpreOrder");
    } catch (error) {
      console.error("Failed to update preorder", error);
      toast.error("Failed to update preorder");
    }
  };

  return (
    <div>
      <Header/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Update reOrder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullname" value={form.fullname} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" required />
          <input type="text" name="productname" value={form.productname} onChange={handleChange} placeholder="Product Name" className="w-full p-3 border rounded" required />
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full p-3 border rounded" required />
          <input type="date" name="expecteddate" value={form.expecteddate} onChange={handleChange} className="w-full p-3 border rounded" required />
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional Notes" rows={3} className="w-full p-3 border rounded" />

          <div className="flex justify-between">
            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Update</button>
            <button type="button" onClick={() => navigate("/allpreorders")} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <ToastContainer 
                position="top-center" 
                autoClose={5000} 
                hideProgressBar
                closeButton={false}
                toastClassName="custom-toast"  
              />
    <Footer/>
    </div>
  );
};

export default UpdatePreorder;

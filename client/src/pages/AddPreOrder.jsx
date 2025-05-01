import React, { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPreOrder = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    productname: '',
    quantity: '',
    expecteddate: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
  

    if (name === 'quantity' && isNaN(value)) {
      toast.error('Quantity must be a number');
      return;
    }
  //ertyy
    
    if ((name === 'fullname' || name === 'productname') && /[^a-zA-Z\s]/.test(value)) {
      toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} must contain only letters`);
      return;
    }

    if ((name === 'fullname' || name === 'productname') && value.length === 1 && value[0] !== value[0].toUpperCase()) {
      toast.error(`The first letter of ${name === 'fullname' ? 'Full Name' : 'Product Name'} must be capitalized`);
      return;
    }
  
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }
  
    if (!/^[a-zA-Z\s]+$/.test(formData.fullname)) {
      toast.error('Full Name must contain only letters');
      setLoading(false);
      return;
    }
  
    if (!/^[a-zA-Z\s]+$/.test(formData.productname)) {
      toast.error('Product Name must contain only letters');
      setLoading(false);
      return;
    }
  
    if (isNaN(formData.quantity)) {
      toast.error('Quantity must be a number');
      setLoading(false);
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/api/preorder/addPre-order', formData);
      setSuccessMsg(res.data.message);
      toast.success(res.data.message);
      setFormData({
        fullname: '',
        email: '',
        productname: '',
        quantity: '',
        expecteddate: '',
        notes: ''
      });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Header/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 p-6">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Add reorder</h2>

        {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Product Name</label>
            <input
              type="text"
              name="productname"
              value={formData.productname}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Expected Date</label>
            <input
              type="date"
              name="expecteddate"
              value={formData.expecteddate}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {loading ? 'Submitting...' : 'Submit Preorder'}
          </button>
        </form>
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

export default AddPreOrder;

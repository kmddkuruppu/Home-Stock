import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const passwordRegex = /^(?=.*\d).{6,}$/; // At least 6 characters, includes a digit
  
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 6 characters and include a number.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/User/user-register', formData);
      toast.success('Registration successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-4xl font-bold mb-6 text-center text-purple-300">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 lowercase"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition duration-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <a href="/" className="text-purple-400 hover:underline">Login</a>
        </p>
      </div>

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar 
        closeButton={false} 
      />
    </div>
  );
};

export default Register;

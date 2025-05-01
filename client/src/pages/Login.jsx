import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/User/user-login', formData);
      toast.success('Login successful!');
      
      // Navigate to welcome page after short delay
      setTimeout(() => {
        navigate('/welcome');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-4xl font-bold mb-6 text-center text-purple-300">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{' '}
          <a href="/register" className="text-purple-400 hover:underline">
            Register
          </a>
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

export default Login;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }
        
        // Set authorization header
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Fetch user data from your API
        const response = await axios.get('http://localhost:8070/user/register/me', config);
        setUser(response.data);
        setEditedUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data. Please try again.');
        setLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.put('/api/auth/update', editedUser, config);
      setUser(response.data.data);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
      console.error('Error updating profile:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect to login page or home page
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center text-3xl text-gray-600 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-gray-700">Display Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                className="w-1/2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
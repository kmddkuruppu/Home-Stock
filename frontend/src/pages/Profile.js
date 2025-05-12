import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

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
        
        // Fetch user data from the correct API endpoint
        const response = await axios.get('http://localhost:8070/auth/me', config);
        
        // Assuming the response structure might be different based on your API
        // Adjust this part according to your actual API response structure
        const userData = response.data.user || response.data;
        
        setUser(userData);
        setEditedUser(userData);
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
      
      // Update profile using the correct endpoint
      const response = await axios.put('http://localhost:8070/auth/update-profile', editedUser, config);
      
      // Adjust based on your actual API response structure
      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      setIsEditing(false);
      setLoading(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
      console.error('Error updating profile:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
  };

  // Handle redirect to registration page if not logged in
  const handleRedirectToRegister = () => {
    window.location.href = '/register';
  };

  // Loading component with themed styling
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex justify-center items-center">
        <FloatingParticles />
        <div className="relative z-10 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  // Error component with themed styling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex justify-center items-center p-4">
        <FloatingParticles />
        <div className="relative z-10 max-w-md w-full mx-auto">
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden border border-purple-500/30">
            <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 p-6">
              <h2 className="text-2xl font-bold text-white">User Profile</h2>
            </div>
            <div className="p-6">
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
              <button
                onClick={handleRedirectToRegister}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white p-4 flex items-center justify-center">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Main content with higher z-index */}
      <div className="relative z-10 max-w-md w-full mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden border border-purple-500/30">
          <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">User Profile</h2>
              <button
                onClick={handleLogout}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded shadow-md hover:bg-white/20 transition duration-300 border border-white/20"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-indigo-600/50 to-purple-600/50 rounded-full w-24 h-24 flex items-center justify-center text-3xl text-white font-bold shadow-lg border border-indigo-400/30">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-indigo-900/30 border border-indigo-500/30">
                    <span className="text-indigo-300 w-24">Name:</span>
                    <span className="font-medium text-white">{user.name || 'Not set'}</span>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-indigo-900/30 border border-indigo-500/30">
                    <span className="text-indigo-300 w-24">Email:</span>
                    <span className="font-medium text-white">{user.email || 'Not set'}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-indigo-300">Display Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-indigo-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-indigo-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-indigo-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg"
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
                    className="w-1/2 bg-gray-700/50 text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
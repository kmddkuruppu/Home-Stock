import { useState, useEffect } from "react";

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

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch current user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8070/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Assuming token is stored in localStorage
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - redirect to login
            window.location.href = "/login";
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        
        setUser(userData.data);
        setFormData({
          name: userData.data.name,
          email: userData.data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        // Redirect to login after 3 seconds if there's an error
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      // Update profile information (name and email)
      const profileResponse = await fetch('http://localhost:8070/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // If password fields are filled, update password
      if (formData.currentPassword && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          return setMessage({ type: "error", text: "New passwords don't match" });
        }
        
        const passwordResponse = await fetch('http://localhost:8070/auth/updatepassword', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          throw new Error(errorData.message || 'Failed to update password');
        }
      }

      // Fetch updated user data
      const updatedUserResponse = await fetch('http://localhost:8070/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!updatedUserResponse.ok) {
        throw new Error('Failed to fetch updated user data');
      }

      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData.data);
      
      setMessage({ type: "success", text: "Profile updated successfully" });
      setIsEditing(false);
      
      // Reset password fields
      setFormData(prevState => ({
        ...prevState,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile"
      });
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    console.log("Logging out...");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center">
        <FloatingParticles />
        <div className="relative z-10">
          <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center">
        <FloatingParticles />
        <div className="relative z-10 text-center">
          <div className="bg-red-500/20 p-6 rounded-lg backdrop-blur-md">
            <p className="text-xl">{error}</p>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
      <FloatingParticles />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header with logout */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              My Profile
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
          
          {/* Profile Card */}
          <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 shadow-xl border border-white/10">
            {message.text && (
              <div className={`mb-4 p-3 rounded-md ${message.type === "error" ? "bg-red-500/20" : "bg-green-500/20"}`}>
                {message.text}
              </div>
            )}
            
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-indigo-300 text-sm">Name</p>
                      <p className="text-xl">{user?.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-indigo-300 text-sm">Email</p>
                      <p className="text-xl">{user?.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-indigo-300 text-sm">Role</p>
                      <p className="text-xl capitalize">{user?.role}</p>
                    </div>
                    
                    <div>
                      <p className="text-indigo-300 text-sm">Member Since</p>
                      <p className="text-xl">{new Date(user?.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="text-indigo-300 text-sm">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 mt-1 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="text-indigo-300 text-sm">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 mt-1 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <h3 className="text-xl font-semibold mb-3">Change Password</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="currentPassword" className="text-indigo-300 text-sm">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 mt-1 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="text-indigo-300 text-sm">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 mt-1 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="text-indigo-300 text-sm">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 mt-1 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-1/2 py-3 rounded-md bg-gray-600/50 hover:bg-gray-600/70 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="w-1/2 py-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
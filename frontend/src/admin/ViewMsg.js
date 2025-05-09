// Import useEffect for API calls when component mounts
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Mail, 
  User, 
  Calendar, 
  Clock,
  Search,
  Filter,
  ChevronDown,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";

const ContactMessages = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1, 
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // State for messages and UI
  const [contacts, setContacts] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, read, unread
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contact messages
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8070/contact/');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setContacts(result.data.map(contact => ({
          ...contact,
          read: contact.read || false // Ensure read property exists
        })));
      } else {
        throw new Error(result.message || 'Failed to fetch contacts');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchContacts();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filter contacts based on search and filter status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "read") return matchesSearch && contact.read;
    if (filterStatus === "unread") return matchesSearch && !contact.read;
    
    return matchesSearch;
  });

  // Handle message selection
  const handleSelectMessage = (contact) => {
    setSelectedMessage(contact);
    // Mark as read
    if (!contact.read) {
      setContacts(contacts.map(c => 
        c._id === contact._id ? {...c, read: true} : c
      ));
      
      // Update read status in database (assuming you have an API endpoint for this)
      updateReadStatus(contact._id, true);
    }
  };

  // Update read status in database
  const updateReadStatus = async (id, readStatus) => {
    try {
      // This is where you would make an API call to update read status
      // You'll need to implement this endpoint in your Express app
      // Example:
      // await fetch(`http://localhost:8070/contact/${id}/read`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ read: readStatus }),
      // });
      
      // For now, we'll just update the local state
      console.log(`Status update for message ${id}: ${readStatus ? 'read' : 'unread'}`);
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (id) => {
    try {
      // Here you would make an API call to delete the message
      // Example:
      // await fetch(`http://localhost:8070/contact/${id}`, {
      //   method: 'DELETE',
      // });
      
      // For now, just update local state
      setContacts(contacts.filter(contact => contact._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Handle mark as read/unread
  const toggleReadStatus = (id) => {
    const contact = contacts.find(c => c._id === id);
    const newReadStatus = !contact.read;
    
    setContacts(contacts.map(contact => 
      contact._id === id ? {...contact, read: newReadStatus} : contact
    ));
    
    if (selectedMessage && selectedMessage._id === id) {
      setSelectedMessage({...selectedMessage, read: newReadStatus});
    }
    
    // Update in database
    updateReadStatus(id, newReadStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 right-0 text-blue-500/10 text-9xl font-bold select-none z-0"
          >
            MESSAGES
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center"
          >
            HOME STOCK PRO
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Contact Messages
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"
          />
        </div>
      </div>
      
      {/* Messages Interface */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Toolbar */}
          <div className="bg-gray-800/50 p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative inline-block">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent text-gray-300 appearance-none focus:outline-none cursor-pointer pr-8"
                  >
                    <option value="all">All</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                  </select>
                  <ChevronDown size={16} className="text-gray-400 absolute right-3" />
                </div>
              </div>
              
              <button 
                onClick={handleRefresh}
                className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2 border border-gray-700"
              >
                <RefreshCw size={20} className={`text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row h-[calc(100vh-300px)]">
            {/* Messages List */}
            <div className="w-full lg:w-1/3 border-r border-gray-800 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw size={32} className="text-blue-400 animate-spin" />
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-400">
                  <XCircle size={32} className="mx-auto mb-2 opacity-70" />
                  <p>Error loading messages: {error}</p>
                  <button 
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, idx) => (
                      <motion.div 
                        key={contact._id}
                        variants={fadeIn}
                        custom={idx}
                        onClick={() => handleSelectMessage(contact)}
                        className={`p-4 border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer transition-colors ${selectedMessage && selectedMessage._id === contact._id ? 'bg-gray-800/50' : ''} ${!contact.read ? 'border-l-4 border-l-blue-500' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/10 rounded-full p-2 mr-3">
                              <User size={20} className="text-blue-400" />
                            </div>
                            <div>
                              <h3 className={`font-medium ${!contact.read ? 'text-white' : 'text-gray-300'}`}>{contact.fullName}</h3>
                              <p className="text-sm text-gray-400">{contact.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(contact.createdAt)}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-400 line-clamp-2">{contact.message}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                      <p>No messages found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Message Detail */}
            <div className="w-full lg:w-2/3 bg-gray-900/30 flex flex-col">
              {selectedMessage ? (
                <>
                  {/* Message Header */}
                  <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-medium text-white flex items-center gap-2">
                        {selectedMessage.fullName}
                        {selectedMessage.read ? 
                          <CheckCircle size={16} className="text-green-500" /> : 
                          <XCircle size={16} className="text-blue-500" />
                        }
                      </h2>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="text-sm text-gray-400 flex items-center">
                          <Mail size={14} className="mr-1" /> {selectedMessage.email}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar size={14} className="mr-1" /> {formatDate(selectedMessage.createdAt)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock size={14} className="mr-1" /> {formatTime(selectedMessage.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleReadStatus(selectedMessage._id)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                      >
                        {selectedMessage.read ? 
                          <XCircle size={20} className="text-gray-400 hover:text-blue-500" /> :
                          <CheckCircle size={20} className="text-gray-400 hover:text-green-500" />
                        }
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(selectedMessage._id)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={20} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-800 shadow-lg">
                      <div className="flex items-center mb-4">
                        <MessageSquare size={20} className="text-blue-400 mr-2" />
                        <h3 className="text-lg font-medium text-blue-400">Message</h3>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-6 border-t border-gray-800 bg-gray-900/30">
                    <div className="flex justify-end space-x-4">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-medium border border-gray-700 transition-colors"
                      >
                        Reply
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20"
                      >
                        Mark Resolved
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <MessageSquare size={48} className="mb-4 opacity-30" />
                  <h3 className="text-xl font-medium mb-2">No message selected</h3>
                  <p className="max-w-md text-gray-500">Select a message from the list to view its details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-medium mb-2 text-blue-400">Total Messages</h3>
            <p className="text-3xl font-bold">{contacts.length}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-medium mb-2 text-green-400">Read</h3>
            <p className="text-3xl font-bold">{contacts.filter(c => c.read).length}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-medium mb-2 text-blue-400">Unread</h3>
            <p className="text-3xl font-bold">{contacts.filter(c => !c.read).length}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
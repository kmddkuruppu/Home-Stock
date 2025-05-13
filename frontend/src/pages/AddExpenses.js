import { useState } from 'react';
import { Calendar, Clock, DollarSign, ShoppingBag, Store, Tag, CreditCard, Clipboard, Flag, Check } from 'lucide-react';

export default function AddExpenseForm() {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    price: '',
    quantity: 1,
    purchasedDate: new Date().toISOString().split('T')[0],
    purchasedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    store: '',
    notes: '',
    priority: 'Medium',
    paymentMethod: 'Cash',
    status: 'Completed'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate total price
    const totalPrice = parseFloat(formData.price) * parseInt(formData.quantity);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after success message
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          itemName: '',
          category: '',
          price: '',
          quantity: 1,
          purchasedDate: new Date().toISOString().split('T')[0],
          purchasedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          store: '',
          notes: '',
          priority: 'Medium',
          paymentMethod: 'Cash',
          status: 'Completed'
        });
      }, 2000);
    }, 1000);
  };

  const categories = [
    'Groceries', 'Electronics', 'Clothing', 'Home', 'Transportation', 
    'Entertainment', 'Health', 'Education', 'Utilities', 'Other'
  ];

  // Floating particles background
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white p-6 relative">
      <FloatingParticles />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
            Add New Expense
          </h1>
          <p className="text-indigo-200 mt-2">Track your purchases and manage your budget</p>
        </div>
        
        {/* Form Card */}
        <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-indigo-500/20 p-6 transition-all duration-300 hover:shadow-indigo-500/10">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <div className="bg-green-500/20 p-4 rounded-full mb-4">
                <Check className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-green-400 mb-2">Expense Added!</h2>
              <p className="text-indigo-200">Your expense has been successfully recorded</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two column layout for smaller inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="col-span-full">
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Item Name</span>
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <Tag className="h-4 w-4" />
                    <span>Category</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Store */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <Store className="h-4 w-4" />
                    <span>Store</span>
                  </label>
                  <input
                    type="text"
                    name="store"
                    value={formData.store}
                    onChange={handleChange}
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Where did you purchase?"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Price</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Quantity</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </label>
                  <input
                    type="date"
                    name="purchasedDate"
                    value={formData.purchasedDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Time</span>
                  </label>
                  <input
                    type="time"
                    name="purchasedTime"
                    value={formData.purchasedTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Mobile Payment">Mobile Payment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <Flag className="h-4 w-4" />
                    <span>Priority</span>
                  </label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(priority => (
                      <label 
                        key={priority}
                        className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all ${
                          formData.priority === priority 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-800/40 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {priority}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="col-span-full">
                  <label className="flex items-center gap-2 text-indigo-300 mb-2">
                    <Clipboard className="h-4 w-4" />
                    <span>Notes</span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-gray-800/60 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Add any additional notes..."
                  ></textarea>
                </div>
              </div>

              {/* Total calculation display */}
              {formData.price && formData.quantity && (
                <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-300">Total Amount:</span>
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      ${(parseFloat(formData.price) * parseInt(formData.quantity)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full relative overflow-hidden rounded-lg py-4 px-6 font-medium transition-all
                    ${isSubmitting 
                      ? 'bg-indigo-800/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-600/30'
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-5 w-5" />
                        <span>Add Expense</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Form footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Add your expenses to track your spending habits and manage your budget efficiently.</p>
        </div>
      </div>
    </div>
  );
}
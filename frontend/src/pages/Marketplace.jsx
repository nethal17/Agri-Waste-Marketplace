import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

export const Marketplace = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchWasteItems();
  }, []);

  const fetchWasteItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/marketplace/waste-type/Organic%20Waste');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch waste items');
      }

      setWasteItems(response.data.data);
    } catch (error) {
      console.error('Error fetching waste items:', error);
      setError(error.message);
      toast.error('Failed to load waste items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (waste) => {
    try {
      setAddingToCart(true);
      // Add to cart logic here
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold">Error loading waste items</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <Link to="/cart">
        <div className="fixed top-20 right-8 z-10">
          <FaShoppingCart size={35} className="text-green-600 cursor-pointer hover:text-green-700" />
        </div>
      </Link>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Organic Waste Marketplace</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wasteItems.length > 0 ? (
            wasteItems.map((waste) => (
              <div key={waste._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image Section */}
                <div className="h-48 overflow-hidden">
                  {waste.image ? (
                    <img 
                      src={waste.image} 
                      alt={waste.wasteItem}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{waste.wasteItem}</h2>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Category:</span> {waste.wasteCategory}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Type:</span> {waste.wasteType}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {waste.location.city}, {waste.location.district}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Quantity:</span> {waste.quantity} kg
                    </p>
                    <p className="text-green-600 font-semibold">
                      <span className="font-medium">Price:</span> Rs.{waste.price}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Expires:</span> {new Date(waste.expireDate).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-gray-700 mb-4">{waste.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Seller: {waste.farmer.name}</p>
                      <p>Contact: {waste.farmer.phone}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(waste)}
                      disabled={addingToCart}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                        addingToCart 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No waste items available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 